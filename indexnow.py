import requests

json_url = "https://lazyjobseeker.github.io/indexnow-url-list.json"

response = requests.get(json_url)
response.raise_for_status()  # fail fast if can't fetch

url_list = response.json()  # This will be a list of URLs

data1 = {
    "host": "https://lazyjobseeker.github.io/",
    "key": "7c8d916aed354f77bb94d77e66fa202e",
    "keyLocation": "https://lazyjobseeker.github.io/7c8d916aed354f77bb94d77e66fa202e.txt",
    "urlList": url_list
}

headers1 = {'Content-Type': 'application/json; charset=utf-8'}
r1 = requests.post("https://api.indexnow.org/IndexNow", json=data1, headers=headers1)
print(r1.status_code, r1.text)

response2 = requests.get(json_url)
response2.raise_for_status()  # fail fast if can't fetch

url_list2 = response2.json()  # This will be a list of URLs

data2 = {
    "host": "https://lazyjobseeker.github.io/",
    "key": "988e928790a24ceb80bd704f7f067aaf",
    "keyLocation": "https://lazyjobseeker.github.io/988e928790a24ceb80bd704f7f067aaf.txt",
    "urlList": url_list2
}

headers2 = {'Content-Type': 'application/json; charset=utf-8'}
r2 = requests.post("https://searchadvisor.naver.com/indexnow", json=data2, headers=headers2)
print(r2.status_code, r2.text)