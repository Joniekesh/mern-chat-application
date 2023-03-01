import mongoose from "mongoose";

const ChatSchema = new mongoose.Schema(
	{
		chatName: {
			type: String,
		},
		chatImg: {
			type: String,
			default:
				"https://images.pexels.com/photos/6935985/pexels-photo-6935985.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
		},
		members: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: "User",
			},
		],
		isGroupChat: {
			type: Boolean,
			defaul: false,
		},
		groupAdmin: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
		},
	},
	{ timestamps: true }
);

export default mongoose.model("Chat", ChatSchema);
