const analyzeBtn = document.getElementById("analyzeBtn");
const mriImage = document.getElementById("mriImage");
const status = document.getElementById("status");


analyzeBtn.addEventListener("click", async () => {

    // Check image
    if (!mriImage.files.length) {

        status.textContent =
            "Please select an MRI image.";

        return;
    }


    const file = mriImage.files[0];


    // Create form data
    const formData = new FormData();

    formData.append(
        "image",
        file
    );


    status.textContent =
        "Analyzing MRI...";


    analyzeBtn.disabled = true;


    try {

        const response = await fetch(
            "/api/predictions/analyze",
            {
                method: "POST",
                body: formData
            }
        );


        const result =
            await response.json();


        if (!response.ok || !result.success) {

            throw new Error(
                result.message ||
                "AI analysis failed."
            );
        }


        console.log(
            "AI Result:",
            result
        );


        status.innerHTML = `
            <h2>Prediction: ${result.prediction}</h2>

            <p>
                Confidence:
                ${(result.confidence * 100).toFixed(2)}%
            </p>

            <img
                src="${result.gradcamImage}"
                alt="Grad-CAM"
                style="max-width:400px;"
            >
        `;


    } catch (error) {

        console.error(
            "Analysis error:",
            error
        );

        status.textContent =
            error.message ||
            "Something went wrong.";

    } finally {

        analyzeBtn.disabled = false;

    }

});