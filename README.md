# No More Hash 2

no-more-hash-2 est une petite application Discord qui permet d'envoyer un message aux utilisateurs lorsqu'ils écrivent "Théo" avec un "h"

⚠️ Ce projet ne fonctionne qu'avec le mot "théo" ⚠️

## Auteur

-   [@TeoConan](https://github.com/TeoConan)

## Exemples

![Exemple 1](https://raw.githubusercontent.com/TeoConan/no-more-hash-2/main/.doc/exemple-1.png 'Utilisation principale').

## Fonctionnement

no-more-hash analyse les mots pour éviter des attaques par homoglyphes, hérité du package NPM [decent-username](https://www.npmjs.com/package/decent-username) il reprend le même système

-   Replacement des lettres similaires (ex: é,è,ê etc ➡ "e")
-   Remplacement des émojis (ex: 💧, 💦 etc ➡️ "o")
-   Regroupement des mots "suspects" (ex: "t h e o" est regroupé en un seul mot "theo")
-   Correction des mots contenant "theo" (ex: théorème, théorie...)

### Provocations

Si l'utilisateur mentionne l'application, celle-ci répondra par gif ou des messages provocants

![Exemple 2](https://raw.githubusercontent.com/TeoConan/no-more-hash-2/main/.doc/exemple-2.png 'Provocations').

## Installation

### Sources

Dans un premier temps, vous pouvez cloner le projet en local

```shell
git clone git@github.com:TeoConan/no-more-hash-2.git
cd no-more-hash-2
npm install
```

### Fichier env

Vous aurez besoin d'un clé d'api Discord pour faire fonctionner le bot, vous pouvez remplir un fichier `.env` à la racine du projet

```
CLIENT_TOKEN=<api token>
DEBUG=false
APP_ID=<id utilisateur de votre bot discord>
```

## Utilisation

### Tests

Pour exécuter les tests, vous pouvez exécuter la commande `npm start` pour vérifier si tout fonctionne bien

### Dev

La commande `npm run dev` vous permettra de surveiller et compiler votre typescript

### Production

Pour l'utilisation via Discord de l'application, vous pouvez utiliser la commande `npm run prod` pour lancer l'écoute sur vos serveur Discord

Si tout fonctionne bien, vous devriez recevoir ce message :

```
Invite your bot using this URL: https://discord.com/oauth2/authorize?client_id=<id utilisateur de votre bot discord>&permissions=<permissions>&scope=bot
Logged in as <bot name>#<tag>
```

Et votre projet devrait réagir et répondre aux messages entrants sur les différents channels Discord
