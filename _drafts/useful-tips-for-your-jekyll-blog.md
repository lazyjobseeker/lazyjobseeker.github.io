---
title: 지킬 깃허브 블로그 설정 팁
category: programming
tags:
  - jekyll
  - minimal-mistakes
created_at: 2024-04-26 12:55:13 +09:00
last_modified_at: 2024-04-26 01:48:19 +09:00
excerpt: 지킬 블로그 설정 및 운영에 유용한 팁 모음.
---

## 구글 드라이브 이미지 링크

`github pages`를 이용해 호스팅하는 블로그의 경우, 깃허브의 최대 레포지토리 크기 제한인 1GB를 초과할 수 없습니다.  이미지 하나의 크기가 100KB이라면 레포지토리 전체를 이미지로 채우더라도 대략 10000개 정도면 레포지토리 크기 제한을 모두 소모하게 됩니다.

구글 드라이브에 이미지를 넣어 놓고 링크하는 방식을 사용하면 이미지 저장 공간을 절약할 수 있습니다.  우선, 구글 드라이브에 이미지를 하나 넣어 놓고, 링크를 가져와 보겠습니다.

대충 링크

여기에서, 구글 드라이브가 이 파일에 부여하는 `id`를 확인할 수 있습니다.  이 값을 아래 양식에 넣어 주면 구글 드라이브 이미지를 마크다운 파일에서 링크로 가져올 수 있습니다.  이 방식은 단순히 리포지토리 공간을 절약할 수 있다는 것 외에도 장점이 있는데, 고유 아이디 값이 파일명을 바꾸더라도 변하지 않는다는 것입니다.  레포지토리 내부 에셋으로 이미지 파일을 포함하고 직접 이미지를 게시하는 경우 이미지 이름을 변경하고 싶으면 링크 주소를 다시 써 줘야 하지만 구글 드라이브에서 파일명을 바꾸는 것은 `id`에 영향을 주지 않기 때문에 아무렇게나 파일명을 변경할 수 있습니다.

반대로 단점은 이미지를 새 것으로 교체하고 싶을 때, 새 이미지를 드라이브에 넣어 주면 이전 파일과 같은 이름을 쓰더라도 아이디가 변경된다는 것입니다.  따라서 파일을 교체해 주었다면 이전 파일과 이름이 같더라도 이미지 링크에서 아이디 부분을 변경해 주어야 합니다.

URL 양식이 구글 드라이브 정책에 따라 달라지기 때문에, 어느 순간 구글 드라이브의 URL 양식이 바뀌어 버리면 그동안 링크해 두었던 이미지들이 한 번에 모두 쓸모없어지는 경우가 발생할 수 있습니다.  실제로 구글 드라이브 호스팅 방식으로 이미지를 제공하는 블로그들 중 상당수가 최근의 변경으로 인해 이미지 깨짐 현상을 겪고 있는 것을 알 수 있습니다.

URL 양식이 변경된 것을 깨닫고 수정을 하려고 해도 이미 많은 이미지들을 기존 URL 형식으로 링크해 두었다면 모든 포스팅을 찾아가 하나하나 변경해 주는 것이 여간 큰 일이 아닐 것입니다.  아래와 같이 `_include` 폴더에 공통 양식을 만들어 두고 사용하면, 나중에 변경 사항이 생기더라도 이 파일만 변경해 주면 됩니다.

```liquid
{% capture imgpth %}{{ include.id | prepend: "https://drive.google.com/thumbnail?id=" | append: "&sz=w1000" }}{% endcapture %}
[![{{ include.alt }}]({{ imgpth }}){: width="800" .align-center .shadow}]({{ imgpth }})
```
{: file="img-gdrive"}

마크다운 파일 안에서 아래와 같이 호출할 수 있습니다.

```liquid
{% include img-gdrive alt="평화로운 자연" id="" %}
```

## 페이지 리디렉션

