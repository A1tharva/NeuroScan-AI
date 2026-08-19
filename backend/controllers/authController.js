import bcrypt from "bcrypt";
import User from "../models/User.js";
import jwt from "jsonwebtoken";

export const registerDoctor = async (req, res) => {
    try {
        const {
            name,
            email,
            password,
            specialization,
            registrationNumber,
            hospital,
            phone
        } = req.body;

        // Validate required fields
        if (!name || !email || !password) {
            return res.status(400).json({
                success: false,
                message: "Name, email and password are required"
            });
        }

        // Check whether doctor already exists
        const existingUser = await User.findOne({
            email: email.toLowerCase()
        });

        if (existingUser) {
            return res.status(409).json({
                success: false,
                message: "Doctor with this email already exists"
            });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create doctor
        const doctor = await User.create({
            name,
            email: email.toLowerCase(),
            password: hashedPassword,
            specialization,
            registrationNumber,
            hospital,
            phone
        });

        return res.status(201).json({
            success: true,
            message: "Doctor registered successfully",
            doctor: {
                id: doctor._id,
                name: doctor.name,
                email: doctor.email,
                specialization: doctor.specialization,
                hospital: doctor.hospital
            }
        });

    } catch (error) {
        console.error(
            "Doctor registration error:",
            error.message
        );

        return res.status(500).json({
            success: false,
            message: "Registration failed"
        });
    }
};

export const loginDoctor = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Email and password are required"
            });
        }

        const doctor = await User.findOne({
            email: email.toLowerCase()
        });

        if (!doctor) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password"
            });
        }

        const isPasswordValid = await bcrypt.compare(
            password,
            doctor.password
        );

        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password"
            });
        }

        const token = jwt.sign(
            {
                userId: doctor._id
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "1d"
            }
        );

        return res.json({
            success: true,
            message: "Login successful",
            token,
            doctor: {
                id: doctor._id,
                name: doctor.name,
                email: doctor.email
            }
        });

    } catch (error) {
        console.error(
            "Doctor login error:",
            error.message
        );

        return res.status(500).json({
            success: false,
            message: "Login failed"
        });
    }
};


export const getCurrentDoctor = async (req, res) => {
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
            doctor: {
                id: doctor._id,
                name: doctor.name,
                email: doctor.email,
                createdAt: doctor.createdAt
            }
        });

    } catch (error) {
        console.error(
            "Get current doctor error:",
            error.message
        );

        return res.status(500).json({
            success: false,
            message: "Failed to get doctor profile"
        });
    }
};

export const logoutDoctor = async (req, res) => {
    return res.json({
        success: true,
        message: "Logout successful"
    });
};