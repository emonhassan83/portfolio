import toast, { Toaster } from "react-hot-toast";
import {
  useDeleteBlogMutation,
  usePublishedBlogMutation,
} from "../../redux/features/blogApi";
import { useState } from "react";
import PortfolioModal from "../modal/PortfolioGenericModal";
import UpdateBlogModal from "../modal/UpdateBlogModal";

const ManageBlogRow = ({ blog, index }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [deleteBlog] = useDeleteBlogMutation();
  const [publishedBlog] = usePublishedBlogMutation();

  const closeModal = () => {
    setIsOpen(false);
  };

  const handlePublishedBlog = async (id) => {
    try {
      const res = await publishedBlog(id);
      // console.log(res);
      if (res.data.success) {
        toast.success("Blog published successfully!");
      }
    } catch (error) {
      toast.error(error.message);
      console.error(error.message);
    }
  };

  const handleDelete = async (id) => {
    try {
      const res = await deleteBlog(id);
      console.log(res);
      if (res.data.success) {
        toast.success("Blog deleted successfully!");
      }
    } catch (error) {
      toast.error(error.message);
      console.error(error.message);
    }
  };

  return (
    <>
      <Toaster />
      <tr>
        <td>{index + 1}</td>
        <td>{blog?.name}</td>
        <td>{blog?.banner}</td>
        <td>{blog?.author?.name}</td>
        <td>
          <button
            onClick={() => handlePublishedBlog(blog._id)}
            className="btn btn-sm"
          >
            Publish
          </button>
        </td>
        <td>
          <div className="flex items-center">
            <button
              onClick={() => setIsOpen(true)}
              className="btn btn-xs btn-color"
            >
              Update
            </button>
            <button
              onClick={() => handleDelete(blog._id)}
              className="btn btn-xs btn-color"
            >
              Delete
            </button>
          </div>
        </td>

        {/* Add Update Modal */}
        <PortfolioModal
          title={"Update Blog !"}
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          closeModal={closeModal}
        >
          <UpdateBlogModal blog={blog} closeModal={closeModal} />
        </PortfolioModal>
      </tr>
    </>
  );
};

export default ManageBlogRow;
