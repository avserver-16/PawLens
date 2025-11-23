import os
import torch
from torch.utils.data import DataLoader
from torchvision import transforms, datasets
from transformers import ViTForImageClassification, ViTImageProcessor
from tqdm import tqdm

DATA_DIR = "PawlensAI_Dataset"
MODEL_DIR = "PawlensAI_v1"
BATCH_SIZE = 16
EPOCHS = 5
LR = 5e-5

device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
print("Using:", device)

processor = ViTImageProcessor.from_pretrained("google/vit-base-patch16-224")

transform = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.ToTensor(),
    transforms.Normalize(mean=processor.image_mean, std=processor.image_std)
])

train_ds = datasets.ImageFolder(os.path.join(DATA_DIR, "train"), transform=transform)
val_ds = datasets.ImageFolder(os.path.join(DATA_DIR, "val"), transform=transform)

train_loader = DataLoader(train_ds, batch_size=BATCH_SIZE, shuffle=True)
val_loader = DataLoader(val_ds, batch_size=BATCH_SIZE)

num_classes = len(train_ds.classes)
print("Classes:", train_ds.classes)

model = ViTForImageClassification.from_pretrained(
    "google/vit-base-patch16-224-in21k",
    num_labels=num_classes,
    ignore_mismatched_sizes=True   # <<<<<< THIS FIXES THE ERROR
)


optimizer = torch.optim.AdamW(model.parameters(), lr=LR)
criterion = torch.nn.CrossEntropyLoss()

def train_epoch():
    model.train()
    total_loss = 0

    for images, labels in tqdm(train_loader):
        images, labels = images.to(device), labels.to(device)

        outputs = model(pixel_values=images)
        loss = criterion(outputs.logits, labels)

        optimizer.zero_grad()
        loss.backward()
        optimizer.step()

        total_loss += loss.item()

    return total_loss / len(train_loader)

def validate():
    model.eval()
    correct = 0
    total = 0

    with torch.no_grad():
        for images, labels in val_loader:
            images, labels = images.to(device), labels.to(device)
            outputs = model(pixel_values=images)
            preds = torch.argmax(outputs.logits, dim=1)

            correct += (preds == labels).sum().item()
            total += labels.size(0)

    return correct / total

if __name__ == "__main__":
    os.makedirs(MODEL_DIR, exist_ok=True)

    for epoch in range(EPOCHS):
        print(f"\nEPOCH {epoch+1}/{EPOCHS}")

        loss = train_epoch()
        acc = validate()

        print(f"Loss: {loss:.4f} | Val Accuracy: {acc*100:.2f}%")

    model.save_pretrained(MODEL_DIR)
    with open(f"{MODEL_DIR}/classes.txt", "w") as f:
        f.write("\n".join(train_ds.classes))

    print("\n🎉 PawlensAI ViT Model Training Complete!")
    print(f"Model saved to: {MODEL_DIR}")
