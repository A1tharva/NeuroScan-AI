import express from "express";

import {
    createPatient,
    getPatients,
    getPatientById,
    updatePatient,
    archivePatient,
    restorePatient
} from "../controllers/patientController.js";

import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.post(
    "/",
    authMiddleware,
    createPatient
);

router.get(
    "/",
    authMiddleware,
    getPatients
);

router.get(
    "/:id",
    authMiddleware,
    getPatientById
);

router.put(
    "/:id",
    authMiddleware,
    updatePatient
);

router.patch(
    "/:id/archive",
    authMiddleware,
    archivePatient
);

router.patch(
    "/:id/restore",
    authMiddleware,
    restorePatient
);

export default router;