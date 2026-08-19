import mongoose from "mongoose";

const patientSchema = new mongoose.Schema(
    {
        doctorId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        patientId: {
            type: String,
            required: true,
            trim: true
        },

        name: {
            type: String,
            required: true,
            trim: true
        },

        age: {
            type: Number,
            required: true,
            min: 0
        },

        gender: {
            type: String,
            required: true,
            trim: true
        },

        dateOfBirth: {
            type: Date
        },

        phone: {
            type: String,
            trim: true
        },

        email: {
            type: String,
            trim: true,
            lowercase: true
        },

        medicalHistory: {
            type: String,
            trim: true
        },

        currentSymptoms: {
            type: String,
            trim: true
        },

        previousDiagnosis: {
            type: String,
            trim: true
        },

        additionalNotes: {
            type: String,
            trim: true
        },

        status: {
            type: String,
            enum: ["active", "archived"],
            default: "active"
        }
    },
    {
        timestamps: true
    }
);

patientSchema.index({
    doctorId: 1,
    patientId: 1
}, {
    unique: true
});

const Patient = mongoose.model(
    "Patient",
    patientSchema
);

export default Patient;