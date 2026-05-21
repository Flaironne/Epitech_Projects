# producer.py

from confluent_kafka import Producer
from dotenv import load_dotenv
import json
import os
import threading

# Load environment variables
load_dotenv()

# Configuration du producer
conf = {
    'bootstrap.servers': os.getenv('KAFKA_BROKER', 'localhost:9092'),
    'client.id': 'crypto-viz-producer',
    'delivery.timeout.ms': 5000,
}

# Producteur Kafka global
producer = Producer(conf)
lock = threading.Lock()  # pour sécurité si accès multi-thread

# Callback pour suivi
def delivery_report(err, msg):
    if err is not None:
        print(f"❌ Delivery failed: {err}")
    else:
        print(f"✅ Delivered to {msg.topic()} [{msg.partition()}] offset {msg.offset()}")

def safe_json_dumps(data):
    """Convert safely to JSON"""
    def default(o):
        try:
            return str(o)
        except Exception:
            return None
    return json.dumps(data, default=default)

def produce_data(topic: str, data: dict):
    """
    Send data to Kafka topic.
    """
    try:
        payload = safe_json_dumps(data)
        with lock:
            producer.produce(topic=topic, value=payload, on_delivery=delivery_report)
            producer.poll(0)
    except BufferError:
        print("⚠️ Local producer queue is full — waiting for free space...")
        producer.flush()
    except Exception as e:
        print(f"❌ Error producing message: {e}")
    finally:
        # flush léger pour assurer livraison sans tout bloquer
        producer.poll(0.1)
