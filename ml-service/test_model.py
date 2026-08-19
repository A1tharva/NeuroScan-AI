import tensorflow as tf
import keras

MODEL_PATH = "model/brain_tumor_final.keras"

print("TensorFlow version:", tf.__version__)
print("Keras version:", keras.__version__)

print("\nLoading model...")

model = keras.models.load_model(MODEL_PATH)

print("\nModel loaded successfully!")
print("Input shape:", model.input_shape)
print("Output shape:", model.output_shape)