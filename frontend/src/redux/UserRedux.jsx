import { createSlice } from "@reduxjs/toolkit";

const UserSlice = createSlice({
	name: "user",
	initialState: {
		userInfo: null,
		users: [],
		loading: false,
		error: null,
	},
	reducers: {
		getUser: (state, action) => {
			state.userInfo = action.payload;
		},
		getUsersRequest: (state) => {
			state.loading = true;
		},
		getUsersSuccess: (state, action) => {
			state.users = action.payload;
		},
		getUsersFailure: (state, action) => {
			state.error = action.payload;
		},
		clearUser: (state) => {
			state.userInfo = null;
		},
	},
});

export const {
	getUser,
	clearUser,
	getUsersRequest,
	getUsersSuccess,
	getUsersFailure,
} = UserSlice.actions;
export default UserSlice.reducer;
