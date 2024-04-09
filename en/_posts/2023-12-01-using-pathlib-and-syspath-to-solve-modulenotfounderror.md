---
translated: true
title: "Solve ModuleNotFoundError Error with `pathlib` and `sys`"
category: Programming
tags:
  - python
created_at: 2023-12-01 02:04:33 +09:00
last_modified_at: 2024-04-09 17:19:53 +09:00
header:
  teaser: /assets/images/uncategorized-teaser-7.png
excerpt: "How to solve ModuleNotFoundError using pathlib and sys"
---

If you are trying to run your custom python package but its location is not registered as `PATH` variable, you will encounter irritating `ModuleNotFoundError`.  Let's see how to solve this using `pathlib` and `sys`.

Consider I am working on my custom package structured like this.

```
D:\\package
     │ ├─ __init__.py
     │ └─ main.py
     └─subpackage
       ├─ __init__.py
       └─ a.py
```

And my goal is to run `main.py`, which is referring `a.py` located in `subpackage`.  Unfortunately, I face `ModuleNotFoundError` trying to import `a`.

```python
from package.subpackage import a

>>> ModuleNotFoundError: No module named 'package'
```

In such case, the most likely reason is that the parent directory of `package` is not known to your system, for example by adding the directory as your `PATH` variable (Here, I consider you are working on Windows environment).  Recent IDEs like *VSCode* are well organized so you can modify your project settings to automatically add your project path to be known by system.  But what if you are not using such IDEs?

## 1. Add Parent Directory of `main.py` to `sys.path`

As this is the issue that your python tries to find your custom module from `sys.path` variable but it fails, you can manually inform your python of the directory it should search for your module from.  It is easy enough as you can simply import `sys` and append desired path for the directory containing `main.py`.

You can literally write down the directory path, but a way which might cover general cases is to use `Path`.  `Path` can be imported from `pathlib` and allows you automatically find out the parent directory off current python file if combined with reserved variable `__file__`.

```python
import sys
from pathlib import Path
PARENTDIR = str(Path(__file__).parents[1])
sys.path.append(PARENTDIR)

from package.subpackage import a
```

`__file__` variable contains the path of `.py` file you are currently working on.  `parents[1]` allows you to access to the one-step-higher parent directory path.  Note that you need to wrap what is returned by `parents` with `str()` method because `parents[1]` does not return the string of directory path but an instance of `_PathParents` class.

Again for sure, in this example you can simply do `sys.path.append('D:\\packages')`.  But if you rename your package, change directory structure or so this path literal should be changed accordingly.  You can save some of your time for doing so if you use `pathlib` and `__file__` variable.

## 2. Work on `site-packages` of Your Local Python

If you do not want to mess your script by importing additional lines, this could be better solution.  I mentioned that `ModuleNotFoundError` occurred in above case because system does not know which path to refer to find our `package`, and local python tries to find it based on content of `sys.path`.

One of the basic path which is stored in `sys.path` is the `site-packages` directory of your local python.  So, if you locate your project (`package` directory in our example above) in that directory, no import-related problem occurs.

Then, how can I locate my `site-packages` directory where should I locate my project?  You can do this simply by printing the content of `sys.path`.

```python
import sys
print(sys.path)

>>> ['D:\\Program Files\\Python\\Python310\\Scripts\\ipython.exe', 'D:\\Program Files\\Python\\Python310\\python310.zip', 'D:\\Program Files\\Python\\Python310\\DLLs', 'D:\\Program Files\\Python\\Python310\\lib', 'D:\\Program Files\\Python\\Python310', '', 'D:\\Program Files\\Python\\Python310\\lib\\site-packages']
```

Hence, **D:\\\Program Files\\\Python\\\Python310\\\lib\\\site-packages** is my local `site-packages` path, if I locate my project under which I can avoid `ModuleNotFoundError` errors due to my system not knowing the location of my custum project.

## References
1. [pathlib documentation](https://docs.python.org/ko/3/library/pathlib.html)
2. [pathlib object have to be changed to str type](https://stackoverflow.com/questions/44315815/python-pathlib-path-object-not-converting-to-string)
3. [How to find out parent directory of 2-levels-up](https://stackoverflow.com/questions/27844088/python-get-directory-two-levels-up)