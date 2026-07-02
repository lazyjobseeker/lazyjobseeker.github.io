from pathlib import Path
import json
import requests
import datetime as dt
import time

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
    
def fetch_pageviews(date):
    # Replace with your actual API endpoint and parameters
    tomorrow = (date + dt.timedelta(days=1)).isoformat()
    url = f"https://slothsattic.goatcounter.com/counter/TOTAL.json?start={date}&end={tomorrow}"
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

basedate = "2024-04-25"
print(basedate)
today = dt.date(2025,1,1)
data_to_rewrite = {}

while today.isoformat() != "2024-04-25":
    data_to_rewrite[today.isoformat()] = int(fetch_pageviews(today).get("count", 0))
    print(f"{today} {data_to_rewrite[today.isoformat()]}")
    today = today - dt.timedelta(days=1)
    time.sleep(2.0)

print(data_to_rewrite)
    
with open(PAGEVIEW_FILE, 'w', encoding='utf-8') as f:
    json.dump(data_to_rewrite, f, ensure_ascii=False, indent=2)