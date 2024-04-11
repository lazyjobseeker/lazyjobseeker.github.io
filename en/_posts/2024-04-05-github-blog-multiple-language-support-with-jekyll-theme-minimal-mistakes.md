---
translated: true
published: false
title: How to Build Multilingual Jekyll Github Blog
category: Programming
tags:
  - Jekyll
  - "Github Pages"
  - "Minimal Mistakes"
  - "Multi-Languages"
created_at: 2024-04-05 08:44:57 +09:00
last_modified_at: 2024-04-11 08:33:11 +09:00
header:
  teaser: /assets/images/uncategorized-teaser-6.png
excerpt: How I implemented multi-language support for my Jekyll-based Github Pages blog without plugins.
---

## Intro

Since I started my `Jekyll` blog hosted via `Github Pages`, it has been a long-lasting quest to serve this blog in multiple languages, at least in two different ones (Korean as my native language and English).  This blog is based on powerful and long-loved `Jekyll` theme `Minimal Mistakes`, but unfortunately multiple language support was not among its native features.

In my endeavor to implement multilingual support, I found that most of available examples was successful with `Jekyll` plugin `polyglot`, which I also considered for my blog at my first search.

However, I abandoned the plan knowing that execution of `polyglot` is not supported by `Github Pages` and further settings are needed.  With trials and errors I managed to customize Korean-English bilingual support for my blog, ***without any plugins*** but only with `Jekyll`'s basic features and some `Liquid` codes.

Below I provided the list of requirements I wanted my blog to fully fulfill after my implementation.

- **A premise**: If a document written in Korean has permalink `a` and it has an English-translated version, permalink of English doc must be in `en/a` format.
- There should be a **toggle button** which directs user to translated page.

