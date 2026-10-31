import { Outlet, useLocation } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Navbar from "../components/Shared/Navbar/Navbar";
import DarkAndLightToggle from "../components/Shared/DarkLightToogle/DarkAndLightToggle";
import Footer from "../components/Shared/Footer/Footer";
import ScrollUp from "../components/Shared/ScrollUp/ScrollUp";


const MainLayout = () => {
  const location = useLocation();
  const noHeaderFooter =
    location.pathname.includes("login") || location.pathname.includes("signUp");

  return (
    <div>
      {noHeaderFooter || <Navbar />}
      <>
        <Outlet />
        <Toaster />
        <ScrollUp />
        <DarkAndLightToggle />
      </>
      {noHeaderFooter || <Footer />}
    </div>
  );
};

export default MainLayout;
