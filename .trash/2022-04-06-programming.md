---
toc: true
toc_sticky: true
title: Week 14, 2022
category: Programming
tag: Python
published: false
last_modified_at: 2022-04-06 23:00:00 +2044
---

### 1. Python Installation: Behind Proxy & Offline
Some portion of the python module I coded was for kind of works like reformatting large dataset and exporting the results to external storage by pickling items including pandas `DataFrame` object. I faced an issue when I tried loading a pickled data, which were processed using the same module but in my colleague's workspace. The colleague was newcomer to python programming and has been using newer version of python - he was using python 3.9.7 environment and I have been using 3.6.7 up to then... how lazy I am! -. The issue I faced with was from `backward incompatibility` between different versions of pandas. This post summarize what I did to create new environment with later version of python.

#### 1.1. Environment with internet connection:
- Create new virtenv using conda command:
(I am not sure whether it was the very command I used)
```yaml
conda create --name python-3.9.7 python=3.9.7
```
- New virtenv can simply be accessed by `activate` command:
```yaml
activate python-3.9.7
```

I think there might have been some more arguments I should provide for conda command to work behind proxy server but I am not sure. Packages can be installed behind proxy server using `--proxy` specifier, followed by the proxy server info. I have been using this specifier in combination with `--cert` specifier, after which I provided the path for proper certificate file I needed to mitigate the proxy.
```python
pip install --proxy "proxy:port" --cert "cert_path" "pkg_name"
```
But after I created new python environment, `--cert` specifier did not work any more but threw out OSError saying that the path for my certificate is invalid.  It simply solved by removing --cert speficier.


#### 1.2. Installation to off-line environment:
I found that conda command cannot be used any longer when it comes to the case where I should install newer version of python to some environment with stronger security policy (i.e. no external network use allowed). What I used was a Linux environment, where the admin offers a few different versions of pre-installed python but the versions were not sufficient for my purpose. To install python 3.9.7 in this environment, firstly I downloaded `.tar` file of python 3.9.7 from [http://python.org](http://python.org) and moved it to my network-unable environment. After that I unzipped the tar file using following command:
```python
tar xvf "tar_file_name"
```
I was following a blog and it said that after above line execute optimization.
```python
./configure --enable-optimizations
```
In a [StackOverflow thread](https://stackoverflow.com/questions/41405728/what-does-enable-optimizations-do-while-compiling-python) it was discussed that running this line is related to boosting the speed of python library interpreter.
```python
make altinstall
```
And I executed above line just because the source I found to follow-up suggested it.  Another [StackOverflow thread](https://stackoverflow.com/questions/16018463/difference-in-details-between-make-install-and-make-altinstall) looks like being devoted to discussion on the difference between `make install` and `make altinstall` so I should look through it in near future. After completing this installation I also modified `.bashrc` file I had in the root directory by adding:
```yaml
alias python="python-path"
```
where "python-path" designates to single file rather than directory, which was just a extension-free file named 'python3.9' in my case. After completing all of these I could check new python is well settled, which could be confirmed as follows:
```python
python -V
Python 3.9.7
```
Remaining is installing required packages manually by downloading required packages, move to the network-free environment and install them. Download command is given by:
```python
pip download -d "dir_to_download_files" --only-binary=:all: --platform "platform_key" --implementation cp --proxy "proxy:port" "pkg_name"
```
for which I also have been using in combination of `--cert` specifier but I discarded it after keep getting OSError fail as described above.  During this mess I got to know that I was doing fool about applying platform tag after --platform specifier.  From online it said that I can apply --platform specifier multiple times with different platform tags to search for different versions of whl files than executing whole pip command above with several times changing platform tag each time.

Finally I can install the packages I needed in my offline Linux environment after transferring the whl files to its storage and executing:
```python
pip install --no-index --find-links="path_where_whl_file_resides" package_name=="version-no"
```

It completed installing all the packages I needed to run my codes on python-3.9.7 virtual environment where 3.9x version python and compatible packages are available.  As to my PC with internet connection, anaconda still has "base" environment as default one.  I want to wipe out it and have new 3.9x python environment be default environment due to my limited storage.  I will work on it next week.
