---
title: Tips for Setting Jekyll Github Blog
category: programming
tags:
  - jekyll
  - minimal-mistakes
redirect_from:
  - /en/redirect-me/
created_at: 2024-04-29 20:21:22 +09:00
last_modified_at: 2024-04-29 20:54:53 +09:00
excerpt: Tips for setting your Jekyll blog.
---

Here I summarized my tips of running `Jekyll`-based static blogs hosted by `github pages`.  Give it a look and wish you can find some tips applicable to yours!

## Image Hosting via Google Drive

If you are using `github pages` as hosting service for your blog, your repository cannot exceed 1 GB in size.  If you have 100 kB size for an image, 10,000 images will be enough to use up available repository size.  Things will be more devastating if you are writing posts with high-quality images.

You can mitigate this using `Google Drive`.  Let me show you how it does work.

First of all, add an image file to your Google Drive account and get image link from it.  One of mine looks like below.

```
https://drive.google.com/file/d/1lRde51cNGYFmbS4p__7j9y0XKId2w0qR/view?usp=drive_link
```

Here you can find `id` of this image, string in between `/d/`와 `/view?`.  You can paste this `id` into below format to use this image in markdown-formatted post.

```markdown
![Alt Description](https://drive.google.com/thumbnail?id=ID&sz=w1000)
```

You can replace `ID` with the long string you get.

```markdown
![Miniature Tractor](https://drive.google.com/thumbnail?id=1lRde51cNGYFmbS4p__7j9y0XKId2w0qR&sz=w1000)
```

