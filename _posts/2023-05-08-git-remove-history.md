---
title: "[Git] 저장소 커밋 히스토리 모두 삭제하기"
categories: Programming
redirect_from:
  - /programming/230508-git-remove-history/
tags:
  - devlog
published: true
created_at: 2023-05-08 01:33:28 +09:00
last_modified_at: 2024-03-27 16:11:28 +09:00
header:
  teaser: /assets/images/software-teaser-scm.png
---

https://stackoverflow.com/questions/13716658/how-to-delete-all-commit-history-in-github

커밋이 쌓이면서 저장소 크기가 점점 커지기 때문에 적당한 시점에 이전 커밋 히스토리를 모두 제거해 줄 필요가 있다.  이 블로그는 공부용 블로그라 아무렇게나 만들고 푸시하는 커밋이 많아 쓸모없는 이력이 빨리 쌓인다.

```
git checkout --orphan latest_branch
git add -A
git commit -am "commit message"
git branch -D main //내 경우에는 master였다
git branch -m main //현재 브랜치 이름 변경
git push -f origin main // 오류 무시하고 원격 저장소에 푸시
```