---
toc: true
toc_sticky: true
title: "파이썬 클래스 상속하기"
category: Programming
tags:
  - python
published: true
use_math: true
date_created:
created_at: 2023-05-12 07:43:00 UTC+09:00
last_modified_at: 2023-05-13 23:56:07 UTC+09:00
---

만들어 둔 클래스를 상속하여 새로운 파생 클래스를 만드는 방법을 알아본다.

## 클래스 상속하기

이전 포스팅에서 만들어 두었던 피카츄 클래스를 떠올려 보자.

```python
class Pikachu(self):
    def __init__(self):
        self.level = 1
        self.hit_point = 100
        self.atk = 20
```

이 클래스로 충분히 피카츄 객체를 만들 수 있었지만, 다른 포켓몬 객체를 만들고 싶어지면 어떻게 할까?

이상해씨(Bulbasaur) 객체를 만들고 싶다는 생각으로, 아래와 같이 Bulbasaur 클래스를 추가로 작성할 수 있다.

```python
class Bulbasaur(self):
    def __init__(self):
        self.level = 1
        self.hit_point = 120
        self.atk = 15
```

Bulbasaur 클래스는 높은 기본 HP를 갖는 대신 낮은 공격력 수치를 갖도록 설계했다.

이제 피카츄와 이상해씨를 싸우게 하기 위해, 둘 모두에게 '공격' 메서드를 제공해야 할 것이다.

```python
class Pikachu(self):
    def __init__(self):
        self.level = 1
        self.hit_point = 100
        self.atk = 20
    def attack(self, target):
        target.hit_point -= self.atk  

class Bulbasaur(self):
    def __init__(self):
        self.level = 1
        self.hit_point = 120
        self.atk = 15
    def attack(self, target):
        target.hit_point -= self.atk
```

Pikachu 클래스와 Bulbasaur 클래스에 각각 `attack` 메서드를 구현해 주었다.  물론 이 구현은 인수로 전달되는 `target` 이 `hit_point` 객체 변수를 가지고 있는 것을 전제한다.  즉 실제로 호출되는 경우 target은 반드시 Pikachu 클래스 또는 Bulbasaur 클래스의 인스턴스여야 한다.

여기까지 하고 나면 우선 피카츄와 이상해씨가 포켓몬 대결을 하도록 할 수 있다.

```python
>>> a = Pikachu() # a는 피카츄 객체이다
>>> b = Bulbasaur() # b는 이상해씨 객체이다

>>> a.attack(b) # 피카츄의 공격
>>> print(b.hit_point)
100
>>> b.attack(a) # 이상해씨의 반격
>>> print(a.hit_point)
85
```

그런데 피카츄 객체의 설계가 복잡해짐에 따라 다음과 같은 변경이 발생했다고 생각해 보자:

```python
class Pikachu:
    def __init__(self):
        self.level = 1
        self.hit_point = 100
        self.atk = 20
        self.block = 10
    def attack(self, target):
        target.hit_point -= (self.atk - target.block)

class Bulbasaur:
    def __init__(self):
        self.level = 1
        self.hit_point = 120
        self.atk = 15
    def attack(self, target):
        target.hit_point
```

`attack` 메서드를 호출하여 상대를 공격할 때 무조건 공격자의 `atk`만큼의 피해를 주는 전투 시스템이 너무 밋밋해서, 방어력을 나타내는 `block`을 새로운 속성으로 추가해 주었다.  이제 피카츄 객체가 `target`을 공격하더라도 (attack 메서드 호출), 피카츄 객체는 자신의 `atk` 변수 값에서 `target`의 `block`변수만큼의 값을 뺀 만큼의 피해만 입힐 수 있다.

하지만 이 변경은 정상적으로 동작하지 않는다.

```python
>>> a = Pichachu()
>>> b = Bulbasaur()
>>> a.attack(b)
AttributeError: 'Bulbasaur' object has no attribute 'block'
```

`attack` 메서드는 이상해씨 클래스의 인스턴스 b를 인자로 받아, `b.hit_point`의 값을 `a.atk-b.block` 만큼 낮추는 동작을 하려고 한다.  하지만 이상해씨 클래스의 설계에는 아직 block이라는 객체변수가 추가되지 않았기 때문에, `b.block`은 존재하지 않고 AttributeError를 유발한다.

