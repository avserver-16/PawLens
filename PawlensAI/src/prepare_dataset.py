# src/prepare_dataset.py
import os
import shutil
from pathlib import Path
import csv

RAW_DIR = Path("../data/raw")
OUT_DIR = Path("../data/processed")
OUT_DIR.mkdir(parents=True, exist_ok=True)
(OUT_DIR / "diseased").mkdir(exist_ok=True)
(OUT_DIR / "normal").mkdir(exist_ok=True)

# Option A: If you have CSV mapping: filename,label
mapping_csv = Path("labels_map.csv")  # create this CSV with two columns: filename,label (diseased/normal)
if mapping_csv.exists():
    with open(mapping_csv, newline="") as f:
        reader = csv.reader(f)
        for row in reader:
            if not row: continue
            filename, label = row[0].strip(), row[1].strip()
            # try to find file in raw dirs
            for dataset_dir in RAW_DIR.iterdir():
                src = dataset_dir / filename
                if src.exists():
                    dst = OUT_DIR / label / filename
                    shutil.copy2(src, dst)
                    break
else:
    # Option B: Basic heuristic: any folder named with disease -> diseased, else normal
    for dataset_dir in RAW_DIR.iterdir():
        for img in dataset_dir.iterdir():
            if not img.is_file(): continue
            low = dataset_dir.name.lower()
            if any(k in low for k in ["disease", "lesion", "dermat", "skin", "eczema", "infect"]):
                label = "diseased"
            else:
                label = "normal"
            shutil.copy2(img, OUT_DIR / label / img.name)
