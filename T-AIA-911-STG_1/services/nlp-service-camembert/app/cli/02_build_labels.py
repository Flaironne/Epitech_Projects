LABELS = [
    "O",
    "B-DEPARTURE",
    "I-DEPARTURE",
    "B-ARRIVAL",
    "I-ARRIVAL",
]

label2id = {label: i for i, label in enumerate(LABELS)}
id2label = {i: label for label, i in label2id.items()}

if __name__ == "__main__":
    print("Labels:")
    for k, v in label2id.items():
        print(f"{k:15} -> {v}")
