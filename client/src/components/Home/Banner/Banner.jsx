import { useTheme } from "../../../lib/ThemeProvider";
import "./Banner.css";
import BannerText from "./BannerText";
import ScrollDown from "./ScrollDown";
import Social from "./Social";

const Banner = () => {
  const { theme } = useTheme(); // use for dark and light themes
  return (
    <section
      className={`home section ${
        theme.mode === "dark" ? "dark-bg-color text-gray-100" : "bg-color"
      }`}
      id="home"
    >
      <div className="home__container container">
        <div className="home__content grid">
          <Social />
          <div className="home__img"></div>
          <BannerText />
        </div>
        <ScrollDown />
      </div>
    </section>
  );
};

export default Banner;
