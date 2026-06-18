# AGENTS.md

## Projet

Brainrot Kitchen est une PWA simple hébergée sur GitHub Pages.

Elle utilise un Cloudflare Worker pour appeler Gemini et générer des idées de repas.

## Architecture

* Frontend : GitHub Pages
* API Worker : `https://brainrot-kitchen.eve-vinclair.workers.dev/api/recipes`
* Endpoint : `POST /api/recipes`
* Modèle Gemini : `gemini-2.5-flash`
* Secret Cloudflare : `GEMINI_API_KEY`

CORS autorisé pour :

* `https://eveyonline.github.io`
* `http://localhost:8000`

## Rôle de ce fichier

Ce fichier contient les règles stables du projet pour les agents IA.

L’état courant du projet, les décisions récentes, les tentatives annulées et les prochaines étapes doivent être tenus à jour dans :

```txt
PROJECT_STATE.md
```

Avant de proposer une modification, lire aussi `PROJECT_STATE.md` si le fichier existe.

## Objectif produit

L’application doit rester simple, mobile-friendly et compréhensible.

Priorités générales :

* stabilité ;
* génération correcte ;
* langue adaptée ;
* expérience utilisateur claire ;
* progression par petites étapes.

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
* base de données sans besoin clair ;
* grosse bibliothèque de recettes trop tôt.

## Avant toute modification

Toujours indiquer :

* pourquoi le changement est proposé ;
* le risque éventuel ;
* les fichiers concernés.

Ne pas modifier plusieurs zones du projet en même temps si ce n’est pas nécessaire.

## Règles Gemini / JSON

Le prompt envoyé à Gemini doit :

* respecter la langue du navigateur ou du smartphone si possible ;
* utiliser le français par défaut si la langue n’est pas claire ;
* garder exactement le format JSON attendu ;
* ne jamais traduire les clés JSON ;
* ne traduire que les valeurs visibles par l’utilisateur : titres, descriptions, ingrédients, étapes ;
* ne rien ajouter avant ou après le JSON.

Si Gemini renvoie une réponse non valide, privilégier d’abord :

* une amélioration ciblée du prompt ;
* une validation/parsing plus robuste côté Worker ;
* un message d’erreur clair côté frontend.

Ne pas refactorer tout le frontend pour corriger un problème de réponse JSON.

## Sécurité

Ne jamais commiter :

* secrets ;
* tokens ;
* clés API ;
* fichiers locaux sensibles ;
* contenu de `.wrangler` si non prévu ;
* variables d’environnement privées.

Le secret Cloudflare attendu est :

```txt
GEMINI_API_KEY
```

Il doit rester géré côté Cloudflare, pas dans le dépôt Git.

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
