# 🧠 NLP Service – CamemBERT NER

Extraction de villes de départ et d’arrivée depuis une phrase utilisateur.

---

## 🎯 Objectif

Ce service NLP permet d’extraire automatiquement :

- 🟢 La ville de départ
- 🔵 La ville d’arrivée

à partir d’une phrase utilisateur saisie dans un chatbot.

### Exemple

Entrée :

```
Je veux aller de Paris à Lyon demain matin
```

Sortie :

```
departure = Paris arrival = Lyon
```

Le modèle repose sur une approche **Named Entity Recognition (NER)** fine-tunée avec CamemBERT.

---

## 🏗 Architecture NLP

```
Dataset CSV
↓
Split train / val / test
↓
Tokenisation + alignement BIO
↓
Fine-tuning CamemBERT
↓
Évaluation (F1, Precision, Recall)
↓
Sauvegarde modèle
↓
Service Predictor (inference)
```

---

# 📦 Dataset

## Format utilisé (avec spans)

Chaque ligne du dataset contient :

| Colonne              | Description               |
| -------------------- | ------------------------- |
| text                 | Phrase utilisateur        |
| departure_span_start | Index début ville départ  |
| departure_span_end   | Index fin ville départ    |
| arrival_span_start   | Index début ville arrivée |
| arrival_span_end     | Index fin ville arrivée   |
| is_valid             | 1 si phrase valide        |

Le dataset est généré automatiquement via ChatGPT, puis enrichi avec les positions exactes des entités (spans).

---

# ✂️ Split des données

Script : `split_chargeur.py`

Répartition :

- 70% Train
- 15% Validation
- 15% Test

Caractéristiques :

- Stratification sur `is_valid`
- `random_state = 42` pour reproductibilité

---

# 🤖 Modèle utilisé

Modèle de base :

`camembert-base`

### Pourquoi CamemBERT ?

- Pré-entraîné sur un large corpus français
- Architecture Transformer (BERT-like)
- Performant pour le NER
- Adapté au langage conversationnel

---

# 🏷 Stratégie d’annotation (BIO)

Labels utilisés :

```
O
B-DEPARTURE
I-DEPARTURE
B-ARRIVAL
I-ARRIVAL
```

Signification :

- **B-** : début d’une entité
- **I-** : continuation d’une entité
- **O** : hors entité

### Exemple

Phrase :

```
Je vais de Paris à Lyon
```

| Token | Label       |
| ----- | ----------- |
| Je    | O           |
| vais  | O           |
| de    | O           |
| Paris | B-DEPARTURE |
| à     | O           |
| Lyon  | B-ARRIVAL   |

---

# 🔎 Tokenisation et alignement

Problème :

CamemBERT découpe les mots en sous-tokens.

Solution :

- Utilisation de `offset_mapping`
- Alignement des spans caractères avec les tokens
- Attribution automatique des labels BIO

Fonction clé :

```
tokenize_and_align()
```

Cela permet :

- Alignement précis des entités
- Gestion des sous-tokens
- Compatibilité avec HuggingFace Trainer

---

# ⚙️ Entraînement

Hyperparamètres :

| Paramètre     | Valeur |
| ------------- | ------ |
| Batch size    | 8      |
| Epochs        | 5      |
| Learning rate | 2e-5   |
| Weight decay  | 0.01   |

Configuration :

- `eval_strategy = "epoch"`
- `save_strategy = "epoch"`
- `load_best_model_at_end = True`
- `metric_for_best_model = "f1"`

Le meilleur modèle est automatiquement conservé.

---

# 📊 Métriques

Évaluation réalisée avec `seqeval`.

Métriques calculées :

- Precision
- Recall
- F1-score

## Pourquoi F1-score ?

En NER :

- Precision → qualité des entités détectées
- Recall → capacité à détecter toutes les entités
- F1 → équilibre entre précision et rappel

Le modèle est sélectionné selon la meilleure valeur de F1.

---

# 🧪 Évaluation

À la fin de l’entraînement :

```python
trainer.evaluate(test_ds)

```

Permet de mesurer la performance sur des données jamais vues.

🚀 Inference

Pipeline d’inférence :

```
Phrase utilisateur
   ↓
Tokenisation
   ↓
Prédiction (logits)
   ↓
Argmax
   ↓
Reconstruction entités
   ↓
Extraction departure / arrival

```

Le service supporte :

Lecture via fichier

Lecture via STDIN

Mode interactif CLI

---

### Points forts

Fine-tuning spécifique au domaine transport

Dataset volumineux (~100k exemples)

Utilisation de spans précis

Splits stratifiés

Métriques adaptées au NER

Pipeline reproductible

---

### ⚠️ Limites

Dataset généré automatiquement (risque de biais)

Sensible aux formulations rares

Ne gère pas encore :

Fautes d’orthographe

Villes implicites

Multi-destinations

---

### 🔮 Améliorations possibles

Data augmentation

Injection de bruit (robustesse aux fautes)

Entraînement sur données réelles utilisateur

Early stopping

Hyperparameter tuning

Distillation vers modèle plus léger

---

### 🏁 Conclusion

Ce service implémente une solution NER robuste en français basée sur CamemBERT pour extraire :

Ville de départ

Ville d’arrivée

Il constitue la brique NLP centrale du chatbot et permet l’extraction automatique d’entités à partir de texte libre.
