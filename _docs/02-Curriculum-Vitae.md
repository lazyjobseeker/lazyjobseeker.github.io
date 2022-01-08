---
layout: category
title: Curriculum Vitae
category: Sangheon Lee
last_modified_at: 2022-01-03 20:00:04 +0900
permalink: /docs/curriculum_vitae/
---

<h2> Publications (International) </h2>

{% for pub in site.publications %}
  <font size = 4>{{ pub.title | append: "<br>" }}</font>
{% endfor %}

<!--
  <font size = 3>
    {% for author in pub.authors %}
      {% capture name %} {{ author.first_name }} {{ author.last_name }} {% endcapture %}
      {% if author.is_me == true %}
        {% capture name %} {{ name | rstrip | prepend: "<b><u>" | append: "</u></b>" }} {% endcapture %}
      {% endif %}
      {% if author.last_author == true %}
        {% capture name %} {{ name | rstrip | prepend: "and "}} {% endcapture %}
      {% else %}
        {% capture name %} {{ name | rstrip | append: ", " }} {% endcapture %}
      {% endif %}
      {% if author.role == "first_equally" %}
        {% capture name %} {{ name | rstrip | append: "<sup>+</sup>" }} {% endcapture %}
        {% if author.correspondence == true %}
          {% capture name %} {{ name | rstrip | append: "<sup>,*</sup>" }} {% endcapture %}
        {% endif %}
      {% elsif author.correspondence == true %}
        {% capture name %} {{ name | rstrip | append: "<sup>*</sup>" }} {% endcapture %}
      {% endif %}
      {{ name | rstrip }}
    {% endfor %}
    {{ pub.journal_title_abbr | prepend: "<br><i><u>" | append: "</u></i>" }}
    {{ pub.volume | lstrip | prepend: "<b>" | append: "</b>" } | rstrip }}
    {% if pub.issue != false %}
      {{ pub.issue | lstrip | rstrip | prepend: "(" | append: ")" }}
    {% endif %}
    {% if pub.page_start != false %}
      {{ pub.page_start | lstrip | rstrip | prepend: ", "}}
      {% if pub.page_end != false %}
        {{ pub.page_end | lstrip | rstrip | prepend: "-" }}
      {% endif %}
    {% elsif pub.art_no != false %}
      {{ pub.art_no | lstrip | rstrip | prepend: ", " }}
    {% endif %}
    {{ pub.year | lstrip | rstrip | prepend: "(" | append: ")" }}
  </font>
-->
