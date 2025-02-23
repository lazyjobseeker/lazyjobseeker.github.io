---
title: "Building Interactive Dashboard using Bokeh"
category: programming
tags:
  - python
  - dashboard
  - bokeh
created_at: 2025-02-18 08:47:45 -05:00
last_modified_at: 2025-02-21 03:58:30 -05:00
excerpt: How to build interactive web dashboard using python library bokeh
published: true
---

## Introduction

Recently I had a chance to engage in a project where I was requested to analyze the outputs from power control system.  Firstly I delivered `matplotlib` based figures, and later the main device of work was changed to Excel for facilitating communication.

I wanted to provide insights with interactive dashboard, at least before the team finally work with spreadsheet for final product.  I have used `matplotlib`'s user interactive widgets before but recently found `bokeh` is a great library for dashboard generation and distribution.

Up to now, at least for me, the most intriguing feature of `bokeh` is that I can build a standalone `html` file which can be opened in anyone's computer in my team.  Besides this there are whole bunch of features.  You can find great demos in [**the library's official website**](https://demo.bokeh.org/) so you will never struggle in using it even for the first time.  Rather than explaining every single features you can find in the site, I would like to drill some points where I had to struggle a bit even with the official instructions.

## Preliminary Setup

Some set of code snippets which will occur frequently hereafter are going to be given in this section, with minimum explanation, to keep this post self-contained.

### Installation

```bash
pip install bokeh
```

### Demo Dataset

Let me use below custom-defined dataset for future examples.

```python
import pandas as pd

data = {'fruit': ['apple', 'banana', 'peach', 'grape'],
        'price': ['400', '100', '300', '100']}

df = pd.DataFrame(data)
```
### Weaving Dashboard Layout

```python
from bokeh.io import curdoc
from bokeh.layouts import row, column
from bokeh.models import ColumnDataSource, DataTable, TableColumn

source = ColumnDataSource(data=df)
columns = [
    TableColumn(field="fruit", title="Item", width=200),
    TableColumn(field="price", title="Price", width=200)
]

data_table = DataTable(source=source, columns=columns, width=500)
layout = column(data_table)

curdoc().add_root(layout)
```
{: file='exmple.py'}

### Serving Dashboard with Server

To run `bokeh` dashboard above with server, you can run following command in terminal.

```bash
bokeh serve --show example.py
```

{% include img-gdrive alt="Bokeh Dashboard with Server" id="15JmYkSwtQAO7UdOhks2Ha4Ey9N95-bAm" %}

### Serving Dashboard without Server

If you are to generate `html` file which can work as standalone dashboard whoever can access it without any python environment, you can add below lines at the end of `example.py` file.  When you run the python file, it generates `html` file with the name you passed in calling `output_file` method.  `curdoc` line is no more required in this case but the code will still work even if you do not remove that line.

```python
output_file("example.html", title="My bokeh example")
show(layout)
```

## Interactive Features using Callbacks

You can use callback functions and thereby serve your dashboard with interactive features.  There are many interactive features available and demos can be found in official website of `bokeh`.  On the top of above preliminary setup, here I would like to add a textbox and implement a search function where you can type some string and our dashboard filters out any records the fruit name of which does not include that input string.

### Layout

Let's start with adding a textbox where the user would punch in their input for query.

```python
from bokeh.io import curdoc
from bokeh.layouts import row, column
from bokeh.plotting import output_file, show
from bokeh.models import ColumnDataSource, DataTable, TableColumn, TextInput

source = ColumnDataSource(data=df)
columns = [
    TableColumn(field="fruit", title="Item", width=200),
    TableColumn(field="price", title="Price", width=200)
]

search = TextInput(title="Fruit Name Search")
data_table = DataTable(source=source, columns=columns, width=500)
layout = column(search, data_table)

curdoc().add_root(layout)

output_file("example.html", title="My bokeh example")
show(layout)
```
{: file='example.py'}

Once you run above file, it shall show below layout.  At this stage, you can run this either with `bokeh` command in terminal or `example.py` to build standalone `example.html` file.

{% include img-gdrive alt="Dashboard with Textbox" id="1oQmyN0lo8ytiUdU-U1DqL3HUTCK2uNB_" %}

But above dashboard does only show separate textbox and database.  To make it interactively do the search job for `item` field, you need to provide appropriate callback function which actually do that.  You can write callback functions both in `python` or `JavaScript` but using JS is unavoidable if you want to generate standalone html.

### Python Callbacks

You can define python callback function inside our `example.py` as in following example.

```python
from bokeh.io import curdoc
from bokeh.layouts import row, column
from bokeh.plotting import output_file, show
from bokeh.models import ColumnDataSource, DataTable, TableColumn, TextInput

source = ColumnDataSource(data=df)
columns = [
    TableColumn(field="fruit", title="Item", width=200),
    TableColumn(field="price", title="Price", width=200)
]

search = TextInput(title="Fruit Name Search")
data_table = DataTable(source=source, columns=columns, width=500)
layout = column(search, data_table)

def update():
    source.data = df[df['fruit'].str.contains(search.value)]
    print(source.data)

search.on_change('value', lambda attr, old, new: update())

curdoc().add_root(layout)
```
{: file='example_python_callback.py'}

  It is noticeable that in this case you cannot use `output_file` and `show` methods above which allowed us to generate standalone `html` file.  On the other words, you can use only `bokeh serve --show example.py` to run your dashboard above.  Then it will work for you to search through the `Item` column,

{% include img-gdrive alt="Search Result" id="174ia1xD0ENNkzUdSt9SqyThBv6wKEc1X" %}

but directly running the `example.py` script will not work for you but below will result.

```bash
You are generating standalone HTML/JS output, but trying to use real Python callbacks (i.e. with on_change or on_event). This combination cannot work.

Only JavaScript callbacks may be used with standalone output. For more information on JavaScript callbacks with Bokeh, see:
    https://docs.bokeh.org/en/latest/docs/user_guide/interaction/js_callbacks.html

Alternatively, to use real Python callbacks, a Bokeh server application may be used. For more information on building and running Bokeh applications, see:

    https://docs.bokeh.org/en/latest/docs/user_guide/server.html
```

### JavaScript Callbacks

If you still want to make sure you can generate above dashboard in the form of standalone `html` file and maintain the interactive substring search, you have to

- Import `CustomJS` from `bokeh.models`
- Replace `on_change` with `js_on_change`
- write callback function in `JavaScript` 
- and pass the `JS` callback as an argument of `js_on_change` function

Now the things go little bit tricky as you have to prepare JavaScript code which will do the search action in `html` file and pass it to your new callback which is an instance of `CustomJS`.  You need to know how to use the variables you defined in python code in the nested JS code to understand the code below.

```python
from bokeh.layouts import row, column
from bokeh.plotting import output_file, show
from bokeh.models import ColumnDataSource, DataTable, TableColumn, TextInput, CustomJS

source = ColumnDataSource(data=df)
backend = ColumnDataSource(data=df)
columns = [
    TableColumn(field="fruit", title="Item", width=200),
    TableColumn(field="price", title="Price", width=200)
]

search = TextInput(title="Fruit Name Search")
data_table = DataTable(source=source, columns=columns, width=500)
layout = column(search, data_table)

search_js = """
            let fruits = [];
            let prices = [];
            for (let i = 0; i < backend.data.fruit.length; i++) {
                if (String(backend.data.fruit[i]).includes(cb_obj.value)) {
                    fruits.push(backend.data.fruit[i]);
                    prices.push(backend.data.price[i]);
                }
            }
            source.data = { fruit: fruits,
                            price: prices }
            """
update = CustomJS(args=dict(source=source, backend=backend), code=search_js)

search.js_on_change('value', update)

output_file("example_jscb.html", title="My bokeh example")
show(layout)
```
{: file='example_customjs_callback.py'}

You can find this code generates `example_jscb.html` which can do the substring search for you.  Some remarks need to be made here:

- In the JavaScript code you write for the callback, you can access to the `ColumnDataSource` instances by their name in python code.  For example, there are objects named `source` and `backend` which we defined in python code.  For sure, these are not python objects but their mirrored clone in JavaScript language (I guess).
- `ColumnDataSource` object named `backend` was additionally defined.  This is to enable redoing the search result and restore original table.  If you have `source` only, you cannot retrieve your original database once a search is triggered to overwrite `source` instance.  As `source` is the only instance we can change to the table shown in our dashboard, being able to clone `source` into any new instance in JavaScript code cannot help resolving this issue[^1].

[^1] This statement is questionable.  Maybe we can clone `source` into new temporary instance and at least the cloned instance will be accessible until the browser closes.

## Using HTMLTemplateFormatter

Using `bokeh`, sometimes you may feel you want to provide specific styles, hyperlink or so in the elements of your dashboard.

For example, 

```python
import pandas as pd
from bokeh.layouts import row, column
from bokeh.plotting import output_file, show
from bokeh.models import ColumnDataSource, DataTable, TableColumn, TextInput, CustomJS, HTMLTemplateFormatter

data = {'fruit': ['apple', 'banana', 'peach', 'grape'],
        'price': ['400', '100', '300', '100'],
        'url': ['apple-site', 'banana-site', 'peach-site', 'grape-site']}

df = pd.DataFrame(data)

template = '<a href="<%= url %>"target="_blank"><%= value %></a>'
formatter = HTMLTemplateFormatter(template=template)

source = ColumnDataSource(data=df)
backend = ColumnDataSource(data=df)
columns = [
    TableColumn(field="fruit", title="Item", width=200, formatter=formatter),
    TableColumn(field="price", title="Price", width=200)
]

search = TextInput(title="Fruit Name Search")
data_table = DataTable(source=source, columns=columns, width=500)
layout = column(search, data_table)

search_js = """
            let fruits = [];
            let prices = [];
            for (let i = 0; i < backend.data.fruit.length; i++) {
                if (String(backend.data.fruit[i]).includes(cb_obj.value)) {
                    fruits.push(backend.data.fruit[i]);
                    prices.push(backend.data.price[i]);
                }
            }
            source.data = { fruit: fruits,
                            price: prices }
            """
update = CustomJS(args=dict(source=source, backend=backend), code=search_js)

search.js_on_change('value', update)

output_file("example_jscb_wlink.html", title="My bokeh example")
show(layout)
```
{: file='example-jscb-wlink.html'}

{% include img-gdrive alt="Search Result" id="1wV5iKD5Ki_xLIUvtYEXsmPgfZ3_TsjeO" %}

note that the links are intendedly directed to non-working paths so it is okay if you cannot see working website when you click the links.  The thing is `formatter` argument can be used in conjunction with `HTMLTemplateFormatter` to allow more variable styles in your dashboard.

When you look into `template` in above code, it can be seen that some variable names are wrapped with `<%= %>` wrapper.  This is following the syntax of [`underscorejs`](https://underscorejs.org/#).  As the source data we defined has `url` field, `HTMLTemplateFormatter` can access to that variable.  As `formatter` instance is being passed to `TableColumn` object whose field name is `fruit`, `<%= value %>` is replaced with the entries from `fruit` field.