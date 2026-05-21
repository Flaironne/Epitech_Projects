from transformers import (
    CamembertForTokenClassification,
    CamembertTokenizerFast,
    Trainer,
    TrainingArguments,
    DataCollatorForTokenClassification
)
from datasets import Dataset, load_from_disk
import pandas as pd
from pathlib import Path

# =========================
# Config
# =========================
LABELS = [
    "O",
    "B-DEPARTURE",
    "I-DEPARTURE",
    "B-ARRIVAL",
    "I-ARRIVAL",
]
label2id = {label: i for i, label in enumerate(LABELS)}
id2label = {i: label for label, i in label2id.items()}

BASE_DIR = Path(__file__).resolve().parent.parent
DATA_PATH = BASE_DIR / "data/dataset_10000_no_ignored_with_spans.csv"

DATA_DIR = BASE_DIR / "data/splits"
MODEL_OUTPUT_DIR = BASE_DIR / "models/camembert-ner"

BATCH_SIZE = 8
EPOCHS = 5
LR = 2e-5

# =========================
# Tokenizer
# =========================
tokenizer = CamembertTokenizerFast.from_pretrained("camembert-base")

# =========================
# Fonction pour tokenizer et aligner
# =========================
def tokenize_and_align(row):
    text = row["text"]
    tokens = tokenizer(
        text,
        return_offsets_mapping=True,
        truncation=True
    )

    labels = ["O"] * len(tokens["input_ids"])
    dep_start, dep_end = row["departure_span_start"], row["departure_span_end"]
    arr_start, arr_end = row["arrival_span_start"], row["arrival_span_end"]

    for i, (start, end) in enumerate(tokens["offset_mapping"]):
        if start == end == 0:
            continue
        if start >= dep_start and end <= dep_end:
            labels[i] = "B-DEPARTURE" if start == dep_start else "I-DEPARTURE"
        elif start >= arr_start and end <= arr_end:
            labels[i] = "B-ARRIVAL" if start == arr_start else "I-ARRIVAL"

    tokens.pop("offset_mapping")
    tokens["labels"] = [label2id[l] for l in labels]
    return tokens

# =========================
# Créer les datasets HF
# =========================
def build_dataset(split: str):
    df = pd.read_csv(DATA_DIR / f"{split}.csv")
    ds = Dataset.from_pandas(df)
    ds = ds.map(tokenize_and_align, remove_columns=list(df.columns))
    return ds

print("Création des datasets...")
train_ds = build_dataset("train")
val_ds = build_dataset("val")
test_ds = build_dataset("test")
print("Datasets créés !")

# =========================
# Modèle
# =========================
model = CamembertForTokenClassification.from_pretrained(
    "camembert-base",
    num_labels=len(LABELS),
    id2label=id2label,
    label2id=label2id
)

# =========================
# Data collator
# =========================
data_collator = DataCollatorForTokenClassification(tokenizer)

# =========================
# Training arguments
# =========================
training_args = TrainingArguments(
    output_dir=str(MODEL_OUTPUT_DIR),
    eval_strategy="epoch",
    save_strategy="epoch",
    learning_rate=LR,
    per_device_train_batch_size=BATCH_SIZE,
    per_device_eval_batch_size=BATCH_SIZE,
    num_train_epochs=EPOCHS,
    weight_decay=0.01,
    logging_dir=str(MODEL_OUTPUT_DIR / "logs"),
    logging_steps=50,
    save_total_limit=2,
    load_best_model_at_end=True,
    metric_for_best_model="f1",
)

# =========================
# Trainer
# =========================
from seqeval.metrics import f1_score, accuracy_score, precision_score, recall_score

def compute_metrics(p):
    predictions, labels = p
    predictions = predictions.argmax(-1)

    # transformer ids → labels
    true_labels = [[LABELS[l] for l in label if l != -100] for label in labels]
    true_preds = [
        [LABELS[p] for (p, l) in zip(pred, label) if l != -100]
        for pred, label in zip(predictions, labels)
    ]
    return {
        "precision": precision_score(true_labels, true_preds),
        "recall": recall_score(true_labels, true_preds),
        "f1": f1_score(true_labels, true_preds),
    }

trainer = Trainer(
    model=model,
    args=training_args,
    train_dataset=train_ds,
    eval_dataset=val_ds,
    tokenizer=tokenizer,
    data_collator=data_collator,
    compute_metrics=compute_metrics
)

# =========================
# Lancement de l'entraînement
# =========================
trainer.train()

# Sauvegarder le modèle et le tokenizer
trainer.save_model(MODEL_OUTPUT_DIR)   # crée pytorch_model.bin + config.json
tokenizer.save_pretrained(MODEL_OUTPUT_DIR)  # crée tokenizer.json, special_tokens_map.json, etc.



# =========================
# Évaluation sur test
# =========================
metrics = trainer.evaluate(test_ds)
print("Résultats sur test :", metrics)
