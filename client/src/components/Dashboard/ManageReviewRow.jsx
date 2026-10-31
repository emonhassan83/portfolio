import toast, { Toaster } from "react-hot-toast";
import { useState } from "react";
import { useDeleteReviewMutation } from "../../redux/features/reviewApi";
import PortfolioModal from "../modal/PortfolioGenericModal";
import UpdateReviewModal from "../modal/UpdateReviewModal";
// import PortfolioModal from "../modal/PortfolioGenericModal";

const ManageReviewRow = ({ review, index }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [deleteReview] = useDeleteReviewMutation()

  const closeModal = () => {
    setIsOpen(false);
  };

  console.log(review);
  

  const handleDelete = async (id) => {
    try {
      const res = await deleteReview(id);
      console.log(res);
      if (res.data.success) {
        toast.success("Review deleted successfully!");
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
        <td>{review?.user?.name}</td>
        <td>{review?.rating}</td>
        <td>{review?.user?.address}</td>
        <td>
          <div className="flex items-center">
            <button
              onClick={() => setIsOpen(true)}
              className="btn btn-xs btn-color"
            >
              Update
            </button>
            <button
              onClick={() => handleDelete(review._id)}
              className="btn btn-xs btn-color"
            >
              Delete
            </button>
          </div>
        </td>

        {/* Update Modal Here */}
        <PortfolioModal
          title={"Update Review !"}
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          closeModal={closeModal}
        >
          <UpdateReviewModal
            review={review}
            closeModal={closeModal}
          />
        </PortfolioModal>
      </tr>
    </>
  );
};

export default ManageReviewRow;
