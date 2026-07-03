---
title:
  ko: "아이폰에서 깃허브 레포지토리와 옵시디언 불트 연동 (iSH + Obsidian)"
  en: "Syncing Obsidian Vault with Github Repo in Iphone (iSH + Obsidian)"
tags:
  - blog
created_at: 2026-07-02 11:06:06 -05:00
last_modified_at: 2026-07-03 09:45:34 -05:00
---

<!-- lang:ko -->
`iSH`와 `Obsidian`을 이용해 iPhone 모바일 환경에서도 옵시디언을 이용한 포스팅이 가능하다. 중요한 것은 `mount -t ios-unsafe` 커맨드를 이용하여, 아이폰의 Files 폴더에서만 볼 수 있는 옵시디언 불트 폴더들을 iSH에서 볼 수 있게 매핑하는 것이다. 
<!-- /lang:ko -->

<!-- lang:en -->
Using `iSH` together with `Obsidian`, it is possible to write and manage blog posts in Obsidian even on an iPhone. The key is the `mount -t ios-unsafe` command, which maps an Obsidian Vault stored in the iPhone's **Files** app into iSH's Linux filesystem. This allows the Vault, which would otherwise be accessible only through the Files app and Obsidian, to be accessed directly from iSH as well.
<!-- /lang:en -->