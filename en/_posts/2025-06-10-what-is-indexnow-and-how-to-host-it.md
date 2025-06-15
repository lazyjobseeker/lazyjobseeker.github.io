---
title: Integrating IndexNow in Github Pages Blog
category: programming
tags:
  - DevLog
  - SEO
  - Jekyll
created_at: 2025-06-10 09:56:42 -05:00
last_modified_at: 2025-06-15 05:41:14 -05:00
excerpt: Let's brief a web indexing protocol for SEO called IndexNow and demonstrate how I hosted it in my github pages blog and automated the process of reporting added/modified URLs to IndexNow API server using Github actions workflow.
published: true
---
## What is IndexNow

One day visiting the Bing Webmaster Tools site I found that they have been endorsing their new SEO protocol named **IndexNow**.  It read that it was developed as a counterpart of conventional slow web crawlers.  Maybe I need more time to find out if it is really a better solution than well-established crawling method, up until now my impression is that it made the crawling process streamlined by dumping the responsibility of setting the list of URLs to be crawled and also the priority for crawling among the list of URLs to be crawled to the end users or the website owners.

If you are hosting your personal website with for example, **WordPress** or **Shopify**, there are third-party plugins available for you to enable this feature for your site.  But I am hosting my website using **Github Pages** and **Jekyll**, forcing me to implement the feature manually following their instruction.

{% include img-gdrive alt="API Key generation and hosting for IndexNow" id="1xrmCy3WAdY2DMiFmhv9_ZFKIPqyQW06t" %}

The process is simple and instruction is handy though.  You get an auto-generated API key, serve the key in the form of text file whose filename is the API key and the content is also the API key string.  After that you can send HTTP request on which you load the list of URLs (as a JSON array) you want to report to the server for future crawling.

## Integrating into Github Actions Workflow

While the concept is simple - you can just host a API key file and send HTTP request -, is is little bit more tricky if you want to integrate the process of requesting changes into a continuous distribution using **Github Actions**.  For example, I want to automatically send an HTTP request with URLs undergone changes (addition, modification)  There were three changes I made in my blog repository to implement an automated HTTP request upon any changes pushed to my repository.

1. Added `indexnow-url-list.html` file containing `liquid` filters, which is intended to be rendered as `indexnow-url-list.json` file.  Rendered JSON includes a JSON array of the URLs of posts that were modified less than 1 hour ago.
2. Added `indexnow.py` file to read JSON file built above and send HTTP request.
3. Added `indexnow.yml` workflow file under `.github\workflows` directory, to execute `indexnow.py` script after the whole site building process completes and therefore the `indexnow-url-list.json` file becomes available.
4. Note the use of dummy liquid filter `plus: 0`.  Timestamp does not convert its type to integer without it, raising error due to comparison between unmatched types/.

### Create JSON File Having Recently Modified URLs

```html
---
layout: none
permalink: /indexnow-url-list.json
---

{% raw %}{%- assign base_date = 'now' | date: '%s' | plus: 0 | minus: 3600 -%}{% endraw %}
[
  {% raw %}{%- assign first = true -%}
  {%- for post in site.posts -%}
    {%- assign post_date = post.last_modified_at | default: post.date | date: '%s' | plus: 0 -%}
    {%- if post_date > base_date -%}
      {%- unless first -%},{%- endunless -%}
      "{{ site.url }}{{ post.url }}"
      {%- assign first = false -%}
    {%- endif -%}
  {%- endfor -%}{% endraw %}
]
```
{: file="indexnow-url-list.html"}

### Create Python Script Sending HTTP Request

The code is quite messy.  But one thing you need to catch is that you need **unique API key** per host.  I have got two API keys to report post URLs to two different search engines (Bing, Naver).  It is also noticeable that you can use any string as API key as long as they meet some condition.  You don't need any certified 3rd to generate your key.  The key's validity is only assessed by your ability to host the API key string you intend in your repository.

```python
import requests

json_url = "https://lazyjobseeker.github.io/indexnow-url-list.json"

response = requests.get(json_url)
response.raise_for_status()  # fail fast if can't fetch

url_list = response.json()  # This will be a list of URLs

if len(url_list) == 0:
    print("No URLs found in the JSON file. Proceed without updating to IndexNow.")
else:
    for url in url_list:
        print(url)

    data1 = {
        "host": "lazyjobseeker.github.io",
        "key": "7c8d916aed354f77bb94d77e66fa202e",
        "keyLocation": "https://lazyjobseeker.github.io/7c8d916aed354f77bb94d77e66fa202e.txt",
        "urlList": url_list
    }

    headers1 = {'Content-Type': 'application/json; charset=utf-8'}
    r1 = requests.post("https://api.indexnow.org/IndexNow", json=data1, headers=headers1)
    print(r1.status_code, r1.text)

    response2 = requests.get(json_url)
    response2.raise_for_status()  # fail fast if can't fetch

    url_list2 = response2.json()  # This will be a list of URLs

    data2 = {
        "host": "lazyjobseeker.github.io",
        "key": "988e928790a24ceb80bd704f7f067aaf",
        "keyLocation": "https://lazyjobseeker.github.io/988e928790a24ceb80bd704f7f067aaf.txt",
        "urlList": url_list2
    }

    headers2 = {'Content-Type': 'application/json; charset=utf-8'}
    r2 = requests.post("https://searchadvisor.naver.com/indexnow", json=data2, headers=headers2)
    print(r2.status_code, r2.text)
```
{: file="indexnow-url-list.html"}

### Integrating into Github Actions Workflow

This is the last and it was the trickiest part for me.  You need to add an additional workflow file under `.github\workflows` directory of your repository.

```yml
name: Build and Deploy with IndexNow

on:
  workflow_run:
    workflows:
      - pages-build-deployment
    types:
      - completed

jobs:
  notify_indexnow:
    if: ${% raw %}{{ github.event.workflow_run.conclusion == 'success' }}{% endraw %}
    runs-on: ubuntu-latest

    steps:
      - name: Checkout (minimal)
        uses: actions/checkout@v4

      - name: Set up Python
        uses: actions/setup-python@v5
        with:
          python-version: 3.x

      - name: Install requests
        run: pip install requests

      - name: Run IndexNow Notify
        run: python indexnow.py
```
{: file="indexnow.yml"}

All set.  Now whenever you push your changes to your github blog's repository, `/indexnow-url-list.json` file creates and holds the list of posts whose contents are modified within 1 hour - a caveat is that this check is indirectly done by referring to `post` instance's `last_modified_at` variable.  I am using Obsidian's `Linter` plugin allowing me to update this variable whenever I hit `ctrl+s` to save my current progress writing or modifying any post.

### Remaining Implementations

At first what I wanted to implement was to create a `json` file containing `last_modified_at` variable of all the posts and save it as a separate file **after** I push any changes and Jekyll builds my site.  So when I push further changes afterwards, the file created in previous push contains the posts' modified dates and I can use it to find out which post was changed (rather than having a workaround as above, setting a hardcoded time window of 1 hr and send HTTP request for URLs falling in this criterion).