# 📘 Scraper Service --- Documentation

## 📌 Présentation du service

Le service **Scraper** extrait automatiquement des données depuis le
site **CryptoCompare**.\
Il collecte :

- Les cryptomonnaies (`/all`)
- Les collections NFT (`/nft`)

Les données sont ensuite normalisées, packagées dans un objet `feed`,
puis envoyées vers Kafka (ou renvoyées en mode test).

Ce service utilise **Selenium** afin de charger et exécuter les pages
dynamiques fortement basées sur JavaScript.

---

## 🧩 Architecture du service

### **Structure générale**

    scraper/
     ├── src/
     │    ├── main.py          # Entrée principale
     │    ├── scraper.py       # Scraping Crypto / NFT
     │    ├── tasks/
     │    │     └── producer.py  # Envoi Kafka
     │    └── utils/ ...
     ├── README.md
     └── requirements.txt

### **Fonctionnement du scraping**

1.  Ouvre Chrome headless avec Selenium\
2.  Charge les pages Crypto ou NFT\
3.  Attend le rendu dynamique (JavaScript)\
4.  Extrait les lignes du tableau\
5.  Construit un dictionnaire normalisé `feed`\
6.  Envoie (ou non) le feed dans Kafka selon `TEST_MODE`

---

## ⚙️ Variables d'environnement

Dans le `.env` :

Variable Description

---

`TEST_MODE` Si `true`, n'envoie rien à Kafka
`TOPIC_RAW` Nom du topic Kafka pour les données brutes

Exemple :

    TEST_MODE=true
    TOPIC_RAW=crypto.raw

---

## 🛠️ Justification des technologies

### 🐍 Python

- Lisible, rapide à développer\
- Excellent écosystème pour scraping, automatisation, Kafka\
- Parfait pour un worker ou micro-service

### 🌐 Selenium

CryptoCompare utilise Angular → contenu dynamique impossible à scrapper
via `requests` + `BeautifulSoup`.

Selenium permet : - Exécution du JavaScript - Simulation utilisateur -
Extraction fiable des tables dynamiques

### 🧰 Chrome Headless

- Discret\
- Performant\
- Compatible CI/CD & Docker

### 🧵 Kafka

- Pipeline ingestion → traitement\
- Résilient & scalable\
- Découplage total des services

---

## 🚀 Lancer le Scraper (en mode standalone)

Voici la procédure correcte pour **exécuter uniquement le scraper**,
même sans lancer Kafka.

### 1️⃣ Créer un virtual environment

```bash
python3 -m venv .venv
```

### 2️⃣ Activer le venv

#### Linux / MacOS :

```bash
source .venv/bin/activate
```

#### Windows :

```bash
.venv\Scripts\activate
```

### 3️⃣ Installer les dépendances

Depuis la racine du projet :

```bash
pip install -r requirements.txt
```

### 4️⃣ Exécuter le scraper

Toujours **depuis la racine**, lancer :

```bash
python -m scraper.src.main
```

Ou :

```bash
python scraper/src/main.py
```

---

## 📦 Structure du `feed` généré

```json
{
  "timestamp": "2025-01-21 13:42:10",
  "crypto": [],
  "nft": []
}
```

---

## 🧪 Mode Test

Quand `TEST_MODE=true` :

- Aucune donnée n'est envoyée vers Kafka\
- Le scraper renvoie directement le JSON\
- Idéal pour dev, debug, et tests unitaires

---

## 📘 Conclusion

Le service **Scraper** est la première étape d'ingestion des données du
projet.\
Grâce à Python + Selenium + Kafka, il apporte :

- Un scraping fiable de pages dynamiques\
- Des données propres et centralisées\
- Une intégration facile avec le reste de l'architecture
