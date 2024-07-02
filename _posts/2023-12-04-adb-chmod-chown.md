---
revision: 1
title: "adb shell의 chmod, chown 명령어"
category: programming
tags:
  - adb
created_at: 2023-12-04 12:00:02 +09:00
last_modified_at: 2024-04-30 10:05:52 +09:00
excerpt: "adb shell 환경에서 파일 권한과 소유자를 변경하는 chmod 명령어와 chown 명령어를 사용해 봅니다"
quiz_file: /assets/json/chmod-chown.json
---

## chmod 명령어

chmod 명령어는 파일/디렉토리에 대한 권한 수준을 설정하는 데 사용됩니다. **ch**ange-**mod**e를 축약한 것입니다.

### 파일 권한

`adb shell ls -l [파일경로]` 명령을 이용하면 특정 파일의 권한 수준을 확인할 수 있습니다.

```
adb shell ls -l a.txt
-rwxrw-r-- 1 system install 2023-12-04 15:40 a.txt
```

위의 결과로부터 **a.txt**라는 파일에 대해 다음을 알 수 있게 됩니다:

- a.txt는 파일입니다.
	- 디렉토리라면 맨 앞 자리가 **d**로 표시됩니다.
- a.txt의 소유자는 system입니다.
- 소유자는 읽기(r), 쓰기(w) 및 실행(x) 권한을 가집니다.
- install 그룹은 a.txt에 대해 읽기및 쓰기 권한을 가집니다.
- 기타 사용자의 경우 읽기 권한만을 가집니다.

최종적으로, 소유자-그룹-기타사용자 중 한 사용자 주체에 대한 파일 권한은 4종류의 권한 지정 문자 (`r`, `w`, `x`, `-`)를 3개 자리에 배치하여 서술됩니다.  세 종류의 사용자에 대해 3자리의 문자열이 사용되므로 9자리, 여기에 해당 권한이 디렉토리에 대한 것인지 파일에 대한 것인지를 나타내는 맨 앞의 한 자리(디렉토리: `d`, 파일: `-`)를 더하여 총 10자리 문자에 의해, 특정 파일 혹은 디렉토리가 각 사용자별로 어떤 권한 수준을 부여받았는지 표기하게 됩니다. 

### 8진수 형식 (옥탈 코드) 권한 지정

`chmod`를 이용해 파일 혹은 디렉토리 권한을 지정하는 첫 번째 방식은 8진수 형식(옥탈 코드; octal code)을 이용하는 것입니다.  3개의 서로 다른 권한(읽기, 쓰기, 실행)은 각각 권한 있음 혹은 없음의 이진 상태만을 갖습니다.  따라서 한 사용자에 대한 권한은 3비트 변수(0-7 사이의 정수)로 표현될 수 있습니다.

권한 허용 상태(r, w 또는 x)인 자릿수를 1로, 비활성 자릿수(-)를 0으로 쓰기로 하면, 아래와 같이 이해할 수 있습니다.  r, w, x의 순서를 섞는 경우는 없다는 것에 유의합니다.

- -\-\- = 이진수 000 = 0
- -w- = 이진수 010 = 2
- r-x = 이진수 101 = 5
- rws = 이진수 111 = 7

따라서, **chmod 000**은 어떤 파일/디렉토리에 대해 읽기/쓰기/실행 권한을 모두 허용하지 않는 것이며, **chmod 777**은 모든 권한을 허용하는 것이 됩니다.

{% include img-gdrive alt="chmod 사용법 - 옥탈 코드 방식 예시" id="1i7VHZkMERCmuWO0c3ZCJLgS2j6ZXWIoW" %}

chmod + 옥탈 코드 형식으로 권한을 지정하는 예시를 살펴봅시다.  사용법은 `adb shell chmod [3자리 권한 숫자열] [권한을 조정할 파일명]`입니다.

```
adb shell chmod 000 a.txt
adb shell ls -l a.txt
---------- 1 system install 2023-12-04 15:44 a.txt
```
```
adb shell chmod 263 a.txt
adb shell ls -l a.txt
--w-rw--wx 1 system install 2023-12-04 15:47 a.txt
```
```
adb shell chmod 777 a.txt
adb shell ls -l a.txt
-rwxrwxrwx 1 system install 2023-12-04 15:55 a.txt
```

{% include multiple-choice-quiz.html jsonIdx=0 quizNum=1 %}

### 문자열과 연산자 방식 권한 지정

위의 옥탈 코드 방식은 반드시 전체 권한 문자열을 한 번에 모두 지정해야 합니다.  이러한 방식 대신, 사용자 지정 문자와 산술연산자 및 권한 지정 문자를 이용하는 방법을 사용할 수도 있습니다.

- 사용자 지정 문자: 소유자 (`o`), 그룹 (`g`), 기타 사용자 (`o`)
- 산술 연산자: 권한 추가하기 (`+`), 권한 제거하기 (`-`), 권한 덮어쓰기 (`=`)
- 권한 지정 문자: 읽기 (`r`), 쓰기 (`w`), 실행 (`x`)

이들의 결합을 통해 특정 파일 혹은 디렉토리의 권한을 부분적으로 조정할 수 있습니다.  예를 들어, 아래와 같은 작업을 할 수 있습니다.

```
chmod o+w FILE   # 기타 사용자를 대상으로 FILE의 쓰기 권한 추가
chmod g-r FILE   # 그룹 사용자를 대상으로 FILE의 읽기 권한 제거
chmod u=rx,o=r   # 소유자 권한은 읽기 및 실행만 허용, 기타 사용자 권한은 읽기만 허용으로 변경
```

### 디렉토리의 권한

`rwx`로 표시되는 각 권한들의 정확히 의미를 생각해 보면, 파일에 대한 권한의 경우 읽기/쓰기/실행 권한이 무엇을 의미하는지 명확합니다.

디렉토리의 경우에는 조금 애매한 부분이 있어, 한 번 살펴 보면 도움이 될 것입니다.

 - **읽기 권한**: 디렉토리 내에 어떤 파일들이 있는지 확인할 수 있다.
 - **쓰기 권한**: 디렉토리 내에 새 파일을 생성하거나 디렉토리의 파일을 삭제할 수 있다.
 - **실행 권한**: 디렉토리 내 파일들을 실제로 실행할 수 있다.

디렉토리에 대한 쓰기 권한만 있고 실행 권한은 없는 경우, 디렉토리 내의 파일을 실행하거나 `cat` 명령으로 내용을 확인하는 등의 작업은 할 수 없습니다.

## chown 명령어

chown 명령어는 파일/디렉토리에 대해 소유자/그룹을 재설정할 수 있습니다. **ch**ange-**own**er를 축약한 것입니다.

**adb chown [새로운 소유자]:[새로운 그룹] [대상 파일명]**과 같이 쓸 수 있습니다.

```
adb shell ls -l a.txt
-rwxrw-r-- 1 system install 2023-12-04 15:40 a.txt

(chown을 이용해 소유자를 bob, 그룹을 pop으로 변경)

adb shell chown bob:pop a.txt
-rwxrw-r-- 1 bob pop 2023-12-04 15:40 a.txt
```

[^1]: https://superuser.com/questions/1527784/confused-by-groups-and-the-linux-permission-model

[^2]: https://superuser.com/questions/1527784/confused-by-groups-and-the-linux-permission-model

[^3]: https://source.android.com/docs/devices/admin/multi-user-testing?hl=ko

[^4]: https://android.stackexchange.com/questions/58808/is-there-a-way-to-switch-android-users-from-the-command-line