import { toast } from "react-toastify";
import { axiosInstance } from "../utils/axiosInstance";
import {
	createGroupChatFailure,
	createGroupChatRequest,
	createGroupChatSuccess,
	getChatsFailure,
	getChatsRequest,
	getChatsSuccess,
	getChatSuccess,
	removeChatMember,
} from "./ChatRedux";

export const getChats = () => async (dispatch, getState) => {
	const {
		auth: { currentUser },
	} = getState();

	const config = {
		headers: {
			Authorization: `Bearer ${currentUser?.token}`,
		},
	};
	dispatch(getChatsRequest());

	try {
		const res = await axiosInstance.get("/chats/me", config);
		if (res.status === 200) {
			dispatch(getChatsSuccess(res.data));
		}
	} catch (err) {
		dispatch(getChatsFailure(err.response.data));
	}
};

export const getChatById = (id) => async (dispatch, getState) => {
	const {
		auth: { currentUser },
	} = getState();

	const config = {
		headers: {
			Authorization: `Bearer ${currentUser?.token}`,
		},
	};

	try {
		const res = await axiosInstance.get(`/chats/${id}`, config);
		if (res.status === 200) {
			dispatch(getChatSuccess(res.data));
		}
	} catch (err) {
		console.log(err);
	}
};

export const createGroupChat = (inputs) => async (dispatch, getState) => {
	const {
		auth: { currentUser },
	} = getState();

	const config = {
		headers: {
			Authorization: `Bearer ${currentUser?.token}`,
		},
	};
	dispatch(createGroupChatRequest());

	try {
		const res = await axiosInstance.post("/chats", { inputs }, config);
		if (res.status === 200) {
			dispatch(createGroupChatSuccess(res.data));
			toast.success("Chat successfully created.", { theme: "colored" });
		}
	} catch (err) {
		dispatch(createGroupChatFailure(err.response.data));
		toast.error(err.response.data, { theme: "colored" });
	}
};

export const removeRoomUser = (id, userId) => async (dispatch, getState) => {
	const {
		auth: { currentUser },
	} = getState();

	const config = {
		headers: {
			Authorization: `Bearer ${currentUser?.token}`,
		},
	};

	try {
		const res = await axiosInstance.put(
			`/chats/${id}/removeuser`,
			{ userId },
			config
		);
		if (res.status === 200) {
			dispatch(removeChatMember(userId));
			toast.success(res.data, { theme: "colored" });
		}
	} catch (err) {
		toast.error(err.response.data, { theme: "colored" });
		console.log(err);
	}
};
