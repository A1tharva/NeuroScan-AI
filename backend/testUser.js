import dotenv from "dotenv";
import connectDB from "./config/db.js";
import User from "./models/User.js";

dotenv.config();

const testUser = async () => {
    try {
        await connectDB();

        const user = await User.create({
            name: "Test Doctor",
            email: "testdoctor@neuroscan.ai",
            password: "temporary-password"
        });

        console.log("User created successfully:");
        console.log(user);

        process.exit(0);

    } catch (error) {
        console.error("User test failed:");
        console.error(error.message);

        process.exit(1);
    }
};

testUser();