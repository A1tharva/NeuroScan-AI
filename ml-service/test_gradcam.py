from services.gradcam import generate_gradcam


IMAGE_PATH = "uploads/3f1026036eee44d1b9bcfca7702bdbdb.jpg"
OUTPUT_PATH = "outputs/test_gradcam.jpg"


print("Starting Grad-CAM test...")
print("Input image:", IMAGE_PATH)
print("Output image:", OUTPUT_PATH)

try:

    result = generate_gradcam(
        IMAGE_PATH,
        OUTPUT_PATH
    )

    print()
    print("Grad-CAM generated successfully!")
    print("Saved to:", result)

except Exception as e:

    print()
    print("Grad-CAM generation failed!")
    print("Error:", str(e))