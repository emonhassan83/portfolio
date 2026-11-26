"use client";

import { useEffect } from "react";
import Lenis from "lenis";

/** Inertial smooth scrolling (desktop pointer devices only). Handles in-page #anchors with the sticky-nav offset. */
export default function SmoothScroll() {
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const fine = window.matchMedia("(pointer: fine)").matches;
    if (reduce || !fine) return;

    const lenis = new Lenis({
      lerp: 0.085, // continuous easing: glides to a stop instead of running a fixed-length tween per wheel tick
      wheelMultiplier: 0.9,
      smoothWheel: true,
      anchors: { offset: -72 },
    });
    document.documentElement.classList.add("bk-lenis");

    let raf = requestAnimationFrame(function loop(time) {
      lenis.raf(time);
      raf = requestAnimationFrame(loop);
    });

    return () => {
      cancelAnimationFrame(raf);
      lenis.destroy();
      document.documentElement.classList.remove("bk-lenis");
    };
  }, []);

  return null;
}
