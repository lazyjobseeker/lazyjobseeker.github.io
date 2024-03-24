---
lang: ko
toc: true
toc_sticky: true
title: "pickle 관련 오류 조치 방법"
category: Programming
tags:
  - python
  - pickle
published: true
use_math: true
created_at: 2023-12-05 13:35:24 +09:00
last_modified_at: 2024-03-06 18:11:13 +09:00
header:
  teaser: /assets/images/uncategorized-teaser-1.png
excerpt: "python의 직렬화 모듈 pickle 사용 시 ModuleNotFoundError가 발생하는 경우 해결 방법"
---

`pickle`은 파이썬에서 **객체 직렬화**를 위해 사용하는 모듈로, 파이썬 객체를 바이너리 파일로 저장하고 불러오기 위해 사용될 수 있습니다.

자료와 함수들을 특정한 구조로 정규화하여 다루기 위해 클래스를 디자인한 뒤 해당 클래스를 프로젝트 내에서 사용하다 보면, *"이 인스턴스는 저장해 뒀다가 나중에 불러와서 사용하고 싶다!"*고 생각하게 되는 시점이 오게 됩니다. 그리고 실제로 pickle은 이런 경우에 사용할 수 있는 가장 강력한 도구 중 하나입니다.

## pickle과 ModuleNotFoundError

하지만 프로젝트 코드는 계속 변경되기 마련이고, pickle을 이용해 바이너리 파일로 저장해 두었던 파일이 어느 순간 아래와 같은 오류와 함께 읽을 수 없게 되는 경우가 발생합니다.

```
ModuleNotFoundError: No module named 'your_module'
```

이러한 문제를 해결하는 방법에 대해 알아봅시다.

## 예시 프로젝트: pickle 모듈로 커스텀 클래스 인스턴스 저장하고 불러오기

우선, 프로젝트가 아래와 같이 구성되어 있다고 가정해 봅시다.

```
package
 ├─ __init__.py
 ├─ dog.py
 ├─ dogpickler.py
 └─ dogunpickler.py
```

**dog.py**에는 개 클래스 `Dog`가 아래와 같이 정의되어 있습니다. `bark`(짖기) 메서드 하나만을 갖는 간단한 클래스입니다.

```python
class Dog:
    def __init__(self):
        self.bark_sound = "Waloo!"
    def bark(self):
        print(self.bark_sound)
```


**dogpickler.py** 파일에서는 개 한 마리를 만들어서 짖게 만든 다음, 짖은 개의 인스턴스를 피클링(pickling)하여 바이너리 파일로 저장해 주겠습니다.

```python
import pickle
from dog import Dog

my_dog = Dog() # 개 한 마리 만들기
my_dog.bark() # 짖어!
with open('pickled-dog', 'wb') as f:
    pickle.dump(my_dog, f)

# 실행 결과
>>>Waloo!
```

개가 짖는 것을 잘 확인했다면 아래와 같이 'pickled-dog'파일이 잘 생성되었는지도 확인해 봅시다.

```
package
 ├─ __init__.py
 ├─ dog.py
 ├─ dogpickler.py
 ├─ dogunpickler.py
 └─ pickled_dog
```

그리고 **dogunpickler.py**에서는, Dog 클래스를 임포트하여 인스턴스 my_dog을 생성하는 대신, pickle 모듈을 이용해 pickled_dog을 로드하여 짖도록 만들어 줍니다.

```python
import pickle

# 이번에는 읽기 전용으로 열어 줍니다
with open('pickled-dog', 'rb') as f:
    my_dog = pickle.load(f)

my_dog.bark()

# 실행 결과
>>>Waloo!
```

## pickle.load 사용 시 ModuleNotFoundError 발생 원인

### 모듈 이름이 변경됨

위와 같은 방식으로 pickle을 사용하다 보면 마주하게 되는 `ModuleNotFoundError`의 발생 원인은 pickle.dump(f)를 수행할 때 임포트했던 dog.py 모듈에 변화가 생기는 경우입니다. 보다 정확히는, `sys.module`을 통해 인식되는 모듈 이름 정보에 변동이 발생한 것이 문제가 됩니다.

예를 들어 **dog.py** 파일의 이름을 **animal.py**로 바꾸는 경우를 생각해 볼 수 있습니다. pickled-dog 바이너리 파일은 dog 모듈이 존재하는 환경에서 만들어졌는데, 더 이상 해당 모듈을 찾을 수 없기 때문에 문제가 발생합니다.

```
package
 ├─ __init__.py
 ├─ animal.py # dog -> animal로 변경
 ├─ dogpickler.py
 ├─ dogunpickler.py
 └─ pickled_dog
 
# dogunpickler 실행 시:
>>>ModuleNotFoundError: No module named 'dog'
```

이 경우, sys 클래스를 임포트하고 sys.module 변수에서 'dog' 모듈을 찾을 수 있도록 해 주면 문제를 해결할 수 있습니다. 정확히는,

"`dog` 모듈을 찾고 있다면 `animal`을 대신 참조하세요"

라고 알려주어야 합니다.  dogunpickler.py를 아래와 같이 변경하면 작동합니다.

