import Clock from "./Clock";

/** Fixed strip along the bottom edge: status, owner-local clock and version. */
export default function StatusBar({ profile, site }) {
  return (
    <div className="fixed inset-x-0 bottom-0 z-[35] border-t border-bk-line bg-[color-mix(in_srgb,var(--bk-bg)_90%,transparent)] backdrop-blur-md">
      <div className="mx-auto flex max-w-shell items-center justify-between px-5 py-2 font-mono text-[10px] uppercase tracking-[0.2em] text-bk-muted sm:px-8">
        <span className="flex items-center gap-2.5">
          <span className="bk-dot !h-1.5 !w-1.5" aria-hidden="true" />
          all systems operational
        </span>
        <span className="hidden tabular-nums sm:block">
          <Clock timezone={site.timezone} label={site.tzLabel} />
        </span>
        <span className="hidden md:block">
          {profile.firstName.toLowerCase()[0]}.{(profile.lastName || "").toLowerCase()} — portfolio{" "}
          <span className="bk-accent">{site.version}</span>
        </span>
      </div>
    </div>
  );
}
