---
lang: ko
layout: single
sidebar:
  nav: "docs"
author_profile: true
translated: true
title: Thoughts
permalink: /thoughts/
read_time: false
toc: false
robots: noindex
classes: wide
nopaginator: true
---

{% assign items = site.thoughts | sort: "last_modified_at" | reverse %}

{% for item in items %}

#### {{ item.title.ko -}}

{%- assign ko = item.content
  | split: '<!-- lang:ko -->'
  | last
  | split: '<!-- /lang:ko -->'
  | first -%}

{{- ko }}

Tags: {% for tag in item.tags -%}```{{tag}}```{%- endfor %}

{% endfor %}