# Configuration du Scraper

# KAFKA_BROKER = "kafka:9092"   # si lancé via docker-compose
# KAFKA_TOPIC = "crypto-news"

SCRAPE_URLS = {
    "cryptocompare": "https://www.cryptocompare.com/coins/list/all/USD/1",
}

SCRAPE_INTERVAL = 30  # secondes entre chaque scraping
