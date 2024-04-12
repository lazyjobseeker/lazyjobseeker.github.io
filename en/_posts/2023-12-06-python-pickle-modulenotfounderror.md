---
translated: true
title: "How to Handle Errors in Using pickle"
category: programming
tags:
  - python
  - pickle
created_at: 2023-12-05 13:35:24 +09:00
last_modified_at: 2024-04-09 17:20:10 +09:00
header:
  teaser: /assets/images/uncategorized-teaser-4.png
excerpt: "How to solve ModuleNotFoundError in using Python's serialization module pickle."
---

`pickle` is a python module for *object serialization*.  Using this we can save and load python objects as binary file.

Working with the concept of object oriented programming, it is natural to organize related data and functions into custom class and handle objects of the class.  At some point it dawns to you that it must be efficient to store some object as binary file and load when you need it, then create the object every time you need it.  `pickle` is the strongest solution in handing such needs.

## ModuleNotFoundError in Working with pickle

When I was a newcomer to python and `pickle`, I faced a tragedic `ModuleNotFoundError`.  I had been happy to use my custom class (call it `your_module`) objects stored using `pickle`, but someday out of nowhere the file started to fail to be read:

```
ModuleNotFoundError: No module named 'your_module'
```

Starting from next section I will exemplify why such error occurs and how I could resolve it.

## Illustration with Example Project

Let me explain with below custom project structure.

```
package
 ├─ __init__.py
 ├─ dog.py
 ├─ dogpickler.py
 └─ dogunpickler.py
```

A custom class `Dog` is defined in **dog.py**.  A simple class, which can `bark`.

```python
class Dog:
    def __init__(self):
        self.bark_sound = "Waloo!"
    def bark(self):
        print(self.bark_sound)
```

**dogpickler.py** script create an instance of `Dog`, let it `bark` once, and store that `Dog` as a binary file using `pickle`.  The binary file is named `pickled-dog`, with no extensions given.  We can call this process of saving binary file **'pickling'**, or can say that I *pickled* my `my_dog` instance and saved it as `pickled-dog` file. 

```python
import pickle
from dog import Dog

my_dog = Dog() # Create a 'Dog' instance
my_dog.bark() # Bark!
with open('pickled-dog', 'wb') as f:
    pickle.dump(my_dog, f)

# Excution output
>>>Waloo!
```

After running `dogpickler.py`, you can find new file `pickled-dog` is created.

```
package
 ├─ __init__.py
 ├─ dog.py
 ├─ dogpickler.py
 ├─ dogunpickler.py
 └─ pickled-dog
```

Now move on to another script **dogunpickler.py**.  This class also makes `my_dog` object, but by loading data from `pickled-dog` rather than creating new instance.

```python
import pickle

# Now we load 'pickled-dog', with read-only option rb.
with open('pickled-dog', 'rb') as f:
    my_dog = pickle.load(f)

my_dog.bark()

# Execution output
>>>Waloo!
```

## ModuleNotFoundError in Using pickle.load()

### Changed Module Name

It is important to know that when `pickle` tries to restore your pickled object from saved binary file, it refers to `sys.module` to find out the module name with which the pickled object was created.

Keeping above Dog project in mind, let me exemplify a case where we can face an error.  In below case, suppose that I renamed `dog.py` file to `animal.py` after I pickled `my_dog` into `pickled-dog` binary file.

In this scenario, the result is `ModuleNotFoundError`.  This is because `pickle` cannot find the module `dog.py`, which was originally used in creating `pickled-dog`.

```
package
 ├─ __init__.py
 ├─ animal.py # dog -> animal로 변경
 ├─ dogpickler.py
 ├─ dogunpickler.py
 └─ pickled-dog
 
# dogunpickler 실행 시:
>>>ModuleNotFoundError: No module named 'dog'
```

The best way to mitigate such problem is to let your modules undergo minimal changes if you are pickling objects from custom classes defined in the modules.  However, if renaming is inevitable, there is a workaround to load your (which became obsolete now) `pickled-dog` file.

The solution is simple in words - you can tell `sys` module to redirect `dog` module to `animal` module.

