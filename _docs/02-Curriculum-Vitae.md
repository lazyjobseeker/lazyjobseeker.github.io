---
layout: category
title: Curriculum Vitae
category: Sangheon Lee
last_modified_at: 2022-01-03 20:00:04 +0900
permalink: /docs/curriculum_vitae/
---

## Publications (International)

{% for pub in site.publications %}
  <h2> {{ pub.title }} </h2>
  {% for author in pub.authors %}
    {% if author.me == true %}
      <b><u> {{ author.first_name }}, {{ author.last_name }} </u></b>
    {% endif %}
  {% endfor %}
{% endfor %}