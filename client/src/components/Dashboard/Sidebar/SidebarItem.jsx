import Link from "next/link";
import { usePathname } from "next/navigation";
import { MdPerson, MdWorkHistory, MdLayers, MdRule, MdSchool, MdSecurity, MdOutlineMail } from "react-icons/md";
import { GrProjects } from "react-icons/gr";
import { useGetMessagesQuery } from "../../../redux/features/messageApi";

// GrProjects draws with a fixed stroke colour; this makes it follow the text colour.
const grIcon = "h-[18px] w-[18px] [&_path]:stroke-current";
const icon = "h-[18px] w-[18px]";

const groups = [
  {
    title: "Content",
    links: [
      { href: "/dashboard/portfolio", label: "Profile & Hero", icon: <MdPerson className={icon} /> },
      { href: "/dashboard/portfolio/experience", label: "Experience", icon: <MdWorkHistory className={icon} /> },
      { href: "/dashboard/portfolio/projects", label: "Case Studies", icon: <GrProjects className={grIcon} /> },
      { href: "/dashboard/portfolio/stack", label: "Stack", icon: <MdLayers className={icon} /> },
      { href: "/dashboard/portfolio/practices", label: "Practices", icon: <MdRule className={icon} /> },
      { href: "/dashboard/portfolio/credentials", label: "Credentials", icon: <MdSchool className={icon} /> },
    ],
  },
  {
    title: "Inbox",
    links: [{ href: "/dashboard/messages", label: "Messages", icon: <MdOutlineMail className={icon} />, key: "messages" }],
  },
  {
    title: "Account",
    links: [{ href: "/dashboard/security", label: "Security", icon: <MdSecurity className={icon} />, key: "security" }],
  },
];

/** Grouped dashboard navigation with an unread badge and a two-factor warning dot. */
const SidebarItem = ({ twoFactorEnabled, onNavigate }) => {
  const pathname = usePathname();
  // Unread count for the badge; refreshed every minute while the dashboard is open.
  const { data } = useGetMessagesQuery({ limit: "1" }, { pollingInterval: 60_000 });
  const unread = data?.meta?.counts?.new || 0;

  const extra = (key) => {
    if (key === "messages" && unread > 0) {
      return (
        <span className="ml-auto rounded bg-primary px-1.5 py-0.5 font-mono text-[0.65rem] font-semibold leading-none text-primary-content">
          {unread > 99 ? "99+" : unread}
          <span className="sr-only"> unread</span>
        </span>
      );
    }
    if (key === "security" && twoFactorEnabled === false) {
      return (
        <span className="ml-auto h-2 w-2 rounded-full bg-warning" title="Two-factor is off">
          <span className="sr-only">Two-factor is off</span>
        </span>
      );
    }
    return null;
  };

  return (
    <nav aria-label="Dashboard" className="space-y-6">
      {groups.map((group) => (
        <div key={group.title}>
          <p className="mb-2 px-3 font-mono text-[0.62rem] uppercase tracking-[0.22em] text-base-content/40">
            {group.title}
          </p>
          <ul className="space-y-0.5">
            {group.links.map((link) => {
              const active = pathname === link.href;
              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    onClick={onNavigate}
                    aria-current={active ? "page" : undefined}
                    className={`group relative flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors duration-150 ${
                      active
                        ? "bg-primary/10 font-medium text-primary"
                        : "text-base-content/70 hover:bg-base-300/70 hover:text-base-content"
                    }`}
                  >
                    {active && <span className="absolute inset-y-1.5 left-0 w-0.5 rounded-full bg-primary" aria-hidden="true" />}
                    <span className={active ? "" : "text-base-content/50 transition-colors group-hover:text-base-content/80"}>
                      {link.icon}
                    </span>
                    <span className="truncate">{link.label}</span>
                    {extra(link.key)}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </nav>
  );
};

export default SidebarItem;
