import "./Service.css";
import { AiOutlineArrowRight, AiOutlineCheckCircle } from "react-icons/ai";
import { RxCross1 } from "react-icons/rx";
import { BsCode, BsWindowSidebar, BsJournalCode } from "react-icons/bs";
import { useState } from "react";
import { useTheme } from "../../../lib/ThemeProvider";

const Services = () => {
  const [toggleState, setToggleState] = useState(0);
  const { theme } = useTheme(); //* use for dark and light themes

  const toggleTab = (index) => {
    setToggleState(index);
  };

  return (
    <section
      className={`services section ${
        theme.mode === "dark"
          ? "dark-bg-color text-gray-100"
          : "bg-color title__color"
      }`}
      id="services"
    >
      <h2
        className={`section__title ${
          theme.mode === "dark" ? "text-gray-100" : "text__color"
        }`}
      >
        Services
      </h2>
      <span className="section__subtitle">What I Offer</span>
      <div className="services__container container grid">
        <div
          className={`services__content ${
            theme.mode === "dark"
              ? "dark-bg-color text-gray-100"
              : "bg__White title__color"
          }`}
        >
          <div>
            <BsWindowSidebar className="services__icon" />
            <h3
              className={`services__title ${
                theme.mode === "dark" ? "text-gray-100" : "title__color"
              }`}
            >
              Web
              <br />
              Designer
            </h3>
          </div>

          <span onClick={() => toggleTab(1)} className="services__button">
            View More
            <AiOutlineArrowRight className="services__button-icon" />
          </span>

          <div
            className={
              toggleState === 1
                ? "services__modal active-modal"
                : "services__modal"
            }
          >
            <div
              className={`services__modal-content ${
                theme.mode === "dark" ? "dark-bg-color" : "bg__white"
              }`}
            >
              <RxCross1
                onClick={() => toggleTab(0)}
                className="services__modal-close"
              />

              <h3
                className={`services__modal-title ${
                  theme.mode === "dark" ? "text-gray-100" : "text__color"
                }`}
              >
                Web Designer
              </h3>
              <p className="services__modal-description">
                Service with more than 6 month of experience. Providing quality
                work and delivering high-quality, user-centric design.
              </p>

              <ul className="services__modal-services grid">
                <li className="services__modal-service">
                  <AiOutlineCheckCircle className="services__modal-icon" />
                  <p className="services__modal-info">
                    Service with more than 6 month of experience. Providing
                    quality work and delivering high-quality, user-centric
                    design.
                  </p>
                </li>

                <li className="services__modal-service">
                  <AiOutlineCheckCircle className="services__modal-icon" />
                  <p className="services__modal-info">
                    Create websites that adapt to different devices.
                  </p>
                </li>

                <li className="services__modal-service">
                  <AiOutlineCheckCircle className="services__modal-icon" />
                  <p className="services__modal-info">
                    Prioritize user needs for intuitive interfaces and
                    experiences.
                  </p>
                </li>

                <li className="services__modal-service">
                  <AiOutlineCheckCircle className="services__modal-icon" />
                  <p className="services__modal-info">
                    Optimize code and minimize file sizes for fast loading
                    times.
                  </p>
                </li>
                <li className="services__modal-service">
                  <AiOutlineCheckCircle className="services__modal-icon" />
                  <p className="services__modal-info">
                    Ensure websites are accessible to all users, including those
                    with disabilities.
                  </p>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div
          className={`services__content ${
            theme.mode === "dark" ? "dark-bg-color" : "bg__White"
          }`}
        >
          <div>
            <BsCode className="services__icon" />
            <h3
              className={`services__title ${
                theme.mode === "dark" ? "text-gray-100" : "title__color"
              }`}
            >
              Frontend <br />
              Developer
            </h3>
          </div>

          <span onClick={() => toggleTab(2)} className="services__button">
            View More
            <AiOutlineArrowRight className="services__button-icon" />
          </span>

          <div
            className={
              toggleState === 2
                ? "services__modal active-modal"
                : "services__modal"
            }
          >
            <div
              className={`services__modal-content ${
                theme.mode === "dark" ? "dark-bg-color" : "bg__white"
              }`}
            >
              <RxCross1
                onClick={() => toggleTab(0)}
                className="services__modal-close"
              />

              <h3
                className={`services__modal-title ${
                  theme.mode === "dark" ? "text-gray-100" : "text__color"
                }`}
              >
                Frontend Developer
              </h3>
              <p className="services__modal-description">
                Designs and develops user-facing websites using HTML, CSS, and
                JavaScript, ensuring optimal performance and seamless user
                experience.
              </p>

              <ul className="services__modal-services grid">
                <li className="services__modal-service">
                  <AiOutlineCheckCircle className="services__modal-icon" />
                  <p className="services__modal-info">
                    HTML: Structure webpage content using tags for organization.
                  </p>
                </li>

                <li className="services__modal-service">
                  <AiOutlineCheckCircle className="services__modal-icon" />
                  <p className="services__modal-info">
                    CSS Styling: Apply styles for visual appeal and layout.
                  </p>
                </li>

                <li className="services__modal-service">
                  <AiOutlineCheckCircle className="services__modal-icon" />
                  <p className="services__modal-info">
                    Responsive Design: Adapt websites to different devices.
                  </p>
                </li>

                <li className="services__modal-service">
                  <AiOutlineCheckCircle className="services__modal-icon" />
                  <p className="services__modal-info">
                    JavaScript Interactivity: Add interactive elements using
                    JavaScript.
                  </p>
                </li>
                <li className="services__modal-service">
                  <AiOutlineCheckCircle className="services__modal-icon" />
                  <p className="services__modal-info">
                    Performance Optimization: Optimize code and files for faster
                    loading.
                  </p>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div
          className={`services__content ${
            theme.mode === "dark" ? "dark-bg-color" : "bg__White"
          }`}
        >
          <div>
            <BsJournalCode className="services__icon" />
            <h3
              className={`services__title ${
                theme.mode === "dark" ? "text-gray-100" : "title__color"
              }`}
            >
              Full Stack <br />
              Developer
            </h3>
          </div>

          <span onClick={() => toggleTab(3)} className="services__button">
            View More
            <AiOutlineArrowRight className="services__button-icon" />
          </span>

          <div
            className={
              toggleState === 3
                ? "services__modal active-modal"
                : "services__modal"
            }
          >
            <div
              className={`services__modal-content ${
                theme.mode === "dark" ? "dark-bg-color" : "bg__white"
              }`}
            >
              <RxCross1
                onClick={() => toggleTab(0)}
                className="services__modal-close"
              />

              <h3
                className={`services__modal-title ${
                  theme.mode === "dark" ? "text-gray-100" : "text__color"
                }`}
              >
                Full Stack Developer
              </h3>
              <p className="services__modal-description">
                Powers websites with server-side programming, databases, and
                APIs, ensuring efficient data management and seamless
                functionality.
              </p>

              <ul className="services__modal-services grid">
                <li className="services__modal-service">
                  <AiOutlineCheckCircle className="services__modal-icon" />
                  <p className="services__modal-info">
                    Develop and maintain the server-side logic that powers
                    website functionality.
                  </p>
                </li>

                <li className="services__modal-service">
                  <AiOutlineCheckCircle className="services__modal-icon" />
                  <p className="services__modal-info">
                    Design and manage databases to efficiently store and
                    retrieve data.
                  </p>
                </li>

                <li className="services__modal-service">
                  <AiOutlineCheckCircle className="services__modal-icon" />
                  <p className="services__modal-info">
                    Integrate external APIs to enable communication between
                    different software systems.
                  </p>
                </li>

                <li className="services__modal-service">
                  <AiOutlineCheckCircle className="services__modal-icon" />
                  <p className="services__modal-info">
                    Implement robust security measures to protect data and
                    prevent unauthorized access.
                  </p>
                </li>
                <li className="services__modal-service">
                  <AiOutlineCheckCircle className="services__modal-icon" />
                  <p className="services__modal-info">
                    Design systems that can handle increasing traffic and data
                    loads as the website grows.
                  </p>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Services;
