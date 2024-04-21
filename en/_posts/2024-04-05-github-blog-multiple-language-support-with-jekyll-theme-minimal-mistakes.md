---
title: How to Serve Jekyll-Github Blog Multilingual
category: programming
tags:
  - jekyll
  - minimal-mistakes
  - multi-languages
created_at: 2024-04-05 08:44:57 +09:00
last_modified_at: 2024-04-21 21:10:59 +09:00
excerpt: How I implemented multi-language support for my Jekyll-based Github Pages blog without plugins.
---

## Intro

Since I started my `Jekyll` blog hosted *via* `Github Pages`, it has been a long-lasting quest to serve this blog in multiple languages, at least in two different ones (Korean as my native language and English).  This blog is based on powerful and long-loved `Jekyll` theme `Minimal Mistakes`, but unfortunately multiple language support was not among its native features.

In my endeavor to implement multilingual support, I found that most of available examples were successful with `Jekyll` plugin `polyglot`, which I also considered for my blog at first.

However, I abandoned this plan knowing that execution of `polyglot` is not supported by `Github Pages` and further settings are needed.  With trials and errors I managed to customize Korean-English bilingual support for my blog, ***without any plugins*** but only with `Jekyll`'s basic features and some `Liquid` codes.

Below I provided the list of requirements I wanted my blog to fully fulfill after my implementation.

- **A premise**: If a document written in Korean has permalink `a` and it has an English-translated version, permalink of English doc must be in `en/a` format.
- There should be a **toggle button** which directs user to translated page.

{% include img-gdrive alt="Toggle Button in Korean Page" id="1XAFm9BNOh2lhPKw37O5vdgVUysf0ES2N" %}

{% include img-gdrive alt="Toggle Button in English Page" id="1-IZLOfVRfiX7uiCn5lPfi9mCWe32izFt" %}

- `home` layout of vanilla `Minimal Mistakes` theme, which has **Recent Posts** area, should reasonably work with language toggle feature.

{% include img-gdrive alt="Paginated Index Page in Korean" id="1iKCOo6ieSx0_GEjW7hnlg8CuOSB0YbFJ" %}

{% include img-gdrive alt="Paginated Index Page in English" id="1jm6tKqgLUqkzc-2Yufzh9rESsyKKbQPe" %}

- Every hyperlinks in masthead and sidebar must work reasonably and texts also should be able to change adaptively to current page's language.
- **Previous·Next posts** buttons for in-post navigator UI should work reasonably.

{% include img-gdrive alt="Previous and Next Page" id="1H26X7XH4EAXJB7_HuNA2T1uIyEKnHzO-" %}

- **YOU MAY ALSO ENJOY** area where related posts are listed must work reasonably.

{% include img-gdrive alt="YOU MAY ALSO ENJOY in Korean Page" id="1cU6oihM7R1oAz91QOWI7wDA4FXaevpdo" %}

{% include img-gdrive alt="YOU MAY ALSO ENJOY in English Page" id="19ZbY55-gDmx29M54it5_hC1bsxVow-Hd" %}

Let me explain every single details I have done to make above features work.

## Make English-Contents Folder

I started with modifying project structure.  At first, I created new directory `en` in the project root, where I stored all translated documents.

For example, `_posts` directory in root held posts I already wrote in Korean.  As my purpose was to serve English-translated versions of all these posts, I created `_posts` subfolder under `en`.

```
lazyjobseeker.github.io
├─ _posts
└─ en
    └─ _posts
```

**Several `_posts` Folders<br>`_posts` is not meant to be unique in your proejct.  `Jekyll` tries to render all the markdowns residing in all folders named `_posts` throughout your project.  If there is another `_posts` folder like `a/_posts`, for example, posts built from this folder is regarded to have `a` as one of the categories.
{: .notice--info}

## Global Variable Settings in `_config.yml`

Then I added some more lines from `_config.yml`.  I added new variable `lang` and set different values for posts living in different paths.  I designed it for Korean posts/docs to have `ko` and English versions to have `en` as default value.

