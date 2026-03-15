import { baseApi } from './baseApi';
import type { UserPermission, PaginatedResponse } from '@/types';

export const permissionsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getPermissions: builder.query<PaginatedResponse<UserPermission>, { page?: number; limit?: number; roleId?: string }>({
      query: (params) => ({ url: '/permissions', params }),
      providesTags: ['Permissions'],
    }),

    getPermission: builder.query<UserPermission, string>({
      query: (id) => `/permissions/${id}`,
      providesTags: (_result, _error, id) => [{ type: 'Permissions', id }],
    }),

    createPermission: builder.mutation<UserPermission, { name: string; slug: string; description?: string }>({
      query: (data) => ({ url: '/permissions', method: 'POST', body: data }),
      invalidatesTags: ['Permissions'],
    }),

    updatePermission: builder.mutation<UserPermission, { id: string; data: { name?: string; description?: string } }>({
      query: ({ id, data }) => ({ url: `/permissions/${id}`, method: 'PUT', body: data }),
      invalidatesTags: (_result, _error, { id }) => [{ type: 'Permissions', id }, 'Permissions'],
    }),

    deletePermission: builder.mutation<{ message: string }, string>({
      query: (id) => ({ url: `/permissions/${id}`, method: 'DELETE' }),
      invalidatesTags: ['Permissions'],
    }),

    bulkDeletePermissions: builder.mutation<{ message: string }, string[]>({
      query: (ids) => ({ url: '/permissions/bulk/delete', method: 'DELETE', body: { ids } }),
      invalidatesTags: ['Permissions'],
    }),

    getPermissionsSelect: builder.query<Array<{ id: string; name: string; slug: string }>, void>({
      query: () => '/permissions/select',
    }),
  }),
});

export const {
  useGetPermissionsQuery,
  useGetPermissionQuery,
  useCreatePermissionMutation,
  useUpdatePermissionMutation,
  useDeletePermissionMutation,
  useBulkDeletePermissionsMutation,
  useGetPermissionsSelectQuery,
} = permissionsApi;
