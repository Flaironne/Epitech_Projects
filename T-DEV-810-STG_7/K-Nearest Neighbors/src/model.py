import joblib
import os
from config import K_NEIGHBORS, USE_PCA
from sklearn.neighbors import KNeighborsClassifier
from sklearn.decomposition import PCA

class PneumoniaKNN:
    def __init__(self):
        self.pca = PCA(n_components=100) if USE_PCA else None
        self.model = KNeighborsClassifier(n_neighbors=K_NEIGHBORS)

    def preprocess(self, X_train, X_test):
        if self.pca:
            X_train = self.pca.fit_transform(X_train)
            X_test = self.pca.transform(X_test)
        return X_train, X_test

    def train(self, X_train, y_train):
        self.model.fit(X_train, y_train)

    def predict(self, X_test):
        return self.model.predict(X_test)

    def save(self, path="model"):
        os.makedirs(path, exist_ok=True)
        joblib.dump(self.model, os.path.join(path, "knn_model.joblib"))
        if self.pca:
            joblib.dump(self.pca, os.path.join(path, "pca.joblib"))

    def load(self, path="model"):
        self.model = joblib.load(os.path.join(path, "knn_model.joblib"))
        if USE_PCA:
            self.pca = joblib.load(os.path.join(path, "pca.joblib"))
