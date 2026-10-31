import toast, { Toaster } from "react-hot-toast";
import PortfolioForm from "../../components/form/PortfolioForm";
import PortfolioInput from "../../components/form/PortfolioInput";
import PortfolioTextArea from "../../components/form/PortfolioTextarea";
import { useUpdateBlogMutation } from "../../redux/features/blogApi";

const UpdateBlogModal = ({ blog, closeModal }) => {
  const [updateBlog] = useUpdateBlogMutation();

  const defaultValues = {
    name: blog?.name,
    banner: blog?.banner,
    description: blog?.description,
    images: blog?.images,
    tags: blog?.tags,
  };

  const onSubmit = async (data) => {
    try {
      const option = {
        id: blog._id,
        data: data,
      };
      const res = await updateBlog(option);
      console.log(res);

      if (res.data.success) {
        toast.success("Blog update successfully!");
        closeModal();
      }
    } catch (error) {
      toast.error(error.message);
      console.error(error.message);
    }
  };

  return (
    <div className="md:flex justify-center items-center md:h-[100vh]">
      <Toaster />
      <div className="bg-gray-50 w-full h-[760px] rounded-md p-10 mx-auto shadow-md border-slate-950">
        <h2 className="text-xl sm:text-2xl font-bold text-center mb-6">
          Add Blog
        </h2>
        <PortfolioForm onSubmit={onSubmit} defaultValues={defaultValues}>
          <div className="sm:flex justify-center items-center gap-4">
            <PortfolioInput
              type="text"
              name="name"
              label="Blog Title"
              placeholder="Enter Blog Title..."
            />
            <PortfolioInput
              type="text"
              name="banner"
              label="Blog Banner"
              placeholder="Blog banner URL..."
            />
          </div>

          <PortfolioTextArea
            type="text"
            name="description"
            label="Description"
            placeholder="Enter Blog Description..."
          />
          <PortfolioTextArea
            type="text"
            name="images"
            label="Images"
            placeholder="Your Blog Images..."
          />
          <PortfolioInput
            type="text"
            name="tags"
            label="Tags"
            placeholder="Blog Tags..."
          />

          <input
            type="submit"
            value="Add Blog"
            className="btn btn-color border-none btn-block rounded-3xl mt-4"
          />
        </PortfolioForm>
      </div>
    </div>
  );
};

export default UpdateBlogModal;
