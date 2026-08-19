import numpy as np
import torch
import cv2
from PIL import Image
from pytorch_grad_cam import GradCAM
from pytorch_grad_cam.utils.model_targets import ClassifierOutputTarget
from pytorch_grad_cam.utils.image import show_cam_on_image

from services.model_loader import model, device, model_config
from services.prediction import test_transform

# Target layers in PyTorch EfficientNet-B4 (from user's Gradcam.ipynb)
target_layers = [model.features[-1]]
cam = GradCAM(
    model=model,
    target_layers=target_layers
)


def generate_gradcam(
    image_path,
    output_path
):
    """
    Generate Grad-CAM heatmap visualization using PyTorch EfficientNet-B4.
    """

    # Load original image
    image = Image.open(image_path).convert("RGB")

    # Resize for display matching model_config input size (224, 224)
    input_w, input_h = model_config["input_size"]
    display_image = image.resize((input_w, input_h))

    # Convert to RGB float array [0, 1] for show_cam_on_image
    rgb_image = np.array(display_image).astype(np.float32) / 255.0

    # Preprocess tensor
    input_tensor = test_transform(image).unsqueeze(0).to(device)

    # Get predicted class index
    with torch.no_grad():
        outputs = model(input_tensor)
        predicted_class = outputs.argmax(dim=1).item()

    # Target class for Grad-CAM
    targets = [
        ClassifierOutputTarget(predicted_class)
    ]

    # Generate CAM grayscale heatmap
    grayscale_cam = cam(
        input_tensor=input_tensor,
        targets=targets
    )[0]

    # Overlay CAM heatmap on image
    visualization = show_cam_on_image(
        rgb_image,
        grayscale_cam,
        use_rgb=True
    )

    # Convert to PIL Image / OpenCV BGR and save
    bgr_visualization = cv2.cvtColor(visualization, cv2.COLOR_RGB2BGR)

    success = cv2.imwrite(
        output_path,
        bgr_visualization
    )

    if not success:
        Image.fromarray(visualization).save(output_path)

    return output_path