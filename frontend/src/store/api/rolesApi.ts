import { baseApi } from './baseApi';
import type { UserRole, PaginatedResponse } from '@/types';

export const rolesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getRoles: builder.query<PaginatedResponse<UserRole>, { page?: number; limit?: number }>({
      query: (params) => ({ url: '/roles', params }),
      providesTags: ['Roles'],
    }),

    getRole: builder.query<UserRole, string>({
      query: (id) => `/roles/${id}`,
      providesTags: (_result, _error, id) => [{ type: 'Roles', id }],
    }),

    createRole: builder.mutation<UserRole, { name: string; slug: string; description?: string; permissionIds?: string[] }>({
      query: (data) => ({ url: '/roles', method: 'POST', body: data }),
      invalidatesTags: ['Roles'],
    }),

    updateRole: builder.mutation<UserRole, { id: string; data: { name?: string; description?: string; permissionIds?: string[] } }>({
      query: ({ id, data }) => ({ url: `/roles/${id}`, method: 'PUT', body: data }),
      invalidatesTags: (_result, _error, { id }) => [{ type: 'Roles', id }, 'Roles'],
    }),

    deleteRole: builder.mutation<{ message: string }, string>({
      query: (id) => ({ url: `/roles/${id}`, method: 'DELETE' }),
      invalidatesTags: ['Roles'],
    }),

    setDefaultRole: builder.mutation<{ message: string }, string>({
      query: (id) => ({ url: `/roles/${id}/default`, method: 'PATCH' }),
      invalidatesTags: ['Roles'],
    }),

    getRolesSelect: builder.query<Array<{ id: string; name: string; slug: string }>, void>({
      query: () => '/roles/select',
    }),
  }),
});

export const {
  useGetRolesQuery,
  useGetRoleQuery,
  useCreateRoleMutation,
  useUpdateRoleMutation,
  useDeleteRoleMutation,
  useSetDefaultRoleMutation,
  useGetRolesSelectQuery,
} = rolesApi;