`Jekyll`로 만든 `Github Pages` 블로그에 [다국어 지원 기능](https://lazyjobseeker.github.io/posts/github-blog-multiple-language-support-with-jekyll-theme-minimal-mistakes)을 구현하면서 기존에 사용하던 퍼마링크 구조를 변경하였습니다.  기존 주소로 구글 검색엔진 색인이 되어 있었는데, 퍼마링크를 변경하면 기존 검색 결과에 노출된 링크들이 `404 Not Found`와 함께 작동하지 않을 것이고 SEO에 손상이 갈 것이라고 생각했습니다.

다행히 `Jekyll` 플러그인 `jekyll-redirect-from`을 이용하여 리디렉션을 설정하는 방법이 있었습니다.  플러그인을 적용하고 사용하는 방법을 정리합니다.

### 플러그인 적용하기

플러그인을 적용하려면 `_config.yml` 파일에서 `jekyll-redirect-from` 플러그인을 사용하도록 설정합니다.

```yaml
# Plugins (previously gems:)
plugins:
  - jekyll-sitemap
  - jekyll-gist
  - jekyll-feed
  - jekyll-include-cache
  - jekyll-paginate
  - jekyll-redirect-from

# mimic GitHub Pages with --safe
whitelist:
  - jekyll-sitemap
  - jekyll-gist
  - jekyll-feed
  - jekyll-include-cache
  - jekyll-paginate
  - jekyll-redirect-from
```
{: file='_config.yml'}

### 페이지 리디렉션 설정하기

플러그인을 적용하고 나면, 원하는 페이지의 front matter에 `redirect_from`값을 설정해 줍니다.  아래 예시는 실제로 이 페이지의 front matter에 적용되어 있는 설정입니다.

```yaml
redirect_from:
  - /redirect-me/
```

`https://lazyjobseeker.github.io/redirect-me/`는 존재하는 파일이 아닙니다.  하지만 리디렉션이 적용되어 있기 때문에, 위 주소로 접근을 시도하면 이 페이지로 돌아오게 됩니다.  주소창에 위 주소를 넣어 보거나 이 [링크](https://lazyjobseeker.github.io/redirect-me/)에서 확인해 볼 수 있습니다.

## 수식 렌더링 활성화하기

Minimal Mistakes 테마의 Github Pages 블로그에 수식 렌더링을 위한 자바스크립트 라이브러리 Katex와 그래핑 라이브러리 JSXGraph를 적용하였습니다.  적용 및 문제 해결 과정을 정리합니다. 

### 수식 렌더링 - Katex

기존에 사용하고 있던 MathJax보다 처리 속도가 빠르고, MathJax를 사용할 때 일부 화학식 요소가 정상적으로 렌더링되지 않아 Katex로 변경하였습니다.

#### Katex 적용하기 (기본)

[Katex 공식 페이지](https://katex.org/docs/browser)에서는 아래 코드를 `head`에 적용하도록 가이드하고 있습니다.

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.css" integrity="sha384-n8MVd4RsNIU0tAv4ct0nTaAbDJwPJzDEaqSD1odI+WdtXRGWt2kTvGFasHpSy3SV" crossorigin="anonymous">
<!-- The loading of KaTeX is deferred to speed up page rendering -->
<script defer src="https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.js" integrity="sha384-XjKyOOlGwcjNTAIQHIpgOno0Hl1YQqzUOEleOLALmuqehneUG+vnGctmUb0ZY0l8" crossorigin="anonymous"></script>
<!-- To automatically render math in text elements, include the auto-render extension: -->
<script defer src="https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/contrib/auto-render.min.js" integrity="sha384-+VBxd3r6XgURycqtZ117nYw44OOcIax56Z4dCRWbxyPt0Koah1uHoK0o4+/RRE05" crossorigin="anonymous" onload="renderMathInElement(document.body);"></script>
```

적용 후, 한 줄 수식은 `\\[`와 `\\]`으로 감싸서 표시할 수 있습니다.  예를 들어, 아래와 같이 입력하면,

```
\\[ x^2 + y^2 = 1 \\]
```

아래와 같이 렌더링됩니다.

$$ x^2 + y^2 = 1 $$

인라인 수식은 `\[`와 `\]`로 감싸서 표시할 수 있습니다.  예를 들어, `\[ x^2 + y^2 = 1 \]`라고 쓰면 $ x^2 + y^2 = 1$ 로 표시됩니다.

#### 설정 변경하여 &#36;&#36;, &#36; 사용하고 화학식 표시하기

저는 두 가지 설정을 바꾸어 적용하고 있습니다.  **화학식 표시**를 위해 `mhchem`라이브러리를 추가로 사용하고, **달러 사인(&#36;&#36;, &#36;)을 수식 렌더링 진입점으로 사용**하기 위해 Delimiter 설정을 변경했습니다.  마크다운 편집기로 사용하고 있는 옵시디언(Obsidian)에서 수식 렌더링을 달러사인을 기준으로 사용하기 때문에 편의상 이렇게 설정했습니다.

실제로 `<head>` 태그 아래에 들어가도록 적용한 코드는 아래와 같습니다.  이렇게 설정하면 수학식 및 화학식 렌더링이 옵시디언의 미리보기에서 보는 것과 거의 동일하게 Github Pages 렌더링 결과로 나타납니다.


```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.css" integrity="sha384-n8MVd4RsNIU0tAv4ct0nTaAbDJwPJzDEaqSD1odI+WdtXRGWt2kTvGFasHpSy3SV" crossorigin="anonymous">

<!-- The loading of KaTeX is deferred to speed up page rendering -->
<script defer src="https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.js" integrity="sha384-XjKyOOlGwcjNTAIQHIpgOno0Hl1YQqzUOEleOLALmuqehneUG+vnGctmUb0ZY0l8" crossorigin="anonymous"></script>

<!-- mhchem for chemical equations -->
<script defer src="https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/contrib/mhchem.min.js" integrity="sha384-ifpG+NlgMq0kvOSGqGQxW1mJKpjjMDmZdpKGq3tbvD3WPhyshCEEYClriK/wRVU0"  crossorigin="anonymous"></script>

<!-- To automatically render math in text elements, include the auto-render extension: -->
<script defer src="https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/contrib/auto-render.min.js" integrity="sha384-+VBxd3r6XgURycqtZ117nYw44OOcIax56Z4dCRWbxyPt0Koah1uHoK0o4+/RRE05" crossorigin="anonymous" onload="renderMathInElement(document.body, {delimiters: [{left: '$$', right: '$$', display: true}, {left: '\\[', right: '\\]', display: true}, {left: '$', right: '$', display: false}, {left: '\\(', right: '\\)', display: false}]});"></script>
```

화학식은 `\ce{}`을 추가로 넣어 주고 중괄호 안에 화학식을 써 줍니다.

한 줄 화학식은 아래와 같이 작성합니다:

```html
$$ \ce{H2O -> H2 + 1/2O2} $$
```

위와 같이 입력하면, 아래와 같이 렌더링됩니다.

$$ \ce{H2O -> H2 + 1/2O2} $$

인라인 화학식도 일반 수식과 동일합니다.  `$ \ce{H2O -> H2 + 1/2O2} $` 로 쓰면, $\ce{H2O -> H2 + 1/2O2}$ 와 같이 렌더링됩니다.

### 그래프 그리기 - JSXGraph

#### JSXGraph 적용하기

JSXGraph를 적용하기 위해서는 `<head>` 영역에 아래 스크립트를 추가합니다.

```html
<!-- To enable JSX mathematical plotting -->
<link href="https://cdn.jsdelivr.net/npm/jsxgraph/distrib/jsxgraph.css" rel="stylesheet" type="text/css" />
<script src="https://cdn.jsdelivr.net/npm/jsxgraph/distrib/jsxgraphcore.js" type="text/javascript" charset="UTF-8"></script>
<script src="/assets/js/custom-math-functions.js"></script>
```

#### 참고 사이트

- [라이브러리 공식 페이지](https://jsxgraph.uni-bayreuth.de/wp/index.html)
- [JSXGraph Book](https://ipesek.github.io/jsxgraphbook/)


