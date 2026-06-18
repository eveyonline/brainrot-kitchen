# AGENTS.md

## Projet

Brainrot Kitchen est une PWA simple hébergée sur GitHub Pages.

Elle utilise un Cloudflare Worker pour appeler Gemini et générer des idées de repas.

## Architecture actuelle

* Frontend : GitHub Pages
* API Worker : `https://brainrot-kitchen.eve-vinclair.workers.dev/api/recipes`
* Endpoint : `POST /api/recipes`
* Modèle Gemini : `gemini-2.5-flash`
* Secret Cloudflare : `GEMINI_API_KEY`

CORS autorisé pour :

* `https://eveyonline.github.io`
* `http://localhost:8000`

## Objectif produit

L’application doit rester simple, mobile-friendly et compréhensible.

Priorité actuelle :

* stabilité ;
* génération correcte ;
* langue adaptée ;
* expérience utilisateur claire.

## Méthode de travail

Travailler en mode MVP/agile.

Privilégier :

* une étape à la fois ;
* petits commits ;
* changements ciblés ;
* explication des risques ;
* compréhension avant exécution ;
* stabilité avant nouvelles fonctionnalités.

Éviter :

* grosses refontes ;
* changements multiples simultanés ;
* régénération complète du projet ;
* frameworks ajoutés sans nécessité ;
* base de données pour l’instant ;
* grosse bibliothèque de recettes maintenant.

## Avant toute modification

Toujours indiquer :

* pourquoi le changement est proposé ;
* le risque éventuel ;
* les fichiers concernés.

## Règles Gemini / JSON

Le prompt envoyé à Gemini doit :

* respecter la langue du navigateur ou du smartphone si possible ;
* utiliser le français par défaut si la langue n’est pas claire ;
* garder exactement le format JSON attendu ;
* ne jamais traduire les clés JSON ;
* ne traduire que les valeurs visibles par l’utilisateur : titres, descriptions, ingrédients, étapes ;
* ne rien ajouter avant ou après le JSON.

## Git et déploiement

Avant un commit, demander ou vérifier :

```bash
git status
```

Ordre de travail préféré :

1. Modifier le code localement.
2. Déployer le Worker avec :

```bash
npx wrangler deploy
```

3. Tester depuis GitHub Pages.
4. Si le résultat est OK seulement :

```bash
git add .
git commit -m "..."
git push
```

Important : `npx wrangler deploy` déploie le Worker local vers Cloudflare, mais ne commit rien sur GitHub.

Avant un déploiement, vérifier qu’aucun fichier sensible n’est présent.

Ne pas proposer une release GitHub sauf si cela devient vraiment pertinent. Pour l’instant, un commit suffit.

## Roadmap courte

### MVP

* saisie texte ;
* recettes ;
* appel Gemini stable.

### V1

* micro ;
* favoris ;
* historique.

### V2

* liste de courses.

### V3

* gestion du stock.

### Idée future

* Brainrot School Furnitures.
