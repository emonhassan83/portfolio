import toast, { Toaster } from "react-hot-toast";
import PortfolioForm from "../form/PortfolioForm";
import PortfolioInput from "../form/PortfolioInput";
import { useUpdateSkillMutation } from "../../redux/features/skillsApi";

const UpdateSkillModal = ({ skill, closeModal }) => {
  const [addSkill] = useUpdateSkillMutation();

  const defaultValues = {
    name: skill?.name,
    image: skill?.image,
  };

  const onSubmit = async (data) => {
    try {
      const option = {
        id: skill._id,
        data: data,
      };

      const res = await addSkill(option);
      console.log(res);
      if (res.data.success) {
        toast.success("Skill update successfully!");
        closeModal();
      }
    } catch (error) {
      toast.error(error.message);
      console.error(error.message);
    }
  };

  return (
    <>
      <Toaster />
      <div className="bg-gray-50 w-full rounded-md p-10 mx-auto">
        <PortfolioForm onSubmit={onSubmit} defaultValues={defaultValues}>
          <PortfolioInput
            type="text"
            name="name"
            label="Skill Name"
            placeholder="Enter Skill Name ..."
          />
          <PortfolioInput
            type="text"
            name="image"
            label="Skill Image"
            placeholder="Skill Image URL ..."
          />

          <input
            type="submit"
            value="Update Skill"
            className="btn btn-color border-none btn-block rounded-3xl mt-4"
          />
        </PortfolioForm>
      </div>
    </>
  );
};

export default UpdateSkillModal;
