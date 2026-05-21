# 🌐 CryptoViz Frontend — Interface Utilisateur

Le **frontend CryptoViz** est une application React qui permet la visualisation interactive des données de cryptomonnaies et NFTs.  
Elle s’appuie sur **Shadcn UI** pour les composants, **Recharts** pour les graphiques et un **backend temps réel via WebSocket/Kafka**.  
L’objectif est de fournir un tableau de bord performant et intuitif pour les analyses et comparaisons de crypto-actifs.

---

## 📌 1. Rôle de l’application

Le frontend CryptoViz permet :

1. **Affichage en temps réel** des cryptomonnaies et NFTs via WebSocket.
2. **Visualisation interactive** :
   - Graphiques multi-line pour les prix
   - Graphiques volume (bar chart)
   - Comparaison de plusieurs cryptos
3. **Sélection dynamique** des cryptos à suivre.
4. **Indication des changements récents** (flag `justUpdated`).
5. **Gestion des périodes** (7d, 30d, 3 mois, 6 mois).

---

## 🧱 2. Structure du projet 

```
app/
 ├── src/
 │   ├── components/
 │   │   └── ui/                → Shadcn UI components
 │   ├── contexts/
 │   │   ├── cryptocurrency-context.tsx → gestion crypto
 │   │   └── nft-context.tsx            → gestion NFT
 │   ├── hooks/                 → hooks React (ex: useCryptocurrency)
 │   ├── services/              → appels API, WebSocket
 │   └── app.tsx                → point d’entrée principal
 ├── package.json
 └── tsconfig.json
```

🔹 Context / State Management

CryptocurrencyContext : sélection, focus, historique 3 mois.

NFTContext : liste des NFT, flag justUpdated pour les animations.

WebSocket intégré : réception des updates temps réel.

## 📌 5. Flux de données temps réel

Le backend stocke les données nettoyées du cleaner.

Le frontend se connecte via WebSocket pour recevoir les mises à jour instantanées.

La fonction updateAsset dans le context gère :

ajout / mise à jour des cryptos

animation du flag justUpdated

tri et agrégation de l’historique

# ⚙️ 6. Technologies utilisées
---

## ⚙️ 6. Technologies utilisées

| Technologie      | Justification                                                                                  |
|-----------------|------------------------------------------------------------------------------------------------|
| React            | UI déclarative et performant, support des hooks pour le state management                        |
| TypeScript       | Typage fort pour prévenir les erreurs runtime, essentiel pour la gestion des données financières |
| Shadcn UI        | Bibliothèque de composants design system-ready, permet cohérence et réutilisabilité            |
| Recharts         | Graphiques flexibles, responsive, compatible React et performant                               |
| Framer Motion    | Animations fluides pour les cards et mises à jour en temps réel                                 |
| WebSocket        | Temps réel, notifications instantanées pour crypto et NFT                                       |
| Vite             | Build rapide et hot-reload pour développement efficace                                         |
