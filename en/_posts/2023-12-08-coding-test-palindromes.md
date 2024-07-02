---
revision: 1
title: "Algorithm Topic: Palindromes"
category: programming
tags:
  - algorithm
created_at: 2023-12-08 05:07:36 +09:00
last_modified_at: 2024-05-07 15:48:12 +09:00
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

Most of palindrome-related problems are, except for introductory level problems, less likely to be solved via exaustive search like DFS or BFS.  Let's assume that you were asked to determine the number of palindromes you can make by fully or partially rearranging letters from some string of length $N$.  Unless other conditions are given, it compels you to check $\textstyle\sum_{i=1}^M{_MP_i}$ different cases, which can be insanely time-consuming.  So when you examine palindrome problems, it is more likely that you can find some indirect clues from the problem description.  You can cut way down the number of palindrome checks you need to carry out.

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

### [SWEA] 8934. Palindrome-Phobia (D4)

#### Problem Description

Given a string composed of 3 alphabets (a, b, c), determine if one can rearrange its constituents to ensure no palindrome longer than length 2 occur inside the string.

#### Approach

First of all, placing an alphabet right next to the other of same kind must be avoided.  To fulfill this condition, when given string is of length $N$, none of three alphabets is allowed to be more than $N/2$.

Secondly, unless $N$ is 2, all 3 alphabets must be used.  A simple justification for this statement can be provided in the manner of induction.  To begin with, we assume that string with length $N$ > 2 composed of only 2 alphabets cannot be rearranged into palindrome-free by rearrangement.  Without loss of generality, we can say these two alphabets are **a** and **b**.  If we add **a** or **b** to lengthen the string to length $N+1$, any rearrangement of new string is again includes substring with length $N$ which is composed only with **a** or **b**.  Therefore, if for some natural number $N$ all two-alphabet strings with length $N$ cannot be rearranged to not contain palindromes, it does as same for all natural numbers larger than $N$.  Then if we examine $N=3$ case, it is trivial that all possible strings cannot be rearranged to be palindrome-free: aaa, aab, abb, bbb.

And you can also catch that there is *practically unique* rearrangement for any given string $S$ longer than 3.  For example, after **ab** only **c** can concatenate, and after resulting **abc**, only possible concatenation is with **a**.  Thus, if we have an palindrome-free rearrangement of $S$, it should appear as chained repeat of one of **abc** / **acb** / **bac** / **bca** / **cab** / **cba**.

Above reasoning gives us another criterion profitable in determining if a string can be rearranged into palindrome-free form - any substring longer than length 3 must contain all three alphabets.  Now we can handle string $S$ with length $N\ge3$ like this:

1. If $N\text{ mod }3 = 0$, palindrome-free rearrangement can be found only if there are equal number of **a**, **b**, and **c** in $S$. 
2. $N\text{ mod }3 = 1$, only one alphabet is allowed to have one more entity than others.  Others should have same number of entities.  If $N$ = 7, 3-2-2 division only is allowed.
3. $N\text{ mod }3 = 2$, only one alphabet is allowed to have one less entity than others.  Others should have same number of entities.  If $N$ = 8, 3-3-2 division only is allowed.