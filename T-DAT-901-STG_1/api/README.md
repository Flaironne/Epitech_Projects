## 📌 1. Rôle de l’api

1. **Insertion en BDD** des cryptomonnaies et NFTs nettoyées par le cleaner.
2. **Envoyer au front les données en websocket** :
3. **Récupération des logs d'erreur du scraper**.

---

## 🧱 2. Structure du projet 

```
api/
 ├── sql/
 │   ├── init.sql
 ├── src/
 │   ├── config/
 │   │   └── db.js/             → config db
 │   │   └── kafka.js/          → config broker
 │   ├── consumers/
 │   │   └── cryptocurrencies-consumer.js → insert cleaned data into db
 │   ├── routes/                
 │   ├── services/             → services api
 │   ├── server.js/            → websocket 
 │   └── app.js                → point d’entrée principal
 ├── package.json
 └── Dockerfile
```