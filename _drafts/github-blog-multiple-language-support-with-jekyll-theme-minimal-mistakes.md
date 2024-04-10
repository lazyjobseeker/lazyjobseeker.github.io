---
translated: false
title: 플러그인 없이 지킬 블로그 다국어 지원하기
category: Programming
tags:
  - Jekyll
  - "Github Pages"
  - "Minimal Mistakes"
  - "Multi-Languages"
created_at: 2024-04-05 18:09:50 +09:00
last_modified_at: 2024-04-10 10:02:30 +09:00
header:
  teaser: /assets/images/uncategorized-teaser-6.png
excerpt: 지킬 테마 Minimal Mistakes로 만든 Github 블로그에 별도 다국어 지원 플러그인(polyglot, jekyll-multiple-languages-plugin) 없이 다국어 지원을 구현한 과정을 정리합니다.
---

## 들어가기

개인 블로그에서 한글과 영어를 모두 지원하는 **다국어 지원**의 구현이 오랜 숙제였습니다.  이 블로그는 다양한 기능을 가진 `Jekyll` 테마 `Minimal Mistakes`로 만들어져 있지만, 아쉽게도 다국어 지원을 테마 자체로 지원하지는 않았습니다.

`Polyglot` 플러그인을 이용하여 다국어를 구현하는 사례가 많았지만, `Github Pages`에서의 실행이 지원되지 않는다는 것을 알게 되어 완벽한 대안은 아니라고 판단했습니다.

최종적으로 이 블로그의 다국어 지원은 `Jekyll`의 기본 요소들과 `Liquid` 문법을 이용하여 별도 **플러그인 없이** 구현하였습니다.  구현하고자 한 내용은 아래와 같았으며, `Minimal Mistakes` 테마를 기준으로 합니다.

- 한글로 작성된 어떤 문서의 퍼마링크가 `a`라면, 영어로 번역된 문서의 퍼마링크는 반드시 `en/a`로 제공한다.
- 어떤 문서에 대한 영어(한글) 번역 문서가 있다면, 상단 마스트헤드 영역에 번역된 문서 페이지로 이동 가능한 **토글 버튼**을 제공한다.