![Miniature Tractor](https://drive.google.com/thumbnail?id=1lRde51cNGYFmbS4p__7j9y0XKId2w0qR&sz=w1000)

You can save your repository space this way.  Another good thing is the unique `id` value above is not affected when you rename your image file.  So you can rename your image from your Google Drive whenever you want.  But if you want to replace existing image with new one (new file), `id` is changed so you need to modify the `id` value although you name your new file same with older one.  This feature might be a downside.

Another thing to keep in mind is that above URL format to link to your Google Drive image is not fixed and perpetual, but depends on Google's policy.  You can see many blog posts having broken link to image, as they were written with older URL format and not adjusted to newer form.  So even though I am using the URL format as I wrote above, this format can be changed sometime to make my image links all broken.

If there comes another change in URL format for posting Google Drive images, it would be tedius to revisit all my posts and modify image URLs to newer format.  So I prepared a reusable form below `_include` folder.  I also added some css features like center-alignment and hyperlink to original-sized image.

```liquid
{% raw %}{% capture imgpth %}{{ include.id | prepend: "https://drive.google.com/thumbnail?id=" | append: "&sz=w1000" }}{% endcapture %}
[![{{ include.alt }}]({{ imgpth }}){: width="800" .align-center .shadow}]({{ imgpth }}){% endraw %}
```
{: file="img-gdrive"}

This file can be called in markdown file.  When calling it, I pass alt description for image and file `id` as additional arguments.

```liquid
{% include img-gdrive alt="Miniature Tractor" id="1lRde51cNGYFmbS4p__7j9y0XKId2w0qR" %}
```

{% include img-gdrive alt="Miniature Tractor" id="1lRde51cNGYFmbS4p__7j9y0XKId2w0qR" %}

## Setting Redirections

Recently I have updated permalink structure of posts for my blog, during implementation of [multilingual support](https://lazyjobseeker.github.io/en/posts/github-blog-multiple-language-support-with-jekyll-theme-minimal-mistakes).

As my previous pages had been already indexed by Google Search Engine with old URLs, those old URLs would have suffer from `404 not found` error unless I took some measures to give redirections from old URLs to new ones.

Fortunately, there is a `Jekyll` plugin named `jekyll-redirect-from`.

### Applying Plugin

To use `jekyll-redirect-from` plugin, you can simply add it in your `_config.yml` file.

```yaml
# Plugins (previously gems:)
plugins:
  - jekyll-sitemap
  - jekyll-gist
  - jekyll-feed
  - jekyll-include-cache
  - jekyll-paginate
  - jekyll-redirect-from

# mimic GitHub Pages with --safe
whitelist:
  - jekyll-sitemap
  - jekyll-gist
  - jekyll-feed
  - jekyll-include-cache
  - jekyll-paginate
  - jekyll-redirect-from
```
{: file='_config.yml'}

### Front Matter Setting in Posts

Now you can set your old URL as `redirect_from` value in front matter section of your new page.  Front matter of this page includes below lines:

```yaml
redirect_from:
  - /redirect-me/
```

There is no rendered page for `https://lazyjobseeker.github.io/en/redirect-me/`, but it redirects to this page.  Try checking how this works by inserting above address in search bar or hitting this link [링크](https://lazyjobseeker.github.io/en/redirect-me/).

## Rendering Math Equations and Graphs

I am running my blog based on classic Jekyll theme *Minimal Mistakes*.  I have been using Katex and JSXGraph for mathematical equation rendering and graphing. 

### Rendering Math Equations - Katex

Before **Katex** I have been using **MathJax** for mathematical equation rendering.  But I recently migrated to Katex, because MathJax did not support some chemical equation features, and alledgedly it is faster than MathJax.  Now, how could I have been able to apply these to this blog?

#### Usign Katex - Basic

[Official Katex website](https://katex.org/docs/browser) recommends to apply Katex to someone's homepage by adding below code on the `head` of html file.

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.css" integrity="sha384-n8MVd4RsNIU0tAv4ct0nTaAbDJwPJzDEaqSD1odI+WdtXRGWt2kTvGFasHpSy3SV" crossorigin="anonymous">
<!-- The loading of KaTeX is deferred to speed up page rendering -->
<script defer src="https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.js" integrity="sha384-XjKyOOlGwcjNTAIQHIpgOno0Hl1YQqzUOEleOLALmuqehneUG+vnGctmUb0ZY0l8" crossorigin="anonymous"></script>
<!-- To automatically render math in text elements, include the auto-render extension: -->
<script defer src="https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/contrib/auto-render.min.js" integrity="sha384-+VBxd3r6XgURycqtZ117nYw44OOcIax56Z4dCRWbxyPt0Koah1uHoK0o4+/RRE05" crossorigin="anonymous" onload="renderMathInElement(document.body);"></script>
```

After application, **single-line equations** can be rendered by wrapping your equation with `\\[` and `\\]`.  For example, if you input is as follows,

```bash
\\[ x^2 + y^2 = 1 \\]
```

rendered result shows like this:

$$ x^2 + y^2 = 1 $$

You can render **in-line** equations by wrapping your expressions with `\[` and `\]`: `\[ x^2 + y^2 = 1 \]` outputs $x^2 + y^2 = 1$.

#### Adjust Delimiter Setting and Enable Chemical Equation Rendering

With basic settings above, I applied two adjustments for convenience.

- Modified delimiter setting to use dollar sign (&#36;) as entry point for equation rendering.
- Added `mchem` library to render chemical equations.

These modifications are all lined up with my use of **Obsidian** as main markdown editor.  Obsidian supports rendered preview of mathematical and chemical equations, but you should give dollar signs to wrap your expressions to be rendered.

Therefore, final code I applied below my `<head>` tag looked like this:

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.css" integrity="sha384-n8MVd4RsNIU0tAv4ct0nTaAbDJwPJzDEaqSD1odI+WdtXRGWt2kTvGFasHpSy3SV" crossorigin="anonymous">

<!-- The loading of KaTeX is deferred to speed up page rendering -->
<script defer src="https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.js" integrity="sha384-XjKyOOlGwcjNTAIQHIpgOno0Hl1YQqzUOEleOLALmuqehneUG+vnGctmUb0ZY0l8" crossorigin="anonymous"></script>

<!-- mhchem for chemical equations -->
<script defer src="https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/contrib/mhchem.min.js" integrity="sha384-ifpG+NlgMq0kvOSGqGQxW1mJKpjjMDmZdpKGq3tbvD3WPhyshCEEYClriK/wRVU0"  crossorigin="anonymous"></script>

<!-- To automatically render math in text elements, include the auto-render extension: -->
<script defer src="https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/contrib/auto-render.min.js" integrity="sha384-+VBxd3r6XgURycqtZ117nYw44OOcIax56Z4dCRWbxyPt0Koah1uHoK0o4+/RRE05" crossorigin="anonymous" onload="renderMathInElement(document.body, {delimiters: [{left: '$$', right: '$$', display: true}, {left: '\\[', right: '\\]', display: true}, {left: '$', right: '$', display: false}, {left: '\\(', right: '\\)', display: false}]});"></script>
```

For rendering chemical equations, you can use `\ce{}` at any point of your expression inside the dollar-sign wrappers.  First of all, single-line chemical equation can be given as follows:

```html
$$\ce{H2O -> H2 + 1/2O2}$$
```

Above expression looks like below when rendered.

$$\ce{H2O -> H2 + 1/2O2}$$

You can do the same manner to render in-line chemical equation.  For example, rendered output of `$\ce{H2O -> H2 + 1/2O2}$` looks like $\ce{H2O -> H2 + 1/2O2}$ if your expression wrappers are single dollar signs.

### Plotting with JSXGraph

And I am using **JSXGraph** library to plot static/interactive mathematical graphs in this blog.

#### Importing JSXGraph

You can simply add below script under `<head>` region of your page to enable JSXGraph.  With this, some JavaScript scripting is sufficient for you to add function graphs and geometries even with user interaction feature.

```html
<!-- To enable JSX mathematical plotting -->
<link href="https://cdn.jsdelivr.net/npm/jsxgraph/distrib/jsxgraph.css" rel="stylesheet" type="text/css" />
<script src="https://cdn.jsdelivr.net/npm/jsxgraph/distrib/jsxgraphcore.js" type="text/javascript" charset="UTF-8"></script>
<script src="/assets/js/custom-math-functions.js"></script>
```

#### Reference Web Pages for JSXGraph

- [Library Official Page](https://jsxgraph.uni-bayreuth.de/wp/index.html)
- [JSXGraph Book](https://ipesek.github.io/jsxgraphbook/)

