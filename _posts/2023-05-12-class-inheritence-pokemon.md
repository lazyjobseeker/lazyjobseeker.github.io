---
toc: true
toc_sticky: true
title: "[Python] 클래스 상속 개념과 활용"
category: Programming
tags:
  - python
published: true
use_math: true
date_created:
created_at: 2023-05-12 07:43:00 UTC+09:00
last_modified_at: 2023-05-17 19:02:41 UTC+09:00
---

만들어 둔 클래스를 상속하여 새로운 클래스를 만드는 방법을 알아 봅시다.

## 클래스 상속하기

이전 포스팅에서 피카츄 객체를 만들기 위해 작성한 Pikachu 클래스를 떠올려 봅시다.

```python
class Pikachu:
    def __init__(self):
        self.level = 1
        self.hit_point = 100
        self.atk = 20
        self.type = 'electric'
```

Pikachu 클래스로 충분히 피카츄 객체를 만들 수 있었지만, 다른 종류의 포켓몬 객체를 만들고 싶다면 새로운 클래스를 정의해야 합니다.

이상해씨 객체를 만들기 위한 클래스를 정의해 봅시다.  클래스 이름으로는 포켓몬스터 게임에서 이상해씨의 공식 영문명인 Bulbasaur를 사용하겠습니다.

```python
class Bulbasaur(self):
    def __init__(self):
        self.level = 1
        self.hit_point = 120
        self.atk = 15
        self.type = 'grass'
```

Bulbasaur 클래스는 높은 기본 HP를 갖는 대신 낮은 공격력 수치를 갖도록 설계했고, 풀(grass) 타입의 포켓몬으로 정의하였습니다.

이제 피카츄와 이상해씨 객체를 하나씩 만들고 포켓몬 대결을 해 봅시다.  아직 Pikachu 클래스와 Bulbasaur 클래스에 서로 상대를 공격하기 위한 메서드가 없으니, attack 메서드를 두 클래스에 구현합니다.

```python
class Pikachu(self):
    def __init__(self):
        self.level = 1
        self.hit_point = 100
        self.atk = 20
        self.type = 'electric'
    def attack(self, opponent):
        opponent.hit_point -= self.atk  

class Bulbasaur(self):
    def __init__(self):
        self.level = 1
        self.hit_point = 120
        self.atk = 15
        self.type = 'grass'
    def attack(self, opponent):
        opponent.hit_point -= self.atk
```


attack 메서드는 상대 포켓몬 객체 (opponent)를 인수로 전달받아, opponent의 hit_point 변수를 공격자(self)의 공격력(atk) 변수 크기만큼 낮추도록 구현하였습니다.

이제 준비가 끝났으니 대결을 시작해 봅시다!

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

잘 작동하는 것 같습니다.

하지만 프로그램의 요구사항은 항상 변하기 마련이고 이것은 Pikachu와 Bulbasaur 클래스도 마찬가지입니다.

현재 Pikachu 클래스와 Bulbasaur 클래스에 정의된 attack 메서드는 오직 공격자의 공격력 변수만 참고하여 상대 포켓몬의 HP에 피해를 입힙니다.  이런 전투 시스템이 너무 밋밋하다고 생각하는 유저들을 만족시키기 위해 '방어력' 개념을 도입하고, 공격자의 공격력에서 수비자의 방어력을 뺀 만큼의 피해만을 입힐 수 있도록 attack 메서드를 수정하기로 했다고 생각해 봅시다.

위의 요구사항을 만족시키기 위해, Pikachu 클래스를 아래와 같이 수정하였습니다:

```python
class Pikachu:
    def __init__(self):
        self.level = 1
        self.hit_point = 100
        self.atk = 20
        self.type = 'electric'
        self.block = 10
    def attack(self, opponent):
        opponent.hit_point -= (self.atk - opponent.block)

class Bulbasaur:
    def __init__(self):
        self.level = 1
        self.hit_point = 120
        self.atk = 15
        self.type = 'grass'
    def attack(self, opponent):
        opponent.hit_point
```

피카츄의 방어력을 나타내기 위한 객체 변수의 이름을 block으로 정하고, attack 메서드는 공격자의 공격력 (self.atk)에서 수비자의 방어력 (opponent.block)을 뺀 만큼의 피해를 입히도록 수정했습니다.

하지만 이 변경은 정상적으로 동작하지 않습니다:

```python
>>> a = Pichachu()
>>> b = Bulbasaur()
>>> a.attack(b)
AttributeError: 'Bulbasaur' object has no attribute 'block'
```

