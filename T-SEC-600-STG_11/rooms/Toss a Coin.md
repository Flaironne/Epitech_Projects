# Toss a Coin 🔳🔳

## Récupération du `user.txt`

Tout d'abord on effectue une analyse de port classique avec Nmap

On décide ensuite d'utiliser Dirbuster pour bruteforce le port HTTP.
On tombe sur un répertoire "/t".

Et récusivement on tombe sur "/t/o/s..." tous des sous-répertoires formant la chanson de "Toss a coin".

![01](https://github.com/EpitechMscProPromo2026/T-SEC-600-STG_11/assets/145432284/ecc66c05-8f73-4d80-957f-6745cbcb84e3)

URL finale :
"[IP]/t/o/s/s/_/a/_/c/o/i/n/_/t/o/_/y/o/u/r/_/w/i/t/c/h/e/r/_/o/h/_/v/a/l/l/e/y/_/o/f/_/p/l/e/n/t/y/"

![02](https://github.com/EpitechMscProPromo2026/T-SEC-600-STG_11/assets/145432284/41f58f79-d88c-4107-b972-0db000f34912)


En utilisant ces identifiants en connexion SSH ```ssh jaskier@[IP]``` avec le mot de passe correspondant.

![03](https://github.com/EpitechMscProPromo2026/T-SEC-600-STG_11/assets/145432284/3e4d5400-974f-4da2-8bdf-1f9ede4f4e93)


Finalement en se connectant on check le contenu avec un ls et son tombe sur le flag du user.txt :

> EPI{R3Sp3C7_D03sNT_M4k3_h1S70rY}

![04](https://github.com/EpitechMscProPromo2026/T-SEC-600-STG_11/assets/145432284/c8b1cdfc-6afd-4514-ac44-72447a573660)

## Récupération du `root.txt` (+20)

En regardant les privilèges avec ```sudo -l``` on y observe que yen a les droits d'execution sur toss-a-coin.py

![05](https://github.com/EpitechMscProPromo2026/T-SEC-600-STG_11/assets/145432284/7e225d59-9783-4779-b53b-cca941734d63)


De plus dans le repertoire de jaskier il y a un script python avec un import random

Donc en utilisant cette faille on crée un fichier random.py utilisé par le script Python avec reverse shell pour obtenir un accès en tant qu'utilisateur "yen"

![06](https://github.com/EpitechMscProPromo2026/T-SEC-600-STG_11/assets/145432284/64e14c3c-a10f-47fd-a26f-406582cfc00b)

Contenu du script Python : 
```
import os
os.system("/bin/bash")
```

![07](https://github.com/EpitechMscProPromo2026/T-SEC-600-STG_11/assets/145432284/81d010ae-ad8c-48be-bbb4-15c5d3953958)


On exécute alors le fichier toss-a-coin.py avec l'utilisateur yen

En regardant dans le /home/yen on tombe sur un fichier nommé "portal"

![08](https://github.com/EpitechMscProPromo2026/T-SEC-600-STG_11/assets/145432284/c38598ea-5380-4221-b246-6ec56d5a35e6)


On comprend que c'est un fichier illisible donc on se renseigne

![09](https://github.com/EpitechMscProPromo2026/T-SEC-600-STG_11/assets/145432284/0d483025-b855-48fe-8616-6862a057dbf0)

C'est juste un fichier executable donc ./portal

![10](https://github.com/EpitechMscProPromo2026/T-SEC-600-STG_11/assets/145432284/e33c5816-c580-43d4-9caa-18301b497fdb)

on crée donc un fichier date avec 
```
#!/bin/bash
/bin/bash
```

![11](https://github.com/EpitechMscProPromo2026/T-SEC-600-STG_11/assets/145432284/e2a17a9c-1dd2-4611-9963-dc294feef84a)

Puis on se donne les droits avec ```chmod +x```, on ajoute le répertoire `/home/yen` à la variable PATH en utilisant la commande `export PATH=/home/yen:$PATH`.

Et on accède a Geralt en executant portal

![12](https://github.com/EpitechMscProPromo2026/T-SEC-600-STG_11/assets/145432284/2076a46a-96b1-4702-a466-5f3eee515f7e)

En allant dans /home/geralt et on arrive sur un password.txt avec écrit un mot de passe : "IH4teP0rt4ls"

On regarde les droits de gerald avec un ```sudo -l```, qui nous révèle qu'on peut executer un `/usr/bin/perl`

![13](https://github.com/EpitechMscProPromo2026/T-SEC-600-STG_11/assets/145432284/0f7c6777-c069-4ffb-93da-d552c8cfb212)

On lance donc avec perl pour faire une escalation de privilège

```sudo perl -e 'exec "/bin/sh";'```

on trouve finalement le root.txt dans /root

![14](https://github.com/EpitechMscProPromo2026/T-SEC-600-STG_11/assets/145432284/43a38e50-5147-4719-ad16-ce616a8a0088)

> EPI{D3s71Ny_1s_Ju5t_Th3_3mB0D1m3Nt_0f_Th3_S0uL_S_D3s1R3_T0_Gr0W}
