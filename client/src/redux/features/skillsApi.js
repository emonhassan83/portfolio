import baseApi from "../api/baseApi";

const skillApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    addSkill: builder.mutation({
      query: (skill) => ({
        url: "/skills/add-skill",
        method: "POST",
        body: skill,
      }),
    }),

    updateSkill: builder.mutation({
      query: (option) => ({
        url: `/skills/update-skill/${option.id}`,
        method: "PUT",
        body: option.data,
      }),
    }),

    getAllSkills: builder.query({
      query: (args) => {
        const params = new URLSearchParams();

        if (args) {
          args?.forEach((item) => {
            params.append(item.name, item.value);
          });
        }

        return {
          url: "/skills/all-skills",
          method: "GET",
          params: params,
        };
      },
      transformResponse: (response) => {
        return {
          data: response.data,
          meta: response.meta,
        };
      },
    }),

    // getAllSkills: builder.query({
    //   query: () => ({
    //     url: "/skills/all-skills",
    //     method: "GET",
    //   }),
    // }),

    getASkill: builder.query({
      query: (id) => ({
        url: `/skills/${id}`,
        method: "GET",
      }),
    }),

    deleteSkill: builder.mutation({
      query: (id) => ({
        url: `/skills/delete-skill/${id}`,
        method: "DELETE",
      }),
    }),
  }),
});

export const {
  useAddSkillMutation,
  useUpdateSkillMutation,
  useGetAllSkillsQuery,
  useGetASkillQuery,
  useDeleteSkillMutation,
} = skillApi;

export default skillApi;
