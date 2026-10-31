import baseApi from "../api/baseApi";

const reviewApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    addReview: builder.mutation({
      query: (review) => ({
        url: "/reviews/add-review",
        method: "POST",
        body: review,
      }),
    }),

    updateReview: builder.mutation({
      query: (option) => ({
        url: `/reviews/update-review/${option.id}`,
        method: "PUT",
        body: option.data,
      }),
    }),

    getAllReviews: builder.query({
      query: () => ({
        url: "/reviews/all-reviews",
        method: "GET",
      }),
    }),

    getAllMyReviews: builder.query({
      query: () => ({
        url: "/reviews/my-reviews",
        method: "GET",
      }),
    }),

    getAReview: builder.query({
      query: (id) => ({
        url: `/reviews/${id}`,
        method: "GET",
      }),
    }),

    deleteReview: builder.mutation({
      query: (id) => ({
        url: `/reviews/delete-review/${id}`,
        method: "DELETE",
      }),
    }),
  }),
});

export const {
  useAddReviewMutation,
  useUpdateReviewMutation,
  useGetAllReviewsQuery,
  useGetAllMyReviewsQuery,
  useGetAReviewQuery,
  useDeleteReviewMutation,
} = reviewApi;

export default reviewApi;