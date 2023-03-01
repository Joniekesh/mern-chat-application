import express from "express";
import {
	createGroupChat,
	createPrivateChat,
	deleteChat,
	getChatById,
	getChatMembers,
	getChats,
	joinChat,
	leaveChat,
	removeUser,
	updateChatRoom,
} from "../controllers/chat.js";
import { isAuthenticated } from "../middleware/auth.js";

const router = express.Router();

router.post("/", isAuthenticated, createGroupChat);
router.post("/:senderId/:receiverId", isAuthenticated, createPrivateChat);
router.get("/me", isAuthenticated, getChats);
router.get("/:id", isAuthenticated, getChatById);
router.get("/:id/members", isAuthenticated, getChatMembers);
router.put("/:id", isAuthenticated, joinChat);
router.put("/:id/leave", isAuthenticated, leaveChat);
router.put("/:id/removeuser", isAuthenticated, removeUser);

router.put("/:id/update", isAuthenticated, updateChatRoom);

router.delete("/:id", isAuthenticated, deleteChat);

export default router;
