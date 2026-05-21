from sklearn.metrics import classification_report
import matplotlib.pyplot as plt
from config import IMAGE_SIZE

def evaluate(y_test, y_pred):
    print(classification_report(y_test, y_pred, target_names=["NORMAL", "PNEUMONIA"]))

def plot_samples(X, y, n=6):
    plt.figure(figsize=(12, 4))
    for i in range(n):
        ax = plt.subplot(1, n, i + 1)
        plt.imshow(X[i].reshape(IMAGE_SIZE), cmap='gray')
        plt.title("PNEU" if y[i] == 1 else "NORMAL")
        plt.axis("off")
    plt.savefig("preview.png")