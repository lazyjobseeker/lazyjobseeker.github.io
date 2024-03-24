---
lang: en
toc: true
toc_sticky: true
title: "블로그 포스팅 도구들"
categories: Programming
tags:
  - devlog
published: true
use_math: true
created_at: 2023-05-07 11:17:13 +09:00
last_modified_at: 2024-03-13 12:14:53 +09:00
header:
  teaser: /assets/images/uncategorized-teaser-2.png
excerpt: "모바일 환경에서 깃허브 블로그를 포스팅하기 위해 사용하고 있는 어플리케이션들"
---

깃허브 블로그 포스팅을 위해 사용하고 있는 도구들입니다.

## 포스트 및 코드 수정

### 마크다운 에디터 - 옵시디언 (Obsidian)

마크다운 파일 (*.md) 편집을 위한 기본 에디터로 사용하고 있습니다.  모바일 기기 (스마트폰과 태블릿)와 PC에서 모두 이용 가능하고, 유료 기능을 이용하지 않더라도 서드파티 플러그인을 이용해서 저장소간 동기화를 유지할 수 있습니다.

다른 매력 포인트는 기본적으로 $\LaTeX$ 스타일 수식 렌더링을 지원한다는 점입니다.  인라인 수식을 입력하려면 $\text{\textdollar}$으로, 블록 수식을 입력하려면 $\text{\textdollar\textdollar}$으로 수식 양 쪽을 감싸면 프리뷰 모드에서 $\LaTeX$ 스타일로 렌더링됩니다.

예를 들어, $\text{\textdollar z\textasciicircum 2 = \textbackslash sqrt\textbraceleft x\textasciicircum 2+y\textasciicircum 2\textbraceright\textdollar}$ 이렇게 입력해 주면, 실제 옵시디언 편집기에서 $z^2 = \sqrt{x^2+y^2}$ 가 **인라인 수식**으로 깔끔하게 렌더링되는 것을 볼 수 있습니다.

$\text{\textdollar\textdollar z\textasciicircum 2 = \textbackslash sqrt\textbraceleft x\textasciicircum 2+y\textasciicircum 2\textbraceright\textdollar\textdollar}$이라고 입력하면 아래와 같은 **블록 수식**으로 자동으로 렌더링됩니다.

$$z^2 = \sqrt{x^2+y^2}$$

화학식 입력도 마찬가지로 지원됩니다. $\text{\textdollar\textdollar\textbackslash ce\textbraceleft 2H2 + O2 \textendash\textgreater 2H2O\textbraceright\textdollar\textdollar}$을 입력하면,

$$\ce{2 H2 + O2 -> 2 H2O}$$

위와 같이 화학식 렌더링이 되는 것을 확인할 수 있습니다.  편집기에서 **Source Mode**를 활성화하면 마크다운 문법 요소들을 렌더링 없이 그대로 보는 것도 가능합니다.

옵시디언은 바닐라 상태 그대로 사용하기보다는 플러그인을 적극적으로 활용해야 하는 도구입니다.  개인적으로 잘 사용하고 있는 플러그인들과 앞으로 사용하게 될 것 같은 플러그인들 몇 개를 아래에 적어 보았습니다.

#### 옵시디언 추천 플러그인

##### Linter

가장 유용하게 사용하고 있는 플러그인입니다.  마크다운으로 작성한 포스트의 YAML Front Mater에 해당 포스트를 마지막으로 수정한 날짜 정보를 넣기 위해 사용하고 있습니다.

- **General Settings**
    - Lint on Save: 저장 버튼 눌렀을 때 YAML Front Mater 업데이트되도록 하기 위하여 활성화
- **YAML Settings - YAML Timestamps**
    - 메타데이터로부터 수정 시간 가져오기 활성화
    - Date Created, Date Modified 옵션 사용

이외에도 YAML 태그 자동 추가/삭제/정렬, 복사/붙여넣기 시 자동 공백 제거 및 연속된 빈줄 제거 등 다양한 매크로성 기능을 제공하고 있습니다.

##### Novel Word Count

저장소 내 마크다운 파일들의 단어 수, 최종 수정 일자, 글자 수 등의 메타정보를 확인할 수 있게 해 주는 플러그인입니다.

##### Remotely Save

옵시디언은 실제로 사용자 단말에 물리적인 로컬 저장소 (vault)를 만들고 관리합니다.  기기 간 동기화를 지원하는 **Obsidian Sync**를 유료로 서비스 중이지만 이 플러그인을 이용하면 드롭박스 또는 OneDrive 등의 클라우드 서비스를 활용하여 동기화를 위한 허브 저장소를 만들고 관리할 수 있습니다.

Schedule for Auto Run(자동 동기화 주기) 옵션을 1분으로, Run Once on Start Up Automatically(옵시디언 실행 시 무조건 한 번 동기화 실행) 옵션을 활성화한 상태로 사용하고 있습니다.

##### Periodic Notes

옵시디언에서는 기본적으로 일일 노트 (Daily Notes) 기능을 제공합니다.  날짜 기반의 파일명으로 새 마크다운 파일을 자동 생성하는 기능인데, 같은 기능을 주 단위 혹은 월 단위로 확장하여 사용할 수 있게 하는 플러그인입니다.  주간/월간 계획이나 일기 등 장주기 기록이 필요하다면 유용할 플러그인입니다.  현재 저는 기본 Daily Notes 기능만 사용하고 있습니다.

##### Advanced Tables

마크다운에서 귀찮은 작업인 표 작성과 수정을 간편하게 만들어 주는 플러그인입니다.  어렵기는 하지만 수식 작성도 지원합니다.

##### Excalidraw

