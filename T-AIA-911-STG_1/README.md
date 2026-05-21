## API

Le projet contient une API Laravel qui sert d'interface entre les services et l'application mobile. Elle gère les requêtes, la logique métier et la communication avec les services.

### Mise en place

Configurer les variables d'environnement de l'API en copiant le fichier `.env.example` à la racine du projet et en le renommant en `.env`, puis en ajoutant les informations nécessaires (base de données, services, etc.)

```env
APP_NAME=Sayway
APP_ENV=local
APP_KEY=
APP_DEBUG=true
APP_URL=http://localhost

APP_LOCALE=en
APP_FALLBACK_LOCALE=en
APP_FAKER_LOCALE=en_US

APP_MAINTENANCE_DRIVER=file
# APP_MAINTENANCE_STORE=database

# PHP_CLI_SERVER_WORKERS=4

BCRYPT_ROUNDS=12

LOG_CHANNEL=stack
LOG_STACK=single
LOG_DEPRECATIONS_CHANNEL=null
LOG_LEVEL=debug

DB_CONNECTION=pgsql
DB_HOST=db
DB_PORT=5432
DB_DATABASE=sayway
DB_USERNAME=sayway
DB_PASSWORD=sayway

SESSION_DRIVER=database
SESSION_LIFETIME=120
SESSION_ENCRYPT=false
SESSION_PATH=/
SESSION_DOMAIN=null

BROADCAST_CONNECTION=log
FILESYSTEM_DISK=local
QUEUE_CONNECTION=database

CACHE_STORE=database
# CACHE_PREFIX=

MEMCACHED_HOST=127.0.0.1

REDIS_CLIENT=phpredis
REDIS_HOST=127.0.0.1
REDIS_PASSWORD=null
REDIS_PORT=6379

MAIL_MAILER=log
MAIL_SCHEME=null
MAIL_HOST=127.0.0.1
MAIL_PORT=2525
MAIL_USERNAME=null
MAIL_PASSWORD=null
MAIL_FROM_ADDRESS="hello@example.com"
MAIL_FROM_NAME="${APP_NAME}"

AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_DEFAULT_REGION=us-east-1
AWS_BUCKET=
AWS_USE_PATH_STYLE_ENDPOINT=false

VITE_APP_NAME="${APP_NAME}"

SERVICES_CALLBACK_TOKEN=<token_de_callback>
NLP_SERVICE_URL=http://nlp_service:8000/api/analyze
PATHFINDER_SERVICE_URL=http://pathfinder_service:8000/api/analyze
```

Pour ce qui est de la clé `SERVICES_CALLBACK_TOKEN`, elle est utilisée pour authentifier les appels de callback entre les services et l'API Laravel. Elle doit être générée de manière sécurisée. Cette clée doit être présente dans ce fichier `.env` de l'API, ainsi que dans les fichiers `.env` des services `nlp` et `pathfinder` pour assurer une communication sécurisée entre eux.

| Pour générer sécurisément un token, vous pouvez utiliser la commande suivante dans votre terminal :

```bash
php artisan key:generate --show
```

### Collection Postman

Une collection Postman est disponible dans le dossier `postman` à la racine de l'api. Elle contient des requêtes préconfigurées pour tester les différentes fonctionnalités de l'API. Vous pouvez importer cette collection dans Postman pour faciliter vos tests. Il vous suffit de vérifier que les variables d'environnement de la collection sont correctement configurées pour pointer vers votre instance de l'API.

## Services

Le projet contient deux services principaux : `nlp` et `pathfinder`. Le service `nlp` est responsable du traitement du langage naturel, tandis que le service `pathfinder` gère la logique de recherche de chemin via neo4j.

| Chacun des services est également exécutable indépendamment, ce qui permet de les développer et de les tester séparément. Un `makefile` est disponible à la racine de chacun afin de faciliter leur lancement et les tests.

### Service NLP

Comme nous utilisons un modèle de NER (Named Entity Recognition) basé sur Camembert, il est nécessaire de récupérer ce modèle et de l'ajouter dans le service `nlp` pour qu'il puisse être utilisé lors du traitement des requêtes. Il n'était pas possible de le push sur le repository GitHub en raison de sa taille, mais il est disponible via un lien de téléchargement.

- Récupérer le model depuis le lien de téléchargement
- L'ajouter dans `.\services\nlp-service-camembert\app\models\camembert-ner`
- Créer le .env du service `nlp`

Exemple de contenu du .env du service `nlp` :

```env
API_CALLBACK_URL=http://sayway_web/api/callbacks/voice-analyses
API_CALLBACK_TOKEN=iebO03uy0mE5z1RLtM6hqlL2lvAvF2qBJW1UT10BhwdetdR3dejRqpkZmo6BlLXz8WEeprs3a0sGeHp64voQ3xRGqxU1
```

### Service Pathfinder

- Créer le .env du service `pathfinder`

Exemple de contenu du .env du service `pathfinder` :

```env
API_CALLBACK_URL=http://sayway_web/api/callbacks/pathfinder
API_CALLBACK_TOKEN=iebO03uy0mE5z1RLtM6hqlL2lvAvF2qBJW1UT10BhwdetdR3dejRqpkZmo6BlLXz8WEeprs3a0sGeHp64voQ3xRGqxU1
NEO4J_URI=neo4j+s://f4ce75f0.databases.neo4j.io
NEO4J_AUTH_USERNAME=<votre_nom_d_utilisateur>
NEO4J_AUTH_PASSWORD=<votre_mot_de_passe>
```

#### Neo4j

Le service `pathfinder` utilise une base de données Neo4j pour stocker les données de graphes nécessaires à la recherche de chemin. Il est nécessaire de configurer les informations d'authentification pour accéder à la base de données Neo4j.

Un export de la base de données Neo4j est disponible dans le code source ; `.\services\pathfinder-service\app\data\neo4j-2026-02-19T15-40-59-f4ce75f0.backup`, et peut être importé dans votre instance Neo4j pour peupler la base de données avec les données nécessaires au fonctionnement du service.

Il est également possible d'utiliser une instance Neo4j cloud, en configurant les variables d'environnement `NEO4J_URI`, `NEO4J_AUTH_USERNAME` et `NEO4J_AUTH_PASSWORD` avec les informations de connexion de votre instance Neo4j cloud.

## Application mobile

L'application mobile sert d'interface utilisateur pour interagir avec les services et l'API. Elle permet aux utilisateurs de demander un chemin via du Speech to Text et de recevoir en réponse un chemin optimisé.

### Mise en place

Afin de permettre à l'application mobile de communiquer avec l'API, il est nécessaire de configurer l'URL de l'API dans les variables d'environnement de l'application.

Pour cela il suffit de copier le fichier `.env.example` à la racine du projet et de le renommer en `.env`, puis d'ajouter l'URL de l'API dans la variable `EXPO_PUBLIC_API_URL` :

```env
EXPO_PUBLIC_API_URL=http://<votre_ip>:8000/api
```

## Orchestration

Toutes les parties du projet sont orchestrées via Docker Compose, ce qui facilite le déploiement et la gestion des services.

- Lancer les containers via la commande `make dev` ou `docker compose up --build`
