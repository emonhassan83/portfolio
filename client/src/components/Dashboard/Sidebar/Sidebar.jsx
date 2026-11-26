import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { HiOutlineMenuAlt2, HiX } from "react-icons/hi";
import { MdLogout, MdOpenInNew } from "react-icons/md";
import SidebarItem from "./SidebarItem";
import baseApi from "../../../redux/api/baseApi";
import { useGetMeQuery, useLogoutMutation } from "../../../redux/features/auth/authApi";
import { logout } from "../../../redux/features/auth/authSlice";

const initials = (name = "") =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join("") || "?";

const Brand = () => (
  <Link href="/dashboard/portfolio" className="flex items-center gap-2.5">
    <span className="h-2.5 w-2.5 bg-primary" aria-hidden="true" />
    <span className="font-mono text-xs uppercase tracking-[0.25em] text-base-content/80">dashboard</span>
  </Link>
);

/** Dashboard sidebar: fixed on desktop, a slide-in drawer on small screens. */
const Sidebar = () => {
  const { data } = useGetMeQuery();
  const user = data?.data;
  const router = useRouter();
  const pathname = usePathname();
  const dispatch = useDispatch();
  const [logoutRequest, { isLoading: loggingOut }] = useLogoutMutation();
  const [open, setOpen] = useState(false);

  // The drawer closes on navigation and with Escape.
  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const handleLogout = async () => {
    await logoutRequest();
    dispatch(logout());
    dispatch(baseApi.util.resetApiState());
    router.replace("/dashboard/login");
  };

  const footerLink =
    "flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm text-base-content/70 transition-colors duration-150";

  return (
    <>
      {/* Small screens: top bar */}
      <div className="sticky top-0 z-30 flex items-center justify-between border-b border-base-content/10 bg-base-200/95 px-4 py-3 backdrop-blur md:hidden">
        <Brand />
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label="Open menu"
          aria-expanded={open}
          aria-controls="dashboard-sidebar"
          className="rounded-md p-1.5 text-base-content/80 hover:bg-base-300 hover:text-primary"
        >
          <HiOutlineMenuAlt2 className="h-5 w-5" />
        </button>
      </div>

      {/* Small screens: backdrop */}
      <div
        aria-hidden="true"
        onClick={() => setOpen(false)}
        className={`fixed inset-0 z-40 bg-black/60 transition-opacity duration-200 md:hidden ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />

      <aside
        id="dashboard-sidebar"
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-base-content/10 bg-base-200 text-base-content transition-transform duration-200 ease-out md:z-10 md:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between px-5 pb-4 pt-5">
          <Brand />
          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-label="Close menu"
            className="rounded-md p-1 text-base-content/60 hover:bg-base-300 hover:text-base-content md:hidden"
          >
            <HiX className="h-5 w-5" />
          </button>
        </div>

        {/* Profile */}
        <div className="mx-3 mb-5 flex items-center gap-3 rounded-lg border border-base-content/10 bg-base-100/60 p-3">
          {user?.photoUrl ? (
            <img
              src={user.photoUrl}
              alt=""
              referrerPolicy="no-referrer"
              className="h-10 w-10 shrink-0 rounded-full object-cover ring-1 ring-base-content/15"
            />
          ) : (
            <span
              aria-hidden="true"
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/15 font-mono text-sm font-semibold text-primary"
            >
              {initials(user?.name)}
            </span>
          )}
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold">{user?.name || "…"}</p>
            <p className="truncate font-mono text-[0.7rem] text-base-content/55" title={user?.email}>
              {user?.email}
            </p>
            {user && (
              <p className="mt-1 flex items-center gap-1.5 font-mono text-[0.6rem] uppercase tracking-wider">
                <span className="text-base-content/50">{user.role}</span>
                <span className="text-base-content/25" aria-hidden="true">
                  /
                </span>
                <span className={user.twoFactorEnabled ? "text-success" : "text-warning"}>
                  2fa {user.twoFactorEnabled ? "on" : "off"}
                </span>
              </p>
            )}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-3 pb-4">
          <SidebarItem twoFactorEnabled={user?.twoFactorEnabled} onNavigate={() => setOpen(false)} />
        </div>

        <div className="space-y-0.5 border-t border-base-content/10 p-3">
          <a href="/" target="_blank" rel="noopener noreferrer" className={`${footerLink} hover:bg-base-300/70 hover:text-base-content`}>
            <MdOpenInNew className="h-[18px] w-[18px] text-base-content/50" />
            View site
            <span className="sr-only"> (opens in a new tab)</span>
          </a>
          <button
            type="button"
            onClick={handleLogout}
            disabled={loggingOut}
            className={`${footerLink} hover:bg-error/10 hover:text-error disabled:opacity-60`}
          >
            <MdLogout className="h-[18px] w-[18px]" />
            {loggingOut ? "Logging out…" : "Log out"}
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
