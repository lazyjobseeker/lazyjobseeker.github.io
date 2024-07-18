---
revision: 1
title: Vector with char Arrays as Elements
category: programming
tags:
  - C++
created_at: 2023-12-05 01:35:24 +09:00
last_modified_at: 2024-07-18 19:38:44 +09:00
excerpt: How to store char arrays into a vector in C++
---

## How to Store *char arrays* in a Vector

Frequently I need to handle several strings separated by line breaks as single testcase.  For example, consider inputs as follows:

```
//strings with maximum length of 50 are given:
apple
banana
strawberry
```

Let's say that I want to get each string with `cin` and store into a vector, but use of **string** library is forbidden.  What could I do to do this?

After some trials I searched for **vector with char array as element**.  There was a StackOverFlow post, dating back to 2010.

```cpp
//Question - wanna do following but not working. What can I do?

char test [] = { 'a', 'b', 'c', 'd', 'e' };
vector<char[]> v;
v.push_back(test);
```

which I thought was the very thing I wanted to do.  I was under impression that it would work for me by simply modifying `test []` to `{'apple', 'banana', 'strawberry'}`.

When I struck by below answer with the most upvotes.

> You cannot store arrays in vectors (or in any other standard library container).  The things that standard library containers store must be copyable and assignable, and arrays are neither of these.

### vector<char []> Cannot Be Declared

Many similar posts and question/answers read that having a vector to store arrays is not possible, but I tried anyway.

The very first approach was like this.  Considering I normally define an char array like below,

```cpp
char word[] = "apple";
```

to define vector with elements with `word[]` form, I defined a vector.

```cpp
std::vector<char[]> words;
```

and then, I used `cin` to receive individual input strings and then pushed into my `words` vector.

```cpp
for (int i=0; i<3; ++i) {
    char word[] = {0};
    cin >> word;
    words.push_back(word);
}
```

But this did not work.  Actually, I couldn't even define `words` vector due to compile error.  It is technically forbidden to define vector with arrays as its elements.

### Declare and Handle vector<char*>

Possible workaround was to define `vector<char*>`.  By this, I define a vector which stores *pointers* pointing each char array I want to store.

First, it technically works to declare a vector like this.

```cpp
std::vector<char*> words;
```

Now I can `push_back` *pointers* pointing to `apple`, `banana`, and `strawberry`.

```cpp
#define MAXLEN 50
for (int i=0; i<3; ++i) {
    char *word = new char [MAXLEN];
    cin >> word;
    words.push_back(word);
}
```

I could check this concept worked well by pulling out elements one by one.

```cpp
#define MAXLEN 50
for (int i=0; i<3; ++i) {
    cout << words[i] << "\n";
}

// execution result
apple
banana
strawberry
```

Use of `new` keyword is important.  Actually, below what I tried for the first time than above solution.

```cpp
#define MAXLEN 50
for (int i=0; i<3; ++i) {
    char word[MAXLEN] = {0};
    cin >> word;
    words.push_back(word);
}
```

Above code outputs `strawberry` three times, maybe because `cin >> word` just works to change the target string pointed by `word` pointer.  As `push_back` above simply inserted *same* pointer into the vector, and all the elements in `words` vector might have been all the same.  As `strawberry` was the last string, `word` pointer was pointing `strawberry` when the for loop ended, and all three elements in `words` must have been pointing this single string.

```cpp
#define MAXLEN 50
for (int i=0; i<3; ++i) {
    cout << words[i] << "\n";
}

// execution result
strawberry
strawberry
strawberry
```

As a conclusion, if you want to declare a vector to handle strings but you cannot use **string** library, you can define `vector<char*>` and then store pointers pointing to each of the strings as elements of this vector.

## Using `std::string`

This way is recommended in most posts / online Q&A threads.  

```cpp
char word = "word";
std::vector<std::string> v;
v.push_back(word);
```

To use `string` class, include `<string>` header first.

```cpp
#include <string>
```

Remind different usage of `cin` and `getline`:  `cin` receives an input until the stream hits a whitespace.  `getline` receives an input until the stream its `\n`.  Getline can be used in conjunction with `cin` like `getline(cin, str)`.  Used with `getline`, input is not broken by whitespace and whole incoming line of characters are inserted to string `str`.

### How to Declare `string`s

You can declare new string by some different ways.

- Declare empty string
```cpp
std::string a;
```
- Declare with initialization by using ***raw string literal***
```cpp
std::string a = "apple";
std::string b("banana");
```
- Declare by copying other string
```cpp
// if b was "apple", a declared as follows is also apple
std::string a(b);
```
- Declare by referring char array
```
char a = {'a','p','p','l','e'};
std::string b(a); // b is apple
```
- Use of `new` keyword
```cpp
std::string a = new std:string("apple");
```

### Member Functions

`a` is a string object.
- `a.at(idx)`: Returns `idx`-th letter *with out-of-range check*.
- `a.at[idx]`: Returns `idx`-th letter *without out-of-range check*.
- `a.front()`: Returns the very first letter of string.
- `a.back()`: Returns the last letter of string.
- `a.length()`: Returns the length of a given string.
- `a.size()`: Returns the length of a given string.
- `a.max_size()`: Returns the maximum length of string reachable.
- `a.capacity()`: Returns memory size of given string.
- `a.resize(n)`: Resize given string into length of *n*.  Append 0 to lenghten and remove tail-side elements to shorten.
- `a.resize(n, 'a')`: Same with `.resize(n)` but appended letter is changed from 0 to 'a'.
- `a.append(b)`: Concatenate string `a` with string `b`.
- `a.append(b, n, m)`: Same with above but appended entity is changed to substring b\[n,n+m\]
- `a.clear()`: Remove all characters stored in `a`
- `a.erase()`: Remove all characters stored in `a`
- `a.erase(n,m)`: Remove substring a\[n,n+m\] from `a`
- `a.push_back('b')`: Append character at the end of string `a`
- `a.pop_back()`: Remove last character from string `a`
- `a.find(b)`: Try to find substring `b` from string `a`.  If found, the lowest `idx` which satisfies a\[idx\] == b\[idx\] is returned.
- `a.find(b, n)`: Same with `a.find(b)` but source string is a substring of `a` starting from index `n`.
- `a.find_first_of('b')`: Return smallest `idx` such that a\[idx\] = 'b'.
- `a.find_last_of('b')`: Return largest `idx` such that a\[idx\] = 'b'.
- `to_string(num)`: Return a string converted from a number `num`.
- `to_stoi(str)`: Return an number converted from a string `str`.

### Comparison Operation

Two strings can be compared each other using comparision operators (`＜`, `＞`, `≤`, `≥`, `==`, `!=`).  Strings are compared based on their order in dictionary.  The ***earlier*** a string comes in dictionary, the ***smaller*** it is considered in comparison operation.

```cpp
string a = "apple";
string b = "banana";

cout << (a < b); // True
cout << (a > b); // False
```

## References

1. [Forget about **vector** but just use std::string](https://stackoverflow.com/questions/2392308/c-vector-of-char-array)
2. [STL container can only contain copiable/assignable elements (1)](https://itecnote.com/tecnote/c-vector-of-char-array/)
3. [STL container can only contain copiable/assignable elements (2)](https://copyprogramming.com/howto/c-vector-of-char-array)