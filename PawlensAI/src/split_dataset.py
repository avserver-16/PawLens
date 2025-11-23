# src/split_dataset.py
import os, shutil, random
from pathlib import Path
from sklearn.model_selection import train_test_split

random.seed(42)
DATA_DIR = Path("../data/processed")
OUT = Path("../data/splits")
OUT.mkdir(exist_ok=True)

splits = ["train","val","test"]
for s in splits:
    for c in ["diseased","normal"]:
        (OUT/s/c).mkdir(parents=True, exist_ok=True)

split_ratios = (0.7, 0.15, 0.15)  # train, val, test

for cls in ["diseased","normal"]:
    imgs = list((DATA_DIR/cls).glob("*"))
    names = [str(p) for p in imgs]
    train, temp = train_test_split(names, train_size=split_ratios[0], stratify=None, random_state=42)
    val, test = train_test_split(temp, test_size= split_ratios[2]/(split_ratios[1]+split_ratios[2]), random_state=42)
    for p in train:
        shutil.copy2(p, OUT/"train"/cls/Path(p).name)
    for p in val:
        shutil.copy2(p, OUT/"val"/cls/Path(p).name)
    for p in test:
        shutil.copy2(p, OUT/"test"/cls/Path(p).name)

print("Done splitting.")
