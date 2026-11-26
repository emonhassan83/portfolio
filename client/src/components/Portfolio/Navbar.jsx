"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import profileImg from "../../assets/profile.png";
import ThemeToggle from "./ThemeToggle";

const num = (i) => `${String(i + 1).padStart(2, "0")}.`;

export default function Navbar({ navItems, brand }) {
  const profile = brand;
  const railItems = [{ id: "top", label: "Intro" }, ...navItems];
  const [active, setActive] = useState("");
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Scroll-spy: highlight the section currently crossing the upper third of the viewport
  useEffect(() => {
    const sections = navItems.map((n) => document.getElementById(n.id)).filter(Boolean);
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(e.target.id);
        });
      },
      { rootMargin: "-35% 0px -60% 0px" }
    );
    sections.forEach((s) => io.observe(s));

    const onScroll = () => {
      setScrolled(window.scrollY > 12);
      if (window.scrollY < 200) setActive(""); // back in the hero
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      io.disconnect();
      window.removeEventListener("scroll", onScroll);
    };
  }, [navItems]);

  // Close the mobile menu with Escape
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 border-b transition-colors duration-300 ${
          scrolled || open
            ? "border-bk-line bg-[color-mix(in_srgb,var(--bk-bg)_90%,transparent)] backdrop-blur-md"
            : "border-transparent"
        }`}
      >
        <nav aria-label="Primary" className="mx-auto flex max-w-shell items-center justify-between px-5 py-4 sm:px-8">
          <a
            href="#top"
            className="flex items-center gap-3 text-lg font-semibold tracking-tight text-bk-fg transition-colors hover:text-bk-accent-ink"
          >
            <span className="relative h-8 w-8 overflow-hidden border border-bk-line">
              <Image src={profile.photo || profileImg} alt="" fill sizes="32px" className="object-cover object-top" />
            </span>
            <span className="font-display">
              {profile.firstName[0]}.{profile.lastName}
              <span className="bk-accent">—</span>
            </span>
          </a>

          <ul className="hidden items-center gap-6 lg:flex">
            {navItems.map((item, i) => (
              <li key={item.id}>
                <a
                  href={`#${item.id}`}
                  aria-current={active === item.id ? "true" : undefined}
                  className={`font-mono text-xs uppercase tracking-widest transition-colors ${
                    active === item.id ? "text-bk-accent-ink" : "text-bk-muted hover:text-bk-accent-ink"
                  }`}
                >
                  <span className="bk-accent">{num(i)}</span> {item.label}
                </a>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-2">
            <ThemeToggle />
            <a
              href={profile.resume}
              target="_blank"
              rel="noopener noreferrer"
              className="bk-btn bk-btn-primary hidden !min-h-[38px] !px-4 !text-xs !tracking-widest sm:inline-flex"
            >
              Resume <span aria-hidden="true">↗</span>
            </a>
            <button
              type="button"
              className="bk-btn !min-h-[38px] !px-3 !text-xs !tracking-widest lg:hidden"
              aria-expanded={open}
              aria-controls="bk-mobile-menu"
              onClick={() => setOpen((v) => !v)}
            >
              <span className="sr-only">{open ? "Close menu" : "Open menu"}</span>
              <span aria-hidden="true">{open ? "close" : "menu"}</span>
            </button>
          </div>
        </nav>

        {open && (
          <div id="bk-mobile-menu" className="border-t border-bk-line bg-bk-bg lg:hidden">
            <ul className="mx-auto max-w-shell px-5 py-3 sm:px-8">
              {navItems.map((item, i) => (
                <li key={item.id}>
                  <a
                    href={`#${item.id}`}
                    onClick={() => setOpen(false)}
                    className="flex items-center justify-between border-b border-bk-line py-3 font-mono text-sm uppercase tracking-widest text-bk-muted"
                  >
                    <span>
                      <span className="bk-accent">{num(i)}</span> {item.label}
                    </span>
                    <span aria-hidden="true" className="text-bk-dim">
                      →
                    </span>
                  </a>
                </li>
              ))}
              <li className="pt-4 sm:hidden">
                <a href={profile.resume} target="_blank" rel="noopener noreferrer" className="bk-btn bk-btn-primary w-full">
                  Resume <span aria-hidden="true">↗</span>
                </a>
              </li>
            </ul>
          </div>
        )}
      </header>

      {/* Section rail: only where there is room beside the content column */}
      <nav
        aria-label="Section navigation"
        className="fixed right-6 top-1/2 z-40 hidden -translate-y-1/2 flex-col items-end gap-4 min-[1440px]:flex"
      >
        {railItems.map((item) => {
          const on = item.id === "top" ? !active : active === item.id;
          return (
            <a key={item.id} href={`#${item.id}`} className="group flex items-center gap-3">
              <span
                className={`border px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.2em] transition-opacity duration-200 ${
                  on
                    ? "border-bk-accent-ink text-bk-accent-ink opacity-100"
                    : "border-bk-line text-bk-muted opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100"
                }`}
              >
                {item.label}
              </span>
              <span
                aria-hidden="true"
                className={`h-2 w-2 border transition-colors duration-200 ${
                  on ? "border-bk-accent-ink bg-bk-accent" : "border-bk-muted group-hover:border-bk-accent-ink"
                }`}
              />
            </a>
          );
        })}
      </nav>
    </>
  );
}
