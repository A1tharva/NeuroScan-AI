import keras


MODEL_PATH = "model/brain_tumor_final.keras"

print("Loading model...")
model = keras.models.load_model(MODEL_PATH)

print("\n===== TOP-LEVEL MODEL =====")

print("Model name:", model.name)
print("Inputs:", model.inputs)
print("Outputs:", model.outputs)

print("\nInput names:")
for tensor in model.inputs:
    print(" ", tensor.name, tensor.shape)

print("\nTop-level layers:")

for i, layer in enumerate(model.layers):
    print(
        i,
        "|",
        layer.name,
        "|",
        layer.__class__.__name__
    )


print("\n===== EFFICIENTNETB4 =====")

efficientnet = None

for layer in model.layers:
    if layer.name == "efficientnetb4":
        efficientnet = layer
        break

if efficientnet is None:
    raise ValueError("EfficientNetB4 not found.")

print("Name:", efficientnet.name)
print("Input:", efficientnet.input)
print("Output:", efficientnet.output)

print("\nEfficientNet input:")
print(efficientnet.input)

print("\nEfficientNet output:")
print(efficientnet.output)

print("\n===== TOP_ACTIVATION =====")

target_layer = efficientnet.get_layer("top_activation")

print("Name:", target_layer.name)
print("Type:", target_layer.__class__.__name__)
print("Input:", target_layer.input)
print("Output:", target_layer.output)
print("Output shape:", target_layer.output.shape)