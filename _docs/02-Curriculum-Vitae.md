---
layout: category
title: Curriculum Vitae
category: Sangheon Lee
last_modified_at: 2022-01-03 20:00:04 +0900
permalink: /docs/curriculum_vitae/
---

<h2> Publications (International) </h2>
{% assign counter = site.publications.size %}
{% for pub in site.publications %}
  <font size = 4>
    {% capture pub_num %} {% decrement counter -%} {% endcapture %}
    {{ pub_num | prepend: "[" | append: "] " | append: pub.title | append: "<br>" }}
  </font>
  <font size = 3>
    {% for author in pub.authors %}
      {% capture name %} {{- author.first_name }} {{ author.last_name -}} {% endcapture %}
      {% if author.is_me == true %}
        {% capture name %} {{- name | prepend: "<b><u>" | append: "</u></b>" -}} {% endcapture %}
      {% endif %}
      {% if author.last_author == true %}
        {% capture name %} {{- name | prepend: "and " -}} {% endcapture %}
      {% else %}
        {% capture name %} {{- name | append: "," -}} {% endcapture %}
      {% endif %}
      {% if author.role == "first_equally" %}
        {% capture name %} {{- name | append: "<sup>+</sup>" -}} {% endcapture %}
        {% if author.correspondence == true %}
          {% capture name %} {{- name | append: "<sup>,*</sup>" -}} {% endcapture %}
        {% endif %}
      {% elsif author.correspondence == true %}
        {% capture name %} {{- name | append: "<sup>*</sup>" -}} {% endcapture %}
      {% endif %}
      {{ name }}
    {% endfor %}
    {{ pub.journal_title_abbr | prepend: "<br><i><u>" | append: "</u></i>" }}
    {{ pub.volume | prepend: "<b>" | append: "</b>" -}}
    {% if pub.issue != false %}
      {{- pub.issue | prepend: "(" | append: ")," -}}
    {% else %}
      {{- "," -}}
    {% endif %}
    {% if pub.page_start != false %}
      {{- pub.page_start -}}
      {% if pub.page_end != false %}
        {{- pub.page_end | prepend: "-" -}}
      {% endif %}
    {% elsif pub.art_no != false %}
      {{- pub.art_no -}}
    {% endif %}
    {{ pub.year | prepend: "(" | append: ")" -}} {{ "; DOI: " | append: pub.doi }}
    {{- "<br><br>" -}}
  </font>
{% endfor %}
