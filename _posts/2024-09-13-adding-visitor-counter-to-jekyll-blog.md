---
title: 깃허브 블로그에 방문자 카운터 넣기
category: programming
tags:
  - jekyll
  - minimal-mistakes
created_at: 2024-09-13 22:05:32 UTC+09:00
last_modified_at: 2024-09-14 06:49:04 UTC+09:00
excerpt: 오픈소스 웹 애널리틱스 플랫폼 goatcounter를 이용하여 지킬 기반 깃허브 블로그에 방문자 카운터를 만드는 방법을 정리합니다.
---
`Jekyll`과 같은 정적 웹사이트 생성기를 이용해 만든 개인 블로그에는 자체적으로 방문자 카운터를 넣을 방법이 없습니다.  다행히 무료로 사용 가능한 오픈소스 웹 애널리틱스 플랫폼 중 프로그래머 [Martin Tournoij](https://github.com/arp242)가 개발하여 운영하고 있는 [GoatCounter](https://www.goatcounter.com/)를 이용하여 방문자 카운터 기능을 직접 구현할 수 있습니다.

이 포스팅에서는 **Minimal Mistakes** 테마를 사용하고 있는 이 블로그에 GoatCounter API를 이용한 방문자 카운터를 넣은 과정을 정리해 보았습니다.  이 포스팅을 참고하여 직접 방문자 카운터를 만들어도 좋고,  GoatCounter 기반으로 개별 포스트의 페이지뷰 숫자를 제공하도록 미리 구현해 둔 [Satellite🛰️](https://byanko55.github.io/)와 같은 테마를 사용해 보아도 좋겠습니다. 

## GoatCounter 계정 만들기

먼저 [GoatCounter](https://www.goatcounter.com/) 사이트에서 내 GoatCounter 계정을 만들어 주어야 합니다.  **☞ Sign Up** 버튼을 클릭합니다.

![GoatCounter 사이트](https://drive.google.com/thumbnail?id=10NuyfX_xlB4-toR5eIvm3P8aMqu4iugH&sz=w1000)

필요한 정보들을 입력하고 가입을 완료합니다.

![GoatCounter 계정 만들기](https://drive.google.com/thumbnail?id=10QnxQIqmvw-MHiZQPcohRpOCmjwqSFeJ&sz=w1000)

가입 정보를 이용하여 로그인하면 아래와 같이 사이트 통계를 확인할 수 있게 됩니다.  위 예시의 경우 `Code`에 `my-code`를 입력하였기 때문에 `my-code.goatcounter.com`으로 접근하여 로그인이 가능합니다.  데이터가 쌓이게 되면 아래와 같은 웹 애널리틱스 정보를 열람할 수 있게 됩니다.

![사이트 통계](https://drive.google.com/thumbnail?id=10Ul28CEGJYXJw5vaU9-O28Z5WX6CBFCi&sz=w1000)

## 방문자 카운터 만들기

이제 방문자 카운터를 만들어 보겠습니다.  기본적인 방법은 [공식 문서](https://goatcounter.com/help/visitor-counter)에서 이미 잘 설명하고 있는데, 기본적으로 제공하는 프리셋을 이용하는 방법 혹은 API를 통해 제공되는 `JSON`객체에 직접 접근하는 방식을 사용할 수 있습니다.

### 프리셋 사용하기

프리셋을 사용하는 경우 아래와 같은 형태로 미리 구성된 방문자 카운터를 사용할 수 있습니다.  많은 경우 프리셋을 사용하기보다는 수치만 로드한 뒤 개인 블로그 디자인에 맞게 커스터마이즈하여 사용하는 것을 선호할 것이라고 생각하기 때문에, 프리셋을 사용하는 방법에 대한 자세한 설명은 생략하도록 하겠습니다.

![기본 방문자 카운터](https://drive.google.com/thumbnail?id=10ajeKN8SG_hrGqVw0YJL9HO4uEadwXoN&sz=w400)

### 방문자수 데이터에 직접 접근하기

GoatCounter에 등록한 사이트 `https://my-code.github.io`의 개별 URL들에 대한 방문자 카운터는 30분 간격으로 아래 경로의 JSON 파일에 업데이트됩니다.

```
https://my-code.goatcounter.com/counter/URL.json
```

예를 들면 아래와 같습니다.

```
<!-- 대상 페이지 주소 -->
https://my-code.github.io/example

<!-- 방문자 카운터가 업데이트되는 JSON 파일 -->
https://my-code.goatcounter.com/counter/example.json
```

특수한 케이스에 대한 방문자 카운터는 아래 주소에서 확인할 수 있습니다.  특수한 케이스란 1) **홈 페이지(index.html)**의 방문자 수 및 2) **사이트 전체**의 방문자 수를 말합니다.

```
<!-- 홈 페이지 (index.html) -->
https://my-code.goatcounter.com/counter//.json

<!-- 사이트 전체 방문자수 -->
https://my-code.goatcounter.com/counter/TOTAL.json
```

`start`, `end` 쿼리로 결과를 특정 기간 내로 제한할 수 있습니다.  `start` 쿼리의 경우 `yyyy-mm-dd` 형태의 날짜 입력 이외에도 `week`, `month`, `year` 값을 별도 지원합니다.

```
<!-- 지난 한 주간 -->
https://my-code.goatcounter.com/counter/TOTAL.json?start=week

<!-- 지난 한 달간 -->
https://my-code.goatcounter.com/counter/TOTAL.json?start=month

<!-- 지난 일 년간 -->
https://my-code.goatcounter.com/counter/TOTAL.json?start=year

<!-- 특정 기간 -->
https://my-code.goatcounter.com/counter/TOTAL.json?start=2024-03-01&end=2024-06-01
```
{: file="passing queries"}

JSON 파일에 접근하면 `count` 및 `count_unique` 키가 있는데 두 값이 같습니다.  `count_unique`는 호환성을 위한 레거시 키라고 하니 `count`값만 사용한다고 생각하면 됩니다.

### 테마에 적용하기

이제 실제로 **Minimal Mistakes** 테마에 적용하기 위해 사용한 코드를 살펴봅시다.  우선 아래 내용을 커스텀 헤더 파일 `custom.html` 파일에 추가해 주었습니다.

```html
<!-- Site Stat by GoatCounter -->
<script data-goatcounter="https://lazyjobseeker.goatcounter.com/count" async src="//gc.zgo.at/count.js"></script>
<script>
    var t = setInterval(function() {
        if (window.goatcounter && window.goatcounter.visit_count) {
            clearInterval(t)
            var today = new Date();
            var daily = new XMLHttpRequest();
            daily.addEventListener('load', function() {
                document.querySelector('#gc_daily').innerText = JSON.parse(this.responseText).count.replace(/\s/g, "");
            })
            daily.open('GET', 'https://lazyjobseeker.goatcounter.com/counter/TOTAL.json?start=' + today.toISOString().slice(0, 10))
            daily.send()
            var total = new XMLHttpRequest();
            total.addEventListener('load', function() {
                document.querySelector('#gc_total').innerText = JSON.parse(this.responseText).count.replace(/\s/g, "");
            })
            total.open('GET', 'https://lazyjobseeker.goatcounter.com/counter/TOTAL.json')
            total.send()
        }
    })
</script>
```
{: file="_includes/head/custom.html"}

몇 가지 살펴볼 만한 내용만 요약하면:
- 소스 js 파일 `//gc.zgo.at/count.js`가 로드되기 전에 JSON 파일이 호출되는 것을 막기 위해 `setInterval`을 사용했습니다.  인터벌을 주지 않으면 간혹 새로고침을 할 때 카운터가 정상적으로 업데이트되지 않습니다.
- JSON 파일에 쿼리를 넘길 때 **오늘 하루**에 대해 쿼리하는 방법이 없습니다 (`?start=day`가 안 됨).  `Date()`와 `Date.UTC()`, `toISOString()`을 이용해 (시스템의 시간대를 고려한) 오늘 날짜를  `yyyy-mm-dd` 꼴로 만들어 넘겼습니다.
- 일일 방문자 수는 `gc_daily` ID를 갖는 요소를, 전체 방문자 수는 `gc_total` ID를 갖는 요소를 찾아 넣어 주도록 했습니다.  값이 정상적인 위치에 들어가도록 html 요소에서 실제로 이들 id를 갖는 요소를 만들어 주어야 합니다.  저는 Minimal Mistakes 테마의 **사이드바** 말단 부분에 이들 ID를 갖는 `<span>`요소들을 만들어 주었습니다.

마지막으로 `_includes/nav_list` 파일을 수정하여 `gc_daily`와 `gc_total`을 각각 ID로 갖는 `<span>` 요소들을 만들어 주었습니다.

```html
{% assign navigation = site.data.navigation[include.nav] %}
{% include multilang/get-lang-variables %}
<nav class="nav__list">
  {% if page.sidebar.title %}<h3 class="nav__title" style="padding-left: 0;">{{ page.sidebar.title }}</h3>{% endif %}
  <input id="ac-toc" name="accordion-toc" type="checkbox" />
  <label for="ac-toc">{{ site.data.ui-text[site.locale].menu_label | default: "Toggle Menu" }}</label>
  <ul class="nav__items">
    {% for nav in navigation %}
      <li>
        {% if nav.url %}
          <a href="{{ nav.url | prepend: prefix | relative_url }}"><span class="nav__sub-title">{{ nav.title }}</span></a>
        {% else %}
          <span class="nav__sub-title">{{ nav.title }}</span>
        {% endif %}

        {% if nav.children != null %}
        <ul>
          {% for child in nav.children %}
            <li><a href="{{ child.url | prepend: prefix | prepend: site.url }}"{% if child.url == page.url %} class="active"{% endif %}>{{ child.title }}</a></li>
          {% endfor %}
        </ul>
        {% endif %}
      </li>
    {% endfor %}
    <!-- 방문자 카운터 시작 -->
      <li>
        <span class="nav__sub-title"></span>
        <ul>
          <li><b>Today </b><span id="gc_daily"></span> | <b>Total </b><span id="gc_total"></span></li>
        <ul>
      </li>
    <!-- 방문자 카운터 종료 -->
  </ul>
</nav>
```