# main.py
import os
import random
import asyncio
from dotenv import load_dotenv
import chromedriver_autoinstaller
import faust
from concurrent.futures import ThreadPoolExecutor
from src.tasks import scraper
from src.tasks.producer import produce_data

# Charger .env
load_dotenv()

# Installer automatiquement le bon driver Chrome
chromedriver_autoinstaller.install()

# Variables
USE_FAUST = os.getenv("USE_FAUST", "true").lower() == "true"
KAFKA_BROKER = os.getenv("KAFKA_BROKER", "localhost:9092")
TOPIC_RAW = os.getenv("TOPIC_RAW", "crypto.raw")

if USE_FAUST:
    app = faust.App("crypto_scrape_app", broker=f"kafka://{KAFKA_BROKER}")
    executor = ThreadPoolExecutor()

    @app.on_worker_init
    async def setup_executor(app, **kwargs):
        global executor
        executor = ThreadPoolExecutor()

    async def scrape_and_produce():
        """Run scraper and send results to Kafka."""
        print("🔍 Running scraper...")
        data = scraper.scrape()
        if data:
            print(f"✅ Scraper returned {len(data)} records")
            produce_data(TOPIC_RAW, data)
        else:
            print("⚠️ Scraper returned no data")

    async def variable_interval_task():
        """Run every ~5s ±3s."""
        while True:
            await scrape_and_produce()
            delay = max(1, 5 + random.uniform(-3, 3))  # min 1s pour éviter 0 ou négatif
            print(f"⏱️ Next scrape in {delay:.1f}s")
            await asyncio.sleep(delay)

    @app.task
    async def start_task():
        asyncio.create_task(variable_interval_task())

else:
    if __name__ == "__main__":
        print("🚀 Running scraper in test mode (no Kafka)...")
        results = scraper.scrape()
        print("Results:", results)
