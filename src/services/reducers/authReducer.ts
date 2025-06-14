import { createSlice } from '@reduxjs/toolkit';
import {
	registerUser,
	loginUser,
	logoutUser,
	fetchUser,
	updateUser,
	setAccessToken,
} from '../actions/authActions';

interface AuthState {
	user: { email: string; name: string } | null;
	accessToken: string | null;
	loading: boolean;
	error: string | null;
	isAuthChecked: boolean;
}

const initialState: AuthState = {
	user: null,
	accessToken: null,
	loading: false,
	error: null,
	isAuthChecked: false,
};

const authSlice = createSlice({
	name: 'auth',
	initialState,
	reducers: {
		setAccessToken: (state, action) => {
			state.accessToken = action.payload;
		},
	},
	extraReducers: (builder) => {
		builder
			.addCase(registerUser.fulfilled, (state, action) => {
				state.user = action.payload.user;
				state.accessToken = action.payload.accessToken;
				state.isAuthChecked = true;
			})
			.addCase(loginUser.fulfilled, (state, action) => {
				state.user = action.payload.user;
				state.accessToken = action.payload.accessToken;
				state.isAuthChecked = true;
			})
			.addCase(logoutUser.fulfilled, (state) => {
				state.user = null;
				state.accessToken = null;
				state.isAuthChecked = true;
			})
			.addCase(fetchUser.pending, (state) => {
				console.log('authReducer: fetchUser.pending', { oldState: { ...state } });
				state.loading = true;
				state.error = null;
			})
			.addCase(fetchUser.fulfilled, (state, action) => {
				console.log('authReducer: fetchUser.fulfilled', { oldState: { ...state }, payload: action.payload });
				state.loading = false;
				state.user = action.payload;
				const accessToken = localStorage.getItem('accessToken');
				if (accessToken) {
					state.accessToken = accessToken.startsWith('Bearer ') ? accessToken.split(' ')[1] : accessToken;
				}
				state.isAuthChecked = true;
				console.log('authReducer: fetchUser.fulfilled - new state:', { ...state });
			})
			.addCase(fetchUser.rejected, (state, action) => {
				console.log('authReducer: fetchUser.rejected', { oldState: { ...state }, error: action.error.message });
				state.loading = false;
				state.error = action.error.message || 'Неизвестная ошибка';
				state.user = null; 
				state.accessToken = null;
				state.isAuthChecked = true;
				console.log('authReducer: fetchUser.rejected - new state:', { ...state });
			})
			.addCase(updateUser.fulfilled, (state, action) => {
				state.user = action.payload;
			});
	},
});

export default authSlice.reducer;
