# src/clip_autolabel.py
import os
from pathlib import Path
import pandas as pd
from PIL import Image
import torch
from transformers import CLIPProcessor, CLIPModel
from tqdm import tqdm
import shutil

# CONFIG
SCRAPED_ROOT = Path("../PawlensAI/scraped_images")  # adjust to where your dataset_1/2 folders are
OUT_ROOT = Path("../PawlensAI_Dataset_clip")           # output labeled dataset
OUT_ROOT.mkdir(parents=True, exist_ok=True)
CSV_OUT = OUT_ROOT / "clip_labels.csv"
CONF_THRESHOLD = 0.35   # below -> mark as 'uncertain' (tune this)

# CLASSES and PROMPTS (one or multiple prompts per class)
CLASSES = {
    "normal": [
        "a photo of a dog with healthy skin",
        "a dog with no skin disease, full body image"
    ],
    "fungal": [
        "a close-up photo of a dog skin with a fungal infection (red, flaky, scaly)",
        "dog skin with ring-shaped fungus infection"
    ],
    "bacterial": [
        "a close-up photo of a dog skin with a bacterial infection (pus, sores)",
        "dog skin with infected sores and crusts"
    ],
    "mange": [
        "a close-up photo of a dog skin with mange (hair loss, scabby skin)",
        "dog skin showing mange mites and patchy hair loss"
    ],
    "allergy": [
        "a close-up photo of a dog skin with allergic dermatitis (red irritated skin)",
        "dog skin with itchy red rash due to allergy"
    ],
    "wound": [
        "a photo of a wound or open lesion on a dog's skin",
        "dog skin with a cut or open sore"
    ],
    "other": [
        "a photo of a dog skin with other or unknown condition",
        "dog skin photo of unknown skin issue"
    ]
}

# Flatten prompt list and keep class indices
prompt_texts = []
prompt_to_class = []
for cls, prompts in CLASSES.items():
    for p in prompts:
        prompt_texts.append(p)
        prompt_to_class.append(cls)

device = "cuda" if torch.cuda.is_available() else "cpu"
print("Using device:", device)

# Load CLIP
model_name = "openai/clip-vit-base-patch32"
model = CLIPModel.from_pretrained(model_name).to(device)
processor = CLIPProcessor.from_pretrained(model_name)

def predict_image(img_path):
    image = Image.open(img_path).convert("RGB")
    inputs = processor(text=prompt_texts, images=image, return_tensors="pt", padding=True).to(device)
    with torch.no_grad():
        outputs = model(**inputs)
        logits_per_image = outputs.logits_per_image  # shape (1, num_texts)
        probs = logits_per_image.softmax(dim=1).cpu().numpy()[0]  # probability over prompts
    # aggregate prompt probs to class probs by summing prompts for the same class
    class_probs = {}
    for prob, cls in zip(probs, prompt_to_class):
        class_probs[cls] = class_probs.get(cls, 0.0) + float(prob)
    # normalize aggregated probs
    total = sum(class_probs.values())
    for k in class_probs:
        class_probs[k] /= total
    # pick best
    best_class = max(class_probs, key=lambda k: class_probs[k])
    best_conf = class_probs[best_class]
    return best_class, best_conf, class_probs

# iterate over scraped images
rows = []
for src_folder in SCRAPED_ROOT.iterdir():
    if not src_folder.is_dir(): 
        continue
    for img_file in tqdm(sorted(src_folder.glob("*.*")), desc=f"Processing {src_folder.name}"):
        try:
            best_cls, conf, probs = predict_image(img_file)
        except Exception as e:
            print("Error on", img_file, e)
            continue

        # destination folder
        if conf < CONF_THRESHOLD:
            dest_cls = "uncertain"
        else:
            dest_cls = best_cls

        dest_dir = OUT_ROOT / dest_cls
        dest_dir.mkdir(parents=True, exist_ok=True)
        # copy image (use shutil.copy if you want to keep originals)
        shutil.copy2(img_file, dest_dir / img_file.name)

        rows.append({
            "source_folder": src_folder.name,
            "filename": str(img_file),
            "predicted": best_cls,
            "confidence": conf
        })

# save CSV for review
df = pd.DataFrame(rows)
df.to_csv(CSV_OUT, index=False)
print("Saved labels to", CSV_OUT)
print("Done. Check", OUT_ROOT)
