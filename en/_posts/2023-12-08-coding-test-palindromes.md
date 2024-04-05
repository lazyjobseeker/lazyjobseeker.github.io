---
translated: true
title: "Algorithm Topic: Palindromes"
category: Programming
tags:
  - SW
  - Expert
  - Academy
  - Coding
  - Test
created_at: 2023-12-08 17:07:36 +09:00
last_modified_at: 2024-04-05 16:06:33 +09:00
header:
  teaser: /assets/images/uncategorized-teaser-3.png
excerpt: Algorithm problems about how to handle palindromes
---

## What is Palindrome?

**Palindrome** is a string which is same with itself when reversed.  For example, `kayak` and `level` are palindromes.

Unless some specific condition is given, and if the length of given string is $N$, we need to check if every $i$-th character is same with $(N-i)$-th character to see if some string is palindrome or not.

```cpp
#include<iostream>
#define LEN 5
using namespace std;

bool isPalindrome() {
    /* No need to proceed after comparing
    half of all the characters.*/
    for (int i=0; i<LEN/2; ++i) {
        if (word[i]!=word[LEN-1-i]) {
            return false;
        }
        return true;
    }
}

// Let's execute:
char *word = new char [LEN];
word = "kayak";
cout << isPlindrome(word);

>>> true
```

## Related Problems

### [SWEA] 19003. Palindrome Problem (D3)

This problem is from SoftWare Expert Academy (SWEA).

#### Problem Description

Each testcase is designed to have $M$ strings to be determined as palindrome or not.  Each string in single testcase are all of length $N$.  Additional condition is that given $M$ strings are not same with one another.

Problem is outputing the length of longest palindrome which can be made using some or all of given $M$ strings.

```
3 7 //3 strings, all of length 7 (M=3, N=7)
racecar
abcdcba
ioioioi

//Answer for this testcase
7
```

In above testcase, a string has length 7, and all of the strings given are palindromes.  At a first glance one might think we can concatenate all 3 strings to have palindrome of length 21, which is longest.  But this is not the case, because of the additional condition that all 3 strings are different one another.

```
2 3 //2 strings, all of length 3 (M=2, N=3)
abb
bba

//Answer for this testcase
6
```

Another basic testcase is where every single string is not palindrome.  But in this case, palindrome results by joining two strings.  So the answer is 6.


```
3 3
abc
ded
cba

//Answer
9
```

Above illustrates another possible case: some of given strings are not palindrome but can be joined to give palindrome, and others are palindromes themselves.

`abc` and `cba` is not palindromes but `abccba` is palindrome.  Inserting `ded`, palindrome as itself, in the middle of this makes `abcdedcba`, can make another longer palindrome.  So the answer for this testcase is 9.

#### How to Solve

If a string $A$ is not palindrome, longer palindrome could be made with $A$ only when there is another string $B$ which can be constructed by reversing characters of $A$.  If $A$ `aabbb` for example, the testcase should contain `bbbaa` also, to guarantee that the longest palindrome available include $A$ as its component.

And even if some testcase has 2 or more strings which are palindromes, *only one of those can be used to construct the longest palindrome*.  For example, consider a testcase having `caac` and `bffb`.  These two are both palindromes, but longest palindrome from this testcase cannot contain both of them.  This statement is guaranteed by the condition that there are no two same strings given in single testcase.

Therefore, this problem can be solved as follows:
1. Divide given strings into a set of palindromes($P$) and that of non-palindromes($NP$).  Let the size of $P$ be $p$.
2. Calculate how many pairs of strings are there to be reversed form of each other.  For example, (`aac`, `caa`) is one of such pair.  Let this value $n$.
3. If the size of single string from given testcase is $N$, the answer is (2×n+min(1,p))×N.

#### Wrong Approach

My first try was to use DFS permutation to exhaustively enumerate all the possible combinations of strings and to do palindrome check for all those combinations.

In this case,

- $N/2$ times of comparisons is needed to check a single combination outputs palindrome.
- $\textstyle\sum_{i=1}^M{_MP_i}$ times of palindrome check is needed to exhaustly check all the combinations.
- Total time complexity is $(N/2)\textstyle\sum_{i=1}^M{_MP_i}$

which is obviously doomed to fail with TLE.  However, correct approach above has time complexity of $(MN/2)+MN(M-1)$ with worst testcase - if all of the given strings are not palindromes.  If all the strings in a testcase is palindrome, trivially the answer is $N$ and it can be told after $M$-times of palindrome checks.