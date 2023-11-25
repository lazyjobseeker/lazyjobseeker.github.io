---
toc: true
toc_sticky: true
title: "[2047] 신문 헤드라인 (D1)"
category: Programming
tags:
  - C++
  - "SW Expert Academy"
published: true
use_math: true
created_at: 2023-07-09 19:19:48 UTC+09:00
last_modified_at: 2023-07-09 19:30:57 UTC+09:00
header:
  teaser: /assets/images/algorithm-teaser-codingtest.png
---

신문 헤드라인 (D1)

```c++
#include<iostream>

using namespace std;

int main(int argc, char** argv) {
	string upper_cases = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
	string lower_cases = "abcdefghijklmnopqrstuvwxyz";
	string s;
	cin >> s;
	int i, j, k;
	for (i=0, i<s.size(); ++i) {
		k=0;
		for (j=0, j<26; ++j) {
			if (s[i]==lower_cases[j]) {
				cout << upper_cases[j];
				k=1;
				break;
			}
		}
		if (k==0) {
			cout << s[i];
		}
	}
}
return 0;
```