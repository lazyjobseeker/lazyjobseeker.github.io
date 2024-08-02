---
revision: 1
title: Testing Python Code with unittest and coverage
category: programming
tags:
  - python
created_at: 2023-12-01 01:45:54 UTC+09:00
last_modified_at: 2024-08-02 22:17:04 UTC+09:00
excerpt: How to use unittest library to test my code and check code coverage using coverage library.
---

Here I summarized how to test my code using `unittest`, a built-in library for code test in python, and how to check code coverage using `coverge` package.

## Create Unit Tests and Execute using `unittest`

I wrote some math-library as follows.  Having functions for elementary algebraic operation defined in `math.py`, I want to test them using `test.py` script.

```
mathlibrary
 ├─ __init__.py
 ├─ math.py
 └─ test.py
```

### Write Test Code

I wrote `math.py` first.  The code looks like this.

```python
def add(a: float, b: float) -> float:
    return a + b

def subtract(a: float, b: float) -> float:
    return a - b

def multiply(a: float, b: float) -> float:
    return a*b

def divide(a: float, b: float) -> float:
    return a/b
```

### Write Unit Test Classes and Methods 

Now, I need to create my unit tests in `test.py`.  Note that there is a basic class `TestCase` which I should inherit when I make my own test `class`.  Individual tests are defined as `method` under my custom class for testing.

```python
from unittestandcoverage import math
import unittest

class MathFunctionTest(unittest.TestCase):
    
    def test_add(self):
        self.assertEqual(math.add(2, 3), 5)

    def test_subtract(self):
        self.assertEqual(math.subtract(6, 3), 3)
    
    def test_multiply(self):
        self.assertEqual(math.multiply(7, 8), 56)

    def test_division(self):
        self.assertEqual(math.divide(6, 2), 3)

    def test_division_by_zero(self):
        with self.assertRaises(ZeroDivisionError):
            math.divide(6, 0)

if __name__ == '__main__':
    unittest.main()
```

I imported my custom `math` module, which I want to test.  And also imported `unittest` module, to allow my custom classes for test to inherit from `unittest.TestCase` class.

I built `MathFunctionTest` custom class and rendered 4 different methods, each is assigned to test one of total 4 functions I defined in `math` module.  Parent `TestCase` has methods designed to check whether a result of executing a function is correct or not in several different ways.  I used `assertEqual` method for my example.

And I should also check some cornercases.  For example, `math.divide` must throw zero-division error if given denominator is zero.  To see if my `math.divide` handles well such case, I assigned a separate test function for this (`test_division_by_zero`) and used `assertRaise` method to see if `ZeroDivisionError` is raised as intened when 0 is cast as denominator.

Here, you can see that there is no restriction like *'The number of test functions should equal to the number of functions to be tested'*.

Now when I run `test.py`, all 5 tests are conducted and report is displayed to show how many of them succeeds.

```
PS D:\repositories\devlog_codes>python test.py
.....
----------------------------------------------------------------------
Ran 5 tests in 0.001s

OK
```

## Check Test Coverage with `coverage`

I also can get statistic report on the portion of codebase covered by the tests I wrote.  `coverage` package supports this.

### Install `coverage`

If you don't have `coverage` package yet you need to install it first by running `pip install coverage` command.

```
PS D:\repositories\devlog_codes> pip install coverage
Collecting coverage
  Downloading coverage-7.3.2-cp310-cp310-win_amd64.whl (203 kB)
     ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ 203.2/203.2 kB 6.2 MB/s eta 0:00:00
```

### Check Code Coverage

Now I can run `coverage run test.py` in command prompt to get the code coverage statistics with `test.py`.

```
PS D:\repositories\devlog_codes> coverage run D:\repositories\devlog_codes\unittestandcoverage\test.py
.....
----------------------------------------------------------------------

OK
```

After you see `OK`, summary of report is available with `coverage report` command.

```
OK
PS D:\repositories\devlog_codes> coverage report
Name                              Stmts   Miss  Cover
-----------------------------------------------------
unittestandcoverage\__init__.py       0      0   100%
unittestandcoverage\math.py           8      0   100%
unittestandcoverage\test.py          20      0   100%
-----------------------------------------------------
TOTAL                                28      0   100%
```

## pytest

`pytest` is also a framework you can use to test your codes.  You need `python 3.8` or higher to use `pytest`.

### Installation

```bash
pip install -U pytest
```

### Usage

There are some rules in nomenclatures for the files used for testing using `pytest`:

- File name takes the form of `test_*.py` or `*_test.py`
- Class name takes the form of `Test*`
- Class method/function names take the form of `test_*`

To run the test, there are several ways you can trigger it.

- `pytest` command runs all test files in current directory.
- `pytest <dir-name>/` runs all test files in `<dir-name>` directory
- `pytest <file-name>` runs specific test file named `<file-name>`

### Fixtures

In testing your codes, you get to repeatedly find that your tests including some necessary but redundant portion.  For example, you may need to load some raw data file repeatedly.  Or you may need to create instances of a class before running a test.

```python
import pytest

# Import custom class, a mighty Dragon, for testing
# Instances of Dragon can fire_breath() and fly()
# fire_breath returns string "fire"
# fly returns stirng "fly"
from my_project import Dragon

@pytest.fixture
def summon_dragon():
	dragon = Dragon()
	return dragon

def test_fire_breath(summon_dragon):
	assert summon_dragon.fire_breath() == "breath"

def test_fly(summon_dragon):
	assert summon_dragon.fly() == "fly"
```

By decorating `summon_dragon` as fixture, repetition of creating `dragon` instance can be avoided.  You can pass the fixture function `summon_dragon` as an argument of your test functions, which automatically enables your test function to access `dragon` inside of itself.

Without using fixture concept, the tests had to be like:

```python
import pytest

# Import custom class, a mighty Dragon, for testing
# Instances of Dragon can fire_breath() and fly()
# fire_breath returns string "fire"
# fly returns stirng "fly"
from my_project import Dragon

def summon_dragon():
	dragon = Dragon()
	return dragon

def test_fire_breath():
	assert summon_dragon().fire_breath() == "breath"

def test_fly():
	assert summon_dragon().fly() == "fly"
```

You can also ***chain*** multiple fixtures.

```python
@pytest.fixture
def on_plate():
    return []

@pytest.fixture
def add_icecream(on_plate):
    on_plate.append("Icecream")

@pytest.fixture(autouse=True)
def add_waffle(on_plate, add_icecream):
    on_plate.append("Waffle")

def test_on_plate(on_plate):
    assert on_plate == ["Icecream", "Waffle"]	
```

Notice `autouse` argument of fixture `add_waffle`.  This argument enables `add_waffle` to be run without explicitly using it on our test functoin `test_on_plate`.  As `add_waffle` includes another fixture `add_icecream`, it is called first and the string `"Icecream"` is appended to empty list (which is called by `on_plate`) before the other string `"Waffle"` is appended.

A noteworthy point about chained fixtures is that how `pytest` deals with the case if any one of the fixtures chained together contains error (and therefore raise some type of error).  It is said that `pytest` does not *attempt* to run any test any of the fixtures for which contain error.  As the test is not *attempted* to be executed, we cannot interpret failure in such case as a failed test.

#### Scope of Fixture

We can set `scope` for fixtures.

```python
@pytest.fixture(scope="<scope>")
```

`<scope>` can be one of below, where the default setting is `function`.

- function
- class
- module
- package
- session

If the scope of a fixture is `session`, for example, that fixture is called only once during a given test session (i.e. when you run test file using `pytest <filename>.py` in command prompt)