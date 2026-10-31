import "./Footer.css";
import { AiOutlineInstagram } from "react-icons/ai";
import { BsFacebook, BsTwitter } from "react-icons/bs";
import { useTheme } from "../../../lib/ThemeProvider";

const Footer = () => {
  const { theme } = useTheme(); // use for dark and light themes
  
  return (
    <footer
      className={`footer ${
        theme.mode === "dark"
          ? "dark-bg-color text-gray-100"
          : "bg-color title__color"
      }`}
    >
      <div className="footer__container container">
        <h1
          className={`footer__title ${
            theme.mode === "dark" && "text-gray-100"
          }`}
        >
          Emon
        </h1>

        <ul className="footer__list">
          <li>
            <a
              href="#about"
              className={`footer__link ${
                theme.mode === "dark" && "text-gray-100"
              }`}
            >
              About
            </a>
          </li>
          <li>
            <a
              href="#projects"
              className={`footer__link ${
                theme.mode === "dark" && "text-gray-100"
              }`}
            >
              Projects
            </a>
          </li>
          <li>
            <a
              href="#testimonial"
              className={`footer__link ${
                theme.mode === "dark" && "text-gray-100"
              }`}
            >
              Testimonials
            </a>
          </li>
        </ul>

        <div className="footer__social">
          <a
            href="https://web.facebook.com/emonhassan83/"
            className="footer__social-link"
            target="_blank"
            rel="noreferrer"
          >
            <BsFacebook />
          </a>
          <a
            href="https://www.instagram.com/emonhassan50/"
            className="footer__social-link"
            target="_blank"
            rel="noreferrer"
          >
            <AiOutlineInstagram />
          </a>
          <a
            href="https://twitter.com/emonhasan83"
            className="footer__social-link"
            target="_blank"
            rel="noreferrer"
          >
            <BsTwitter />
          </a>
        </div>

        <span
          className={`footer__copy ${theme.mode === "dark" && "text-gray-100"}`}
        >
          &#169; Emon Hassan . All rights resolved
        </span>
      </div>
    </footer>
  );
};

export default Footer;
