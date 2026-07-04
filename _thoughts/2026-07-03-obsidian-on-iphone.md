---
title:
  ko: "아이폰에서 깃허브 레포지토리와 옵시디언 불트 연동 (iSH + Obsidian)"
  en: "Syncing Obsidian Vault with Github Repo in Iphone (iSH + Obsidian)"
tags:
  - blog
created_at: 2026-07-02 11:06:06 -05:00
last_modified_at: 2026-07-04 14:28:21 -05:00
---

<!-- lang:ko -->
`iSH`와 `Obsidian`을 이용해 iPhone 모바일 환경에서도 옵시디언을 이용한 포스팅이 가능하다. 중요한 것은 `mount -t ios-unsafe` 커맨드를 이용하여, 아이폰의 Files 폴더에서만 볼 수 있는 옵시디언 불트 폴더들을 iSH에서 볼 수 있게 매핑하는 것이다.

다만 ios-unsafe를 이용해 iSH에 마운트한 리포지토리 폴더는 소유권 관련 이슈로 git 기능을 실행할 수 없을 수 있으며 

```
git config --global --add safe.directory <repository-path>
```

커맨드를 실행하여 해결해야 할 수 있다.
<!-- /lang:ko -->

<!-- lang:en -->
Using `iSH` together with `Obsidian`, it is possible to write and manage blog posts in Obsidian even on an iPhone. The key is the `mount -t ios-unsafe` command, which maps an Obsidian Vault stored in the iPhone's **Files** app into iSH's Linux filesystem. This allows the Vault, which would otherwise be accessible only through the Files app and Obsidian, to be accessed directly from iSH as well.

However, repositories mounted into iSH using ios-unsafe may encounter Git ownership verification issues, preventing Git operations from running correctly.

If this happens, you can mark the repository as trusted by running:

```
git config --global --add safe.directory <repository-path>
```

This tells Git to treat the repository as a trusted directory despite the ownership mismatch introduced by the ios-unsafe mount.
<!-- /lang:en -->