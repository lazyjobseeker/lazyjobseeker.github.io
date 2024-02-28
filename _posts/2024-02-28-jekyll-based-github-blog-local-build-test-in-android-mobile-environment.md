---
toc: true
toc_sticky: true
title: "안드로이드 스마트폰 및 태블릿 환경에서 Jekyll 기반 깃허브 블로그 로컬 빌드하기"
category: Programming
tags:
  - Jekyll
  - Ruby
  - "Github Blog"
published: true
use_math: true
created_at: 2024-02-28 10:25:00 +09:00
last_modified_at: 2024-02-28 12:10:51 +09:00
header:
  teaser: /assets/images/uncategorized-teaser-5.png
excerpt: "Jekyll로 작성된 Github 블로그를 모바일 환경에서 로컬 빌드하기"
---

Ruby와 Jekyll을 설치하면 로컬 PC 환경에서 서버를 구동하여 깃허브 블로그가 어떻게 렌더링될지 확인할 수 있습니다.  이런 환경을 노트 PC에 구축해 둔다면 어디서든 자유롭게 포스트를 수정하고 레포지토리에 push할 수 있겠지만, 여의치 않다면 태블릿이나 스마트폰 등 모바일 환경을 활용하고 싶다는 생각이 들 수 있습니다.  안드로이드 태블릿(갤럭시 탭 7 FE)에서 Jekyll 정적 블로그를 로컬 빌드하기 위해 필요했던 내용들을 아래에 정리합니다.

## F-Droid 앱 스토어 및 Termux 설치

모바일 환경에서 리눅스 터미널을 이용하기 위해 `Termux`를 설치해야 합니다.  Termux는 구글 플레이스토어에서도 검색할 수 있는 어플리케이션이지만, 이것을 다운로드하면 안 되고 `F-Droid`라는 오픈소스 어플리케이션 스토어에서 다운로드해야 합니다.

