---
translated: false
title: "How to Maintain Your Github Blog from Mobile Devices"
category: Programming
tags:
  - Jekyll
  - Ruby
  - "Github Blog"
published: false
created_at: 2024-02-28 10:25:00 +09:00
last_modified_at: 2024-04-02 12:37:25 +09:00
header:
  teaser: /assets/images/uncategorized-teaser-5.png
excerpt: "How to use Git with Android mobile devices to maintain Jekyll-based static blog hosted by Github Pages."
---

If you have your own static blog hosted via Github Pages, which is built based on Jekyll, you can test your blog with your local PC by installing Ruby and Jekyll.  You can also maintain your repository if you install Git.  You can do all these things outside if you establish the same enviroment with your laptop.

But, how can we do the same thing with Android mobile devices - smartphones and tablets?  I have struggled to setup my static blog maintenance environment with my Android devices (Galaxy Note 10+ and Galaxy Tab 7 FE).  I finally made it and would like to share some tips to save your time.

## 1. Install F-Droid App Store and Termux

Firstly I installed `Termux` to use Linux terminal in mobile environemnt.  I had to download this from an open-source appstore `F-Droid`, rather than from Google Play Store.

- Install F-Droid ([Download Page](https://f-droid.org))
- Excute F-Droid and search for Termux.
- Install **Termux Terminal emulator with packages**

## 2. Setup Termux

Now you can excute Termux and see emulated Linux terminal on your mobile device.  First of all, ensure your Termux to have access to local storage of your device.

```bash
termux-setup-storage
```

## 3. Git

### 3.1. Install and Setup Git

You can install `Git` from your Termux terminal.

```bash
pkg install git
```

Then, you can set default git username and email address to be used in mobile device.

```bash
git config --global user.name 'John Doe'
git config --global user.email 'johndoe@example.com'
```

### 4. SSH Settings

There are two differenty ways to clone remote repository to your local mobile device.  You can provide https based repository address to clone it and in that case this step is not required.  But https-cloning will necessiate you to provide github username and password every time you push your changes to remote, which couldn't be ommitted or automated in my case.

You can evade from the tedius username/password inputs by following processes below and cloning your repository with ssh manner.

- Create SSH key for current mobile device ([Reference](https://www.lainyzine.com/ko/article/creating-ssh-key-for-github/))

  ```bash
  #openssh 패키지 설치
  pkg install openssh
  ssh-keygen -t ed25519 -C <클론해 올 레포지토리에 등록된 이메일 주소>
  cat ~/.ssh/id_ed25519.pub
  #cat 명령으로 출력되는 키 값을 Ctrl+C로 복사
  ```

- 생성된 SSH 키를 클론해 올 레포지토리에 등록 ([참고](https://www.lainyzine.com/ko/article/creating-ssh-key-for-github/))
	- Github 사이트로 이동
	- 우상단의 프로필을 클릭하여 드롭다운 메뉴에서 Settings로 이동
	- SSH and GPG Keys 메뉴로 이동
	- New SSH Key 버튼 클릭하고 앞에서 복사한 SSH 키 붙여넣기

Termux 터미널에서 Git을 이용하여 변경사항을 푸시하려고 할 때 깃허브 아이디와 비밀번호를 묻는 절차가 있는데, 이 과정을 설정 파일 등으로 만들어 놓고 생략할 수 있는 방법이 없는 것 같습니다.  위 과정을 진행한 뒤 레포지토리를 클론해 오면 변경사항을 푸시할 때 자격 증명 과정을 생략할 수 있습니다.

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
bundle exec jekyll serve
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

`bundle exec jekyll serve`를 실행할 때 아래와 같이 추가 옵션을 주지 않으면 css 디자인이 깨진다는 포스트도 있었지만, 저의 경우에는 필요하지 않았습니다.  서버는 구동되지만 렌더링된 결과가 이상하다면 아래를 실행해 보는 것도 좋겠습니다.

```bash
bundle exec jekyll serve --baseurl ''
```

## 문제 해결

여기까지의 과정이 아무 문제 없이 진행되었을 수도 있지만, 문제가 발생할 수도 있습니다.  제가 겪었던 문제점 및 해결 방법들은 아래와 같습니다.

### nokogiri 설치 불가

`nokogiri`는 Ruby에서 XML과 HTML을 다루기 용이하게 하는 API들을 제공하는 라이브러리입니다.  `bundle install`로 의존성 gem들을 설치하는 과정에서, 다른 모든 gem들은 문제없이 설치가 가능한데 nokogiri는 설치에 실패했다는 메시지와 함께 진행이 불가능한 문제가 있었습니다.

몇 가지 패키지를 추가로 설치하여 해결되었다는 [**스택오버플로우 포스트**](https://stackoverflow.com/questions/71294580/nokogiri-1-13-3-gem-install-failure-termux) 가 있었고 이를 따르는 것으로 해결되었습니다.  어떤 포스트에서는 패키지 업데이트를 하라는 권고가 있었습니다.

정확히 어떤 지침을 따라야 해결되는 것인지 알 수가 없어서, 모두 진행했습니다.

```bash
# 패키지 업데이트 및 업그레이드
pkg update
pkg upgrade
# 패키지 추가 설치
pkg install pkg-config
pkg install binutils
pkg install gumbo-parser
pkg install libxslt
pkg install libxml2
pkg install build-essential --no-install-recommends
# gem 추가 설치
gem install pkg-config
```

그런 다음, `bundle install` 대신 아래 명령으로 nokogiri gem을 직접 설치하면 정상적으로 설치됩니다.

```bash
gem install nokogiri --platform=ruby -- --use-system-libraries
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

위와 같이 특정할 수 있었습니다.  이 문제는 제가 가지고 있는 스마트폰과 태블릿에서 모두 발생했고, 위 조치로 동일하게 해결 되었습니다.

## 깃허브 블로그 리포지토리의 로컬 저장소를 Obsidian vault로 연동

원래 태블릿에서는 포스트 수정과 git 작업을 동시에 하기 위해 파일 수정 기능과 함께 git의 일부 기능을 기본적으로 지원하는 **스펙 에디터(spck editor)**를 사용하고 있었습니다.  스펙 에디터의 마크다운 편집 및 프리뷰 기능은 **옵시디언**에 비하면 아쉽지만, git 기능을 사용할 수 있는 장점 때문에 사용해 왔습니다.

항상 셋업하고 싶었던 모바일 블로그 포스팅 환경은 스펙 에디터에서 `git clone` 명령으로 로컬 저장소에 복제해 온 레포지토리를 옵시디언 저장소(Vault)로 지정하여, 실제 포스트 작성과 수정은 옵시디언에서 처리하고 커밋과 푸시만 스펙 에디터로 진행하는 것이었습니다.  옵시디언에도 **Obsidian Git**이라는 커뮤니티 플러그인이 있어 git 기능을 사용할 수 있지만 안정성이 크게 떨어져서 사용하지 않고 있었고, 스펙 에디터에서 모바일 단말로 클론해온 로컬 저장소는 옵시디언에서 접근할 수 없는 위치(스펙 에디터의 앱 내부 저장소)에 있어서, 어쩔 수 없이 마크다운 편집과 프리뷰는 옵시디언으로 작업한 다음 스펙 에디터는 git 관련 처리에만 사용하고 있었습니다.

하지만 Termux로 git을 설치하고 git을 이용해 어느 앱이든 접근 가능한 스토리지 영역에 리포지토리를 클론할 수 있게 되었기 때문에, 클론해온 리포지토리의 태블릿 내부 저장 위치를 옵시디언 vault로 직접 지정하여 포스트를 직접 작성하고 수정할 수 있게 되었습니다.

옵시디언의 **Manage Vaults** -> **Open Folder as Vault** 메뉴로 접근하여, Termux에서 git으로 클론한 저장소 위치를 Vault로 직접 지정했습니다.  포스팅을 위한 마크다운 파일만 수정할 목적이기 때문에, 전체 저장소가 아닌 `_posts` 폴더만을 타겟으로 지정했습니다.  주의할 점은 옵시디언에서 Vault의 이름을 바꾸면 대상 디렉토리의 이름 자체가 바뀌기 때문에, 별로 보기에 좋지 않더라도 이렇게 만든 Vault의 이름은 `_posts`인 채로 유지해야 한다는 점입니다.  또한 옵시디언 Vault로 지정된 디렉토리에는 옵시디언 관련 설정들을 저장하는`.obsidian` 폴더가 새로 생성되기 때문에, git이 이 파일들을 추적하기를 원하지 않는다면 `.gitignore`에서 이 파일들을 추적하지 않도록 설정해 주어야 합니다.