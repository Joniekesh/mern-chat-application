import { axiosInstance } from "../utils/axiosInstance";
import { toast } from "react-toastify";
import {
	createMessageFailure,
	createMessageRequest,
	createMessageSuccess,
	getMessagesFailure,
	getMessagesRequest,
	getMessagesSuccess,
	removeMessage,
} from "./MessageRedux";

export const getMessages = (chatId) => async (dispatch, getState) => {
	const {
		auth: { currentUser },
	} = getState();

	const config = {
		headers: {
			Authorization: `Bearer ${currentUser?.token}`,
		},
	};

	dispatch(getMessagesRequest());
	try {
		const res = await axiosInstance.get(`/messages/${chatId}`, config);
		if (res.status === 200) {
			dispatch(getMessagesSuccess(res.data));
		}
	} catch (err) {
		dispatch(getMessagesFailure(err.response.data));
		toast.error(err.response.data, { theme: "colored" });
	}
};

export const createMessage = (inputs) => async (dispatch, getState) => {
	const {
		auth: { currentUser },
	} = getState();

	const config = {
		headers: {
			Authorization: `Bearer ${currentUser?.token}`,
		},
	};

	dispatch(createMessageRequest());
	try {
		const res = await axiosInstance.post("/messages", inputs, config);
		if (res.status === 200) {
			dispatch(createMessageSuccess(res.data));
		}
	} catch (err) {
		dispatch(createMessageFailure(err.response.data));
	}
};

export const deleteMessage = (id, chatId) => async (dispatch, getState) => {
	const {
		auth: { currentUser },
	} = getState();

	const config = {
		headers: {
			Authorization: `Bearer ${currentUser?.token}`,
		},
	};

	try {
		const res = await axiosInstance.delete(`/messages/${id}/${chatId}`, config);
		if (res.status === 200) {
			dispatch(removeMessage(res.data));
		}
	} catch (err) {
		console.log(err);
	}
};
