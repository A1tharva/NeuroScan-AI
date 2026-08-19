import express from "express";

import {
    getDoctorProfile,
    updateDoctorProfile
} from "../controllers/doctorController.js";

import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.get(
    "/profile",
    authMiddleware,
    getDoctorProfile
);

router.put(
    "/profile",
    authMiddleware,
    updateDoctorProfile
);

export default router;