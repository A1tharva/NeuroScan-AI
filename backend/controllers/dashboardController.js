import Patient from "../models/Patient.js";
import Prediction from "../models/Prediction.js";

export const getDashboardStats = async (req, res) => {
    try {
        const doctorId = req.user.userId;

        // ---------------------------------------------
        // Patient statistics
        // ---------------------------------------------

        const totalPatients = await Patient.countDocuments({
            doctorId
        });

        const activePatients = await Patient.countDocuments({
            doctorId,
            status: "active"
        });

        const archivedPatients = await Patient.countDocuments({
            doctorId,
            status: "archived"
        });

        // ---------------------------------------------
        // MRI scan statistics
        // ---------------------------------------------

        const totalScans = await Prediction.countDocuments({
            doctorId
        });

        // ---------------------------------------------
        // Recent patients
        // ---------------------------------------------

        const recentPatients = await Patient.find({
            doctorId
        })
            .sort({ createdAt: -1 })
            .limit(5)
            .select(
                "patientId name age gender status createdAt"
            );

        // ---------------------------------------------
        // Recent AI analyses
        // ---------------------------------------------

        const recentAnalyses = await Prediction.find({
            doctorId
        })
            .sort({ createdAt: -1 })
            .limit(5)
            .populate(
                "patientId",
                "patientId name"
            )
            .select(
                "patientId prediction confidence aiSummary createdAt"
            );

        // ---------------------------------------------
        // Response
        // ---------------------------------------------

        return res.status(200).json({
            success: true,

            statistics: {
                totalPatients,
                activePatients,
                archivedPatients,
                totalScans
            },

            recentPatients,

            recentAnalyses
        });

    } catch (error) {

        console.error(
            "Dashboard statistics error:",
            error.message
        );

        return res.status(500).json({
            success: false,
            message: "Failed to load dashboard data"
        });
    }
};