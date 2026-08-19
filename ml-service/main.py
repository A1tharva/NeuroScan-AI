import os
import uuid

from fastapi import FastAPI, File, HTTPException, UploadFile
from fastapi.responses import JSONResponse
from fastapi.staticfiles import StaticFiles

from services.prediction import predict_image
from services.gradcam import generate_gradcam


# --------------------------------------------------
# FastAPI application
# --------------------------------------------------

app = FastAPI(
    title="NeuroScan AI ML Service",
    description="Brain MRI AI analysis using EfficientNetB4 and Grad-CAM",
    version="1.0.0"
)


# --------------------------------------------------
# Directories
# --------------------------------------------------

UPLOAD_DIR = "uploads"
OUTPUT_DIR = "outputs"


os.makedirs(
    UPLOAD_DIR,
    exist_ok=True
)

os.makedirs(
    OUTPUT_DIR,
    exist_ok=True
)


# --------------------------------------------------
# Serve Grad-CAM images
# --------------------------------------------------

app.mount(
    "/outputs",
    StaticFiles(directory=OUTPUT_DIR),
    name="outputs"
)


# --------------------------------------------------
# Health check
# --------------------------------------------------

@app.get("/")
def root():

    return {
        "service": "NeuroScan AI ML Service",
        "status": "running"
    }


# --------------------------------------------------
# Prediction endpoint
# --------------------------------------------------

@app.post("/predict")
async def predict(
    image: UploadFile = File(...)
):

    # --------------------------------------------------
    # 1. Validate image type
    # --------------------------------------------------

    allowed_types = {
        "image/jpeg",
        "image/jpg",
        "image/png",
        "image/webp"
    }

    if image.content_type not in allowed_types:

        raise HTTPException(
            status_code=400,
            detail="Only JPEG, PNG, and WEBP images are allowed."
        )


    # --------------------------------------------------
    # 2. Generate unique filenames
    # --------------------------------------------------

    file_id = uuid.uuid4().hex

    extension = os.path.splitext(
        image.filename or ""
    )[1].lower()

    if not extension:
        extension = ".jpg"


    input_filename = (
        f"{file_id}{extension}"
    )

    output_filename = (
        f"{file_id}_gradcam.jpg"
    )


    input_path = os.path.join(
        UPLOAD_DIR,
        input_filename
    )

    output_path = os.path.join(
        OUTPUT_DIR,
        output_filename
    )


    # --------------------------------------------------
    # 3. Save uploaded MRI
    # --------------------------------------------------

    try:

        contents = await image.read()

        with open(
            input_path,
            "wb"
        ) as file:

            file.write(contents)

    except Exception as e:

        raise HTTPException(
            status_code=500,
            detail=f"Failed to save uploaded image: {str(e)}"
        )


    # --------------------------------------------------
    # 4. Run prediction
    # --------------------------------------------------

    try:

        prediction_result = predict_image(
            input_path
        )

    except Exception as e:

        if os.path.exists(input_path):
            os.remove(input_path)

        raise HTTPException(
            status_code=500,
            detail=f"Prediction failed: {str(e)}"
        )


    # --------------------------------------------------
    # 5. Generate Grad-CAM
    # --------------------------------------------------

    try:

        generate_gradcam(
            input_path,
            output_path
        )

    except Exception as e:

        if os.path.exists(input_path):
            os.remove(input_path)

        raise HTTPException(
            status_code=500,
            detail=f"Grad-CAM generation failed: {str(e)}"
        )


    # --------------------------------------------------
    # 6. Create Grad-CAM URL
    # --------------------------------------------------

    gradcam_url = (
        f"/outputs/{output_filename}"
    )


    # --------------------------------------------------
    # 7. Return result
    # --------------------------------------------------

    return JSONResponse(
        content={
            "success": True,

            "prediction": prediction_result[
                "prediction"
            ],

            "confidence": prediction_result[
                "confidence"
            ],

            "probabilities": prediction_result[
                "probabilities"
            ],

            "gradcam_url": gradcam_url,

            "message": "AI analysis completed"
        }
    )