물론 피카츄 클래스에 block 객체변수를 추가하고 attack 메서드의 명세를 변경했다면, 이상해씨 클래스에도 같은 변경을 가하는 것이 당연히 자연스럽지 않느냐고 할 수 있다.  정말로 그렇다.  하지만 문제는 이런 식으로 작업하게 되면 두 포켓몬의 클래스 명세에 한 줄씩을 추가하고 (block 변수 선언), attack 메서드의 HP 손실 계산 부분까지 포함해 클래스당 두 줄씩을 직접 손봐야 한다는 것이다.  지금은 피카츄와 이상해씨만 있으니 한 녀석당 두 줄씩 네 줄 정도 손보는 것이 별 것 아닌 것처럼 보이겠지만, 200종의 포켓몬이 있다면 꼼짝없이 400줄을 빠짐없이 수정해 주어야 한다.

이 지점에서 클래스 상속(inheritence)을 적용할 수 있다.  모든 포켓몬 클래스를 개별적으로 작성하는 대신, 공통된 요소를 묶어 관리할 수 있는 템플릿을 만들고 그 템플릿으로부터 개별 포켓몬 클래스들을 얻도록 하는 것이다.

그러므로 개별 포켓몬 클래스들이 가지는 공통점들로 Pokemon 클래스를 작성해 보자.  어떤 포켓몬이건 간에 레벨과 HP를 가질 것이고, '공격' 메서드도 가질 수 있을 것이다.

```python
class Pokemon:
    def __init__(self):
        self.level = 1
        self.hit_point = 100
        self.atk = 20
    def attack(self, target):
        target.hit_point -= self.atk
```

이 클래스는 모든 포켓몬 클래스를 찍어내는 원형이 된다.  이 클래스를 상속하여 Pikachu 클래스를 작성하려면 다음과 같이 하면 된다.

```python
class Pikachu(Pokemon):
    def __init__(self):
        super(Pikachu, self).__init__()
```

위 코드는 Pokemon 클래스를 상속하여 Pikachu 클래스를 정의하고 있다.  이 때 Pikachu 클래스는 Pokemon 클래스의 `파생 클래스`, Pokemon 클래스는 Pikachu 클래스의 `슈퍼클래스`라고 한다.

## super

`a = Pikachu()`를 실행하면 Pikachu 클래스의 생성자인 \__init__이 가장 먼저 호출되고, 생성자는 다시 super().\__init__()을 호출하도록 되어 있다.  super().\__init__()은 슈퍼클래스인 Pokemon의 생성자를 호출하는 명령이지만, 실제로는 슈퍼클래스 Pokemon의 인스턴스가 아닌 파생클래스 Pikachu의 인스턴스 a를 조작하는 작업을 수행한다.

상속 개념 없이 작성했던 Pikachu 클래스의 경우 인스턴스가 생성될 때 Pikachu 클래스의 생성자에서 인스턴스 변수 생성과 값 할당을 직접 진행했다.  하지만 상속을 이용해 작성한 위의 Pikachu 클래스 코드에서  `a = Pikachu()` 는 아래의 순서로 동작한다.

- Pikachu 클래스의 인스턴스 a가 생성된다.
- 생성자 a.\__init__()이 호출된다.
- super(Pikachu, a).\__init__()이 실행된다. (self는 대명사!)
- a.level에 1, a.hit_point에 100, a.atk에 20이 각각 할당된다.

즉 `a = Pikachu()`를 실행하면 가장 처음 호출되는 super(Pikachu, a).\__init__()는 슈퍼클래스인 Pokemon의 생성자를 호출하는 명령이지만 -super(Pikachu, self)라고 쓰여 있지만, self는 대명사일 뿐이고 실제 동작에서는 생성된 인스턴스를 대입해 주어야 한다고 했다!-, 실제로는 슈퍼클래스 Pokemon의 인스턴스가 아닌 파생클래스 Pikachu의 인스턴스 a를 조작하는 작업을 수행한다.  결국  `super()`의 역할은 특정 파생 클래스 객체의 슈퍼클래스에 접근하여, 슈퍼클래스의 메서드를 이용해 파생클래스 객체를 조작하는 것이다.

