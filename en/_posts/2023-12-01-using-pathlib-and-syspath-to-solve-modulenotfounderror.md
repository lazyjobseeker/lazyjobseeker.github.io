---
revision: 1
title: Solve ModuleNotFoundError Error with `pathlib` and `sys`
category: programming
tags:
  - python
created_at: 2023-12-01 02:04:33 UTC+09:00
last_modified_at: 2024-08-02 22:34:02 UTC+09:00
excerpt: How to solve ModuleNotFoundError using pathlib and sys
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

## 3. Using Well-Established IDE

If you are using IDE like **VSCode**, **PyCharm** or so, they usually provide an environment where you can work seamlessly with your custom packages 

{% include img-gdrive alt="How VSCode work to enable you to import your custom project (1)" id="1-fIKkL3EjQjUQ0BeQiQMxoFtqZrAP2KQ" %}

Here you can see how I tried to call `apple` function defined in custom module `myproject`, in VSCode environment.  I did not add the path of directory where `myproject` reside, but `example.py` works and `apple` function can be executed.  This is one of the merit you have in using well-established IDE like VSCode.

But the underlying concept is not different.  The reason why you can import `myproject` without putting further effort is just because VSCode takes the job instead of you.  To show this, you can try adding extra lines and print the contents of `sys.path` when `example.py` is being executed:

{% include img-gdrive alt="How VSCode work to enable you to import your custom project (2)" id="1-kighZNg4oLTpAFO6QFCwx13fF5LHmIM" %}

You can see the path of `pytest_example` directory, one of my current working directory open in VSCode, is automatically added as one of the entries of `sys.path` list.  Therefore, it is not a magic, but just IDE is doing some more work for you.

## 4. Miscellaneous Cases

Above observation makes you how to tackle various other cases of encountering `ModuleNotFoundErrors`:

### 4.1. Working with Wrong Python

Suppose you happen to have installed two different python (3.8 and 3.9).  Your custom module is located in `site-packages` directory associated with your python 3.9, but you try to work with python 3.8.  Such case can induce `ModuleNotFoundError` because different versions of python installed in your environment refers to different `site-packages` directory.  One may wonder how it can even be possible for one to misuse python 3.8 when they already installed newer version of python 3.9.  But such case can happen.  For example, one possibley have missed replacing the PATH variable for python excutable from older version to newer one when installing python 3.9.  In such case, if they run `python` on command prompt, python 3.8 will be triggered.

### 4.2. Uninstalled Package

Sometimes one might wonder why their `ModuleNotFoundError` for some package like `numpy` does not go away even after installing that missing package following the online instructions.  This could also be a continuation of the problem described above.  If you installed `numpy` following instructions but that was for installing `numpy` to different version of python than the one you exactly want to work with, the error will persist.  So it is important to make sure you have installed your package to proper version/environment of python where you want to use that package.
## References
1. [pathlib documentation](https://docs.python.org/ko/3/library/pathlib.html)
2. [pathlib object have to be changed to str type](https://stackoverflow.com/questions/44315815/python-pathlib-path-object-not-converting-to-string)
3. [How to find out parent directory of 2-levels-up](https://stackoverflow.com/questions/27844088/python-get-directory-two-levels-up)