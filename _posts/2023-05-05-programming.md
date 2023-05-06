---
toc: true
toc_sticky: true
title: 첫 포스팅
category: Programming
tags:
  - C++
published: true
last_modified_at: 2023-05-05 20:40:00 +2044
use_math: true
---

블로그를 하고 싶다고 계속 생각은 하고 있었지만 실행력이 없어 미루기만 하다가 첫 글을 써 보기로 한다.  MBTI가 ISFJ인 아내는 네이버 블로그를 꾸준히 계속 하고 있는데 조회수가 늘어 가는 모습이 멋지다.

요즈음의 가장 큰 목표는 사내 SW 자격 취득이다.  총 세 단계로 나누어져 있고 1월 중순에 1단계 검정을 통과했다.  1단계 검정은 파이썬으로 응시 가능했고, 알고리즘에 대해 제대로 공부해 본 적이 전혀 없는 상태였지만 현업에서 맨 땅에 헤딩하며 쌓은 서당개 풍월로 세 시간 정도 앓은 끝에 간신히 답은 맞추고 나올 수 있었다.  기억을 더듬어 복기해 보니 기초적인 완전 탐색 문제였다.

2단계 검정부터는 파이썬 사용이 가능하기는 하지만 파이썬 응시가 가능한 검정은 매월 한 차례만 열리고, 그나마도 3단계 검정에서는 사용할 수 없고 오직 C언어로만 응시할 수 있다.  C언어를 공부하기로 했고 부족하지만 최선을 다하려고 노력하고 있다.

공부는 삼성전자의 SW Expert Academy(https://swexpertacademy.com/) 에서 제공되는 문제들로 하고 있다.  사용한 코드들을 복기할 때, 문제 출처를 별도로 적어 두고 기억하려고 한다.

## 표준 입출력

아직 표준 입출력을 다루는 데 애를 먹고 있어서, 지금까지 풀었던 문제들의 표준 입출력 사용 방식을 정리해 보려고 한다.

### 문자열 입력 받기

`1989. 초심자의 회문 검사 (D2)`


```c++
#include <iostream>
using namespace std;

for (t=1; t<=T; ++t) {
	char word[10];
	cin >> word;
	for (i=0; i<10; ++i) {
		cout << word[i];
		if (word[i] != 0):
			cout << "End!" << endl;
	}
}
```


길이가 10 이하인 문자열 입력을 받기 위해 최대 길이가 10으로 제한된 char 배열인 word를 만들었다.  cin 표준 입력 함수로 word에 문자열 입력을 받아 왔다.

길이가 10보다 작은 경우 word의 뒷 부분은 어떻게 처리되는지가 궁금해서, 입력을 받아온 뒤 모든 원소를 일일이 cout으로 출력해 보았다.

입력이 `level` 이라는 문자열이었을 때 위 코드는 `level`을 그대로 출력했다.  하지만 입력 문자열의 길이를 계산한다거나 할 때는 word에 들어간 입력 중 실제로 의미 있는 원소는 앞의 5개라는 사실을 알려 주어야 했고, 별도로 초기화를 진행하지 않았다면 5번째 이후 원소들에는 어떤 값이 들어가는지가 궁금했다.  지금까지 확인한 바로는 5번째 이후 원소들에 들어가 있는 값은 아스키코드 0 (NUL) 인 것 같다.  실제로 문제를 푸는 과정에서 입력 문자열이 끝났다는 것을 알려주기 위해 ` if(word[i]!=0) ` 조건을 넣어 주었다.

`8821. 적고 지우기 (D3)`

위 문제와 똑같은 방법으로 해 보려고 했는데 통하지 않았다.  `word[i] !=0` 조건문이 정상적으로 동작하지 않아서 다음 테스트케이스로 넘어갈 수가 없었다.

word를 초기화해주는 방법으로 해결했다.  "" 으로 초기화하면 모든 자리에 NUL이 들어가는 것 같다.

```c++
#include <iostream>
using namespace std;

for (t=1; t<=T; ++t) {
	char word[10000]=""; // 초기화
	cin >> word;
	for (i=0; i<10; ++i) {
		cout << word[i];
		if (word[i] != 0):
			cout << "End!" << endl;
	}
}
```

`8821. 적고 지우기 (D3)` 의 가장 빠른 정답을 보고 내 답을 수정해 보았다.

| 시도 횟수 | 답안 내용                   | 메모리 소비 (kB) | 실행 시간 (ms) |
| :---------: | :---------------------------: | :----------------: | :--------------: |
| 1         | 첫 답안                     | 13,544           | 83             |
| 2         | 모든 변수를 Register로 선언 | 13,544           | 71             |
| 3          |                             |                  |                |

```c++
#include <iostream>
using namespace std;
 
int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    register int T, i, ans;
    register char str[10001];
    register bool chk[10] = { false };
    cin >> T;
    for (int tc = 1; tc <= T; ++tc) {
        cin >> str;
        for (i = 0; str[i]; ++i) {
            chk[str[i] - '0'] ^= true;
        }
 
        ans = 0;
        for (i = 0; i < 10; ++i) {
            if (chk[i]) ++ans;
            chk[i] = false;
        }
        cout << "#" << tc << " " << ans << "\n";
    }
    return 0;
}
```


## 비트 연산자

```c++
#include <iostram>
using namespace std;


```