import Link from "next/link";
import { usePathname } from "next/navigation";
import { MdOutlineManageSearch, MdAddPhotoAlternate, MdEqualizer, MdManageHistory, MdOutlineReviews } from "react-icons/md";
import { GrProjects } from "react-icons/gr";
import { GiSkills } from "react-icons/gi";
import { useTheme } from "../../../lib/ThemeProvider";

//* Helper function to get class names for Link
const getNavLinkClasses = (isActive, themeMode) => {
  const baseClasses = "flex items-center px-4 py-2 mt-5 transition-colors duration-300 transform";
  const hoverClasses = "hover:bg-gray-300 hover:text-gray-700";
  const activeClasses = isActive ? "bg-gray-300" : "";
  const themeClasses = themeMode === "dark" ? "text-gray-100 bg-[#1D232A]" : "text-gray-800";

  return `${baseClasses} ${hoverClasses} ${themeClasses} ${activeClasses}`;
};

const SidebarItem = () => {
  const { theme } = useTheme(); //* For using light and dark themes
  const pathname = usePathname();

  const links = [
    { href: "/dashboard/add-project", label: "Add Project", icon: <MdOutlineManageSearch className="w-5 h-5" /> },
    { href: "/dashboard/manage-projects", label: "Manage Project", icon: <GrProjects className="w-5 h-5" /> },
    { href: "/dashboard/manage-skills", label: "Manage Skills", icon: <GiSkills className="w-5 h-5" /> },
    { href: "/dashboard/manage-qualifications", label: "Manage Qualifications", icon: <MdEqualizer className="w-5 h-5" /> },
    { href: "/dashboard/add-blog", label: "Add Blog", icon: <MdAddPhotoAlternate className="w-5 h-5" /> },
    { href: "/dashboard/manage-blogs", label: "Manage Blogs", icon: <MdManageHistory className="w-5 h-5" /> },
    { href: "/dashboard/manage-reviews", label: "Manage Reviews", icon: <MdOutlineReviews className="w-5 h-5" /> },
  ];

  return (
    <nav className={`${theme.mode === "dark" ? "text-gray-100 bg-[#1D232A]" : "text-gray-800 bg-gray-100"}`}>
      {links.map((link) => {
        const isActive = pathname === link.href;
        return (
          <Link
            key={link.href}
            href={link.href}
            className={getNavLinkClasses(isActive, theme.mode)}
          >
            {link.icon}
            <span className="mx-4 font-medium">{link.label}</span>
          </Link>
        );
      })}
    </nav>
  );
};

export default SidebarItem;
