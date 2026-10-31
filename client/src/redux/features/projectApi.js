import baseApi from "../api/baseApi";

const projectApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    addProject: builder.mutation({
      query: (projectData) => ({
        url: "/project/add-project",
        method: "POST",
        body: projectData,
      }),
      invalidatesTags: ["Project"],
    }),
    updateProject: builder.mutation({
      query: (option) => ({
        url: `/project/update-project/${option.id}`,
        method: "PUT",
        body: option.data,
      }),
      invalidatesTags: ["Project"],
    }),
    getAllProjects: builder.query({
      query: () => ({
        url: "/project/all-projects",
        method: "GET",
      }),
      providesTags: ["Project"],
    }),
    getAProject: builder.query({
      query: (id) => ({
        url: `/project/${id}`,
        method: "GET",
      }),
      providesTags: ["Project"],
    }),
    deleteAProject: builder.mutation({
      query: (id) => ({
        url: `/project/delete-project/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Project"],
    }),
  }),
});

export const {
  useAddProjectMutation,
  useUpdateProjectMutation,
  useGetAllProjectsQuery,
  useGetAProjectQuery,
  useDeleteAProjectMutation,
} = projectApi;

export default projectApi;
