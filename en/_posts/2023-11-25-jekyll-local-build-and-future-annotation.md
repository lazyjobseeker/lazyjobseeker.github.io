---
translated: true
title: "Jekyll Local Build and Using future annotations in Python"
category: Programming
tags:
  - Jekyll
  - Python
  - "Minimal Mistakes"
created_at: 2023-11-25 13:28:00 +09:00
last_modified_at: 2024-04-09 17:19:49 +09:00
header:
  teaser: /assets/images/uncategorized-teaser-6.png
excerpt: "1) How to preview Jekyll blog in local environment. 2) How to use __future__ module to provide type hinting for custom class."
---

## 1. How to Preview Jekyll Blog in Local

If you are using `github pages` to host your webpage statically built with `Jekyll`, and you are checking the result of your changes by directly pushing the changes to remote repository, don't do that.  You can install `Ruby` in your local PC and run local server to pre-render all the changes you make before pushing to your repository.

### 1.1. Install Ruby on Your Local PC

Install `Ruby` on your PC ([**Install Ruby**](https://rubyinstaller.org/downloads/)).

### 1.2. Run Jekyll Local Server

Open comand prompt and run `bundle exec jekyll serve`.

```
D:\repositories\lazyjobseeker.github.io>bundle exec jekyll serve
```

You might face error message that the command couldn't be run due to the inexistance of specific `gem` file.  Execute `bundle install` as the error message must recommend that.  It will check from the `gemfile` all the dependencies and install required gems.  `gem` corresponds to plugin in Ruby.

```
D:\repositories\lazyjobseeker.github.io>bundle exec jekyll serve
bundler: command not found: jekyll
Install missing gem executables with `bundle install`

D:\repositories\lazyjobseeker.github.io>bundle install
Fetching gem metadata from https://rubygems.org/...........
Resolving dependencies...
Using ruby2_keywords 0.0.5
Using json 2.6.3
Fetching base64 0.2.0
Fetching bigdecimal 3.1.4
Fetching connection_pool 2.4.1
Fetching concurrent-ruby 1.2.2
Fetching minitest 5.20.0
Fetching mutex_m 0.2.0
Fetching public_suffix 4.0.7
Fetching racc 1.7.3
...
```

If succeeded you can preview your webpage from localhost address http://127.0.0.1:4000.  As long as your change is for `_config.yml` configuration file, any changes to source codes and posts will be reflected real-time by Jekyll's regenerating changed pages.  Enter `Ctrl+C` to abort current session and rerun `bundle exec jekyll serve` again to retrigger your local server if you want to check changes made by modifying `_config.yml`.

When you are happy with rendered changes, push your changes to remote repository.  Your repository will not suffer any more from meaningless commits to simply check how the rendering changes.

```
D:\repositories\lazyjobseeker.github.io>bundle exec jekyll serve
To use retry middleware with Faraday v2.0+, install `faraday-retry` gem
Configuration file: D:/repositories/lazyjobseeker.github.io/_config.yml
            Source: D:/repositories/lazyjobseeker.github.io
       Destination: D:/repositories/lazyjobseeker.github.io/_site
 Incremental build: disabled. Enable with --incremental
      Generating...
       Jekyll Feed: Generating feed for posts
                    done in 4.585 seconds.
 Auto-regeneration: enabled for 'D:/repositories/lazyjobseeker.github.io'
    Server address: http://127.0.0.1:4000
  Server running... press ctrl-c to stop.
      Regenerating: 1 file(s) changed at 2023-11-25 13:55:32
                    _sass/minimal-mistakes/_archive.scss
       Jekyll Feed: Generating feed for posts
                    ...done in 4.4795336 seconds.

      Regenerating: 1 file(s) changed at 2023-11-25 13:55:56
                    _sass/minimal-mistakes/_archive.scss
       Jekyll Feed: Generating feed for posts
                    ...done in 4.4363946 seconds.
```

### References
1. [https://tyami.github.io](https://tyami.github.io/blog/jekyll-local-server-start-batch/#%EB%A1%9C%EC%BB%AC-%EC%84%9C%EB%B2%84-%EC%97%85%EB%8D%B0%EC%9D%B4%ED%8A%B8-%EC%97%90%EB%9F%AC)
2. [https://ehdtnn.tistory.com/763](https://ehdtnn.tistory.com/763)
3. [https://2sehi.github.io](https://2sehi.github.io/blog/56_Github-Blog/)


## 2. Use Self Type-Hinting using `__future__`

Consider an `IceCream` custom class as example.  `serve` method is prepared, which returns itself (an instance of `IceCream').

```python
class IceCream:
  def __init__(self):
    print("Delicious icecream is here.")
  def serve(self):
    print("Have your icecream!")
    return self
```

It is obvious that `type(IceCream().serve()` return `IceCream`.  So I want to provide type hinting to manifest this.  But it does not work well with error.

```python
class IceCream:
  def __init__(self):
    print("Delicious icecream is here.")
  def serve(self) -> IceCream:
    print("Have your icecream!")
    return self
```

If you are struggling with similar issue and working with **Python 3.7** or higher, you can import `annotations` module from `__future__` to solve this.

```python
from __future__ import annotations

class IceCream:
  def __init__(self):
    print("Delicious icecream is here.")
  def serve(self) -> IceCream:
    print("Have your icecream!")
    return self
```

### References
1. [stackoverflow-33533148](https://stackoverflow.com/questions/33533148/how-do-i-type-hint-a-method-with-the-type-of-the-enclosing-class)