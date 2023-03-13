import express from "express";
import {
	deleteAccount,
	getUserById,
	getUsers,
	updateUser,
} from "../controllers/user.js";
import { isAuthenticated } from "../middleware/auth.js";
const router = express.Router();

router.get("/find/:id", isAuthenticated, getUserById);
router.put("/me", isAuthenticated, updateUser);
router.get("/", isAuthenticated, getUsers);
router.delete("/me", isAuthenticated, deleteAccount);

export default router;
