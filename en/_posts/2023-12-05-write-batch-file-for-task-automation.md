---
translated: true
title: "Task Automation with Batch File (.bat)"
category: Programming
tags:
  - windows
created_at: 2023-12-05 00:00:00 +09:00
last_modified_at: 2024-04-03 14:57:39 +09:00
header:
  teaser: /assets/images/uncategorized-teaser-8.png
excerpt: "How to write batch file to automate repeated tasks in windows environment."
---

Batch file (`.bat`) can be easily written and used to excute repeated tasks at once.  No special program is needed, but you can just use you favorite text editor or IDE to write some command and rename it to have `.bat` extension.  Let's review some commands you can use in writing your batch file.

## echo

**echo** command is used in the syntax of **echo [content to print]**.  This command outputs content trailing after `echo` on the command line.  Let's try writing a simple one.

```
echo Hello world
```

Let's assume above file is named `example.bat` and placed in `C:\user>`.  You can execute this batch file as follows.

```
C:\user>example.bat
C:\user>echo Hello world
Hello world
```

## @echo off

In above example you can see that the command `echo Hello world` prints once and then the execution result `Hello world` follows.  As your batch file size grows, outputing command itself can mess up your command prompt.  If you add **@echo off** at some point of your batch file, commands after **@echo off** stops showing commands themselves but outputs print only.

```
(example.bat)

@echo off
echo Hello world
```

Above batch file outputs like:

```
C:\user>example.bat
Hello world
```

## USE `set` to Handle Variables

You can even define custom variables and use them in your batch file with `set` command.  `set` is used in **set [variable]=[value]** syntax and you can assign values to variables and use them afterwards.  A trivial but important point is that there should be no spaces on both side of equal sign.  So, using **[variable] = [value]** format violates desired syntax. 

If you already declared using `set` and want to call it from other lines of a batch file, prepend and append **%** to the variable name. 

```
(example.bat)

@echo off
set salute=Hello world
echo %salute%
```

Above file outputs as same with previous example.

```
C:\user>example.bat
Hello world
```

If a variable contains string, you can also format the output to print some of the characters only.  The syntax is **%[variable_name]:~[start_index],[output_length]%**.  If `start_index` is negative integer, starting index is spotted by counting inversly starting from the end of given string.

```
(example.bat)

@echo off
set salute=Hello world
echo %salute:~2,3%
echo %salute:~-3,3%
```

Output of executing above batch file results like below.

```
C:\user>example.bat
llo
rld
```

## Using For Loop

Loop feature also is supported.  For example, below loop scans all the files in current directory and prints filenames.

```
for %%i in (*) do echo %%i
```

In **%%i**, **i** is an arbitrarily given variable.  So, below line does exactly same thing.

```
for %%f in (*) do echo %%f
```

In above examples, **%%i** or **%%f** is not just a string.  It contains useful information as if it is some kind of object by itself.  And you can elicit more information by adding some reserved keywords between %% and f.

For example, `~t` is a reserved keyword for *last modifed dates* and you can print last modified dates for all the files using this. 

```
for %%f in (*) do echo %%~tf
```

Similarly, **~x** is for extensions and **~n** is for filenames but extensions excluded.

## Delayed Expansion

Now we got to know that for loop and custom variables can be used in batch file.  Next natural question is whether we can use define custom variables and use them *inside* for loop.

For example, we already saw that below line prints all the filenames in current directory.

```
for %%i in (*) do echo %%i
```

Then intuitively, it seems reasonable to guess that below line works as same (we use parenthesis if more than one command follows after **do** statement).


```
for %%i in (*) do (
  set var=%%i
  echo %var%
)
```

However, in writing batch files, result of updating **%var%** is not reflected real-time when for loop is running.  In above case, the output is printing same filename throughout the running for loop (guess which name prints - first file in directory? or last one?).

To prevent this the concept of **Delayed Expansion** is required.  To enable this, we need to add `setlocal EnableDelayedExpansion` line and variables must be referred by ![variable name]! syntax rather than %[variable name]% syntax.

```
setlocal EnableDelayedExpansion
for %%i in (*) do (
  set var=%%i
  echo !var!
)
```


## Passing External Parameters to Batch Files

We can pass one or more parameters when executing batch file and handle it inside of the batch file.  For example, you can execute batch file like `example.bat param1 param2` from command prompt.  Inside batch file, passed parameters are sequentially named like `%1`, `%2` or so.  Let me give an example below.

```
(example.bat)

@echo off
echo Hello %1
```

If we run example.bat by passing additional parameters:

```
C:\user>example.bat world
Hello world

C:\user>example.bat waldo
Hello waldo
```
