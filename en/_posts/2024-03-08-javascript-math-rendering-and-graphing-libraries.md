---
translated: true
title: "Embedding Equations and Graphs in Jekyll Blog"
category: Programming
tags:
  - "Minimal Mistakes"
  - Jekyll
  - "Github Blog"
  - Javascript
  - Katex
  - JSXGraph
created_at: 2024-03-08 11:13:00 +09:00
last_modified_at: 2024-04-05 16:05:56 +09:00
header:
  teaser: /assets/images/uncategorized-teaser-8.png
excerpt: "Application of JavaScript libraries to enable mathematical equation rendering (Katex) and graphing (JSXGraph)."
---

I am running my blog based on classic Jekyll theme *Minimal Mistakes*.  I have been using Katex and JSXGraph for mathematical equation rendering and graphing. 

## 1. Rendering Math Equations - Katex

Before **Katex** I have been using **MathJax** for mathematical equation rendering.  But I recently migrated to Katex, because MathJax did not support some chemical equation features, and alledgedly it is faster than MathJax.  Now, how could I have been able to apply these to this blog?

### 1.1. Usign Katex - Basic

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

### 1.2. Adjust Delimiter Setting and Enable Chemical Equation Rendering

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

## 2. Plotting with JSXGraph

And I am using **JSXGraph** library to plot static/interactive mathematical graphs in this blog.

### 2.1. Importing JSXGraph

You can simply add below script under `<head>` region of your page to enable JSXGraph.  With this, some JavaScript scripting is sufficient for you to add function graphs and geometries even with user interaction feature.

```html
<!-- To enable JSX mathematical plotting -->
<link href="https://cdn.jsdelivr.net/npm/jsxgraph/distrib/jsxgraph.css" rel="stylesheet" type="text/css" />
<script src="https://cdn.jsdelivr.net/npm/jsxgraph/distrib/jsxgraphcore.js" type="text/javascript" charset="UTF-8"></script>
<script src="/assets/js/custom-math-functions.js"></script>
```

### 2.2. Reference Web Pages for JSXGraph

- [Library Official Page](https://jsxgraph.uni-bayreuth.de/wp/index.html)
- [JSXGraph Book](https://ipesek.github.io/jsxgraphbook/)