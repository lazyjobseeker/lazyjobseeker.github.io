---
title: "보케(Bokeh)로 반응형 대시보드 만들기"
category: programming
tags:
  - python
  - dashboard
  - bokeh
created_at: 2025-02-18 08:47:45 -05:00
last_modified_at: 2025-02-22 08:48:03 -05:00
excerpt: python 라이브러리 보케(bokeh)로 반응형 대시보드 만들기
published: true
---

## 들어가기

최근 프로젝트에서 배터리 관리 시스템 출력을 분석해야 하는 과제가 있었습니다.  처음에는 `matplotlib`으로 구성한 그래프를 사용했고, 프로젝트가 진행되면서 팀내 공유가 편하다는 이유로 엑셀 템플릿을 사용하는 것으로 데이터 처리 내용이 변경되었습니다.

최종 산출물을 엑셀 스프레드시트로 정리하는 것 자체는 어쩔 수 없지만 어쨌든 팀 내 검토 과정에서는 반응형 대시보드로 좀 더 인사이트를 가져가고 싶어서, 처음에는 `matplotlib` 위젯을 사용하다가 최근 `bokeh`라는 파이썬 라이브러리를 알게 되었습니다.  

지금까지 적어도 저에게 있어서 `bokeh`의 가장 매력적인 기능은 반응형 대시보드를 `html` 파일 형태로 배포할 수 있다는 점입니다.  서버 기능을 필요로 하지 않는 간단한 대시보드를 팀 내에 배포해서 별도로 파이썬 환경이 확보되지 않은 PC에서도 열어보도록 할 수 있습니다.