Pikachu 클래스에 대해서는 원하는 변경들을 모두 완료하였지만 Bulbasaur 클래스에는 block 변수가 추가되지 않았습니다.  Pikachu 클래스의 인스턴스 a에서 a.attack(b)를 호출하면, attack 메서드는 인자로 전달받은 이상해씨 객체 b의 방어력 변수인 b.block에 접근하려고 합니다.  그러나 Bulbasaur 클래스에는 block 변수가 정의되지 않았기 때문에, b.block이라는 인스턴스 변수가 존재하지 않아 AttributeError가 발생하게 됩니다.

물론 포켓몬스터 게임 자체의 공격-수비 시스템을 변경하는 상황에서, 위 예시처럼 Pikachu 클래스만 수정하는 것은 일머리가 없는 것이 아니냐고 반문할 수도 있습니다.  정말로 그렇습니다.  하지만 문제는 이런 식으로 작업하는 경우 두 포켓몬 클래스의 세부 구현에 새 코드를 한 줄씩 추가하고 (block 변수를 총 두 번 선언해야 합니다), attack 메서드에서 수비자의 HP 손실을 계산하는 부분까지 포함해 총 네 줄을 직접 손봐야 했다는 것입니다.  지금이야 피카츄와 이상해씨만 다루고 있으니 네 줄 정도쯤이야 별 것 아닌 수정으로 보일 수 있겠지만, 200종류의 포켓몬이 있다면 꼼짝없이 400줄을 수정해 주어야 합니다.

이러한 경우에 클래스 **상속 (inheritence)**을 적용할 수 있습니다.  모든 포켓몬 클래스를 독립적으로 작성하는 대신, 공통된 객체 변수들 혹은 메서드들을 하나로 묶어 관리할 수 있는 하나의 클래스를 만들고, 이 하나의 클래스로부터 공통되는 요소들을 물려받되 필요한 부분에 대해서는 추가 구현을 더할 수 있는 하위 클래스들을 생산하는 방식으로 불필요한 반복을 피하는 것입니다.

### 일단 만들어 보기

개별 포켓몬 클래스인 Pikachu, Bulbasaur가 가지는 공통점들을 하나로 묶어 Pokemon 클래스를 작성해 봅시다.  Pokemon 클래스는 개별 포켓몬 클래스 구현들에 공통적으로 존재하는 레벨과 HP, 타입, 공격력 등의 변수들을 공통으로 갖고, 대결에서 상대를 공격할 수 있는 attack 메서드 또한 가질 수 있도록 정의하겠습니다.

```python
class Pokemon:
    def __init__(self):
        self.level = 1
        self.hit_point = 100
        self.atk = 20
        self.type = 'electric'
    def attack(self, opponent):
        opponent.hit_point -= self.atk
```

이제 Pikachu 클래스를 다시 정의하되, 이전과 달리 Pokemon 클래스를 상속하도록 해 봅시다.

```python
class Pikachu(Pokemon):
    def __init__(self):
        super(Pikachu, self).__init__()
```

위 코드에서 보듯이, 상속을 통해 새로운 클래스를 만들어낼 때는 클래스명 뒤에 바로 콜론(:)이 오는 것이 아니라, 클래스명과 콜론 사이에 괄호를 추가하고 괄호 안에 새로운 클래스가 상속하고자 하는 클래스 이름을 넣어 줍니다.  이 때 Pokemon 클래스를 Pikachu 클래스의 **부모 클래스** 혹은 **슈퍼클래스**라고 하고, Pikachu 클래스는 Pokemon 클래스의 **파생 클래스** 혹은 **자식 클래스** 라고 합니다.

Pikachu 클래스의 생성자는 기존 구현과 달리 레벨과 공격력 등을 정하는 코드를 따로 가지고 있지 않고, attack 메서드는 정의조차 되어 있지 않습니다.  하지만 Pokemon 클래스에서 이미 필요한 객체변수들과 attack 메서드를 구현하였기 때문에, 별도의 추가 구현을 하지 않아도 Pikachu 클래스의 인스턴스들에서 attack 메서드를 호출할 수 있습니다.

```python
>>> a = Pikachu()
>>> b = Pikachu()
>>> print(a.hit_point)
100
>>> print(b.hit_point)
100
>>> a.attack(b)
>>> print(b)
80
```

객체변수 level, hit_point, atk, type은 생성자 메서드가 호출될 때 실행되는 super(...).\__init__() 부분에서 할당되도록 되어 있습니다.  그런데 \__init__이 생성자라는 것은 알겠지만 super(...)가 무엇인지, 생성자 아래에 다시 생성자가 나오는 이유는 무엇인지는 생소합니다.

