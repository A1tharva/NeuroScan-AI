import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";

import {
    registerDoctor,
    loginDoctor,
    getCurrentDoctor,
    logoutDoctor
} from "../controllers/authController.js";

const router = express.Router();

router.post(
    "/register",
    registerDoctor
);

router.post(
    "/login",
    loginDoctor
);



router.get(
    "/me",
    authMiddleware,
    getCurrentDoctor
);

router.post(
    "/logout",
    authMiddleware,
    logoutDoctor
);


export default router;