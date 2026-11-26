"use client";

import { useEffect } from "react";

const EASE = 5; // higher = snappier parallax

/**
 * Pointer-driven CSS variables, no DOM of its own:
 *  - `--px` / `--py` (-1..1) on #hero for the headline, metrics and dot-grid parallax.
 *    The values glide towards the pointer instead of jumping to it.
 *  - `--sx` / `--sy` on the hovered `.bk-card` for its spotlight
 * Mouse/trackpad only. Runs for reduced motion too (owner's choice; the shift is a few pixels).
 */
export default function PointerFx() {
  useEffect(() => {
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    const hero = document.getElementById("hero");
    const goal = { x: 0, y: 0 };
    const cur = { x: 0, y: 0 };
    let raf = 0;
    let last = 0;

    // Runs only while the parallax is still catching up, then goes idle
    const glide = (now) => {
      const dt = Math.min((now - last) / 1000, 0.1);
      last = now;
      const k = 1 - Math.exp(-EASE * dt);
      cur.x += (goal.x - cur.x) * k;
      cur.y += (goal.y - cur.y) * k;
      hero.style.setProperty("--px", cur.x.toFixed(4));
      hero.style.setProperty("--py", cur.y.toFixed(4));
      raf = Math.abs(goal.x - cur.x) + Math.abs(goal.y - cur.y) > 0.001 ? requestAnimationFrame(glide) : 0;
    };

    const onMove = (e) => {
      if (hero && window.scrollY < hero.offsetHeight) {
        goal.x = (e.clientX / window.innerWidth) * 2 - 1;
        goal.y = (e.clientY / window.innerHeight) * 2 - 1;
        if (!raf) {
          last = performance.now();
          raf = requestAnimationFrame(glide);
        }
      }
      const card = e.target instanceof Element ? e.target.closest(".bk-card") : null;
      if (card) {
        const r = card.getBoundingClientRect();
        card.style.setProperty("--sx", `${e.clientX - r.left}px`);
        card.style.setProperty("--sy", `${e.clientY - r.top}px`);
      }
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  return null;
}