super(Pikachu, a).\__init__()의 형태를 살펴보면 마치 super(Pikachu, a)가 반환하는 객체가 \__init__() 메서드를 실행하고 있는 것처럼 보인다.  만일 `A = Pokemon()`을 호출하여 Pokemon 클래스의 인스턴스 A를 만들었다면, A.\__init__()과 같은 형태로 Pokemon 클래스의 메서드 \__init__()을 호출할 수 있을 것이다.  그러면 super(Pikachu, a)와 A가 똑같이 Pokemon 클래스의 메서드를 실행할 수 있으므로, A가 Pokemon 클래스의 인스턴스이듯이 super(Pikachu, a) 또한 Pokemon 클래스의 인스턴스라고 생각할 수도 있을 것이다.

하지만 super(Pikachu, a)는 `A = Pokemon()`구문을 실행하여 얻어지는 Pokemon 객체 A와는 성격이 다르다.  구체적인 차이를 살펴보자.

```python
>>> A = Pokemon()
>>> print(A.level)
1
```

먼저 `A = Pokemon()`과 같이 Pokemon 클래스의 인스턴스를 직접 만드는 경우, A는 Pokemon 클래스에 구현된 객체 변수 level을 가지고 있다.  그러나,

```python
>>> a = Pikachu()
>>> A = super(Pikachu, a)
>>> print(A.level)
AttributeError: 'super' object has no attribute 'level'
```

super(Pikachu, a) 객체에는 level 변수가 존재하지 않는다.  혹시 super(Pikachu, a)를 통해 Pikachu 클래스의 슈퍼클래스인 Pokemon 클래스의 인스턴스가 생성된 것은 맞지만, 생성자 호출이 되지 않아 level 변수가 존재하지 않는 것은 아닐까?

```python
>>> a = Pikachu()
>>> A = super(Pikachu, a)
>>> A.__init__() # 슈퍼클래스 생성자를 호출해 본다
>>> print(A.level)
AttributeError: 'super' object has no attribute 'level'
```

그렇지 않다.  A.\__init__()을 호출한 뒤에도 A 객체는 여전히 level 속성을 갖지 않는다.  type(A)로 실제 A를 타입체크해 보더라도, A는 Pokemon 대신 `super`라는 고유 타입을 갖는 것으로 나온다.

**super()는 슈퍼클래스의 인스턴스를 리턴하지 않는다:** super()는 슈퍼클래스의 메서드를 사용하기 위한 임시 객체를 제공하기는 하지만, 해당 슈퍼클래스를 이용해 직접 구성한 인스턴스와 동일한 객체를 리턴하는 것은 아니다.
{: .notice--warning}

**super().\__init__():** Pikachu 클래스의 생성자에서 super(Pikachu, self).\__init__() 대신 super().\__init__()라고 써도 된다.  이 경우에는 클래스 정의 코드 내에서 사용되고 있기 때문에 super에 필요한 두 인자가 암시적으로 모두 주어져 있다 (파생클래스 Pikachu와 파생클래스의 임의 인스턴스를 나타내는 지시대명사 self).  그러나 클래스 정의 코드 밖에서 super를 호출하는 경우에는 어떤 클래스와 인스턴스에 대해 super가 호출되고 있는지에 대한 맥락이 없기 때문에 이들을 명시해 주어야 한다.
{: .notice--info}

## 상속 적용의 이점

이제 Pokemon 클래스를 이용하여 피카츄와 이상해씨 객체를 만들기 위한 두 개의 파생클래스를 아래와 같이 작성할 수 있다.

```python
class Pokemon:
    def __init__(self):
        self.level = 1
        self.hit_point = 100
        self.atk = 20
    def attack(self, target):
        target.hit_point -= self.atk

class Pikachu(Pokemon):
    def __init__(self):
        super(Pikachu, self).__init__()

class Bulbasaur(Pokemon):
    def __init__(self):
        super(Pikachu, self).__init__()
        self.hit_point = 120
        self.atk = 15
        
```

피카츄와 이상해씨 모두 Pokemon 클래스를 상속하고 있으며, 상속에 의해 구성된 파생 클래스들은 기본적으로 슈퍼클래스의 메서드를 그대로 사용할 수 있다.  즉 위 코드에서 피카츄 클래스와 이상해씨 클래스 각각의 구현에는 attack 메서드가 빠져 있지만, 이들의 인스턴스들은 여전히 슈퍼클래스 Pokemon에 구현된 대로 attack 메서드를 호출하여 사용할 수 있다.  그리고 이상해씨 클래스의 경우에는 피카츄와 다른 HP와 공격력을 갖도록 설계했던 이전 컨셉을 유지하기 위해, 슈퍼클래스 생성자 호출 이후 hit_point와 atk 변수 값을 재지정해 주었다.

