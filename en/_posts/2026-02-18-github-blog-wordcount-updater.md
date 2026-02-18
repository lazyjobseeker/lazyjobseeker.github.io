---
title: Adding Total Wordcount Tracker in a Github Blog
category: programming
tags:
  - github-blog
  - devlog
  - jekyll
created_at: 2026-02-18 04:07:03 -05:00
last_modified_at: 2026-02-18 05:04:59 -05:00
excerpt: Adding a chart widget to the GitHub blog that tracks the total word count of all blog posts, and integrating it with GitHub Actions workflow so that daily commits and pushes are automatically made to update the data.
published: true
---

The last time I posted on this blog was on **July 8, 2025**. Lately, I’ve found it hard to get motivated to write blog posts, so I decided to spend some time setting up a widget that scans all posts day by day and tracks the total word count. The idea is that, by keeping an eye on it - like tending a GitHub contributions graph - it might give me a bit of motivation.

These days, AI coding has become so convenient that writing out the exact structure of the code doesn’t feel all that meaningful. If I have more time later, I might update the detailed code, but for now, it’s enough to just note which libraries and tasks were needed, what I had to look into closely, and where I got stuck.

## Backend: GitHub Actions + Python

Calling this a “backend” might be a bit grandiose, but it is a backend work anyway I guess. The goal is to create a Python script that goes through all posts in a specific folder, counts the number of words, and saves the total by date. The script’s output is a JSON file with entries like `"yyyy-mm-dd": number`, and new data for the current date gets added automatically. As long as you know that GitHub Actions can run a Python script on a daily schedule in the cloud, even a one-year-old daughter of mine could handle this task.

I wrote all the necessary code with ChatGPT (no need for a paid plan with extra performance). There were a few parts that gave me a little trouble - the kind of things that make you think, “It’d be a little awkward to ask generative AI to write code for this without knowing it myself” - so here’s a quick summary:

- GitHub Actions workflows can run specific Python code in a cloud environment.
- To schedule Python code to run periodically on GitHub Actions, you create a `yaml` file in the repository’s `.github/workflows` folder.
    - Adding `workflow_dispatch` lets you trigger the workflow manually from the GitHub Actions page.
- Since this blog has separate posts for [ **Korean and English** ](https://lazyjobseeker.github.io/en/posts/github-blog-multiple-language-support-with-jekyll-theme-minimal-mistakes/), I created two separate JSON files, one for each language.
- Word counts are handled using regular expressions from the `re` module.
- An empty JSON file can’t be truly empty; it needs at least a pair of braces `{}`. Otherwise, it will fail to load.

## Frontend: Chart.js

I reused the chart setup I made for the [visitor counter](https://lazyjobseeker.github.io/en/posts/adding-visitor-counter-to-jekyll-blog/). You need JavaScript code that draws the chart and feeds data into a DOM element with a specific `id`.

- When parsing `yyyy-mm-dd` strings into `new Date()` objects, the dates are interpreted in UTC, which needed to be adjusted to the system’s local time for consistency. The visitor counter uses UTC dates, which caused some inconsistencies. I solved it by extracting the month and day via `.getUTCMonth()` and `.getUTCDate()`, converting them to strings, and using them as the axis labels.