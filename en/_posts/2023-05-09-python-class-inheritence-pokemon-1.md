---
translated: true
title: "[Python] Class"
categories: Programming
tags:
  - python
created_at: 2023-05-10 06:59:45 +09:00
last_modified_at: 2024-04-09 17:19:37 +09:00
header:
  teaser: /assets/images/uncategorized-teaser-3.png
excerpt: "Let's brief how to define and use classes in python."
---

## Class

**Class** is a concept introduced with **object-oriented programming**.  Class is a concept to bundle data and functionalities to handle the data.  After defining a class, we can create **instances** of that class.  We can create multiple instances from a class and after creation those instances can be handled as unique entity which is independent from one another.

Suppose we come to have an eager to develop our own Pokemon game.  Let's try defining our first custom class `Pikachu`.

### Defining Class

```python
class Pikachu:
    def __init__(self):
        self.level = 1
        self.hit_point = 100
        self.atk = 20
        self.type = 'electric'
```

I wrote `Pikachu` class as above.  There are 4 attributes: Level (`level`), HP (`hit_point`), Attack (`atk`) and Type (`type`).  This is simple but we can add more attributes if we want to implement more intricate system.

This `Pikachu` class is a blueprint to create Pikachu `objects` or `instances` which we will handle hereafter.  Before reviewing in detail, let's dive in and create a Pikachu.

```python
>>> a = Pikachu()
```

Variable `a` was assigned to a Pikachu object or `instance`.  According to the blueprint, we know `a` should have all 4 attributes we intended.  We can access these values as follows:

```python
>>> print(a.level)
1
>>> print(a.hit_point)
100
>>> print(a.atk)
20
>>> print(a.type)
electric
```

These 4 variables are dependent to instance `a` and so they are called **instance variables** of instance `a`.  You can call them as **object variables** also.

### Class, Object, Instance

Before detailing above code defining `Pikachu` class, let's clarify terminology.  Rather than give dry definitions for each each concept, let me give you some *descriptions* which you will encounter frequently based on our `Pikachu` class example.

We did:

- Thought Pikachu `object` which would be part of our custom pokemon game.
- To create Pikachu `object` defined `Pikachu` `class`.
- Using `Pikachu` class, created `instance` `a` which will navigate and engage in battle in our pokemon world.

General explanation to distinguish `Object`, `Class` and `Instance` is as follows:

- **Object** is what you want to realize in software world.
- **Class** is a design sheet to create Object.
- **Instance** is an embodiment of object, created using class, some physical memory actually assigned for.

So `object` is the most abstract one and `instance` is the most concrete one.  But in everyday use distinction between those two are frequently vague.  For example, even though in strict sense `a` is instance, we also state like "Let's think about how our object `a` works here".  In such context, `object` is just a synonym for `instance` or we can think there is a realation like `instance`$\subset$`object`

However, in some context mixed use of the terms is obviously weird.  For example, when we talk about the `Pikachu` class I wrote above, statement like "How can I modify this `instance` to solve the issue?" is inappropriate, because the implementation of `Pikachu` is about the design but about any physically embodied entity from it.

And there could be more complicated situation.  Let's consider I am a member of a large team developing pokemon game, but my team is a subset of larger business and our team is working only for Windows-based pokemon games.  And within our team the class in use to handle Pikachu is implemented in the name of `PikachuWindows`.  But from different section of our business, members of which are working on pokemon game for Gameboy console, suppose they are using different class `PikachuGameboy`.

Now I hear evaesdropped during lunch that it was decided that we will modify Pikachu class, to render our Pikachu to have *grass* type than original *electric* type.  Suppose that during afternoon the conversation stuck with me and at some point, without knowing myself doing that, I modified `type` variable of `PikachuWindows` from *electric* to *grass*.  And on the next day I hear that the converation was between Gameboy dev team and the change was to be applied solely for `PikachuGameboy` as they were working on some April fool update...

Above example is just a joke but in such sense `object` and `class` also are also different each other.  We had `Pikachu` class only, but in many different context there could be one or more different implementations (`class`) for the same `object`.

## Methods

Now let's get back to our implementation of `Pikachu` class.

```python
class Pikachu:
    def __init__(self):
        self.level = 1
        self.hit_point = 100
        self.atk = 20
        self.type = 'electric'
```

**Method** is a function which is dependently implemented under specific class.  In the implementation above, one method named `__init__` is already defined. 

### Constructor `__init__` and `self` Keyword

