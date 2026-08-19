import fs from "fs";
import { analyzeMRI } from "./services/mlService.js";

const imagePath = "./test-images/mri_image3.webp";

async function testMLService() {
    try {
        console.log("Sending MRI to FastAPI...");

        const result = await analyzeMRI(imagePath);

        console.log("\n===== ML SERVICE RESPONSE =====");
        console.log(JSON.stringify(result, null, 2));

    } catch (error) {
        console.error("\nML test failed:");
        console.error(error.message);
    }
}

if (!fs.existsSync(imagePath)) {
    console.error(`Image not found: ${imagePath}`);
    process.exit(1);
}

testMLService();