import toast, { Toaster } from "react-hot-toast";
import PortfolioForm from "../form/PortfolioForm";
import PortfolioInput from "../form/PortfolioInput";
import { useUpdateQualificationMutation } from "../../redux/features/qualificationApi";
import PortfolioTextArea from "../form/PortfolioTextarea";

const UpdateQualificationModal = ({ qualification, closeModal }) => {
  const [updateQualification] = useUpdateQualificationMutation();

  const defaultValues = {
    name: qualification?.name,
    designation: qualification?.designation,
    description: qualification?.description,
    duration: qualification?.duration,
  };

  const onSubmit = async (data) => {
    try {
      const option = {
        id: qualification._id,
        data: data,
      };
      const res = await updateQualification(option);
      console.log(res);
      if (res.data.success) {
        toast.success("Qualification update successfully!");
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
            value="Update Qualification"
            className="btn btn-color border-none btn-block rounded-3xl mt-4"
          />
        </PortfolioForm>
      </div>
    </>
  );
};

export default UpdateQualificationModal;
