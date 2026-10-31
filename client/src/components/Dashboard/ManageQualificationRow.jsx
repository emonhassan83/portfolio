import toast, { Toaster } from "react-hot-toast";
import { useDeleteQualificationMutation } from "../../redux/features/qualificationApi";
import { useState } from "react";
import PortfolioModal from "../modal/PortfolioGenericModal";
import UpdateQualificationModal from "../modal/UpdateQualificationModal";

const ManageQualificationRow = ({ qualification, index }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [deleteQualification] = useDeleteQualificationMutation();

  const closeModal = () => {
    setIsOpen(false);
  };

  const handleDelete = async (id) => {
    try {
      const res = await deleteQualification(id);
      console.log(res);
      if (res.data.success) {
        toast.success("Qualification deleted successfully!");
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
        <td>{qualification?.name}</td>
        <td>{qualification?.designation}</td>
        <td>{qualification?.duration}</td>
        <td>
          <div className="flex items-center">
            <button
              onClick={() => setIsOpen(true)}
              className="btn btn-xs btn-color"
            >
              Update
            </button>
            <button
              onClick={() => handleDelete(qualification._id)}
              className="btn btn-xs btn-color"
            >
              Delete
            </button>
          </div>
        </td>

        {/* Update Modal Here */}
        <PortfolioModal
          title={"Update Qualification !"}
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          closeModal={closeModal}
        >
          <UpdateQualificationModal
            qualification={qualification}
            closeModal={closeModal}
          />
        </PortfolioModal>
      </tr>
    </>
  );
};

export default ManageQualificationRow;
