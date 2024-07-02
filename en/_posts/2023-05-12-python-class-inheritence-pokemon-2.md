---
title: "[Python] Class Inheritence"
category: programming
tags:
  - python
created_at: 2023-05-12 07:43:00 +09:00
last_modified_at: 2024-04-15 09:42:23 +09:00
excerpt: "Let's brief how to `inherit` existing class to define new class and how it is useful."
---


## Inherit Existing Class

From last posting we had `Pikachu` class to provide Pikachu object.

```python
class Pikachu:
    def __init__(self):
        self.level = 1
        self.hit_point = 100
        self.atk = 20
        self.type = 'electric'
```

With this class we could create `Pikachu` object, but need to define new class if we want to create different type of pokemon objects.

Let's define another class dedicated to **Bulbasaur**.  Bulbasaur is designed to higher base HP but lower attack point, and typed to be **grass**.

```python
class Bulbasaur(self):
    def __init__(self):
        self.level = 1
        self.hit_point = 120
        self.atk = 15
        self.type = 'grass'
```

Now let's test by setting a battle between `Pikachu` and `Bulbasaur`.  I added `attack` method, which subtracts `atk` value of attacker from `hit_point` of defender.

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

Let's come to the battle!

```python
>>> a = Pikachu() # a is a Pikachu object
>>> b = Bulbasaur() # b is a Bulbasaur object

>>> a.attack(b) # Pikachu attacks!
>>> print(b.hit_point)
100
>>> b.attack(a) # Bulbasaur fights back!
>>> print(a.hit_point)
85
```

It seems to work well.  But requirements for program ever changes and it is all same for our simple pokemon game.

Some users started to complain that the battle system is too boring.  To meet their expectation you decide to introduce the concept of *defense*.

Now battle system is more complicated.  **Defense** value is assigned to all pokemons and in battle this value is substracted from attacker's `atk` value when attacker attempts to assault on defender.

And suggest that implementation was as follows:

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

**Defense value** for Pikachu was implemented by adding new instance variable `block`, and `attack` method also was modified.

But this modification fails in simulated battle:

```python
>>> a = Pichachu()
>>> b = Bulbasaur()
>>> a.attack(b)
AttributeError: 'Bulbasaur' object has no attribute 'block'
```

I modified `Pikachu` class but forgot to add `block` attribute also in the implementation of `Bulbasaur` class.  When `a.attack(b)` was tried, the script fails because `b` is an instance of `Bulbasaur` but my implementation of `Bulbasaur` does not have `block` as instance variable.

With two kind of pokemons I can add only two more lines to solve this error.  However, what if I already have 200 different kinds of pokemons?  I need to add total 400 lines to add this new feature.

**Inheritence** makes me be more efficient in dealing such a situation.  Rather than having individual implementations for `Pikachu` and `Bulbasaur`, I can a common parent class `Pokemon` and let it have every variables and methods which should be common to all kinds of pokemons I will impement.

### Try First!

Let's write `Pokemon` class to be common parent for `Pikachu` and `Bulbasaur`.  From the concept of my pokemons, it is obvious that `level`, `hit_point`, `atk`, `type` are common (and will be common).  And it also is obvious that every pokemon should have `attack` method, so this was also implemented in `Pokemon` common class.

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

Now I can redefine `Pikachu` class, but in this case by inheriting `Pokeon`.  In this case `Pokemon` is called `parent class` or `superclass`, and `Pikachu` is called `derivative class` or `child class` of `Pokemon`.

```python
class Pikachu(Pokemon):
    def __init__(self):
        super(Pikachu, self).__init__()
```

Now implementation of `Pikachu` class became far simpler than before, as most of the common implementations were moved to parent class `Pokemon`.  When defining new class based on existing class, child class automatically implements all the attributes and methods defined for its superclass.

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

New simpler `Pickchu` looks work well.  But, there should come a question.  What is the meaning of `super(Pikachu, self).__init__()`?

### super()

`super()` is a built-in class of python, and it allows any `child class` to access its `superclass` and call superclass's object variables and methods.  As writen in above `Pikachu` example, syntax to use `super` is `super(<Class Name>, <Instance Name>`).

`a = Pikachu()` works as follows:

- Instance `a` of class `Pikachu` is created.
- `a` calls initiator method `__init__`, defined in `Pikachu`.
- `super(Pikachu, a)` creates a temporary object of `Pokemon`.
- Temporary object calls `__init__` method defined in `Pokemon`.

In reality, this is not a 100% intuitive process.  Let's modify `Pikachu` class as follows to facilitate our understanding.

```python
class Pikachu(Pokemon):
    def __init__(self):
        A = super(Pikachu, self)
        A.__init__()
```

This is valid as same as our previous implementation.  Then, in which line of above code the `self.hit_point` is created and assigned 100 as its value?  It seems no better option is there than `A.__init__()`, but it looks like it should create `hit_point` and assign 100 to object `A`, not `self` or Pikachu instance.

So here is the point.  Even though what is called by `A.__init__()` is the initiator of superclass `Pokemon`, what it really does is to create object variables/methods for Pikachu instance `self`.

