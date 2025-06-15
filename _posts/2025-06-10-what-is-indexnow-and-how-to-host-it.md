---
title: 깃허브 블로그에 웹 인덱싱 프로토콜 인덱스나우(IndexNow) 연동하기
category: programming
tags:
  - DevLog
  - SEO
  - Jekyll
created_at: 2025-06-10 09:56:42 -05:00
last_modified_at: 2025-06-15 05:32:21 -05:00
excerpt: 크롤링봇 기반의 기존 웹 인덱싱을 대체하는 신규 프로토콜 인덱스나우(IndexNow)를 깃허브 페이지 기반의 지킬 블로그에 연동하고 Github Actions 워크플로우를 이용해 신규/변경 포스트 URL 보고 과정을 자동화하기.
published: true
---
## 인덱스나우

Bing 검색엔진에서 블로그 포스트 인덱싱 상태를 확인하기 위해 Bing 웹마스터 도구 페이지에 들어가 보았더니 **IndexNow**라는 웹 인덱싱 프로토콜을 홍보하는 페이지가 있었습니다.  ChatGPT한테 물어 보니 2021년 10월부터 이미 Bing에서 공식적으로 런칭했다고 하는데 어지간히도 주의깊게 보지 않았는지 이제서야 눈에 들어왔습니다.

설명에 따르면 IndexNow는 기존 웹 크롤러 방식 인덱싱의 느린 속도를 개선하기 위해 개발된 오픈소스 프로토콜이라고 합니다.  기존 웹 크롤러 대비 정말로 좋은 것인지는 조금 더 지켜봐야 알겠지만, 지금까지의 인상은 크롤링되어야 할 URL 정보를 사용자단에서 제공하도록

설명에 따르면 기존의 느린 웹 크롤러들을 대체하기 위해 개발된 오픈소스 프로토콜이라고 합니다.  정말로 기존 웹크롤러 대비 좋은 것인지는 조금 더 지켜봐야 알겠지만, 지금까지는 크롤링할 URL 정보를 크롤러에게 제공하는 주체를 웹페이지를 호스팅하는 사용자단으로 옮긴 정도라는 인상입니다.

개인 사이트를 **워드프레스**나 **쇼피파이** 등 호스팅 서비스를 이용하여 운영 중이라면 서드파티 플러기인을 이용해 인덱스나우 기반 웹 인덱싱을 활용할 수 있습니다.  하지만 이 사이트는 **깃허브 페이지**와 **지킬**을 사용하고 있으며 Bing 웹마스터 도구에서는 별도의 간소화된 지원방식이 없으므로 안내에 따라 직접 기능 구성을 진행했습니다.

{% include img-gdrive alt="API Key generation and hosting for IndexNow" id="1xrmCy3WAdY2DMiFmhv9_ZFKIPqyQW06t" %}

방법 자체는 충분히 따라할 수 있을 만큼 간단합니다.  적당한 규칙을 만족하는 API키를 직접 만들거나 위와 같이 Bing 웹마스터 도구에서 간단히 생성해 주는 키를 저장해 두고, 해당 키를 파일명과 내용에 포함하는 텍스트 파일을 하나 만들에 웹사이트의 루트 디렉토리에 호스팅합니다.  그런 뒤 인덱스나우 API 서버에 크롤링되도록 하고 싶은 URL 목록을 HTTP Request로 보내 주면 됩니다.

## 깃허브 액션 (Github Actions) 워크플로우에 통합

컨셉 자체는 간단하지만 포스트를 작성할 때마다 매번 새로운 HTTP 리퀘스트를 수동으로 만들어 쏴주는 식으로 운영하는 것은 효율이 떨어지니 Github Actions 워크플로우를 이용하여 생성 혹은 변경된 포스트가 push될 때마다 HTTP Request가 자동으로 발신되도록 하였습니다.

사이트 레포지토리 코드에 총 세 가지 수정을 진행했습니다.

### 최근 변경된 URL 목록을 갖는 JSON 파일 템플릿 작성성

`indexnow-url-list.html` 파일을 만들고 `indexnow-url-list.json` 퍼마링크로 렌더링되도록 하였으며, 사이트 빌드가 진행되는 시간을 기준으로 1시간 이내에 변경된 포스트들의 URL 목록을 갖는 JSON Array를 내용으로 갖도록 하였습니다.  `post_date` 변수를 설정하면서 굳이 필요없어 보이는 liquid filter `plus: 0`을 사용하였는데,  liquid filter 문법에서 문자열로부터 변환된 타임스탬프는 별도의 산술연산이 후행되지 않으면 숫자가 아니라 문자열로 인식되어 이후의 if절에서 타입 불일치로 인한 비교 불가 오류가 발생하기 때문입니다.

```html
{%-raw-%}
---
layout: none
permalink: /indexnow-url-list.json
---
{%-endraw-%}

{%- assign base_date = 'now' | date: '%s' | plus: 0 | minus: 3600 -%}
[
  {%- assign first = true -%}
  {%- for post in site.posts -%}
    {%- assign post_date = post.last_modified_at | default: post.date | date: '%s' | plus: 0 -%}
    {%- if post_date > base_date -%}
      {%- unless first -%},{%- endunless -%}
      "{{ site.url }}{{ post.url }}"
      {%- assign first = false -%}
    {%- endif -%}
  {%- endfor -%}
]
```
{: file="indexnow-url-list.html"}

### HTTP Request를 발신하는 Python 스크립트 작성

앞서 작성된 JSON 파일을 읽어들이고 그 내용을 기반으로 HTTP request 발신을 진행하는 스크립트 `indexnow.py` 를 작성하였습니다.  코드가 지저분하지만 한 가지만 주의하면 되는데, IndexNow 엔드포인트당 API 키를 별도로 생성하여 호스팅해야한다는 점입니다.  **네이버 서치어드바이저**에서도 현재 IndexNow 기반의 URL 리포팅을 지원하고 있기 때문에, Bing과 네이버 두 검색엔진에 대해 HTTP 리퀘스트를 보낼 수 있도록 API 키 두 개를 생성해 호스팅했습니다.


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

### Github Actions 워크플로우에 통합

마지막 과정이고 Github actions workflow에 대한 이해가 부족해 생각보다 시간이 걸렸습니다.  `.github\workflows` 디렉토리 하위에 새로운 파일 `indexnow.yml`을 아래와 같이 작성하였습니다.

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
    if: ${{ github.event.workflow_run.conclusion == 'success' }}
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

`indexnow.py` 스크립트는 Jekyll 엔진이 사이트 빌드를 마친 후 - 즉, `indexnow-url-list.json` 파일이 접근가능하게 된 이후 - 작동하며, `indexnow.py` 파일을 실행하여 실제로 HTTP Request를 발신하게 됩니다.

### 마무리

위와 같은 수정으로 IndexNow를 사용할 수 있게 되었습니다.  원래는 최종수정일시 변수 `last_modifed_at`을 빌드 시점에 모두 불러들여 JSON 파일 하나로 만들어 두고, 다음 push가 발생할 때 새로 빌드되는 포스트들의 최종수정일시를 JSON 파일 내의 이전 기록과 대조하여 변경사항이 발생한 케이스에 대해서만 HTTP Request를 쏘는 형태로 하고 싶었는데 편하게 하려다 보니 1시간 이내 변경사항에 대해서는 모두 Request를 보내는 엉성한 형태가 되었습니다🤣.  이 부분은 시간이 될 때 다시 수정해 보도록 하겠습니다.