`bokeh`로 작성 가능한 다양한 형태의 대시보드 예시는 [**라이브러리 공식 페이지**](https://demo.bokeh.org/)에 잘 정리되어 있기 때문에 문서화된 내용으로 충분히 학습하고 사용할 수 있습니다.  기본적인 세부 사용법은 공식 페이지를 참고하는 것을 추천드리며, 이 포스트에서는 공식 문서만으로 바로 이해하기 어려웠던 몇 가지 기능들을 예시와 함께 조금 더 자세히 살펴보려고 합니다.

## 예비 작업

기본적인 사용법이 라이브러리 공식 페이지에 잘 설명되어 있지만, 이 포스트에서 반복적으로 사용할 코드나 몇 가지 기본 작업들을 완결성을 위해 우선 기술합니다.

### 설치

자명합니다.

```bash
pip install bokeh
```

### 예제 데이터셋

아래와 같은 간단한 데이터셋을 정의하여 사용하겠습니다.

```python
import pandas as pd

data = {'fruit': ['apple', 'banana', 'peach', 'grape'],
        'price': ['400', '100', '300', '100']}

df = pd.DataFrame(data)
```
### 대시보드 레이아웃 짜기

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

### 서버를 통해 대시보드 배포하기

위 코드로 작성된 대시보드를 서버 형태로 배포하려면, 아래 커맨드를 터미널에서 실행합니다.

```bash
bokeh serve --show example.py
```

{% include img-gdrive alt="Bokeh Dashboard with Server" id="15JmYkSwtQAO7UdOhks2Ha4Ey9N95-bAm" %}

### 서버 없이 독립 파일로 대시보드 배포하기

서버 측 렌더링 없이 독립된 `html` 파일 형태로 대시보드를 배포할 수 있습니다.  `html` 파일로 출력된 대시보드는 파이썬 환경이 갖춰지지 않은 컴퓨터에서도 열어볼 수 있습니다.  `output_file`과 `show` 메서드를 이용해 아래 두 줄을 위 `example.py`에 추가해 줍니다.  `curdoc` 호출은 필요하지 않지만 남겨 두더라도 작동에는 문제가 없습니다.

```python
output_file("example.html", title="My bokeh example")
show(layout)
```

## 콜백 함수를 이용해 반응형 피쳐 만들기

대시보드에 반응형 피쳐를 제공하기 위해 콜백 함수를 작성하고 사용할 수 있습니다.  예를 들어서 버튼을 누르거나 텍스트박스에 입력값을 넣을 때 어떤 동작이 발생하야 하는지 정의하여 사용할 수 있습니다.  위에 작성한 대시보드에 텍스트박스를 하나 추가해서, 텍스트박스에 과일 이름이나 적당한 서브스트링을 넣으면 검색이 되도록 하는 해 보겠습니다.

### 레이아웃 만들기

우선 텍스트박스 위젯을 추가하겠습니다.

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

이 파일을 실행하면 아래와 같이 텍스트박스가 추가된 레이아웃을 확인할 수 있습니다.

Once you run above file, it shall show below layout.  At this stage, you can run this either with `bokeh` command in terminal or `example.py` to build standalone `example.html` file.

{% include img-gdrive alt="Dashboard with Textbox" id="1oQmyN0lo8ytiUdU-U1DqL3HUTCK2uNB_" %}

아직은 텍스트박스와 데이터 테이블이 같이 있을 뿐이고 텍스트박스의 내용 변경을 참조하여 테이블을 업데이트하는 함수가 존재하지 않습니다.  이 작업을 위해 텍스트박스 위젯에 연동할 콜백 함수를 작성해야 하는데, `python`으로 작성할 수도 있고 `JavaScript`로 작성할 수도 있으나 만일 서버 없이 독립된 html 파일 형태로 대시보드 배포를 원한다면 자바스크립트를 이용해야 합니다.

두 방법으로 각각 작성하고 비교해 보겠습니다.

### 파이썬 콜백

`example.py` 파일을 아래와 같이 수정하여 콜백 함수 `update`를 추가합니다.

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

이 경우에는 `output_file`과 `show`를 이용해 html 파일을 작성하는 마지막 부분은 제거해야 합니다.  즉, `bokeh serve --show`를 사용해 서버를 구동하는 방법으로만 대시보드를 제공할 수 있습니다.

아래와 같이 대시보드의 `Item`열에 대해 텍스트박스에 적당한 문자열을 넣어 검색을 수행할 수 있습니다.

{% include img-gdrive alt="Search Result" id="174ia1xD0ENNkzUdSt9SqyThBv6wKEc1X" %}

만일 `output_file`과 `show`를 제거하지 않고 파이썬 파일을 그대로 실행하려고 하면 아래와 같은 메시지가 출력되고 정상적으로 실행할 수 없습니다.

```bash
You are generating standalone HTML/JS output, but trying to use real Python callbacks (i.e. with on_change or on_event). This combination cannot work.

Only JavaScript callbacks may be used with standalone output. For more information on JavaScript callbacks with Bokeh, see:
    https://docs.bokeh.org/en/latest/docs/user_guide/interaction/js_callbacks.html

Alternatively, to use real Python callbacks, a Bokeh server application may be used. For more information on building and running Bokeh applications, see:

    https://docs.bokeh.org/en/latest/docs/user_guide/server.html
```

### 자바스크립트 콜백

서버 지원 없이 html 파일 형태로 대시보드를 구성하고자 하면 아래 작업을 수행해야 합니다.

- `bokeh.models` 모듈로부터 `CustomJS` 클래스를 임포트합니다
- 텍스트박스 위젯에 콜백을 연결하기 위해, `on_change` 메서드 대신 `js_on_change`를 사용합니다.
- 자바스크립트로 콜백 함수를 작성하고 `js_on_change` 메서드에 인자로 넘겨 호출합니다.

데이터와 위젯 객체들은 파이썬으로 작성되어 있는데 콜백 함수는 자바스크립트로 작성해야 하는 상황입니다.  자바스크립트 콜백을 작성할 때 데이터와 위젯에 어떤 방식으로 접근해야 하는지 이해하는 부분이 귀찮은 작업입니다.

코드는 아래와 같이 변경하였습니다.

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

이 코드는 `examlple_jscb.html` 파일을 생성하고, html 파일을 실행하면 위 파이썬 콜백 예제와 동일하게 문자열 검색이 가능합니다.  몇 가지 주의할 점들입니다:

- 자바스크립트 콜백을 작성할 때,  파이썬 코드 내 네임스페이스에서 사용한 이름을 그대로 사용하여 `ColumnDataSource` 객체들에 접근할 수 있습니다.  html 파일에서 파이썬 객체를 사용할 방법은 없을 테니 아마도 `bokeh` 자체에서 최대한 파이썬 코드 작성 시 사용했던 변수 및 객체명을 자바스크립트 콜백 작성 시 최대한 호환하여 사용할 수 있도록 지원하고 있을 것입니다.
- `backend`라는 이름으로 `source`와 동일한 `ColumnDataSource` 객체를 하나 더 선언해 주었습니다.  검색을 수행할 때 텍스트박스의 내용을 읽어 `source`의 내용을 갱신해 주는데, 갱신 전 `source`의 내용을 어딘가에 복제해 두지 않으면 html 파일을 새로고침하지 않는 이상 검색 전 원본 데이터로 데이터 테이블을 복원할 방법이 없기 때문에, `backend`라는 이름으로 검색에 의해 변경되지 않는 데이터 사본을 파이썬 코드 레벨에서 미리 추가 정의한 것입니다[^1].

[^1] 이 부분은 조금 애매합니다.  아마 이렇게 하지 않더라도 자바스크립트 레벨에서 `source`에 포함된 데이터들에 대한 복제본을 만들어 두고 html 파일이 실행되고 있는 동안 사용하도록 조정할 수 있을 것 같습니다.

## HTMLTemplateFormatter 사용하기

특정 스타일이나 하이퍼링크 등을 적용하고 싶은 경우 `HTMLTemplateFormatter`를 사용할 수 있습니다.  과일 이름을 클릭하면 특정 페이지로 이동하는 하이퍼링크를 만들어 보겠습니다. 

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

하이퍼링크는 존재하지 않는 url을 아무거나 넣은 것이라 실제로 연결은 되지 않을 것입니다.  위 코드에서 `template` 문자열 변수를 살펴보면 특정 변수명들이 `<%= %>`로 감싸여 있는 것을 볼 수 있는데, 이것은 [`underscorejs`](https://underscorejs.org/#) 구문을 따르는 것이라고 합니다.  미리 정의해 둔 소스 데이터가 `url` 필드를 포함하고 있기 때문에, `url`의 변수들은 `<%= url %>` 형태로 불러들여 사용할 수 있습니다. `value` 변수는 `formatter`가 인자로 넘겨지는 `TableColumn`이 어떤 필드명인지에 따라 해당 필드의 값을 가져오게 됩니다.  위 코드의 경우 `formatter`는 필드명 `fruit`인 `TableColumn` 객체에 넘겨지며 따라서  `<%= value %>` 구문은 html이 렌더링될 때 `fruit` 필드의 값으로 치환됩니다.