To do this, we change `dogunpickler.py` as follows:

```python
import animal, sys # imported animal and sys module additionally
import pickle

# redirect 'dog' to 'animal'
sys.module['dog'] = animal

with open('pickled-dog', 'rb') as f:
    my_dog = pickle.load(f)

my_dog.bark()


# execution output
>>>Waloo!
```

### Changed Class Structure

In above example, `dog` module was renamed but the `Dog` class defined in the module was intact.  Then, what would happen if module name is still `dog` but `Dog` class undergoes changes?

#### Change in Existing Instance Variables

For example, suppose that we modify `dog.py` as follows, after created `pickled-dog`. 

```python
class Dog:
    def __init__(self):
        # Dog got mad
        self.bark_sound = "Grrr..." # originally this was 'waloo'
    def bark(self):
        print(self.bark_sound)
```

Then what happens if we try execute `dogunpickler.py`?  Even though `Dog` class has changed, `pickled-dog` had been created based on 'waloo-barking-dog'.

In this case, no error occurs.  But unpickled (loaded) dog barks **'waloo'**, not **'Grrr...'**.

```
# execution output
>>>Waloo!
```

A thing is that even we can `rename` the instance variable name `bark_sound`.  For example, we can rename it `barkSound` and `dogunpickler.py` can still be executed without error.  But when we unpickle `pickled-dog`, loaded object does not have `barkSound` instance variable.  `pickled-dog` does know nothing about changes made to `Dog` class and does not try to reorganize itself by determining the changes made.

#### New Instance Variable Added

How about the case where we add new instance variable to `Dog` class?

```python
class Dog:
    def __init__(self):
        # Dog got mad
        self.bark_sound = "Grrr..."
        # Now Dog has hair color
        self.color = "brown"
    def bark(self):
        print(self.bark_sound)
```

Alike to above example, no `ModuleNotFoundError` arises.  You can unpickle `pickled-dog` with `dogunpickler.py` and our saved dog barks **waloo**.  But `AttributeError` occurs if we try to access `color` variable.

#### New Method Added

Now let's try adding new method for `Dog`.

```python
class Dog:
    def __init__(self):
        # Dog got mad
        self.bark_sound = "Grrr..."
        # Now Dog has hair color
        self.color = "brown"
    def bark(self):
        print(self.bark_sound)
    # Dog can bark twice now
    def bark_twice(self):
        for i in range(2): self.bark()
    # They even can tell their hair color
    def show_color(self):
        print("I am a f{self.color} dog!")
```

Now, to test new methods, let's change `dogunpickler.py` as follows and try executing (do not execute `dogpickler.py`).

```python
import pickle

with open('pickled-dog', 'rb') as f:
    my_dog = pickle.load(f)

my_dog.bark_twice()
my_dog.show_color()
```

Maybe one would expect below output when `dogunpickler.py` is executed:

```python
Dog().bark_twice()
>> Grrr...
>> Grrr...

Dog().show_color()
>>> I am a brown dog!
```

But, the result is `AttributeError`.

```
# execution output
>>>Waloo!
>>>Waloo!
>>>AttributeError: 'Dog' object has no attribute 'show_color'
```

So, this is the summary:
- If you face `ModuleNotFoundError` in unpickling (using `pickle.load`), you can check if you made changes in your module names.  If it is the case, you can update `sys.module` variable make redirection from your old module name to new module name.
- Successful unpickling without `ModuleNotFoundError` cannot guarantee that your script based on unpickled object will be perfectly fine.  If you have made changes to your custom class, instances of which you have been pickling, `AttributeError` can occur because unpickled object does not know the history of changes made to your original module and classes.

## Using pickle Well in Your Project

With these observations, now I believe that it is not a good idea to use pickle directly to save a custom class instance.  I always try to ensure my class instances are composed of more universal and basic classes (ex. Dictionary) if I am to pickle them.  For example, rather than `Dog` class having `self.bark_sound` defined, I try to make a dictionary and 'bark_sound' key lies there.  Maybe some better method comes to you when you work on your project with `pickle`.