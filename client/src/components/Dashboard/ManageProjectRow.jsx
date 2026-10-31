import { useState } from "react";
import { useDeleteAProjectMutation } from "../../redux/features/projectApi";
import toast, { Toaster } from "react-hot-toast";
import PortfolioModal from "../modal/PortfolioGenericModal";
import UpdateProjectModalData from "../modal/UpdateProjectModal";

const ManageProjectRow = ({ project, index }) => {
  const [deleteAProject] = useDeleteAProjectMutation();
  const [isOpen, setIsOpen] = useState(false);

  const closeModal = () => {
    setIsOpen(false);
  };

  const handleDelete = async (id) => {
    try {
      const res = await deleteAProject(id);
      // console.log(res);
      if (res.data.success) {
        toast.success("Project deleted successfully!");
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
        <td>
          <div className="flex items-center space-x-3">
            <div className="avatar">
              <div className="mask mask-squircle w-12 h-12">
                <img src={project?.image} alt="Class Image" />
              </div>
            </div>
          </div>
        </td>
        <td>{project?.name}</td>
        <td>{project?.duration}</td>
        <td>
          <div className="flex items-center">
            <button
              onClick={() => setIsOpen(true)}
              className="btn btn-xs btn-color"
            >
              Update
            </button>
            <button
              onClick={() => handleDelete(project._id)}
              className="btn btn-xs btn-color"
            >
              Delete
            </button>
          </div>
        </td>

        <PortfolioModal
          title={"Update a Project !"}
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          closeModal={closeModal}
        >
          <UpdateProjectModalData project={project} closeModal={closeModal} />
        </PortfolioModal>
      </tr>
    </>
  );
};

export default ManageProjectRow;
