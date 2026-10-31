import { RiGraduationCapLine } from "react-icons/ri";
import "./Qualification.css";
import { useTheme } from "../../../lib/ThemeProvider";

const SingleQualification = ({qualification}) => {
    const { theme } = useTheme(); //* use for dark and light themes
    // console.log(qualification);
    

    return (
        <div className="qualification__item">
          <RiGraduationCapLine
            className={`qualification__icon ${
              theme.mode === "dark" ? "dark-bg-color text-gray-100" : "bg__gray"
            }`}
          />
          <span
            className={`qualification__date ${
              theme.mode === "dark" ? "dark-bg-color text-gray-100" : "bg__gray"
            }`}
          >
            {qualification.duration}
          </span>
          <h3
            className={`qualification__subtitle ${
              theme.mode === "dark"
                ? "dark-bg-color text-gray-100"
                : "text__color"
            }`}
          >
            {qualification.name} <span>{qualification.designation}</span>
          </h3>
          <p className="qualification__description">
          {qualification.description}
          </p>
        </div>
    );
};

export default SingleQualification;