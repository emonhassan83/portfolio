import { useState } from "react";
import ManageSkillRow from "../../components/Dashboard/ManageSkillRow";
import { useTheme } from "../../lib/ThemeProvider";
import { useGetAllSkillsQuery } from "../../redux/features/skillsApi";
import PortfolioModal from "../../components/modal/PortfolioGenericModal";
import AddSkillModal from "../../components/modal/AddSkillModal";

const ManageSkills = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { data } = useGetAllSkillsQuery();
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
          There is no longer skills here!
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="my-4 text-center">
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
                <th>Skill Name</th>
                <th>Skill Image</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {data?.data?.map((skill, index) => (
                <ManageSkillRow key={skill._id} skill={skill} index={index} />
              ))}
            </tbody>
          </table>
        </div>
      )}
      <PortfolioModal
        title={"Add Skill !"}
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        closeModal={closeModal}
      >
        <AddSkillModal closeModal={closeModal} />
      </PortfolioModal>
    </>
  );
};

export default ManageSkills;
