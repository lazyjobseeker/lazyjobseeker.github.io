---
translated: false
title: 지킬 블로그에서 페이지 리디렉션하기
category: Programming
redirect_from:
  - /redirect-me/
tags:
  - Jekyll
  - Github
  - Pages
  - Minimal
  - Mistakes
  - Redirection
  - jekyll-redirect-from
created_at: 2024-04-03 10:15:27 +09:00
last_modified_at: 2024-04-12 10:42:38 +09:00
header:
  teaser: /assets/images/uncategorized-teaser-6.png
excerpt: 지킬 기반의 Github Pages 블로그에서 jekyll-redirect-from 플러그인을 이용해 페이지 리디렉션을 제공하는 방법.
---

`Jekyll`로 만든 `Github Pages` 블로그에 [다국어 지원 기능](https://lazyjobseeker.github.io/posts/github-blog-multiple-language-support-with-jekyll-theme-minimal-mistakes)을 구현하면서 기존에 사용하던 퍼마링크 구조를 변경하였습니다.  기존 주소로 구글 검색엔진 색인이 되어 있었는데, 퍼마링크를 변경하면 기존 검색 결과에 노출된 링크들이 `404 Not Found`와 함께 작동하지 않을 것이고 SEO에 손상이 갈 것이라고 생각했습니다.

다행히 `Jekyll` 플러그인 `jekyll-redirect-from`을 이용하여 리디렉션을 설정하는 방법이 있었습니다.  플러그인을 적용하고 사용하는 방법을 정리합니다.

## 플러그인 적용하기

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

## 페이지 리디렉션 설정하기

플러그인을 적용하고 나면, 원하는 페이지의 front matter에 `redirect_from`값을 설정해 줍니다.  아래 예시는 실제로 이 페이지의 front matter에 적용되어 있는 설정입니다.

```yaml
redirect_from:
  - /redirect-me/
```

`https://lazyjobseeker.github.io/redirect-me/`는 존재하는 파일이 아닙니다.  하지만 리디렉션이 적용되어 있기 때문에, 위 주소로 접근을 시도하면 이 페이지로 돌아오게 됩니다.  주소창에 위 주소를 넣어 보거나 이 [링크](https://lazyjobseeker.github.io/redirect-me/)에서 확인해 볼 수 있습니다.