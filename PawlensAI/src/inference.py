# src/inference.py
import torch
from torchvision import transforms
from PIL import Image
import timm
from pathlib import Path

MODEL_PATH = "../outputs/checkpoints/PawlensAI.pt"
MODEL_NAME = "vit_base_patch16_224"
DEVICE = torch.device("cuda" if torch.cuda.is_available() else "cpu")
transform = transforms.Compose([
    transforms.Resize((224,224)),
    transforms.ToTensor(),
    transforms.Normalize(mean=[0.485,0.456,0.406], std=[0.229,0.224,0.225])
])

model = timm.create_model(MODEL_NAME, pretrained=False, num_classes=2)
model.load_state_dict(torch.load(MODEL_PATH, map_location=DEVICE))
model.to(DEVICE)
model.eval()

def predict(image_path):
    img = Image.open(image_path).convert("RGB")
    x = transform(img).unsqueeze(0).to(DEVICE)
    with torch.no_grad():
        out = model(x)
        prob = torch.nn.functional.softmax(out, dim=1)
        conf, pred = torch.max(prob, dim=1)
        label = "diseased" if pred.item()==1 else "normal"
        return label, conf.item()

if __name__ == "__main__":
    import sys
    img = sys.argv[1]
    label, conf = predict(img)
    print(label, conf)
