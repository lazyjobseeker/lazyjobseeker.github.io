---
title: Getting Approved for Google AdSense and Useful Settings
category: programming
tags:
  - google-adsense
created_at: 2024-11-25 05:26:56 -05:00
last_modified_at: 2025-07-03 11:05:32 -05:00
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

One of other efforts I started after failed six times to get approval is to add at least one or more images having **Image Alt Text**.  Adding alt text is known to improve the visibility of your post by providing text-level anchors which crawlers or bots can refer to.  There are already many posts worth to read so I would like give no more emphasis on this.

## Customizing Adsense Ads

After approved, **customizing ads** was the next thing.  Google provides automated ad exposure feature, but in my case sometimes the automated insertion broke my blog layout.  It is important to monetize, but you need to be aware of how intact your contents can be maintained throughout the process.  Below I listed some trial-and-errors I had taken✏️.

### Inserting Manual Ads

I made two unit ads - one **inarticle** and one **multiflex**.  I arranged them at the end of the regular posts.  Same thing could be done inside individual post content but it seemed tedius that I have to manually add the advertisement code.  I added two manual ads to two pre-allocated spots on my blog and moved on to automated ads.

### Inserting Automated Ads

- Among **in-page format**, I only enabled **banner ads**.
- I did not enable any **overlay format**, considering the discussion in online that this kind of ads destroy your webpage layout and slow the page loading. 

### CSS Setting

#### Overriding `clear` Attribute of Injected Ads (Failed)

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

This seemed to work sometimes but was not reliable.  Some pages were still rendered with unwanted margins on the top of the injected ad elements, ruining the overall page's layout.

#### Overriding `clear` Attribute of Injected Ads (Succeeded)

As the process of Google AdSense's ads injection is dynamic and it is reasonable to assume that the process kicks in after the target html page is fully rendered, it is highly likely that the previous attempt using `.scss` ends up being useless in overriding the ads' style.  `.scss` can only do their work during a page's rendering process.

The workaround I recently came across is to use `MutationObserver`.  By letting an instance of this object oversee the alteration of the rendered page by Google AdSense to add elements with `google-auto-placed` or `adsbygoogle` classes, I could trigger my custom js lines work to modify their `clear` attribute from `both` to `none` **after** they are injected (03-07-2025).

```javascript
const observer = new MutationObserver((mutationsList) => {
  for (const mutation of mutationsList) {
    if (mutation.type === 'childList') {
      mutation.addedNodes.forEach((node) => {
        if (
          node.nodeType === 1 && // ELEMENT_NODE
          (node.classList.contains('google-auto-placed') || node.classList.contains('adsbygoogle'))
        ) {
          // ✅ Your logic to run after ad is inserted
          console.log('Ad inserted:', node);
          node.style.clear = 'none'; // Example: remove AdSense float-clear style
        }
      });
    }
  }
});

// Start observing the whole document
observer.observe(document.body, {
  childList: true,
  subtree: true
});
```
{: file="asset/js/adsensestyler.js"}

## Thoughts

It was stressful to get rejections, but I now know that repeated rejections do not doom your blog to be improper for loading Google Adsense ads.  Setting mesurable goals and keep up with it can lead you to the goal of having your blog approved.  Now I aim to increase the profit from ads by experimenting optimal ads layouts and steadily adding new quality posts🤗.