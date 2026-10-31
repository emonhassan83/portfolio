import toast, { Toaster } from "react-hot-toast";
import PortfolioForm from "../form/PortfolioForm";
import PortfolioInput from "../form/PortfolioInput";
import PortfolioTextArea from "../form/PortfolioTextarea";
import { useUpdateProjectMutation } from "../../redux/features/projectApi";

const UpdateProjectModalData = ({ project, closeModal }) => {
  const [updateProject] = useUpdateProjectMutation();

  const defaultValues = {
    name: project?.name,
    image: project?.image,
    description: project?.description,
    features: project?.features,
    technologies: project?.technologies,
    duration: project?.duration,
    live_site_url: project?.live_site_url,
    client_site_url: project?.client_site_url,
    server_site_url: project?.server_site_url,
  };

  const onSubmit = async (data) => {
    try {
      const option = {
        id: project._id,
        data: data,
      };

      const res = await updateProject(option);
      if (res.data.success) {
        toast.success("Project updated successfully!");
        closeModal();
      }
    } catch (error) {
      toast.error(error.message);
      console.error(error.message);
    }
  };

  return (
    <div className="md:flex justify-center items-center">
      <Toaster />
      <div className="bg-gray-50 w-full h-[700px] rounded-md p-10 mx-auto -mt-20">
        <PortfolioForm onSubmit={onSubmit} defaultValues={defaultValues}>
          <div className="sm:flex justify-center items-center gap-4">
            <PortfolioInput
              type="text"
              name="name"
              label="Project Name"
              placeholder="Enter Project Name ..."
            />
            <PortfolioInput
              type="text"
              name="image"
              label="Project Image"
              placeholder="Project Image URL ..."
            />
          </div>

          <PortfolioTextArea
            type="text"
            name="description"
            label="Description"
            placeholder="Enter Project Description ..."
          />
          <PortfolioTextArea
            type="text"
            name="features"
            label="Features"
            placeholder="Your Project Features ..."
          />
          <PortfolioTextArea
            type="text"
            name="technologies"
            label="Technologies"
            placeholder="Enter Project Technologies ..."
          />
          <div className="sm:flex w-full justify-center items-center gap-4">
            <PortfolioInput
              type="text"
              name="duration"
              label="Duration"
              placeholder="Duration Time ..."
            />
            <PortfolioInput
              type="text"
              name="live_site_url"
              label="Live Site Url"
              placeholder="Enter Live Site Url ..."
            />
          </div>
          <div className="sm:flex w-full justify-center items-center gap-4">
            <PortfolioInput
              type="text"
              name="client_site_url"
              label="Client Site Url"
              placeholder="Enter Client Site Url ..."
            />
            <PortfolioInput
              type="text"
              name="server_site_url"
              label="Server Site Url"
              placeholder="Enter Server Site Url ..."
            />
          </div>

          <input
            type="submit"
            value="Update A Project"
            className="btn btn-color border-none btn-block rounded-3xl mt-4"
          />
        </PortfolioForm>
      </div>
    </div>
  );
};

export default UpdateProjectModalData;
