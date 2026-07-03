"use client";

import "./Navbar.css";
import { FaBars } from "react-icons/fa";
import { AiOutlineHome, AiOutlineUser } from "react-icons/ai";
import { GrDocumentText } from "react-icons/gr";
import { BsFillImageFill } from "react-icons/bs";
// import { BiSolidMessageSquareDetail } from "react-icons/bi";
import { MdOutlineHomeRepairService } from "react-icons/md";
import { RxCross1 } from "react-icons/rx";
import { IoIosLogIn } from "react-icons/io";
import { CiLogout } from "react-icons/ci";
import { useState, useEffect } from "react";
import { useTheme } from "../../../lib/ThemeProvider";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import {
  logout,
  useCurrentToken,
} from "../../../redux/features/auth/authSlice";
import toast from "react-hot-toast";

const Navbar = () => {
  const dispatch = useDispatch();
  const [toggle, setToggle] = useState(false);
  const [activeNav, setActiveNav] = useState("#home");
  const { theme } = useTheme(); //* use for dark and light themes
  const token = useSelector(useCurrentToken);

  useEffect(() => {
    const handleScroll = () => {
      const header = document.querySelector(".header");
      if (window.scrollY >= 80) header.classList.add("scroll-header");
      else header.classList.remove("scroll-header");
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = () => {
    toast.success("User logged out successfully!");
    dispatch(logout());
  };

  return (
    <header
      className={`header ${
        theme.mode === "dark" ? "dark-bg-color text-gray-100" : "bg-color"
      }`}
    >
      <nav className="nav container">
        <Link
          href="/"
          className={`nav__logo ${
            theme.mode === "dark" ? "text-gray-100" : "text-dark-color"
          } `}
        >
          Emon
        </Link>
        <div
          className={`${toggle ? "nav__menu show-menu" : "nav__menu"} ${
            theme.mode === "dark"
              ? "text-gray-100 hover:text-white dark-bg-color"
              : "text-dark-color bg-color"
          }`}
        >
          <ul
            className={`nav__list ${
              theme.mode === "dark" ? "text-gray-100" : "text-dark-color"
            }`}
          >
            <li className="nav__item">
              <a
                href="#home"
                onClick={() => setActiveNav("#home")}
                className={`
                  ${
                    activeNav === "#home"
                      ? "nav__link active-link"
                      : "nav__link"
                  } ${
                  theme.mode === "dark"
                    ? "text-gray-100 hover:text-white"
                    : "text-dark-color"
                }
                `}
              >
                <AiOutlineHome className="nav__icon" /> Home
              </a>
            </li>
            <li className="nav__item">
              <a
                href="#about"
                onClick={() => setActiveNav("#about")}
                className={`
                  ${
                    activeNav === "#about"
                      ? "nav__link active-link"
                      : "nav__link"
                  } ${
                  theme.mode === "dark"
                    ? "text-gray-100 hover:text-white"
                    : "text-dark-color"
                }
                `}
              >
                <AiOutlineUser className="nav__icon" /> About
              </a>
            </li>
            <li className="nav__item">
              <a
                href="#skills"
                onClick={() => setActiveNav("#skill")}
                className={`
                  ${
                    activeNav === "#skill"
                      ? "nav__link active-link"
                      : "nav__link"
                  } ${
                  theme.mode === "dark"
                    ? "text-gray-100 hover:text-white"
                    : "text-dark-color"
                }
                `}
              >
                <GrDocumentText className="nav__icon" /> Skills
              </a>
            </li>
            <li className="nav__item">
              <a
                href="#services"
                onClick={() => setActiveNav("#services")}
                className={`
                  ${
                    activeNav === "#services"
                      ? "nav__link active-link"
                      : "nav__link"
                  } ${
                  theme.mode === "dark"
                    ? "text-gray-100 hover:text-white"
                    : "text-dark-color"
                }
                `}
              >
                <MdOutlineHomeRepairService className="nav__icon" /> Services
              </a>
            </li>
            <li className="nav__item">
              <a
                href="#portfolio"
                onClick={() => setActiveNav("#portfolio")}
                className={`
                  ${
                    activeNav === "#portfolio"
                      ? "nav__link active-link"
                      : "nav__link"
                  } ${
                  theme.mode === "dark"
                    ? "text-gray-100 hover:text-white"
                    : "text-dark-color"
                }
                `}
              >
                <BsFillImageFill className="nav__icon" /> Portfolio
              </a>
            </li>
            {/* <li className="nav__item">
              <a
                href="#contact"
                onClick={() => setActiveNav("#contact")}
                className={`
                  ${
                    activeNav === "#contact"
                      ? "nav__link active-link"
                      : "nav__link"
                  } ${
                  theme.mode === "dark"
                    ? "text-gray-100 hover:text-white"
                    : "text-dark-color"
                }
                `}
              >
                <BiSolidMessageSquareDetail className="nav__icon" /> Contract
              </a>
            </li> */}
            <li className="-my-4 sm:my-0 nav__item">
              {token ? (
                <button
                  onClick={handleLogout}
                  className={`btn ${
                    theme.mode === "dark" ? "text-gray-100" : "text-dark-color"
                  } btn-xs sm:btn-sm btn-outline text-sm sm:text-base font-medium capitalize nav__link`}
                >
                  <CiLogout className="nav__icon" /> Logout
                </button>
              ) : (
                <Link href="/login">
                  <button
                    className={`btn ${
                      theme.mode === "dark"
                        ? "text-gray-100"
                        : "text-dark-color"
                    } btn-xs sm:btn-sm btn-outline text-sm sm:text-base font-medium capitalize`}
                  >
                    <IoIosLogIn className="nav__icon" /> Login
                  </button>
                </Link>
              )}
            </li>
          </ul>
          <RxCross1
            className={`nav__close ${
              theme.mode === "dark"
                ? "text-gray-100 hover:text-white"
                : "text-dark-color"
            }`}
            onClick={() => setToggle(!toggle)}
          />
        </div>
        <div
          className={`nav__toggle ${
            theme.mode === "dark"
              ? "text-gray-100 hover:text-white"
              : "text-dark-color"
          }`}
          onClick={() => setToggle(!toggle)}
        >
          <FaBars />
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
