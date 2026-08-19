import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

import connectDB from "./config/db.js";

import authRoutes from "./routes/authRoutes.js";
import doctorRoutes from "./routes/doctorRoutes.js";
import predictionRoutes from "./routes/predictionRoutes.js";
import patientRoutes from "./routes/patientRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";
import reportRoutes from "./routes/reportRoutes.js";

dotenv.config();

const app = express();

const PORT = process.env.PORT || 5000;

// --------------------------------------------------
// Connect MongoDB
// --------------------------------------------------

connectDB();

// --------------------------------------------------
// ES Module path
// --------------------------------------------------

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// --------------------------------------------------
// Upload directory
// --------------------------------------------------

const uploadDirectory = path.join(
    __dirname,
    "uploads"
);

fs.mkdirSync(
    uploadDirectory,
    {
        recursive: true
    }
);

// --------------------------------------------------
// Middleware
// --------------------------------------------------

app.use(cors());

app.use(express.json());

app.use(
    express.urlencoded({
        extended: true
    })
);

app.use(express.static("public"));

// --------------------------------------------------
// Serve uploaded MRI files
// --------------------------------------------------

app.use(
    "/uploads",
    express.static(uploadDirectory)
);

// --------------------------------------------------
// Health check
// --------------------------------------------------

app.get(
    "/api/health",
    (req, res) => {
        res.json({
            success: true,
            service: "NeuroScan AI Backend",
            status: "running"
        });
    }
);

app.use(
    "/api/dashboard",
    dashboardRoutes
);

// --------------------------------------------------
// Authentication routes
// --------------------------------------------------

app.use(
    "/api/auth",
    authRoutes
);

// --------------------------------------------------
// Doctor routes
// --------------------------------------------------

app.use(
    "/api/doctors",
    doctorRoutes
);


app.use(
    "/api/patients",
    patientRoutes
);
// --------------------------------------------------
// Prediction routes
// --------------------------------------------------

app.use(
    "/api/predictions",
    predictionRoutes
);

app.use(
    "/api/reports",
    reportRoutes
);

// --------------------------------------------------
// Start server
// --------------------------------------------------

app.listen(
    PORT,
    "0.0.0.0",
    () => {
        console.log(
            `NeuroScan AI Backend running on http://localhost:${PORT}`
        );
    }
);