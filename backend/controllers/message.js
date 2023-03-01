import Chat from "../models/Chat.js";
import Message from "../models/Message.js";

// @desc  Create Message
// @route  POST /api/messages
// @access Private
export const createMessage = async (req, res) => {
	const newMessage = new Message({
		sender: req.user.id,
		chat: req.body.chat,
		img: req.body.img,
		text: req.body.text,
	});
	try {
		const chat = await Chat.findById(req.body.chat).populate("members", [
			"firstName",
			"lastName",
			"profilePic",
		]);

		if (!chat) return res.status(404).json("Chat room not found");

		const chatMember = chat.members.find(
			(member) => member._id.toString() === req.user.id
		);

		if (!chatMember) {
			return res
				.status(401)
				.json("Only chat room members can send messages to this chat room");
		} else {
			const createdMessage = await newMessage.save();

			// const messages = await Message.find({ chat: req.params.chatId }).populate(
			// 	"sender",
			// 	["firstName", "lastName", "profilePic"]
			// );

			res.status(200).json(createdMessage);
		}
	} catch (err) {
		res.status(500).json(err);
	}
};

// @desc Get Messages By Chat Room ID
// @route  GET /api/messages/:chatId
// @access Private
export const getMessages = async (req, res) => {
	try {
		const chat = await Chat.findById(req.params.chatId).populate("members", [
			"firstName",
			"lastName",
			"profilePic",
		]);

		if (!chat) return res.status(404).json("Chat room not found");

		const chatMember = chat.members.find(
			(member) => member._id.toString() === req.user.id
		);

		if (!chatMember) {
			return res
				.status(401)
				.json("Only chat room members can access this route.");
		} else {
			const messages = await Message.find({ chat: req.params.chatId }).populate(
				"sender",
				["firstName", "lastName", "profilePic"]
			);

			if (!messages) return res.status(404).json("Messages not found");

			res.status(200).json(messages);
		}
	} catch (err) {
		res.status(500).json(err);
	}
};

// @desc  Delete Message
// @route  DELETE /api/messages/:id/:chatId
// @access Private
export const deleteMessage = async (req, res) => {
	try {
		const message = await Message.findById(req.params.id).populate("sender", [
			"firstName",
			"lastName",
			"profilePic",
		]);

		if (message.sender._id.toString() !== req.user.id) {
			return res
				.status(401)
				.json("You are not authorized to delete this message");
		} else {
			await Message.findByIdAndDelete(req.params.id);

			const messages = await Message.find({ chat: req.params.chatId }).populate(
				"sender",
				["firstName", "lastName", "profilePic"]
			);
			res.status(200).json(messages);
		}
	} catch (err) {
		res.status(500).json(err);
	}
};
