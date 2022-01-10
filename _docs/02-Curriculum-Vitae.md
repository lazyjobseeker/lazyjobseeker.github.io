---
layout: category
title: Curriculum Vitae
category: Sangheon Lee
last_modified_at: 2022-01-03 20:00:04 +0900
permalink: /docs/curriculum_vitae/
---

<h2> 🎓 EDUCATION & CAREER </h2>
<div style = "float: left">
  {% for career in site.career reversed %}
      <div style = "width: 60%; float: left"><font size = 4><b> {{- career.affiliation -}} </b></font></div>
      <div style = "text-align: right; width: 40%; float: right">
        <font size = 2> {{ career.started | prepend: "(" | append: " - " | append: career.ended | append: ")"}} </font>
      </div>
      <div style = "float: left">
        <font size = 3>
          {% for pos in career.history %}
            {{- pos.department | append: "<br>" -}}
          {% endfor %}
          {{ career.site | append: "<br><br>" }}
        </font>
      </div>
  {% endfor %}
</div>

<br>
<br>
<br>

<h2> 📚 PUBLICATIONS </h2>
<div style = "float: left">
  {% assign counter = site.publications.size | plus: 1 %}
  {% for pub in site.publications reversed %}
      <font size = 4><b>
        {% assign counter = counter | minus: 1 %}
        {% if counter < 10 %}
          {{ counter | prepend: "0" | append: ". " | append: pub.title | append: "<br>" }}
        {% else %}
          {{ counter | append: ". " | append: pub.title | append: "<br>" }}
        {% endif %}
      </b></font>
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
        {{ pub.journal_title | prepend: "<br><i><u>" | append: "</u></i>" }}
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
        {{ pub.year | prepend: "(" | append: ")<br>" -}}
        {{ "DOI: " | append: pub.doi }}
        {{- "<br><br>" -}}
      </font>
  {% endfor %}
</div>
