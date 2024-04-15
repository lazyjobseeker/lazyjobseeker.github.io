---
title: "How to Maintain Your Github Blog from Mobile Devices"
category: programming
tags:
  - jekyll
created_at: 2024-02-28 10:25:00 +09:00
last_modified_at: 2024-04-15 09:44:01 +09:00
excerpt: "How to use Git with Android mobile devices to maintain Jekyll-based static blog hosted by Github Pages."
---

If you have your own static blog hosted via Github Pages, which is built based on Jekyll, you can test your blog with your local PC by installing Ruby and Jekyll.  You can also maintain your repository if you install Git.  You can do all these things outside if you establish the same enviroment with your laptop.

But, how can we do the same thing with Android mobile devices - smartphones and tablets?  I have struggled to setup my static blog maintenance environment with my Android devices (Galaxy Note 10+ and Galaxy Tab 7 FE).  I finally made it and would like to share some tips to save your time.

## 1. Install F-Droid App Store and Termux

Firstly I installed `Termux` to use Linux terminal in mobile environemnt.  I had to download this from an open-source appstore `F-Droid`, rather than from Google Play Store.

- Install F-Droid ([Download Page](https://f-droid.org))
- Excute F-Droid and search for Termux.
- Install **Termux Terminal emulator with packages**

## 2. Setup Termux

Now you can excute Termux and see emulated Linux terminal on your mobile device.  First of all, ensure your Termux to have access to local storage of your device.

```bash
termux-setup-storage
```

## 3. Git

### 3.1. Install and Setup Git

You can install `Git` from your Termux terminal.

```bash
pkg install git
```

Then, you can set default git username and email address to be used in mobile device.

```bash
git config --global user.name 'John Doe'
git config --global user.email 'johndoe@example.com'
```

### 3.2. SSH Settings

There are two differenty ways to clone remote repository to your local mobile device.  You can provide https based repository address to clone it and in that case this step is not required.  But https-cloning will necessiate you to provide github username and password every time you push your changes to remote, which couldn't be ommitted or automated in my case.

You can evade from the tedius username/password inputs by following processes below and cloning your repository with ssh manner.

- Create SSH key for current mobile device ([Ref](https://www.lainyzine.com/ko/article/creating-ssh-key-for-github/))

  ```bash
  #install openssh
  pkg install openssh
  ssh-keygen -t ed25519 -C <e-mail address in use for repository to be cloned>
  cat ~/.ssh/id_ed25519.pub
  #copy cat output
  ```

- Configure `./ssh` setting
	- Open `./ssh/config` file or create it and include below
	
      ```
      Host github.com
        IdentityFile ~/.ssh/id_ed25519
        User git
        PreferredAuthentications publickey
        Hostname ssh.github.com
        Port 443
        TCPKeepAlive yes
        IdentitiesOnly yes
      ```
- Register SSH key to remote repository ([Ref](https://www.lainyzine.com/ko/article/creating-ssh-key-for-github/))
	- Move to github.com
	- Click user profile on upper right corner
	- Click **Settings** from dropdown menu
	- Click **SSH and GPG keys**
	- Click **New SSH Key**
	- Insert your desired `title` for the key and copy the whole content from `id_ed25519.pub` into the **Key** textbox
	- Click **Add SSH key** to complete
- Ensure you can connect to github with your key

   ```bash
   ~/.ssh $ ssh -T git@github.com
   The authenticity of host '[ssh.github.com]:443 ([20.200.245.248]:443)' cannot be established.
   ED25519 key fingerprint is SHA256:xxx.
   This key is not known by any other names.
   Are you sure you want to continue connecting (yes/no/[fingerprint])?
   ```

### 3.3. Clone Remote Repository

- Make new directory using `mkdir` command.
- Move to new directory using `cd` command.
- Clone remote repository using `git clone`.
	- If you didn't set ssh settings, use https address.
     ```bash
     mkdir ~/storage/shared/repos
     cd ~/storage/shared/repos
     git clone https://github.com/lazyjobseeker/lazyjobseeker.github.io.git
     ```
	- With ssh setting complete, use ssh address.
     ```bash
     mkdir ~/storage/shared/repos
     cd ~/storage/shared/repos
     git clone git@github.com:lazyjobseeker/lazyjobseeker.github.io.git
     ```

## 4. Install Ruby

Install Ruby by following command.

```bash
pkg install ruby
```

## 5. Run Local Jekyll Server for Test

We are almost there.  Move to your local storage where you cloned your remote reository, and run `bundle install`.  As I mentioned earlier, I did these settings with my blog using a Jekyll theme *Minimal Mistakes*.  Executing `bundle install` just after installing Ruby was fine for me because all other dependencies I needed were included as gemfile in the theme. 

With dependent gems all installed, I could run `bundle exec jekyll serve` to build and test my blog on my tablet and smartphone.

```bash
cd ~/storage/shared/repos/lazyjobseeker.github.io
bundle install
bundle exec jekyll serve
To use retry middleware with Faraday v2.0+, install `faraday-retry` gem
Configuration file: /storage/emulated/0/repos/lazyjobseeker.github.io/_config.yml
            Source: /storage/emulated/0/repos/lazyjobseeker.github.io
       Destination: /storage/emulated/0/repos/lazyjobseeker.github.io/_site
 Incremental build: disabled. Enable with --incremental
      Generating...
       Jekyll Feed: Generating feed for posts
                    done in 7.517 seconds.
 Auto-regeneration: enabled for '/storage/emulated/0/repos/lazyjobseeker.github.io'
    Server address: http://127.0.0.1:4000/
  Server running... press ctrl-c to stop.
```

## 6. Troubleshooting

You might have followed up here without no problem and succeeded running local server.  However, in my case there were some problems I had to solve.

### 6.1. Fail to Install *nokogiri*

`nokogiri` is a library for Ruby language for facilitating XML and HTML handling.  In running `bundle install` to get dependency gems, all other gems were good to go but I got error message that `nokogiri` couldn't be installed, preventing further progress.

There was a [**StackOverFlow Post**](https://stackoverflow.com/questions/71294580/nokogiri-1-13-3-gem-install-failure-termux) reading that installing some more packages worked.  Some other posts recommended to update packages.

Executing below commands worked for me to solve this problem.

```bash
# 패키지 업데이트 및 업그레이드
pkg update
pkg upgrade
# 패키지 추가 설치
pkg install pkg-config
pkg install binutils
pkg install gumbo-parser
pkg install libxslt
pkg install libxml2
pkg install build-essential --no-install-recommends
# gem 추가 설치
gem install pkg-config
```

After all above lines, I did not execute `bundle install`, but directly installed `nokogiri` gem with below command.

```bash
gem install nokogiri --platform=ruby -- --use-system-libraries
```

### 6.2. Permission Denied in Running Local Jekyll Server

When I first tried to run local server by `bundle exec jekyll serve` after installing all required gems including `nokogiri`, however again, another error popped.

```bash
bundle exec jekyll serve
To use retry middleware with Faraday v2.0+, install `faraday-retry` gem
Configuration file: /storage/emulated/0/repos/lazyjobseeker.github.io/_config.yml
            Source: /storage/emulated/0/repos/lazyjobseeker.github.io
       Destination: /storage/emulated/0/repos/lazyjobseeker.github.io/_site
 Incremental build: disabled. Enable with --incremental
      Generating...
       Jekyll Feed: Generating feed for posts
                    done in 7.442 seconds.
jekyll 3.9.5 | Error:  Permission denied @ rb_sysopen - /proc/version
/data/data/com.termux/files/usr/lib/ruby/gems/3.2.0/gems/jekyll-3.9.5/lib/jekyll/utils/platforms.rb:73:in `read': Permission denied @ rb_sysopen - /proc/version (Errno::EACCES)
```

Fortunately I found a [post](https://github.com/jekyll/jekyll/issues/7045) to handle this.  It read that some lines of Ruby source code for `Jekyll` should be manually altered.  The file requiring alteration was `/lib/jekyll/utils/platfroms.rb` and in detail, `proc_version` function had to be changed as follows.

```ruby
def proc_version
  @proc_version ||= begin
    Pathutil.new(
      "/proc/version"
    ).read
  rescue Errno::ENOENT, Errno::EACCES
    nil
  end
end
```

If you don't know where your Jekyll source code is located, you can check this.

```bash
bundle show jekyll
>>> /data/data/com.termux/files/usr/lib/ruby/gems/3.2.0/gems/jekyll-3.9.5
```

So, the file I targeted to change `proc_version` function was:

```
/data/data/com.termux/files/usr/lib/ruby/gems/3.2.0/gems/jekyll-3.9.5/lib/jekyll/utils/platforms.rb
```

This problem occurred both in my tablet and smartphone, and solved as outlined above alike.

## 7.1. (Optional) Set Local Repository as Obsidian Vault

I have been using **Spck Editor** and **Obsidian** to maintain my blog.  They are both strong apps but mutually exclusive than synergetic.  Spck Editor supports strong file editing and some git features (clone, push, pull), but less productive in markdown editing than Obsidian.  Obsidian is best markdown editor but its git features supported by `Obsidian Git` plugin is almost useless for me to use in Android mobile devices due to frequent freezing/crashing and unpredictable clone/push failures.  I have tried to use both by finding out local repository cloned using Spck Editor and setting it as Obsidian vault, but failed because repository cloned by Spck Editor resided in the app's internal storage where other apps like Obsidian couldn't reach.

But now with Termux and git, it became possible to use Obsidian as I could clone remote repository into shared storage of my mobile device.  My executing **Manage Vaults** -> **Open Folder as Vault** menu of Obsidian, now I can edit my markdown posts directly from Obsidian and push it from Termux emulator.

There are a few remarks when using Obsidian with Git.  First of all, you cannot change the name of vault from the original directory name, because the name of Obsidian vault is not to be used locally in Obsidian but direct mirror of original source.  Secondly, if you set your repository as Obsidian vault it is better to add `.obsidian` to your `.gitignore` file, because this hidden directory stores settings related to Obsidian and if it is tracked you will be annoyedly asked to commit Obsidian-related changes to your remote source. 