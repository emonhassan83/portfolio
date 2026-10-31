import toast, { Toaster } from "react-hot-toast";
import PortfolioForm from "../form/PortfolioForm";
import PortfolioInput from "../form/PortfolioInput";
import { useAddQualificationMutation } from "../../redux/features/qualificationApi";
import PortfolioTextArea from "../form/PortfolioTextarea";

const AddQualificationModal = ({ closeModal }) => {
  const [addQualification] = useAddQualificationMutation();

  const onSubmit = async (data) => {
    try {
      const res = await addQualification(data);
      console.log(res);
      if (res.data.success) {
        toast.success("Qualification Added successfully!");
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
            label="Qualification Name"
            placeholder="Enter Qualification Name ..."
          />
          <PortfolioInput
            type="text"
            name="designation"
            label="Qualification designation"
            placeholder="Qualification designation ..."
          />
          <PortfolioTextArea
            type="text"
            name="description"
            label="Qualification description"
            placeholder="Qualification description ..."
          />
          <PortfolioInput
            type="text"
            name="duration"
            label="Qualification duration"
            placeholder="Qualification duration ..."
          />

          <input
            type="submit"
            value="Add Qualification"
            className="btn btn-color border-none btn-block rounded-3xl mt-4"
          />
        </PortfolioForm>
      </div>
    </>
  );
};

export default AddQualificationModal;
