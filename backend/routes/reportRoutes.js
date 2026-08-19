import express from "express";

import {
    createReport,
      getReports,
      getReportById,
      finalizeReport,
      downloadReportPDF
} from "../controllers/reportController.js";

import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.post(
    "/",
    authMiddleware,
    createReport
);

router.get(
    "/",
    authMiddleware,
    getReports
);

router.get(
    "/:id/download",
    authMiddleware,
    downloadReportPDF
);

router.get(
    "/:id",
    authMiddleware,
    getReportById
);

router.patch(
    "/:id/finalize",
    authMiddleware,
    finalizeReport
);



export default router;