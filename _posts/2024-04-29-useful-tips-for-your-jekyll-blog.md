---
title: 지킬 깃허브 블로그 설정 팁
category: programming
tags:
  - jekyll
  - minimal-mistakes
created_at: 2024-12-02 05:21:48 -05:00
last_modified_at: 2025-08-08 10:34:18 -05:00
excerpt: 지킬 블로그 설정 및 운영에 유용한 팁 모음.
---

`Jekyll`로 작성하여 `Github Pages`를 통해 블로그 호스팅을 하는 경우 유용한 팁들입니다.

## cdn.jsdelivr.net의 SSL 이슈

[**github 이슈 보드 링크**](https://github.com/jsdelivr/jsdelivr/issues/18565)

2024년 5월 2일 확인된 문제로, `cdn.jsdelivr.net`의 SSL 관련 이슈 발생으로 `cdn`을 통해 로드되는 웹폰트 및 js 파일들이 모두 작동하지 않는 문제가 있습니다.  이로 인해 이 블로그의 경우 웹폰트 / 수식 표시 / 아이콘 표시 / 사이트 내부 검색엔진이 동작하지 않았습니다.

위 이슈 보드에 코멘트되고 있는 해결 방법 중 `cdn`을 `fastly`로 변경하는 것으로 임시 해결한 상태입니다.

## 구글 드라이브 이미지 링크

`github pages`를 이용해 호스팅하는 블로그의 경우, 깃허브의 최대 레포지토리 크기 제한인 1GB를 초과할 수 없습니다.  이미지 하나의 크기가 100KB이라면 레포지토리 전체를 이미지로 채우더라도 대략 10000개 정도면 레포지토리 크기 제한을 모두 소모하게 됩니다.

구글 드라이브에 이미지를 넣어 놓고 링크하는 방식을 사용하면 이미지 저장 공간을 절약할 수 있습니다.  우선, 구글 드라이브에 이미지를 하나 넣어 놓고, 링크를 가져와 보겠습니다.

```
https://drive.google.com/file/d/1lRde51cNGYFmbS4p__7j9y0XKId2w0qR/view?usp=drive_link
```

여기에서, 구글 드라이브가 이 파일에 부여하는 `id`를 확인할 수 있습니다.  `/d/`와 `/view?` 사이에 있는 문자열이 이 이미지의 `id`입니다.

이 값을 아래와 같은 양식에 넣어 주면 구글 드라이브 이미지를 마크다운 파일에서 불러들일 수 있습니다.

```markdown
![이미지 설명](https://drive.google.com/thumbnail?id=ID값&sz=w1000)
```

**ID값** 부분에 아래와 같이 위의 링크에서 얻은 값을 넣어 줍니다.

```markdown
![미니어처 트랙터](https://drive.google.com/thumbnail?id=1lRde51cNGYFmbS4p__7j9y0XKId2w0qR&sz=w1000)
```

그러면 아래와 같이 이미지를 넣어줄 수 있습니다.

![미니어처 트랙터](https://drive.google.com/thumbnail?id=1lRde51cNGYFmbS4p__7j9y0XKId2w0qR&sz=w1000)

이러한 방식을 사용하면 리포지토리 공간을 절약할 수 있습니다.  또한 아이디 값이 구글 드라이브에서 파일명을 바꾸더라도 변하지 않기 때문에 편리합니다.

레포지토리 내부 에셋으로 업로드한 이미지 파일을 이용하는 경우, 이미지 이름을 변경하고 싶으면 변경된 파일명에 맞추어 하이퍼링크를 손봐 주어야 하기 때문에 번거로움이 있습니다.

물론 이것은 반대로 단점이 될 수도 있는데, 이미지를 새 것으로 교체하고 싶은 경우, 새 이미지를 드라이브에 넣어 주면 이전 파일과 같은 이름을 쓰더라도 `id`값이 변경되어 버립니다.  따라서 파일을 교체해 주었다면 이전 파일과 이름이 같더라도 이미지 링크의 `id` 값을 새로 알아내 바꾸어 주어야 합니다.

구글 드라이브에서 이미지 링크를 걸기 위한 URL 양식이 구글 드라이브의 정책에 따라 달라지기 때문에, 어느 순간 구글 정책 변경으로 그 동안 블로그에 링크해 두었던 구글 드라이브 이미지들의 링크가 모두 깨지는 경우가 발생할 수 있습니다.

URL 양식이 변경된 것을 깨닫고 수정을 하려고 해도, 이미 많은 이미지들을 하나의 URL 형식으로 호스팅하고 있다면 모든 포스트에서 이미지 링크 부분을 찾아가 변경해 주는 것이 번거로울 것입니다.  저는 아래와 같이 `_include` 폴더에 공통 양식을 만들어 사용하고 있습니다.  그림자 효과와 중앙 정렬 및 이미지 클릭시 전체 이미지를 볼 수 있도록 하는 내용이 추가되어 있습니다.

```liquid
{% raw %}{% capture imgpth %}{{ include.id | prepend: "https://drive.google.com/thumbnail?id=" | append: "&sz=w1000" }}{% endcapture %}
[![{{ include.alt }}]({{ imgpth }}){: width="800" .align-center .shadow}]({{ imgpth }}){% endraw %}
```
{: file="img-gdrive"}

이 파일은 마크다운 파일 안에서 아래와 같이 호출할 수 있습니다.

```liquid
{% raw %}{% include img-gdrive alt="미니어처 트랙터" id="1lRde51cNGYFmbS4p__7j9y0XKId2w0qR" %}{% endraw %}
```

{% include img-gdrive alt="미니어처 트랙터" id="1lRde51cNGYFmbS4p__7j9y0XKId2w0qR" %}

## 페이지 리디렉션

`Jekyll`로 만든 `Github Pages` 블로그에 [**다국어 지원 기능**](https://lazyjobseeker.github.io/posts/github-blog-multiple-language-support-with-jekyll-theme-minimal-mistakes)을 구현하면서 기존에 사용하던 퍼마링크 구조를 변경하였습니다.  기존 주소로 구글 검색엔진 색인이 되어 있었는데, 퍼마링크를 변경하면 기존 검색 결과에 노출된 링크들이 `404 Not Found`와 함께 작동하지 않을 것이고 SEO에 손상이 갈 것이라고 생각했습니다.

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

플러그인을 적용하고 나면, 원하는 페이지의 front matter에 `redirect_from`값을 설정해 줍니다.

```yaml
redirect_from:
  - /redirect-me/
```

`/redirect-me/`는 존재하는 경로가 아닙니다.  하지만 위와 같이 리디렉션을 적용하면, 위 주소로 접근을 시도했을 때 이 페이지로 돌아오게 됩니다.  주소창에 위 주소를 넣어 보는 방식으로 확인해 볼 수 있습니다.

## 수식 렌더링 및 그래프 그리기

Minimal Mistakes 테마의 Github Pages 블로그에 수식 렌더링을 위한 자바스크립트 라이브러리 Katex와 그래핑 라이브러리 JSXGraph를 적용하였습니다.  적용 및 문제 해결 과정을 정리합니다. 

### 수식 렌더링 - Katex

기존에 사용하고 있던 MathJax보다 처리 속도가 빠르고, MathJax를 사용할 때 일부 화학식 요소가 정상적으로 렌더링되지 않아 Katex로 변경하였습니다.

#### Katex 적용하기 (기본)

[**Katex 공식 페이지**](https://katex.org/docs/browser)에서는 아래 코드를 `head`에 적용하도록 가이드하고 있습니다.

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