![Toggle Button in Korean Page](https://drive.google.com/thumbnail?id=1XAFm9BNOh2lhPKw37O5vdgVUysf0ES2N&sz=w1000){: width="400" .align-center .shadow}

![Toggle Button in English Page](https://drive.google.com/thumbnail?id=1-IZLOfVRfiX7uiCn5lPfi9mCWe32izFt&sz=w1000){: width="400" .align-center .shadow}

- `home` layout of vanilla `Minimal Mistakes` theme, which has **Recent Posts** area, should reasonably work with language toggle feature.

![Paginated Index Page in Korean](https://drive.google.com/thumbnail?id=1iKCOo6ieSx0_GEjW7hnlg8CuOSB0YbFJ&sz=w1000){: width="400" .align-center .shadow}

![Paginated Index Page in English](https://drive.google.com/thumbnail?id=1jm6tKqgLUqkzc-2Yufzh9rESsyKKbQPe&sz=w1000){: width="400" .align-center .shadow}

- Every hyperlinks in masthead and sidebar must work reasonably and texts also should be able to change adaptively.
- **Previous·Next posts** buttons for in-post navigation should work reasonably.

![Previous and Next Page](https://drive.google.com/thumbnail?id=1H26X7XH4EAXJB7_HuNA2T1uIyEKnHzO-&sz=w1000){: width="400" .align-center .shadow}

- **YOU MAY ALSO ENJOY** area where related posts are listed must work reasonably.

![YOU MAY ALSO ENJOY in Korean Page](https://drive.google.com/thumbnail?id=1cU6oihM7R1oAz91QOWI7wDA4FXaevpdo&sz=w1000){: width="600" .align-center .shadow}

![YOU MAY ALSO ENJOY in English Page](https://drive.google.com/thumbnail?id=19ZbY55-gDmx29M54it5_hC1bsxVow-Hd&sz=w1000){: width="600" .align-center .shadow}

## Make English-Contents Folder

I started with modifying project structure.  At first, I created new directory `en` in the project root, where I will store all translated documents.

For example, `_posts` directory in root held posts I already wrote in Korean.  As my purpose was to serve English-translated versions of all these posts, I created `_posts` subdirectory under `en`.

```
lazyjobseeker.github.io
├─ _posts
└─ en
    └─ _posts
```

**Several `_posts` Folders<br>`_posts` is not meant to be unique in your proejct.  `Jekyll` tries to render all the markdowns residing in all folders named `_posts` throughout your project.  If there is another `_posts` named folder like `a/_posts`, posts built from this folder is regarded to have `a` as one of the categories it belongs.
{: .notice--info}

## Global Variable Settings in `_config.yml`

Then I added some more lines from `_config.yml`.  I added new variable `lang` and set different values for posts living in different paths.  I designed it for Korean posts/docs to have `ko` and English versions to have `en` as default value.

Permalink structure also was one of concern.  In default, permalink setting for `Minimal Mistakes` theme is `/:categories/:title`.  But as I mentioned above, when `Jekyll` treats my posts living in `en/posts`, it gives `en` as additional category for all the posts there.  So the folder tree I adjusted directly affects original permalink structure.

I thought it would harm my efforts to provide consistent permalinks, so I forced some my preferred permalink formats for the posts according to their parent folder path.

```yaml
# Some values were omitted for clarity.
defaults:
  # Default setting for Korean posts
  - scope:
      path: "_posts"
      type: posts
    values:
      lang: ko
      permalink: /posts/:title/
  # Default setting for Enlgish posts
  - scope:
      path: "en/_posts"
      type: posts
    values:
      lang: en
      permalink: /en/posts/:title/
```
{: file='_config.yml'}

**Permalink Change and Redirection**<br>If you change permalinks for your web pages already indexed by search engines like Google's, existing indexing results are not available anymore because when user attempts to access your pages by original URL it would throw 404 error.  This might harm SEO of your blog.  You can avoid this issue by using `jekyll-redirect-from` plugin.
{: .notice--info}

Furthermore, I made distinction between `ko`- and `en`-specific values for `display-title` item and `display-subtitle` item, which are meant to be displayed in leftmost side of masthead part.

```yaml
display-title:
  ko: "나불나불 끄적끄적"
  en: "Lazyjobseeker's Blog"
display-subtitle:
  ko: "읽고 쓰고 그리고 기억하기"
  en: "I read, write, draw and remember"
```
{: file='_config.yml'}

Same thing also was done for `author.bio` item, which goes downside of my author name in sidebar part, as my personal comment line.

```yaml
# Site Author
author:
  name : "Sangheon Lee"
  avatar : "/assets/images/logo.png"
  bio :
    ko: "재빠른 나무늘보 - 일하는 것처럼 보인다면 착각입니다."
    en: "Quick sloth - If you see me working, you are mistaken."
```
{: file='_config.yml'}

Finally, the meaning not as obvious as above ones, I added a custom variable `posts_per_page`.  This value replaces original one `paginate`, which is used in conjunction with `jekyll-paginate`.  `jekyll-paginate` is a plugin for pagination, which I will explain further in following sections.

```yaml
# Custom paginator
posts_per_page: 8
```

## `translated` Variable Added

I decided to define boolean variable `translated` in YAML Front Matters of all the posts or documents, to tell if a given document has its translated counterpart.  For example, if a markdown file living in `_post`( `en/_post`) has below line in their front matter, it means there exists its English(Korean) counterpart in `en/_post`(`_post`) folder.

```yaml
translated: true
```

If `translated` variable does not exists or it is `false` for some post/doc, it means there is no translated version of it.

Let me exemplify to add more clarity.

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

In above example tree, there are two files named `2024-04-05-example.md`.  Both has `translated: true` line in front matter - you can do away with this if you are planning to post only when you have original and translated versions both, or maybe you can move `translated: true` to default setting for posts -.  Default setting in `_config.yml` makes `_posts/2024-04-05-example.md` to have `ko` as its value for `lang` attribute.  For `en/_posts/2024-04-05-example.md`, value of `lang` is `en`.

**About Flle Name**<br>Original post in `_posts` and English-translated version `en/_posts` must be named as same.
{: .notice--warning}

## Defining Custom `Liquid` Objects

This is the most important part.  I set some additional `Liquid` arrays and variables, to provide required data I need in implementing multilingual support.

### Language-Dependent Variables

앞서 `_config.yml`의 글로벌 설정을 통해 모든 포스트가 `lang` 속성을 가지게 되었으며, 이 값은 `page.lang` 변수에 접근하여 확인할 수 있습니다.

아래와 같은 `Liquid` 변수들을 작성하고, `page.lang` 변수가 `ko`인지 `en`인지에 따라 서로 다른 값을 제공하도록 하였습니다.

- `lang_posts`: `lang` 값이 현재 페이지와 동일한 포스트만을 모은 `Liquid` 배열입니다.
- `display_title`:  마스트헤드 좌측에 표시되는, **블로그 제목**을 나타내는 텍스트입니다.
- `display_subtitle`: 마스트헤드 좌측에 표시되는, **블로그 부제목**을 나타내는 텍스트입니다.
- `author_bio`: 사이드바의 블로그 소유자 이름 아래에 표시되는 설명입니다.
- `prefix`: 언어에 따라 홈 페이지 URL 뒤에 붙여 줄 문자열입니다.  한글 페이지를 디폴트로 할 예정이므로 `ko`라면 아무 값도 주지 않고, 영어 문서라면 `/en`이 되도록 할 것입니다. 
- `target_url_ko`: 현재 문서가 영어 문서일 때, 한글 번역 문서의 URL입니다.
- `target_url_en`: 현재 문서가 한글 문서일 때, 영어 번역 문서의 URL입니다.
- `post_prev`: 현재 포스트와 언어가 동일한 포스트 중 **이전 포스트**를 나타냅니다.
- `post_next`: 현재 포스트와 언어가 동일한 포스트 중 **다음 포스트**를 나타냅니다.

### 페이지네이션 관련 변수들

`Minimal Mistakes` 테마의 홈 페이지(메인 URL로 접근하면 보이는 페이지)는 **Recent Posts**라는 이름으로 블로그의 모든 포스트의 제목과 요약문을 가장 최근 포스트부터 차례대로 보여 주도록 되어 있습니다.

이 때, 모든 포스트를 한 페이지에 보여주는 것이 아니고, `_config.yml`의 `paginate` 변수 값에 해당하는 갯수만큼씩 나누어 보여 줍니다.  블로그의 총 포스트 개수가 `paginate` 값보다 크면, `/page2/`, `/page3/`... 과 같은 퍼마링크를 갖는 여러 페이지로 자동으로 분할하여 빌드해 줍니다.  또한, 각 페이지 사이를 이동할 수 있는 내비게이터를 최하단에 제공합니다.

![Paginated Index Page in Korean](https://drive.google.com/thumbnail?id=1iKCOo6ieSx0_GEjW7hnlg8CuOSB0YbFJ&sz=w1000){: width="400" .align-center .shadow}

![Paginated Index Page in English](https://drive.google.com/thumbnail?id=1jm6tKqgLUqkzc-2Yufzh9rESsyKKbQPe&sz=w1000){: width="400" .align-center .shadow}

이처럼 블로그의 모든 포스트들을 여러 페이지에 걸쳐 나누어 보여줄 수 있도록 하기 위해 필요한 기능을 **페이지네이션(pagination)**이라고 합니다.

`Minimal Mistakes` 테마의 페이지네이션 관련 기능의 경우, 최하단 내비게이터와 같은 UI 요소는 테마 자체에서 구현하고 있습니다.  하지만 포스트를 정해진 숫자만큼씩 나누어 주고 서로 다른 페이지에 나누어 빌드해 주는 기능은 `Jekyll`의 페이지네이션 플러그인인 `jekyll-paginate`에 의존합니다.

바닐라 테마에서는 `jekyll-paginate`만 이용하여도 문제가 없지만, 다국어 지원을 플러그인 없이 구현하는 경우 문제가 생깁니다.  왜냐하면 `jekyll-paginate` 플러그인은 프로젝트에 존재하는 모든 포스트들을 대상으로 작동하며, 위에서 설정한 `page.lang`과 같은 커스텀 변수를 참조하여 '한글 포스트들만 모아서 페이지네이션해 줘'와 같이 동작하도록 할 수 없기 때문입니다.

결국 플러그인 없이 `Minimal Mistakes` 테마에 다국어를 지원하면서 **Recent Posts** 영역도  동일하게 동작하도록 하려면 `jekyll-paginate`에 의존하여 구현된 기능들을 포기하고 필요한 내용들을 새로 구현해야 했습니다.  아래의 `Liquid` 변수들은 이 작업을 위해 필요한 것들입니다. 

- `first_page_path`: 페이지네이션된 홈 페이지들 중 가장 첫 번째 페이지의 URL입니다.
-  `current_page_posts`:  현재 문서가 페이지네이션된 홈 페이지들 중 하나인 경우, 현재 문서에 표시되어야 하는 포스트들을 모은 `Liquid` 배열입니다.
- `total_pages`: 홈 페이지가 총 몇 개의 개별 페이지로 구성되어야 하는지 나타내는 변수입니다.  예를 들어, 블로그에 총 10개의 영어 포스트가 있고 한 페이지에 4개씩 보여주기로 한다면 `total_pages` 변수의 값은 3이 되어야 하며 퍼마링크가 `/page3/`인 페이지까지 총 3개의 `html` 파일이 페이지네이션된 홈 페이지들의 일부로 빌드되어야 합니다.

## 커스텀 `Liquid` 변수 구현

앞 장에서 나열한 커스텀 변수들을 몇 개 파일에 나누어 구현하였습니다.  아래의 모든 파일들은 `_includes/multilang` 폴더를 새로 만든 다음 해당 폴더 내에 만들어 주었습니다.

### 현재 문서와 같은 언어인 포스트들 찾기

`lang_posts` 변수를 만들어 주는 코드 토막입니다.  `get-lang-posts`라는 이름의 확장자 없는 텍스트로 작성되었습니다.

```liquid
{% raw %}{% for post in lang_posts %}
  {% assign total_page_counter = total_page_counter | plus: 1 %}
  {% if total_page_counter == ppp %}
    {% assign total_pages = total_pages | plus: 1 %}
    {% assign total_page_counter = 0 %}    
  {% endif %}
{% endfor %}

{% assign current_page_posts = "" | split: ',' %}
{% for idx in (first_post_idx..last_post_idx) %}
  {% assign current_page_posts = current_page_posts | push: lang_posts[idx] %}
{% endfor %}{% endraw %}
```
{: file='get-lang-posts'}

### 현재 문서의 언어에 맞는 URL 및 변수들 만들기

문서 내에 생성할 하이퍼링크들의 URL, 마스트헤드 및 저자 정보 영역에 표시할 텍스트들을 현재 페이지의 `lang` 변수에 맞추어 할당해 주는 코드 토막입니다.  `get-lang-variables`라는 이름의 확장자 없는 텍스트로 작성되었습니다.

```liquid
<!-- multilang/get-lang-vairables -->
{% raw %}{% if page.lang == 'ko' %}
  {% assign display_title = site.display-title.ko %}
  {% assign display_subtitle = site.display-subtitle.ko %}
  {% assign author_bio = author.bio.ko %}
  {% assign first_page_path = site.url %}
  {% assign prefix = '' %}
  {% if page.translated %}
    {% assign target_url_ko = page.url | absolute_url %}
    {% assign target_url_en = page.url | prepend: '/en' | absolute_url %}
  {% else %}
    {% assign target_url_ko = page.url %}
    {% assign target_url_en = nil %}
  {% endif %}
{% elsif page.lang == 'en' %}
  {% assign display_title = site.display-title.en %}
  {% assign display_subtitle = site.display-subtitle.en %}
  {% assign author_bio = author.bio.en %}
  {% assign first_page_path = site.url | append: '/' | append: page.lang %}
  {% assign prefix = page.lang | prepend: '/' %}
  {% if page.translated %}
    {% assign target_url_ko = page.url | replace: '/en/', '/' | absolute_url %}
    {% assign target_url_en = page.url | absolute_url %}
  {% else %}
    {% assign target_url_ko = nil %}
    {% assign target_url_en = page.url %}
  {% endif %}
{% endif %}{% endraw %}
```
{: file='get-lang-variables'}

이 코드를 적당한 위치에 `include`해 주면 해당 위치에서 `display_title`, `display_subtitle`, `author_bio`, `first_page_path`, `prefix`, `target_url_ko`, `target_url_en`의 7개 변수를 사용할 수 있게 되고 그 내용은 `page.lang` 변수의 값에 따라 달라지게 됩니다.

### 페이지네이션 관련 변수

#### 사전 작업

다국어 페이지네이션 구현에는 사전 작업이 추가로 필요합니다.

페이지네이션을 구현하는 표준 플러그인 `jekyll-paginate`는 첫 번째 홈 페이지를 제외하면 `/page2/`, `/page3/`... 과 같은 꼴의 퍼마링크를 갖는 `html` 파일을 **자동으로 생성합니다**.  하지만 저는 `jekyll-paginate`를 이용하지 않기 때문에, 각 퍼마링크에 해당하는 `html` 파일로 빌드될 마크다운 파일을 페이지 수 만큼 미리 만들어 두어야 했습니다.

그리고, `/page2/`가 존재한다면 이 페이지의 영어 버전인 `en/page2/`를 빌드하기 위한 마크다운 파일도 존재해야 합니다.  따라서 이러한 마크다운 파일들을 미리 작성해 두고 `_index`및 `en/_index` 폴더에 넣어 두었습니다.

`Jekyll`은 홈페이지의 가장 첫 페이지를 만들 때 반드시 루트 경로의 `index.html`을 타겟하는 것으로 고정되어 있고 이 파일은 이름을 바꾸거나 위치를 옮길 수 없어, 최종적으로 프로젝트 구조는 아래와 같이 정리됩니다.

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

그리고 `index.html` 및 `page#.md` 파일들의 YAML Front Matter에 `page_no` 변수를 설정하여 수동으로 해당 파일이 페이지네이션 결과 몇 번째 페이지가 될 것인지 명시했습니다.  페이지 퍼마링크도 이 단계에서 수동으로 직접 설정했습니다.  예를 들어, `/page2/` 및 `/en/page2/`로 렌더링될 마크다운 파일들은 각각 아래와 같이 작성됩니다.

```yaml
---
page_no: 2
permalink: /page2/
---
```
{: file='_index/page2.md'}

```yaml
---
page_no: 2
permalink: /en/page2/
---
```
{: file='en/_index/page2.md'}

물론 이 페이지들도 `lang` 변수를 가져야 합니다.  `_config.yml`의 `default` 부분에 아래 내용을 추가했습니다.

```yaml
# 일부 값은 생략하였습니다.
default:
# Index pages with custom pagination (Korean - 1st page)
  - scope:
      path: "index.html"
      type: pages
    values:
      translated: true
      layout: home
      lang: ko
      page_no: 1
  # Index pages with custom pagination (Korean)
  - scope:
      path: "_index"
      type: pages
    values:
      translated: true
      layout: home
      lang: ko
      page_no: 1
  # Index pages with custom pagination (English)
  - scope:
      path: "en/_index"
      type: pages
    values:
      translated: true
      layout: home
      lang: en
      page_no: 1
```
{: file='_config.yml')

#### 구현

이제 페이지네이션 관련 변수를 작성해 주는 코드를 만드는데, 두 파일로 나누었습니다.  우선 `current_page_posts` 배열을 사용할 수 있게 해 주는 `home-paginator` 코드입니다.

```liquid
<!-- multilang/home-paginator -->
{% raw %}{% include multilang/get-lang-posts %}
{% assign ppp = site.posts_per_page %}
{% assign total_page_counter = 0 %}
{% assign first_post_idx = page.page_no | minus: 1 | times: ppp %}
{% assign last_post_idx = first_post_idx | plus: ppp | minus: 1 %}
{% assign total_pages = 1 %}
{% for post in lang_posts %}
  {% assign total_page_counter = total_page_counter | plus: 1 %}
  {% if total_page_counter == ppp %}
    {% assign total_pages = total_pages | plus: 1 %}
    {% assign total_page_counter = 0 %}    
  {% endif %}
{% endfor %}

{% assign current_page_posts = "" | split: ',' %}
{% for idx in (first_post_idx..last_post_idx) %}
  {% assign current_page_posts = current_page_posts | push: lang_posts[idx] %}
{% endfor %}{% endraw %}
```
{: file='home-paginator'}

다음으로, 어떤 포스트를 기준으로 같은 언어로 작성된 다른 포스트 중 **이전 포스트**와 **다음 포스트**를 특정해 주는 코드를 `prev-next-locater`로 작성하였습니다.

```liquid
<!-- multilang/prev-next-locater -->
{% raw %}{% include multilang/get-lang-posts %}

{% assign last_idx = lang_posts.size | minus: 1 %}
{% for idx in (0..lang_posts.size) %}
  {% assign prev_idx = idx | plus: 1 %}
  {% assign next_idx = idx | minus: 1 %}
  {% if page.id == lang_posts[idx].id %}
    {% if idx == 0 %}
      {% assign post_prev = lang_posts[prev_idx] %}
      {% assign post_next = lang_posts[idx] %}
    {% elsif idx == last_idx %}
      {% assign post_prev = lang_posts[idx] %}
      {% assign post_next = lang_posts[next_idx] %}
    {% else %}
      {% assign post_prev = lang_posts[prev_idx] %}
      {% assign post_next = lang_posts[next_idx] %}
    {% endif %}
    {% break %}
  {% endif %}
{% endfor %}{% endraw %}
```
{: file='prev-next-locater'}

## `_include` 구성 요소들 수정하기

`_include` 폴더에는 자주 렌더링되는 요소들인 상단바(마스트헤드), 사이드바, 헤더, 푸터 등의 요소들이 사전 정의되어 있습니다.  이 중 `masthead.html`, `author-profile.html`, `nav_-_list`, `paginator.html`, `post-pagination.html` 파일을 수정해야 합니다.  수정 과정에서 앞서 만들어 둔 `_include/multilang` 폴더의 토막 코드들을 필요한 위치에 `include`해 주면 됩니다.

### 마스트헤드

블로그 상단의 마스트헤드 영역을 나타내는 `_includes/masthead.html` 파일을 수정하였습니다.  먼저 마스트헤드 영역 우측에 한글 포스트이면 `EN` 링크를, 영어 포스트이면 `KO`라고 써 준 다음 번역된 포스트로의 링크를 제공하도록 하였습니다.  필요한 링크들은 모두 `get-lang-variables`를 통해 얻을 수 있도록 구현해 두었으므로 적당한 위치에서 해당 파일을 `include`해 주기만 하면 됩니다.

```html
{% raw %}{% include multilang/get-lang-variables %}
{% capture logo_path %}{{ site.logo }}{% endcapture %}
<div class="masthead">
  <div class="masthead__inner-wrap">
    <div class="masthead__menu">
      <nav id="site-nav" class="greedy-nav">
        {% unless logo_path == empty %}
          <a class="site-logo" href="{{ prefix | absolute_url }}"><img src="{{ logo_path | relative_url }}" alt="{{ site.masthead_title | default: display_title }}"></a>
        {% endunless %}
        <a class="site-title" href="{{ prefix | absolute_url }}">
          {{ site.masthead_title | default: display_title }}
          {% if site.display-subtitle %}<span class="site-subtitle">{{ display_subtitle }}</span>{% endif %}
        </a>
        <ul class="visible-links">
          {% if page.lang == 'en' %}
            <li class="masthead__menu-item">
              <a href="{{ target_url_ko }}" title="Page in Korean">KO</a>
            </li>
          {% endif %}
          {% if page.lang == 'ko' %}
            <li class="masthead__menu-item">
              <a href="{{ target_url_en }}" title="Page in English">EN</a>
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

### 사이드바

사이드바 영역에서는 `author-profile.html` 파일과 `nav_list` 파일을 수정해야 합니다.

먼저 `author-profile.html` 파일의 경우, 원래 코드에서 `author.bio` 변수를 불러오는 부분을 수정합니다.

```html
<div class="author__content">
  <h3 class="author__name p-name" itemprop="name">
    <a class="u-url" rel="me" href="{{ author.home | default: prefix | absolute_url }}" itemprop="url">{{ author.name }}</a>
  </h3>
  {% raw %}{% include multilang/get-lang-variables %}
  {% if author_bio %}
    <div class="author__bio p-note" itemprop="description">
      {{ author_bio | markdownify }}
    </div>
  {% endif %}{% endraw %}
</div>
```
{: file='author-profile.html'}

다음으로 `nav_list` 파일에서는 `prefix` 변수를 불러온 다음 하이퍼링크들의 앞에 붙여 주도록 작업합니다.  `_data/navigation.yml`에는 사이드바에 표시할 리스트들과 각 리스트 요소들을 클릭했을 때 이동할 링크 URL이 제공되는데, 영어 문서인 경우 링크 주소에 `/en/`을 붙여 주기 위한 것입니다.

```liquid
{% assign navigation = site.data.navigation[include.nav] %}
{% include multilang/get-lang-variables %}
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
</nav>
```
{: file='nav_list'}

### 페이지네이터

`home.html`레이아웃에 `include`되어 페이지네이션 기능을 수행하는 `paginator.html`은 아래와 같이 수정하였습니다.

```html
{% raw %}{% include multilang/get-lang-variables %}
{% include multilang/home-paginator %}
{% assign next_page_no = page.page_no | plus: 1 %}
{% assign prev_page_no = page.page_no | minus: 1 %}
{% if total_pages > 1 %}
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

    {% assign page_end = total_pages | minus: 1 %}
    {% assign pages_to_end = total_pages | minus: page.page_no %}
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

    {% if page.page_no == total_pages %}
      <li><a href="#" class="disabled current">{{ page.page_no }}</a></li>
    {% else %}
      <li><a href="{{ first_page_path | append: '/page' | append: total_pages }}">{{ total_pages }}</a></li>
    {% endif %}

    {% comment %} Link next page {% endcomment %}
    {% if page.page_no < total_pages %}
      <li><a href="{{ first_page_path | append: '/page' | append: next_page_no }}">{{ site.data.ui-text[site.locale].pagination_next | default: "Next" }}</a></li>
    {% else %}
      <li><a href="#" class="disabled"><span aria-hidden="true">{{ site.data.ui-text[site.locale].pagination_next | default: "Next" }}</span></a></li>
    {% endif %}
  </ul>
</nav>
{% endif %}{% endraw %}
```
{: file='paginator.html'}

### 이전·다음 포스트

이 부분은 테마 기본 파일 중 `post_pagination.html`을 통해 구현되어 있습니다.  언어를 구분하여 전후 포스트를 특정하는 기능은 `prev-next-locater`에 구현되었으므로, 이 파일을 `post_pagination.html`에 `include`한 뒤 기존 구현에서 지킬 자체 변수 `page.next` 및 `page.previous`로 구현된 내용을 `post_next` 및 `post_prev`로 교체해 주면 됩니다.

```html
{% raw %}{% include multilang/prev-next-locater %}
{% if post_prev or post_next %}
  <nav class="pagination">
    {% if post_prev.id != page.id %}
      <a href="{{ post_prev.url | relative_url }}" class="pagination--pager" title="{{ post_prev.title | markdownify | strip_html }}">{{ site.data.ui-text[site.locale].pagination_previous | default: "Previous" }}</a>
    {% else %}
      <a href="#" class="pagination--pager disabled">{{ site.data.ui-text[site.locale].pagination_previous | default: "Previous" }}</a>
    {% endif %}
    {% if post_next.id != page.id %}
      <a href="{{ post_next.url | relative_url }}" class="pagination--pager" title="{{ post_next.title | markdownify | strip_html }}">{{ site.data.ui-text[site.locale].pagination_next | default: "Next" }}</a>
    {% else %}
      <a href="#" class="pagination--pager disabled">{{ site.data.ui-text[site.locale].pagination_next | default: "Next" }}</a>
    {% endif %}
  </nav>
{% endif %}{% endraw %}
```
{: file='post_pagination.html'}

### 카테고리 리스트에서 `en` 제거하기

`Jekyll`의 동작 방식에 따르면 `en` 폴더 하위에 존재하는 문서들은 기본적으로 `en`이라는 카테고리를 갖는 것으로 취급됩니다.  `Minimal Mistakes` 테마의 포스트 마지막 부분에는 현재 포스트가 속한 카테고리들을 나열하는 부분이 있는데, 별도로 수정을 하지 않으면 영어 포스트들은 이 부분에 `en`이라는 카테고리가 기본적으로 존재하는 것처럼 빌드됩니다.

이것을 방지하기 위해 `_includes/category-list.html` 파일을 수정하여, `en`이라는 이름의 카테고리가 존재하는 경우 해당 태그는 나타내지 않도록 하였습니다.

```html
{% raw %}{% case site.category_archive.type %}
  {% when "liquid" %}
    {% assign path_type = "#" %}
  {% when "jekyll-archives" %}
    {% assign path_type = nil %}
{% endcase %}

{% if site.category_archive.path %}
  {% assign categories_sorted = page.categories | sort_natural %}

  <p class="page__taxonomy">
    <strong><i class="fas fa-fw fa-folder-open" aria-hidden="true"></i> {{ site.data.ui-text[site.locale].categories_label | default: "Categories:" }} </strong>
    <span itemprop="keywords">
    {% for category_word in categories_sorted %}
      {% unless category_word == 'en' %}
        <a href="{{ category_word | slugify | prepend: path_type | prepend: site.category_archive.path | relative_url }}" class="page__taxonomy-item p-category" rel="tag">{{ category_word }}</a>{% unless forloop.last %}<span class="sep">, </span>{% endunless %}
      {% endunless %}
    {% endfor %}
    </span>
  </p>
{% endif %}{% endraw %}
```
{: text='category-list.html'}

## Modifying `_layout` Contents

While `_includes` houses reusable fragments of UI segments, `_layout` holds presets for complete pages built from these building blocks.

Pages containing **Recent Pages** header are rendered to full `.html` file based on `home` layout.  For normal posts, `single` layout is used.  So I had to make changes for those to preset to make my previous changes well blend to layouts and therefore final outputs.

### Changes for `home.html` 

`home` layout or `home.html` is used to render `index.html` and `page#.md` files.  With custom variable `page_no` added, I could refer to `page.page_no` to determine the sublist of posts which should display.

In actual implementation, it was sufficient for me to `include` my partial code `home-paginator` and use `current_page_post` which was returned.

Modified `home.html` looked like this.

```html
---
layout: archive
classes: wide
---

{% raw %}{{ content }}

<h3 class="archive__subtitle">{{ site.data.ui-text[site.locale].recent_posts | default: "Recent Posts" }}</h3>

{% include multilang/home-paginator %}
{% assign entries_layout = page.entries_layout | default: 'list' %}
<div class="entries-{{ entries_layout }}">
  {% for post in current_page_posts %}
    {% include archive-single.html type=entries_layout %}
  {% endfor %}
</div>

{% include paginator.html %}{% endraw %}
```
{: file='home.html'}

### Modifying `single.html`

`single` layout is used to render normal posts.  In `single.html`, changes were needed in the lines where the section headed **YOU MAY ALSO ENJOY**.

After **YOU MAY ALSO ENJOY** header at the tail of any post, there follow 4 different post thumbnails as related posts.  If there are predesignated list of related posts 4 posts come from there.  If not, 4 recent posts from all blog posts follow.

If this part is not changed, in related post section posts written in different languages simply mix up.

So I changed the related lines by importing `get-lang-posts` and using `lang_posts`.  As I had no plan to set related posts for my posts, I gave little twist for fun: if no related posts explicitly set, the section is filled with 4 posts randomly chosen from `lang_posts`.  So now I have my related posts section changing contents every time I commit to master repo to trigger remote `Jekyll` build from Github Pages.

```html
<!-- Only some part of code is displayed -->
{% raw %}{% comment %}<!-- only show related on a post page when `related: true` -->{% endcomment %}
{% if page.id and page.related and site.related_posts.size > 0 %}
  <div class="page__related">
    <h2 class="page__related-title">{{ site.data.ui-text[site.locale].related_label | default: "You May Also Enjoy" }}</h2>
    <div class="grid__wrapper">
      {% include multilang/get-lang-posts %}
      {% assign sampled_posts = lang_posts | sample: 4 %}
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
      {% include multilang/get-lang-posts %}
      {% for post in lang_posts limit:4 %}
        {% if post.id == page.id %}
          {% continue %}
        {% endif %}
        {% include archive-single.html type="grid" %}
      {% endfor %}
    </div>
  </div>
{% endif %}{% endraw %}
```
{: file='single.html'}

## SEO

Multiple language support completes with proper SEO setting.  I used `hreflang` tag.

This is basic structure for giving some lines for search bots to know how I am providing my Korean-English bilingual documents.  

```html
<link rel="alternate" hreflang="kr" href="https://lazyjobseeker.github.io">
<link rel="alternate" hreflang="en" href="https://lazyjobseeker.github.io/en">
```
{: .nolineno}

Above kind of lines should be added to all of my pages having Korean and English versions both, inside `<head>` section.

### Adding `hreflang` Tags

Below codes were added to my custom header file.

```html
<!-- Add hreflang for multiple language SEO support -->
{% include multilang/get-lang-variables %}
{% if target_url_ko %}<link rel="alternate" hreflang="ko" href="{{target_url_ko}}">{% endif %}
{% if target_url_en %}<link rel="alternate" hreflang="en" href="{{target_url_en}}">{% endif %}
```
{: file='_includes/head/custom.html'}

## Outro

So it is all over!  I made it to serve my blog in Korean and English.  I am happy with the output but I wouldn't have done this if `poluglot` was little more handy to use or at least Github Pages officially supported its execution.  Maybe I would rollback all the implementations here I made if there comes better multiple language support plugin.

After all I see my explanation here is too lengthy for someone who actually wants to modify one's blog to support multiple languages.  But if you are still willing to do, the most important part is writing `/multilang/` contents dedicated to codeblocks generating required`Liquid` arrays and variables. All other stuff were just about modifying UI components, checking 

사실 구현에서 중요한 것은 어떤 `Liquid` 요소들이 필요한지 생각하고 조각 코드로 만드는 작업이고, 나머지 내용은 장황하기는 하지만 그저 이미 있는 레이아웃들을 조금씩 건드리고 원하는 대로 될 때까지 테스트 빌드하는 작업의 반복에 불과했습니다.

지킬로 다국어 블로그를 만들고 싶지만 플러그인은 사용하기 싫다면 한 번 시도해 보시는 것도 좋겠습니다. 😆

<!--
### 사이트맵 구조 수정하기
-->