import baseApi from "../api/baseApi";

/** Dashboard endpoints for the home page content (admin only on the server). */
const portfolioApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getPortfolioProfile: builder.query({
      query: () => ({ url: "/portfolio/profile", method: "GET" }),
      providesTags: [{ type: "Portfolio", id: "profile" }],
    }),
    updatePortfolioProfile: builder.mutation({
      query: (body) => ({ url: "/portfolio/profile", method: "PUT", body }),
      invalidatesTags: [{ type: "Portfolio", id: "profile" }],
    }),
    getPortfolioItems: builder.query({
      query: (resource) => ({ url: `/portfolio/${resource}`, method: "GET" }),
      providesTags: (_r, _e, resource) => [{ type: "Portfolio", id: resource }],
    }),
    createPortfolioItem: builder.mutation({
      query: ({ resource, body }) => ({ url: `/portfolio/${resource}`, method: "POST", body }),
      invalidatesTags: (_r, _e, { resource }) => [{ type: "Portfolio", id: resource }],
    }),
    updatePortfolioItem: builder.mutation({
      query: ({ resource, id, body }) => ({ url: `/portfolio/${resource}/${id}`, method: "PUT", body }),
      invalidatesTags: (_r, _e, { resource }) => [{ type: "Portfolio", id: resource }],
    }),
    deletePortfolioItem: builder.mutation({
      query: ({ resource, id }) => ({ url: `/portfolio/${resource}/${id}`, method: "DELETE" }),
      invalidatesTags: (_r, _e, { resource }) => [{ type: "Portfolio", id: resource }],
    }),
    reorderPortfolioItems: builder.mutation({
      query: ({ resource, ids }) => ({ url: `/portfolio/${resource}/reorder`, method: "PATCH", body: { ids } }),
      invalidatesTags: (_r, _e, { resource }) => [{ type: "Portfolio", id: resource }],
    }),
    importPortfolio: builder.mutation({
      query: (body) => ({ url: "/portfolio/import", method: "POST", body }),
      invalidatesTags: ["Portfolio"],
    }),
  }),
});

export const {
  useGetPortfolioProfileQuery,
  useUpdatePortfolioProfileMutation,
  useGetPortfolioItemsQuery,
  useCreatePortfolioItemMutation,
  useUpdatePortfolioItemMutation,
  useDeletePortfolioItemMutation,
  useReorderPortfolioItemsMutation,
  useImportPortfolioMutation,
} = portfolioApi;

export default portfolioApi;
