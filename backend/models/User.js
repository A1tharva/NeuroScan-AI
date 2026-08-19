import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true
        },

        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true
        },

        password: {
            type: String,
            required: true
        },

        phone: {
            type: String,
            trim: true
        },

        specialization: {
            type: String,
            trim: true
        },

        registrationNumber: {
            type: String,
            trim: true
        },

        hospital: {
            type: String,
            trim: true
        },

        yearsOfExperience: {
            type: Number,
            min: 0
        },

        profilePhoto: {
            type: String,
            default: null
        }
    },
    {
        timestamps: true
    }
);

const User = mongoose.model("User", userSchema);

export default User;