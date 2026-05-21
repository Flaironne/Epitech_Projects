from preprocess import load_dataset
from model import PneumoniaKNN
from utils import evaluate, plot_samples
from config import DATASET_PATH

print("Chargement des données...")
X_train, y_train = load_dataset(DATASET_PATH, ["train", "val"])
X_test, y_test = load_dataset(DATASET_PATH, ["test"])

model = PneumoniaKNN()
X_train, X_test = model.preprocess(X_train, X_test)

print("Entraînement du modèle...")
model.train(X_train, y_train)

print("Évaluation...")
y_pred = model.predict(X_test)
evaluate(y_test, y_pred)

plot_samples(X_test, y_test)