This basic method `__init__` has special name, 'constructor'.  `__init__` is an reserved method name for constructor, and this is called for the very first time when instance creation is attempted.  When we created instance `a` of `Pikachu` class by `a = Pikachu()`, `__init__` was executed even though we did not explicitly called it.

Another reserved keyword `self` is used to designate arbitrary instance of `Pikachu`, which is not embodied inside our class.  Once an instance like `a` is created using the class, we can replace all those `self` with `a` to imagine how the methods and variables would work with created instance `a`.

Now let's see what happens when we execute `a = Pikachu()`.  Constructor is the very first method called, so `__init__(self)` should be executed.  But as we have instance named `a` now, actually executed is `__init__(a)`.  However, as in python syntax we call a method by pull the instance name out of the parenthesis, add period(.), and then method name follows.  So `a.__init__()` is what we actually execute here.

### Playing with Pikachu

```python
class Pikachu:
    def __init__(self):
        self.level = 1
        self.hit_point = 100
        self.atk = 20
        self.type = 'electric'
    def get_damaged(self, damage):
        self.hit_point -= damage
```

Now I wrote a method other than constructor, named `get_damaged`.  This method receives `damage` as extra argument, to reduce `hit_point` of a instance by the value passed to `damage`.

Let's see how this new method work.  Remark how we call `get_damaged` method as actual code: `self` is replaced by instance name `a` and pulled out of the parenthesis, leaving extra argument to pass damage value to be inflicted.

```python
>>> a = Pikachu()
>>> print(a.hit_point) # a Check hitpoint of pikachu
100
>>> a.get_damaged(10) # Inflict damage of 10 to pikachu instance a
>>> print(a.hit_point) # Check whether the method worked as intended
90
```

**Method Not Receiving `self` as Argument:** We can define method inside a class but make it work without `self` as argument.  Those cases will be briefed in later post in reviewing *Static Method* and *Class Method*.
{: .notice--info}

### Tackle!

Now let's write another method `attack`.

```python
class Pikachu:
    def __init__(self):
        self.level = 1
        self.hit_point = 100
        self.atk = 20
        self.type = 'electric'
    def get_damaged(self, damage):
        self.hit_point -= damage
    def attack(self, other_pikachu):
        other_pikachu.get_damaged(self.atk)
```

`attack` method was written to receive another pikachu instance (`other_pikachu`) as instance.  If there are two pikachu `a` and `b` and `a` pikachu calls its `attack` mehtod and pikachu `b` is passed as argument in that call, it would describe a pokemon battle situation - a pikachu attack and inflicting damage to other pikachu.

Let's check - pikachu, tackle!

```python
>>> a = Pikachu() # a is an instance of Pikachu
>>> b = Pikachu() # b is also an instance of Pikachu

# Check hitpoint
>>> print(a.hit_point)
100
>>> print(b.hit_point)
100

# a tackles!
>>> a.attack(b)

# Let's check HP.
>>> print(a.hit_point)
100
>>> print(b.hit_point)
80

# It is not forbidden for a pikachu to attack itself...
>>> a.attack(a) # a was confused to attack itself!

# It is a close battle now.
>>> print(a.hit_point)
80
>>> print(b.hit_point)
80
```

### Get Back!

```python
class Pikachu:
    def __init__(self):
        self.level = 1
        self.hit_point = 100
        self.atk = 20
        self.type = 'electric'
        self.is_in_monsterball = false
    def get_damaged(self, damage):
        self.hit_point -= damage
    def attack(self, other_pikachu):
        other_pikachu.get_damaged(self.atk)
    def level_up(self):
        self.level += 1
        self.hit_point += 10
        self.atk += 1
        print(f"Pikachu turned to level {self.level}!")
        print(f"Pikachu's HP: {self.hit_point}")
        print(f"Pikachu's ATK: {self.atk}")
    def retrieve(self):
        print("Pikachu, get back!")
        self.is_in_monsterball = true
        print("Pikachu got back to the monster ball!")
```

I tried some more thing with `Pikachu` class.  `level_up` method was added to increase pikachu's level, and new instance variable `is_in_monsterball` was added and set boolean to case-handling based on if a pikachu is in mosterball(`true`) or not(`false`)

Let's do some check to see all implementation is fine.

```python
>>> my_pikachu = Pikachu()
>>> my_pikachu.level_up()
Pikachu turned to level 2!
Pikachu's HP: 120
Pikachu's ATK: 21
>>> my_pikachu.retrieve()
Pikachu, get back!
Pikachu got back to the monster ball!
```