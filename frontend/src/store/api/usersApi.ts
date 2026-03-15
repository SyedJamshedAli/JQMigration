import { baseApi } from './baseApi';
import type { User, PaginatedResponse, QueryParams } from '@/types';

export const usersApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getUsers: builder.query<PaginatedResponse<User>, QueryParams>({
      query: (params) => ({
        url: '/users',
        params,
      }),
      providesTags: ['Users'],
    }),

    getUser: builder.query<User, string>({
      query: (id) => `/users/${id}`,
      providesTags: (_result, _error, id) => [{ type: 'Users', id }],
    }),

    getProfile: builder.query<User, void>({
      query: () => '/users/me',
      providesTags: ['Profile'],
    }),

    createUser: builder.mutation<User, Partial<User> & { password: string }>({
      query: (data) => ({
        url: '/users',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Users'],
    }),

    updateUser: builder.mutation<User, { id: string; data: Partial<User> }>({
      query: ({ id, data }) => ({
        url: `/users/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'Users', id },
        'Users',
      ],
    }),

    deleteUser: builder.mutation<{ message: string }, string>({
      query: (id) => ({
        url: `/users/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Users'],
    }),

    restoreUser: builder.mutation<{ message: string }, string>({
      query: (id) => ({
        url: `/users/${id}/restore`,
        method: 'PATCH',
      }),
      invalidatesTags: ['Users'],
    }),

    getUsersSelect: builder.query<Array<{ id: string; name: string; email: string; avatar: string | null }>, string | void>({
      query: (search) => ({
        url: '/users/select',
        params: search ? { search } : undefined,
      }),
    }),
  }),
});

export const {
  useGetUsersQuery,
  useGetUserQuery,
  useGetProfileQuery,
  useCreateUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
  useRestoreUserMutation,
  useGetUsersSelectQuery,
} = usersApi;
