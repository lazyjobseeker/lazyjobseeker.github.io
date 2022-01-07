---
layout: category
title: Curriculum Vitae
category: Sangheon Lee
last_modified_at: 2022-01-03 20:00:04 +0900
permalink: /docs/curriculum_vitae/
---

<h2> Publications (International) </h2>

{% for pub in site.publications %}
  <font size = 4>{{ pub.title }}</font>{{ "<br>" | remove: "<p>" | remove: "</p>"}}
  <font size = 3>{% for author in pub.authors %}
    {% if author.me == true && author.role == "first_equally" %}
    {% elsif author.me == true && author.role != "first_equally" %}
      
    {{ author.first_name }} {{ author.last_name }}, {% endfor %}</font>
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
