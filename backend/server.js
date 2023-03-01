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
	removeUser,
} from "./utils/socketHelperFunction.js";

import { Server } from "socket.io";
import http from "http";

import { connectDB } from "./config/db.js";

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
	pingTimeout: 60000,
	cors: { origin: "https://joniechat.netlify.app/" },
});

io.on("connection", (socket) => {
	socket.on("addUser", (user) => {
		const onlineUser = addUser(socket.id, user);

		// Online users
		const onlineUsers = getOnlineUsers();
		socket.emit("onlineUsers", onlineUsers);
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

const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, "../frontend/public/assets");
	},
	filename: function (req, file, cb) {
		cb(null, Date.now() + file.originalname);
	},
});

const upload = multer({ storage: storage });

app.post("/api/upload", upload.single("file"), (req, res) => {
	const file = req.file;
	res.status(200).json(file?.filename);
});

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
