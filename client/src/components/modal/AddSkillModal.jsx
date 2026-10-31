import toast, { Toaster } from "react-hot-toast";
import PortfolioForm from "../form/PortfolioForm";
import PortfolioInput from "../form/PortfolioInput";
import { useAddSkillMutation } from "../../redux/features/skillsApi";

const AddSkillModal = ({ closeModal }) => {
  const [addSkill] = useAddSkillMutation();

  const onSubmit = async (data) => {
    try {
      const res = await addSkill(data);
      if (res.data.success) {
        toast.success("Skill Added successfully!");
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
        <PortfolioForm onSubmit={onSubmit}>
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
            value="Add Skill"
            className="btn btn-color border-none btn-block rounded-3xl mt-4"
          />
        </PortfolioForm>
      </div>
    </>
  );
};

export default AddSkillModal;
