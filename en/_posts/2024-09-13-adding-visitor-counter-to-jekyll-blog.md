---
title: Adding Visitor Counter to Jekyll Blog
category: programming
tags:
  - jekyll
  - minimal-mistakes
created_at: 2024-09-13 10:05:32 +09:00
last_modified_at: 2024-09-20 10:17:08 +09:00
excerpt: How to add a custom visitor counter to your jekyll-based github blog using an open-source web analytics **GoatCounter**.
---
There is no simple way to add a visitor counter to your personal blog if you are hosting yours using a static web-site generator like `Jekyll`.  Fortunately, there is an open-source web analytics platform [GoatCounter](https://www.goatcounter.com/), developed and being maintained by [Martin Tournoij](https://github.com/arp242), which you can use to implement visitor counter display.

In this posting I would like to explain how I added a visitor counter to my github blog using GoatCounter.  My blog is based on a Jekyll theme **Minimal Mistakes**, for your information.  You can try to add your custom visitor counter as I did, or use a theme like [Chirpy](https://chirpy.cotes.page/) and [Satellite🛰️](https://byanko55.github.io/) which already implemented post-wise pageview counter using GoatCounter.

## Creating GoatCounter Account

First of all, you need to create your new GoatCounter account.  Visit the [website](https://www.goatcounter.com/) and click **☞ Sign Up** button.

![GoatCounter website](https://drive.google.com/thumbnail?id=10NuyfX_xlB4-toR5eIvm3P8aMqu4iugH&sz=w1000)

Complete your sigining-up by filling required fields up.

![Creating goatcounter account](https://drive.google.com/thumbnail?id=10QnxQIqmvw-MHiZQPcohRpOCmjwqSFeJ&sz=w1000)

After signing up and logging in, you can see the visitor statistics of your website.  In above case you need to access to `my-code.goatcounter.com` to log in.  Statistics dashboard is like below image, which you can see similar after enough visitor count data is built up.

![Site statistics by goatcounter](https://drive.google.com/thumbnail?id=10Ul28CEGJYXJw5vaU9-O28Z5WX6CBFCi&sz=w1000)

## Creating Visitor Counter

Now let's make our oun visitor counter feature.  [Official documentation](https://goatcounter.com/help/visitor-counter) is well maintained, where you can find there are two ways you can approach to implement visitor counter.  You can use a preset from the developer or directly access to JSON objects and use it to get visitor count numbers.

### Using Preset

First of all, you can decide to use preset visitor counter (see below image to see how it looks like).

![기본 방문자 카운터](https://drive.google.com/thumbnail?id=10ajeKN8SG_hrGqVw0YJL9HO4uEadwXoN&sz=w400)

 There are some options you can control.  For example, you can remove **stats by GoatCounter** text from above banner.  You can also give further style by adding custom CSS.  I believe that most of you would prefer to implement your own visitor counter blending better with your blogs/sites rather than using preset.  So I would like to skip the details of how to use this preset visitor counter.  Look through the official documentation if you are more likely to use this preset.
### Direct Access to Visitor Counts

You can make a direct access to the visitor count numbers of individual pages.  There are JSON files you can access.  For example, if your website domain is `https://my-code.github.io`, visitor count value of individual URLs are updated to below JSON file every 30 minutes:

```
https://my-code.goatcounter.com/counter/URL.json
```

Let me give you some example:

```
<!-- URL of target page -->
https://my-code.github.io/example

<!-- JSON file where visitor count is updated -->
https://my-code.goatcounter.com/counter//example.json
```

There are some special cases.  By 'special cases' I mean 1) visitor count for **home page (index.html)** and 2) visitor count for your **whole site (total visitors)**.

```
<!-- Home Page (index.html) -->
https://my-code.goatcounter.com/counter//.json

<!-- Total Visitors -->
https://my-code.goatcounter.com/counter/TOTAL.json
```

You can use `start`, `end` keywords to query visitor counts within specified range of dates.  Both keys accept date input in `yyyy-mm-dd` format.  Furthermore, you can also pass specific values like `week`, `month`, `year` to `start` key.

Below you can find some examples where you can get the JSON data where the total visitor counts (remind that the page name `TOTAL` is reserved for site-total visitor count number) are being queried with different span of time.  `TOTAL` can be replaced with any proper permalink of pages in your site to get the pageview of individual pages.
 
```
<!-- Total Visitor Count: Last week -->
https://my-code.goatcounter.com/counter/TOTAL.json?start=week

<!-- Total Visitor Count: Last month -->
https://my-code.goatcounter.com/counter/TOTAL.json?start=month

<!-- Total Visitor Count: Last year -->
https://my-code.goatcounter.com/counter/TOTAL.json?start=year

<!-- Total Visitor Count: Specific date range -->
https://my-code.goatcounter.com/counter/TOTAL.json?start=2024-03-01&end=2024-06-01
```
{: file="passing queries"}

When you access the JSON file by using the URLs above, there are two keys of `count` and `count_unique` whose values are both same.

```json
{
  "count": "2 771",
  "count_unique": "2 771"
}
```
{:file = "GoatCounter JSON Example"}

`count_uniuqe` is a legacy key and therefore only the `count` key is used.

### Apply to the Website

Now let's move on to the application of above JSON raw data to embody the visitor counter in our website.  As already mentioned, I created visitor counter for my blog built on the Jekyll theme **Minimal Mistakes**.

First of all, below code was added to my custom header file `custom.html`.

```html
<!-- Site Stat by GoatCounter -->
<script data-goatcounter="https://lazyjobseeker.goatcounter.com/count" async src="//gc.zgo.at/count.js"></script>
<script>
    var t = setInterval(function() {
        if (window.goatcounter && window.goatcounter.visit_count) {
            clearInterval(t)
            var today = new Date();
            var yesterday = new Date(today)
            yesterday.setDate(yesterday.getDate() - 1)
            var today_cnt = new XMLHttpRequest();
            today_cnt.addEventListener('load', function() {
                document.querySelector('#gc_today').innerText = JSON.parse(this.responseText).count.replace(/\s/g, "");
            })
            today_cnt.open('GET', 'https://lazyjobseeker.goatcounter.com/counter/TOTAL.json?start=' + today.toISOString().slice(0, 10))
            today_cnt.send()
            var yesterday_cnt = new XMLHttpRequest();
            yesterday_cnt.addEventListener('load', function() {
                document.querySelector('#gc_yesterday').innerText = JSON.parse(this.responseText).count.replace(/\s/g, "");
            })
            yesterday_cnt.open('GET', 'https://lazyjobseeker.goatcounter.com/counter/TOTAL.json?start=' + yesterday.toISOString().slice(0, 10) + '&end=' + today.toISOString().slice(0, 10))
            yesterday_cnt.send()
            var total_cnt = new XMLHttpRequest();
            total_cnt.addEventListener('load', function() {
                document.querySelector('#gc_total').innerText = JSON.parse(this.responseText).count.replace(/\s/g, "");
            })
            total_cnt.open('GET', 'https://lazyjobseeker.goatcounter.com/counter/TOTAL.json')
            total_cnt.send()
        }
    })
```
{: file="_includes/head/custom.html"}

Some remarks:
- `setInterval()` is used to prevent JSON file being called before the source js file `//gc.zgo.at/count.js` being loaded.  Visitor counter number is not properly updated when a page is refreshed, if we do not give some interval between the loading of `count.js` file and querying JSON data.
- There is no way to query daily visitor count but specific date needs to be passed (there is no query parameter for this like `?start=day`).  So `Date()` and `toISOString()` was used to create `yyyy-mm-dd` formatted current date.  But in this case the time zone is fixed to UTC so you need to do more measure to make this work with your website's preferred time zone.
- Today/yesterday visitor count and total visitor count were set to be replaced into the text element with predefined IDs - `gc_today`, `gc_yesterday` and `gc_total`.  So I had to add actual html elements which have these IDs.  In my case I added `<span>` elements with these IDs at the end of sidebar.
- `count` key from JSON files contain number string with thousands separators.  I used `replace` to remove them.

`_includes/nav_list` file was modified to have `<span>` elements having proper IDs:

```html
{% raw %}{% assign navigation = site.data.navigation[include.nav] %}
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
    <!-- Site Stat Powered by GoatCounter -->
      <li>
        <span class="nav__sub-title"></span>
        <ul>
          <li><span style="display:inline-block; width:50%; max-width:130px"><b>TODAY </b></span><span id="gc_today"></span></li>
          <li><span style="display:inline-block; width:50%; max-width:130px"><b>YESTERDAY </b></span><span id="gc_yesterday"></span></li>
          <li><span style="display:inline-block; width:50%; max-width:130px"><b>TOTAL </b></span><span id="gc_total"></span></li>
        <ul>
      </li>
  </ul>
</nav>{% endraw %}
```
{: file="_includes/nav_list"}