import { useState } from "react";
import ManageQualificationRow from "../../components/Dashboard/ManageQualificationRow";
import { useTheme } from "../../lib/ThemeProvider";
import { useGetAllQualificationsQuery } from "../../redux/features/qualificationApi";
import PortfolioModal from "../../components/modal/PortfolioGenericModal";
import AddQualificationModal from "../../components/modal/AddQualificationModal";

const ManageQualification = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { data } = useGetAllQualificationsQuery();
  const { theme } = useTheme(); //* for using light and dark themes
  // console.log(data);

  const closeModal = () => {
    setIsOpen(false);
  };

  //* if there have no skill data
  if (data?.data?.length === 0) {
    return (
      <div className="mt-[25%]">
        <p className="text-center">
          There is no longer qualification here!
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="mx-auto my-4">
        <button onClick={() => setIsOpen(true)} className="btn btn-sm">
          Add
        </button>
      </div>

      {data?.data?.length > 0 && (
        <div className="overflow-x-auto">
          <table
            className={`table ${
              theme.mode === "dark" ? "text-gray-100" : "text-gray-800"
            }`}
          >
            {/* head */}
            <thead
              className={`${
                theme.mode === "dark" ? "text-gray-100" : "text-gray-800"
              }`}
            >
              <tr>
                <th>SL</th>
                <th>Qualification name</th>
                <th>Designation</th>
                <th>Duration</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {data?.data?.map((qualification, index) => (
                <ManageQualificationRow
                  key={qualification._id}
                  qualification={qualification}
                  index={index}
                />
              ))}
            </tbody>
          </table>
        </div>
      )}
      <PortfolioModal
        title={"Add Qualification !"}
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        closeModal={closeModal}
      >
        <AddQualificationModal closeModal={closeModal} />
      </PortfolioModal>
    </>
  );
};

export default ManageQualification;
