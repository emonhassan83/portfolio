export default function Footer({ navItems, profile, links }) {
  return (
    <footer className="border-t border-bk-line">
      <div className="mx-auto grid max-w-shell gap-8 px-5 py-12 sm:px-8 md:grid-cols-[1fr_auto]">
        <div className="space-y-2">
          <p className="font-display text-xl font-semibold">
            {profile.name}
            <span className="bk-accent">.</span>
          </p>
          <p className="bk-mono text-bk-muted">designed &amp; built by {profile.name.toLowerCase()}</p>
          <p className="bk-mono text-bk-dim">built with next.js — {profile.locationShort}</p>
        </div>

        <nav aria-label="Footer">
          <ul className="flex flex-wrap gap-x-5 gap-y-2">
            <li>
              <a href="#top" className="bk-link bk-mono">Intro</a>
            </li>
            {navItems.map((n) => (
              <li key={n.id}>
                <a href={`#${n.id}`} className="bk-link bk-mono">{n.label}</a>
              </li>
            ))}
            <li>
              <a href={links.github} target="_blank" rel="noopener noreferrer" className="bk-link bk-mono">
                GitHub ↗
              </a>
            </li>
            <li>
              <a href="#top" className="bk-link bk-mono">↑ top</a>
            </li>
          </ul>
        </nav>
      </div>
    </footer>
  );
}
