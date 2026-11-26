"use client";

import { useState } from "react";

/** simpleicons.org logo with a monogram fallback if the slug is missing or the CDN fails. */
export default function StackIcon({ icon, mono, name }) {
  const [failed, setFailed] = useState(false);
  const label = mono || name.replace(/[^A-Za-z0-9]/g, "").slice(0, 2).toUpperCase();

  if (!icon || failed) {
    return (
      <span aria-hidden="true" className="bk-mono grid h-6 w-6 place-items-center text-[0.68rem] font-medium text-bk-accent-ink">
        {label}
      </span>
    );
  }

  return (
    <img
      src={`https://cdn.simpleicons.org/${icon}/9a9c84`}
      alt=""
      width={22}
      height={22}
      loading="lazy"
      decoding="async"
      onError={() => setFailed(true)}
      className="h-[22px] w-[22px]"
    />
  );
}
