import Chat from "../models/Chat.js";

// @desc   Create Group Chat Room
// @route  POST /api/chats
// @access Private
export const createGroupChat = async (req, res) => {
	if (!req.body.members || !req.body.chatName) {
		return res.status(400).json("All fields must be filled.");
	}

	let members = JSON.parse(req.body.members);

	if (members.length < 2) {
		return res
			.status(400)
			.json("More than two users are required to create a group.");
	}

	members.push(req.user.id);

	try {
		const newChat = new Chat({
			chatName: req.body.chatName,
			isGroupChat: true,
			members,
			groupAdmin: req.user.id,
		});

		const createdChat = await newChat.save();

		res.status(200).json(createdChat);
	} catch (err) {
		console.log(err);
		res.status(500).json("Server Error");
	}
};

// @desc   Create Private Chat Room
// @route  POST /api/chats/:senderId/:receiverId
// @access Private
export const createPrivateChat = async (req, res) => {
	const newPrivateChat = new Chat({
		chatName: "sender",
		members: [req.body.senderId, req.body.receiverId],
		isGroupChat: false,
	});

	try {
		const chats = await Chat.find({
			members: {
				$all: [req.params.senderId, req.params.receiverId],
			},
			isGroupChat: false,
		});

		if (chats.length < 1) {
			const savedChat = await newPrivateChat.save();
			res.status(200).json(savedChat);
		} else {
			const chat = await Chat.findById({ _id: chats[0]._id });
			res.status(200).json(chat);
		}
	} catch (err) {
		console.log(err);
		res.status(500).json("Server Error");
	}
};

// @desc   Get Loggedin User Chat Rooms
// @route  GET /api/chats/me
// @access Private
export const getChats = async (req, res) => {
	try {
		const chats = await Chat.find({
			members: { $in: [{ _id: req.user.id }] },
		})
			.populate("groupAdmin", ["_id", "firstName", "lastName", "profilePic"])
			.populate("members", [
				"_id",
				"firstName",
				"lastName",
				"profilePic",
				"bio",
				"email",
			]);

		if (chats.length === 0) {
			return res.status(404).json("Chats not found");
		}

		res.status(200).json(chats);
	} catch (err) {
		res.status(500).json(err);
	}
};

// @desc   Get Chat By ID
// @route  GET /api/chats/:id
// @access Private
export const getChatById = async (req, res) => {
	try {
		const chat = await Chat.findById(req.params.id)
			.populate("groupAdmin", ["_id", "firstName", "lastName", "profilePic"])
			.populate("members", [
				"firstName",
				"lastName",
				"profilePic",
				"bio",
				"email",
			]);

		if (!chat) return res.status(404).json("Chat not found");

		res.status(200).json(chat);
	} catch (err) {
		res.status(500).json(err);
	}
};

// @desc   Join Chat Room
// @route  PUT /api/chats/:id
// @access Private
export const joinChat = async (req, res) => {
	try {
		const chat = await Chat.findById({
			_id: req.params.id,
		}).populate("members", ["firstName", "lastName", "profilePic", "bio"]);

		if (!chat) return res.status(404).json("Chat not found");

		const chatMember = chat.members.find(
			(member) => member._id.toString() === req.body.userId
		);

		if (!chatMember) {
			const updatedChat = await Chat.findByIdAndUpdate(
				req.params.id,
				{ $push: { members: req.body.userId } },
				{ new: true }
			);
			return res.status(200).json(updatedChat);
		} else {
			return res.status(200).json(chat);
		}
	} catch (err) {
		res.status(500).json(err);
	}
};

// @desc   Leave Chat Room
// @route  PUT /api/chats/:id/leave
// @access Private
export const leaveChat = async (req, res) => {
	try {
		const chat = await Chat.findById(req.params.id).populate("members", [
			"firstName",
			"lastName",
			"profilePic",
			"bio",
		]);

		if (!chat) return res.status(404).json("Chat not found");

		const chatMember = chat.members.find(
			(member) => member._id.toString() === req.body.userId
		);

		if (chatMember) {
			await Chat.findByIdAndUpdate(
				req.params.id,
				{ $pull: { members: req.body.userId } },
				{ new: true }
			);
			return res.status(200).json("You have left the chat room.");
		}
	} catch (err) {
		res.status(500).json(err);
	}
};

// @desc  Get All Chat Room Members
// @route  GET /api/chats/:id/members
// @access Private
export const getChatMembers = async (req, res) => {
	try {
		const chat = await Chat.findById(req.params.id).populate("members", [
			"firstName",
			"lastName",
			"profilePic",
			"bio",
		]);

		if (!chat) return res.status(404).json("Chat not found");

		const chatMember = chat.members.find(
			(member) => member._id.toString() === req.user.id
		);

		if (!chatMember) {
			res.status(401).json("You are not authorized to access this chat room");
		} else {
			res.status(200).json(chat.members);
		}
	} catch (err) {
		res.status(500).json(err);
	}
};

// @desc  Delete Chat Room (Room Admin Only)
// @route  DELETE /api/chats/:id
// @access Private
export const deleteChat = async (req, res) => {
	try {
		const chat = await Chat.findById(req.params.id).populate("groupAdmin", [
			"firstName",
			"lastName",
			"profilePic",
		]);
		if (chat.groupAdmin._id.toString() === req.user.id) {
			await Chat.findByIdAndDelete(req.params.id);
			// await RoomMessage.deleteMany({ roomId: room._id });
			res.status(200).json("Chat Room deleted");
		} else {
			res.status(401).json("You are not authorized to delete this chat room");
		}
	} catch (err) {
		res.status(500).json(err);
	}
};

// @desc  Update Chat Room (Room Admin Only)
// @route  PUT /api/chats/:id/update
// @access Private
export const updateChatRoom = async (req, res) => {
	try {
		const chat = await Chat.findById(req.params.id).populate("groupAdmin", [
			"firstName",
			"lastName",
			"profilePic",
		]);

		if (chat.groupAdmin._id.toString() === req.user.id) {
			const updatedChat = await Chat.findByIdAndUpdate(
				req.params.id,
				{ $set: req.body },
				{ new: true }
			);

			res.status(200).json(updatedChat);
		} else {
			res.status(401).json("You are not allowed to update this chat room");
		}
	} catch (err) {
		res.status(500).json(err);
	}
};

// @desc  Remove User From Chat Room (Room Admin Only)
// @route  PUT /api/chats/:id/removeuser
// @access Private
export const removeUser = async (req, res) => {
	try {
		const chat = await Chat.findById(req.params.id)
			.populate("groupAdmin", ["firstName", "lastName", "profilePic"])
			.populate("members", ["firstName", "lastName", "profilePic", "bio"]);

		if (!chat) return res.status(404).json("Chat not found");

		if (chat.groupAdmin._id.toString() === req.user.id) {
			chat.members = chat.members.filter(
				(member) => member._id.toString() !== req.body.userId
			);

			await chat.save();
			res.status(200).json("User Removed!");
		} else {
			res.status(401).json("You are not allowed to update this chat room");
		}
	} catch (err) {
		res.status(500).json(err);
	}
};
