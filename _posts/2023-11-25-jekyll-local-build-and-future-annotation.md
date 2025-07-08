---
revision: 2
title: Jekyll 사이트를 로컬에서 빌드하여 확인하기
category: programming
tags:
  - jekyll
  - python
  - minimal-mistakes
created_at: 2024-12-02 05:21:48 -05:00
last_modified_at: 2025-07-08 04:40:08 -05:00
excerpt: Jekyll 블로그를 로컬 PC에서 미리보기 하는 방법 및 트러블슈팅 모음
---

## 로컬 PC에서 Jekyll 블로그 미리보기

깃허브 블로그에 업데이트한 새 글 또는 변경 사항 확인을 하기 위해서 꼭 리포지토리 커밋-푸시 후 실제 사이트 확인이 필요한 줄 알았는데 그렇지 않았다.  로컬 PC에 Ruby를 설치하고, 로컬 서버를 구동해서 추가/변경 사항들이 어떻게 표시될지 미리 확인한 다음 깃허브 리포지토리에 반영할 수 있다.

### 로컬 PC에 Ruby 설치하기

PC에 Ruby를 설치한다 ([**Ruby 설치**](https://rubyinstaller.org/downloads/)). 나는 Ruby+Devkit 3.2.2-1 (x64) 버전으로 설치했다.

### Jekyll 로컬 서버 실행하기

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

### 로컬 서버 실행 옵션

로컬 서버를 실행하면서 사용할 수 있는 몇 가지 옵션들이 있습니다.

`build`: 로컬 서버를 구동하지 않고, 정적 페이지 빌드만 실행하고자 하는 경우

```
bundle exec jekyll build
```

`serve --drafts`: `_drafts` 폴더에 있는 포스트들도 실제로 빌드된 것처럼 보여줍니다.

```
bundle exec jekyll serve --draft
```

`serve --incremental`: 서버를 구동하고 나면 항상 모든 페이지를 다시 빌드하는 대신 변경이 발생한 파일들이 영향을 미치는 페이지들만 제한적으로 빌드하여 빌드 속도를 높입니다.

```
bundle exec jekyll serve --incremental
```

`serve --livereload`: 변경 사항 발생으로 페이지 재 빌드가 발생하는 경우 로컬호스트에서 새로고침도 자동으로 진행해 줍니다.  속도가 충분히 빠르다면 거의 라이브 편집기를 사용하는 것처럼 변경 사항들이 즉각적으로 적용되는 것을 확인할 수 있습니다.

```
bundle exec jekyll serve --livereload
```

`serve --livereload` 옵션을 사용하는 경우에는 편집기에서의 변경이 즉각적으로 페이지 빌드에 적용되는 것을 확인하는 것이 중요하기 때문에 빌드 속도를 최대한 빠르게 하는 것이 좋습니다.  초안을 작성하면서 라이브로 확인하는 작업을 많이 하기 때문에 주로 아래와 같이 사용하고 있습니다.

```
bundle exec jekyll serve --draft --incremental --livereload
```


아래 이미지는 태블릿으로 작업 중인 환경이며 왼쪽은 편집기인 옵시디언, 오른쪽이 LiveReload 설정을 활성화하여 실시간 확인 중인 렌더링 화면입니다.

{% include img-gdrive alt="Jekyll Livereload" id="1NctSyHV_o98tTUZQWyZKc2TSV32Co9E3" %}

`--future`: 날짜가 시스템 시간보다 미래를 나타내는 포스트의 경우에는 기본적으로 빌드되지 않는데, 로컬 환경에서 테스트를 위해 이러한 포스트들도 빌드해 보기 위한 커맨드입니다.

포스트 날짜를 미래로 지정하는 것은 보통 특정 날짜 이전까지는 포스트를 업로드하고 싶지 않을 때 사용합니다.  다만 `Github Pages`를 통해 호스팅하는 경우, 커밋이 발생하지 않으면 페이지 빌드도 진행되지 않는데, 딱히 커밋을 만들 내용이 없는 경우 [**빈 커밋을 보내서**](https://freecodecamp.org/news/how-to-push-an-empty-commit-with-git/) 빌드 트리거를 할 수도 있습니다.

```
git commit --allow-empty -m "Commit Message"
git push origin master
```

`--unpublished`: `published: false` 설정이 되어 있는 포스트들도 확인하고 싶을 때 사용합니다.

만일 사이트를 빌드하고는 싶지만 (html 파일들을 생성하고는 싶지만) 로컬 서버를 돌려 접속 가능한 형태로 구동(serve)하고 싶지는 않은 경우라면 `bundle exec jekyll build`를 사용합니다.  이 경우 지킬 프로젝트의 루트 폴더에 있는 `_site` 디렉토리는 갱신되지만 로컬호스트 주소를 입력하더라도 로컬로 구동되는 웹사이트에 접속할 수는 없을 것입니다.

### 로컬로 구동중인 웹사이트에 다른 디바이스에서 접속하기

만일 PC 혹은 모바일에서 구동 중인 서버에 다른 디바이스에서 접속하고 싶다면, 아래와 같이 `--host` 옵션을 추가로 주어 `serve` 명령을 실행합니다.

```bash
bundle exec jekyll serve --host 0.0.0.0
```

이제 서버를 구동 중인 단말의 IP 주소를 알면 다른 디바이스의 웹 브라우저에 아래 주소를 입력하여 접속할 수 있습니다.  만일 웹사이트를 구동중인 서버 단말의 IP가 `192.168.000.000`라고 하면, 아래 주소로 접속하여 해당 단말이 구동중인 로컬컬 웹사이트에 접속할 수 있습니다.

```bash
192.168.000.000:4000
```

하지만 이 경우 서버를 구동 중인 단말과 서버에 접근하고자 하는 단말은 동일한 네트워크 (ex. 와이파이)를 공유해야 합니다.  서버 단말이 핫스팟을 제공중인 상태에서 외부 단말이 해당 핫스팟에 접속하는 등의 경우도 가능합니다.

`--host`에 0.0.0.0을 넘겨서 발생할 수 있는 잠재적인 문제 - 예를 들어, 디폴트 페이지의 url은 이 경우 단말의 IP 주소가 아니라 `--host`에 넘겨 준 0.0.0.0이 될 것이고 이로 인해 웹사이트의 하이퍼링크들이 정상적으로 작동하지 않을 수 있습니다.  이 경우 `--host`에 단말의 IP 주소를 직접 넘겨줄 수 있습니다. 

```bash
bundle exec jekyll serve --host 192.168.0.0
```

`--incremental`, `--livereload` 등의 다른 파라미터는 `--host`와 호환하여 쓸 수 있습니다.

```
bundle exec jekyll serve --host 192.168.0.0 --incremental --livereload
```

## 트러블슈팅

### `wdm` 설치 이슈

일부 윈도우즈 컴퓨터에서 `wdm` gem을 설치하지 못 할 수 있습니다.  Minimal Mistakes 테마는 `gemfile`에 윈도우즈 환경인 경우 해당 `gem`을 사용하도록 명시하고 있습니다.  그런데 `wdm` 버전 `0.1.x` 설치 시에 SSL certificate 관련 문제가 있고 SSL 체크를 무시하도록 http://rubygem.org 를 소스로 사용하는 경우에도 `0.1.x` 버전의 설치는 불가능했습니다 (07/08/2025).  `0.2.0` 버전을 사용하더라도 빌드에 문제가 없어 현재는 버전을 바꾸어 사용 중입니다.

## 참고문헌

1. [https://tyami.github.io](https://tyami.github.io/blog/jekyll-local-server-start-batch/#%EB%A1%9C%EC%BB%AC-%EC%84%9C%EB%B2%84-%EC%97%85%EB%8D%B0%EC%9D%B4%ED%8A%B8-%EC%97%90%EB%9F%AC)
2. [https://ehdtnn.tistory.com/763](https://ehdtnn.tistory.com/763)
3. [https://2sehi.github.io](https://2sehi.github.io/blog/56_Github-Blog/)