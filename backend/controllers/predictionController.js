import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

import { analyzeMRI } from "../services/mlService.js";
import Patient from "../models/Patient.js";
import Prediction from "../models/Prediction.js";
// import Prediction from "../models/Prediction.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const analyzePrediction = async (req, res) => {
    let imagePath = null;

    try {
        // ---------------------------------------------
        // Check uploaded MRI
        // ---------------------------------------------

        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "MRI image is required"
            });
        }

        // ---------------------------------------------
        // Check patientId
        // ---------------------------------------------

        const { patientId } = req.body;

        if (!patientId) {
            return res.status(400).json({
                success: false,
                message: "patientId is required"
            });
        }

        imagePath = req.file.path;

        // ---------------------------------------------
        // Verify patient belongs to logged-in doctor
        // ---------------------------------------------

        const patient = await Patient.findOne({
            _id: patientId,
            doctorId: req.user.userId
        });

        if (!patient) {
            return res.status(404).json({
                success: false,
                message: "Patient not found or access denied"
            });
        }

        console.log("MRI received by Node.js:");
        console.log(req.file.originalname);

        // ---------------------------------------------
        // Send MRI to existing FastAPI service
        // ---------------------------------------------

        const result = await analyzeMRI(imagePath);

        // ---------------------------------------------
        // Existing Grad-CAM response
        // ---------------------------------------------

        const gradcamPath = result.gradcam_url;

        const gradcamUrl =
            `http://127.0.0.1:8000${gradcamPath}`;

        // ---------------------------------------------
        // Generate AI Summary
        // ---------------------------------------------

        const confidencePercent =
            Number(result.confidence) <= 1
                ? Number(result.confidence) * 100
                : Number(result.confidence);

        const aiSummary =
            `The MRI analysis was classified as ${result.prediction} ` +
            `with a confidence of ${confidencePercent.toFixed(1)}%. ` +
            `This result is an AI-assisted analysis and should be reviewed ` +
            `by the doctor along with the patient's clinical information.`;

        // ---------------------------------------------
        // Save prediction in MongoDB
        // ---------------------------------------------

        const prediction = await Prediction.create({

            doctorId: req.user.userId,

            patientId: patient._id,

            originalImage:
                `/uploads/${req.file.filename}`,

            gradcamImage:
                gradcamUrl,

            prediction:
                result.prediction,

            confidence:
                result.confidence,

            probabilities:
                result.probabilities,

            aiSummary:
                aiSummary
        });

        // ---------------------------------------------
        // Return result
        // ---------------------------------------------

        return res.status(201).json({
            success: true,

            predictionId:
                prediction._id,

            patientId:
                patient._id,

            prediction:
                prediction.prediction,

            confidence:
                prediction.confidence,

            probabilities:
                prediction.probabilities,

            originalImage:
                prediction.originalImage,

            gradcamImage:
                prediction.gradcamImage,

            aiSummary:
                prediction.aiSummary,

            message:
                result.message
        });

    } catch (error) {

        console.error(
            "Prediction controller error:",
            error.message
        );

        return res.status(500).json({
            success: false,
            message: "AI analysis failed"
        });

    } finally {

        // Keep uploaded MRI for now.
        // Storage management will be handled later.
    }
};

export const updatePredictionNotes = async (req, res) => {
    try {
        const { doctorNotes, clinicalObservations } = req.body;

        const prediction = await Prediction.findOne({
            _id: req.params.id,
            doctorId: req.user.userId
        });

        if (!prediction) {
            return res.status(404).json({
                success: false,
                message: "Prediction not found or access denied"
            });
        }

        if (doctorNotes !== undefined) {
            prediction.doctorNotes = doctorNotes;
        }

        if (clinicalObservations !== undefined) {
            prediction.clinicalObservations = clinicalObservations;
        }

        await prediction.save();

        return res.status(200).json({
            success: true,
            message: "Doctor notes updated successfully",
            prediction: {
                id: prediction._id,
                doctorNotes: prediction.doctorNotes,
                clinicalObservations: prediction.clinicalObservations,
                updatedAt: prediction.updatedAt
            }
        });

    } catch (error) {
        console.error(
            "Update prediction notes error:",
            error.message
        );

        return res.status(500).json({
            success: false,
            message: "Failed to update doctor notes"
        });
    }
};

export const getPatientPredictions = async (req, res) => {
    try {
        const { patientId } = req.params;

        // Verify that the patient belongs to the logged-in doctor
        const patient = await Patient.findOne({
            _id: patientId,
            doctorId: req.user.userId
        });

        if (!patient) {
            return res.status(404).json({
                success: false,
                message: "Patient not found or access denied"
            });
        }

        // Get all predictions for this patient
        const predictions = await Prediction.find({
            patientId: patient._id,
            doctorId: req.user.userId
        })
            .sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            patientId: patient._id,
            count: predictions.length,
            predictions
        });

    } catch (error) {
        console.error(
            "Get patient predictions error:",
            error.message
        );

        return res.status(500).json({
            success: false,
            message: "Failed to get patient scan history"
        });
    }
};


export const getPredictionById = async (req, res) => {
    try {
        const { id } = req.params;

        const prediction = await Prediction.findOne({
            _id: id,
            doctorId: req.user.userId
        }).populate(
            "patientId",
            "patientId name age gender"
        );

        if (!prediction) {
            return res.status(404).json({
                success: false,
                message: "Prediction not found or access denied"
            });
        }

        return res.status(200).json({
            success: true,
            prediction
        });

    } catch (error) {
        console.error(
            "Get prediction by ID error:",
            error.message
        );

        return res.status(500).json({
            success: false,
            message: "Failed to get prediction details"
        });
    }
};


export const comparePredictions = async (req, res) => {
    try {
        const { scan1, scan2 } = req.query;

        // Check that both scan IDs were provided
        if (!scan1 || !scan2) {
            return res.status(400).json({
                success: false,
                message: "Both scan1 and scan2 are required"
            });
        }

        // Prevent comparing a scan with itself
        if (scan1 === scan2) {
            return res.status(400).json({
                success: false,
                message: "Please select two different scans"
            });
        }

        // Get both scans belonging to the logged-in doctor
        const predictions = await Prediction.find({
            _id: { $in: [scan1, scan2] },
            doctorId: req.user.userId
        })
            .populate(
                "patientId",
                "patientId name age gender"
            )
            .sort({ createdAt: 1 });

        // Both scans must exist
        if (predictions.length !== 2) {
            return res.status(404).json({
                success: false,
                message: "One or both scans were not found or access was denied"
            });
        }

        // Both scans must belong to the same patient
        if (
            predictions[0].patientId._id.toString() !==
            predictions[1].patientId._id.toString()
        ) {
            return res.status(400).json({
                success: false,
                message: "Only scans belonging to the same patient can be compared"
            });
        }

        return res.status(200).json({
            success: true,

            patient: predictions[0].patientId,

            scan1: predictions[0],

            scan2: predictions[1]
        });

    } catch (error) {

        console.error(
            "Compare predictions error:",
            error.message
        );

        return res.status(500).json({
            success: false,
            message: "Failed to compare scans"
        });
    }
};