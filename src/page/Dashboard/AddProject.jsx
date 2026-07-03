import toast, { Toaster } from "react-hot-toast";
import PortfolioForm from "../../components/form/PortfolioForm";
import PortfolioInput from "../../components/form/PortfolioInput";
import PortfolioTextArea from "../../components/form/PortfolioTextarea";
import { useAddProjectMutation } from "../../redux/features/projectApi";
import { useRouter } from "next/navigation";

const AddProject = () => {
  const [addProject] = useAddProjectMutation();
  const router = useRouter();

  const onSubmit = async (data) => {
    try {
      console.log(data);
      const res = await addProject(data);
      console.log(res);

      if (res.data.success) {
        toast.success("Project added successfully!");
        router.push("/dashboard/manage-project");
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
          Add Project
        </h2>
        <PortfolioForm onSubmit={onSubmit}>
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
            value="Add A Project"
            className="btn btn-color border-none btn-block rounded-3xl mt-4"
          />
        </PortfolioForm>
      </div>
    </div>
  );
};

export default AddProject;
