import ManageBlogRow from "../../components/Dashboard/ManageBlogRow";
import { useGetAllBlogsQuery } from "../../redux/features/blogApi";

const ManageBlogs = () => {
  const { data } = useGetAllBlogsQuery();
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
            className={`table text-base-content`}
          >
            {/* head */}
            <thead
              className={`text-base-content`}
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
