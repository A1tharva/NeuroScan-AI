import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import mongoose from "mongoose";
import { generateReportPDF } from "../services/pdfService.js";
import Report from "../models/Report.js";
import Patient from "../models/Patient.js";
import Prediction from "../models/Prediction.js";

export const createReport = async (req, res) => {
    try {
        const {
            patientId,
            predictionId,
            title,
            doctorNotes,
            clinicalObservations
        } = req.body;

        // ---------------------------------------------
        // Validate required fields
        // ---------------------------------------------

        if (!patientId || !predictionId) {
            return res.status(400).json({
                success: false,
                message: "patientId and predictionId are required"
            });
        }

        // ---------------------------------------------
        // Verify patient ownership
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

        // ---------------------------------------------
        // Verify prediction ownership
        // ---------------------------------------------

        const prediction = await Prediction.findOne({
            _id: predictionId,
            doctorId: req.user.userId,
            patientId: patient._id
        });

        if (!prediction) {
            return res.status(404).json({
                success: false,
                message: "Prediction not found or access denied"
            });
        }

        // ---------------------------------------------
        // Create report
        // ---------------------------------------------

        const report = await Report.create({
            doctorId: req.user.userId,
            patientId: patient._id,
            predictionId: prediction._id,

            title:
                title || "MRI Analysis Report",

            doctorNotes:
                doctorNotes || prediction.doctorNotes || "",

            clinicalObservations:
                clinicalObservations ||
                prediction.clinicalObservations ||
                ""
        });

        // ---------------------------------------------
        // Return created report
        // ---------------------------------------------

        return res.status(201).json({
            success: true,
            message: "Report created successfully",
            report
        });

    } catch (error) {

        console.error(
            "Create report error:",
            error.message
        );

        return res.status(500).json({
            success: false,
            message: "Failed to create report"
        });
    }
};


export const getReports = async (req, res) => {
    try {
        const reports = await Report.find({
            doctorId: req.user.userId
        })
            .sort({ createdAt: -1 })
            .populate(
                "patientId",
                "patientId name age gender"
            )
            .populate(
                "predictionId",
                "prediction confidence createdAt"
            );

        return res.status(200).json({
            success: true,
            count: reports.length,
            reports
        });

    } catch (error) {

        console.error(
            "Get reports error:",
            error.message
        );

        return res.status(500).json({
            success: false,
            message: "Failed to get reports"
        });
    }
};


export const getReportById = async (req, res) => {
    try {
        const { id } = req.params;

        const report = await Report.findOne({
            _id: id,
            doctorId: req.user.userId
        })
            .populate(
                "patientId",
                "patientId name age gender dateOfBirth phone email"
            )
            .populate(
                "predictionId",
                "originalImage gradcamImage prediction confidence probabilities aiSummary doctorNotes clinicalObservations createdAt"
            );

        if (!report) {
            return res.status(404).json({
                success: false,
                message: "Report not found or access denied"
            });
        }

        return res.status(200).json({
            success: true,
            report
        });

    } catch (error) {
        console.error(
            "Get report by ID error:",
            error.message
        );

        return res.status(500).json({
            success: false,
            message: "Failed to get report details"
        });
    }
};


export const finalizeReport = async (req, res) => {
    try {
        const { id } = req.params;

        const report = await Report.findOne({
            _id: id,
            doctorId: req.user.userId
        });

        if (!report) {
            return res.status(404).json({
                success: false,
                message: "Report not found or access denied"
            });
        }

        if (report.reportStatus === "final") {
            return res.status(400).json({
                success: false,
                message: "Report is already finalized"
            });
        }

        report.reportStatus = "final";

        await report.save();

        return res.status(200).json({
            success: true,
            message: "Report finalized successfully",
            report
        });

    } catch (error) {
        console.error(
            "Finalize report error:",
            error.message
        );

        return res.status(500).json({
            success: false,
            message: "Failed to finalize report"
        });
    }
};

export const downloadReportPDF = async (req, res) => {
    try {
        const { id } = req.params;

        const report = await Report.findOne({
            _id: id,
            doctorId: req.user.userId
        })
            .populate(
                "patientId",
                "patientId name age gender dateOfBirth phone email"
            )
            .populate(
                "predictionId",
                "originalImage gradcamImage prediction confidence probabilities aiSummary doctorNotes clinicalObservations createdAt"
            );

        if (!report) {
            return res.status(404).json({
                success: false,
                message: "Report not found or access denied"
            });
        }

        const doctor = await mongoose.model("User").findById(
            req.user.userId
        ).select(
            "name email specialization hospital"
        );

        if (!doctor) {
            return res.status(404).json({
                success: false,
                message: "Doctor not found"
            });
        }

        const reportsDirectory = path.join(
            process.cwd(),
            "reports"
        );

        if (!fs.existsSync(reportsDirectory)) {
            fs.mkdirSync(
                reportsDirectory,
                { recursive: true }
            );
        }

        const fileName =
            `report-${report._id}.pdf`;

        const outputPath =
            path.join(
                reportsDirectory,
                fileName
            );

        await generateReportPDF(
            {
                report,
                doctor,
                patient: report.patientId,
                prediction: report.predictionId
            },
            outputPath
        );

        return res.download(
            outputPath,
            fileName
        );

    } catch (error) {

        console.error(
            "Download report PDF error:",
            error.message
        );

        return res.status(500).json({
            success: false,
            message: "Failed to generate report PDF"
        });
    }
};