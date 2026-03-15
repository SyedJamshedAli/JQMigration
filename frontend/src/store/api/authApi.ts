import { baseApi } from './baseApi';
import type { LoginRequest, LoginResponse, SignupRequest } from '@/types';

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<LoginResponse, LoginRequest>({
      query: (credentials) => ({
        url: '/auth/login',
        method: 'POST',
        body: credentials,
      }),
    }),

    signup: builder.mutation<{ message: string }, SignupRequest>({
      query: (data) => ({
        url: '/auth/signup',
        method: 'POST',
        body: data,
      }),
    }),

    verifyEmail: builder.mutation<{ message: string }, { token: string }>({
      query: (data) => ({
        url: '/auth/verify-email',
        method: 'POST',
        body: data,
      }),
    }),

    resetPassword: builder.mutation<{ message: string }, { email: string }>({
      query: (data) => ({
        url: '/auth/reset-password',
        method: 'POST',
        body: data,
      }),
    }),

    verifyResetToken: builder.mutation<{ valid: boolean }, { token: string }>({
      query: (data) => ({
        url: '/auth/reset-password-verify',
        method: 'POST',
        body: data,
      }),
    }),

    changePassword: builder.mutation<{ message: string }, { token: string; password: string }>({
      query: (data) => ({
        url: '/auth/change-password',
        method: 'POST',
        body: data,
      }),
    }),

    refreshToken: builder.mutation<LoginResponse, { refreshToken: string }>({
      query: (data) => ({
        url: '/auth/refresh',
        method: 'POST',
        body: data,
      }),
    }),
  }),
});

export const {
  useLoginMutation,
  useSignupMutation,
  useVerifyEmailMutation,
  useResetPasswordMutation,
  useVerifyResetTokenMutation,
  useChangePasswordMutation,
  useRefreshTokenMutation,
} = authApi;
