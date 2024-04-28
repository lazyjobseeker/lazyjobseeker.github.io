---
revision: 1
title: "adb shell의 chmod, chown 명령어"
category: programming
tags:
  - adb
created_at: 2023-12-04 12:00:02 +09:00
last_modified_at: 2024-04-28 10:44:36 +09:00
excerpt: "adb shell 환경에서 파일 권한과 소유자를 변경하는 chmod 명령어와 chown 명령어를 사용해 봅니다"
quiz_file: /assets/json/chmod-chown.json
---

## 1. chmod 명령어
 
chmod 명령어는 파일/디렉토리에 대한 권한 수준을 설정하는 데 사용됩니다. **ch**ange-**mod**e를 축약한 것입니다.

adb shell 명령어를 기준으로 adb shell ls -l [파일경로] 명령을 이용하면 특정 파일의 권한 수준을 확인할 수 있습니다.

```
adb shell ls -l a.txt
-rwxrw-r-- 1 system install 2023-12-04 15:40 a.txt
```

예를 들어 위와 같은 결과를 보면, **a.txt**라는 파일에 대해 다음을 알 수 있게 됩니다:

- a.txt는 파일입니다.
	- 디렉토리라면 맨 앞 자리가 **d**로 표시됩니다.
- a.txt의 소유자는 system입니다.
- 소유자는 읽기(r), 쓰기(w) 및 실행(x) 권한을 가집니다.
- install 그룹은 a.txt에 대해 읽기및 쓰기 권한을 가집니다.
- 기타 사용자의 경우 읽기 권한만을 가집니다.

최종적으로, 소유자/그룹/기타 사용자 중 한 주체에 대한 파일 권한은 r, w, x 및 권한 없음을 나타내는 -를 포함한 4개 문자를 3개 자리에 배치한 조합으로 만들어집니다. 소유자/그룹/기타 사용자에 대해 각각 3자리 문자가 권한 서술에 필요하므로 9자리, 여기에 디렉토리인지 파일인지를 나타내는 맨 앞의 한 자리를 더해 (디렉토리:d, 파일:-) 총 10자리 문자에 의해 특정 파일에 대한 권한 전체를 서술하게 됩니다.

그러면 권한을 조정하는 chmod 명령어가 권한 관련 문자열을 직접 타이핑하여 넘겨주는 방식으로 동작하느냐 하면 그렇지는 않습니다. 어떤 파일에 대해 새로운 권한 조합을 부여하고 싶을 때는 chmod와 함께 세 자리의 숫자를 넘겨 주도록 되어 있습니다.

그 이유는 chmod 명령은 각 주체에 대한 권한 조합을 3자리 이진수로 해석한 결과를 받도록 되어 있기 때문입니다. 권한 조합을 나타내는 3자리 문자열은 서로 다른 문자로 구분되기는 하지만 순서를 섞을 수는 없기 때문에 (ex. rwx라고는 쓸 수 있지만 wxr이라고 쓸 수는 없습니다), 각 자릿수는 활성 혹은 비활성(-)의 두 가지 경우만을 가지게 됩니다.

이제 활성(r, w 또는 x) 상태인 자릿수를 1로, 비활성 자릿수(-)를 0으로 쓰기로 하면, 아래와 같이 이해할 수 있습니다.

- -\-\- = 이진수 000 = 0
- -w- = 이진수 010 = 2
- r-x = 이진수 101 = 5
- rws = 이진수 111 = 7

따라서, **chmod 000**은 어떤 파일/디렉토리에 대해 읽기/쓰기/실행 권한을 모두 허용하지 않는 것이며, **chmod 777**은 모든 권한을 허용하는 것이 됩니다.

구체적으로 chmod 명령어의 동작을 살펴봅시다. 사용법은 `adb shell chmod [3자리 권한 숫자열] [권한을 조정할 파일명]`입니다.

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

## 2. chown 명령어

chown 명령어는 파일/디렉토리에 대해 소유자/그룹을 재설정할 수 있습니다. **ch**ange-**own**er를 축약한 것입니다.

**adb chown [새로운 소유자]:[새로운 그룹] [대상 파일명]**과 같이 쓸 수 있습니다.

```
adb shell ls -l a.txt
-rwxrw-r-- 1 system install 2023-12-04 15:40 a.txt

(chown을 이용해 소유자를 bob, 그룹을 pop으로 변경)

adb shell chown bob:pop a.txt
-rwxrw-r-- 1 bob pop 2023-12-04 15:40 a.txt
```

<!--

## 3.

조금 더 구체적으로, 모든 유저 및 그룹에는 유저 아이디(UID)와 그룹 아이디(GID)라는 정보가 존재합니다.  이 정보는 `id` 커맨드를 이용해 접근 가능한 정보입니다.

프라이머리 그룹이라는 개념이 있는데, 현재 사용자는 자기 자신의 프라이머리 그룹을 가지고 있으며, 현재 사용자가 만드는 파일은 프라이머리 그룹의 권한을 상속합니다.

그러나 `setgid g+s [디렉토리 경로]` 명령을 통해  `setgid` 비트를 활성화하면, 해당 디렉토리 하위에 생성되는 파일들은 파일을 생성한 사용자의 프라이머리 그룹이 아닌 디렉토리의 그룹 권한을 따라갑니다.



https://superuser.com/questions/1527784/confused-by-groups-and-the-linux-permission-model

UID, GID

https://superuser.com/questions/1527784/confused-by-groups-and-the-linux-permission-model

Meaning of permissions for files are fairly straightforward, r means you can open the file for reading, w means you can open that file for writing (thus modify its contents) and x means you can run this file as an executable (whether it's a binary or a script.)

For directories, it's a little more subtle. r means you can list the files in that directory (for example, with ls /path/to/dir), w means you can create new files in that directory (or delete existing files from that directory.) But you need x to be able to access any of the files in that directory, if you don't have x on a directory, you can't cd to that directory and you can't really open files inside that directory, even if you know they exist. (This allows for quirky setups, where with r but without x, you can list the filenames but you can't open any of the files, while with x but without r you can open files in the directory only if you know their names already, since you can't list the filenames in the directory.)

새 그룹 만들기

https://source.android.com/docs/devices/admin/multi-user-testing?hl=ko


그룹 관련 조작 - 새 그룹 만들고 그룹 사이를 이동하기

https://android.stackexchange.com/questions/58808/is-there-a-way-to-switch-android-users-from-the-command-line

공유 폴더 만들기 예제
-->