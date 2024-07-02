---
title: "Testing Python Code with unittest and coverage"
category: programming
tags:
  - python
created_at: 2023-12-01 01:45:54 +09:00
last_modified_at: 2024-05-03 13:44:18 +09:00
excerpt: "How to use unittest library to test my code and check code coverage using coverage library."
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
