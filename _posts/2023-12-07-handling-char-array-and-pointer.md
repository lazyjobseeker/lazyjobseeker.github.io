---
title: char array들을 원소로 갖는 vector 만들기
category: Programming
tags:
  - C++
redirect_from:
  - /programming/231207-handling-char-array-and-pointer/
published: true
created_at: 2023-12-05 13:35:24 +09:00
last_modified_at: 2024-03-27 16:10:38 +09:00
header:
  teaser: /assets/images/uncategorized-teaser-2.png
excerpt: C++에서 vector에 char array들을 저장하는 방법을 알아 봅니다
---

## char array들을 원소로 갖는 vector 만들기

코딩테스트 공부를 하다 보니 줄바꿈으로 구분된 여러 개의 문자열을 처리해야 하는 경우가 많습니다. 예를 들어 아래와 같은 입력들이 주어진다고 해 봅시다.

```
//최대 길이가 50인 문자들이 주어집니다.
apple
banana
strawberry
```

`cin`으로 각각의 문자열들을 입력받은 다음 vector에 넣어 주고 싶습니다. 하지만 **string** 라이브러리는 사용할 수 없는 상황이라고 하겠습니다. 어떻게 하면 이 문자열들을 원소로 갖는 vector를 만들 수 있을까요?

몇 번 삽질을 한 뒤 **vector with char array as element**라고 검색해 보았습니다. StackOverflow에 2010년자로 질문 하나가 올라와 있네요,

```cpp
//질문: 아래와 같은 작업을 하고 싶은데 안 되네요, 어떻게 해야 하죠?

char test [] = { 'a', 'b', 'c', 'd', 'e' };
vector<char[]> v;
v.push_back(test);
```

정확히 제가 하고 싶은 작업입니다.  `test [ ]` 를 apple, banana, strawberry로 바꾸어 주면서 `v`에 `push_back`으로 넣어 주면 완벽하겠네요,

그리고 아래 답변이 가장 많은 vote를 받은 답변입니다:

*"배열을 벡터에 저장하는 것은 불가능합니다 (벡터가 아니라 어떤 표준 컨테이너 라이브러리도 마찬가지입니다). 컨테이너에 담을 수 있는 요소는 copiable과 assignable의 두 가지 성질을 가져야 하는데 배열은 이 두 가지 중 어느 것도 만족하지 않습니다"*

### vector<char []>는 정의할 수 없다

위 글 이외에도 비슷한 질문과 답변을 다룬 많은 포스트와 질의응답들에서 배열을 벡터의 원소로 쓰는 것은 불가능하다고 했습니다. 하지만 저는 무식했기 때문에 일단 어떻게든 될 거라고 생각하고 되는 대로 코드를 만들어 보았습니다.

가장 처음 시도한 방법은 위의 StackOverflow 질문자의 방법과 비슷했습니다. 보통 문자열을 char array 형태로 취급할 때 아래

```cpp
char word[] = "apple";
```

와 같은 방식을 사용하니, 'word[]' 꼴의 녀석들을 원소로 갖는 벡터를 정의하려면... 대충

```cpp
std::vector<char[]> words;
```

이런 걸 만들고

```cpp
for (int i=0; i<3; ++i) {
    char word[] = {0};
    cin >> word;
    words.push_back(word);
}
```

이렇게 밀어 넣으면 apple, banana, strawberry가 순서대로 들어가 주지 않을까 했던 것이죠. 하지만 이렇게 입력하면 words 벡터를 선언조차 못 하고 컴파일 에러가 발생합니다. 확실히 배열을 원소로 갖는 벡터는 만들 수 없는 것이 맞는 것 같네요.

### vector<char*>: char array를 가리키는 포인터로 벡터 만들기

그렇다면 가능한 방법 중 하나는, char array 자체를 벡터의 원소로 쓰는것은 포기하고, 대신 저장하고 싶은 char array 각각을 가리키는 char* 즉 char array의 포인터들을 벡터에 넣어 주는 것입니다. 우선 새 벡터 하나를 아래와 같이 선언하는 것은 잘 동작합니다.

```cpp
std::vector<char*> words;
```

그러면 이제 여기에 apple, banana, strawberry를 각각 가리키는 포인터들을 만들어서 push_back으로 넣어 줄 수 있을 것입니다.

```cpp
#define MAXLEN 50
for (int i=0; i<3; ++i) {
    char *word = new char [MAXLEN];
    cin >> word;
    words.push_back(word);
}
```

한 번 벡터에서 원소들을 하나씩 출력해 보면, 정상적으로 처리되었음을 알 수 있습니다.

```cpp
#define MAXLEN 50
for (int i=0; i<3; ++i) {
    cout << words[i] << "\n";
}

// 실행 결과
apple
banana
strawberry
```

`new`키워드를 사용해 객체를 새로 만들어내는 것이 중요합니다. 예를 들어 `new`를 사용하지 않고 아래와 같이 하는 것은 어떨까도 생각해 보았고, 실제로 아래 코드를 더 먼저 시도해 보았는데요,

```cpp
#define MAXLEN 50
for (int i=0; i<3; ++i) {
    char word[MAXLEN] = {0};
    cin >> word;
    words.push_back(word);
}
```

위의 코드로 만들어진 벡터에서 원소를 순차적으로 꺼내 보면 **strawberry만 세 개**가 나오는 것을 볼 수 있습니다. 아마 cin >> word를 수행할 때 이루어지는 동작이 그저 word라는 단일 포인터가 가리키는 대상 문자열을 apple -> banana -> strawberry로 바꾸는 것일 뿐이기 때문인 것 같습니다. `push_back` 동작은 같은 포인터를 벡터에 세 번 넣었을 뿐이고, 따라서 벡터의 모든 원소들은 같은 문자열을 가리키는 하나의 포인터에 불과하기 때문에, word 포인터가 for문 종료 후 마지막으로 가리키게 된 문자열인 strawberry만 세 번 출력되게 되는 것입니다.

```cpp
#define MAXLEN 50
for (int i=0; i<3; ++i) {
    cout << words[i] << "\n";
}

// 실행 결과
strawberry
strawberry
strawberry
```

결론적으로, char array로 이루어진 벡터를 만들고 싶지만 string 라이브러리를 사용할 수는 없다면, 저장하고 싶은 char array 각각을 가리키는 char형 포인터 char*을 원소로 갖는 벡터를 만들어 주는 방법으로 우회할 수 있겠습니다.

## References

1. [vector는 잊어버리고 그냥 std::string을 쓰세요](https://stackoverflow.com/questions/2392308/c-vector-of-char-array)
2. [STL 컨테이너는 copiable/assignable한 원소만 가질 수 있다 (1)](https://itecnote.com/tecnote/c-vector-of-char-array/)
3. [STL 컨테이너는 copiable/assignable한 원소만 가질 수 있다 (2)](https://copyprogramming.com/howto/c-vector-of-char-array)