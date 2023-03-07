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
		updateUserRequest: (state) => {
			state.loading = true;
		},
		updateUserSuccess: (state, action) => {
			state.userInfo = action.payload;
		},
		updateUserFailure: (state, action) => {
			state.error = action.payload;
		},
		clearUser: (state) => {
			state.userInfo = null;
			state.users = [];
		},
	},
});

export const {
	getUser,
	getUsersRequest,
	getUsersSuccess,
	getUsersFailure,
	updateUserRequest,
	updateUserSuccess,
	updateUserFailure,
	clearUser,
} = UserSlice.actions;
export default UserSlice.reducer;
