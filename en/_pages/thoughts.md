---
lang: en
layout: single
sidebar:
  nav: "docs"
author_profile: true
translated: true
title: Thoughts
permalink: /en/thoughts/
read_time: false
toc: false
robots: noindex
classes: wide
nopaginator: true
---

{% assign items = site.thoughts | sort: "last_modified_at" | reverse %}

{% for item in items %}

#### {{ item.title.en }}

{% assign en = item.content
  | split: '<!-- lang:en -->'
  | last
  | split: '<!-- /lang:en -->'
  | first %}

{{ en }}

<br>
Tags: {% for tag in item.tags -%}<code>{{ tag }}</code>{%- endfor %}

{% endfor %}