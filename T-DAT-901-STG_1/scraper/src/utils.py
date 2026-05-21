import requests
from bs4 import BeautifulSoup

def fetch_rss_feed(url: str):
    """Fetch RSS feed and return list of articles (title, link, pubDate)."""
    articles = []
    try:
        resp = requests.get(url, timeout=10)
        if resp.status_code == 200:
            soup = BeautifulSoup(resp.content, "xml")
            for item in soup.find_all("item"):
                articles.append({
                    "title": item.title.text,
                    "link": item.link.text,
                    "pubDate": item.pubDate.text if item.pubDate else None
                })
    except Exception as e:
        print(f"❌ Error scraping {url}: {e}")
    return articles
