---
toc: true
toc_sticky: true
title: "파이썬 클래스 작성하기"
category: Programming
tags:
  - python
published: true
last_modified_at: 2023-05-09 18:09 +2044
use_math: true
---

### 클래스 만들기 - 피카츄!

`클래스`는 데이터와 기능을 묶어서 처리하기 위한 개념이다.  어떤 클래스를 정의하고 나면 그 클래스의 `인스턴스`를 생성할 수 있다.  동일한 클래스의 서로 다른 인스턴스들이 독립적으로 존재하면서 상호작용하거나 그렇지 않을 수 있다.

Pikachu라는 이름의 클래스를 작성해 보자.

```python
class Pikachu:

    def __init__(self):
        self.level = 1
        self.hit_point = 100
        self.atk = 20
```

이 클래스는 `레벨`, `체력(히트포인트 혹은 HP)`, `공격력`의 세 가지 속성을 가지고 있다.  `__init__`은 파이썬 예약어로 `생성자`라고 하며, 인스턴스를 생성할 때 최초로 실행되는 함수이다.  클래스에 종속되어 오직 해당 클래스의 인스턴스를 통해서만 호출될 수 있는 함수들을 `메서드`라고 한다.  따라서 \__init__은 메서드이다.

위 코드는 '피카츄라면 모름지기 이래야 한다' 라는 선언이다.  피카츄의 인스턴스들은 위의 세 가지 속성을 가지고 있어야 하고, 처음 생성된 피카츄의 인스턴스들에서 이 값들은 각각 1, 100, 20이어야 한다.  `self`는 이 클래스의 실체화된 인스턴스를 가리키기 위한 `대명사`이다.  예를 들어,

```python
a = Pikachu()
```

위의 코드는 a라는 이름으로 피카츄의 인스턴스 한 마리를 생성한다.  이후 a라는 이름은 피카츄 클래스 코드에 존재하는 self 자리에 똑같이 대입할 수 있다.  갓 만든 피카츄 a에 대해  `a.level`은 1이고, `a.hit_point`는 100이며, `a.atk`은 20이다. 이 세 변수들은 피카츄 객체 a의 `인스턴스 변수` 혹은 `객체 변수` 라고 불린다.

###  메서드 작성하기 (1) - 공격 당하기

```python
class Pikachu:

    def __init__(self):
        self.level = 1
        self.hit_point = 100
        self.atk = 20
        
    def get_damaged(self, damage):
        self.hit_point -= damage
```

피카츄를 상처 입히는 법을 `get_damaged`라는 함수로 작성했다.  이 함수 또한 피카츄 클래스에 종속되므로, 피카츄 클래스의 `메서드`이다.

```python
a.Pikachu() # a는 피카츄의 인스턴스이다

print(a.hit_point) # a카츄의 HP를 확인
>>> 100

a.get_damaged(10)
print(a.hit_point)
>>> 90
```

위 코드는 a카츄에 종속된 get_damaged 메서드를 호출한다.  10의 데미지를 받은 피카츄의 HP는 90이다.

### 메서드 작성하기 (2) - 공격하기

얻어맞기만 하는 것이 억울한 피카츄를 위해, 다른 피카츄를 공격할 수 있는 `attack` 메서드를 만들어 주자

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

attack 메서드는 다른 피카츄 (other_pikachu)를 인수로 받도록 작성되었다.  우리는 피카츄 클래스의 정의로부터 피카츄의 인스턴스가 get_damaged 메서드를 실행할 수 있다는 것을 알고 있다.  따라서 attack 메서드는 다른 피카츄(other_pikachu)를 인수로 받아 그 피카츄에 종속된 get_damaged를 호출함으로써 하나의 피카츄 객체가 다른 피카츄 객체를 공격 (HP를 낮추는 동작)을 할 수 있도록 정의되었다.  other_pikachu가 입을 피해량은 attack을 호출한 피카츄의 공격력(self.atk) 변수를 참조하여 결정된다.

```python
a = Pikachu() # a는 피카츄의 인스턴스이다. 이 녀석을 a카츄라고 하자
b = Pikachu() # b는 피카츄의 또 다른 인스턴스이다. 이 녀석은 b카츄라고 부르자

print(a.hit_point)
>>> 100
print(b.hit_point)
>>> 100

a.attack(b) # a카츄가 b카츄를 공격하도록 한다.

print(a.hit_point)
>>> 100
print(b.hit_point)
>>> 80

a.attack(a) # 혼란에 빠져 스스로를 공격하는 경우도 있을 것이다

print(a.hit_point)
>>> 80
print(b.hit_point)
>>> 80
```

### 메서드 작성하기 (3) - 번외

```python
class Pikachu:

    def __init__(self):
        self.level = 1
        self.hit_point = 100
        self.atk = 20
        self.def = 10 #방어력
        
    def get_damaged(self, damage):
        self.hit_point -= damage
        
    def attack(self, other_pikachu):
        other_pikachu.get_damaged(self.atk-self.def)
        
    def level_up(self):
        self.level += 1
        self.hit_point = 100
        self.atk += 1
        self.def += 1
```

방어력을 나타내는 인스턴스 변수 `def`를 추가하고, `get_damaged` 메서드를 수정하였으며, 레벨을 올려 주는 `level_up` 메서드를 추가했다.

피카츄의 설계도가 풍성해졌지만 몇 가지 문제가 있다.  이 피카츄에게는 '공격한다(`attack` 메서드)' 외에 아무 기술도 없고, 레벨에 따라 HP가 증가하지도 않는다.  `get_damaged` 메서드의 `damaged` 인자는 양수이든 음수이든 제한이 없기 때문에, `level_up` 메서드를 20번 호출해서 레벨 21에 방어력 30이 된 피카츄를 레벨 1인 다른 피카츄가 공격하면 공격이 무효화되는 것이 아니라 오히려 체력이 10만큼 회복된다.

원하는 기능을 갖는 설계가 되도록 클래스 명세를 계속 수정하면 된다.