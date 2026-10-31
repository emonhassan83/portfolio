import baseApi from "../api/baseApi";

const userApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    registerUser: builder.mutation({
      query: (userData) => ({
        url: "/user/register",
        method: "POST",
        body: userData,
      }),
    }),
    changeUserRole: builder.mutation({
      query: (roleData) => ({
        url: "/user/change-role",
        method: "PATCH",
        body: roleData,
      }),
    }),
    changeUserStatus: builder.mutation({
      query: (statusData) => ({
        url: "/user/change-status",
        method: "PATCH",
        body: statusData,
      }),
    }),
    updateUserInfo: builder.mutation({
      query: ({ id, updateData }) => ({
        url: `/user/update-user/${id}`,
        method: "PUT",
        body: updateData,
      }),
    }),
    softDeleteUser: builder.mutation({
      query: (deleteData) => ({
        url: "/user/soft-delete",
        method: "PATCH",
        body: deleteData,
      }),
    }),
    deleteUser: builder.mutation({
      query: (id) => ({
        url: `/user/delete-user/${id}`,
        method: "DELETE",
      }),
    }),
    getAllUsers: builder.query({
      query: () => ({
        url: "/user/users",
        method: "GET",
      }),
    }),
    getMyProfile: builder.query({
      query: () => ({
        url: "/user/my-profile",
        method: "GET",
      }),
    }),
  }),
});

export const {
  useRegisterUserMutation,
  useChangeUserRoleMutation,
  useChangeUserStatusMutation,
  useUpdateUserInfoMutation,
  useSoftDeleteUserMutation,
  useDeleteUserMutation,
  useGetAllUsersQuery,
  useGetMyProfileQuery,
} = userApi;

export default userApi;