Permalink structure also was one of concern.  In default, permalink setting for `Minimal Mistakes` theme is `/:categories/:title`.  But as I mentioned above, when `Jekyll` treats my posts living in `en/posts`, it gives `en` as additional category for all the posts there.  So the folder tree I adjusted directly bound to affect original permalink structure.

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

**Permalink Change and Redirection**<br>If you change permalinks for your web pages previously indexed by search engines like Google bots, existing indexing results are not useful anymore because when visitor attempts to access your pages by original URL it would throw 404 error.  This might harm SEO of your blog.  You can avoid this issue by using `jekyll-redirect-from` plugin.
{: .notice--info}

Furthermore, I made distinction between `ko`- and `en`-specific values for `display-title` and `display-subtitle` items, which were meant to be displayed in leftmost side of masthead part.

```yaml
display-title:
  ko: "나불나불 끄적끄적"
  en: "Lazyjobseeker's Blog"
display-subtitle:
  ko: "읽고 쓰고 그리고 기억하기"
  en: "I read, write, draw and remember"
```
{: file='_config.yml'}

Same thing also was done for `author.bio` item, which goes downside of my author name in sidebar part, as my personal commentary lines.

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

Finally, I added a custom variable `posts_per_page`.  This value replaces existing variable `paginate`, which is used in conjunction with `jekyll-paginate` plugin.  `jekyll-paginate` is a plugin for pagination.  Altough what this is for is obscure yet, I will explain further this through following sections.

```yaml
# Custom paginator
posts_per_page: 8
```

## `translated` Variable Added

I also decided to define boolean variable `translated` in YAML Front Matters of all the posts or documents, to tell if a given document had its translated counterpart or not.  For example, if a markdown file living in `_post`( `en/_post`) has below line in their front matter, it means there exists its English(Korean) counterpart in `en/_post`(`_post`) folder.

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

In above example folder tree, there are two files named `2024-04-05-example.md`.  Both has `translated: true` line in front matter.  Default setting in `_config.yml` makes `_posts/2024-04-05-example.md` to have `ko` as its value for `lang` attribute.  For `en/_posts/2024-04-05-example.md`, value of `lang` is `en`.

**About Flle Name**<br>Original post in `_posts` and English-translated version `en/_posts` must be named as same.
{: .notice--warning}

## Defining Custom `Liquid` Objects

Throughout the whole story, here comes the most important part.  I set some additional `Liquid` arrays and variables, to provide required data I needed in implementing multilingual support.

### Language-Dependent Variables