![Toggle Button in Korean Page](https://drive.google.com/thumbnail?id=1XAFm9BNOh2lhPKw37O5vdgVUysf0ES2N&sz=w1000){: width="400" .align-center .shadow}

![Toggle Button in English Page](https://drive.google.com/thumbnail?id=1-IZLOfVRfiX7uiCn5lPfi9mCWe32izFt&sz=w1000){: width="400" .align-center .shadow}

- 기본 홈 페이지의 **Recent Posts** 영역이 정상적으로 동작한다.
- 마스트헤드 및 사이드바의 모든 링크가 정상적으로 동작한다.
- **이전·다음 글 보기** 버튼들이 정상적으로 동작한다.

![Previous and Next Page](https://drive.google.com/thumbnail?id=1H26X7XH4EAXJB7_HuNA2T1uIyEKnHzO-&sz=w1000){: width="400" .align-center .shadow}

- 연관 포스트를 표시하는 **YOU MAY ALSO ENJOY** 영역이 정상적으로 동작한다.

![YOU MAY ALSO ENJOY in Korean Page](https://drive.google.com/thumbnail?id=1cU6oihM7R1oAz91QOWI7wDA4FXaevpdo&sz=w1000){: width="600" .align-center .shadow}

![YOU MAY ALSO ENJOY in English Page](https://drive.google.com/thumbnail?id=19ZbY55-gDmx29M54it5_hC1bsxVow-Hd&sz=w1000){: width="600" .align-center .shadow}

## 기능 구현 개요

가장 중요한 것은 매 페이지가 렌더링될 때마다 몇 가지 `L`

## 영문 컨텐츠 폴더 만들기

프로젝트 루트 경로에 번역된 문서들을 저장할 `en`이라는 새로운 폴더를 만들었습니다.

예를 들어, 루트 경로의 `_posts`에는 한글 포스트들이 존재합니다.  포스들은 모두 영어로 번역하고자 하였기 때문에, `en` 디렉토리 하위에 `_posts` 폴더를 새로 만들어 주었습니다.

```
lazyjobseeker.github.io
├─ _posts
└─ en
   └─ _posts
```

**여러 개의 `Posts` 폴더**<br>`_posts` 폴더는 프로젝트 내에 반드시 하나일 필요가 없으며, 프로젝트에 존재하는 모든 `_posts`라는 이름의 폴더들이 빌드 대상이 됩니다.  만일 프로젝트 루트의 `_post` 폴더 외에 `a/_posts`라는 폴더가 존재한다면, 이 폴더에서 빌드되는 포스트들은 `a`라는 카테고리를 갖는 것으로 분류됩니다.
{: .notice--info}

## 커스텀 변수 설정

다국어 지원에 필요한 추가 변수들을 설정합니다.

### `_config.yml` 파일 수정

`_posts`에 존재하는 한국어 문서들과 `en/_posts`에 존재하는 영어 문서들에 대해 서로 다른 디폴트 설정을 제공하기 위해 `_config.yml` 파일의 내용을 수정하였습니다.  구체적으로는 `lang` 변수를 새로 추가하여 한글 포스트들은 `ko`, 영어 포스트들은 `en` 값을 갖도록 하였습니다.

그리고 퍼마링크(permalink) 구조도 변경하였습니다.  `Minimal Mistakes` 테마의 기본 퍼마링크 세팅은 `/:categories/:title` 인데, `en/_posts`에 작성하는 영문 포스트들은 기본적으로 상위 폴더명인 `en`을 추가 카테고리로 가지게 되고, 이로 인해 퍼마링크의 가장 앞에 `en` 경로가 강제로 추가됩니다.  이로 인해 일관성 있는 퍼마링크 제공에 어려움이 발생할 수 있다고 생각하여 퍼마링크 구조를 변경해 주었습니다. 

```yaml
# 일부 값들은 편의상 생략하였습니다.
defaults:
  # 한글 포스트들에 대한 디폴트 설정
  - scope:
      path: "_posts"
      type: posts
    values:
      lang: ko
      permalink: /posts/:title/
  # 영어 포스트들에 대한 디폴트 설정
  - scope:
      path: "en/_posts"
      type: posts
    values:
      lang: en
      permalink: /en/posts/:title/
```
{: file='_config.yml`}

**퍼마링크 변경에 따른 리디렉션**<br>퍼마링크 구성을 바꾸게 되면 기존 페이지에 대해 만들어져 있던 구글 색인 결과를 더 이상 사용할 수 없게 되고 이로 인해 페이지에 대한 검색엔진 최적화(SEO)에 악영향을 줄 수 있습니다.  `jekyll-redirect-from` 패키지를 이용해 리디렉션을 설정하여 이러한 문제를 어느 정도 해결할 수 있습니다.
{: .notice--info}

또한 상단바(마스트헤드) 영역의 왼쪽 끝에 표시되는 **블로그 제목 및 부제목**도 한국어와 영어 페이지에서 서로 다르게 표시하기 위해 값을 분리하여 주었습니다. 

```yaml
display-title:
  ko: "나불나불 끄적끄적"
  en: "Lazyjobseeker's Blog"
display-subtitle:
  ko: "읽고 쓰고 그리고 기억하기"
  en: "I read, write, draw and remember"
```
{: file='_config.yml`}

마지막으로, 사이드바에 표시되는 블로그 저자 (author) 소개 문구도 언어에 따라 달리 적용되도록 분리했습니다.

```yaml
# Site Author
author:
  name : "Sangheon Lee"
  avatar : "/assets/images/logo.png"
  bio :
    ko: "일하는 것처럼 보인다면 착각입니다."
    en: "If it looks like I am working, you are mistaken."
```
{: file='_config.yml`}

### `translated` 변수 추가

어떤 문서가 자신의 번역된 버전을 가지고 있는지 알려 주는 불리언 변수 `translated`를 YAML Front Matter로 명시해 주기로 하였습니다.  예를 들어 `_post` 혹은 `en/_post` 하위의 어떤 마크다운 파일이 Front Matter로 아래 내용을 가진다면, 해당 파일에 대한 영어(한글) 번역이 존재한다는 뜻입니다.

```yaml
translated: true
```

`translated` 변수가 존재하지 않거나 `false` 라면 해당 페이지에 대한 번역은 존재하지 않는다는 것입니다.

지금까지의 내용을 정리하기 위해 아래와 같은 예시를 살펴 보겠습니다.

```
lazyjobseeker.github.io
├─ _posts
│     └─ 2024-04-05-example.md
│        (target url = https://lazyjobseeker.github.io/posts/example/)
└─ en
   └─ _posts
         └─ 2024-04-05-example.md
            (target url = https://lazyjobseeker.github.io/en/posts/example/
```

`2024-04-05-example.md`는 한글 및 영어 버전을 갖는 포스트 파일들입니다.  두 파일 모두 Front Matter에 `translated: true`가 선언되어 있습니다.  또한 `_config.yml`에 정의된 디폴트 설정으로 인해 `_post` 하위의 파일은 `ko`, `en/_post` 하위의 파일은 `en`을 `lang` 값으로 갖게 됩니다.

**파일명에 대하여**<br>`_posts`와 `en/_posts`에 존재하는 번역된 문서들은 동일한 파일명을 가지고 있어야 합니다.  만일 동일한 파일명을 사용하고 싶지 않다면, 다른 변수를 정의하는 등의 방식으로 특정한 두 마크다운 파일이 동일한 내용의 번역들이라는 것을 알 수 있도록 해 두어야 합니다.
{: .notice--warning}

## 언어별로 타겟 언어 URL 및 블로그 제목/부제목 변경하기

앞선 내용을 바탕으로, 어떤 포스트의 `translated` 및 `lang` 변수에 따라 상대 언어로 만들어진 포스트의 URL을 제공할 수 있는 `Liquid` 코드를 작성하였습니다.

구체적으로는, `_include` 폴더에 `lang-toggle-post.html`이라는 이름으로 아래와 같은 코드를 작성하였습니다.

```liquid
{% raw %}{% if page.lang == 'ko' %}
  {% assign prefix = '/' %}
  {% if page.translated %}
    {% assign target-url-ko = page.url | relative_url %}
    {% assign target-url-en = page.url | prepend: '/en' | relative_url %}
  {% else %}
    {% assign target-url-ko = page.url %}
    {% assign target-url-en = page.url %}
  {% endif %}
  {% assign display-title = site.display-title.ko %}
  {% assign display-subtitle = site.display-subtitle.ko %}
{% else %}
  {% assign prefix = page.lang | prepend: '/' %}
  {% if page.translated %}
    {% assign target-url-ko = page.url | replace: '/en/', '/' | relative_url %}
    {% assign target-url-en = page.url | relative_url %}
  {% else %}
    {% assign target-url-ko = page.url %}
    {% assign target-url-en = page.url %}
  {% endif %}
  {% assign display-title = site.display-title.en %}
  {% assign display-subtitle = site.display-subtitle.en %}
{% endif %}
{% endif %}{% endraw %}
```
{: file='_includes/lang-toggle-post.html'}

위 `Liquid` 코드는 주어진 페이지의 `lang` 값이 `ko`인지 `en`인지에 따라 서로 다른 URL을 생성하기 위한 것입니다.  총 4개의 `Liquid` 변수를 이후의 html에서 참조할 수 있도록 생성합니다.

- `target-url-ko`: (영어 포스트인 경우) 한글 포스트가 존재한다면 해당 한글 포스트의 URL.
- `target-url-en`: (한글 포스트인 경우) 영어 포스트가 존재한다면 해당 영어 포스트의 URL.
- `display-title`: 블로그 제목.
- `display-subtitle`: 블로그 부제목.

## 마스트헤드 수정하기

이제 어떤 `html` 파일이던지 적당한 위치에서 `lang-toggle-post.html` 파일을 `include`하면 위의 4가지 `Liquid` 변수들을 사용할 수 있습니다.

이를 이용하여 가장 먼저 블로그 상단의 마스트헤드 영역을 나타내는 `_includes/masthead.html` 파일을 수정하였습니다.  먼저 마스트헤드 영역 우측에 한글 포스트이면 `EN` 링크를, 영어 포스트이면 `KO`라고 써 준 다음 번역된 포스트로의 링크를 제공하도록 하였습니다.  또한 언어에 따라 다른 값이 적용되도록 한 블로그 제목 및 부제목 변수를 이용하여 현재 포스트의 타겟 언어 상태에 따라 서로 다른 제목과 부제목이 나타나도록 변경했습니다.

```html
{% raw %}{% if page.id %}{% include lang-toggle-post.html %}{% endif %}
<div class="masthead">
  <div class="masthead__inner-wrap">
    <div class="masthead__menu">
      <nav id="site-nav" class="greedy-nav">
        {% unless logo_path == empty %}
          <a class="site-logo" href="{{ prefix | relative_url }}"><img src="{{ logo_path | relative_url }}" alt="{{ site.masthead_title | default: display-title }}"></a>
        {% endunless %}
        <a class="site-title" href="{{ prefix | relative_url }}">
          {{ site.masthead_title | default: display-title }}
          {% if site.display-subtitle %}<span class="site-subtitle">{{ display-subtitle }}</span>{% endif %}
        </a>
        <ul class="visible-links">
          {% if page.lang == 'en' %}
            <li class="masthead__menu-item">
              <a href="{{ target-url-ko }}" title="Page in Korean">KO</a>
            </li>
          {% endif %}
          {% if page.lang == 'ko' %}
            <li class="masthead__menu-item">
              <a href="{{ target-url-en }}" title="Page in English">EN</a>
            </li>
          {% endif %}
          {%- for link in site.data.navigation.main -%}
            <li class="masthead__menu-item">
              <a href="{{ link.url | prepend: site.baseurl }}"{% if link.description %} title="{{ link.description }}"{% endif %}>{{ link.title }}</a>
            </li>
          {%- endfor -%}
        </ul>
        {% if site.search == true %}
        <button class="search__toggle" type="button">
          <span class="visually-hidden">{{ site.data.ui-text[site.locale].search_label | default: "Toggle search" }}</span>
          <i class="fas fa-search"></i>
        </button>
        {% endif %}
        <button class="greedy-nav__toggle hidden" type="button">
          <span class="visually-hidden">{{ site.data.ui-text[site.locale].menu_label | default: "Toggle menu" }}</span>
          <div class="navicon"></div>
        </button>
        <ul class="hidden-links hidden"></ul>
      </nav>
    </div>
  </div>
</div>{% endraw %}
```
{: file='_includes/masthead.html'}

## 사이드바 수정하기

사이드바 영역을 구현하는 파일 중 `_includes/author-profile.html`에는 아래 `Liquid` 구문을 추가했습니다.

```liquid
{% raw %}{% if page.lang == 'ko' %}
  {% assign prefix = '/' %}
  {% assign author_bio = author.bio.ko %}
{% else %}
  {% assign prefix = page.lang | prepend: '/' %}
  {% assign author_bio = author.bio.en %}
{% endif %}{% endraw %}
```
{: file='_includes/author-profile.html'}

`author_bio` 변수는 `page.lang` 변수가 `ko`인지 `en`인지에 따라 `_config.yml`에 설정된 블로그 저자 소개 관련 스트링 중 알맞은 값을 갖게 됩니다.  `author-profile.html`의 이후 부분에서는 원래 코드에서 `author.bio`로 되어 있는 부분을 모두 새로 정의한 변수 `author_bio`로 바꾸어 주었습니다.

`_includes/nav_list` 파일도 사이드바 영역을 구현하는 파일 중 하나입니다.  아래와 같이 변경하여, 사이드바에 존재하는 링크들이 타게팅하는 URL을 포스트의 `lang` 변수에 따라 변경하도록 하였습니다.

```html
{% raw %}{% assign navigation = site.data.navigation[include.nav] %}

{% if page.lang == 'ko' %}
  {% assign prefix = '' %}
{% elsif page.lang == 'en' %}
  {% assign prefix = page.lang | prepend: '/' %}
{% endif %}

<nav class="nav__list">
  {% if page.sidebar.title %}<h3 class="nav__title" style="padding-left: 0;">{{ page.sidebar.title }}</h3>{% endif %}
  <input id="ac-toc" name="accordion-toc" type="checkbox" />
  <label for="ac-toc">{{ site.data.ui-text[site.locale].menu_label | default: "Toggle Menu" }}</label>
  <ul class="nav__items">
    {% for nav in navigation %}
      <li>
        {% if nav.url %}
          <a href="{{ nav.url | prepend: prefix | relative_url }}"><span class="nav__sub-title">{{ nav.title }}</span></a>
        {% else %}
          <span class="nav__sub-title">{{ nav.title }}</span>
        {% endif %}

        {% if nav.children != null %}
        <ul>
          {% for child in nav.children %}
            <li><a href="{{ child.url | prepend: prefix | prepend: site.url }}"{% if child.url == page.url %} class="active"{% endif %}>{{ child.title }}</a></li>
          {% endfor %}
        </ul>
        {% endif %}
      </li>
    {% endfor %}
  </ul>
</nav>{% endraw %}
```
{: file='_includes/nav_list'}

## 푸터 수정하기

앞선 과정을 통해 포스트의 최상단(마스트헤드) 부분과 사이드바에 언어에 따라 서로 다른 링크 및 텍스트를 적용할 수 있었습니다.  다음으로는 푸터 부분, 즉 페이지 본문 이후 아래 부분에 추가되는 요소들에서 다국어 지원이 필요한 부분들을 해결해야 합니다.

### 이전 & 다음 포스트 구현하기

가장 먼저 해결해야 하는 문제는 `Minimal Mistakes` 테마에서 개별 포스트의 최하단 푸터 부분에 제공하는 포스트 페이지네이션 (post-pagination) 기능입니다.

포스트 본문의 가장 아래 영역에 이전 포스트 및 다음 포스트로 이동할 수 있는 `Previous`와 `Next` 버튼이 구현되어 있는데, 이 부분은 `jekyll-paginate` 플러그인을 이용하여 구현된 것은 아니고 `Jekyll`에서 제공하는 `page` 객체를 이용합니다.  `page` 객체에는 `page.next`와 `page.previous`라는 변수가 정의되어 있어 어떤 포스트를 기준으로 이전 포스트와 이후 포스트 객체에 접근할 수 있습니다.

하지만 이 역시 포스트의 언어를 구분할 수 있도록 구현된 것은 아니기 때문에, 이 부분을 수정해 주지 않으면 영어 포스트에서 `Next`를 누르다 보면 한글 포스트가 나온다거나 하는 상황이 발생하게 됩니다.

이를 해결하기 위해, 먼저 현재 포스트의 언어를 기준으로 동일한 언어로 작성된 포스트들만 모아 둔 `Liquid` 객체를 반환할 수 있는 코드를 `_includes/custom-paginator` 디렉토리에 `single-post-paginator.html`이라는 이름으로 작성하였습니다.

```liquid
{% raw %}{% assign posts = "" | split: ',' %}
{% for post in site.posts %}
  {% if post.lang and post.lang == page.lang %}
    {% assign posts = posts | push: post %}
  {% endif %}
{% endfor %}

{% assign last_idx = posts.size | minus: 1 %}
{% for idx in (0..posts.size) %}
  {% assign prev_idx = idx | plus: 1 %}
  {% assign next_idx = idx | minus: 1 %}
  {% if page.id == posts[idx].id %}
    {% if idx == 0 %}
      {% assign post_prev = posts[prev_idx] %}
      {% assign post_next = posts[idx] %}
    {% elsif idx == last_idx %}
      {% assign post_prev = posts[idx] %}
      {% assign post_next = posts[next_idx] %}
    {% else %}
      {% assign post_prev = posts[prev_idx] %}
      {% assign post_next = posts[next_idx] %}
    {% endif %}
    {% break %}
  {% endif %}
{% endfor %}{% raw %}
```
{: file='_includes/custom-paginator/single-post-paginator.html'}

`single-post-paginator.html`을 `include`하고 나면 **현재 포스트의 언어를 기준으로** 동일한 언어로 작성된 포스트들만 모아 둔 `liquid` 객체인 `post`를 참조할 수 있고,  마찬가지로 현재 포스트의 언어를 기준으로 이전 포스트를 나타내는 `post_prev`와 다음 포스트를 나타내는 `post_next`를 사용할 수 있게 됩니다.

이제 포스트의 기본 레이아웃을 결정하는 `_layouts/single.html` 파일에서 `single-post-paginator.html`을 `include`하고 `post_prev`와 `post_next`를 이용하도록 하이퍼링크 참조들을 바꾸어 주면 됩니다.  이전/다음 포스트를 구현하는 부분이 `_includes/post_pagination.html` 파일에 구현되어 `include`되고 있기 때문에 해당 파일 내에서 `post_prev`와 `post_next`를 참조할 수 있도록 넘겨 주었습니다.

```html
  <footer class="page__meta">
	{% raw %}{% if site.data.ui-text[site.locale].meta_label %}
	  <h4 class="page__meta-title">{{ site.data.ui-text[site.locale].meta_label }}</h4>
	{% endif %}
	{% include page__taxonomy.html %}
	{% include page__date.html %}
  </footer>
  {% if page.share %}{% include social-share.html %}{% endif %}
  {% include custom-paginator/single-post-paginator.html %}
  {% if post_prev or post_next %}
	{% include post_pagination.html post_prev=post_prev post_next=post_next %}
  {% else %}
	{% include post_pagination.html %}
  {% endif %}{% endraw %}
```
{: file='_includes/single.html'}

```html
{% raw %}{% if include.post_prev or include.post_next %}
  <nav class="pagination">
    {% if include.post_prev.id != page.id %}
      <a href="{{ post_prev.url | relative_url }}" class="pagination--pager" title="{{ post_prev.title | markdownify | strip_html }}">{{ site.data.ui-text[site.locale].pagination_previous | default: "Previous" }}</a>
    {% else %}
      <a href="#" class="pagination--pager disabled">{{ site.data.ui-text[site.locale].pagination_previous | default: "Previous" }}</a>
    {% endif %}
    {% if include.post_next.id != page.id %}
      <a href="{{ post_next.url | relative_url }}" class="pagination--pager" title="{{ post_next.title | markdownify | strip_html }}">{{ site.data.ui-text[site.locale].pagination_next | default: "Next" }}</a>
    {% else %}
      <a href="#" class="pagination--pager disabled">{{ site.data.ui-text[site.locale].pagination_next | default: "Next" }}</a>
    {% endif %}
  </nav>
{% endif %}{% endraw %}
```
{: file='_includes/post-pagination.html'}

### Related Posts 구현하기

다음으로는 현재 포스트와 연관성이 있는 포스트들을 나열해 주는 Related Posts 부분을 수정했습니다.  `_layouts/single.html`의 최하단 부분을 수정하는데, 해당 언어로 작성된 포스트 중 4개를 랜덤 샘플링하여 보여주는 것으로 컨셉을 바꾸었습니다.  따라서 Related Posts 부분에 노출되는 4개 포스트의 조합이 사이트를 빌드할 때마다 매번 바뀌게 됩니다.

```html
{% raw %}{% comment %}<!-- only show related on a post page when `related: true` -->{% endcomment %}
  {% if page.id and page.related and site.related_posts.size > 0 %}
    <div class="page__related">
      <h2 class="page__related-title">{{ site.data.ui-text[site.locale].related_label | default: "You May Also Enjoy" }}</h2>
      <div class="grid__wrapper">
        {% assign sampled_posts = posts | sample: 4 %}
        {% for post in sampled_posts %}
          {% include archive-single.html type="grid" %}
        {% endfor %}
      </div>
    </div>
  {% comment %}<!-- otherwise show recent posts if no related when `related: true` -->{% endcomment %}
  {% elsif page.id and page.related %}
    <div class="page__related">
      <h2 class="page__related-title">{{ site.data.ui-text[site.locale].related_label | default: "You May Also Enjoy" }}</h2>
      <div class="grid__wrapper">
        {% for post in posts limit:4 %}
          {% if post.id == page.id %}
            {% continue %}
          {% endif %}
          {% include archive-single.html type="grid" %}
        {% endfor %}
      </div>
    </div>
  {% endif %}{% endraw %}
```
{: file='_layouts/single.html'}

### 카테고리 리스트에서 `en` 제거하기

`Jekyll`의 동작 방식에 따르면 `en` 폴더 하위에 존재하는 문서들은 기본적으로 `en`이라는 카테고리를 갖는 것으로 취급됩니다.  `Minimal Mistakes` 테마의 포스트 마지막 부분에는 현재 포스트가 속한 카테고리들을 나열하는 부분이 있는데, 별도로 수정을 하지 않으면 영어 포스트들은 이 부분에 `en`이라는 카테고리가 기본적으로 존재하는 것처럼 빌드됩니다.

이것을 방지하기 위해 `_includes/category-list.html` 파일을 수정하여, `en`이라는 이름의 카테고리가 존재하는 경우 해당 태그는 나타내지 않도록 하였습니다.

## 홈 페이지네이터 커스텀하기

`Minimal Mistakes` 테마에는 페이지네이션(pagination) 기능을 이용한 요소들이 있습니다.  페이지네이션은 여러 포스트들을 페이지 당 정해진 갯수씩 묶어, 여러 장의 페이지에 걸쳐 보여줄 수 있도록 하는 기능입니다.

![Paginated Index Page in Korean](https://drive.google.com/thumbnail?id=1iKCOo6ieSx0_GEjW7hnlg8CuOSB0YbFJ&sz=w1000){: width="400" .align-center .shadow}

![Paginated Index Page in English](https://drive.google.com/thumbnail?id=1jm6tKqgLUqkzc-2Yufzh9rESsyKKbQPe&sz=w1000){: width="400" .align-center .shadow}

`Minimal Mistakes` 테마의 경우 사이트의 기본 페이지는 **Recent Posts**라는 이름으로 가장 최근의 포스트 제목들을 정해진 갯수만큼씩 한 페이지에 보여 주도록 되어 있습니다.  총 40개의 포스트가 있고 페이지마다 5개씩 보여주기로 한다면 8개의 페이지가 생기게 되며, 각 페이지 사이를 이동할 수 있는 링크가 하단에 제공됩니다.

이러한 기능은 테마에 특화된 UI를 제외하면 `Minimal Mistakes` 테마가 자체적으로 구현하는 것이 아니며, `Jekyll`에서 제공하는 페이지네이션 플러그인인 `jekyll-paginate`를 이용한 것입니다.  바닐라 상태의 테마에서는 문제가 없지만, 다국어 지원을 다국어 플러그인 없이 구현하고자 하는 경우, 이 부분이 문제가 됩니다.  왜냐하면 `jekyll-paginate` 플러그인은 프로젝트 내에 존재하는 모든 포스트들을 대상으로 작동하며, '한글 포스트만 페이지네이션하기', '영어 포스트만 페이지네이션하기' 와 같이 조건이 붙은 작업은 수행할 수 없기 때문입니다.

따라서 다국어 지원 플러그인을 사용하지 않으면서 페이지네이션 기능도 한글/영어 포스트에 대해 따로 적용하고 싶다면, 페이지네이션 기능 또한 별도로 구현해야 합니다.  다행히 이 부분 역시 `Liquid` 문법 수준에서 어느 정도 구현할 수 있는 내용입니다.

### `jekyll-paginate` 이해하기

우선 `jekyll-paginate` 플러그인이 [제공하는 기능](https://jekyllrb.com/docs/pagination)을 살펴보면, `paginator`라는 `Liquid` 객체를 제공하며, 이 객체를 통해 아래의 정보들을 제공합니다.

1. 현재 페이지의 번호
2. 페이지당 표시할 포스트 개수
3. 현재 페이지에 표시되는 포스트 객체들
4. 포스트의 총 개수
5. 페이지의 총 개수
6. 이전 페이지 번호
7. 이전 페이지 URL
8. 다음 페이지 번호
9. 다음 페이지 URL

따라서 이 항목들을 `jekyll-paginate` 없이 순수 `Liquid` 문법으로 언어를 구분하여 구현할 수 있다면 플러그인 없이 **Recent Posts** 부분에 대한 페이지네이션을 다국어로 지원할 수 있게 됩니다.

### `_index` 폴더 만들기

`Minimal Mistakes` 테마는 `jekyll-paginate` 플러그인을 활용하여 기본 홈 페이지 및 `page#` 꼴의 퍼마링크를 가진 개별 페이지들을 렌더링합니다.  저의 블로그 주소인 `lazyjobseeker.github.io`를 예로 들면 아래와 같습니다.

- 홈 (1번째 페이지): `lazyjobseeker.github.io/`
- 2번째 페이지: `lazyjobseeker.github.io/page2/`
- `num` 번째 페이지: `lazyjobseeker.github.io/page:num/`

그리고 1페이지를 생성하기 위해 `index.html`이 필요한 것을 제외하면, 나머지 페이지들은 별도로 `html`이나 `md` 파일을 만들어 두지 않더라도 자동으로 만들어집니다.

하지만 `jekyll-paginate` 자체에서 다국어를 지원하지 않기 때문에, 다국어 블로그에서 언어별 페이지네이션을 구현하기 위해서는 `/page2/`, `/page3/`... 꼴 (`page:num`)의 퍼마링크를 갖는 개별 페이지들을 마크다운 파일로 모조리 따로 준비해야 합니다.  또한, 영어 페이지의 경우 `en/page2/`, `en/page3/`과 같은 퍼마링크를 갖는 페이지들이 빌드될 수 있도록 `.md` 혹은 `.html` 파일들이 별도로 존재해야 합니다.

이를 위해 `/page:num/` 꼴의 퍼마링크를 갖도록 빌드될 마크다운 파일들을 모아 두는 `_index` 폴더를 만들었습니다.  루트에 존재하는 `_index`는 기존의 우리말 블로그를 위한 것이고, `en` 하위에 만든 것은 영어 버전을 지원하기 위한 것입니다.  루트의 `index.html`은 `Jekyll`이 기본적으로 루트 디렉토리에서`index.html`을 찾아 홈 페이지로 만들기 때문에 `_index` 안으로 이동하지 않았습니다.

```
lazyjobseeker.github.io
├─ index.html → https://lazyjobseekerg.github.io/ (KR Home Page)
├─ _index
│   ├─ page2.md → https://lazyjobseekerg.github.io/page2/
│   └─ page3.md → https://lazyjobseekerg.github.io/page3/
├─ _posts
└─ en
    ├─ _index
    │    ├─ index.md → https://lazyjobseekerg.github.io/en/ (EN Home Page)
    │    ├─ page2.md → https://lazyjobseekerg.github.io/en/page2/
    │    └─ page3.md → https://lazyjobseekerg.github.io/en/page3/
    └─ _posts
```

그리고 `_config.yml`에서 `_index` 경로들에 대한 기초 변수 세팅을 추가하는데, 기본적으로 `translated` 변수가 `true`로 세팅되도록 하고, 홈 페이지임을 나타내는 `is_index` 변수를 추가로 설정했습니다.

```yaml
# Index pages with custom pagination (Korean)
  - scope:
      path: "_index"
      type: pages
    values:
      is_index: true
      translated: true
      layout: home
      lang: ko
      page_no: 1

  # Index pages with custom pagination (English)
  - scope:
      path: "en/_index"
      type: pages
    values:
      is_index: true
      translated: true
      layout: home
      lang: en
      page_no: 1
```
{: file='_config.yml'}

`page:num.md` 파일은 아래와 같은 YAML Front Matter만을 갖는 빈 파일입니다.  아래 예시는 `/page3`을 렌더링하기 위한 것입니다.

```yaml
lang: ko
page_no: 3
permalink: /page3/
```
{: file='_index/page3'}

`en/page:num.md`파일은 아래와 같은 YAML Front Matter만을 갖는 빈 파일입니다.  아래 예시는 `en/page3`을 렌더링하기 위한 것입니다.

```yaml
lang: en
page_no: 3
permalink: /page3/
```
{: file='_index/page3'}

### 홈 페이지네이터 구현하기

다음으로, 한 페이지에 표시할 한글(영어)포스트 개수가 $n$개이고 전체 한글(영어) 포스트 개수가 $N$개일 때, 아래 작업을 수행하는 `Liquid` 코드를 작성했습니다.

- 필요한 전체 페이지의 수를 계산하여 `total_pages` 변수를 반환.
- `page_no`번째 페이지에 표시될 $n$개 포스트만을 모은 `Liquid` 배열 `posts`를 반환. 

```liquid
{% raw %}{% assign paginate = site.paginate_custom %}
{% assign total_pages = 1 %}
{% assign display_counter = 0 %}
{% assign total_page_counter = 0 %}
{% assign first_post_idx = page.page_no | minus: 1 | times: paginate %}
{% assign last_post_idx = first_post_idx | plus: paginate | minus: 1 %}
{% assign posts = "" | split: ',' %}
{% for post in site.posts %}
  {% if post.lang and post.lang == page.lang %}
    {% assign total_page_counter = total_page_counter | plus: 1 %}
    {% if total_page_counter == paginate %}
      {% assign total_pages = total_pages | plus: 1 %}
      {% assign total_page_counter = 0 %}
    {% endif %}
    {% if display_counter >= first_post_idx and display_counter <= last_post_idx %}
      {% assign posts = posts | push: post %}
    {% endif %}
    {% assign display_counter = display_counter | plus: 1 %}
  {% endif %}
{% endfor %}{% endraw %}
```
{: file='_includes/custom-paginator/home-paginator.html'}

1행의 `site.paginate_custom` 변수는 `_config.yml`에 별도로 정의하였으며, 한 페이지당 표시할 포스트 수를 나타내는 자연수입니다.

홈 페이지들은 `home` 레이아웃으로 렌더링됩니다.  완성된 위의 `Liquid` 코드를 우선 `_layouts/home.html`에 포함해 줍니다.

```html
---
layout: archive
classes: wide
---

{% raw %}{{ content }}

<h3 class="archive__subtitle">{{ site.data.ui-text[site.locale].recent_posts | default: "Recent Posts" }}</h3>

{% include custom-paginator/home-paginator.html %}

{% assign entries_layout = page.entries_layout | default: 'list' %}
<div class="entries-{{ entries_layout }}">
  {% for post in posts %}
    {% include archive-single.html type=entries_layout %}
  {% endfor %}
</div>

{% include paginator.html total_pages=total_pages %}{% endraw %}
```
{: file='_layouts/home.html'}

`paginator.html`을 호출하는 부분에는 `home-paginator`에 의해 계산되는 `total_pages` 변수를 추가 인자로 던져 주었습니다.

`paginator.html`은 실제로 페이지 하단의 페이지간 이동 버튼들을 구현하는 영역입니다.  `page_no` 변수에 의해 현재 페이지의 번호를 알고 있으므로 전/후 페이지 번호를 자동적으로 계산할 수 있으며, `total_pages` 변수 덕분에 마지막 페이지 번호도 알 수 있습니다.

수정된 `paginator.html` 파일은 다음과 같습니다.

```html
{% raw %}{% if page.lang == 'ko' %}
  {% assign first_page_path = site.url %}
{% else %}
  {% assign first_page_path = site.url | append: '/' | append: page.lang %}
{% endif %}
{% assign next_page_no = page.page_no | plus: 1 %}
{% assign prev_page_no = page.page_no | minus: 1 %}
{% if include.total_pages > 1 %}
<nav class="pagination">
  <ul>
    {% comment %} Link for previous page {% endcomment %}
    {% if page.page_no > 1 %} 
      {% if page.page_no == 2 %}
        <li><a href="{{ first_page_path }}">{{ site.data.ui-text[site.locale].pagination_previous | default: "Previous" }}</a></li>
      {% else %}
        <li><a href="{{ first_page_path | append: '/page' | append: prev_page_no }}">{{ site.data.ui-text[site.locale].pagination_previous | default: "Previous" }}</a></li>
      {% endif %}
    {% else %}
    <li><a href="#" class="disabled"><span aria-hidden="true">{{ site.data.ui-text[site.locale].pagination_previous | default: "Previous" }}</span></a></li>
    {% endif %}
    {% comment %} First page {% endcomment %}
    {% if page.page_no == 1 %}
      <li><a href="#" class="disabled current">1</a></li>
    {% else %}
      <li><a href="{{ first_page_path }}">1</a></li>
    {% endif %}
    {% assign page_start = 2 %}
    {% if page.page_no > 4 %}
      {% assign page_start = page.page_no | minus: 2 %}
      {% comment %} Ellipsis for truncated links {% endcomment %}
      <li><a href="#" class="disabled">&hellip;</a></li>
    {% endif %}
    {% assign page_end = include.total_pages | minus: 1 %}
    {% assign pages_to_end = include.total_pages | minus: page.page_no %}
    {% if pages_to_end > 4 %}
      {% assign page_end = page.page_no | plus: 2 %}
    {% endif %}
    {% for index in (page_start..page_end) %}
      {% if index == page.page_no %}
        <li><a href="{{ first_page_path | append: '/page' | append: index }}" class="disabled current">{{ index }}</a></li>
      {% else %}
        {% comment %} Distance from current page and this link {% endcomment %}
        {% assign dist = page.page_no | minus: index %}
        {% if dist < 0 %}
          {% comment %} Distance must be a positive value {% endcomment %}
          {% assign dist = 0 | minus: dist %}
        {% endif %}
        <li><a href="{{ first_page_path | append: '/page' | append: index }}">{{ index }}</a></li>
      {% endif %}
    {% endfor %}
    {% comment %} Ellipsis for truncated links {% endcomment %}
    {% if pages_to_end > 3 %}
      <li><a href="#" class="disabled">&hellip;</a></li>
    {% endif %}
    {% if page.page_no == include.total_pages %}
      <li><a href="#" class="disabled current">{{ page.page_no }}</a></li>
    {% else %}
      <li><a href="{{ first_page_path | append: '/page' | append: include.total_pages }}">{{ include.total_pages }}</a></li>
    {% endif %}
    {% comment %} Link next page {% endcomment %}
    {% if page.page_no < include.total_pages %}
      <li><a href="{{ first_page_path | append: '/page' | append: next_page_no }}">{{ site.data.ui-text[site.locale].pagination_next | default: "Next" }}</a></li>
    {% else %}
      <li><a href="#" class="disabled"><span aria-hidden="true">{{ site.data.ui-text[site.locale].pagination_next | default: "Next" }}</span></a></li>
    {% endif %}
  </ul>
</nav>
{% endif %}{% endraw %}
```
{: file='_includes/paginator.html'}

## SEO 최적화하기

다국어 페이지를 위한 SEO 최적화는 `hreflang` 설정 방식을 사용했습니다.  `hreflang` 태그는 아래와 같은 구조로 구성됩니다.

```html
<link rel="alternate" hreflang="kr" href="https://lazyjobseeker.github.io">
<link rel="alternate" hreflang="en" href="https://lazyjobseeker.github.io/en">
```
{: .nolineno}

웹 페이지의 `<head>` 부분에 위 태그들을 넣으면, 한글 및 영어 페이지에 대한 대체 링크들을 검색 엔진에 제공할 수 있게 됩니다.

### `hreflang` 설정하기

`Minimal Mistakes` 테마를 기준으로, 커스텀 헤더 파일에 아래 내용을 추가하였습니다.

```html
<!-- Add hreflang for multiple language SEO support -->

{% raw %}{% if page.lang == 'ko' %}
  {% assign prefix = '/' %}
  {% if page.is_index %}
    {% assign target-url-ko = site.url %}
    {% assign target-url-en = site.url | append: '/en/' %}
  {% elsif page.translated %}
    {% assign target-url-ko = page.url | absolute_url %}
    {% assign target-url-en = page.url | prepend: '/en' | absolute_url %}
  {% else %}
    {% assign target-url-ko = page.url | absolute_url %}
    {% assign target-url-en = nil %}
  {% endif %}
{% elsif page.lang == 'en' %}
  {% assign prefix = page.lang | prepend: '/' %}
  {% if page.is_index %}
    {% assign target-url-ko = site.url %}
    {% assign target-url-en = site.url | append: '/en/' %}
  {% elsif page.translated %}
    {% assign target-url-ko = page.url | replace: '/en/', '/' | absolute_url %}
    {% assign target-url-en = page.url | absolute_url %}
  {% else %}
    {% assign target-url-ko = nil %}
    {% assign target-url-en = page.url | absolute_url %}
  {% endif %}
{% endif %}

{% if target-url-ko %}
  <link rel="alternate" hreflang="ko" href="{{target-url-ko}}">
{% endif %}
{% if target-url-en %}
  <link rel="alternate" hreflang="en" href="{{target-url-en}}">
{% endif %}{% endraw %}
```
{: file='_includes/head/custom.html'}

그냥 헤더에서 참조가능경로 때리고 시작하는게 낫지

<!--
### 사이트맵 구조 수정하기
-->