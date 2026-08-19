import zipfile
import json

MODEL_PATH = "model/brain_tumor_final.keras"

with zipfile.ZipFile(MODEL_PATH, "r") as z:
    print("Files inside .keras package:")
    for name in z.namelist():
        print(" -", name)

    print("\nReading metadata...")

    metadata = json.loads(z.read("metadata.json"))

    print("\nModel metadata:")
    print(json.dumps(metadata, indent=2))