super가 무엇을 의미하는지 다음 절에서 살펴 봅시다.

### super()

super()는 특정 파생 클래스의 인스턴스로 하여금 자신의 슈퍼클래스에 접근하여 슈퍼클래스의 객체변수들과 메서드를 호출할 수 있도록 슈퍼클래스의 임시 객체를 만들어 반환해 주는 파이썬 내장 클래스입니다.  임시 객체를 반환받기 위해서는 **super(클래스명, 인스턴스명)**과 같이 써 주면 됩니다.

`a = Pikachu()`의 실행 과정은 아래와 같습니다.

- Pikachu 클래스의 인스턴스 a가 발생합니다.
- 인스턴스 a가 Pikachu 클래스에 정의된 생성자를 호출합니다.
- super(Pikachu, a)는 Pikachu의 슈퍼클래스인 Pokemon의 임시 객체를 만듭니다.
- 임시 객체가 슈퍼클래스에 정의된 생성자를 호출합니다.

사실 이 과정은 완벽하게 직관적이지는 않습니다.  Pikachu 클래스를 아래와 같이 고쳐 쓴 다음 `a = Pikachu()`의 실행 과정을 다시 생각해 봅시다.

```python
class Pikachu(Pokemon):
    def __init__(self):
        A = super(Pikachu, self)
        A.__init__()
```

- Pikachu 클래스의 인스턴스 a가 발생합니다.
- 인스턴스 a가 Pikachu 클래스에 정의된 생성자를 호출합니다.
- super(Pikachu, a)가 실행되어 슈퍼클래스의 임시 객체인 A를 만듭니다 (self는 대명사일 뿐 실행되는 시점에는 인스턴스 이름인 a로 바뀌어야 합니다!).
- A는 a의 슈퍼클래스인 Pokemon의 생성자를 호출합니다.

위 과정 중 어느 부분에서 a.hit_point 변수가 생성되어 정수 100을 할당받고 있을까요?  A.\__init__() 부분 말고는 마땅한 부분이 없어 보이기는 하는데, 이 부분은 a의 인스턴스 변수인 a.hit_point가 아니라, 슈퍼클래스의 임시 객체인 A의 인스턴스 변수 A.hit_point에 100을 할당해 주어야 할 것 같이 생겼습니다.  만일 여러분이 `a = Pikachu()`의 실행 결과가 무언가 부자연스럽다는 느낌을 받는다면 아마 이 때문일 것입니다.

우리는 super(Pikachu, a)가 반환하는 임시 객체 A를 용해 Pokemon의 생성자를 호출하지만, A가 호출한 생성자는 A가 아니라 super의 두 번째 인자로 전달된 a의 인스턴스 변수들을 작성하는 작업을 수행합니다.  그러므로 위의 Pikachu 클래스 구현에서 쓰인 A는 A = Pokemon() 과 같이 명시적으로 만들어낸 Pokemon 클래스의 인스턴스와 혼동하면 안 됩니다.

구체적인 차이를 살펴봅시다.

```python
# Pokemon 클래스의 인스턴스인 A
>>> A = Pokemon()
>>> print(A.level)
1
```
 
먼저 `A = Pokemon()`과 같이 Pokemon 클래스의 인스턴스를 직접 만드는 경우, A는 Pokemon 클래스에 구현된 객체 변수 level을 가지고 있습니다.  그러나, super(Pikachu, a)을 통해 만들어진 객체에는 level 속성이 존재하지 않고, 이 속성에 접근하려고 하면 AttributeError가 발생합니다.

```python
# super 내장 클래스를 경유하여 생성된 A
>>> a = Pikachu()
>>> A = super(Pikachu, a)
>>> print(A.level)
AttributeError: 'super' object has no attribute 'level'
```

혹시 super(Pikachu, a)를 통해 Pikachu 클래스의 슈퍼클래스인 Pokemon 클래스의 인스턴스가 생성된 것은 맞지만, 생성자를 호출하지 않아 level 변수가 존재하지 않는 것은 아닐까라고 생각할 수도 있겠습니다.  하지만,

```python
>>> a = Pikachu()
>>> A = super(Pikachu, a)
>>> A.__init__() # 슈퍼클래스 생성자를 호출해 본다
>>> print(A.level)
AttributeError: 'super' object has no attribute 'level'
```

A.\__init__()을 호출한 뒤에도 A 객체는 여전히 level 속성을 갖지 않는 것을 알 수 있습니다.