```python
import animal, sys #추가 임포트
import pickle

#'dog'모듈을 참조하려고 하면 'animal'로 리디렉션
sys.module['dog'] = animal

with open('pickled-dog', 'rb') as f:
    my_dog = pickle.load(f)

my_dog.bark()


# 실행 결과
>>>Waloo!
```

### 클래스 구조가 변경되는 경우?

그러면 `dog`모듈은 그대로 존재하지만, Dog 클래스의 명세가 변경되는 경우는 어떨까요?

몇 가지 경우를 생각할 수 있습니다.

#### 기존 인스턴스 변수를 변경한 경우

예를 들어, Dog 클래스에서 짖는 소리를 결정하는 `bark_sound` 인스턴스 변수를 아래와 같이 바꾸었다고 해 봅시다.

```python
class Dog:
    def __init__(self):
        # 화가 난 모양입니다
        self.bark_sound = "Grrr..."
    def bark(self):
        print(self.bark_sound)
```

하지만 dogpickler.py를 다시 실행하지 않았고, 따라서 pickled-dog 바이너리 파일은 여전히 짖는 소리가 "Waloo!"인 Dog 클래스만을 기억하고 있는 상태입니다.

이 상태에서 dogunpickler.py를 실행하면, pickled-dog는 Grrr...라고 짖지 않고 Waloo라고 짖습니다. 하지만 에러가 발생하지는 않습니다.

```
# 실행 결과
>>>Waloo!
```

심지어 `bark_sound` 인스턴스 변수의 이름 자체를 바꾼 경우라도, `pickle.load`를 실행하려고 할 때 ModuleNotFoundError가 발생하지는 않습니다. 하지만 `pickle.load`를 통해 로드된 my_dog 객체는 인스턴스 변수 my_dog.sound를 갖지 않습니다. my_dog은 Dog 클래스가 `bark_sound` 인스턴스 변수를 가질 때 생성되었기 때문입니다.

#### 인스턴스 변수를 추가한 경우

아예 새로운 인스턴스 변수를 추가하는 경우는 어떨까요?

```python
class Dog:
    def __init__(self):
        # 화가 난 모양입니다
        self.bark_sound = "Grrr..."
        # 털 색깔을 추가해 주었습니다
        self.color = "brown"
    def bark(self):
        print(self.bark_sound)
```

이 경우에도 위와 마찬가지로, ModuleNotFoundError는 발생하지 않고 정상적으로 my_dog.bark()를 호출하여 짖게 만들 수 있습니다 (물론 **Waloo**라고 짖습니다!). 그러나 my_dog.color 변수에 접근하려고 하면 AttributeError가 발생합니다.

#### 새로운 메서드를 추가한 경우

이번에는 새로운 메서드를 추가해 보겠습니다.

```python
class Dog:
    def __init__(self):
        # 화가 난 모양입니다
        self.bark_sound = "Grrr..."
        # 털 색깔을 추가해 주었습니다
        self.color = "brown"
    def bark(self):
        print(self.bark_sound)
    # 두 번 짖기 메서드를 추가
    def bark_twice(self):
        for i in range(2): self.bark()
    # 자기가 무슨 색인지 말하는 메서드입니다
    def show_color(self):
        print("I am a f{self.color} dog!")
```

물론, 기대하는 결과는 아래와 같습니다:

```python
Dog().bark_twice()
>> Grrr...
>> Grrr...

Dog().show_color()
>>> I am a brown dog!
```

이 상태에서 dogunpickler.py를 아래와 같이 바꾸고 실행해 봅시다 (dogpickler.py를 다시 실행하지 않습니다!).

```python
import pickle

with open('pickled-dog', 'rb') as f:
    my_dog = pickle.load(f)

my_dog.bark_twice()
my_dog.show_color()
```

```
# 실행 결과
>>>Waloo!
>>>Waloo!
>>>AttributeError: 'Dog' object has no attribute 'show_color'
```

따라서, 아래와 같이 정리할 수 있겠습니다.
- Unpickling 과정에서 발생하는 ModuleNotFoundError는, 원본 모듈 정보의 변경이 원인인 경우라면 `sys.module` 변수를 업데이트하여 해결할 수 있다.
- ModuleNotFoundError가 발생하지 않았다고 해서 모든 기능이 완벽하게 동작한다고 보장할 수 없다. 모듈에 변경 사항이 있었다고 해도, unpickle을 통해 로드한 객체는 모듈의 변경 이력을 알 수 없기 때문에 이로 인한 AttributeError가 발생할 수 있다.

## 프로젝트에서 pickle 잘 사용하기

위와 같은 문제를 겪은 이후로 저는 클래스 인스턴스 자체를 pickle로 직렬화하여 저장하는 방식은 가급적 사용하지 않고 있습니다. 자의적으로 구성된 클래스 인스턴스를 그대로 직렬화하여 저장하는 대신, JSON이나 dictionary등의 보다 기본적인 자료형으로 변환하여 pickle로 저장한 다음, 필요할 때 unpickle하여 커스텀 클래스의 인스턴스 변수들에 재할당하는 방식을 사용하고 있습니다.