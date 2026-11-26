import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  MdOutlineManageSearch,
  MdAddPhotoAlternate,
  MdEqualizer,
  MdManageHistory,
  MdOutlineReviews,
  MdPerson,
  MdWorkHistory,
  MdLayers,
  MdRule,
  MdSchool,
  MdSecurity,
} from "react-icons/md";
import { GrProjects } from "react-icons/gr";
import { GiSkills } from "react-icons/gi";

const linkCls = (active) =>
  `mt-1 flex items-center rounded border-l-2 px-4 py-2.5 transition-colors duration-200 ${
    active
      ? "border-primary bg-primary/10 text-primary"
      : "border-transparent text-base-content/75 hover:bg-base-300 hover:text-base-content"
  }`;

// GrProjects draws with a fixed stroke colour; this makes it follow the text colour.
const grIcon = "h-5 w-5 [&_path]:stroke-current";

const portfolioLinks = [
  { href: "/dashboard/portfolio", label: "Profile & Hero", icon: <MdPerson className="h-5 w-5" /> },
  { href: "/dashboard/portfolio/experience", label: "Experience", icon: <MdWorkHistory className="h-5 w-5" /> },
  { href: "/dashboard/portfolio/projects", label: "Case Studies", icon: <GrProjects className={grIcon} /> },
  { href: "/dashboard/portfolio/stack", label: "Stack", icon: <MdLayers className="h-5 w-5" /> },
  { href: "/dashboard/portfolio/practices", label: "Practices", icon: <MdRule className="h-5 w-5" /> },
  { href: "/dashboard/portfolio/credentials", label: "Credentials", icon: <MdSchool className="h-5 w-5" /> },
  { href: "/dashboard/security", label: "Security", icon: <MdSecurity className="h-5 w-5" /> },
];

const legacyLinks = [
  { href: "/dashboard/add-project", label: "Add Project", icon: <MdOutlineManageSearch className="h-5 w-5" /> },
  { href: "/dashboard/manage-projects", label: "Manage Project", icon: <GrProjects className={grIcon} /> },
  { href: "/dashboard/manage-skills", label: "Manage Skills", icon: <GiSkills className="h-5 w-5" /> },
  { href: "/dashboard/manage-qualifications", label: "Manage Qualifications", icon: <MdEqualizer className="h-5 w-5" /> },
  { href: "/dashboard/add-blog", label: "Add Blog", icon: <MdAddPhotoAlternate className="h-5 w-5" /> },
  { href: "/dashboard/manage-blogs", label: "Manage Blogs", icon: <MdManageHistory className="h-5 w-5" /> },
  { href: "/dashboard/manage-reviews", label: "Manage Reviews", icon: <MdOutlineReviews className="h-5 w-5" /> },
];

const heading = "px-4 pb-1 font-mono text-[0.65rem] uppercase tracking-[0.2em] text-base-content/50";

const SidebarItem = () => {
  const pathname = usePathname();

  const renderLinks = (links) =>
    links.map((link) => {
      const active = pathname === link.href;
      return (
        <Link key={link.href} href={link.href} aria-current={active ? "page" : undefined} className={linkCls(active)}>
          {link.icon}
          <span className="mx-4 font-medium">{link.label}</span>
        </Link>
      );
    });

  return (
    <nav aria-label="Dashboard">
      <p className={`${heading} pt-2`}>Home page</p>
      {renderLinks(portfolioLinks)}
      <p className={`${heading} pt-6`}>Legacy pages</p>
      {renderLinks(legacyLinks)}
    </nav>
  );
};

export default SidebarItem;
