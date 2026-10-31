import { FiAward } from "react-icons/fi";
import { BiBriefcaseAlt, BiSupport } from "react-icons/bi";
import { useTheme } from "../../../lib/ThemeProvider";
import "./About.css";

const Info = () => {
  const { theme } = useTheme(); //* use for dark and light themes

  return (
    <div className={`about__info grid `}>
      <div
        className={`about__box ${
          theme.mode === "dark" ? "dark-bg-color text-gray-100" : "text__color bg-[#fff]"
        }`}
      >
        <FiAward className="about__icon" />
        <h3
          className={`about__title ${
            theme.mode === "dark" ? "text-gray-100" : "text__color"
          }`}
        >
          Experience
        </h3>
        <span className="about__subtitle">1.5 Year+ Courses</span>
      </div>
      <div
        className={`about__box ${
          theme.mode === "dark" ? "dark-bg-color text-gray-100" : "text__color"
        }`}
      >
        <BiBriefcaseAlt className="about__icon" />
        <h3
          className={`about__title ${
            theme.mode === "dark" ? "text-gray-100" : "text__color"
          }`}
        >
          Completed
        </h3>
        <span className="about__subtitle">15+ Projects</span>
      </div>
      <div
        className={`about__box ${
          theme.mode === "dark" ? "dark-bg-color text-gray-100" : "text__color"
        }`}
      >
        <BiSupport className="about__icon" />
        <h3
          className={`about__title ${
            theme.mode === "dark" ? "text-gray-100" : "text__color"
          }`}
        >
          Support
        </h3>
        <span className="about__subtitle">Online 24/7</span>
      </div>
    </div>
  );
};

export default Info;
