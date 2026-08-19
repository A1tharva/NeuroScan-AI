import axios from "axios";
import FormData from "form-data";
import fs from "fs";

const ML_SERVICE_URL = "http://127.0.0.1:8000";

export const analyzeMRI = async (imagePath) => {
    try {
        const formData = new FormData();

        formData.append(
            "image",
            fs.createReadStream(imagePath)
        );

        const response = await axios.post(
            `${ML_SERVICE_URL}/predict`,
            formData,
            {
                headers: {
                    ...formData.getHeaders()
                },
                maxContentLength: Infinity,
                maxBodyLength: Infinity
            }
        );

        return response.data;

    } catch (error) {

        console.error(
            "ML Service Error:",
            error.response?.data || error.message
        );

        throw new Error(
            "Failed to communicate with ML service"
        );
    }
};