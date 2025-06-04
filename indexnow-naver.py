import requests

json_url = "https://lazyjobseeker.github.io/bing-indexnow-url-list.json"

response = requests.get(json_url)
response.raise_for_status()  # fail fast if can't fetch

url_list = response.json()  # This will be a list of URLs

data = {
    "host": "https://lazyjobseeker.github.io/",
    "key": "1b0522866f8b42049d0770c799fd11f5",
    "keyLocation": "https://lazyjobseeker.github.io/1b0522866f8b42049d0770c799fd11f5.txt",
    "urlList": url_list
}

headers = {'Content-Type': 'application/json; charset=utf-8'}
r = requests.post("https://searchadvisor.naver.com/indexnow", json=data, headers=headers)
print(r.status_code, r.text)