import baseApi from "../api/baseApi";

const messageApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getMessages: builder.query({
      query: (params = {}) => ({ url: "/messages", method: "GET", params }),
      providesTags: ["Messages"],
    }),
    updateMessage: builder.mutation({
      query: ({ id, ...body }) => ({ url: `/messages/${id}`, method: "PATCH", body }),
      invalidatesTags: ["Messages"],
    }),
    deleteMessage: builder.mutation({
      query: (id) => ({ url: `/messages/${id}`, method: "DELETE" }),
      invalidatesTags: ["Messages"],
    }),
  }),
});

export const { useGetMessagesQuery, useUpdateMessageMutation, useDeleteMessageMutation } = messageApi;
export default messageApi;
