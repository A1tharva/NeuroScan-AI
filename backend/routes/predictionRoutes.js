import express from "express";
import multer from "multer";

import {
    analyzePrediction,
    updatePredictionNotes,
    getPatientPredictions,
    getPredictionById,
    comparePredictions
} from "../controllers/predictionController.js";

import authMiddleware from "../middleware/authMiddleware.js";



const router = express.Router();


// --------------------------------------------------
// Multer configuration
// --------------------------------------------------

const storage = multer.diskStorage({

    destination: (req, file, cb) => {

        cb(
            null,
            "uploads"
        );
    },

    filename: (req, file, cb) => {

        const uniqueName =
            `${Date.now()}-${file.originalname}`;

        cb(
            null,
            uniqueName
        );
    }
});


const upload = multer({
    storage: storage,

    limits: {
        fileSize: 10 * 1024 * 1024
    }
});


// --------------------------------------------------
// Analyze MRI
// --------------------------------------------------

router.post(
    "/analyze",
    authMiddleware,
    upload.single("image"),
    analyzePrediction
);

router.put(
    "/:id/notes",
    authMiddleware,
    updatePredictionNotes
);

router.get(
    "/patient/:patientId",
    authMiddleware,
    getPatientPredictions
);

router.get(
    "/compare",
    authMiddleware,
    comparePredictions
);

router.get(
    "/:id",
    authMiddleware,
    getPredictionById
);



export default router;