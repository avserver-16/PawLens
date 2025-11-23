# src/train_vit.py
import os
from pathlib import Path
import torch
from torch import nn
from torchvision import datasets, transforms
from torch.utils.data import DataLoader
import timm
from tqdm import tqdm
import numpy as np

# Config
DATA_DIR = Path("../data/splits")
MODEL_NAME = "vit_base_patch16_224"  # timm model
NUM_CLASSES = 2
BATCH_SIZE = 16
EPOCHS = 12
LR = 3e-4
DEVICE = torch.device("cuda" if torch.cuda.is_available() else "cpu")
CHECKPOINT_DIR = Path("../outputs/checkpoints")
CHECKPOINT_DIR.mkdir(parents=True, exist_ok=True)

# Transforms
train_transforms = transforms.Compose([
    transforms.Resize((224,224)),
    transforms.RandomHorizontalFlip(),
    transforms.RandomRotation(15),
    transforms.ToTensor(),
    transforms.Normalize(mean=[0.485,0.456,0.406], std=[0.229,0.224,0.225])
])
val_transforms = transforms.Compose([
    transforms.Resize((224,224)),
    transforms.ToTensor(),
    transforms.Normalize(mean=[0.485,0.456,0.406], std=[0.229,0.224,0.225])
])

# Datasets and loaders
train_ds = datasets.ImageFolder(DATA_DIR/"train", transform=train_transforms)
val_ds = datasets.ImageFolder(DATA_DIR/"val", transform=val_transforms)
test_ds = datasets.ImageFolder(DATA_DIR/"test", transform=val_transforms)

train_loader = DataLoader(train_ds, batch_size=BATCH_SIZE, shuffle=True, num_workers=4)
val_loader = DataLoader(val_ds, batch_size=BATCH_SIZE, shuffle=False, num_workers=4)
test_loader = DataLoader(test_ds, batch_size=BATCH_SIZE, shuffle=False, num_workers=4)

# Model
model = timm.create_model(MODEL_NAME, pretrained=True, num_classes=NUM_CLASSES)
model.to(DEVICE)

# Loss, optimizer, scheduler
criterion = nn.CrossEntropyLoss()
optimizer = torch.optim.AdamW(model.parameters(), lr=LR, weight_decay=1e-2)
scheduler = torch.optim.lr_scheduler.ReduceLROnPlateau(optimizer, mode='max', patience=2, factor=0.5, verbose=True)

def evaluate(model, loader):
    model.eval()
    correct = 0
    total = 0
    preds = []
    labels = []
    with torch.no_grad():
        for xb, yb in loader:
            xb, yb = xb.to(DEVICE), yb.to(DEVICE)
            out = model(xb)
            p = torch.argmax(out, dim=1)
            preds.extend(p.cpu().numpy().tolist())
            labels.extend(yb.cpu().numpy().tolist())
            correct += (p==yb).sum().item()
            total += yb.size(0)
    acc = correct/total
    return acc, preds, labels

best_val = 0.0
for epoch in range(1, EPOCHS+1):
    model.train()
    running_loss = 0.0
    pbar = tqdm(train_loader, desc=f"Epoch {epoch}")
    for xb, yb in pbar:
        xb, yb = xb.to(DEVICE), yb.to(DEVICE)
        optimizer.zero_grad()
        out = model(xb)
        loss = criterion(out, yb)
        loss.backward()
        optimizer.step()
        running_loss += loss.item()
        pbar.set_postfix(loss=running_loss/ (pbar.n+1))

    val_acc, _, _ = evaluate(model, val_loader)
    print(f"Epoch {epoch} Val Acc: {val_acc:.4f}")
    scheduler.step(val_acc)

    # Save best
    if val_acc > best_val:
        best_val = val_acc
        torch.save({
            "model_state": model.state_dict(),
            "optimizer": optimizer.state_dict(),
            "epoch": epoch,
            "val_acc": val_acc,
        }, CHECKPOINT_DIR / "PawlensAI_best.pt")
        print(f"Saved best model (val_acc={val_acc:.4f})")

# final test eval
test_acc, preds, labels = evaluate(model, test_loader)
print("Test Accuracy:", test_acc)

# Save final model weights for inference
torch.save(model.state_dict(), CHECKPOINT_DIR/"PawlensAI.pt")
print("Saved PawlensAI.pt")
