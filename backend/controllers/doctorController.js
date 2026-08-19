import User from "../models/User.js";

export const getDoctorProfile = async (req, res) => {
    try {
        const doctor = await User.findById(req.user.userId)
            .select("-password");

        if (!doctor) {
            return res.status(404).json({
                success: false,
                message: "Doctor not found"
            });
        }

        return res.json({
            success: true,
            doctor
        });

    } catch (error) {
        console.error(
            "Get doctor profile error:",
            error.message
        );

        return res.status(500).json({
            success: false,
            message: "Failed to get doctor profile"
        });
    }
};


export const updateDoctorProfile = async (req, res) => {
    try {
        const {
            name,
            phone,
            specialization,
            registrationNumber,
            hospital,
            yearsOfExperience
        } = req.body;

        const doctor = await User.findById(req.user.userId);

        if (!doctor) {
            return res.status(404).json({
                success: false,
                message: "Doctor not found"
            });
        }

        if (name !== undefined) {
            doctor.name = name.trim();
        }

        if (phone !== undefined) {
            doctor.phone = phone.trim();
        }

        if (specialization !== undefined) {
            doctor.specialization = specialization.trim();
        }

        if (registrationNumber !== undefined) {
            doctor.registrationNumber =
                registrationNumber.trim();
        }

        if (hospital !== undefined) {
            doctor.hospital = hospital.trim();
        }

        if (yearsOfExperience !== undefined) {
            doctor.yearsOfExperience = yearsOfExperience;
        }

        await doctor.save();

        return res.json({
            success: true,
            message: "Doctor profile updated successfully",
            doctor: {
                id: doctor._id,
                name: doctor.name,
                email: doctor.email,
                phone: doctor.phone,
                specialization: doctor.specialization,
                registrationNumber: doctor.registrationNumber,
                hospital: doctor.hospital,
                yearsOfExperience: doctor.yearsOfExperience,
                profilePhoto: doctor.profilePhoto
            }
        });

    } catch (error) {
        console.error(
            "Update doctor profile error:",
            error.message
        );

        return res.status(500).json({
            success: false,
            message: "Failed to update doctor profile"
        });
    }
};