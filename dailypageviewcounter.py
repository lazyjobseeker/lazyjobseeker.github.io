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

print("Fetching pageviews...")
pageviews = fetch_pageviews()
print(pageviews)
