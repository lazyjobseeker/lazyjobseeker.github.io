---
revision: 1
title: Vector with char Arrays as Elements
category: programming
tags:
  - C++
created_at: 2023-12-05 01:35:24 +09:00
last_modified_at: 2024-05-07 16:06:32 +09:00
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

which I thought was the very thing I wanted to do.  It would work by simply modifying `test []` to `{'apple', 'banana', 'strawberry'}`.

And below answer is the one with most votes:

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

## References

1. [Forget about **vector** but just use std::string](https://stackoverflow.com/questions/2392308/c-vector-of-char-array)
2. [STL container can only contain copiable/assignable elements (1)](https://itecnote.com/tecnote/c-vector-of-char-array/)
3. [STL container can only contain copiable/assignable elements (2)](https://copyprogramming.com/howto/c-vector-of-char-array)