# Secrets of the Maw 🔳🔳

## Récupération du `user.txt`

> EPI{I_MuS7_F1nD_@_W4y_0Ut}

On connaît les banwords et on sait comment fonctionne la gestion des commandes, de ce fait on sait qu'on peut utiliser dir ou `\ls` pour explorer les dossiers du serveur.

```bash
\ls -a /home/six
```

![image](https://github.com/EpitechMscProPromo2026/T-SEC-600-STG_11/assets/91117127/49a3f1f5-936b-440a-bd3e-ab851e7721ee)

On remarque un script `.musicbox` dans `/home/six` qui prend un paramètre, de ce fait on peut réaliser la commande ci-dessous.

```bash
echo "cat /home/six/user.txt" | sudo -u six /home/six/.musicbox
````

![image](https://github.com/EpitechMscProPromo2026/T-SEC-600-STG_11/assets/91117127/fe4f76f5-c88e-40df-8a39-0f6dbe948f43)

## Récupération du `root.txt`

En listant les images dans le dossier `/var/www/files` on trouve une image `musicbox.jpg`. En faisant le lien avec le script vu au préalable on peut en déduire qu'il faut se concentrer sur celle-ci.

```bash
\ls ../../files/images
```

![image](https://github.com/EpitechMscProPromo2026/T-SEC-600-STG_11/assets/91117127/ec2b5f5c-4aa6-45df-b065-e9a87f8fad0a)

```bash
base64 ../../files/images/musicbox.jpg
```

![image](https://github.com/EpitechMscProPromo2026/T-SEC-600-STG_11/assets/91117127/70654780-28a7-499c-87a2-dcdd06f67ac7)

L'image ressemble à ceci :

![image](https://github.com/EpitechMscProPromo2026/T-SEC-600-STG_11/assets/91117127/67cabac3-24f2-418a-955b-c8ca4a882781)

Après avoir pris plusieurs années pour comprendre à quoi sert ce truc on a tenté d'utiliser l'outil `stegcracker` (qui est un outils de brute-force en stéganographie récupérant les données cachées dans les fichiers).

```bash
stegcracker <path-to-image> <wordslist>
```

> Le mot de passe de l'utilisateur `mono` est `I_MuSt_St0p_Th3_Thin_m4n`

On peut alors se connecter en ssh à cet utilisateur.

```
ssh mono@<target>
```

![image](https://github.com/EpitechMscProPromo2026/T-SEC-600-STG_11/assets/91117127/c0652da5-8294-466e-8e20-cc01766afb1d)

On s'aperçoit que docker est installé et grâce à internet on a trouvé l'utilisation d'une faille nommée Docker Escape.

```bash
docker run -v /:/mnt --rm -it alpine chroot /mnt sh
```

Cette commande effectue plusieurs actions spécifiques qui peuvent présenter une faille de sécurité si elle est exécutée avec des privilèges élevés. 

### Voici une explication détaillée :

`docker run` : Lance un nouveau conteneur Docker.

`-v /:/mnt` : Monte le répertoire racine de l'hôte (/) dans le conteneur Docker au chemin /mnt. Cela signifie que tout le système de fichiers de l'hôte est accessible dans le conteneur via le chemin /mnt.

`--rm` : Supprime automatiquement le conteneur après son arrêt. C'est utile pour éviter l'accumulation de conteneurs inutilisés.

`-it` : Combine deux options :

`-i (interactive)` : Maintient STDIN ouvert même si personne n'est connecté.
`-t (tty)` : Alloue un terminal pseudo-TTY.
`alpine` : Indique que le conteneur utilise l'image Docker Alpine Linux, qui est une distribution légère de Linux.

`chroot /mnt` : Change la racine du système de fichiers du conteneur à /mnt. Cela signifie que toutes les opérations de fichiers se réfèrent maintenant au système de fichiers de l'hôte.

`sh` : Lance un shell (sh) après avoir changé la racine avec chroot.

### Ce que fait cette commande :

- Montage du système de fichiers de l'hôte : Monte le système de fichiers racine de l'hôte dans le conteneur à /mnt.
- Changement de racine : Change la racine du système de fichiers à /mnt, donnant ainsi au conteneur accès direct à tout le système de fichiers de l'hôte.
- Shell interactif : Lance un shell interactif avec la racine du système de fichiers de l'hôte comme point de départ.

Cette commande exploite une faille potentielle de sécurité connue sous le nom de Docker Escape. 

### En résumé :

- Accès complet au système de fichiers de l'hôte : En montant le système de fichiers racine de l'hôte et en utilisant chroot pour changer la racine, le conteneur obtient un accès direct à tout le système de fichiers de l'hôte. Cela permet de lire, écrire, modifier et supprimer des fichiers de l'hôte.
- Privileged Access : Si le conteneur est exécuté avec des privilèges suffisants (par exemple, en tant que root), l'utilisateur à l'intérieur du conteneur peut effectuer des actions avec des droits élevés sur le système de fichiers de l'hôte, compromettant ainsi l'intégrité et la sécurité de l'hôte.

L'exécution de cette commande avec des privilèges root peut compromettre gravement la sécurité de l'hôte, permettant potentiellement à un attaquant de :

- Exfiltrer des données sensibles.
- Installer des logiciels malveillants.
- Modifier ou supprimer des fichiers critiques.
- Échapper à l'isolation de Docker et accéder directement à l'hôte.

Une fois cette commande lancée on est alors connecté en tant que root dans le container docker, nous avons aussi accès à tous les fichier systèmes.

![image](https://github.com/EpitechMscProPromo2026/T-SEC-600-STG_11/assets/91117127/5ac9ba85-c4ce-488f-a85a-2d0589af3798)

En regardant ce qui se trouve dans le dossier `/root` on trouve alors le flag `root.txt`.

![image](https://github.com/EpitechMscProPromo2026/T-SEC-600-STG_11/assets/91117127/a9e956f0-0ecd-4842-b9c0-db4ee73a5953)
