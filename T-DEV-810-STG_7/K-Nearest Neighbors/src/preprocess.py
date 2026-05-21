import os
import numpy as np
from PIL import Image
from config import IMAGE_SIZE

def load_images_from_folder(folder, label):
    images, labels = [], []
    for filename in os.listdir(folder):
        if not filename.lower().endswith(('.jpeg', '.jpg', '.png')):
            continue
        path = os.path.join(folder, filename)
        try:
            img = Image.open(path).convert("L").resize(IMAGE_SIZE)
            img_array = np.asarray(img).flatten() / 255.0
            images.append(img_array)
            labels.append(label)
        except Exception as e:
            print(f"Erreur avec {path} : {e}")
    return images, labels

def load_dataset(base_path, subsets):
    X, y = [], []
    for subset in subsets:
        for label_str, label_val in [("NORMAL", 0), ("PNEUMONIA", 1)]:
            folder = os.path.join(base_path, subset, label_str)
            imgs, labels = load_images_from_folder(folder, label_val)
            X.extend(imgs)
            y.extend(labels)
    return np.array(X), np.array(y)
