
# 🧠 NLP Service – Scikit-learn + CRF NER

Extraction de villes de départ et d’arrivée depuis une phrase utilisateur.

---

## 🎯 Objectif

Ce service NLP permet d’extraire automatiquement :

- La ville de départ  
- La ville d’arrivée  
- Déterminer si la phrase est une demande de trajet valide (`is_valid`)  

à partir d’une phrase utilisateur saisie dans un chatbot.

### Exemple

Entrée :

Je veux aller de Paris à Lyon demain matin  

Sortie :

is_valid = True  
departure = Paris  
arrival = Lyon  

Le modèle repose sur une approche classique Machine Learning combinant :

- Une classification binaire (valide / invalide)  
- Un modèle NER basé sur un Conditional Random Field (CRF)

---

# 🏗 Architecture NLP

Dataset CSV  
↓  
Split train / val / test  
↓  
Classification (is_valid)  
- TF-IDF  
- Logistic Regression  
↓  
NER  
- Tokenisation  
- Feature engineering  
- CRF  
↓  
Évaluation  
↓  
Sauvegarde modèles  
↓  
Service Predictor  

---

# 📦 Dataset

## Format utilisé

Chaque ligne du dataset contient :

| Colonne | Description |
|----------|-------------|
| text | Phrase utilisateur |
| departure_span_start | Index début ville départ |
| departure_span_end | Index fin ville départ |
| arrival_span_start | Index début ville arrivée |
| arrival_span_end | Index fin ville arrivée |
| is_valid | 1 si phrase valide |

Les spans permettent de générer automatiquement les labels BIO pour l’entraînement du modèle NER.

---

# ✂️ Split des données

Script : split_chargeur.py  

Répartition :

- 70 % Train  
- 15 % Validation  
- 15 % Test  

Caractéristiques :

- Stratification sur `is_valid`  
- random_state = 42  

---

# 🤖 Modèles utilisés

## Classification – is_valid

Pipeline :

TfidfVectorizer  
→ LogisticRegression  

Pourquoi ce choix ?

- Modèle simple et rapide  
- Très performant sur texte court  
- Faible coût computationnel  
- Suffisant pour une tâche binaire  

---

## NER – Conditional Random Field (CRF)

Implémentation : sklearn-crfsuite  

Pourquoi un CRF ?

- Adapté aux tâches séquentielles  
- Prend en compte le contexte des tokens voisins  
- Léger comparé aux Transformers  
- Interprétable  
- Suffisant pour un vocabulaire contrôlé  

---

# 🏷 Stratégie d’annotation (BIO)

Labels utilisés :

O  
B-DEP  
I-DEP  
B-ARR  
I-ARR  

Signification :

- B- : début d’une entité  
- I- : continuation d’une entité  
- O : hors entité  

Exemple :

Phrase :  
Je vais de Paris à Lyon  

Je → O  
vais → O  
de → O  
Paris → B-DEP  
à → O  
Lyon → B-ARR  

---

# 🔎 Tokenisation et Feature Engineering

Pour chaque token, nous extrayons :

- Le token en minuscule  
- Le token original  
- Longueur du token  
- Si le token est en majuscule  
- Si le token commence par une majuscule  
- Si le token contient un tiret  
- Si le token est numérique  
- Le token précédent  
- Le token suivant  

Cette approche permet au CRF d’apprendre des motifs comme :

- de + VILLE  
- depuis + VILLE  
- VILLE à VILLE  

---

# ⚙️ Entraînement

## Classification

- TfidfVectorizer  
- LogisticRegression (max_iter = 1000)  

## CRF – Hyperparamètres

| Paramètre | Valeur |
|------------|--------|
| algorithm | lbfgs |
| c1 | 0.1 |
| c2 | 0.1 |
| max_iterations | 100 |
| all_possible_transitions | True |

Signification :

- c1 → régularisation L1  
- c2 → régularisation L2  
- all_possible_transitions → autorise toutes les transitions BIO possibles  

---

# 📊 Métriques

## Classification

- Accuracy  
- Precision  
- Recall  
- F1-score  

## NER

- Accuracy départ  
- Accuracy arrivée  
- Exact match (DEP + ARR corrects)  

Pourquoi exact match ?

Car l’objectif métier exige que les deux villes soient correctes simultanément.

---

# 📊 Évaluation du modèle

## 1. Protocole d’évaluation

