import mongoose from "mongoose";

const reportSchema = new mongoose.Schema(
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

        predictionId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Prediction",
            required: true
        },

        title: {
            type: String,
            trim: true,
            default: "MRI Analysis Report"
        },

        reportStatus: {
            type: String,
            enum: ["draft", "final"],
            default: "draft"
        },

        doctorNotes: {
            type: String,
            trim: true,
            default: ""
        },

        clinicalObservations: {
            type: String,
            trim: true,
            default: ""
        }
    },
    {
        timestamps: true
    }
);

const Report = mongoose.model(
    "Report",
    reportSchema
);

export default Report;