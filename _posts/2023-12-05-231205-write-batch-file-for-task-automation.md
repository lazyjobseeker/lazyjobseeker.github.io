---
toc: true
toc_sticky: true
title: "배치 파일(.bat) 파일로 반복 작업 자동화하기"
category: Programming
tags:
  - windows
published: false
use_math: true
created_at: 2023-12-05 00:00:00 UTC+09:00
last_modified_at: 2023-12-05 00:00:00 UTC+09:00
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

set으로 만든 변수를 배치 파일의 다른 부분에서 불러 오고 싶을 때는 변수 이름 양 끝에 %를 붙여 줍니다.

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

## set으로 변수 만