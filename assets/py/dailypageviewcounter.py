from pathlib import Path
import json
import requests
import datetime as dt

PAGEVIEW_FILE = Path("assets/json/gcdailypageviews.json")
PAGEVIEW_TOTAL_FILE = Path("assets/json/gctotalpageviews.json")

def fetch_pageviews_yesterday():
    # Replace with your actual API endpoint and parameters
    today = dt.date.today().isoformat()
    yesterday = (dt.date.today() - dt.timedelta(days=1)).isoformat()
    url = f"https://slothsattic.goatcounter.com/counter/TOTAL.json?start={yesterday}&end={today}"
    response = requests.get(url)
    if response.status_code == 200:
        return response.json()  # Assuming the API returns JSON data
    else:
        print(f"Failed to fetch pageviews: {response.status_code}")
        return {}

def fetch_pageviews_today():
    # Replace with your actual API endpoint and parameters
    today = dt.date.today().isoformat()
    tomorrow = (dt.date.today() + dt.timedelta(days=1)).isoformat()
    url = f"https://slothsattic.goatcounter.com/counter/TOTAL.json?start={today}&end={tomorrow}"
    response = requests.get(url)
    if response.status_code == 200:
        return response.json()  # Assuming the API returns JSON data
    else:
        print(f"Failed to fetch pageviews: {response.status_code}")
        return {}

def fetch_pageviews_total():
    # Replace with your actual API endpoint and parameters
    url = f"https://slothsattic.goatcounter.com/counter/TOTAL.json"
    response = requests.get(url)
    if response.status_code == 200:
        return response.json()  # Assuming the API returns JSON data
    else:
        print(f"Failed to fetch pageviews: {response.status_code}")
        return {}

yesterday = dt.date.today() - dt.timedelta(days=1)
yesterday = yesterday.isoformat()

today = dt.date.today().isoformat()
data = {}
if PAGEVIEW_FILE.exists():
    with open(PAGEVIEW_FILE, 'r', encoding='utf-8') as f:
        data = json.loads(PAGEVIEW_FILE.read_text(encoding='utf-8'))

data[yesterday] = int(fetch_pageviews_yesterday().get("count", 0))
data[today] = int(fetch_pageviews_today().get("count", 0))

with open(PAGEVIEW_FILE, 'w', encoding='utf-8') as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

# Update total pageviews file
total_data = {}
if PAGEVIEW_TOTAL_FILE.exists():
    with open(PAGEVIEW_TOTAL_FILE, 'r', encoding='utf-8') as f:
        total_data = json.loads(PAGEVIEW_TOTAL_FILE.read_text(encoding='utf-8'))

total_data["TOTAL"] = int(fetch_pageviews_total().get("count", 0).replace("\u202f", ""))

with open(PAGEVIEW_TOTAL_FILE, 'w', encoding='utf-8') as f:
    json.dump(total_data, f, ensure_ascii=False, indent=2)