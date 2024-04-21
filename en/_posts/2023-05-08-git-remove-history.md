---
published: false
title: "[Git] Removing All Commit History"
category: programming
tags:
  - devlog
created_at: 2023-05-08 01:33:28 +09:00
last_modified_at: 2024-04-21 22:18:23 +09:00
excerpt: "How to remove all commit history from a git repository."
---

https://stackoverflow.com/questions/13716658/how-to-delete-all-commit-history-in-github

We can reset commit history by creating an orphan branch, adding all the files and commiting them altogher as a single first commit.  Process completes by renaming htis new orphan branch to our main (or master or anything, depending on the name of branch you would like to reset commit history from). 

```
git checkout --orphan latest_branch
git add -A
git commit -am "commit message"
git branch -D master // Delete master branch
git branch -m master // Change current branch
git push -f origin master // Push to remote, ignoring error
```