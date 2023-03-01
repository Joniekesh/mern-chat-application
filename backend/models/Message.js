import mongoose from "mongoose";

const MessageSchema = new mongoose.Schema(
	{
		sender: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
		},
		chat: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Chat",
			required: true,
		},

		text: {
			type: String,
		},
		img: {
			type: String,
			default: "",
		},
	},
	{ timestamps: true }
);

export default mongoose.model("Message", MessageSchema);