We shouldn't be confused `super` with directly calling superclass to superclass instance.  Let's see the differece in detail.

First of all, if I create an instance of `Pokemon` directly using `Pokemon()`, the instance has `level` attribute as designed.

```python
# A is instance of Pokemon
>>> A = Pokemon()
>>> print(A.level)
1
```

But the instance created by `super(Pikachu, a)` does not have `level` attribute.

```python
# A is temporary instance created using super
>>> a = Pikachu()
>>> A = super(Pikachu, a)
>>> print(A.level)
AttributeError: 'super' object has no attribute 'level'
```

And it is also not the case that above `AttributeError` was raised because `A` is still an instance of `Pokemon`, but not initiated yet.  Might it be?

```python
>>> a = Pikachu()
>>> A = super(Pikachu, a)
>>> A.__init__() # 슈퍼클래스 생성자를 호출해 본다
>>> print(A.level)
AttributeError: 'super' object has no attribute 'level'
```

Nope, there is no `level` attribute still after calling `__init__()`.  Furthermore, even when you check the type of `A` using `type(A)`.  It does not tell you that the type is `Pokemon`, but an inherent type `super`

So I reach a conclusion.

**`super` Never Returns an Instance of Superclass:** Even though `super()` provides an temporary object which can utilize methods defined in superclass, the temporary object is not ever same with the instance created by using the superclass itself directly.
{: .notice--warning}

**super().\__init__():** super(Pikachu, self).\__init__() can be replaced with super().\__init__(), and this expression is more dominant.  If you are using `super` keyword inside of some class which inherits other class we can omit the arguments like this.  But if you are using `super` without such context, those two argument - child class and exact instance name - must be given.
{: .notice--info}

### Why Inheritence is Good

Now we can write two child classes based on `Pokemon` as superclass.

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

See I added some modification in defining `Bulbasaur` to assign different HP, ATK and Type.

Battle again!

```python
>>> a = Pikachu()
>>> b = Bulbarsaur()
>>> a.attack(b) # Pikachu attacks!
>>> print(b.hit_point) # Check defender HP
100
>>> b.attack(a) # Bulbasaur fights back!
>>> print(a.hit_point) # Check defender HP
85
```

See how the implementations of each pokemons simplified and `attack` method was even undefined in child classes.  Furthermore, *defense* system can be introduced by modifying superclass `Pokemon` only.

```python
class Pokemon:
    def __init__(self):
        self.level = 1
        self.hit_point = 100
        self.atk = 20
        self.type = 'electric'
        self.block = 10 # Added block variable as defense value
    def attack(self, opponent):
        opponent.hit_point -= (self.atk - opponent.block) # Damage is reduced by defender's block value.

class Pikachu(Pokemon):
    def __init__(self):
        super().__init__()

class Bulbasaur(Pokemon):
    def __init__(self):
        super().__init__()
        self.hit_point = 120
        self.atk = 15
        self.type = 'grass'
        self.block = 15 # Bulbasaur has different value for block.
```

Although some changes were needed for `Bulbasaur` to make it have different `block` value, it became far concise in terms of implementation.  As your code becomes more complicated, the impact of inheritence will shine.

```python
>>> a = Pikachu()
>>> b = Bulbasaur()
>>> a.attack(b) # Pikachu attacks!
>>> print(b.hit_point)
115 # 120-(20-15)
>>> b.attack(a) # Bulbasaur fights back!
>>> print(a.hit_point)
95 # 100-(15-10)
```

## Method Overriding and Overloading

### Overriding

Suppose I want to give some more twist in the battle system - I want to apply different mechanism for `attack` method of `Bulbasaur`, abling Bulbasaur to inflict more damage to defender by the amount of its `block` value.  Users who prefer tanky pokemon will be interested in such system.

In this case, `Bulbasaur` cannot resort to superclass `Pokemon`'s `attack` class.  I can redefine `attack` method in the implementation of `Bulbasaur`.  If child class redefines a method originally defined in superclass, child class's one gets priority.  This is called **method overriding**.

```python
class Pokemon:
    def __init__(self):
        self.level = 1
        self.hit_point = 100
        self.atk = 20
        self.block = 10
    def attack(self, opponent):
        target.hit_point -= (self.atk - opponent.block)

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
        # Now Bulbasaur has different damage infliction system.
        opponent.hit_point -= self.atk + self.block - opponent.block
```

```python
>>> a = Pikachu()
>>> b = Bulbasaur()
>>> a.attack(b) # Pikachu attacks!
>>> print(b.hit_point)
115 # 120-(20-15); Pikachu uses default attack method from Pokemon superclass.
>>> b.attack(a) # Bulbasaur fights back!
>>> print(a.hit_point)
80 # 100-(15+15-10); Now Bulbasaur can deal more damage!
```

<!--
### Method Overloading

**Method overloading** is not related to inheritence but frequently bundled with method overriding and introduced.  Overloaded method have several different implementations, accepting different numbers and types of arguments.

Let's get back to our `Pokemon` class.

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

I changed `attack` method to intoduce defense system.  But, I can additionally

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
-->

