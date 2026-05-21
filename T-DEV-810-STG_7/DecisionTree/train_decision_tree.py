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
    roc_auc_score,
    RocCurveDisplay,
)
from sklearn.model_selection import cross_val_score, GridSearchCV
import joblib

# ===============================
# 📁 Etape 1: Charger les images (classes binaires seulement)
# ===============================
def load_images_from_folder(folder, img_size=(64, 64), classes_allowed=('NORMAL', 'PNEUMONIA')):
    images = []
    labels = []
    for label in os.listdir(folder):
        if label not in classes_allowed:
            continue  # Ignore other classes if any
        label_folder = os.path.join(folder, label)
        if os.path.isdir(label_folder):
            for img_file in os.listdir(label_folder):
                img_path = os.path.join(label_folder, img_file)
                try:
                    img = load_img(img_path, target_size=img_size, color_mode="rgb")
                    img_array = img_to_array(img) / 255.0
                    images.append(img_array)
                    labels.append(label)
                except Exception as e:
                    print(f"Warning: Could not Charger les images {img_path}. Skipping. Error: {e}")
    return np.array(images), np.array(labels)

# Étape 1bis : rééquilibrer les classes (undersampling de la majorité)
def balance_dataset(source_dir, target_dir, classes=('NORMAL', 'PNEUMONIA')):
    import shutil
    import random

    os.makedirs(target_dir, exist_ok=True)
    for cls in classes:
        os.makedirs(os.path.join(target_dir, cls), exist_ok=True)

    class_counts = {cls: len(os.listdir(os.path.join(source_dir, cls))) for cls in classes}
    min_count = min(class_counts.values())

    for cls in classes:
        all_files = os.listdir(os.path.join(source_dir, cls))
        selected = random.sample(all_files, min_count)
        for fname in selected:
            src = os.path.join(source_dir, cls, fname)
            dst = os.path.join(target_dir, cls, fname)
            shutil.copyfile(src, dst)

# Appliquer le rééquilibrage pour l'entraînement
balanced_train_dir = 'chest_Xray_balanced/train/'
balance_dataset('chest_Xray/train/', balanced_train_dir)


# ===============================
# Etape 2: Définir les chemins d'accès et charger
# ===============================
train_dir = 'chest_Xray/train/'
test_dir = 'chest_Xray/test/'
val_dir = 'chest_Xray/val/'

# X_train, y_train = load_images_from_folder(train_dir)
X_train, y_train = load_images_from_folder(balanced_train_dir)

X_test, y_test = load_images_from_folder(test_dir)
X_val, y_val = load_images_from_folder(val_dir)

print(f"Train samples: {len(X_train)}, Test samples: {len(X_test)}, Val samples: {len(X_val)}")
print(f"Train labels distribution: {np.unique(y_train, return_counts=True)}")

# ===============================
# Etape 3: Contrôle visuel (optional)
# ===============================
def show_sample_images(X, y, n=5):
    indices = random.sample(range(len(X)), n)
    for i in indices:
        plt.imshow(X[i])
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

print(f"Classes: {label_encoder.classes_}")  # Doit afficher ['NORMAL' 'PNEUMONIA']

# ===============================
# Etape 4bis : Réduction de dimension avec PCA
# ===============================
from sklearn.decomposition import PCA

# Appliquer PCA après flatten
pca = PCA(n_components=100)  
X_train_flat = pca.fit_transform(X_train_flat)
X_test_flat = pca.transform(X_test_flat)
X_val_flat = pca.transform(X_val_flat)

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
os.makedirs("results", exist_ok=True)

# Confusion Matrix
cm = confusion_matrix(y_test_enc, y_pred)
sns.heatmap(cm, annot=True, fmt='d', cmap='Blues', xticklabels=label_encoder.classes_, yticklabels=label_encoder.classes_)
plt.title('Confusion Matrix')
plt.xlabel("Predicted")
plt.ylabel("True")
plt.savefig('results/confusion_matrix.png')
plt.close()

# ROC Curve (binary only)
if len(label_encoder.classes_) == 2:
    y_proba = model.predict_proba(X_test_flat)[:, 1]
    roc_auc = roc_auc_score(y_test_enc, y_proba)
    print(f"ROC-AUC Score: {roc_auc:.4f}")
    
    RocCurveDisplay.from_predictions(y_test_enc, y_proba)
    plt.title('ROC Curve')
    plt.savefig('results/roc_curve.png')
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
    'min_samples_leaf': randint(1, 5),
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
joblib.dump(best_model, 'model_decision_tree.pkl')
print("Best model saved as model_decision_tree.pkl")

# ===============================
# Etape 10: Visualiser l'arbre
# ===============================
plt.figure(figsize=(20, 10))
plot_tree(best_model, filled=True, max_depth=2, class_names=label_encoder.classes_)
plt.title('Partial Decision Tree Visualization (First 2 Levels)')
plt.savefig('results/decision_tree_partial.png')
plt.close()
 