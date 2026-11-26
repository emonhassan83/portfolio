"use client";

import { useEffect, useState } from "react";

/** Live local time for the owner's timezone. Renders a placeholder until mounted to avoid hydration mismatch. */
export default function Clock({ timezone = "Asia/Dhaka", label = "" }) {
  const [time, setTime] = useState(null);

  useEffect(() => {
    let fmt;
    try {
      fmt = new Intl.DateTimeFormat("en-GB", {
        timeZone: timezone,
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
      });
    } catch {
      return; // invalid timezone from the dashboard: keep the placeholder
    }
    const tick = () => setTime(fmt.format(new Date()));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [timezone]);

  return (
    <span>
      {label} <time suppressHydrationWarning>{time ?? "--:--:--"}</time>
    </span>
  );
}