type(A)로 실제 A를 타입체크해 보더라도, A는 Pokemon 대신 `super`라는 고유 타입을 갖는 것으로 나옵니다.

**super는 슈퍼클래스의 인스턴스를 리턴하지 않습니다:** super()는 슈퍼클래스의 메서드를 사용하기 위한 임시 객체를 제공하기는 하지만, 해당 슈퍼클래스를 이용해 직접 구성한 인스턴스와 동일한 객체를 리턴하는 것은 아닙니다.
{: .notice--warning}

**super().\__init__():** Pikachu 클래스의 생성자에서 super(Pikachu, self).\__init__() 대신 super().\__init__()라고 써도 되고, 이 표현을 더 자주 사용하게 될 것입니다.  이 경우에는 super 키워드가 클래스 정의 코드 내에서 사용되고 있기 때문에 super에 필요한 두 인자가 암시적으로 모두 주어져 있어서 생략이 가능합니다 (파생클래스 Pikachu와 파생클래스의 임의 인스턴스를 나타내는 지시대명사 self).  그러나 클래스 정의 코드 밖에서 super를 호출하는 경우에는 어떤 클래스와 인스턴스에 대해 super가 호출되고 있는지에 대한 맥락이 없기 때문에 이들을 명시해 주어야 합니다.
{: .notice--info}

### 상속 적용의 이점

이제 Pokemon 클래스를 이용하여 피카츄와 이상해씨 객체를 만들기 위한 두 개의 파생클래스를 아래와 같이 작성할 수 있습니다.

```python
class Pokemon:
    def __init__(self):
        self.level = 1
        self.hit_point = 100
        self.atk = 20
        self.type = 'electric'
    def attack(self, opponent):
        opponent.hit_point -= self.atk

class Pikachu(Pokemon):
    def __init__(self):
        super().__init__()

class Bulbasaur(Pokemon):
    def __init__(self):
        super().__init__()
        self.hit_point = 120
        self.atk = 15
        self.type = 'grass'
```

이상해씨 객체를 구현하는 Bulbasaur 클래스의 경우 Pikachu와 다른 속성값을 가질 수 있도록 레벨을 제외한 다른 객체변수들에 다른 값들을 할당한 것을 확인할 수 있습니다.

이제 다시 한 번 포켓몬 대결입니다!

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

attack 메서드를 별도로 각각 선언해주지 않아도 각 파생클래스의 인스턴스들이 attack 메서드를 사용할 수 있다는 것을 알 수 있습니다.

또한 방어력 개념을 적용하여 attack 메서드를 변경하는 경우에도, 이전과 달리 슈퍼클래스인 Pokemon에서 정의된 attack 메서드의 코드만 변경하면 충분합니다:

```python
class Pokemon:
    def __init__(self):
        self.level = 1
        self.hit_point = 100
        self.atk = 20
        self.type = 'electric'
        self.block = 10 # 방어력 변수 추가
    def attack(self, opponent):
        opponent.hit_point -= (self.atk - opponent.block) # 상대의 방어력만큼 감소된 피해만 입힐 수 있다.

class Pikachu(Pokemon):
    def __init__(self):
        super().__init__()

class Bulbasaur(Pokemon):
    def __init__(self):
        super().__init__()
        self.hit_point = 120
        self.atk = 15
        self.type = 'grass'
        self.block = 15 # 이상해씨의 방어력은 피카츄와는 다르게 설정합니다.
```

이상해씨의 방어력을 피카츄와 다르게 하기 위해 Bulbasaur 클래스의 block 변수를 추가로 조정해 주기는 했지만, Pikachu 클래스의 경우에는 아무런 수정도 하지 않았고 Bulbasaur 클래스에도 attack 메서드와 관련한 수정은 불필요한 것을 확인할 수 있습니다.  구현하려고 하는 포켓몬의 종류가 많아지고 각 포켓몬 객체에 구현해야 하는 기능의 종류가 다양해질수록, 공통된 변수와 기능을 Pokemon 클래스로 정리해 두고 Pokemon 클래스를 상속하는 서로 다른 종류의 포켓몬 파생클래스들을 만들어 주는 방식이 유지보수에 훨씬 용이하게 될 것입니다.

```python
>>> a = Pikachu()
>>> b = Bulbasaur()
>>> a.attack(b) # 피카츄의 공격!
>>> print(b.hit_point)
115 # 120-(20-15)
>>> b.attack(a) # 이상해씨의 반격!
>>> print(a.hit_point)
95 # 100-(15-10)
```

