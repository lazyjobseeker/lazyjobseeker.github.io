---
toc: true
toc_sticky: true
title: "파이썬 사용자 정의 클래스 (Class) 만들고 사용하기"
category: Programming
tags:
  - python
published: true
last_modified_at:
use_math: true
---

클래스의 구성 요소들을 살펴보고 사용자 정의 클래스를 작성하여 사용해 본다

## 클래스 만들기

`클래스`는 데이터와 기능을 묶어서 처리하기 위한 개념이다.  어떤 클래스를 정의하고 나면 그 클래스의 `인스턴스`를 생성할 수 있다.  `인스턴스`는 클래스에서 정의하는 바에 따라 자신에게 종속되는 변수와기능들을 다른 인스턴스로부터 독립적으로 다룰 수 있게 된다.

이제 포켓몬스터 게임을 상상하며, 피카츄 클래스를 정의하고 이를 이용해 실제로 피카츄를 만들어 보자.

### 생성자

```python
class Pikachu:

    def __init__(self):
        self.level = 1
        self.hit_point = 100
        self.atk = 20
```

Pikachu라는 이름으로 피카츄를 만들기 위한 클래스를 작성해보았다.  Pikachu 클래스는 레벨(level), HP(hit_point), 공격력(atk)의 세 가지 속성을 갖도록 하였다.  위 코드는 실제로 구체화된 어떤 피카츄의 속성을 나타내는 것이 아니며, '피카츄라면 모름지기 이래야 한다' 라는 규정 혹은 설계 명세서의 역할을 한다.

이 설계도를 이용하여 실제 피카츄를 만드는 방법은 아래와 같다.  아래의 코드는 a라는 변수명을 갖는 피카츄 한 마리를 만들어 낸다.

```python
>>>a = Pikachu()
```

`__init__` 은 어떤 클래스의 `인스턴스`를 생성할 때 최초로 호출(실행)되는 함수이다.  이것을 `생성자`라고 한다.

### self?

생성자 `__init__`은 `self`라는 생소한 인수를 받도록 되어 있다.  `self`는 앞으로 Pikachu 클래스를 이용하여 만들어지게 될 임의의 인스턴스를 가리키는 지시대명사이며, 클래스를 정의할 때만 사용된다.  정의된 클래스를 이용하여 실제로 무언가를 하기 위해서는 `a = Pikachu()`와 같이 Pikachu 클래스의 인스턴스를 만들어 주어야만 한다.  a라는 인스턴스를 만들고 나면 self를 모두 a로 치환하여 'a의 레벨 (self.level -> a.level)', 'a의 HP (self.hit_point -> a.hit_point)', 'a의 공격력 (self.atk -> a.atk)'와 같이 쓸 수 있게 된다.

이제 피카츄 한 마리를 만들어 속성들을 확인해 보자.

```python
>>>a = Pikachu()

>>>print(a.level)
1
>>>print(a.hit_point)
100
>>>print(a.atk)
20
```

a라는 이름으로 피카츄를 만들었으므로, self 자리에 a를 넣는 것으로 갓 만들어진 피카츄 a의 레벨과 HP, 공격력을 확인할 수 있다.  이 세 변수들을 피카츄 객체 a의 인스턴스 변수 혹은 객체 변수 라고 부른다.

### 객체와 인스턴스

클래스, 객체, 인스턴스라는 용어들은 보통 아래와 같이 구분한다.

- `객체`는 소프트웨어 세계에 실체화된 대상이다.
- `클래스`는 객체를 구현하기 위한 설계도이다.
- `인스턴스`는 클래스를 통해 실제로 구체화한 객체를 지칭한다.

정의에 치중하기보다는 어떤 용례가 보다 자연스러운지를 살펴보는 것이 도움이 될 것이다.  위의 피카츄 예시에서는 주로 아래와 같은 기술이 자연스럽다:

>가-1) a는 객체이다
>
>가-2) a는 Pikachu 객체이다
>
>가-3) a는 Pikachu 클래스의 인스턴스이다

아래의 표현들은 조금 부자연스럽다.

>나-1) a는 인스턴스이다
> 
>나-2) a는 Pikachu의 객체이다
> 
>나-3) a는 Pikachu 인스턴스이다

