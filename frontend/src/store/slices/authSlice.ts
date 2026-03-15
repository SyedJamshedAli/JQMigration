import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { authApi } from '../api/authApi';

interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  user: {
    id: string;
    email: string;
    name: string;
    avatar: string | null;
    status: string;
    roleId: string;
    roleName: string;
  } | null;
  isAuthenticated: boolean;
}

const initialState: AuthState = {
  accessToken: null,
  refreshToken: null,
  user: null,
  isAuthenticated: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action: PayloadAction<{ accessToken: string; refreshToken: string; user: any }>) => {
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
      state.user = action.payload.user;
      state.isAuthenticated = true;
    },
    logout: (state) => {
      state.accessToken = null;
      state.refreshToken = null;
      state.user = null;
      state.isAuthenticated = false;
      if (typeof window !== 'undefined') {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
      }
    },
    loadTokens: (state) => {
      if (typeof window !== 'undefined') {
        const accessToken = localStorage.getItem('accessToken');
        const refreshToken = localStorage.getItem('refreshToken');
        const user = localStorage.getItem('user');
        if (accessToken && refreshToken && user) {
          state.accessToken = accessToken;
          state.refreshToken = refreshToken;
          state.user = JSON.parse(user);
          state.isAuthenticated = true;
        }
      }
    },
  },
  extraReducers: (builder) => {
    builder.addMatcher(
      authApi.endpoints.login.matchFulfilled,
      (state, { payload }) => {
        state.accessToken = payload.accessToken;
        state.refreshToken = payload.refreshToken;
        state.user = payload.user;
        state.isAuthenticated = true;
        if (typeof window !== 'undefined') {
          localStorage.setItem('accessToken', payload.accessToken);
          localStorage.setItem('refreshToken', payload.refreshToken);
          localStorage.setItem('user', JSON.stringify(payload.user));
        }
      },
    );
    builder.addMatcher(
      authApi.endpoints.refreshToken.matchFulfilled,
      (state, { payload }) => {
        state.accessToken = payload.accessToken;
        state.refreshToken = payload.refreshToken;
        state.user = payload.user;
        if (typeof window !== 'undefined') {
          localStorage.setItem('accessToken', payload.accessToken);
          localStorage.setItem('refreshToken', payload.refreshToken);
          localStorage.setItem('user', JSON.stringify(payload.user));
        }
      },
    );
  },
});

export const { setCredentials, logout, loadTokens } = authSlice.actions;
export default authSlice.reducer;
