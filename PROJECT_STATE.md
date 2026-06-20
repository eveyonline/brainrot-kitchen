Je veux faire un résumé de fin de session pour Brainrot Kitchen, sans modifier le prompt initial du projet.

À partir de ce qu’on vient de faire, rédige un résumé clair et court avec ces sections :

## Session summary

### What was checked

* Liste uniquement ce qui a été vérifié pendant cette session.

### What was changed

* Liste uniquement les fichiers réellement modifiés.
* Si aucun fichier n’a été modifié, écris : “No code change.”

### What was validated

* Liste les comportements validés.
* Ne suppose rien qui n’a pas été testé.

### Current project state

* Résume l’état actuel du projet en quelques points.
* Mentionne si le repo est propre, commit/push fait ou non, seulement si cela a été vérifié.

### Known debt

* Liste les dettes encore ouvertes.
* Ne les transforme pas en actions immédiates.

### Next recommended step

* Propose une seule prochaine action.
* Elle doit être petite, MVP/agile, et faisable en 10 à 15 minutes.
* Ne propose pas plusieurs options.

### Rules to keep

* Une seule modification à la fois.
* Ne pas refactorer inutilement.
* Ne pas ajouter de base de données.
* Ne pas créer de grosse bibliothèque de recettes.
* Ne pas traiter la variation Dad/Mum + garçons maintenant.
* Ne pas proposer de release GitHub sauf vrai jalon stable.
* Attendre validation avant toute modification.

Format attendu :

* Markdown simple.
* Court.
* Factuel.
* Pas de code sauf si nécessaire.
* Ne réécris pas tout le prompt initial.
* Ne modifie pas AGENTS.md, PROJECT_STATE.md ou les skills directement ; donne seulement le texte du résumé.
