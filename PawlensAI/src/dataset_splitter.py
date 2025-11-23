import os
import shutil
import random

SOURCE = "PawlensAI_Dataset_clip"   # your labeled dataset
DEST = "PawlensAI_Dataset"          # output folder

SPLIT_RATIOS = {
    "train": 0.7,
    "val": 0.2,
    "test": 0.1
}

def create_dirs():
    for split in SPLIT_RATIOS.keys():
        for cls in os.listdir(SOURCE):
            src_path = os.path.join(SOURCE, cls)
            if os.path.isdir(src_path):
                os.makedirs(os.path.join(DEST, split, cls), exist_ok=True)

def split_dataset():
    for cls in os.listdir(SOURCE):
        class_path = os.path.join(SOURCE, cls)
        if not os.path.isdir(class_path):
            continue

        images = [f for f in os.listdir(class_path) if f.lower().endswith((".jpg", ".jpeg", ".png"))]
        random.shuffle(images)

        total = len(images)
        train_end = int(total * SPLIT_RATIOS["train"])
        val_end = train_end + int(total * SPLIT_RATIOS["val"])

        splits = {
            "train": images[:train_end],
            "val": images[train_end:val_end],
            "test": images[val_end:]
        }

        for split, files in splits.items():
            for file in files:
                src = os.path.join(class_path, file)
                dst = os.path.join(DEST, split, cls, file)
                shutil.copy(src, dst)

        print(f"Class '{cls}' → Train: {len(splits['train'])}, Val: {len(splits['val'])}, Test: {len(splits['test'])}")

def main():
    print("Creating folder structure...")
    create_dirs()

    print("Splitting dataset...")
    split_dataset()

    print("\n🎉 Dataset split complete!")
    print(f"Saved to: {DEST}")

if __name__ == "__main__":
    main()
