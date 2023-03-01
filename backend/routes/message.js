import express from "express";
import {
	createMessage,
	deleteMessage,
	getMessages,
} from "../controllers/message.js";
import { isAuthenticated } from "../middleware/auth.js";

const router = express.Router();

router.post("/", isAuthenticated, createMessage);
router.get("/:chatId", isAuthenticated, getMessages);
router.delete("/:id", isAuthenticated, deleteMessage);

export default router;
