#faire un resize et tableau de 100 sur 100
# PCA reduction de dimension
# requilbrage des classes entre normal et pneumonia sur le nombre d'images
# ===============================
# 📚 Etape 0: Importer les librairies
# ===============================
import numpy as np
import os
import matplotlib.pyplot as plt
import seaborn as sns
import random

from tensorflow.keras.preprocessing.image import load_img, img_to_array
from sklearn.tree import DecisionTreeClassifier, plot_tree
from sklearn.preprocessing import LabelEncoder
from sklearn.metrics import (
    accuracy_score,
    confusion_matrix,
    classification_report,
)
from sklearn.model_selection import cross_val_score, GridSearchCV
import joblib

# ===============================
# 📁 Etape 1: Charger les images    
# ===============================
from PIL import Image

def createTrainDataSet(normalPath, pneumoniaPath, multi_class=True):
    data = []
    labels = []

    def get_label_from_filename(filename):
        if 'bacteria' in filename.lower():
            return 'bacteria'
        elif 'virus' in filename.lower():
            return 'virus'
        else:
            return 'unknown'

    for file in os.listdir(normalPath):
        if file.endswith('.DS_Store'):
            continue
        img = Image.open(os.path.join(normalPath, file)).convert('L')
        img = img.resize((64, 64))  # correspond à ta taille initiale
        img = np.array(img, dtype=np.float32) / 255.0
        img = img.flatten()
        data.append(img)
        labels.append('normal')

    for file in os.listdir(pneumoniaPath):
        if file.endswith('.DS_Store'):
            continue
        img = Image.open(os.path.join(pneumoniaPath, file)).convert('L')
        img = img.resize((64, 64))
        img = np.array(img, dtype=np.float32) / 255.0
        img = img.flatten()
        if multi_class:
            label = get_label_from_filename(file)
            if label == 'unknown':
                continue
            labels.append(label)
            data.append(img)

    return np.array(data), np.array(labels)



# ===============================
# Etape 2: Définir les chemins d'accès et charger
# ===============================
train_dir = 'chest_Xray/train/'
test_dir = 'chest_Xray/test/'
val_dir = 'chest_Xray/val/'

normalTrainPath = os.path.join(train_dir, 'NORMAL')
pneumoniaTrainPath = os.path.join(train_dir, 'PNEUMONIA')
normalTestPath = os.path.join(test_dir, 'NORMAL')
pneumoniaTestPath = os.path.join(test_dir, 'PNEUMONIA')
normalValPath = os.path.join(val_dir, 'NORMAL')
pneumoniaValPath = os.path.join(val_dir, 'PNEUMONIA')

X_train, y_train = createTrainDataSet(normalTrainPath, pneumoniaTrainPath, multi_class=True)
X_test, y_test = createTrainDataSet(normalTestPath, pneumoniaTestPath, multi_class=True)
X_val, y_val = createTrainDataSet(normalValPath, pneumoniaValPath, multi_class=True)


print(f"Train samples: {len(X_train)}, Test samples: {len(X_test)}, Val samples: {len(X_val)}")
print(f"Train labels distribution: {np.unique(y_train, return_counts=True)}")

# ===============================
# Etape 3: Contrôle visuel (optional)
# ===============================
def show_sample_images(X, y, n=5):
    indices = random.sample(range(len(X)), n)
    for i in indices:
        plt.imshow(X[i].reshape(64,64), cmap='gray')
        plt.title(f"Label: {y[i]}")
        plt.axis('off')
        plt.show()

# show_sample_images(X_train, y_train)  # Décommenter si tu veux voir des images

# ===============================
# Etape 4: Prétraitement 
# ===============================
X_train_flat = X_train.reshape(X_train.shape[0], -1)
X_test_flat = X_test.reshape(X_test.shape[0], -1)
X_val_flat = X_val.reshape(X_val.shape[0], -1)

label_encoder = LabelEncoder()
y_train_enc = label_encoder.fit_transform(y_train)
y_test_enc = label_encoder.transform(y_test)
y_val_enc = label_encoder.transform(y_val)

print(f"Classes: {label_encoder.classes_}")  # Devrait afficher ['bacteria', 'normal', 'virus'] (ordre alphabétique)


# ===============================
# Etape 4bis : Réduction de dimension avec PCA
# ===============================
from sklearn.decomposition import PCA

# Appliquer PCA après flatten
pca = PCA(n_components=100)  
X_train_flat = pca.fit_transform(X_train_flat)
X_test_flat = pca.transform(X_test_flat)
X_val_flat = pca.transform(X_val_flat)

print("Variance expliquée par PCA:", pca.explained_variance_ratio_.sum())


# ===============================
# Etape 5: Entrainement de l'arbre de décision
# ===============================
model = DecisionTreeClassifier(max_depth=10, random_state=42)
model.fit(X_train_flat, y_train_enc)

# ===============================
# Etape 6: Evaluation
# ===============================
y_pred = model.predict(X_test_flat)

print("Accuracy:", accuracy_score(y_test_enc, y_pred))
print("\nClassification Report:\n", classification_report(y_test_enc, y_pred, target_names=label_encoder.classes_))

# Create results folder
output_dir = "results_3classes"
os.makedirs(output_dir, exist_ok=True)


# Confusion Matrix
cm = confusion_matrix(y_test_enc, y_pred)
sns.heatmap(cm, annot=True, fmt='d', cmap='Blues', xticklabels=label_encoder.classes_, yticklabels=label_encoder.classes_)
plt.title('Confusion Matrix')
plt.xlabel("Predicted")
plt.ylabel("True")
plt.savefig(os.path.join(output_dir, 'confusion_matrix.png'))
plt.close()

# ===============================
# Etape 7: Cross-Validation
# ===============================
cv_scores = cross_val_score(model, X_train_flat, y_train_enc, cv=5, scoring='accuracy')
print(f"Cross-validation scores: {cv_scores}")
print(f"Mean CV Accuracy: {cv_scores.mean():.4f}")

# ===============================
# 🧪 Etape 8: Tuning d'Hyperparamètre
# ===============================
from sklearn.model_selection import RandomizedSearchCV
from scipy.stats import randint


param_dist = {
    'max_depth': [5, 10, 15, 20, None],
    'min_samples_split': randint(2, 11),
    'min_samples_leaf': random.randint(1, 5),
    'criterion': ['gini', 'entropy'],
    'class_weight': ['balanced', None]
}

random_search = RandomizedSearchCV(
    DecisionTreeClassifier(random_state=42),
    param_distributions=param_dist,
    n_iter=30,
    cv=3,
    scoring='accuracy',
    n_jobs=-1
)
random_search.fit(X_train_flat, y_train_enc)

best_model = random_search.best_estimator_


# ===============================
# Etape 9: Enregistrement du model
# ===============================
joblib.dump(best_model, os.path.join(output_dir, 'model_decision_tree.pkl'))
print("Best model saved as model_decision_tree.pkl")

# ===============================
# Etape 10: Visualiser l'arbre
# ===============================
plt.figure(figsize=(20, 10))
plot_tree(best_model, filled=True, max_depth=2, class_names=label_encoder.classes_)
plt.title('Partial Decision Tree Visualization (First 2 Levels)')
plt.savefig(os.path.join(output_dir, 'decision_tree_partial.png'))
plt.close()
 