## 메서드 오버라이딩 / 오버로딩

### 오버라이딩

만일 이상해씨의 경우에는 attack 메서드가 상대 포켓몬의 HP에 피해를 입히는 메커니즘을 다르게 구현하고 싶다고 생각해 봅시다.  예를 들어 이상해씨가 상대 포켓몬을 공격할 때는, 이상해씨의 방어력만큼 추가 피해를 입힐 수 있게 하고 싶습니다.

이런 경우에는 슈퍼클래스에 정의된 attack 메서드를 Bulbasaur 클래스에서 다른 내용으로 재정의해 주면 됩니다.

```python
class Pokemon:
    def __init__(self):
        self.level = 1
        self.hit_point = 100
        self.atk = 20
        self.block = 10 # 방어력 속성을 추가하고 모든 포켓몬의 방어력 기본값을 10으로 한다
    def attack(self, opponent):
        target.hit_point -= (self.atk - opponent.block) # 상대의 방어력만큼 감소된 피해만 입힐 수 있다.

class Pikachu(Pokemon):
    def __init__(self):
        super().__init__()
        
class Bulbasaur(Pokemon):
    def __init__(self):
        super().__init__()
        self.hit_point = 120
        self.atk = 15
        self.def = 15
    def attack(self, opponent):
        # 이상해씨의 공격은 이상해씨의 방어력만큼의 피해를 추가로 입힌다!
        opponent.hit_point -= self.atk + self.block - opponent.block
```

이처럼 슈퍼클래스에 정의되어 있는 메서드를 파생 클래스에서 다시 구현하는 것을 **메서드 오버라이딩**이라고 합니다.

```python
>>> a = Pikachu()
>>> b = Bulbasaur()
>>> a.attack(b) # 피카츄의 공격!
>>> print(b.hit_point)
115 # 120-(20-15); 피카츄의 공격은 Pokemon 클래스에 정의된 기본 공격이다.
>>> b.attack(a) # 이상해씨의 반격!
>>> print(a.hit_point)
80 # 100-(15+15-10); 이상해씨는 자신의 방어력만큼 추가 피해를 준다!
```

### 메서드 오버로딩

**메서드 오버로딩**은 상속과는 관련이 없는 내용이지만 오버라이딩과 한 묶음으로 소개되는 경우가 많습니다.  아마 단어가 비슷해 보여서 그렇지 않을까 합니다.

오버로딩은 이미 구현되어 있는 것과 같은 이름의 메서드를 여러 개 선언하여 각각 서로 다른 종류의 매개변수 입력을 받도록 하는 것을 말합니다.

Pokemon 클래스로 다시 돌아가 봅시다.  

```python
class Pokemon:
    def __init__(self):
        self.level = 1
        self.hit_point = 100
        self.atk = 20
        self.type = 'electric'
        self.block = 10
    def attack(self, opponent):
        opponent.hit_point -= (self.atk - opponent.block)
```

앞 절에서는 attack 메서드를 수정하여 방어력 개념을 도입했지만, 아래와 같이 attack 메서드를 아예 하나 더 작성하여 기존의 attack 메서드를 남겨 둘 수도 있습니다.

```python
class Pokemon:
    def __init__(self):
        self.level = 1
        self.hit_point = 100
        self.atk = 20
        self.type = 'electric'
        self.block = 10
    def attack(self, opponent, block):
        opponent.hit_point -= self.atk - block
    def attack(self, opponent):
        opponent.hit_point -= self.atk

class Pikachu(Pokemon):
    def __init__(self):
        super().__init__()
        
class Bulbasaur(Pokemon):
    def __init__(self):
        super().__init__()
        self.hit_point = 120
        self.atk = 15
        self.def = 15
```

Pokemon 클래스에서 이처럼 attack 메서드에 메서드 오버로딩을 적용하면, 모든 파생 클래스들은 attack 메서드에 어떤 매개변수를 전달하느냐에 따라 방어력 개념이 적용된 공격을 할 수도 있고 (위쪽 attack 메서드), 방어 무시 공격 (아래쪽 attack 메서드)을 할 수도 있게 됩니다.

```python
>>> a = Pikachu()
>>> b = Bulbasaur()
>>> a.attack(b, b.block) # 피카츄의 공격은 이상해씨의 방어력 b.block만큼 방어됩니다.
>>> print(b.hit_point)
115 # 120-(20-15)
>>> b.attack(a) # 이상해씨의 반격은 피카츄의 방어력을 무시합니다!
>>> print(a.hit_point)
85 # 100-15
```