L’évaluation du modèle a été réalisée sur le **jeu de test**, représentant **15 %** du dataset total.

Ce jeu de test est :

- Strictement séparé des données d’entraînement
- Jamais vu pendant le training
- Stratifié selon la variable `is_valid`
- Généré avec un `random_state = 42` afin d’assurer la reproductibilité

L’objectif de cette évaluation est de mesurer :

- La performance de la classification (`is_valid`)
- La qualité de l’extraction des entités (ville de départ et ville d’arrivée)

---

## 2. Résultats – Classification `is_valid`

La classification binaire a été évaluée à l’aide des métriques suivantes :

- Accuracy
- Precision
- Recall
- F1-score

### Résultats obtenus

Insérer ici le screenshot du `classification_report` :

![Figure 1 – Résultats de la classification sur le jeu de test](../screenshots/nlp_sklearn/result_train.png)

Figure 1 – Résultats de la classification sur le jeu de test.

### Analyse

Le modèle atteint une **accuracy de 1.00** sur le jeu de test.

Cela s’explique par :

- Une séparation claire entre phrases valides et invalides
- Une forte cohérence du dataset synthétique
- Une tâche binaire relativement bien définie

La précision et le rappel sont également équilibrés, indiquant l’absence de biais significatif entre les classes.

---

## 3. Résultats – Extraction des entités (NER)

L’extraction des entités a été évaluée uniquement sur les phrases valides du jeu de test.

Les métriques suivantes ont été calculées :

- Accuracy pour la ville de départ
- Accuracy pour la ville d’arrivée
- Exact match (les deux entités correctes simultanément)

### Résultats obtenus

Insérer ici le screenshot des métriques NER :

![Figure 2 – Performances NER (DEP/ARR) sur le jeu de test](../screenshots/nlp_sklearn/extraction_DEP_ARR.png)

Figure 2 – Performances du modèle NER sur le jeu de test.

Les performances observées sont :

- DEP accuracy ≈ 0.75  
- ARR accuracy ≈ 0.75  
- Exact match ≈ 0.58  

### Analyse

L’extraction d’entités est significativement plus complexe que la classification binaire.

Une accuracy d’environ 75 % par entité montre que :

- Le modèle apprend correctement les structures typiques telles que « de + VILLE » ou « VILLE à VILLE »
- Le CRF exploite efficacement le contexte local des tokens

Cependant, l’exact match (≈ 58 %) révèle que :

- Il est plus difficile d’extraire simultanément les deux entités correctement
- Certaines erreurs surviennent sur des formulations plus atypiques
- Le modèle peut confondre l’ordre départ / arrivée dans certaines structures inversées

---

## 4. Interprétation globale

Les résultats démontrent que :

- La classification `is_valid` est maîtrisée
- L’extraction NER atteint des performances satisfaisantes pour une approche légère sans Transformer
- Le modèle est fonctionnel et exploitable dans un contexte applicatif

Ces performances valident le choix d’une architecture basée sur :

- TF-IDF + Logistic Regression pour la classification
- CRF pour l’extraction séquentielle

---

## 5. Limites observées

Certaines erreurs apparaissent dans les cas suivants :

- Structures syntaxiques rares
- Formulations ambiguës
- Ordres inversés non fréquents dans le dataset
- Villes peu représentées

Ces limites pourront être améliorées via :

- Un enrichissement du dataset
- Une augmentation de la diversité linguistique
- Un benchmark avec un modèle Transformer (ex : CamemBERT)

---

## Conclusion de l’évaluation

L’évaluation confirme que l’architecture retenue permet :

- Une classification robuste des requêtes
- Une extraction fiable des entités principales
- Une solution légère, rapide et reproductible

Le modèle constitue une base solide pour une application conversationnelle orientée transport.

---

# 🚀 Inference

Pipeline :

Phrase utilisateur  
↓  
Classification (is_valid)  
↓  
Si valide  
↓  
Tokenisation  
↓  
CRF  
↓  
Reconstruction entités  
↓  
Extraction departure / arrival  

Le service supporte :

- Mode CLI  
- Mode API (FastAPI)  
- Traitement synchrone  

---

# 🏁 Conclusion

Ce service implémente une solution NER robuste en français basée sur une approche classique Machine Learning (TF-IDF + Logistic Regression + CRF).

Il permet :

- La détection automatique des requêtes de trajet  
- L’extraction fiable des villes de départ et d’arrivée  

Il constitue la brique NLP centrale du système.