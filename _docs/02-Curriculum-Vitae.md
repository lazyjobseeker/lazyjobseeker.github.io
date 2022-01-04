---
layout: category
title: Curriculum Vitae
category: Sangheon Lee
last_modified_at: 2022-01-03 20:00:04 +0900
permalink: /docs/curriculum_vitae/
---

## Publications (International)

{% for pub in site.publications %}
  ## {{ pub.title }}
  {% for author in pub.authors %}
    {% if author.role == "me" %}
      {{ author.first_name }} {{ author.last_name }}
    {% endif %}
  {% endfor %}
{% endfor %}