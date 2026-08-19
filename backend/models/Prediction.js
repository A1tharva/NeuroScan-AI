import mongoose from "mongoose";

const predictionSchema = new mongoose.Schema(
    {
        doctorId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        patientId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Patient",
            required: true
        },

        originalImage: {
            type: String,
            required: true
        },

        gradcamImage: {
            type: String,
            required: true
        },

        prediction: {
            type: String,
            required: true
        },

        confidence: {
            type: Number,
            required: true
        },

        probabilities: {
            type: mongoose.Schema.Types.Mixed,
            required: true
        },

        aiSummary: {
            type: String,
            default: ""
        },

        doctorNotes: {
            type: String,
            default: ""
        },

        clinicalObservations: {
            type: String,
            default: ""
        }
    },
    {
        timestamps: true
    }
);

const Prediction = mongoose.model(
    "Prediction",
    predictionSchema
);

export default Prediction;