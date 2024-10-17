# Grand Line 🔳🔳

## Récupération du `user.txt`

> EPI{1f_1_91V3_uP_noW_1M_9o1N9_7O_r39R37_17}

La première étape consiste a scanner les ports ouverts sur la machine cible.

```bash
nmap -sV -sC <target>
```

_- `-sV` : détecte la version des services en cours d'exécution sur les ports ouverts._

_- `-sC` : exécute des scripts de détection par défaut pour obtenir plus d'informations sur les services._

- Résultat :

![Scan Nmap](images/GrandeLine/01.png)

Le scan révèle que les ports suivants sont ouverts :

- **`21/tcp (FTP)`**
- **`80/tcp (HTTP)`**
- **`8081/tcp (HTTP)`**

Après avoir identifié les services actifs sur la machine cible, nous utilisons `gobuster` pour découvrir les répertoires cachés sur le serveur web.

```bash
gobuster dir -w <chemin_de_la_wordlist> -u <target>
```

_- `dir` : mode de `gobuster` pour découvrir des répertoires._

_- `-w <chemin_de_la_wordlist>` : spécifie le chemin vers la liste de mots utilisée pour tester les noms de répertoires._

_- `-u <target>` : URL de la cible._

- Résultat :

![Scan Gobuster](images/GrandeLine/02.png)

Le scan découvre plusieurs répertoires et fichiers :

- `**/index.html**` : statut 200 (OK)
- `**/lost**` : statut 301 (OK)

En allant sur le répertoire `/lost`, on trouve un fichier `**note.txt**` qui contient des informations utiles.

```url
<target>/lost
```

![Fichier note.txt](images/GrandeLine/03.png)

Le fichier `note.txt` contient un message de l'administrateur du serveur.

> You're stubborn, I told you everything is on the other port, have you tried map ?

![Fichier note.txt](images/GrandeLine/09.png)

Allons voir du coté du port `8081`.

```url
<target>:8081
```

Le port `8081` héberge une page d'accueil
![Page d'accueil du port 8081](images/GrandeLine/05.png)

En explorant le site, on trouve une page de connexion.

```url
<target>:8081/login
```

![Page de connexion](images/GrandeLine/06.png)

Et une page forgot password.

```url
<target>:8081/forgot
```

![Message d'erreur](images/GrandeLine/07.png)

Retournons fouiller du coté du dossier `/lost`. En fouillant sur internet, on s'apercoit que souvent un `/.git` est accessible.
Ont relance Gobuster mais cette fois-ci sur le dossier `/lost`.

Nous décidons donc de regarder de plus près ce que contient ce dossier.
Plusieurs commits sont disponibles. Il va falloir fouiller un peu plus pour trouver des informations intéressantes.

Il faut convertir le fichier en `.gz`

```bash
mv <fichier> <fichier>.gz
```

Nous utilisons `pigz` pour décompresser les fichiers et `cat` pour en faire la lecture.

```bash
pigz -d <fichier>
cat <fichier>
```

![Decompression fichier](images/GrandeLine/10.png)
![Lecture du commit](images/GrandeLine/11.png)

Ont fini par trouver deux commits qui nous interessent avec des informations utiles.

![Commit 1](images/GrandeLine/12.png)
![Commit 2](images/GrandeLine/13.png)

C'est cette clé qui nous permettra de nous connecter au serveur FTP.

> key = 57db5c001c802fc4be25afb02cff9bf8

Allons utiliser postman pour voir ce que nous retourne la clé.

![Postman](images/GrandeLine/14.png)

Nous avons donc un token qui nous permettra de nous connecter au serveur FTP de Zoro.

> 1_G07_L0S7_0NC3_4G41n

![Connexion FTP](images/GrandeLine/15.png)

Il n'y a plus qu'a cat le fichier `user.txt` pour obtenir le flag.

```bash
cat user.txt
```

## Récupération du `root.txt`

> EPI{r_W3_Phri3nD2_0R_ph032_7h@\_KInd_0F_7Hin9_J00_D3CiD3_J00R53lv32}

Pour obtenir le flag `root.txt`, nous devons trouver un moyen d'escalader les privilèges.
Connectons-nous au compte de Luffy.

```bash
su luffy
```

Pour son mot de passe, il va falloir faire au plus simple. Tout est dans le titre de l'animé.

> ONEPIECE

![Connexion Luffy](images/GrandeLine/16.png)

Pour fini ont se donne les droits changer le propriétaire et le groupe des fichiers et répertoires.

```bash
sudo chown -R luffy:luffy /*
```

![Changement de propriétaire](images/GrandeLine/17.png)

Il ne reste plus qu'a find les fichiers `.txt` pour obtenir le root flag.

```bash
find / -iname *.txt
```

![Root Flag](images/GrandeLine/18.png)

![Root Flag](images/GrandeLine/19.png)

---
