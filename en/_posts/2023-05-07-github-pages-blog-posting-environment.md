---
translated: true
title: "Tools for Blog Posting in Mobile Environment"
categories: Programming
tags:
  - devlog
created_at: 2023-05-07 11:17:13 +09:00
last_modified_at: 2024-04-05 15:14:19 +09:00
header:
  teaser: /assets/images/uncategorized-teaser-2.png
excerpt: "Applications I am using to maintain blogs in mobile environment"
---

## Post and Code Editor

### Markdown Editor - Obsidian

Obsidian is the greatest markdown editor.  It supports PC and mobile (smartphone and tablet) environment alike, and a third-party plugin (remotely save) is available if you want to maintain sync between different devices.

And preview feature basically supports $\LaTeX$ type rendering for mathematical and chemical equations.  Wrap your expression with `$` renders `in-line formula` and `$$` warpper renders `block formla`.

For example, `$z^2=\sqrt{x^2+y^2}$` is rendered like $z^2 = \sqrt{x^2+y^2}$ if you are in preview mode.  If you type `$$z^2=\sqrt{x^2+y^2}$$` output is as follows.

$$z^2 = \sqrt{x^2+y^2}$$

To input chemical equation, `\ce{}` can be used inside `$` or `$$` wrappers.  For example, if you input `$$\ce{2H2 + O2 -> 2H2O}$$`, renderer results:

$$\ce{2H2 + O2 -> 2H2O}$$

#### Recommended Plugins

##### Linter

Maybe one of the most useful plugin I think, especially in terms of maintaining github blog because of its `Lint On Save` feature with automated timestamping.

- **General Settings**
    - [x] Lint on Save: Automatically update some YAML front matter when document is saved or `Ctrl+S` shortcut is hit.
- **YAML Settings - YAML Timestamps**
    - [x] Keep track of the date the file was last editied in the YAML front matter.  Gets dates from file metadata.
    - [x] Date Created
    - [x] Force Date Created Key Value Retention
    - [x] Date Modified

##### Novel Word Count

This plugin allows you to see the number of words, last modified date, number of characters or so.

##### Remotely Save

Even though there is a paid service for storage sync between devices called **Obsidian Sync**, but you can resort to this community plugin.  This plugin allows you to use third-party cloud service like DropBox or Onedrive to be hurb storage where you can sync from different devices and therefore maintaining sync between mutliple devices.

I am using 1-minute setting for **Schedule for Auto Run** option, and activated **Run Once on Start Up Automatically**.

##### Periodic Notes

Obsidian serves **Daily Note** feature as default, allowing auto-generation of new markdown file with filename based on current date  Periodic notes extends this feature to be applicable for different interval like weekly or monthly basis.

##### Advanced Tables

Handling table is a tedius work in writing markdown file.  This plugin has convenient feature to handle table in markdown file.

##### Excalidraw

Being a drwaing tool basically, but is more geared to build mindmap linking different markdown files, pdfs and images.  Basic drawing style is kind of handdrawing from developers or scientists pondering on blackboard.

##### Obsidian Git

With such a wide variety of plugins it is natural to anticipate git-related features and it really is.  But unfortunately, this plugin Obsidian Git is not much successful in my envirionment.  I could live with merge conflict resolving feature unsupported, but in my tablet it was even impossible to clone remote repository itself.

```
Cloning progress: Compressing objects: 2610 of 2610
...
TypeError: Cannot read properties of null (reading 'slice')
```

Occassionally cloning went well but in such case pushing crashed continuously.  Now I gave up using this plugin but usign `Termux` terminal to install `Git` and `Ruby` to work on my blog using mobile devices.  Please refer to [this post](https://lazyjobseeker.github.io/en/posts/jekyll-based-github-blog-local-build-test-in-android-mobile-environment) if you are interested in.

Even though Obsidian Git did not work for me, it is not that flawed as Obsidian is basically powerful markdown handling tool and for other types of files like HTML, CSS, JS or so there are better options.

**Warning!** If you are to use Obsidian Git anyway, I highly recommend you to add
`**/.obsidian` in your `.gitignore` file.  Obsidian creates `.obsidian` hidden directory under the directory you choose to use obsidian storage (called **vault**), and all obsidian-related settings related to that vault is maintained there.  A problem is that if a remote repository you want to clone using Obsidian Git already contains this path, Obsidian asks you to remove all the plugins installed in current vault.  As *Obsidian Git is a obsidian plugin itself*, following this removes Obsidian Git also from your vault.  And after successful clone, you need to install Obsidian Git again.
{: .notice--info}

### Code Editor - ACode

Obsidian is a strong markdown editor but except for some types of files including markdown (`.md`), vanilla obsidian cannot edit such files.  So I am using different application **ACode** to edit HTML, CSS and JS files.  There are a bunch of code editors with similarly powerful, but I prefer ACode because it is one of a handful of options featuring file tree display.

## Git

### Termux

Even in mobile devices you can use Git, Ruby and Jekyll to maintain Jekyll-based static web page hosted by Github Pages.  Refer to [my different post](https://lazyjobseeker.github.io/en/posts/jekyll-based-github-blog-local-build-test-in-android-mobile-environment) for details.

### Spck Editor

If you want to have a standalone solution where you can use as file editor and git controller in mobile, **Spck Editor** offers a good option.  This was my favorite choice before I migrate to Obsidian + Termux Git environment.  You can clone from remote repository and this function is far stable than Obsidian Git.  And merge conflict resolving feature is also supported.  Less convenience in handling markdown (compared with Obsidian) is the only drawback you have to bear.