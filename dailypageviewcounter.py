from pathlib import Path
import json
import requests
import datetime as dt

PAGEVIEW_FILE = Path("gcdailypageviews.json")

def fetch_pageviews():
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

today = dt.date.today().isoformat()
data = {}
if PAGEVIEW_FILE.exists():
    with open(PAGEVIEW_FILE, 'r', encoding='utf-8') as f:
        data = json.loads(PAGEVIEW_FILE.read_text(encoding='utf-8'))

data[today] = fetch_pageviews()

with open(PAGEVIEW_FILE, 'w', encoding='utf-8') as f:
    json.dump(data, f, ensure_ascii=False, indent=2)