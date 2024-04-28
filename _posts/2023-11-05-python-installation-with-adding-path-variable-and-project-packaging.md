---
title: "파이썬 설치, 환경 변수, 프로젝트 패키징"
category: programming
tags:
  - python
created_at: 2023-11-05 11:57:00 +09:00
last_modified_at: 2024-04-15 09:45:17 +09:00
excerpt: "python을 설치하고 환경 변수를 설정하는 방법, setuptools 패키지를 이용해 내가 만든 python 패키지를 배포 가능한 형태로 만드는 방법"
---

파이썬 설치하기, 환경 변수 알아보기, 프로젝트 패키징

## 파이썬 설치와 환경 변수

파이썬을 설치한 이후에는 환경 변수를 설정해 주어야 한다. 파이썬 설치 과정에서 **Add Python to PATH**라는 체크박스를 설정해 두면 자동으로 진행된다. 하지만 설치 과정에서 실수로 체크박스가 해제되었을 수도 있고, 여러 버전의 파이썬을 설치하거나 하는 이유로 이후에 환경변수를 조절하고 싶을 수도 있다. 나의 경우에는 C 드라이브에 파이썬 3.9.7 버전을 설치하여 사용하고 있다고 SSD 용량 부족으로 D 드라이브에 파이썬을 재설치하게 되었다.

### 파이썬 설치

[파이썬 3.10 버전](https://www.python.org/downloads/release/python-3100/)을 설치했다. 원래 최신 버전인 3.12를 설치하려고 했는데, 작업 중인 프로젝트가 동작하는 pytorch 라이브러리가 3.12 버전 파이썬을 아직 지원하지 않았다.

![](/assets/images/python-path-versioncheck.png){: width="600" .align-center}

파이썬 설치 후에는 `python --version` 명령으로 정상 설치 여부 및 버전 정보를 확인할 수 있다. `python`이라는 명령어를 명령프롬프트에서 인식할 수 있게 된 것이 바로 환경 변수에 새 파이썬 관련 경로가 등록되었기 때문이다.

### 환경 변수 확인

환경 변수가 어떻게 등록되어 있는지 확인해 보자. 나는 윈도우 10을 사용하고 있고 [제어판]-[시스템 환경 변수 편집] 메뉴로 접근해서 관련 내용을 확인할 수 있다.

![](/assets/images/python-path-1.png){: width="600" .align-center}

[환경 변수] 버튼을 누르고, [시스템 변수]의 Path를 확인해 보자.

![](/assets/images/python-path-2.png){: width="600" .align-center}

![](/assets/images/python-path-3.png){: width="600" .align-center}

위와 같은 경로가 시스템 환경 변수로 등록되어 있는 것을 알 수 있다. 대관절 저 폴더들에 뭐가 들어 있길래 `python --version` 같은 명령을 사용할 수 있게 되었을까?

![](/assets/images/python-path-4.png){: width="600" .align-center}

우선 `/Python310` 디렉토리에는 `python.exe` 실행 파일이 들어 있다. 명령 프롬프트에 `python`이라고 적어 넣을 때, 사실은 저 파일을 실행하라고 명령하는 것이다. 실제로 저 실행 파일의 이름을 바꾸어 버리면 `python --version` 같은 명령들이 제대로 동작하지 않는다.

![](/assets/images/python-path-5.png){: width="600" .align-center}
한편 `/Python310/Scripts` 경로에서는 `pip.exe`를 찾을 수 있다. 파이썬의 패키지 관리 시스템 프로그램인 pip의 실행 파일이다. 파이썬 설치 과정에서 이 경로가 여기에 등록되었기 때문에 파이썬 설치 이후 명령 프롬프트에서 별다른 작업을 하지 않아도 `pip install` 명령으로 패키지 설치 작업을 할 수 있다.

![](/assets/images/python-path-pip-versioncheck.png){: width="600" .align-center}

pip 버전 확인도 파이썬 버전 확인과 동일하게 할 수 있다.

## 프로젝트 패키징 - Setuptools

작업한 패키지를 setuptools 라이브러리를 이용해 배포하고 싶어졌다.  배포 대상 프로젝트는 아래와 같은 구조로, 예컨대 `pip install coffeemaster`를 명령 프롬프트에서 실행하는 것으로 배포 대상 유저의 사용자 파이썬이 설치된 위치의 site-packages 폴더에 `coffeemaster` 폴더를 생성함과 동시에 `coffeemaster` 패키지의 구동에 필요한 의존성 패키지들을 설치할 수 있으면 성공이다.

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

중요한 파일은 setup.py이다.  대략 아래와 같은 느낌으로 작성하게 된다.

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

패키지 이름(name)과 버전(version)을 설정하고, 패키지 동작에 필요한 의존성 패키지들과 필요한 버전들을 명시해 준다(install_requires).  파이썬 코드 파일(.py)이 아닌 파일을 함께 배포하고 싶다면 package_data 인자로 명시해 준다.

이제 setup.py가 위치한 디렉토리로 이동한 다음 `python setup.py sdist`를 실행하면 coffeemaster.0.0.1.tar.gz 파일이 myproject/dist라는 새 디렉토리 하위에 생긴다.  이 파일을 깃허브 프로젝트에서 새 릴리즈를 만들 때 첨부해도 되고 그냥 필요한 사람들에게 전달해도 된다.  .tar.gz 파일을 가진 유저는 pip를 사용 가능한 자신의 파이썬 개발 환경에서 `pip install <tar.gz 파일 경로>`를 입력하는 것으로 coffeemaster 패키지를 설치할 수 있다.

`python setup.py bdist_wheel`을 실행하면 .tar.gz 파일이 아닌 .whl 파일이 생긴다.  wheel(.whl) 형식이 tarball(.tar.gz) 형식보다 낫다고들 하는 경우가 있는 것 같다.

https://stackoverflow.com/questions/31401762/python-packaging-wheels-vs-tarball-tar-gz

하지만 bdist_wheel 명령어로 만든 coffeemaster 패키지 배포용 .whl 파일은 내가 원하는 방식으로 작동하지 않았다.  구체적으로는, 나는 사용자의 site-packages 경로에 `coffeemaster` 패키지만 설치되도록 하고 싶었는데 whl 파일로 설치했을 때는 `coffeemaster`, `drinktypes`, `coffeebeans`의 세 개 패키지가 설치되었다. 결국 현재는 sdist만 사용하고 있다.