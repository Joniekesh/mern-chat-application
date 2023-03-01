import express from "express";
import { getUserById, getUsers, updateUser } from "../controllers/user.js";
import { isAuthenticated } from "../middleware/auth.js";
const router = express.Router();

router.get("/find/:id", isAuthenticated, getUserById);
router.put("/me", isAuthenticated, updateUser);
router.get("/", isAuthenticated, getUsers);

export default router;
