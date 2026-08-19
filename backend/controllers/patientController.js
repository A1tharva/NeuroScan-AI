import Patient from "../models/Patient.js";

export const createPatient = async (req, res) => {
    try {
        const {
            patientId,
            name,
            age,
            gender,
            dateOfBirth,
            phone,
            email,
            medicalHistory,
            currentSymptoms,
            previousDiagnosis,
            additionalNotes
        } = req.body;

        // Required fields
        if (!patientId || !name || age === undefined || !gender) {
            return res.status(400).json({
                success: false,
                message: "Patient ID, name, age and gender are required"
            });
        }

        // Check whether this patient ID already exists
        // for the logged-in doctor
        const existingPatient = await Patient.findOne({
            doctorId: req.user.userId,
            patientId: patientId.trim()
        });

        if (existingPatient) {
            return res.status(409).json({
                success: false,
                message: "Patient ID already exists"
            });
        }

        const patient = await Patient.create({
            doctorId: req.user.userId,
            patientId: patientId.trim(),
            name: name.trim(),
            age,
            gender: gender.trim(),
            dateOfBirth,
            phone: phone?.trim(),
            email: email?.toLowerCase().trim(),
            medicalHistory: medicalHistory?.trim(),
            currentSymptoms: currentSymptoms?.trim(),
            previousDiagnosis: previousDiagnosis?.trim(),
            additionalNotes: additionalNotes?.trim()
        });

        return res.status(201).json({
            success: true,
            message: "Patient created successfully",
            patient
        });

    } catch (error) {
        console.error(
            "Create patient error:",
            error.message
        );

        return res.status(500).json({
            success: false,
            message: "Failed to create patient"
        });
    }
};

export const getPatients = async (req, res) => {
    try {
        const patients = await Patient.find({
            doctorId: req.user.userId
        }).sort({
            createdAt: -1
        });

        return res.json({
            success: true,
            count: patients.length,
            patients
        });

    } catch (error) {
        console.error(
            "Get patients error:",
            error.message
        );

        return res.status(500).json({
            success: false,
            message: "Failed to get patients"
        });
    }
};

export const getPatientById = async (req, res) => {
    try {
        const patient = await Patient.findOne({
            _id: req.params.id,
            doctorId: req.user.userId
        });

        if (!patient) {
            return res.status(404).json({
                success: false,
                message: "Patient not found"
            });
        }

        return res.json({
            success: true,
            patient
        });

    } catch (error) {
        console.error(
            "Get patient error:",
            error.message
        );

        return res.status(500).json({
            success: false,
            message: "Failed to get patient"
        });
    }
};

export const updatePatient = async (req, res) => {
    try {
        const {
            patientId,
            name,
            age,
            gender,
            dateOfBirth,
            phone,
            email,
            medicalHistory,
            currentSymptoms,
            previousDiagnosis,
            additionalNotes
        } = req.body;

        const patient = await Patient.findOne({
            _id: req.params.id,
            doctorId: req.user.userId
        });

        if (!patient) {
            return res.status(404).json({
                success: false,
                message: "Patient not found"
            });
        }

        if (patientId !== undefined) {
            patient.patientId = patientId.trim();
        }

        if (name !== undefined) {
            patient.name = name.trim();
        }

        if (age !== undefined) {
            patient.age = age;
        }

        if (gender !== undefined) {
            patient.gender = gender.trim();
        }

        if (dateOfBirth !== undefined) {
            patient.dateOfBirth = dateOfBirth;
        }

        if (phone !== undefined) {
            patient.phone = phone.trim();
        }

        if (email !== undefined) {
            patient.email = email.toLowerCase().trim();
        }

        if (medicalHistory !== undefined) {
            patient.medicalHistory = medicalHistory.trim();
        }

        if (currentSymptoms !== undefined) {
            patient.currentSymptoms = currentSymptoms.trim();
        }

        if (previousDiagnosis !== undefined) {
            patient.previousDiagnosis =
                previousDiagnosis.trim();
        }

        if (additionalNotes !== undefined) {
            patient.additionalNotes =
                additionalNotes.trim();
        }

        await patient.save();

        return res.json({
            success: true,
            message: "Patient updated successfully",
            patient
        });

    } catch (error) {
        console.error(
            "Update patient error:",
            error.message
        );

        return res.status(500).json({
            success: false,
            message: "Failed to update patient"
        });
    }
};


export const archivePatient = async (req, res) => {
    try {
        const patient = await Patient.findOne({
            _id: req.params.id,
            doctorId: req.user.userId
        });

        if (!patient) {
            return res.status(404).json({
                success: false,
                message: "Patient not found"
            });
        }

        patient.status = "archived";

        await patient.save();

        return res.json({
            success: true,
            message: "Patient archived successfully",
            patient
        });

    } catch (error) {
        console.error(
            "Archive patient error:",
            error.message
        );

        return res.status(500).json({
            success: false,
            message: "Failed to archive patient"
        });
    }
};

export const restorePatient = async (req, res) => {
    try {
        const patient = await Patient.findOne({
            _id: req.params.id,
            doctorId: req.user.userId
        });

        if (!patient) {
            return res.status(404).json({
                success: false,
                message: "Patient not found"
            });
        }

        patient.status = "active";

        await patient.save();

        return res.json({
            success: true,
            message: "Patient restored successfully",
            patient
        });

    } catch (error) {
        console.error(
            "Restore patient error:",
            error.message
        );

        return res.status(500).json({
            success: false,
            message: "Failed to restore patient"
        });
    }
};