Pikachu는 내가 실체화하고 싶은 피카츄라는 존재를 지칭하거나 (객체), 실제로 그러한 피카츄를 만들어내기 위한 설계도를 지칭한다 (클래스).  그런데 후자의 의미로 사용될 때는 'Pikachu 클래스' 라고 명시적으로 표현하는 경우가 많고 Pikachu라고만 쓰는 경우는 드물다.  또한 인스턴스라는 단어는 특정 객체가 어떤 클래스를 통해 실체화된 것인지가 중요한 경우에 그 관계를 명확히 하고자 하는 맥락에서 주로 사용된다.

굳이 따지자면 나-1)은 클래스와의 관계성이 누락되어 의미가 부족한 진술이다.  나-2)와 나-3)은 이와 같이 쓸 수도 있겠지만 각각 가-2) 혹은 가-3)과 같이 쓰는 경우를 훨씬 자주 접하게 될 것이다.

## 메서드

클래스에 종속되어 오직 해당 클래스의 인스턴스를 통해서만 호출될 수 있는 함수들을 `메서드`라고 한다.  따라서, 앞 절에서 처음 등장한 생성자 \__init__ 또한 메서드이다. \__init__ 이외에도 피카츄를 위해 다른 메서드들을 정의해 줄 수 있다.

### 메서드 (1) - 피카츄 괴롭히기

```python
class Pikachu:

    def __init__(self):
        self.level = 1
        self.hit_point = 100
        self.atk = 20
        
    def get_damaged(self, damage):
        self.hit_point -= damage
```

피카츄를 상처 입히는 법(=HP를 낮추는 법)을 `get_damaged`라는 함수로 작성했다.  이 함수 또한 피카츄 클래스에 종속되므로 피카츄 클래스의 `메서드`이다.

이제 피카츄 한 마리를 소환하여 get_damaged 메서드를 호출해 보자.  get_damaged가 클래스에 종속되지 않는 일반 함수였다면 get_damaged()라고만 써 주고 괄호 안에 인수들을 집어넣었겠지만, 메서드는 특정 클래스의 인스턴스가 존재할 때 해당 인스턴스를 통해서만 호출될 수 있다.  a라는 피카츄 객체를 만들어 get_damaged 메서드를 호출하게 하려고 하면, a.get_damaged() 형태로 쓴 다음 괄호 안에 필요한 인수들을 넣어 주어야 한다.

그러면 이 두 인수들을 어떻게 넣어 주어야 할까?  get_damaged가 두 개의 인수 `self`와 `damage`를 받도록 되어 있는데, 앞에서 `self`는 실제 인스턴스를 가지고 작업할 때에는 쓸 일이 없는 대명사일 뿐이고 실제로 사용되기 위해서는 인스턴스를 생성한 다음 인스턴스 이름으로 바꿔 주어야 한다고 했다.

그러면 damage 인수에는 정수 10을 넣기로 한다면, 아래와 같이 하면 될까?

```python
>>>a = Pikachu()
>>>a.get_damaged(a, 10) # self는 대명사이니 a로 바꾸었다. damage는 10을 넣기로 한다.
```

그렇지 않다.  get_damaged를 호출하는 데 필요한 `self` 인수는 . 앞에 놓인 a에 의해 주어진 것으로 보고, 괄호 안에는 `self`를 제외한 인수(들), 이 경우에는 damage 인수만을 넘겨 주면 된다.

즉, 아래와 같이 된다.

```python
>>>a = Pikachu() # a는 Pikachu 클래스의 인스턴스
>>>print(a.hit_point) # a 피카츄의 HP를 확인
100
>>>a.get_damaged(10) # Pikachu 객체 a가 get_damaged 메서드를 호출 (damage=10)
>>>print(a.hit_point)
90
```

10의 데미지를 받은 피카츄의 HP가 90이 되었다.

**self를 인수로 갖지 않는 메서드** 클래스 내부에 정의되어 있으면서도 self 인수를 갖지 않는 메서드를 만들 수 있다.  우선은 self를 인수로 받는 경우만 다루기로 한다.  관심이 있다면 '정적 메서드 (static method)'와 '클래스 메서드 (class method)'를 검색해 보자. {: .notice--info}

