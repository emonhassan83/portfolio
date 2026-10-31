import toast, { Toaster } from "react-hot-toast";
import PortfolioForm from "../form/PortfolioForm";
import PortfolioInput from "../form/PortfolioInput";
import PortfolioTextArea from "../form/PortfolioTextarea";
import { useUpdateReviewMutation } from "../../redux/features/reviewApi";

const UpdateReviewModal = ({ review, closeModal }) => {
  const [updateReview] = useUpdateReviewMutation();

  const defaultValues = {
    rating: review?.rating,
    content: review?.content
  };

// console.log(review);

  const onSubmit = async (data) => {
    console.log(data);
    
    try {
      const option = {
        id: review._id,
        data: data,
      };
      const res = await updateReview(option);
      console.log(res);
      if (res.data.success) {
        toast.success("Review update successfully!");
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
            name="rating"
            label="Review Rating"
            placeholder="Enter Review Rating ..."
          />
          <PortfolioTextArea
            type="text"
            name="content"
            label="Review content"
            placeholder="Review Content ..."
          />

          <input
            type="submit"
            value="Update Review"
            className="btn btn-color border-none btn-block rounded-3xl mt-4"
          />
        </PortfolioForm>
      </div>
    </>
  );
};

export default UpdateReviewModal;
