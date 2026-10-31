import { AiOutlineInstagram } from "react-icons/ai";
import { CiLinkedin } from "react-icons/ci";
import { FiGithub } from "react-icons/fi";
import { useTheme } from "../../../lib/ThemeProvider";

const Social = () => {
  const { theme } = useTheme(); // use for dark and light themes

  return (
    <div>
      <div className="home__social">
        <a
          href="https://www.instagram.com/emonhassan50/"
          className="home__social-icon"
          target="_blank"
          rel="noreferrer"
        >
          <AiOutlineInstagram
            className={`home__social-icon ${
              theme.mode === "dark" ? "dark-bg-color text-gray-100 hover:text-white" : "text__color"
            }`}
          />
        </a>
        <a
          href="https://www.linkedin.com/in/emonhassan83/"
          className="home__social-icon"
          target="_blank"
          rel="noreferrer"
        >
          <CiLinkedin  className={`home__social-icon ${
              theme.mode === "dark" ? "dark-bg-color text-gray-100 hover:text-white" : "text__color"
            }`} />
        </a>
        <a
          href="https://github.com/emonhassan83"
          className="home__social-icon"
          target="_blank"
          rel="noreferrer"
        >
          <FiGithub  className={`home__social-icon ${
              theme.mode === "dark" ? "dark-bg-color text-gray-100 hover:text-white" : "text__color"
            }`} />
        </a>
      </div>
    </div>
  );
};

export default Social;
