---
translated: true
title: "Python Installation, Setting, Project Packaging"
category: programming
tags:
  - python
created_at: 2023-11-05 11:57:00 +09:00
last_modified_at: 2024-04-12 06:14:36 +09:00
excerpt: "How to 1) install python and setting PATH variable and 2) package custom python project using setuptools package for distribution."
---

## Installation and  `PATH` Variable Setting

After installing python you need to set `PATH` variable to let your system know where your python executable resides.  Usually you don't need to do this manually if you checked **Add Python to PATH** checkbox when you installed python.

However, sometimes you might want to maintain multiple versions of pythons or simply forget about the checkbox so need manual setting.  What should you do then?

### Install Python

I installed [Python 3.10](https://www.python.org/downloads/release/python-3100/).

![](/assets/images/python-path-versioncheck.png){: width="600" .align-center}

After installation you can check it was successful by running `python --version` command in your command prompt.  If you checked **Add Python to PATH** during installaton this must work in most cases, as it makes your system know the what it should do when you type `python` in the command prompt.

### Check `PATH` Variables

Now let's check how my `PATH` variables look like.  In my case I was able to access [Control Panel]-[System Properties] to check this.

![](/assets/images/python-path-1.png){: width="600" .align-center}

Now click [Environment Variables...] button, and from bottom panel of [System Variables] activate `Path` and click `Edit` button.

![](/assets/images/python-path-2.png){: width="600" .align-center}

![](/assets/images/python-path-3.png){: width="600" .align-center}

You can see above kinds of paths are registered as `Path` variable.

![](/assets/images/python-path-4.png){: width="600" .align-center}

First of all, `/Python310` directory contains `python.exe` executable file.  So when you type `python` in the command prompt, what system actually do is finding this `exe` file and execute it.  If you force to rename `python.exe` file, you can make it fail.  Try for fun!

![](/assets/images/python-path-5.png){: width="600" .align-center}
On the other hands, in `/Python310/Scripts` you can find `pip.exe`.  `pip` is a package management system of Python and `pip.exe` is executable file for this package.  So after installing python you can use command like `pip install` to install packages you need with assistance of `pip`.

![](/assets/images/python-path-pip-versioncheck.png){: width="600" .align-center}

You can check version of your installed `pip` also in the same manner of checking python version.

## `setuptools` for Project Packaging

If you have worked on your own python packages and got some results, your next natural eager is packaging it and distribute for many different users or inside your team.

Assume I have `myproject` counstructed as follows.  I want other people to be able to install my ambitious `coffemaster`, by their running `pip install coffeemaster` or so, rather than sending my zipped source code via e-mail and asking them to unzip it and locate at proper location in there PC (as it is dumb).  Furthermore, I am also tired of being asked from my team about what dependency libraries they have to install in their local to avoid stupid `ModuleNotFoundError` or so.

You can use `setuptools` package in this case.  It helps you to pack your codes into single binary file installable via `pip` and to specify all the dependency packages so that they can be automatically installed when your custom package is installed.

```
myproject
├─ README.md
├─ setup.py
└─ coffeemaster
   ├─ __init__.py
   ├─ __main__.py
   ├─ drinktypes
   │  ├─ __init__.py
   │  ├─ americano.py
   │  └─ latte.py
   └─ coffeebeans
      ├─ __init__.py
      ├─ arabica.py
      └─ robusta.py
```

`setup.py` is the most important file.  See below code.

```python
from setuptools import setup, find_packages

setup(
    name='coffeemaster',
    version='0.0.1',
    packages=find_packages(),
    install_requires = [
	    'pytorch',
	    'pandas>=1.4.2'
    ],
    package_data={'examplecoffee': ['tallSizeAmericano.txt']}
)
```

In this file, I speficied my package name (`name`) and version (`version`).  Also I specified all the dependency packages under `install_requires` item.  If I want to distribute files other than python codes (`.py` files), specify them as `package_data` item.

Then I can move to the directory where `setup.py` resides and rum `python setup.py sdist` to build distributable binary file for my `coffeemaster` package.  `coffeemaster.0.0.1.tar.gz` file results under new directory `myproject/dist`.

I can attach this `.tar.gz` file when I release new version from my repository or just send this file to teammates.  Anyone downloading/receiving this file can run `pip install <path of tar.gz file>` in their environment to install `coffeemaster` package.

If I run `python setup.py bdist_wheel`, `.whl` file results.  It seems that they say [`.whl` format is better](https://stackoverflow.com/questions/31401762/python-packaging-wheels-vs-tarball-tar-gz) than tarball(`.tar.gz`) format.

But in my case `.whl` format didn't work better than tarball.  What I expected was to install `coffeemaster` only in the target environment, but when using `.whl` formatted binary file three different packages of `coffeemaster`, `drinktypes`, and `coffeebeans` were installed altogether.  Currently I am only using `sdist` command therefore.