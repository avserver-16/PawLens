"""
PawLens AI - Flask Prediction Microservice
Loads the best_vit_model.pth ViT model and serves predictions via REST API.
"""

import os
import io
import torch
import torch.nn.functional as F
from PIL import Image
from torchvision import transforms
from flask import Flask, request, jsonify
from flask_cors import CORS
import timm

# ─── Configuration ──────────────────────────────────────────────
DEVICE = "cuda" if torch.cuda.is_available() else "cpu"
NUM_CLASSES = 6
IMAGE_SIZE = 224
MODEL_PATH = os.path.join(os.path.dirname(__file__), "best_vit_model.pth")

CLASS_NAMES = [
    "demodicosis",
    "dermatitis",
    "fungal_infections",
    "healthy",
    "hypersensitivity",
    "ringworm",
]

# ─── Image Preprocessing (same as training) ────────────────────
val_transform = transforms.Compose([
    transforms.Resize((IMAGE_SIZE, IMAGE_SIZE)),
    transforms.ToTensor(),
    transforms.Normalize(mean=[0.5] * 3, std=[0.5] * 3),
])

# ─── Load Model ────────────────────────────────────────────────
print(f"Loading model from {MODEL_PATH} on {DEVICE}...")
model = timm.create_model(
    "vit_base_patch16_224",
    pretrained=False,
    num_classes=NUM_CLASSES,
)
model.load_state_dict(torch.load(MODEL_PATH, map_location=DEVICE))
model.to(DEVICE)
model.eval()
print("Model loaded successfully!")

# ─── Flask App ──────────────────────────────────────────────────
app = Flask(__name__)
CORS(app)


@app.route("/health", methods=["GET"])
def health():
    """Health check endpoint."""
    return jsonify({"status": "ok", "message": "PawLens AI service is running", "device": DEVICE})


@app.route("/predict", methods=["POST"])
def predict():
    """
    Predict skin disease from an uploaded image.
    
    Expects: multipart/form-data with an 'image' file field
             OR raw image bytes in the request body with Content-Type header
    
    Returns: JSON with predicted class, confidence, and all class probabilities
    """
    try:
        # Get image from request
        if "image" in request.files:
            # Multipart form upload
            file = request.files["image"]
            image_bytes = file.read()
        elif request.data:
            # Raw bytes in request body
            image_bytes = request.data
        else:
            return jsonify({"error": "No image provided. Send an image via 'image' form field or raw body."}), 400

        # Open and preprocess the image
        image = Image.open(io.BytesIO(image_bytes)).convert("RGB")
        input_tensor = val_transform(image).unsqueeze(0).to(DEVICE)

        # Run inference
        with torch.no_grad():
            outputs = model(input_tensor)
            probabilities = F.softmax(outputs, dim=1)[0]
            predicted_idx = probabilities.argmax().item()
            confidence = probabilities[predicted_idx].item()

        # Build response with all class probabilities
        all_probabilities = {
            CLASS_NAMES[i]: round(probabilities[i].item() * 100, 2)
            for i in range(NUM_CLASSES)
        }

        return jsonify({
            "success": True,
            "prediction": CLASS_NAMES[predicted_idx],
            "confidence": round(confidence * 100, 2),
            "probabilities": all_probabilities,
        })

    except Exception as e:
        print(f"Prediction error: {e}")
        return jsonify({"error": f"Prediction failed: {str(e)}"}), 500


if __name__ == "__main__":
    port = int(os.environ.get("AI_PORT", 5001))
    print(f"Starting PawLens AI service on port {port}...")
    app.run(host="0.0.0.0", port=port, debug=False)
