import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import colors from "colors";
import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/user.js";
import chatRoutes from "./routes/chat.js";
import messageRoutes from "./routes/message.js";
import multer from "multer";

import {
	addUser,
	getOnlineUsers,
	getUser,
	removeUser,
	joinChat,
	getChat,
	updateUser,
} from "./utils/socketHelperFunction.js";

import { Server } from "socket.io";
import http from "http";

import { connectDB } from "./config/db.js";

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
	cors: { origin: "http://localhost:5173" },
});
// cors: { origin: "https://joniechat.netlify.app" },

io.on("connection", (socket) => {
	socket.on("addUser", (userId) => {
		const onlineUser = addUser(socket.id, userId);

		// Online users
		const onlineUsers = getOnlineUsers();
		socket.emit("onlineUsers", onlineUsers);
	});

	socket.on("joinChat", ({ room, userId }) => {
		const user = updateUser(room, userId);
		if (user) {
			socket.join(user.room);

			// console.log("User joined room:" + user.room);

			// Create message
			socket.on("addMessage", ({ message, chat }) => {
				// chat.members.forEach((user) => {
				// 	if (user._id === message.sender) return;
				// 	// console.log(user, message);
				socket.to(chat._id).emit("receiveMessage", message);
				// });
			});
		}
	});

	// Disconnect
	socket.on("disconnect", () => {
		removeUser(socket.id);
		console.log("user disconnected.");
	});
});

connectDB();
dotenv.config();

// Middlewares
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/chats", chatRoutes);
app.use("/api/messages", messageRoutes);

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
	console.log(
		`SERVER running in ${process.env.MODE_ENV} MODE on PORT ${PORT}`.cyan.bold
			.underline
	);
});
