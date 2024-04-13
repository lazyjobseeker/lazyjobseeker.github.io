---
translated: true
title: "pathlib과 sys로 ModuleNotFoundError 해결하기"
category: programming
tags:
  - python
created_at: 2023-12-01 02:04:33 +09:00
last_modified_at: 2024-04-13 21:45:08 +09:00
excerpt: "내가 만든 python 패키지를 import하려고 할 때 발생하는 ModuleNotFoundError 해결하기"
---

환경변수에 등록되지 않은 위치에서 작성한 파이썬 패키지에서 발생하는 ModuleNotFoundError를 해결해 봅시다.

아래와 같은 형태로 패키지를 작성 중이라고 생각해 봅시다.

```
D:\\package
     │ ├─ __init__.py
     │ └─ main.py
     └─subpackage
       ├─ __init__.py
       └─ a.py
```

최종적으로 main.py를 실행하도록 하고 싶은데, main.py에서는 아래와 같이 subpackage의 모듈 a를 임포트하고 있는 상황입니다.

```python
from package.subpackage import a

>>> ModuleNotFoundError: No module named 'package'
```

이 경우, `package` 디렉토리의 상위 폴더가 환경 변수에 포함되어 있지 않으면, main.py를 실행하려고 할 때 파이썬에서 `package` 패키지를 찾을 수 없다고 하면서 오류가 발생할 수 있습니다. VSCode 등 IDE를 사용하는 경우 현재 프로젝트의 위치를 자동으로 환경 변수에 포함할 수도 있지만, 잘 작동하지 않는 경우도 있는 것 같습니다.

이런 경우에 발생한 ModuleNotFoundError를 다루는 몇 가지 가능한 방법을 정리합니다. 

## 1. sys.path에 현재 py 파일의 상위 디렉토리 추가하기

`pathlib.Path`를 이용하여 `sys`모듈의 `sys.path` 변수에 현재 py 파일이 실행되는 위치를 기준으로 상위 폴더를 환경 변수로 추가할 수 있습니다.

```python
import sys
from pathlib import Path
PARENTDIR = str(Path(__file__).parents[1])
sys.path.append(PARENTDIR)

from package.subpackage import a
```

`__file__`은 현재 실행되고 있는 `.py` 파일의 위치입니다. `parents[1]`을 통해 한 단계 상위 디렉토리의 경로에 접근할 수 있습니다. **Path(__file__).parent[1]**은 경로를 나타내는 문자열이 아니라 `._PathParents`라는 고유 클래스이기 때문에, `str()`로 감싸 문자열로 변환해 주어야 `sys.path`에 append했을 때 정상적으로 인식됩니다.

물론 이 경우 package의 절대 경로를 알기 때문에 pathlib을 사용하지 않고 **sys.path.append('D:\\packages')**를 하는 것으로 충분합니다. 다만 절대경로를 그대로 복사해서 넣게 되면 나중에 패키지 디렉토리의 위치를 변경했을 때 변경된 위치가 자동으로 연동되지 않는다는 단점이 있습니다. pathlib과 __file__을 사용하는 방법은 package 폴더를 옮기더라도 코드를 수정할 필요가 없는 장점이 있습니다.


## 2. 로컬 파이썬의 site-packages 폴더에서 작업하기

위에서 ModuleNotFoundError가 발생한 것은 이 `site-packages` 디렉토리에서 `package`라는 이름의 패키지를 발견할 수 없었기 때문입니다. 만일 `package` 패키지가 `site-pacakges` 디렉토리 하위에 존재했다면 임포트가 가능했을 것입니다.

따라서, 생각할 수 있는 무식한 방법 하나는 파이썬 패키지들이 설치된 로컬 저장소 `site-packages`의 위치를 찾은 다음 프로젝트 자체를 해당 위치로 옮겨 놓고 작업하는 것입니다.

`site-packages`의 위치는 `sys.path`의 내용을 한 번 출력해 보는 것으로 쉽게 확인할 수 있습니다.

```python
import sys
print(sys.path)

>>> ['D:\\Program Files\\Python\\Python310\\Scripts\\ipython.exe', 'D:\\Program Files\\Python\\Python310\\python310.zip', 'D:\\Program Files\\Python\\Python310\\DLLs', 'D:\\Program Files\\Python\\Python310\\lib', 'D:\\Program Files\\Python\\Python310', '', 'D:\\Program Files\\Python\\Python310\\lib\\site-packages']
```

제 경우에는 **D:\\\Program Files\\\Python\\\Python310\\\lib\\\site-packages** 위치가 되겠습니다.

## References
1. [pathlib 공식 문서](https://docs.python.org/ko/3/library/pathlib.html)
2. [pathlib 오브젝트는 str로 바꾸어 주어야 한다](https://stackoverflow.com/questions/44315815/python-pathlib-path-object-not-converting-to-string)
3. [두 단계 상위 디렉토리 경로 찾기](https://stackoverflow.com/questions/27844088/python-get-directory-two-levels-up)