드로잉 툴입니다만 미려한 래스터 이미지 파일을 만드는 것보다는 볼트 내의 마크다운 파일과 PDF, 이미지 등을 유기적으로 연결한 마인드맵 내지 로드맵 형태의 컨텐츠를 만드는 데 특화된 플러그인입니다.  기본 제공되는 드로잉 스타일은 개발자들이나 과학자들이 칠판에 휘갈기는 손글씨 스타일을 가져온 것 같은 느낌인데 개인적으로는 별로 선호하는 스타일이 아니고, 아직까지는 옵시디언 내 파일들을 종횡으로 엮어 통합할 수준도 아니라서 설치해서 몇 번 써 본 이후로는 손대지 않고 있습니다.

##### Obsidian Git

이 정도로 다양한 플러그인을 지원한다면 당연히 Git 관련 플러그인이 있을 거라고 생각했고 역시나 있었습니다.   스마트폰과 태블릿, PC에 모두 설치해 놓고 언제 어디서나 포스트를 수정하고 새로 쓴 다음 바로바로 블로그 리포지토리에 푸시할 수 있을 거라고 생각했지만...

결과적으로는 잘 되지 않았습니다.  머지 컨플릭트를 리졸브하는 기능을 아직 지원하지 않고, 최대한 충돌 없이 써 보려고 해도 태블릿에서는 저장소 클론 단계에서부터 아래와 같은 오류가 발생했습니다.

```
Cloning progress: Compressing objects: 2610 of 2610
...
TypeError: Cannot read properties of null (reading 'slice')
```

이런 오류가 발생하며 사용이 불가능했습니다.  두어 번 클론이 성공하는 경우도 있었지만, 글 작성 후 원격 저장소로 푸시할 때 똑같은 오류가 발생했고 몇 번의 시도 후 결국 포기했습니다.

깃 관련 기능까지 완벽했다면 좋았겠지만, Termux 터미널에 Git과 Ruby를 설치하면 [모바일 단말에서도 Github 블로그를 자유롭게 관리](https://lazyjobseeker.github.io/programming/jekyll-based-github-blog-local-build-test-in-android-mobile-environment)할 수 있습니다.

어차피 옵시디언은 마크다운을 다루는 데 특화되어 있고 HTML, CSS, JS 등을 수정하는 데 있어서는 다른 코드 에디터를 사용해야 하니 Git 기능이 완벽하지 않은 것이 아주 큰 흠이 되지는 않는 것 같습니다.

**주의!** 어찌되었든 옵시디언 깃을 사용하고 싶다면, `.gitignore` 파일에 `**/.obsidian` 경로를 추가해 두는 것을 권장합니다.  옵시디언이 관리하는 개별 저장소인 볼트(vault)로 설정된 디렉토리에는 자동으로 `.obsidian`이라는 이름의 디렉토리가 생성되어, 해당 볼트에 설치된 플러그인 등 설정 정보를 관리합니다.  옵시디언 깃으로 깃허브 리포지토리를 클론해오려고 할 때, 리포지토리에 `.obsidian` 폴더가 있으면 클론 과정에서 '현재 볼트의 모든 플러그인을 제거해야 합니다' 라고 하면서 플러그인 제거를 수행하는데, 옵시디언 깃도 플러그인이라 자기 자신까지 제거하게 됩니다.  결국 옵시디언 깃 설치 - 저장소 클론 - 옵시디언 깃 제거(!) - 깃 기능을 사용하기 위해 옵시디언 깃을 다시 설치(...) 하는 수고를 하게 됩니다.
{: .notice--info}

### 코드 에디터 - Acode

옵시디언은 강력한 마크다운 편집기이지만 기본적으로 `.md`파일 외 몇 가지 파일 형식을 제외하면 바닐라에서는 아예 읽어들이지도 않고 따라서 편집할 수도 없습니다.  HTML이나 CSS, 자바스크립트 등 Jekyll 블로그를 구성하는 다른 요소들을 모바일에서 수정해야 할 때는 Acode 앱을 사용합니다.

코드 편집기 어플리케이션은 다양하게 많지만, 사이드 메뉴로 폴더 및 파일트리 보기를 제공하는 어플리케이션을 찾기가 이상할 정도로 쉽지 않았습니다.  코드 편집기로서의 다른 기능보다는 폴더트리와 파일트리를 보면서 작업할 수 있는 점 때문에 코드 에디터로 사용하고 있습니다.

## Git 형상관리

### Termux 터미널

모바일 단말에서도 `Termux`를 이용해 리눅스 터미널을 사용하고, Git과 Ruby, Jekyll을 설치하여 코드 수정 및 원격 푸시 작업을 할 수 있습니다.  환경 설정 과정은 [다른 포스트](https://lazyjobseeker.github.io/programming/jekyll-based-github-blog-local-build-test-in-android-mobile-environment)에서 자세히 다루었습니다.

### 스펙 에디터 (Spck Editor) - 번외

Termux 환경에서 Git을 설치하여 사용하기 전에는 모바일 환경에서 Git 관련 기능을 사용하기 위해 **Spck Editor**를 사용했었습니다.

앱 내부의 데이터 영역에 외부 리포지토리를 클론하여 사용할 수 있고, 옵시디언 깃에서는 지원하지 않는 머지 컨플릭트 리졸브 등도 가능합니다.  

앱 내부 데이터 영역에 리포지토리를 클론해 두고 사용할 수 있고 옵시디언 깃에서 지원하지 않는 머지 컨플릭트 리졸브도 가능합니다.  옵시디언에서 작성한 마크다운 포스트를 이 앱에서 지원하는 파일 임포트 기능으로 옮겨 넣은 다음 커밋-푸시하는 방식으로 포스트 관리를 하고 있습니다.
