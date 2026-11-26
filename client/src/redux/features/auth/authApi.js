import baseApi from "../../api/baseApi";

const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (credentials) => ({
        url: "/auth/login",
        method: "POST",
        body: credentials,
      }),
    }),
    verifyLogin: builder.mutation({
      query: (payload) => ({
        url: "/auth/login/verify",
        method: "POST",
        body: payload,
      }),
    }),
    verifyTwoFactor: builder.mutation({
      query: (payload) => ({
        url: "/auth/login/2fa",
        method: "POST",
        body: payload,
      }),
    }),
    recoverLogin: builder.mutation({
      query: (payload) => ({
        url: "/auth/login/recover",
        method: "POST",
        body: payload,
      }),
    }),
    setupTwoFactor: builder.mutation({
      query: (payload) => ({
        url: "/auth/2fa/setup",
        method: "POST",
        body: payload,
      }),
    }),
    enableTwoFactor: builder.mutation({
      query: (payload) => ({
        url: "/auth/2fa/enable",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["Auth"],
    }),
    disableTwoFactor: builder.mutation({
      query: (payload) => ({
        url: "/auth/2fa/disable",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["Auth"],
    }),
    regenerateBackupCodes: builder.mutation({
      query: (payload) => ({
        url: "/auth/2fa/backup-codes",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["Auth"],
    }),
    removeSecurityQuestion: builder.mutation({
      query: (payload) => ({
        url: "/auth/security-question",
        method: "DELETE",
        body: payload,
      }),
      invalidatesTags: ["Auth"],
    }),
    getMe: builder.query({
      query: () => ({ url: "/auth/me", method: "GET" }),
      providesTags: ["Auth"],
    }),
    logout: builder.mutation({
      query: () => ({ url: "/auth/logout", method: "POST" }),
    }),
    setSecurityQuestion: builder.mutation({
      query: (payload) => ({
        url: "/auth/security-question",
        method: "PUT",
        body: payload,
      }),
      invalidatesTags: ["Auth"],
    }),
    changePassword: builder.mutation({
      query: (passwordData) => ({
        url: "/auth/change-password",
        method: "POST",
        body: passwordData,
      }),
    }),
    refreshToken: builder.mutation({
      query: () => ({
        url: "/auth/refresh-token",
        method: "POST",
      }),
    }),
    forgetPassword: builder.mutation({
      query: (email) => ({
        url: "/auth/forget-password",
        method: "POST",
        body: email,
      }),
    }),
    resetPassword: builder.mutation({
      query: (passwordData) => ({
        url: "/auth/reset-password",
        method: "POST",
        body: passwordData,
      }),
    }),
  }),
});

export const {
  useLoginMutation,
  useVerifyLoginMutation,
  useVerifyTwoFactorMutation,
  useRecoverLoginMutation,
  useSetupTwoFactorMutation,
  useEnableTwoFactorMutation,
  useDisableTwoFactorMutation,
  useRegenerateBackupCodesMutation,
  useRemoveSecurityQuestionMutation,
  useGetMeQuery,
  useLogoutMutation,
  useSetSecurityQuestionMutation,
  useChangePasswordMutation,
  useRefreshTokenMutation,
  useForgetPasswordMutation,
  useResetPasswordMutation,
} = authApi;
export default authApi;
