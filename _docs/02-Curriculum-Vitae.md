---
layout: category
title: CURRICULUM VITAE
category: Sangheon Lee
last_modified_at: 2022-01-03 20:00:04 +0900
permalink: /docs/curriculum_vitae/
---

<h2> 🎓 EDUCATION & CAREER </h2>
<div style = "margin-bottom: 50px">
  {% for career in site.career reversed %}
      <div><font size = 4><b> {{- career.title -}} </b></font></div>
      <div>
        <font size = 2><b> {{ career.started | append: " - " | append: career.ended}} </b></font>
      </div>
      <div>
        <font size = 3>
          {% for pos in career.history %}
            {{- pos.department | append: "<br>" -}}
            {% if pos.job != "NA" %}
              {{- pos.job | prepend: "&nbsp;&nbsp;- " | append: "<br>" -}}
              {% for dscr in pos.job_dscrs %}
                {{ dscr | prepend: "&nbsp;&nbsp;&nbsp;&nbsp;- " | append: "<br>" -}}
              {% endfor %}
            {% endif %}
          {% endfor %}
          {{ career.site | append: "<br><br>" }}
        </font>
      </div>
  {% endfor %}
</div>
<h2> 📚 PUBLICATIONS </h2>
<div>
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
