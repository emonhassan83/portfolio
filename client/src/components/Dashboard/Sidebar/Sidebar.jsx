import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { AiOutlineBars } from "react-icons/ai";
import { BsFillHouseAddFill } from "react-icons/bs";
import { MdLogout } from "react-icons/md";
import SidebarItem from "./SidebarItem";
import { useGetMyProfileQuery } from "../../../redux/features/userApi";
import baseApi from "../../../redux/api/baseApi";
import { useLogoutMutation } from "../../../redux/features/auth/authApi";
import { logout } from "../../../redux/features/auth/authSlice";

const Sidebar = () => {
  const {data} = useGetMyProfileQuery();
  const router = useRouter();
  const dispatch = useDispatch();
  const [logoutRequest] = useLogoutMutation();

  const handleLogout = async () => {
    await logoutRequest();
    dispatch(logout());
    dispatch(baseApi.util.resetApiState());
    router.replace("/dashboard/login");
  };
  const user = data?.data;

  const [isActive, setActive] = useState("false");
  const handleToggle = () => {
    setActive(!isActive);
  };

  return (
    <>
      {/* Small Screen Navbar */}
      <div className="flex justify-between border-b border-base-content/10 bg-base-200 text-base-content md:hidden">
        {/* <Link href="/" className="cursor-pointer">
          <div className="block cursor-pointer p-4 font-bold">
            <img className="w-40" src={""} alt="Dashboard Logo" />
          </div>
        </Link> */}

        <button
          onClick={handleToggle}
          aria-label="Toggle menu"
          className="mobile-menu-button p-4 hover:text-primary focus:outline-none focus-visible:bg-base-300"
        >
          <AiOutlineBars className="h-5 w-5" />
        </button>
      </div>
      {/* Sidebar */}
      <div
        className={`z-10 md:fixed flex flex-col justify-between overflow-y-auto overflow-x-hidden w-64 space-y-6 px-2 py-4 absolute inset-y-0 left-0 transform border-r border-base-content/10 bg-base-200 text-base-content ${
          isActive && "-translate-x-full"
        }  md:translate-x-0  transition duration-200 ease-in-out`}
      >
        <div>
          {/* Branding & Profile Info */}
          <div>
            <div className="w-full hidden md:flex justify-center items-center mx-auto">
              {/* <Link href="/">
                <img className="w-36 -mt-4" src={"logo"} alt="Dashboard Logo" />
              </Link> */}
            </div>
            <div className="flex flex-col items-center mt-6 -mx-2">
              <img
                className="object-cover w-24 h-24 mx-2 rounded-full ring-1 ring-base-content/15"
                src={user?.photoURL || "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3f/Placeholder_view_vector.svg/991px-Placeholder_view_vector.svg.png"}
                alt="avatar"
                referrerPolicy="no-referrer"
              />
              <h4 className="mx-2 mt-4 font-medium">
                {user?.name}
              </h4>
              <p className="mx-2 mt-1 font-mono text-xs text-base-content/60">
                {user?.email}
              </p>
            </div>
          </div>

          {/* Nav Items */}
          <div className="flex flex-col justify-between flex-1 mt-6">
            {/* Create dynamic if user role is admin */}
            <SidebarItem />
          </div>
        </div>

        <div>
          <hr className="border-base-content/10" />
          <Link
            href="/"
            className="mt-4 flex items-center rounded px-4 py-2.5 text-base-content/75 transition-colors duration-200 hover:bg-base-300 hover:text-base-content"
          >
            <BsFillHouseAddFill className="w-5 h-5" />

            <span className="mx-4 font-medium">Home</span>
          </Link>
          <button
            type="button"
            onClick={handleLogout}
            className="mt-1 flex w-full items-center rounded px-4 py-2.5 text-base-content/75 transition-colors duration-200 hover:bg-error/10 hover:text-error"
          >
            <MdLogout className="w-5 h-5" />
            <span className="mx-4 font-medium">Log out</span>
          </button>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
