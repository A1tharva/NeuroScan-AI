import PDFDocument from "pdfkit";
import fs from "fs";
import path from "path";

export const generateReportPDF = (reportData, outputPath) => {
    return new Promise((resolve, reject) => {
        try {
            const doc = new PDFDocument({
                size: "A4",
                margin: 50
            });

            const stream = fs.createWriteStream(outputPath);

            doc.pipe(stream);

            const {
                report,
                doctor,
                patient,
                prediction
            } = reportData;

            // ---------------------------------------------
            // Header
            // ---------------------------------------------

            doc
                .fontSize(22)
                .font("Helvetica-Bold")
                .text("NeuroScan AI", {
                    align: "center"
                });

            doc
                .moveDown(0.5)
                .fontSize(16)
                .text("MRI Brain Analysis Report", {
                    align: "center"
                });

            doc.moveDown(1);

            // ---------------------------------------------
            // Report Information
            // ---------------------------------------------

            doc
                .fontSize(11)
                .font("Helvetica")
                .text(`Report ID: ${report._id}`);

            doc.text(
                `Report Date: ${new Date(
                    report.createdAt
                ).toLocaleDateString()}`
            );

            doc.text(
                `Status: ${report.reportStatus}`
            );

            doc.moveDown(1);

            // ---------------------------------------------
            // Doctor Information
            // ---------------------------------------------

            doc
                .fontSize(14)
                .font("Helvetica-Bold")
                .text("Doctor Information");

            doc.moveDown(0.3);

            doc
                .fontSize(11)
                .font("Helvetica")
                .text(`Name: ${doctor.name || "N/A"}`)
                .text(`Email: ${doctor.email || "N/A"}`)
                .text(`Specialization: ${doctor.specialization || "N/A"}`)
                .text(`Hospital: ${doctor.hospital || "N/A"}`);

            doc.moveDown(1);

            // ---------------------------------------------
            // Patient Information
            // ---------------------------------------------

            doc
                .fontSize(14)
                .font("Helvetica-Bold")
                .text("Patient Information");

            doc.moveDown(0.3);

            doc
                .fontSize(11)
                .font("Helvetica")
                .text(`Patient ID: ${patient.patientId || "N/A"}`)
                .text(`Name: ${patient.name || "N/A"}`)
                .text(`Age: ${patient.age ?? "N/A"}`)
                .text(`Gender: ${patient.gender || "N/A"}`);

            doc.moveDown(1);

            // ---------------------------------------------
            // AI Analysis
            // ---------------------------------------------

            doc
                .fontSize(14)
                .font("Helvetica-Bold")
                .text("AI Analysis");

            doc.moveDown(0.3);

            doc
                .fontSize(11)
                .font("Helvetica")
                .text(
                    `Prediction: ${prediction.prediction || "N/A"}`
                )
                .text(
                    `Confidence: ${
                        prediction.confidence !== undefined
                            ? `${(
                                Number(prediction.confidence) * 100
                            ).toFixed(2)}%`
                            : "N/A"
                    }`
                );

            doc.moveDown(0.5);

            doc
                .font("Helvetica-Bold")
                .text("AI Summary");

            doc
                .font("Helvetica")
                .text(
                    prediction.aiSummary || "No AI summary available."
                );

            doc.moveDown(1);

            // ---------------------------------------------
            // Class Probabilities
            // ---------------------------------------------

            if (prediction.probabilities) {

                doc
                    .fontSize(14)
                    .font("Helvetica-Bold")
                    .text("Class Probabilities");

                doc.moveDown(0.3);

                doc.fontSize(11).font("Helvetica");

                Object.entries(
                    prediction.probabilities
                ).forEach(([className, probability]) => {

                    const percentage =
                        Number(probability) * 100;

                    doc.text(
                        `${className}: ${percentage.toFixed(2)}%`
                    );
                });

                doc.moveDown(1);
            }

            // ---------------------------------------------
            // Doctor Review
            // ---------------------------------------------

            doc
                .fontSize(14)
                .font("Helvetica-Bold")
                .text("Doctor Review");

            doc.moveDown(0.3);

            doc
                .fontSize(11)
                .font("Helvetica")
                .text("Doctor Notes:");

            doc.text(
                report.doctorNotes ||
                prediction.doctorNotes ||
                "No doctor notes provided."
            );

            doc.moveDown(0.5);

            doc
                .font("Helvetica-Bold")
                .text("Clinical Observations:");

            doc
                .font("Helvetica")
                .text(
                    report.clinicalObservations ||
                    prediction.clinicalObservations ||
                    "No clinical observations provided."
                );

            doc.moveDown(1);

            // ---------------------------------------------
            // AI Disclaimer
            // ---------------------------------------------

            doc
                .fontSize(10)
                .font("Helvetica-Bold")
                .text("Important Notice");

            doc
                .font("Helvetica")
                .text(
                    "This report contains AI-assisted analysis " +
                    "and is intended to support clinical review. " +
                    "The AI output is not a definitive medical diagnosis " +
                    "and should be interpreted by a qualified healthcare professional."
                );

            // ---------------------------------------------
            // Finish PDF
            // ---------------------------------------------

            doc.end();

            stream.on("finish", () => {
                resolve(outputPath);
            });

            stream.on("error", (error) => {
                reject(error);
            });

        } catch (error) {
            reject(error);
        }
    });
};