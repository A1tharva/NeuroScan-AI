from services.prediction import predict_image


IMAGE_PATH = "uploads/3f1026036eee44d1b9bcfca7702bdbdb.jpg"


result = predict_image(IMAGE_PATH)


print("\nPrediction Result")
print("-----------------")

print("Prediction:", result["prediction"])
print("Confidence:", result["confidence"])

print("\nClass Probabilities:")

for class_name, probability in result["probabilities"].items():
    print(f"{class_name}: {probability:.4f}")