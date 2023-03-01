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
		getChatsFailure: (state) => {
			state.loading = false;
			state.error = action.payload;
		},

		getChatSuccess: (state, action) => {
			state.loading = false;
			state.chat = action.payload;
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
	},
});

export const {
	getChatsRequest,
	getChatsSuccess,
	getChatsFailure,
	getChatSuccess,
	createGroupChatRequest,
	createGroupChatSuccess,
	createGroupChatFailure,
} = ChatSlice.actions;
export default ChatSlice.reducer;
