import "./Qualification.css";
import { useTheme } from "../../../lib/ThemeProvider";
import { useGetAllQualificationsQuery } from "../../../redux/features/qualificationApi";
import SingleQualification from "./SingleQualification";

const Qualification = () => {
  const { theme } = useTheme(); //* use for dark and light themes
  const {data} = useGetAllQualificationsQuery();
  // console.log(data);
  
  return (
    <section
      className={`qualification section ${
        theme.mode === "dark" ? "dark-bg-color text-gray-100" : "bg-color"
      }`}
      id="qualification"
    >
      <h2
        className={`section__title ${
          theme.mode === "dark" ? "text-gray-100" : "text__color"
        }`}
      >
        Education & Experience
      </h2>
      <span className="section__subtitle">My personal journey</span>

      <div className="qualification__container container grid">
        {
          data?.data?.map((qualification) => (
            <SingleQualification key={qualification._id} qualification={qualification} />
          ))
        }
      </div>
    </section>
  );
};

export default Qualification;
