import torch
from PIL import Image
import argparse
from transformers import ViTImageProcessor, ViTForImageClassification
from safetensors.torch import load_file


def load_model(model_path, num_classes):
    print("[INFO] Loading ViT model base...")

    # Step 1: Load ViT with correct output size
    model = ViTForImageClassification.from_pretrained(
        "google/vit-base-patch16-224",
        num_labels=num_classes,
        ignore_mismatched_sizes=True   # <-- IMPORTANT FIX
    )

    print("[INFO] Loading fine-tuned weights (.safetensors)...")

    # Step 2: Load your fine-tuned checkpoint
    state_dict = load_file(model_path)

    missing, unexpected = model.load_state_dict(state_dict, strict=False)

    print(f"[INFO] Missing keys     : {len(missing)}")
    print(f"[INFO] Unexpected keys  : {len(unexpected)}")

    print("[INFO] Model loaded successfully.")
    model.eval()
    return model


def preprocess(image_path):
    processor = ViTImageProcessor.from_pretrained("google/vit-base-patch16-224")
    img = Image.open(image_path).convert("RGB")
    return processor(images=img, return_tensors="pt")


def predict(model, inputs, class_names):
    with torch.no_grad():
        outputs = model(**inputs)
        probs = torch.softmax(outputs.logits, dim=1)
        idx = torch.argmax(probs).item()
        conf = probs[0][idx].item()
    return class_names[idx], conf


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--image", required=True)
    parser.add_argument("--model", default="PawlensAI_v1/model.safetensors")
    parser.add_argument("--labels", default="PawlensAI_v1/classes.txt")
    args = parser.parse_args()

    # Load class names
    with open(args.labels, "r") as f:
        class_names = [x.strip() for x in f.readlines()]

    # Load model
    model = load_model(args.model, len(class_names))

    # Preprocess image
    inputs = preprocess(args.image)

    # Get prediction
    label, confidence = predict(model, inputs, class_names)

    print("\n=========== PAWLENS AI RESULT ===========")
    print(f"Prediction : {label}")
    print(f"Confidence : {confidence*100:.2f}%")
    print("===========================================\n")
