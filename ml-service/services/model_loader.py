import json
import torch
import torch.nn as nn
from torchvision.models import efficientnet_b4

MODEL_PATH = "model/brain_tumor_efficientnet_b4_best.pth"
CLASS_MAPPING_PATH = "model/class_mapping.json"
MODEL_CONFIG_PATH = "model/model_config.json"

print("Loading NeuroScan AI PyTorch model...")

device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

# Initialize EfficientNet-B4 matching trained notebook architecture
model = efficientnet_b4(weights=None)
model.classifier[1] = nn.Linear(
    model.classifier[1].in_features,
    4
)

model = model.to(device)

# Load checkpoint weights
model.load_state_dict(
    torch.load(MODEL_PATH, map_location=device)
)

model.eval()

# Load class mapping
with open(CLASS_MAPPING_PATH, "r") as file:
    class_mapping = json.load(file)

# Load model configuration
with open(MODEL_CONFIG_PATH, "r") as file:
    model_config = json.load(file)

print("NeuroScan AI PyTorch model loaded successfully!")
print("Device:", device)
print("Model:", model_config["model"])
print("Input size:", model_config["input_size"])
print("Classes:", model_config["classes"])