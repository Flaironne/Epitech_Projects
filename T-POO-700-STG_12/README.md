# Time Manager
![2024-10-28_22-28](https://github.com/user-attachments/assets/8f96651f-fc0b-45d1-bd2b-9826ed201e07)

## SETUP

Pour run le project en local, il est nécessaire d'utiliser docker

Pour une version en prod avec PWA

```bash
docker compose -f docker-compose.prod.yml up --build
```

Pour une version en dev avec reload auto en front

```bash
docker compose -f docker-compose.dev.yml build --build
```

## Prérequis 

Pour utiliser la version locale du projet, il est nécessaire de dupliquer le fichier .env.example à la racine et de le renommer .env. Vous pouvez alors renseigner les informations de votre base de données ainsi que l'identifiant et le mot de passe de votre compte administrateur.

[Voir le fichier de configuration](./.env.example)

## Adresse du serveur de production 

[https://timemanager.freeboxos.fr/](https://timemanager.freeboxos.fr/login)

### Compte Admin Test

login : admin@example.com  
pass  : P4ssw.rd