```python
>>> a = Pikachu()
>>> b = Bulbarsaur()
>>> a.attack(b) # 피카츄의 공격!
>>> print(b.hit_point) # 공격당한 이상해씨의 HP 확인
100
>>> b.attack(a) # 이상해씨의 반격!
>>> print(a.hit_point) # 반격당한 피카츄의 HP 확인
85
```

attack 메서드를 별도로 각각 선언해주지 않아도 각 파생클래스의 인스턴스들이 attack 메서드를 사용할 수 있다는 것을 알 수 있다.  또한 방어력 개념을 적용하여 attack 메서드를 변경하는 경우에도, 슈퍼클래스인 Pokemon에서 정의된 attack 메서드 코드만 변경하면 된다.

```python
class Pokemon:
    def __init__(self):
        self.level = 1
        self.hit_point = 100
        self.atk = 20
        self.block = 10 # 방어력 속성을 추가하고 모든 포켓몬의 방어력 기본값을 10으로 한다
    def attack(self, target):
        target.hit_point -= (self.atk - target.block) # 상대의 방어력만큼 감소된 피해만 입힐 수 있다.

class Pikachu(Pokemon):
    def __init__(self):
        super(Pikachu, self).__init__()

class Bulbasaur(Pokemon):
    def __init__(self):
        super(Pikachu, self).__init__()
        self.hit_point = 120
        self.atk = 15
        self.block = 15 # 이상해씨는 방어력도 피카츄와는 다르게 설정하고 싶다
        
```

수정된 코드는 피카츄 클래스와 이상해씨 클래스에서 attack 메서드를 추가/수정하지 않았지만 아래와 같이 잘 작동한다.

```python
>>> a = Pikachu()
>>> b = Bulbarsaur()
>>> a.attack(b) # 피카츄의 공격!
>>> print(b.hit_point)
115 # 120-(20-15)
>>> b.attack(a) # 이상해씨의 반격!
>>> print(a.hit_point)
95 # 100-(15-10)
```

## 메서드 오버라이딩

만일 이상해씨의 경우 attack 메서드가 상대 포켓몬의 HP에 피해를 입히는 메커니즘을 다르게 구현하고 싶다면, 이상해씨 클래스에서 Pokemon 슈퍼클래스에 정의된 attack 메서드를 다른 내용으로 재정의해 주면 된다.  이를 메서드 `오버라이딩`이라고 한다.

```python
class Pokemon:
    def __init__(self):
        self.level = 1
        self.hit_point = 100
        self.atk = 20
        self.block = 10 # 방어력 속성을 추가하고 모든 포켓몬의 방어력 기본값을 10으로 한다
    def attack(self, target):
        target.hit_point -= (self.atk - target.block) # 상대의 방어력만큼 감소된 피해만 입힐 수 있다.

class Pikachu(Pokemon):
    def __init__(self):
        super(Pikachu, self).__init__()
        
class Bulbasaur(Pokemon):
    def __init__(self):
        super(Pikachu, self).__init__()
        self.hit_point = 120
        self.atk = 15
        self.def = 15
    def attack(self):
        # 이상해씨의 공격은 이상해씨의 방어력만큼의 피해를 추가로 입힌다!
        target.hit_point -= (self.atk + self.block - target.block)
        
```

오버라이딩된 메서드는 파생클래스에서 재정의된 방식대로 작동한다.  상황에 따라 상속과 오버라이딩을 적절히 활용하여 유연하게 클래스들을 설계할 수 있다.

```python
>>> a = Pikachu()
>>> b = Bulbarsaur()
>>> a.attack(b) # 피카츄의 공격!
>>> print(b.hit_point)
115 # 120-(20-15); 피카츄의 공격은 Pokemon 클래스에 정의된 기본 공격이다.
>>> b.attack(a) # 이상해씨의 반격!
>>> print(a.hit_point)
80 # 100-(15+15-10); 이상해씨는 자신의 방어력만큼 추가 피해를 준다!
```