import { createSlice } from "@reduxjs/toolkit";

const ChatSlice = createSlice({
	name: "chat",
	initialState: {
		chats: [],
		chat: null,
		loading: false,
		error: null,
	},
	reducers: {
		getChatsRequest: (state) => {
			state.loading = true;
		},
		getChatsSuccess: (state, action) => {
			state.loading = false;
			state.chats = action.payload;
		},
		getChatsFailure: (state, action) => {
			state.loading = false;
			state.error = action.payload;
		},

		getChatSuccess: (state, action) => {
			state.loading = false;
			state.chat = action.payload;
		},
		removeChatMember: (state, action) => {
			state.chat.members.splice(
				state.chat.members.findIndex((_id) => _id === action.payload),
				1
			);
		},

		createGroupChatRequest: (state) => {
			state.loading = true;
		},
		createGroupChatSuccess: (state, action) => {
			state.loading = false;
			state.chats.push(action.payload);
		},
		createGroupChatFailure: (state, action) => {
			state.loading = false;
			state.error = action.payload;
		},
		clearChats: (state) => {
			state.chats = [];
			state.chat = null;
		},
	},
});

export const {
	getChatsRequest,
	getChatsSuccess,
	getChatsFailure,
	getChatSuccess,
	removeChatMember,
	createGroupChatRequest,
	createGroupChatSuccess,
	createGroupChatFailure,
	clearChats,
} = ChatSlice.actions;
export default ChatSlice.reducer;
