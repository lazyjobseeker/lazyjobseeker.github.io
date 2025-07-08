---
revision: 2
title: Build Test in Local for a Jekyll Website
category: programming
tags:
  - jekyll
  - python
  - minimal-mistakes
created_at: 2024-12-02 05:21:48 -05:00
last_modified_at: 2025-07-08 04:40:09 -05:00
excerpt: How to preview Jekyll blog in local environment and some history of related trouble-shooting
---

## How to Preview Jekyll Blog in Local

If you are using `github pages` to host your webpage statically built with `Jekyll`, and you are checking the result of your changes by directly pushing the changes to remote repository, don't do that.  You can install `Ruby` in your local PC and run local server to pre-render all the changes you make before pushing to your repository.

### Install Ruby on Your Local PC

Install `Ruby` on your PC ([**Install Ruby**](https://rubyinstaller.org/downloads/)).

### Run Jekyll Local Server

Open comand prompt and run `bundle exec jekyll serve`.

```
D:\repositories\lazyjobseeker.github.io>bundle exec jekyll serve
```

You might face error message that the command couldn't be run due to the inexistance of specific `gem` file.  Execute `bundle install` as the error message must recommend that.  It will check from the `gemfile` all the dependencies and install required gems.  `gem` corresponds to plugin in Ruby.

```
D:\repositories\lazyjobseeker.github.io>bundle exec jekyll serve
bundler: command not found: jekyll
Install missing gem executables with `bundle install`

D:\repositories\lazyjobseeker.github.io>bundle install
Fetching gem metadata from https://rubygems.org/...........
Resolving dependencies...
Using ruby2_keywords 0.0.5
Using json 2.6.3
Fetching base64 0.2.0
Fetching bigdecimal 3.1.4
Fetching connection_pool 2.4.1
Fetching concurrent-ruby 1.2.2
Fetching minitest 5.20.0
Fetching mutex_m 0.2.0
Fetching public_suffix 4.0.7
Fetching racc 1.7.3
...
```

If succeeded you can preview your webpage from localhost address http://127.0.0.1:4000.  As long as your change is for `_config.yml` configuration file, any changes to source codes and posts will be reflected real-time by Jekyll's regenerating changed pages.  Enter `Ctrl+C` to abort current session and rerun `bundle exec jekyll serve` again to retrigger your local server if you want to check changes made by modifying `_config.yml`.

When you are happy with rendered changes, push your changes to remote repository.  Your repository will not suffer any more from meaningless commits to simply check how the rendering changes.

```
D:\repositories\lazyjobseeker.github.io>bundle exec jekyll serve
To use retry middleware with Faraday v2.0+, install `faraday-retry` gem
Configuration file: D:/repositories/lazyjobseeker.github.io/_config.yml
            Source: D:/repositories/lazyjobseeker.github.io
       Destination: D:/repositories/lazyjobseeker.github.io/_site
 Incremental build: disabled. Enable with --incremental
      Generating...
       Jekyll Feed: Generating feed for posts
                    done in 4.585 seconds.
 Auto-regeneration: enabled for 'D:/repositories/lazyjobseeker.github.io'
    Server address: http://127.0.0.1:4000
  Server running... press ctrl-c to stop.
      Regenerating: 1 file(s) changed at 2023-11-25 13:55:32
                    _sass/minimal-mistakes/_archive.scss
       Jekyll Feed: Generating feed for posts
                    ...done in 4.4795336 seconds.

      Regenerating: 1 file(s) changed at 2023-11-25 13:55:56
                    _sass/minimal-mistakes/_archive.scss
       Jekyll Feed: Generating feed for posts
                    ...done in 4.4363946 seconds.
```

### Options for Jekyll Commands

There are some options you can use in testing your `jekyll` website.

`build`: You can only build your static web pages but not serve them in your localhost address.  `_site` directory builds only if you use this command.

```
bundle exec jekyll serve
```

`serve --drafts`: This option makes your draft posts stored in `_drafts` directory visible.  You can test how your drafts will look like using this command.

```
bundle exec jekyll serve --drafts
```

`serve --incremental`: Rather than build the whole site whenever changes made to your source file, if this option is used, rebuild occurs only when a post or page is subject to change on its source, boosting the regeneration speed.

```
bundle exec jekyll serve --incremental
```

`serve --livereload`: Automatically refreshes localhost webpage when rebuild occurs.  If your local environment is sufficiently fast, you can experience almost live-preview of your page while you are editing the resource in text editor.

```
bundle exec jekyll serve --livereload
```

In using `livereload` option main bonus is you can almost immediately check how your change affects in page rendering.  So combining it with `incremental` option is desired to boost the build speed.  Thus I frequently use below option.

```
bundle exec jekyll serve --draft --incremental --livereload
```

Below is my editing environment in tablet, where I write using Obsidian and preview how it renders on livereloading localhost server.

{% include img-gdrive alt="Jekyll Livereload" id="1NctSyHV_o98tTUZQWyZKc2TSV32Co9E3" %}

`--future`: `jekyll` does not build a post if the date designation in filename is a future date from current system date.  This option enables such posts to be rendered.

You can include future-dated posts in your `_post` folder if you have completed posts but want to publish them after some designated date.  But if you are hosting using `Github Pages`, you need to send a commit to trigger page build.  If you do not have proper commits to make you can [**send empty commit**](https://freecodecamp.org/news/how-to-push-an-empty-commit-with-git/).

```
git commit --allow-empty -m "Commit Message"
git push origin master
```

Sometimes you might just want to build your static site outputs but not to serve your hompage.  In such case you can use `bundle exec jekyll build`.  The `_site` folder in your jekyll project root, where your static site outputs (html pages) are included, will regenerate if you use this command.  But your local server will not be served in this case.

### Connect to Local Jekyll Site from Other Device

If you are running your Jekyll static site on a device (PC or Mobile), you access to your locally-serving website from different device.

To do this, you firstly need to serve your Jekyll page with `--host` option:

```bash
bundle exec jekyll serve --host 0.0.0.0
```

Then you need to check the IP of the device on which your Jekyll website is locally being served.  For example, suppose my local device was tablet and its IP was `192.168.000.000`.

I can access to my Jekyll page being served by the tablet using below address:

```bash
192.168.000.000:4000
```

To access a Jekyll page from the device different from that is running as server, both devices should share a network.  For example, both devices have to use same Wi-Fi.  It also works if one of the devices is providing mobile hot-spot and the other is connected to it.

In above example I passed `0.0.0.0` after `--host` argument.  This could make the hyperlinks to home page to be `0.0.0.0` rather than `192.168.000.000`.  To prevent this discrepancy breaks your links to home page, you can simply do:

```bash
bundle exec jekyll serve --host 192.168.0.0
```

When you trigger the `jekyll serve` command.

Other options also work well with `--host`.  So, you can use incremental and livereload options together.

```
bundle exec jekyll serve --host 192.168.0.0 --incremental --livereload
```

Using above command, for example, you can make your tablet to serve your website as local server and see how it looks from your smartphone.  If you have markdown editor and edit any content of a page, you can see your changes live-update on your smartphone.

## Troubleshootings

### Installation of `wdm`

**Minimal Mistake**'s `gemfile` specifies its use of `wdm` gem.  You don't need to keep this as it does not apparently affect building your site on `github pages`.  I had problem in installing version `0.1.x` of `wdm` due to SSL issue and some unidentified error even after trying http rubygem repo to mitigate SSL check.  I am now using 0.2.0 version of `wdm` with no qualms.

## References
1. [https://tyami.github.io](https://tyami.github.io/blog/jekyll-local-server-start-batch/#%EB%A1%9C%EC%BB%AC-%EC%84%9C%EB%B2%84-%EC%97%85%EB%8D%B0%EC%9D%B4%ED%8A%B8-%EC%97%90%EB%9F%AC)
2. [https://ehdtnn.tistory.com/763](https://ehdtnn.tistory.com/763)
3. [https://2sehi.github.io](https://2sehi.github.io/blog/56_Github-Blog/)