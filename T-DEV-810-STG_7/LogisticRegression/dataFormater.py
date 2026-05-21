from PIL import Image
import numpy as np
import os

def initData(datatype):

    x = []  # Images
    y = []  # Labels

    noramilsation = 255.0
    resize_values = (22, 22)

    for label, category in enumerate(["NORMAL", "PNEUMONIA"]):
        folder = f"chest_Xray/{datatype}/{category}"
        for filename in os.listdir(folder):
            img_path = os.path.join(folder, filename)
            img = Image.open(img_path).convert("L")
            img = img.resize(resize_values)
            img_array = np.array(img).flatten()
            print(img_path)
            x.append(img_array)
            y.append(label)

    return np.array(x) / noramilsation, np.array(y)

##### MAIN #####

if __name__ == "__main__":

    folder_name = "Array22"

    x_train, y_train = initData("train")
    x_test, y_test = initData("test")
    x_val, y_val = initData("val")

    os.makedirs(folder_name, exist_ok=True)

    np.save(f'{folder_name}/x_train.npy', x_train)
    np.save(f'{folder_name}/y_train.npy', y_train)
    np.save(f'{folder_name}/x_test.npy', x_test)
    np.save(f'{folder_name}/y_test.npy', y_test)
    np.save(f'{folder_name}/x_val.npy', x_val)
    np.save(f'{folder_name}/y_val.npy', y_val)