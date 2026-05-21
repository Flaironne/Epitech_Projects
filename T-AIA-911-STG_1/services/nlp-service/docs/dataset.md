# 📚 Génération et structuration du dataset

## 1. Objectif

L’objectif du dataset est d’entraîner un système NLP capable de :

- Déterminer si une phrase correspond à une demande de trajet en train (`is_valid`)
- Extraire la ville de départ
- Extraire la ville d’arrivée

Le dataset simule des requêtes réalistes en français, incluant des variations linguistiques et du bruit contrôlé.

---

## 2. Méthodologie de génération

Le corpus a été généré de manière synthétique à l’aide :

- d’un script Python de génération contrôlée
- d’un ensemble de templates linguistiques définis par nos soins
- d’un modèle d’IA générative utilisé comme outil d’augmentation linguistique

### Utilisation d’une IA générative

L’IA générative a été utilisée dans une démarche de **prompt engineering structuré**.

Nous avons fourni des instructions précises concernant :

- les structures syntaxiques attendues
- la présence obligatoire d’une origine et d’une destination
- l’inclusion de phrases invalides
- l’introduction de bruit linguistique
- la diversité des formulations

L’IA n’a pas généré librement du texte : elle a été guidée par un cahier des charges précis afin de produire des phrases exploitables pour l’apprentissage supervisé.

Les annotations finales (spans caractères, entités canoniques et surfaces) ont été générées et vérifiées programmaticalement afin de garantir la cohérence et la reproductibilité du dataset.

---

## 3. Structure des phrases

### 3.1 Requêtes valides simples

Exemples :

- `Je voudrais aller de Toulouse à Bordeaux`
- `Je veux un billet de train de Paris à Lyon`
- `Trajet Strasbourg Marseille`
- `Il y a-t-il des trains de Nantes à Montaigu ?`

### 3.2 Requêtes avec structures variées

- `Depuis Paris, je veux aller à Strasbourg`
- `Je souhaite me rendre à Lyon depuis Marseille`
- `Paris Toulouse`
- `Paris -> Toulouse`

### 3.3 Phrases invalides

Exemples :

- `Bonjour`
- `Quel temps fait-il à Paris ?`
- `Je veux du caca`
- `Je veux un billet`

Ces phrases permettent d’entraîner la classification `is_valid`.

---

## 4. Injection de bruit (data augmentation)

Afin d’améliorer la robustesse du modèle, du bruit contrôlé a été introduit :

- Variations de casse (`paris`, `PARIS`, `PaRiS`)
- Suppression d’accents (`Orléans` → `Orleans`)
- Variation tirets / espaces (`Saint-Denis` → `Saint Denis`)
- Fautes de frappe simulées (`Nantes` → `Nates`, `Paris` → `Parais`)
- Ordre syntaxique variable

Environ **30 % des phrases contiennent au moins une forme de bruit linguistique**.

---

## 5. Annotation des données

Chaque phrase valide contient :

- `departure_canonical`
- `arrival_canonical`
- `departure_surface`
- `arrival_surface`
- `departure_span_start`
- `departure_span_end`
- `arrival_span_start`
- `arrival_span_end`

Les spans caractères permettent d’identifier précisément la position des entités dans le texte.

### Exemple
```
Je veux aller de Strasbourg à Marseille
```
departure_span_start = 17
arrival_span_start = 30


L’utilisation des spans garantit :

- aucune perte d’exemples valides
- une annotation cohérente
- un apprentissage fiable du modèle NER

---

## 6. Jeux de données générés

### Dataset 10 000 phrases (version initiale)

| Élément | Valeur |
|----------|--------|
| Nombre total de phrases | 10 000 |
| Phrases valides | ~82 % |
| Phrases invalides | ~18 % |
| Annotation | DEP / ARR + spans |

Ce dataset a permis de valider le pipeline complet (classification + NER).

---

### Dataset 100 000 phrases (version augmentée)

| Élément | Valeur |
|----------|--------|
| Nombre total de phrases | 100 000 |
| Schéma | Identique au dataset 10k |
| Objectif | Améliorer la généralisation |

Ce dataset a permis d’augmenter fortement la diversité linguistique et de réduire l’overfitting.

---

## 7. Justification des choix

L’approche synthétique présente plusieurs avantages :

- Contrôle total des annotations
- Reproductibilité complète
- Diversité linguistique élevée
- Génération rapide de volumes importants
- Possibilité d’introduire des cas ambigus et du bruit contrôlé

---

## 8. Limites

- Données synthétiques (non issues d’utilisateurs réels)
- Possible biais lié aux templates
- Liste de villes contrôlée et non exhaustive

Ces limites pourront être adressées par l’intégration future de données réelles.

---

## Résumé

Nous avons utilisé une approche hybride combinant génération programmatique et IA générative dans une démarche de prompt engineering structuré afin de produire un dataset contrôlé, annoté et adapté à notre tâche NLP.