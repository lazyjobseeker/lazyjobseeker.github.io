---
toc: true
toc_sticky: true
title: "배치 파일(.bat)로 반복 작업 자동화"
category: Programming
tags:
  - windows
published: true
use_math: true
created_at: 2023-12-05 00:00:00 +09:00
last_modified_at: 2024-03-06 18:27:06 +09:00
header:
  teaser: /assets/images/uncategorized-teaser-8.png
excerpt: "윈도우즈 환경에서 반복 작업을 자동화할 수 있도록 배치 파일을 작성하고 활용하는 방법"
---

배치 파일(.bat) 파일을 활용하면 여러 가지 반복 작업을 한 번에 실행할 수 있어 편리합니다.

배치 파일을 작성하는 데는 특별한 프로그램이 필요하지 않으며, 아무 텍스트 에디터를 이용해 명령어들을 입력한 다음 확장자만 **.bat**으로 바꾸어 주면 됩니다. 배치 파일 작성을 위해 필요한 명령어들을 정리합니다.

## echo

**echo** 명령어는 **echo [출력할 내용]** 의 형태로 사용합니다.  실행되면 ECHO 뒤에 입력한 내용을 명령줄에 출력합니다. 배치 파일 하나를 만들고 아래와 같이 작성합니다.

```
(C:\user 폴더에 example.bat을 만들고 아래 내용을 입력했다고 합시다.)

echo Hello world
```

이 배치 파일이 있는 위치로 이동해 파일명인 **example.bat**을 입력하면 배치 파일이 실행됩니다.

```
C:\user>example.bat
C:\user>echo Hello world
Hello world
```

## @echo off

위의 실행 결과를 보면 **example.bat**이 실행될 때, 명령어인 **echo Hello world**를 한 번 보여준 다음 실행 결과인 **Hello world**가 출력되는 것을 알 수 있습니다. 명령어가 많아지면 이렇게 매 명령어가 모두 출력되는 것이 번잡해 보일 수 있습니다.

**@echo off**를 넣어 주면 이후의 명령들에 대해서는 명령 자체는 출력하지 않고 결과만 보여줍니다.

```
(example.bat)

@echo off
echo Hello world
```

위와 같이 배치 파일을 만들고 실행하면, 아래와 같은 결과를 얻습니다.

```
C:\user>example.bat
Hello world
```

## set으로 변수 만들기

변수를 만들어 사용할 수도 있습니다.  **set** 명령어는 **set [변수]=[값]**의 꼴로 사용되며 변수에 값을 할당하여 이후에 활용할 수 있습니다. 주의할 점은 **[변수] = [값]**과 같이 가운데에 등호 외에 공백이 들어가면 안 된다는 것입니다.

set으로 만든 변수를 배치 파일의 다른 부분에서 불러 오고 싶을 때는 변수 이름 양 끝에 **%**를 붙여 줍니다.

```
(example.bat)

@echo off
set salute=Hello world
echo %salute%
```

실행 결과는 앞서와 동일하게 됩니다.

```
C:\user>example.bat
Hello world
```

변수가 문자열인 경우 일부만을 출력하도록 할 수도 있습니다. 이 경우 **%[변수명]:~[시작 인덱스],[출력할 길이]%**와 같이 써 주는데, 시작 인덱스가 음수로 주어지면 문자열의 끝 부분에서부터 역순으로 인덱스 값만큼 세어 준 위치에서 시작합니다.

```
(example.bat)

@echo off
set salute=Hello world
echo %salute:~2,3%
echo %salute:~-3,3%
```

실행 결과는 다음과 같습니다.

```
C:\user>example.bat
llo
rld
```

## 반복문 사용하기

반복문 기능도 사용할 수 있습니다. 예를 들면 아래 반복문은 현재 디렉토리의 모든 파일에 대해 파일 이름을 출력합니다.

```
for %%i in (*) do echo %%i
```

위 구문에서 파일명을 반복하여 받아오는 **%%i**는 임의로 설정한 변수명일 뿐이므로, 아래와 같이 써도 무방합니다.

```
for %%f in (*) do echo %%f
```

**%%f**는 단순히 파일명을 나타내는 문자열이 아니라 파일에 대한 정보를 포함하는 것으로 취급됩니다.  %%와 f 사이에 추가 예약어를 더해 주면 파일에 대한 다른 정보를 얻을 수 있습니다. 예를 들어

```
for %%f in (*) do echo %%~tf
```

위 명령은 파일명들 대신 최종 수정일들을 출력합니다. **~t**이 최종 수정일에 대한 예약어입니다. 다른 예로 **~x**는 확장자에 대한 예약어, **~n**은 확장자를 제외한 파일명에 대한 예약어입니다.


## 지연된 확장

반복문과 변수 설정이 가능하다는 것을 알고 나면 자연히 반복문 안에서 변수를 설정하고 사용하는 것이 가능한지 생각하게 됩니다.

예를 들어, 아래 구문은 현재 디렉토리의 모든 파일명을 출력했습니다.

```
for %%i in (*) do echo %%i
```

그러면 직관적으로, 아래 구문도 동일하게 동작해야 할 것 같습니다 (do 뒤에 여러 명령이 오면 괄호로 묶어 줍니다).

```
for %%i in (*) do (
  set var=%%i
  echo %var%
)
```

그러나 cmd에서의 for문을 **%변수명%**꼴의 변수와 쓰게 되면 for 루프가 진행되는 동안 변수 업데이트의 결과가 실시간으로 반영되지 않습니다. 이를 방지하기 위해 **지연된 확장**을 사용하는데, 구체적으로는 setlocal EnableDelayedExpansion을 추가해 주고 변수 참조는 %변수명%꼴 대신 !변수명! 을 사용합니다.

```
setlocal EnableDelayedExpansion
for %%i in (*) do (
  set var=%%i
  echo !var!
)
```


## 외부 파라미터 넘기기

배치 파일을 실행할 때 [배치파일명] [파라미터1] [파라미터2] ... 와 같이 파일명 뒤에 추가 파라미터를 붙여 주고 이 파라미터들을 배치파일 내에서 참조하여 사용할 수 있습니다. 배치파일 내에서 이 추가 파라미터들은 %1, %2와 같이 순서대로 명명됩니다.

```
(example.bat)

@echo off
echo Hello %1
```

example.bat을 실행할 때 추가 파라미터를 넘기면 아래와 같이 됩니다.

```
C:\user>example.bat world
Hello world

C:\user>example.bat waldo
Hello waldo
```
