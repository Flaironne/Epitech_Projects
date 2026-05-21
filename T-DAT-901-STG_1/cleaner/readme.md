# 🧼 Crypto Cleaner — Service de Nettoyage des Données

Service Python chargé de transformer les données brutes de cryptomonnaies en données propres, typées et prêtes à être stockées ou visualisées.  
Il s’inscrit dans un pipeline data composé d'un scraper, d’un broker Kafka, d’un backend et d’une IHM.

---

## 📌 1. Rôle du service

Le **Crypto Cleaner** est un microservice qui :

1. **Consomme des données brutes** provenant du topic Kafka **`crypto.raw`** (envoi depuis le scraper).
2. **Nettoie et normalise les données** brutes :
   - extraction du nom de la crypto + symbole
   - conversion des valeurs monétaires (`$ 25.3 B` → `25300000000.0`)
   - conversion des pourcentages, volumes, market cap
   - conversion des timestamps en **UTC ISO 8601**
   - typage strict des données (`int`, `float`, `datetime`, etc.)
3. **Publie les données propres** dans le topic **`crypto.clean`**.
4. Permet au backend de stocker les données propres dans TimescaleDB.

---

## 🧱 2. Architecture générale

```mermaid
flowchart LR
    Scraper[Scraper HTML] --> RAW((Kafka Topic : crypto.raw))

    RAW --> Cleaner[Python Cleaner\n(Pandas)]
    Cleaner --> CLEAN((Kafka Topic : crypto.clean))

    CLEAN --> Backend[API Backend → TimescaleDB]
    CLEAN --> Frontend[IHM → Graphiques/Tableaux]
```

Le cleaner agit comme un **filtre intelligent** entre des données semi-structurées et un système d’analyse/visualisation.

---

## ⚙️ 3. Fonctionnement du service

### 🔹 3.1 Structure

```
cleaner/
 ├── app.py                   → boucle Kafka (consumer/producer)
 ├── cleaning.py              → logique de nettoyage Pandas
 ├── test_cleaner_pandas.py   → tests unitaires
 └── __init__.py
```

### 🔹 3.2 Flux de données

1. Lecture depuis Kafka (`crypto.raw`)
2. Transformation → Pandas
3. Publication vers Kafka (`crypto.clean`)
4. Backend récupère les données propres

---

## 📊 4. Justification des technologies utilisées

### 🐍 Python  
Le choix naturel pour un service ETL :
- forte communauté data
- manipulation facile des structures JSON
- très bonne compatibilité Kafka (`confluent-kafka-python`)

### 📦 Pandas  
Même si les datasets sont petits, Pandas est idéal car :
- parsing robuste
- transformations vectorisées rapides
- typage strict
- recommandé dans le cadre de l'évaluation Data Science

### 📨 Kafka (Confluent Kafka)  
Kafka est utilisé pour :
- découpler scraper → cleaner → backend
- gérer le flux en continu (streaming)
- tolérance aux pannes
- bufferisation automatique en cas de surcharge du backend

Kafka est parfaitement adapté à un pipeline Data moderne.

---

## 🧪 5. Tests unitaires

Les tests se trouvent dans :

```
cleaner/test_cleaner_pandas.py
```

Ils couvrent :
- parsing JSON → DataFrame
- nettoyage Pandas
- extraction (`name`, `symbol`)
- conversion monétaire / pourcentage
- timestamps en UTC

### Exécution :

```bash
cd cleaner
pytest -v
```

Grâce à la séparation `app.py` / `cleaning.py`, ces tests n’ont **pas besoin de Kafka**.

---

## 🐳 6. Utilisation avec Docker / Docker Compose

Le service cleaner est lancé via :

```yaml
cleaner:
  build: ./cleaner
  depends_on:
    kafka:
      condition: service_healthy
  environment:
    KAFKA_BOOTSTRAP: "kafka:9092"
    TOPIC_RAW: "crypto.raw"
    TOPIC_CLEAN: "crypto.clean"
    KAFKA_GROUP_ID: "cleaner"
  volumes:
    - ./cleaner:/app
```

### Lancement global

```bash
docker compose up --build
```

Le cleaner attend automatiquement que Kafka soit prêt.

---

## ▶️ 7. Lancer le cleaner seul

### En local

```bash
export KAFKA_BOOTSTRAP=kafka:9092
export TOPIC_RAW=crypto.raw
export TOPIC_CLEAN=crypto.clean
export KAFKA_GROUP_ID=cleaner

python -m cleaner.app
```

### En Docker

```bash
docker compose up cleaner
```

---

## 🧯 8. Pourquoi ce découpage est propre et efficace ?

| Besoin | Solution |
|--------|----------|
| Données brutes → données propres | Pandas pour nettoyage vectorisé |
| Scalabilité | Kafka découple les microservices |
| Testabilité | `cleaning.py` isolé de Kafka |
| Maintenabilité | SRP : traitement vs infrastructure |
| Architecture moderne | Streaming + microservices |

---

## 📎 9. Maintenance

Service développé dans le cadre du module Data Science.  
Mainteneur : **Valentin**.

---

Si tu veux, je te génère aussi une **version courte**, une **version pro corporate**, ou une **version pour rendu PDF / rapport**.
