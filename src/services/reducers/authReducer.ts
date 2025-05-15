import { createSlice } from '@reduxjs/toolkit';
import {
	registerUser,
	loginUser,
	logoutUser,
	fetchUser,
	updateUser,
} from '../actions/authActions';

interface AuthState {
	user: { email: string; name: string } | null;
	accessToken: string | null;
	loading: boolean;
	error: string | null;
}

const initialState: AuthState = {
	user: null,
	accessToken: null,
	loading: false,
	error: null,
};

const authSlice = createSlice({
	name: 'auth',
	initialState,
	reducers: {},
	extraReducers: (builder) => {
		builder
			.addCase(registerUser.fulfilled, (state, action) => {
				state.user = action.payload.user;
				state.accessToken = action.payload.accessToken;
			})
			.addCase(loginUser.fulfilled, (state, action) => {
				state.user = action.payload.user;
				state.accessToken = action.payload.accessToken;
			})
			.addCase(logoutUser.fulfilled, (state) => {
				state.user = null;
				state.accessToken = null;
			})
			.addCase(fetchUser.fulfilled, (state, action) => {
				state.user = action.payload;
			})
			.addCase(updateUser.fulfilled, (state, action) => {
				state.user = action.payload;
			});
	},
});

export default authSlice.reducer;
