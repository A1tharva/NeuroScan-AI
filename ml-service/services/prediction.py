import torch
import torch.nn.functional as F
from torchvision import transforms
from PIL import Image

from services.model_loader import (
    model,
    device,
    class_mapping,
    model_config
)

# Standard EfficientNet normalization matching training notebook
test_transform = transforms.Compose([
    transforms.Resize(
        (
            model_config["input_size"][0],
            model_config["input_size"][1]
        )
    ),
    transforms.ToTensor(),
    transforms.Normalize(
        mean=[0.485, 0.456, 0.406],
        std=[0.229, 0.224, 0.225]
    )
])


def predict_image(image_path):
    """
    Run tumor classification on one MRI image using PyTorch EfficientNet-B4.
    """

    image = Image.open(image_path).convert("RGB")
    input_tensor = test_transform(image).unsqueeze(0).to(device)

    model.eval()

    with torch.no_grad():
        outputs = model(input_tensor)
        probabilities = F.softmax(outputs, dim=1)[0]

    predicted_index = int(torch.argmax(probabilities).item())

    predicted_class = class_mapping[
        str(predicted_index)
    ]

    confidence = float(
        probabilities[predicted_index].item()
    )

    class_probabilities = {
        class_mapping[str(i)]: float(probabilities[i].item())
        for i in range(len(probabilities))
    }

    return {
        "prediction": predicted_class,
        "confidence": confidence,
        "probabilities": class_probabilities
    }