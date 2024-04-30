---
title: "chmod, chown Commands in Adb Shell"
category: programming
tags:
  - adb
created_at: 2023-12-04 12:00:02 +09:00
last_modified_at: 2024-04-30 10:06:48 +09:00
excerpt: "How to use chmod and chwon commands for modifying file permissions and owners."
quiz_file: /assets/json/chmod-chown.json
---

## 1. chmod

`chmod` command is used to set permission level for files and directories.  It is abbreviation of **ch**ange-**mod**e.

`adb shell ls -l [file-path]` can be used to check permission settings of a file. 

```
adb shell ls -l a.txt
-rwxrw-r-- 1 system install 2023-12-04 15:40 a.txt
```

For example, from above output we get to know following:

- `a.txt` is file
	- If it were a directory, the very first character must have been **d** than dash(-) as above.
- The owner of `a.txt` is `system`.
- Owner of this file has three permissions: read(r), write(w), and execution(x).
- `install` group can read and write with `a.txt`.
- Other users than `system` or `install` only have permission for reading this file.

Consisely, there are three different agents called **owner**, **group**, and others.  And for each of them can have a combination of three permissions (read, write, execute).  Therefore, to fully describe the permission level for given path, there are 9 different permissions to be determined with one additional identifier to tell if the path points a file or a directory.  Total 10 characters are hence used to detail permission status for a given path.

If we want to alter permission level of a file/directory, `chmod` command can be used with all these details.  But we do not pass, full string like `-rwxrwxrwx` with `chmod` command.  Rather, a three-digit-number, each digit of which corresponds to specific combination of permissions, is passed with `chmod`.

{% include img-gdrive alt="Using chmod - octal code example" id="1i7VHZkMERCmuWO0c3ZCJLgS2j6ZXWIoW" %}

Let's turn to an example:

```
adb shell chmod 420 a.txt
```

In this example, file permission was newly set with integer `420`.  Each digit of `420` is resulted by interpreting desired combination of permissions as binary number, in the order of read-write-execute.  So, if we are to render read permission only, it corresponds to binary number 100, therefore 4 when written in decimal number.  Similarly, 2 in middle digit result from binary expression 010 and to denote that only write permission is given.  The meaning of 0 in last digit is trivial, no permission for all levels.  Finally, three digits are in order of owner-group-others.  So `adb shell chmod 420` meant to alter the permission of `a.txt` as follows:

- Allow owner to have read/write permission.
- Allow group to have write permission.
- Allow other to have no permission.

With these you would understand that **chmod 000** will disallow every permission for every agents and **chmod 777** will allow every permission for all agents.

Let me show some more examples, and please try to solve **a quiz** which follows.

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

{% include multiple-choice-quiz.html jsonIdx=1 quizNum=1 %}

## 2. chown

`chown` command is used to reassign owner/group for some file/directory.  It is an abbreviation for **ch**ange-**own**er.

Syntax is **adb chown [new owner]:[new group] [target filename]**.

```
adb shell ls -l a.txt
-rwxrw-r-- 1 system install 2023-12-04 15:40 a.txt

(Change owner to bob and group to pop)

adb shell chown bob:pop a.txt
-rwxrw-r-- 1 bob pop 2023-12-04 15:40 a.txt
```