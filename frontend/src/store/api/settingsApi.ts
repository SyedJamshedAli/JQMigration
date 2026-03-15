import { baseApi } from './baseApi';
import type { SystemSetting } from '@/types';

export const settingsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getSettings: builder.query<{ settings: SystemSetting; roles: Array<{ id: string; name: string }> }, void>({
      query: () => '/settings',
      providesTags: ['Settings'],
    }),

    updateGeneralSettings: builder.mutation<SystemSetting, Partial<SystemSetting>>({
      query: (data) => ({ url: '/settings/general', method: 'POST', body: data }),
      invalidatesTags: ['Settings'],
    }),

    updateNotificationSettings: builder.mutation<SystemSetting, Record<string, any>>({
      query: (data) => ({ url: '/settings/notifications', method: 'POST', body: data }),
      invalidatesTags: ['Settings'],
    }),

    updateSocialSettings: builder.mutation<SystemSetting, Record<string, any>>({
      query: (data) => ({ url: '/settings/social', method: 'POST', body: data }),
      invalidatesTags: ['Settings'],
    }),
  }),
});

export const {
  useGetSettingsQuery,
  useUpdateGeneralSettingsMutation,
  useUpdateNotificationSettingsMutation,
  useUpdateSocialSettingsMutation,
} = settingsApi;
