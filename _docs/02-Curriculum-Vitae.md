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
  <font size = 3>
    {% for author in pub.authors %}
      {% capture name %} {{ author.first_name }} {{ author.last_name }} {% endcapture %}
      {% if author.me == true %}
        {% capture name %} {{ name | prepend: "<b><u>" | append: "</u></b>" }} {% endcapture %}
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
      {% if author == pub.authors[pub.authors.size-1] %}
      {% elsif author == pub.authors[pub.authors.size-2] %}
        {{ ", and " }} 
      {% else %}
        {{ ", " }}
      {% endif %}
    {% endfor %}
  </font>
{% endfor %}

<!--
  {% if author.me == true %}
    <b><u> {{ author.first_name }} {{ author.last_name }} </u></b>,
  {% else %}
    {{ author.first_name }} {{ author.last_name }},
  {% endif %}
  {% if author.role == "first_equally" %}
    <sup>+</sup>
    {% if author.correspondence == true %}
      <sup>,*</sup>
    {% endif %}
  {% elsif author.correspondence == true %}
    <sup>*</sup>
  {% endif %}
-->