- F-Droid 설치 ([다운로드 페이지](https://f-droid.org))
- F-Droid를 실행하고 Termux를 검색하여, **Termux Terminal emulator with packages**를 설치

## Termux 설정

Termux를 실행하고, 아래 명령으로 Termux가 태블릿의 로컬 저장소에 대한 접근 권한을 갖도록 해 줍니다.

```bash
termux-setup-storage
```

## git 설치 및 설정

### git 설치 및 설정

Termux 터미널에서 git을 설치합니다.

```bash
pkg install git
```

태블릿에서 사용할 git 유저네임 및 이메일 주소를 설정합니다.

```bash
git config --global user.name 'Hong Gil Dong'
git config --global user.email 'honggildong@example.com'
```
### 레포지토리 클론(clone)

- `mkdir` 커맨드로 로컬 저장소에 적당한 디렉토리를 만듭니다.
- `cd` 커맨드를 이용해 위에서 만든 디렉토리로 이동합니다.
- `git clone` 커맨드를 이용해 레포지토리를 클론합니다.

```bash
mkdir ~/storage/shared/repos
cd ~/storage/shared/repos
git clone https://github.com/lazyjobseeker/lazyjobseeker.github.io.git
```

## Ruby 설치

Ruby를 설치합니다.

```bash
pkg install ruby
```

## 모바일 로컬에서 서버 구동하기

여기까지 완료되었다면 거의 모든 준비가 끝났습니다.  클론된 리포지토리의 로컬 저장소로 이동한 다음, 의존성이 있는 `gem`들을 설치하기 위해 `bundle install`을 한 번 실행해 줍니다.  Jekyll을 별도로 설치하지 않았지만, 제가 사용하고 있는 **Minimal Mistakes** 테마의 경우 Jekyll에 대한 의존성을 이미 선언하고 있기 때문에 굳이 Jekyll을 먼저 설치하지 않아도 상관이 없었습니다.

의존성 gem들의 설치까지 완료되었다면 `bundle exec jekyll serve`를 실행한 다음, 실행이 성공하면 PC 환경에서와 동일하게 로컬 서버 주소(http://127.0.0.1:4000/)에서 렌더링된 정적 홈 페이지를 확인할 수 있습니다.

```bash
cd ~/storage/shared/repos/lazyjobseeker.github.io
bundle install
bundle exec jekyll serve --baseurl ''
To use retry middleware with Faraday v2.0+, install `faraday-retry` gem
Configuration file: /storage/emulated/0/repos/lazyjobseeker.github.io/_config.yml
            Source: /storage/emulated/0/repos/lazyjobseeker.github.io
       Destination: /storage/emulated/0/repos/lazyjobseeker.github.io/_site
 Incremental build: disabled. Enable with --incremental
      Generating...
       Jekyll Feed: Generating feed for posts
                    done in 7.517 seconds.
 Auto-regeneration: enabled for '/storage/emulated/0/repos/lazyjobseeker.github.io'
    Server address: http://127.0.0.1:4000/
  Server running... press ctrl-c to stop.
```


## 문제 해결

여기까지의 과정이 아무 문제 없이 진행되었을 수도 있지만, 문제가 발생할 수도 있습니다.  제가 겪었던 문제점 및 해결 방법들은 아래와 같습니다.

### nokogiri 설치 불가

`nokogiri`는 Ruby에서 XML과 HTML을 다루기 용이하게 하는 API들을 제공하는 라이브러리입니다.  `bundle install`로 의존성 gem들을 설치하는 과정에서, 다른 모든 gem들은 문제없이 설치가 가능한데 nokogiri는 설치에 실패했다는 메시지와 함께 진행이 불가능한 문제가 있었습니다.

몇 가지 패키지를 추가로 설치하여 해결되었다는 [스택오버플로우 포스트](https://stackoverflow.com/questions/71294580/nokogiri-1-13-3-gem-install-failure-termux)가 있었고 이를 따르는 것으로 해결되었습니다.

```bash
pkg install pkg-config
pkg install binutils
pkg install gumbo-parser
pkg install libxslt
```

한 번에 설치해도 됩니다.

```bash
pkg install pkg-config binutils gumbo-parser libxslt
```

### bundle exec jekyll serve 실행 시 권한 없음

위 문제를 해결하여 모든 gem들을 설치한 후, `bundle exec jekyll serve`로 로컬 서버를 구동하려고 하자, 아래와 같은 오류가 발생하며 진행이 되지 않았습니다.

```bash
bundle exec jekyll serve
To use retry middleware with Faraday v2.0+, install `faraday-retry` gem
Configuration file: /storage/emulated/0/repos/lazyjobseeker.github.io/_config.yml
            Source: /storage/emulated/0/repos/lazyjobseeker.github.io
       Destination: /storage/emulated/0/repos/lazyjobseeker.github.io/_site
 Incremental build: disabled. Enable with --incremental
      Generating...
       Jekyll Feed: Generating feed for posts
                    done in 7.442 seconds.
jekyll 3.9.5 | Error:  Permission denied @ rb_sysopen - /proc/version
/data/data/com.termux/files/usr/lib/ruby/gems/3.2.0/gems/jekyll-3.9.5/lib/jekyll/utils/platforms.rb:73:in `read': Permission denied @ rb_sysopen - /proc/version (Errno::EACCES)
```

한 [포스트](https://github.com/jekyll/jekyll/issues/7045)에서 조치 방법을 확인할 수 있었습니다.  로컬에 설치된 Jekyll의 루비 소스 코드 파일 중 `/lib/jekyll/utils/platfroms.rb` 파일을 직접 수정하는 것입니다.  구체적으로는, `proc_version` 함수를 아래와 같이 고쳐 줍니다.

```ruby
def proc_version
  @proc_version ||= begin
    Pathutil.new(
      "/proc/version"
    ).read
  rescue Errno::ENOENT, Errno::EACCES
    nil
  end
end
```

Jekyll이 어디에 설치되어 있는지 모르겠다면, 아래 명령을 실행해 확인해 봅니다.

```bash
bundle show jekyll
>>> /data/data/com.termux/files/usr/lib/ruby/gems/3.2.0/gems/jekyll-3.9.5
```

즉, 수정이 필요한 파일의 최종 경로는,

```
/data/data/com.termux/files/usr/lib/ruby/gems/3.2.0/gems/jekyll-3.9.5/lib/jekyll/utils/platforms.rb
```

위와 같이 특정할 수 있었습니다.

## 깃허브 블로그 리포지토리의 로컬 저장소를 Obsidian vault로 연동

원래 태블릿에서는 포스트 수정과 git 작업을 동시에 하기 위해 파일 수정과 일부 git 기능을 모두 지원하는 **스펙 에디터(spck editor)**를 사용하고 있었습니다.  스펙 에디터의 마크다운 편집 및 프리뷰 기능이 **옵시디언**에 미치지 못해 항상 아쉬웠지만, 스펙 에디터의 git 기능으로 클론해 온 리포지토리는 스펙 에디터의 어플리케이션 데이터 영역에 저장되도록 되어 있어서, 이 저장소의 위치를 옵시디언 저장소(vault)로 설정할 방법이 없었습니다.  이로 인해 스펙 에디터에서 관리하는 파일들을 옵시디언에서 직접 불러들여 수정할 방법이 없었고, 어쩔 수 없이 옵시디언에서 작성한 포스트를 스펙 에디터에서 붙여넣고 commit-push하는 방법을 사용하고 있었습니다.

하지만 Termux로 git을 설치하고 git을 이용해 어느 앱이든 접근 가능한 스토리지 영역에 리포지토리를 클론할 수 있게 되었기 때문에, 클론해온 리포지토리의 태블릿 내부 저장 위치를 옵시디언 vault로 직접 지정하여 포스트를 직접 작성하고 수정할 수 있게 되었습니다.

옵시디언의 <Manage Vaults> -> <Open Folder as Vault> 메뉴로 접근하여, Termux에서 git으로 클론한 저장소 위치를 Vault로 직접 지정했습니다.  포스팅을 위한 마크다운 파일만 수정할 목적이기 때문에, 전체 저장소가 아닌 `_posts` 폴더만을 타겟으로 지정했습니다.  옵시디언에서 Vault의 이름을 바꾸면 대상 디렉토리의 이름 자체가 바뀌기 때문에 Vault의 이름을 새로 짓지는 않고 _posts인 채로 두었습니다.

옵시디언 Vault로 지정된 디렉토리에는 옵시디언 관련 디렉토리와 파일들이 `.obsidian` 폴더로 추가되기 때문에, 필요한 경우 `.gitignore`에서 이 파일들을 추적하지 않도록 설정해 주어야 할 것입니다.