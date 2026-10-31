import baseApi from "../api/baseApi";

const qualificationApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    addQualification: builder.mutation({
      query: (qualification) => ({
        url: "/qualifications/add-qualification",
        method: "POST",
        body: qualification,
      }),
    }),

    updateQualification: builder.mutation({
      query: (option) => ({
        url: `/qualifications/update-qualification/${option.id}`,
        method: "PUT",
        body: option.data,
      }),
    }),

    getAllQualifications: builder.query({
      query: () => ({
        url: "/qualifications/all-qualifications",
        method: "GET",
      }),
    }),

    getAQualification: builder.query({
      query: (id) => ({
        url: `/qualifications/${id}`,
        method: "GET",
      }),
    }),

    deleteQualification: builder.mutation({
      query: (id) => ({
        url: `/qualifications/delete-qualification/${id}`,
        method: "DELETE",
      }),
    }),
  }),
});

export const {
  useAddQualificationMutation,
  useUpdateQualificationMutation,
  useGetAllQualificationsQuery,
  useGetAQualificationQuery,
  useDeleteQualificationMutation,
} = qualificationApi;

export default qualificationApi;
