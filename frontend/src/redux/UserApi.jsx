import { axiosInstance } from "../utils/axiosInstance";
import {
	getUser,
	getUsersFailure,
	getUsersRequest,
	getUsersSuccess,
} from "./UserRedux";

export const loadUser = () => async (dispatch, getState) => {
	const {
		auth: { currentUser },
	} = getState();

	const config = {
		headers: {
			Authorization: `Bearer ${currentUser?.token}`,
		},
	};

	try {
		const res = await axiosInstance.get("/auth/me", config);
		if (res.status === 200) {
			dispatch(getUser(res.data));
		}
	} catch (err) {
		console.log(err.response.data);
	}
};

export const getUsers = () => async (dispatch, getState) => {
	const {
		auth: { currentUser },
	} = getState();

	const config = {
		headers: {
			Authorization: `Bearer ${currentUser?.token}`,
		},
	};
	dispatch(getUsersRequest());

	try {
		const res = await axiosInstance.get("/users", config);
		if (res.status === 200) {
			dispatch(getUsersSuccess(res.data));
		}
	} catch (err) {
		dispatch(getUsersFailure(err.response.data));
	}
};
