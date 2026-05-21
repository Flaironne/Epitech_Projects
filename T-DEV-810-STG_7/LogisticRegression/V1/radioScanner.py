from sklearn.linear_model import LogisticRegression
from PIL import Image
import numpy as np
import time
import os
from sklearn.metrics import accuracy_score

def initData(datatype):

    x = []  # Images
    y = []  # Labels

    noramilsation = 255.0

    for label, category in enumerate(["NORMAL", "PNEUMONIA"]):
        folder = f"../chest_Xray/{datatype}/{category}"
        for filename in os.listdir(folder):
            img_path = os.path.join(folder, filename)
            img = Image.open(img_path).convert("L")
            img = img.resize((22, 22))
            img_array = np.array(img).flatten()
            print(img_path)
            x.append(img_array)
            y.append(label)

    return np.array(x) / noramilsation, np.array(y)

def initModel():
    return LogisticRegression(
        penalty='l2',
        C=0.5,
        solver='saga',
        max_iter=1000,
        class_weight='balanced',
        tol=1e-3,
        warm_start=True,
        verbose=1
    )

##### MAIN #####

if __name__ == "__main__":

    # Initialisation du modèle
    model = initModel()

    # Initialisation des données
    x_train, y_train = initData("train")
    x_test, y_test = initData("test")
    x_val, y_val = initData("val")

    # Fiting du modèle
    start_time = time.time()
    model.fit(x_train, y_train)
    end_time = time.time()

    print(f"Temps d'entraînement : {end_time - start_time:.2f} secondes")

    # Prediction
    y_pred = model.predict(x_test)
    print("Précision sur le set de test :", accuracy_score(y_test, y_pred))

    y_eval_pred = model.predict(x_val)
    print("Précision sur le set d'évaluation :", accuracy_score(y_val, y_eval_pred))

    print("Limite d'itérations :", model.max_iter)
    print("Le modèle a convergé :", model.n_iter_)