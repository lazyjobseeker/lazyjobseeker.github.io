---
published: false
title: How to Set Redirection for Jekyll Blog
category: programming
redirect_from:
  - /en/redirect-me/
tags:
  - jekyll
  - minimal-mistakes
  - redirection
  - jekyll-redirect-from
created_at: 2024-04-12 10:52:24 +09:00
last_modified_at: 2024-04-21 22:19:17 +09:00
excerpt: Steps to set redirection from old URL to new URL in Jekyll-based blog using jekyll-redirect-from plugin.
---

Recently I have updated permalink structure of posts for my blog, during implementation of [multilingual support](https://lazyjobseeker.github.io/en/posts/github-blog-multiple-language-support-with-jekyll-theme-minimal-mistakes).

As my previous pages had been already indexed by Google Search Engine with old URLs, those old URLs would have suffer from `404 not found` error unless I took some measures to give redirections from old URLs to new ones.

Fortunately, there is a `Jekyll` plugin named `jekyll-redirect-from`.

## Applying Plugin

To use `jekyll-redirect-from` plugin, you can simply add it in your `_config.yml` file.

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

## Setting Redirection in Posts

Now you can set your old URL as `redirect_from` value in front matter section of your new page.  Front matter of this page includes below lines:

```yaml
redirect_from:
  - /redirect-me/
```

There is no rendered page for `https://lazyjobseeker.github.io/en/redirect-me/`, but it redirects to this page.  Try checking how this works by inserting above address in search bar or hitting this link [링크](https://lazyjobseeker.github.io/en/redirect-me/).