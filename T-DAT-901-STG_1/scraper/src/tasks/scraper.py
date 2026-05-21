import os
import random
import time
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from datetime import datetime
from dotenv import load_dotenv
import chromedriver_autoinstaller
from selenium.common.exceptions import StaleElementReferenceException
from src.tasks.producer import produce_data
import requests

load_dotenv()
chromedriver_autoinstaller.install()

options = Options()
options.add_argument("--headless=new")
options.add_argument("--window-size=1920,1080")
options.add_argument("--no-sandbox")
options.add_argument("--disable-dev-shm-usage")
options.add_argument("--remote-debugging-port=9222")
options.add_argument(
    "user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 "
    "(KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36"
)

TEST_MODE = os.getenv("TEST_MODE", "true").lower() == "true"
TOPIC_RAW = os.getenv("TOPIC_RAW", "crypto.raw")

BASE_URL = "https://www.cryptocompare.com/coins/list/{}/USD/{}"

def scrape_page(driver, page_number: int, page_type: str = "all"):
    """Scrape une seule page, type = 'all' ou 'nft'."""
    url = BASE_URL.format(page_type, page_number)
    print(f"🔎 Scraping {page_type} page {page_number}: {url}")
    driver.get(url)

    trs = driver.find_elements(By.CSS_SELECTOR, "tr.ng-scope")
    data = []

    for i, tr in enumerate(trs):
        # A changer selon le nombre d'éléments par page jusqu'à 100 max
        if i == 10:
            break

        try:
            tds = tr.find_elements(By.CSS_SELECTOR, "td")

            if page_type == "all":
                currency = {
                "place": tds[0].find_elements(By.TAG_NAME, "div")[0].text if tds[0].find_elements(By.TAG_NAME, "div") else "",
                "thumb" : tds[1].find_elements(By.TAG_NAME, "img")[0].get_attribute("src") if tds[1].find_elements(By.TAG_NAME, "img") else "",
                "name": tds[2].find_elements(By.CSS_SELECTOR, "h3")[0].text if tds[2].find_elements(By.CSS_SELECTOR, "h3") else "",
                "price": tds[3].find_elements(By.TAG_NAME, "div")[0].text if tds[3].find_elements(By.TAG_NAME, "div") else "",
                "volume": tds[5].find_elements(By.TAG_NAME, "div")[0].text if tds[5].find_elements(By.TAG_NAME, "div") else "",
                "top_tier_volume": tds[6].find_elements(By.TAG_NAME, "div")[0].text if tds[6].find_elements(By.TAG_NAME, "div") else "",
                "market_cap": tds[7].find_elements(By.TAG_NAME, "div")[0].text if tds[7].find_elements(By.TAG_NAME, "div") else "",
                "percentage_change": tds[9].find_elements(By.TAG_NAME, "div")[0].text if tds[9].find_elements(By.TAG_NAME, "div") else ""
                }
                data.append(currency)
                
            elif page_type == "nft":
                nft = {
                "place": tds[0].find_elements(By.TAG_NAME, "div")[0].text if tds[0].find_elements(By.TAG_NAME, "div") else "",
                "thumb" : tds[1].find_elements(By.TAG_NAME, "img")[0].get_attribute("src") if tds[1].find_elements(By.TAG_NAME, "img") else "",
                "name": tds[2].find_elements(By.CSS_SELECTOR, "h3")[0].text if tds[2].find_elements(By.CSS_SELECTOR, "h3") else "",
                "price": tds[3].find_elements(By.TAG_NAME, "div")[0].text if tds[3].find_elements(By.TAG_NAME, "div") else "",
                "full-volume": tds[4].find_elements(By.TAG_NAME, "div")[0].text if tds[4].find_elements(By.TAG_NAME, "div") else "",
                "market_cap": tds[6].find_elements(By.TAG_NAME, "div")[0].text if tds[6].find_elements(By.TAG_NAME, "div") else "",
                "change": tds[8].find_elements(By.TAG_NAME, "div")[0].text if tds[8].find_elements(By.TAG_NAME, "div") else ""
                }
                data.append(nft)

        except StaleElementReferenceException:
            print("⚠️ Skipped row due to stale element")
            continue
        except Exception as e:
            print(f"⚠️ Skipped row due to missing element: {e}")

    return data

def scrape():
    """Scrape pages 1 à 3 pour crypto et NFT, avec pause aléatoire et envoie à Kafka."""
    try:
        with webdriver.Chrome(options=options) as driver:
            all_currencies = []
            all_nft = []

            # Crypto pages
            for page in range(1, 2):  # Ajustable pour plus de pages
                page_data = scrape_page(driver, page, page_type="all")
                all_currencies.extend(page_data)
                time.sleep(random.uniform(1, 2))

            # NFT pages
            for page in range(1, 2):  # Ajustable pour plus de pages NFT
                nft_data = scrape_page(driver, page, page_type="nft")
                all_nft.extend(nft_data)
                time.sleep(random.uniform(1, 2))

            feed = {
                "timestamp": str(datetime.now()),
                "crypto": all_currencies,
                "nft": all_nft
            }

            if not TEST_MODE:
                print(f"🚀 Producing data to Kafka topic: {TOPIC_RAW}")
                produce_data(TOPIC_RAW, feed)
            else:
                print("📝 Test mode: feed ready, not sending to Kafka")
                return feed

    except Exception as error:
        error_payload = {
            "status": "error",
            "message": str(error),
            "type": type(error).__name__,
            "timestamp": str(datetime.now())
        }

        print("❌ An error occurred during scraping:", error_payload)

        try:
            print("🚨 Sending error log to API")
            requests.post("http://api:8000/api/logs", json=error_payload)
        except Exception as e:
            print(f"⚠️ Failed to send error log: {e}")
