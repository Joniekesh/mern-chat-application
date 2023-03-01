import express from "express";
import {
	forgotPassword,
	getProfile,
	login,
	register,
	resetPassword,
} from "../controllers/auth.js";
import { isAuthenticated } from "../middleware/auth.js";

const router = express.Router();

router.post("/", register);
router.post("/login", login);
router.get("/me", isAuthenticated, getProfile);
router.post("/forgotpassword", forgotPassword);
router.put("/:resetToken", resetPassword);

export default router;
