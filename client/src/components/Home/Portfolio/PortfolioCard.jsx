import "./Portfolio.css";
import { AiOutlineArrowRight } from "react-icons/ai";
import { RxCross1 } from "react-icons/rx";
import { VscDebugBreakpointLog } from "react-icons/vsc";
import { useTheme } from "../../../lib/ThemeProvider";
import { useState } from "react";

const PortfolioCard = ({ project }) => {
  const [toggleState, setToggleState] = useState(0);
  const { theme } = useTheme(); //* use for dark and light themes
  const featuresArr = project.features.split(".").map((item) => item.trim());

  const toggleTab = (index) => {
    setToggleState(index);
  };

  return (
    <div className="portfolio__content grid">
      <img className="portfolio__img" src={project.image} alt="Project Image" />
      <div className="portfolio__data">
        <h3
          className={`portfolio__title ${
            theme.mode === "dark" ? "text-gray-100" : "text__color"
          }`}
        >
          {project.name}
        </h3>
        <p className="portfolio__description">{project.description}</p>
        <span
          onClick={() => toggleTab(1)}
          className={`portfolio__button ${
            theme.mode === "dark" ? "text-gray-100" : "text__color"
          }`}
        >
          Details
          <AiOutlineArrowRight className="portfolio__button-icon" />
        </span>

        <div
          className={`
             ${
               toggleState === 1
                 ? "portfolio__modal active-modal"
                 : "portfolio__modal"
             } ${
            theme.mode === "dark"
              ? "dark-bg-color text-gray-100"
              : "bg-color title__color"
          }
            `}
        >
          <div className="portfolio__modal-container">
            <div className="portfolio__modal-img">
              <img className="portfolio__modal-img" src={project.image} alt="" />
            </div>

            <div className="portfolio__modal-content">
              <RxCross1
                onClick={() => toggleTab(0)}
                className="portfolio__modal-close"
              />

              <h3
                className={`portfolio__modal-title ${
                  theme.mode === "dark" ? "text-gray-100" : "text__color"
                }`}
              >
                {project.name}
              </h3>
              <p className="portfolio__modal-time"></p>
              <h6 className="portfolio__modal-features-title">Features:</h6>
              <ul className="portfolio__modal-features">
                {featuresArr.map((info, index) => (
                  <li key={index} className="portfolio__modal-feature">
                    <VscDebugBreakpointLog className="portfolio__modal-icon" />
                    <p className="portfolio__modal-info">{info}</p>
                  </li>
                ))}
              </ul>
              <p className="portfolio__modal-time">
                <span>Created:</span> {project.duration}
              </p>
              <p className="portfolio__modal-technology">
                <span>Technologies:</span> {project.technologies}.
              </p>
              <p className="portfolio__modal-link">
                <span>View -</span>{" "}
                <a
                  href={project.live_site_url}
                  target="_blank"
                  rel="noreferrer"
                >
                  Live Site
                </a>{" "}
                |{" "}
                <a
                  href={project.client_site_url}
                  target="_blank"
                  rel="noreferrer"
                >
                  Client-Side Code
                </a>{" "}
                |{" "}
                <a
                  href={project.server_site_url}
                  target="_blank"
                  rel="noreferrer"
                >
                  Server Side Code
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PortfolioCard;
