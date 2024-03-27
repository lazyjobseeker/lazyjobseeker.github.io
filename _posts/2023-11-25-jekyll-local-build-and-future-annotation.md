---
title: "Jekyll 로컬 빌드, 파이썬 future annotations"
category: Programming
redirect_from:
  - /programming/jekyll-local-build-and-future-annotation/
tags:
  - Jekyll
  - Python
  - "Minimal Mistakes"
published: true
created_at: 2023-11-25 13:28:00 +09:00
last_modified_at: 2024-03-27 16:11:09 +09:00
header:
  teaser: /assets/images/uncategorized-teaser-3.png
excerpt: "Jekyll 블로그를 로컬 PC에서 미리보기 하는 방법, python에서 작성한 클래스 내에서 해당 클래스에 대한 타입 힌팅(type hinting)을 사용하기 위해 __future__ 모듈을 사용하는 방법"
---

## 1. 로컬 PC에서 Jekyll 블로그 미리보기

깃허브 블로그에 업데이트한 새 글 또는 변경 사항 확인을 하기 위해서 꼭 리포지토리 커밋-푸시 후 실제 사이트 확인이 필요한 줄 알았는데 그렇지 않았다.  로컬 PC에 Ruby를 설치하고, 로컬 서버를 구동해서 추가/변경 사항들이 어떻게 표시될지 미리 확인한 다음 깃허브 리포지토리에 반영할 수 있다.

### 1.1. 로컬 PC에 Ruby 설치하기
PC에 Ruby를 설치한다 ([**Ruby 설치**](https://rubyinstaller.org/downloads/)). 나는 Ruby+Devkit 3.2.2-1 (x64) 버전으로 설치했다.

### 1.2. Jekyll 로컬 서버 실행하기
커맨드 프롬프트를 열고 `bundle exec jekyll serve`를 실행한다.

```
D:\repositories\lazyjobseeker.github.io>bundle exec jekyll serve
```

특정 `gem` 파일이 존재하지 않아 실행할 수 없다는 메시지가 발생할 수 있는데, 하라는 대로 `bundle install`을 실행해 주면 된다.  내 리포지토리에서 알아서 의존성 정보를 확인하고 필요한 `gem` 파일들을 설치한다.

`gem`은 Ruby에서 사용하는 플러그인들이며, `bundle install` 명령은 이 명령이 실행된 루트 디렉토리의 `Gemfile` 파일에서 어떤 `gem` 파일들이 필요한지 확인하고 설치를 진행한다.

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

`bundle exec jekyll serve`를 실행하는 데 성공하면 로컬 서버 주소 http://127.0.0.1:4000을 통해 블로그 프리뷰를 확인할 수 있다.  프리뷰는 `_config.yml`파일에 대한 수정이 아닌 한 리포지토리의 파일을 수정할 때마다 자동으로 진행되므로 업데이트 상황을 실시간으로 확인할 수 있다.  `_config.yml` 파일을 수정했다면 `Ctrl+C`로 작업 종료 후 `bundle exec jekyll serve`를 다시 실행해 주자.

프리뷰가 만족스럽게 변경 되었다면 리포지토리에 변경 사항들을 푸시해 주면 된다.

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


## 2. 파이썬 __future__ 모듈로 클래스 안에서 자기 자신 타입힌팅 하기

아래와 같이 아이스크림 클래스를 만들고, serve 메서드로 자기 자신(즉, 아이스크림 인스턴스)을 리턴하도록 했습니다.  
```python
class IceCream:
  def __init__(self):
    print("Delicious icecream is here.")
  def serve(self):
    print("Have your icecream!")
    return self
```

이 때, `IceCream.serve`의 리턴 타입이 `IceCream`인 것이 분명하기 때문에, 아래와 같이 타입 힌팅을 적용하고 싶은데, 잘 되지 않습니다.
```python
class IceCream:
  def __init__(self):
    print("Delicious icecream is here.")
  def serve(self) -> IceCream:
    print("Have your icecream!")
    return self
```

이 경우, **Python 3.7** 이상을 사용하고 있다면, `__future__`의 `annotations` 모듈을 임포트하면 잘 동작합니다.
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