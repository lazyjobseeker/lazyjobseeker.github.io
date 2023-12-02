---
toc: true
toc_sticky: true
title: "unittest와 coverage로 코드 테스트하기"
category: Programming
tags:
  - python
published: true
use_math: true
created_at: 2023-12-01 13:45:54 UTC+09:00
last_modified_at: 2023-12-01 13:45:58 UTC+09:00
header:
  teaser: /assets/images/uncategorized-teaser-5.png
excerpt: "파이썬에서 unittest 라이브러리를 사용하여 작성된 코드를 테스트하고 coverage패키지를 이용하여 코드 커버리지를 확인하는 방법."
---

파이썬 내장 라이브러리 `unittest`를 사용하여 작성된 코드를 테스트하고, `coverage`패키지를 이용하여 코드 커버리지를 확인하는 방법을 정리합니다.

## 1. unittest를 이용하여 단위 테스트 만들고 실행하기

다음과 같은 코드를 작성했습니다.  `math.py` 모듈에 사칙연산 관련 함수를 만들어 넣고 `test.py`를 이용해 테스트하겠습니다.

```
mathlibrary
 ├─ __init__.py
 ├─ math.py
 └─ test.py

```

### 1.1 테스트할 코드 만들기

**math.py**는 아래와 같이 작성했습니다.

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

### 1.2 단위 테스트 클래스 및 메서드 만들기

이제 **test.py**에서 이 함수들의 동작을 점검할 단위 테스트들을 만들어야 합니다.

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

아까 작성한 `math` 모듈을 불러와 사용할 수 있도록 임포트하였고, 테스트케이스 작성을 위하여 `unittest` 모듈을 임포트했습니다.

테스트를 작성하기 위해서는 먼저 `unittest.TestCase` 클래스를 상속하는 단위테스트 용 클래스를 만들어야 합니다.  **MathFunctionTest**라는 이름을 붙여 주었습니다.

이 클래스의 메서드들로는 `math` 모듈의 네 가지 함수들을 테스트할 수 있는 케이스들을 생각해서 넣어 주었습니다. TestCase 클래스의 기본 메서드인 `assertEqual`을 이용해 수행 결과와 결과값이 동일한지 확인하도록 합니다.

`math.divde` 메서드의 경우 분모가 0인 경우에 에러가 발생할 것이므로, 에러가 제대로 발생하는지도 체크해 주는 내용을 추가했습니다. 따라서 총 4개의 함수에 대한 5개의 테스트케이스를 만든 것이 되었습니다. 테스트케이스는 다양하게 추가될 수 있으며 반드시 테스트하고자 하는 함수 혹은 클래스/메서드의 갯수와 같아야 할 이유는 없습니다.

## 2. coverage를 이용하여 테스트 커버리지 확인하기

작성된 테스트가 전체 코드의 어느 정도를 커버하고 있는지를 `coverage` 패키지를 이용해 확인할 수 있습니다.

### 2.1 coverage 패키지 설치

`coverage` 패키지가 설치되어 있지 않다면 우선 설치합니다.  `pip install coverage`로 설치합니다.

```
PS D:\repositories\devlog_codes> pip install coverage
Collecting coverage
  Downloading coverage-7.3.2-cp310-cp310-win_amd64.whl (203 kB)
     ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ 203.2/203.2 kB 6.2 MB/s eta 0:00:00
```

### 2.2 커버리지 확인하기

명령 프롬프트에서 `coverage run test.py` 명령을 실행하면 간단히 코드 커버리지를 체크할 수 있습니다.  **test.py**는 실제 여러분 로컬 PC에서 작성한 테스트용 파이썬 파일 이름을 넣으면 됩니다. 명령 프롬프트의 현재 위치가 **test.py**와 같은 위치가 아니라면 해당 디렉토리로 먼저 이동하거나, 전체 경로를 넣어 줍니다.

```
PS D:\repositories\devlog_codes> coverage run D:\repositories\devlog_codes\unittestandcoverage\test.py
.....
----------------------------------------------------------------------

OK
```

run이 완료되면 `coverage report` 명령으로 결과 요약을 확인할 수 있습니다.

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