### 메서드 (2) - 몸통박치기!

억울한 피카츄를 위해, 다른 피카츄를 공격할 수 있는 `attack` 메서드를 만들어 본다.

```python
class Pikachu:

    def __init__(self):
        self.level = 1
        self.hit_point = 100
        self.atk = 20
        
    def get_damaged(self, damage):
        self.hit_point -= damage
        
    def attack(self, other_pikachu):
        other_pikachu.get_damaged(self.atk)
```

`attack` 메서드는 다른 피카츄 (other_pikachu)를 인수로 받도록 작성되었다.  피카츄 클래스의 정의로부터 피카츄의 인스턴스가 `get_damaged` 메서드를 호출할 수 있다는 것을 이미 알고 있다.  그러므로 공격당할 피카츄(other_pikachu)를 인수로 받아, 공격당할 피카츄에 종속된 `get_damaged`를 호출함으로써 그 HP를 낮추는 방식으로 attack 메서드를 구현하였다.  other_pikachu가 입을 피해량은 attack을 호출한 피카츄의 공격력(self.atk) 변수를 참조하여 결정하였다.

이제 피카츄 두 마리를 만들고, 한 녀석이 다른 녀석을 공격하도록 해 보자.  몸통박치기!

```python
>>>a = Pikachu() # 피카츄 클래스의 인스턴스 a를 만들었다.
>>>b = Pikachu() # 또 다른 피카츄 객체 b를 만들었다.

# 체력을 확인해 보자
>>>print(a.hit_point)
100
>>>print(b.hit_point)
100

# a 피카츄의 몸통박치기!
>>>a.attack(b)

# HP를 확인해 보자
>>>print(a.hit_point)
100
>>>print(b.hit_point)
80

# a 피카츄는 흥에 취한 나머지 상태이상에 빠져 스스로를 공격했다...
>>>a.attack(a)

# 막상막하의 대결이 되었다
>>>print(a.hit_point)
80
>>>print(b.hit_point)
80
```



## 메서드 (3) - 잘했어 피카츄

```python
class Pikachu:

    def __init__(self):
        self.level = 1
        self.hit_point = 100
        self.atk = 20
        self.is_in_monsterball = false
        
    def get_damaged(self, damage):
        self.hit_point -= damage
        
    def attack(self, other_pikachu):
        other_pikachu.get_damaged(self.atk)
        
    def level_up(self):
        self.level += 1
        self.hit_point += 10
        self.atk += 1
        print(f"피카츄는 레벨 {self.level}이 되었다!")
        print(f"피카츄의 HP: {self.hit_point}")
        print(f"피카츄의 공격력: {self.atk}")
        
    def retrieve(self):
        print("피카츄, 돌아와!")
        self.is_in_monsterball = true
        print("피카츄는 몬스터볼로 돌아왔다!")
```

레벨을 올려 주는 `level_up` 메서드를 추가하였고, 새 인스턴스 변수 `is_in_monsterball` 을 추가하여 피카츄가 몬스터볼 안에 들어 있으면 `true`라고 두기로 하되 기본값은 `false`로 두었다.

피카츄의 설계도가 풍성해졌다.  '공격한다(`attack` 메서드)' 외에 아무 기술도 없고, 레벨에 따라 HP가 증가하지도 않으며, 체력보다 큰 데미지를 입어도 아무 반응도 하지 않지만, 클래스 명세는 원하는 기능들이 원하는 형태로 완성될 때까지 계속 수정하면 된다.

마지막으로 `retrieve` 메서드를 만들어 피카츄를 몬스터볼로 회수하기로 했다.  나만의 피카츄를 한 마리 만들어 몬스터볼로 집어넣어 주고 다음 장으로 넘어가도록 하자.

```python
>>>my_pikachu = Pikachu()
>>>my_pikachu.level_up()
피카츄는 레벨 2가 되었다!
피카츄의 HP: 120
피카츄의 공격력: 21
>>>my_pikachu.retrieve()
피카츄, 돌아와!
피카츄는 몬스터볼로 돌아왔다!
```