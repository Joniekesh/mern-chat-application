import { createSlice } from "@reduxjs/toolkit";

const AuthSlice = createSlice({
	name: "auth",
	initialState: {
		currentUser: null,
		loading: false,
		error: null,
	},
	reducers: {
		signInRequest: (state) => {
			state.loading = true;
		},
		signInSuccess: (state, action) => {
			state.loading = false;
			state.currentUser = action.payload;
		},
		signInFailure: (state, action) => {
			state.loading = false;
			state.error = action.payload;
		},
		logout: (state) => {
			state.loading = false;
			state.error = null;
			state.currentUser = null;
		},
	},
});

export const { signInRequest, signInSuccess, signInFailure, logout } =
	AuthSlice.actions;
export default AuthSlice.reducer;
