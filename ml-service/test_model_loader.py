from services.model_loader import (
    model,
    class_mapping,
    model_config
)

print()
print("===== PYTORCH MODEL LOADER TEST =====")
print("Model loaded:", model is not None)
print("Class mapping:", class_mapping)
print("Model configuration:", model_config)