import { createSlice } from "@reduxjs/toolkit";

const MessageSlice = createSlice({
	name: "message",
	initialState: {
		messages: [],
		message: null,
		loading: false,
		error: null,
	},
	reducers: {
		getMessagesRequest: (state) => {
			state.loading = true;
		},
		getMessagesSuccess: (state, action) => {
			state.loading = false;
			state.messages = action.payload;
		},
		getMessagesFailure: (state, action) => {
			state.loading = false;
			state.error = action.payload;
		},
		createMessageRequest: (state) => {
			state.loading = true;
		},
		createMessageSuccess: (state, action) => {
			state.loading = false;
			state.message = action.payload;
		},
		createMessageFailure: (state, action) => {
			state.loading = false;
			state.error = action.payload;
		},
		removeMessage: (state, action) => {
			state.messages.splice(
				state.messages.findIndex((_id) => _id === action.payload),
				1
			);
		},
		clearMessages: (state) => {
			state.messages = [];
		},
	},
});

export const {
	getMessagesRequest,
	getMessagesSuccess,
	getMessagesFailure,
	createMessageRequest,
	createMessageSuccess,
	createMessageFailure,
	removeMessage,
	clearMessages,
} = MessageSlice.actions;
export default MessageSlice.reducer;
