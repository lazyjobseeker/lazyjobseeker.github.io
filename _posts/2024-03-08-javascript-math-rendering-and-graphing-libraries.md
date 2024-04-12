---
translated: true
title: "자바스크립트로 수식과 그래프 표시"
category: programming
redirect_from:
  - /programming/javascript-math-rendering-and-graphing-libraries/
tags:
  - minimal-mistakes
  - jekyll
  - javascript
  - katex
  - jsxgraph
created_at: 2024-03-08 11:13:00 +09:00
last_modified_at: 2024-04-12 11:13:24 +09:00
header:
  teaser: /assets/images/uncategorized-teaser-3.png
excerpt: "Github 블로그에 수학식 및 화학식 표시를 위한 Javascript 라이브러리 적용. 수학식 표시를 위한 Katex 라이브러리와 함수 그래프 표시를 위한 JSXGraph 라이브러리 적용 과정 정리."
---

Minimal Mistakes 테마의 Github Pages 블로그에 수식 렌더링을 위한 자바스크립트 라이브러리 Katex와 그래핑 라이브러리 JSXGraph를 적용하였습니다.  적용 및 문제 해결 과정을 정리합니다. 

## 1. 수식 렌더링 - Katex

기존에 사용하고 있던 MathJax보다 처리 속도가 빠르고, MathJax를 사용할 때 일부 화학식 요소가 정상적으로 렌더링되지 않아 Katex로 변경하였습니다.

### 1.1. Katex 적용하기 (기본)

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

### 1.2. 설정 변경하여 &#36;&#36;, &#36; 사용하고 화학식 표시하기

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

## 2. 그래프 그리기 - JSXGraph

### 2.1. JSXGraph 적용하기

JSXGraph를 적용하기 위해서는 `<head>` 영역에 아래 스크립트를 추가합니다.

```html
<!-- To enable JSX mathematical plotting -->
<link href="https://cdn.jsdelivr.net/npm/jsxgraph/distrib/jsxgraph.css" rel="stylesheet" type="text/css" />
<script src="https://cdn.jsdelivr.net/npm/jsxgraph/distrib/jsxgraphcore.js" type="text/javascript" charset="UTF-8"></script>
<script src="/assets/js/custom-math-functions.js"></script>
```

### 2.2. 참고 사이트

- [라이브러리 공식 페이지](https://jsxgraph.uni-bayreuth.de/wp/index.html)
- [JSXGraph Book](https://ipesek.github.io/jsxgraphbook/)