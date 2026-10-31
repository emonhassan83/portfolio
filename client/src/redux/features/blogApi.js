import baseApi from "../api/baseApi";

const blogApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    addBlog: builder.mutation({
      query: (blog) => ({
        url: "/blogs/add-blog",
        method: "POST",
        body: blog,
      }),
    }),

    publishedBlog: builder.mutation({
      query: (id) => ({
        url: `/blogs/published-blog/${id}`,
        method: "PATCH"
      }),
    }),

    updateBlog: builder.mutation({
      query: (option) => ({
        url: `/blogs/update-blog/${option.id}`,
        method: "PUT",
        body: option.data,
      }),
    }),

    getAllBlogs: builder.query({
      query: () => ({
        url: "/blogs/all-blogs",
        method: "GET",
      }),
    }),

    getAllMyBlogs: builder.query({
      query: () => ({
        url: "/blogs/my-blogs",
        method: "GET",
      }),
    }),

    getABlog: builder.query({
      query: (id) => ({
        url: `/blogs/${id}`,
        method: "GET",
      }),
    }),

    deleteBlog: builder.mutation({
      query: (id) => ({
        url: `/blogs/delete-blog/${id}`,
        method: "DELETE",
      }),
    }),
  }),
});

export const {
  useAddBlogMutation,
  usePublishedBlogMutation,
  useUpdateBlogMutation,
  useGetAllBlogsQuery,
  useGetAllMyBlogsQuery,
  useGetABlogQuery,
  useDeleteBlogMutation,
} = blogApi;

export default blogApi;
