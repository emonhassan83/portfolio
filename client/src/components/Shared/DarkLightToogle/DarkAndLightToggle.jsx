import { useEffect } from "react";
import { useTheme } from "../../../lib/ThemeProvider";

const DarkAndLightToggle = () => {

    const { theme, themeSwitchHandler } = useTheme(); // for using light and dark themes

    useEffect(() => {
        document.querySelector("html").setAttribute("data-theme", theme.mode);
      }, [theme]);

      const makeLight = () => {
        if (theme.mode === "dark") {
            themeSwitchHandler();
        }
      }

      const makeMoody = () => {
        if (theme.mode === "light") {
            themeSwitchHandler();
        }
      }

  return (
    <div className={`fixed overflow-x-hidden z-10 bottom-14 sm:bottom-16 md:bottom-4 left-4 text-[12px] sm:text-sm ${
      theme.mode === "dark"
        ? "text-gray-100"
        : "text-black"
    }`}>
      <div className="flex items-center gap-2">
        <p onClick={()=> makeLight()} title="Make Light" className="cursor-pointer">LIGHT</p> /
        <p onClick={()=> makeMoody()} title="Make Moody" className="cursor-pointer">MOODY</p>
      </div>
    </div>
  );
};

export default DarkAndLightToggle;
