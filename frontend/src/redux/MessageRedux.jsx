import { createSlice } from "@reduxjs/toolkit";

const MessageSlice = createSlice({
	name: "message",
	initialState: {
		messages: [],
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
			state.messages.push(action.payload, ...state.messages);
		},
		createMessageFailure: (state, action) => {
			state.loading = false;
			state.error = action.payload;
		},
		removeMessage: (state, action) => {
			state.messages = action.payload;
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
} = MessageSlice.actions;
export default MessageSlice.reducer;
