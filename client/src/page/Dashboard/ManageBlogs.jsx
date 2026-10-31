import ManageBlogRow from "../../components/Dashboard/ManageBlogRow";
import { useTheme } from "../../lib/ThemeProvider";
import { useGetAllBlogsQuery } from "../../redux/features/blogApi";

const ManageBlogs = () => {
  const { data } = useGetAllBlogsQuery();
  const { theme } = useTheme(); //* for using light and dark themes
  // console.log(data);

  //* if there have no skill data
  if (data?.data?.length === 0) {
    return (
      <div className="mt-[25%]">
        <p className="text-center">
          There is no longer Blogs here!
        </p>
      </div>
    );
  }

  return (
    <>
      {data?.data?.length > 0 && (
        <div className="overflow-x-auto">
          <table
            className={`table ${
              theme.mode === "dark" ? "text-gray-100" : "text-gray-800"
            }`}
          >
            {/* head */}
            <thead
              className={`${
                theme.mode === "dark" ? "text-gray-100" : "text-gray-800"
              }`}
            >
              <tr>
                <th>SL</th>
                <th>Blog Title</th>
                <th>Blog Banner </th>
                <th>Author</th>
                <th>Publish</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {data?.data?.map((blog, index) => (
                <ManageBlogRow key={blog._id} blog={blog} index={index} />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
};

export default ManageBlogs;
