import pickle
import time
import json

import numpy as np
from sklearn.metrics import accuracy_score

with open("Archive/data.json", "r") as f:
    data = json.load(f)

accuracy = data["accuracy"]

if __name__ == "__main__":

    folder_name = "Array224"
    model_name = "model224.pkl"

    with open(model_name, 'rb') as f:
        model = pickle.load(f)

    x_train = np.load(f'{folder_name}/x_train.npy')
    y_train = np.load(f'{folder_name}/y_train.npy')
    x_test = np.load(f'{folder_name}/x_test.npy')
    y_test = np.load(f'{folder_name}/y_test.npy')
    x_val = np.load(f'{folder_name}/x_val.npy')
    y_val = np.load(f'{folder_name}/y_val.npy')

    start_time = time.time()
    model.fit(x_train, y_train)
    end_time = time.time()

    print(f"Temps d'entraînement : {end_time - start_time:.2f} secondes")

    y_pred = model.predict(x_test)
    print("Précision sur le set de test :", accuracy_score(y_test, y_pred))

    y_eval_pred = model.predict(x_val)
    print("Précision sur le set d'évaluation :", accuracy_score(y_val, y_eval_pred))

    print("Limite d'itérations :", model.max_iter)
    print("Le modèle a convergé :", model.n_iter_)

    if accuracy_score(y_test, y_pred) > accuracy:
        with open(model_name, 'wb') as f:
            pickle.dump(model, f)

        print("L'ancienne précision était : ", accuracy)
        print("La nouvelle précision est : ", accuracy_score(y_test, y_pred))
        print("Le modèle a été amélioré")

        data["accuracy"] = accuracy_score(y_test, y_pred)

        with open("Archive/data.json", "w") as f:
            json.dump(data, f, indent=2)

    else:

        print("L'ancienne précision était : ", accuracy)
        print("La nouvelle précision est : ", accuracy_score(y_test, y_pred))
        print("Le modèle n'a pas été amélioré")