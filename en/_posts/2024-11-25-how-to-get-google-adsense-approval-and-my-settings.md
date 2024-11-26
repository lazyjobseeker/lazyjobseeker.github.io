---
title: Getting Approved for Google AdSense and Useful Settings
category: devlog
tags:
  - google-adsense
created_at: 2024-11-25 05:26:56 -05:00
last_modified_at: 2024-11-26 02:28:12 -05:00
excerpt: Efforts I have made to get my blog approved for Google Adsense and some settings I found useful.
published: true
---

There might be many reasons for running a personal blog, but nobody would say they have never considered **monetization** through your blog.  It cannot be better to write about something you love and draw some money from it 🤑.

I happend to open my blog, and have uploaded posts till now.  I have had an obscure sense of making money from this blog, only vaguely knowing that I can apply for **Google Adsense** to show ads on my website.  On the internet there are many different stories; some boast that it was super easy for them and ChatGPT-generated posts were enough to get approval.  Others complain that they have been unsuccessful even after months of painstaking effort to post quality writings with unique contents. 

In my case it took total seven tries to receive acceptance notice from Google Adsense team.  In six unsuccessful tries I was just answered that the contents of my blog were of **low-value**.  Things were even worse on my sixth failed application, as the Adsense team gave me about 3-months of pending period before I could submit my review request again.  I didn't expect even a penny with Adsense then but being rejected like that was depressing😥.

After sixth rejection I made a turn in my strategy.  I decided to improve my posts to meet some criteria I set before I try once again🏋️‍♂️.

## What I Did to Improve My Posts 

### Meet Minimum Post Length

You can see tons of discussions on how long a post should be to ensure the contents as sufficiently **valuable**.  Some say 500-600 words is decent, while others say at 1000-2000 words or more is desirable.  As a Korean, it was even more difficult becuase the number of words based estimates foreign bloggers present are usually for the English contents.

Fortunately I have written my blog posts in two languages - Korean and English (you might want to visit [**different post**]({{ site.baseurl }}/en/posts/github-blog-multiple-language-support-with-jekyll-theme-minimal-mistakes/) to refer to how I did multilingual setup).  I checked the number of words in my blog posts just after I received the approval letter from Google Adsense and it looked like this:

- There were total **27 posts** (Korean/English subversions are there for each post, so total 54 markdown files were there).
- **Korean** posts had **2,333** words in average
	- The shortest post had **845** words
	- The longest post had **4,211** words
- **English** posts had **1,315** words in average
	- The shortest post had **1,315** words
	- The longest post had **1,001** words

You can see that the length of English version is far shorter than that of Korean version (English versions are **56%** long than Korean ones).  Firstly I targeted to write posts of **1,000 words or longer in Korean**, but soon found that the English-translated versions were too short.  So I pivoted and set a new goal to write post of **1,000 words or longer in English**.  Writing Korean version was far easier when I had sufficiently long English version.

In this process **Obsidian** was quite useful.  `Novel Word Count` plugin allowed me to check the pure length of contents - except for the surplus such as YAML front matter, comments or so -.

{% include img-gdrive alt="Obsidian's Novel Word Count plugin" id="1pU8lWAgKxxq1cB4rp0V9MpK43JZ98iUV" %}

{% include img-gdrive alt="Novel Word Count plugin options" id="1-1UaV85lx-g1oMJMA5n129zClpg5YPo0" %}

### Adding ALT Tags to Images

Another 

6번의 애드센스 승인 고배 이후 시작한 다른 노력은 반드시 포스팅에 하나 이상의, **대체 텍스트(ALT 태그)**를 갖는 이미지를 삽입하는 것이었습니다.  단순히 이미지만 넣는 것이 아니라, 크롤러나 봇이 검색 가능한 텍스트를 포함해야 한다는 점이 중요합니다.  ALT 태그와 관련해서는 이미 온라인들에 많은 글들이 있어 이 정도로만 정리하겠습니다.

## Customizing Adsense Ads

애드센스 승인을 받은 뒤에는 **광고 커스터마이징**을 했습니다.  구글이 제공하는 자동 광고 삽입 기능을 이용해 광고를 넣을 수도 있지만, 구조가 정형화되지 않은 개인 블로그에서는 블로그 레이아웃을 손상시키는 보기 싫은 광고가 들어가는 경우가 생길 수 있습니다.  수익화가 가능한 광고를 게재하는 것도 중요하지만, 광고가 포스트들의 가독성을 지나치게 해치지 않도록 하는 것이 중요합니다.

제가 시행착오를 거치면서 적용한 몇 가지 설정들을 정리해 보겠습니다✏️.

### Inserting Manual Ads

I made two unit ads - one **inarticle** and one **multiflex**.  I arranged them at the end of the regular posts.  Same thing could be done inside individual post content but it seemed tedius that I have to manually add the advertisement code.  I added two manual ads to two pre-allocated spots on my blog and moved on to automated ads.

### Inserting Automated Ads

- Among **in-page format**, I only enabled **banner ads**.
- I did not enable any **overlay format**, considering the discussion in online that this kind of ads destroy your webpage layout and slow the page loading. 

### CSS Setting

Once you allow automated ads on your Adsense blog, automated ads are implemented inside the `<div>` elements holding `google-auto-placed` and `ap_container` classes.  An issue is that this Adsense-inherited `<div>` elements have a forced-attribute of `clear: both`, which sometimes wrecked my blog's layout.  For example, in some posts it added a large void region between main paragraphs and inserted ads.

To solve this I first tried overriding `clear` attribute to have `none` value, which did not work well.  After some trial and error, I found that I can add `display: inline-block` attribute to those `<div>` elements as follows:


```css
/*
  Adsense elements in pages
  ========================================================================== */

div {
  &.google-auto-placed {
    &.ap_container {
      display: inline-block !important;
    }
  }
}
```
{: file="_adsense.scss"}

## Thoughts

It was stressful to get rejections, but I now know that repeated rejections do not doom your blog to be improper for loading Google Adsense ads.  Setting mesurable goals and keep up with it can lead you to the goal of having your blog approved.  Now I aim to increase the profit from ads by experimenting optimal ads layouts and steadily adding new quality posts🤗.