As I already had modified `_config.yml` to render `lang` attribute for all the posts, for any post I could access `page.lang` variable to tell if a given post was in Korean (`ko`) or English (`en).

I moved on to defining several custom `Liquid` variables, which alters its content according to the value of `page.lang`.

- `lang_posts`: A `Liquid` array housing posts whose `lang` value is same with current post's.
- `display_title`: **Blog title** displaying on left-end of masthead.
- `display_subtitle`: **Blog subtitle** displaying on left-end of masthead.
- `author_bio`: Commentary from author, displaying below author name on sidebar.
- `prefix`: A string to be prepended to page permalink, to create full URL for translated page.  For example, if `page.lang` is `ko` for some post, `prefix` is `/en/`.
- `target_url_ko`: URL targeting Korean version of current page.
- `target_url_en`: URL targeting English version of current page.
- `post_prev`: **Previous post** having `lang` same with current post.
- `post_next`: **Next post** having `lang` same with current post.

### Variables for Pagination

Home page of `Minimal Mistakes` shows titles and excerpts of all the post in my blog.  In doing so, the theme does not list all the posts in single page, but refer to global variable `site.paginate` defined in `_config.yml` to show only specific number of posts at a page.  If there are total number of posts more than `site.paginate` value, additional pages are built with `/page2/`, `/page3/`... as permalinks.  Furthermore, a navigator is provided at the bottom of pages.

{% include img-gdrive alt="Paginated Index Page in Korean" id="1iKCOo6ieSx0_GEjW7hnlg8CuOSB0YbFJ" %}

{% include img-gdrive alt="Paginated Index Page in English" id="1jm6tKqgLUqkzc-2Yufzh9rESsyKKbQPe" %}

Such a feature is called **Pagination**.  When it comes to pagination-realted features of `Minimal Mistakes` theme, UI components like bottom navigator is powered by the theme itself but other features like mutliple-page building resorts to `jekyll-paginate` plugin.

While `jekyll-paginate` is sufficient to implement pagination features for vanilla `Minimal Mistakes` theme, issue rises in serving multiple-language support.  `jekyll-paginate` processes all the posts of my project, and I cannot set conditions based on categories, tags or custom variables like `lang` to filter the scope.

Therefore, supporting multiple languages in `Minimal Mistakes` theme but maintaining **Recent Posts** section of default page meant that I had to abandon `jekyll-paginate`.  To do away with `jekyll-paginate`, I thought I should be able to provide below `Liquid` objects.

- `first_page_path`: URL of the first page of paginated default pages.
-  `current_page_posts`:  A `Liquid` arrray of length `post_per_page`, containing posts to be displayed in current page.
- `total_pages`: Total number of pages into which default home pages should be divided by pagination.  For example, if I have 10 English posts and `posts_per_page` is 4, `total_pages` should be 3.

## Implementing Custom `Liquid` Objects

After designing custom `Liquid` objects, I wrote some code snippets to calculate provide them.  I saved all the snippets below inside `_includes/multilang` folder.

### Finding Posts with Same Languages

This snippet, named `get-lang-posts`, creates `lang_posts` array I conceptualized above.

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

### Language-Specific URLs and Texts

This snippet, named `get-lang-variables`, creates required URLs for hyperlinks, texts to be displayed on masthead and sidebar.

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

By including this code when needed, I was able to access to 7 custom variables: `display_title`, `display_subtitle`, `author_bio`, `first_page_path`, `prefix`, `target_url_ko`, `target_url_en`

### Variables for Pagination

#### Preliminary Works

Some preliminary works were needed in implementing pagination for multiple-language service.

I started by observing what `jekyll-paginate` does.  This plugin **automatically creates** `html` files whose permalink is set by `/page2/`, `/page3/`.  Only exception is the very first page, permalink of which is `nil` (empty string).

However, I could not use `jekyll-paginate`, and it meant that I cannot let my `/page#/` and `/en/page#/` permalinked pages automatically creates during site build.  So I built `_index` and `en/_index` folders to house markdown files which were intended to be rendered as individual pages having `/page#/` or `/en/page#/` formatted permalinks.

For clarity, I named such individual markdown files housed under `_index` folders to be `page#.md`.  The only exception was `index.html` located in the project root: it couldn't be moved into `_index` nor renamed to `page1.md` as `Jekyll` tries to find a file named `index.html` and render it as unique default page.

Finally, project structure considering customized pagination was as follows.  Altough markdown file for English version of home page is not obligated to have `index` as filename, I just let it have that name for consistency with `index.html` in project root.

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

And `page_no` custom variable was declared in front matter of every `index.html`, `index.md` or `page#.md` files.  Permalinks were also set manually for those pages.

For example, below I show how front matters for pages with `/page2/` and `/en/page2/` permalinks should look like:

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

For sure, `lang` variable should be set for those files also.  I set `lang` variable for those files in `_config.yml`, as part of `default`.

```yaml
# Some values were omitted for clarity.
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
{: file='_config.yml'}

#### Implementation

After preliminary works done, I moved on to pagination-related codes.  Implementations were separated into two files.  First one was `home-paginator`, which provides `current_page_posts`.

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

Next thing was `prev-next-locater`, meant to specify previous and next posts having `lang` values same with current post.

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

## Modifying `_include` Contents

`_include` folder is comprised of items repeatedly used in rendering any pages - masthead, sidebar, header, footer, and so on.  Among them, I had to modify `masthead.html`, `author-profile.html`, `nav_-_list`, `paginator.html`, `post-pagination.html` files.  Snippets written in `_include/multilang` were repeatedly included in modifying those files to provide proper `Liquid` objects/variables.

### Masthead

Top panel or masthead part of posts/pages are rendered by `_includes/masthead.html`.  First of all, additional UI component is required here: a language toggle link which displays EN(KO) if current page is Korean(English).  This toggle link should direct user to English(Korean) version counterpart of current page.

All URLs were already available by including `get-lang-variables`.  So I could simply import `get-lang-variables` file and refer `prefix`, `target_url_ko` and `target_url_en` variables to modify original hyperlinks.

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

### Sidebar

Among building blocks for sidebar component, two files need to be modified: `author-profile.html` and `nav_list.`

Firstly, in `author-profile.html`, reference to `author.bio` needs to be changed to custom variable `author_bio` which can adaptively vary according to `page.lang`.

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

In `nav_list` file, `get-lang-variables` is imported to use `prefix` variable.  `prefix` variable is to prepend `/en/` prefix to get URLs directing to English-translated documents when `page.lang` is `en`.

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

### Paginator

`home.html` layout imports `paginator.html` to conduct pagination for default pages.  This file was modified as follows.  Notice to how `page_no` variable and `total_pages` custom variables are in use.

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

### Previous·Next Posts

This part is implemented by `post_pagination.html`.  As I already wrote `prev-next-locater` to serve `post_next` and `post_prev` objects, I can simply include this fiile and subtitute `page.next` and `page.previous` variables in original lines with my new custom variables.

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

### Removing `en` from Category List

As explained already, when `Jekyll` processes my posts living in `en/_posts`, they are automatically treated as if I set `en` as additional category in its front matter.

`Minimal Mistakes` theme shows all the categories a post holds at the end of the post by default, and therefore my English posts all show additional category `en` unless I change some codes.

To avoid this I changed `_includes/category-list.html` file, making it ignore `en` keyword in rendering category enumeration section.

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
{: file='category-list.html'}

## Modifying `_layout` Contents

While `_includes` houses reusable UI segments, `_layout` holds presets for complete pages built from these building blocks.

Pages containing **Recent Pages** header are rendered based on `home` layout.  For normal posts, `single` layout is used.  So I had to make changes for those to preset to make my previous changes well blend to layouts and therefore final outputs.

### Changes for `home.html` 

`home` layout or `home.html` is used to render `index.html` and `page#.md` files.  With custom variable `page_no`, I could access `page.page_no` and determine the subset of all posts which should display.

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

So if I do not modify this part, this related posts section is simply mixed up with posts of different languages.

To handle this I changed related lines by importing `get-lang-posts` and using `lang_posts`.  As I had no plan to set related posts for my posts, I gave little twist for fun: if no related posts explicitly set, the section is filled with 4 posts ***randomly*** chosen from `lang_posts`.  So now I have my related posts section changing contents every time I commit to master repo to trigger remote `Jekyll` build from Github Pages.

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

Below codes were added to my custom header file, to automatically add `hreflang` tages in every contents in my blog.

```html
<!-- Add hreflang for multiple language SEO support -->
{% include multilang/get-lang-variables %}
{% if target_url_ko %}<link rel="alternate" hreflang="ko" href="{{target_url_ko}}">{% endif %}
{% if target_url_en %}<link rel="alternate" hreflang="en" href="{{target_url_en}}">{% endif %}
```
{: file='_includes/head/custom.html'}

## Outro

So it is all over!  I made it to serve my blog in Korean and English.  I am happy with the output but I wouldn't have done this if `polyglot` was little bit more handy to use or at least Github Pages officially supported its execution.  Maybe I would rollback all the implementations here I made if there comes better multiple language support plugin.

After all I see my explanation here is too lengthy for someone who actually wants to modify one's blog to support multiple languages.  But if you are still willing to do, just keep in mind that the most important part was writing code snippets I stored in `_include/multilang/`. All other stuff was just a tedious repeat-and-test to see if all hyperlinks and texts in rendered pages work as intended.

So if you want to serve your `Jekyll` blog but plugins are not of your taste: try implementing it yourself!  It is definitly possible and will be an worthwhile challenge. 😆