import { axiosInstance } from "../utils/axiosInstance";
import { signInFailure, signInRequest, signInSuccess } from "./AuthRedux";
import { toast } from "react-toastify";
import { getUsers, loadUser } from "./UserApi";

export const signIn =
	({ email, password }) =>
	async (dispatch) => {
		dispatch(signInRequest());
		try {
			const res = await axiosInstance.post("/auth/login", { email, password });
			dispatch(loadUser());
			dispatch(getUsers());
			if (res.status === 200) {
				dispatch(signInSuccess(res.data));
				toast.success("Login Successful.", { theme: "colored" });
			}
		} catch (err) {
			dispatch(signInFailure(err.response.data));
			toast.error(err.response.data, { theme: "colored" });
		}
	};
