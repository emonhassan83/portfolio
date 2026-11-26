import { FiGithub, FiLinkedin, FiMail } from "react-icons/fi";
const rise = (ms) => ({ animationDelay: `${ms}ms` });

export default function Hero({ profile, links, heroFacts, ticker }) {
  const socials = [
    { label: "GitHub", href: links.github, Icon: FiGithub, external: true },
    { label: "LinkedIn", href: links.linkedin, Icon: FiLinkedin, external: true },
    { label: "Email", href: links.email, Icon: FiMail },
  ].filter((s) => s.href);

  return (
    <>
      <section id="hero" aria-labelledby="hero-title" className="bk-dotgrid relative border-b border-bk-line">
        <div className="bk-dotgrid-fade pointer-events-none absolute inset-0" aria-hidden="true" />

        <div className="relative mx-auto max-w-shell px-5 pb-16 pt-32 sm:px-8 lg:pt-40">
          <p
            className="bk-rise flex items-center gap-3 font-mono text-xs uppercase tracking-widest text-bk-muted"
            style={rise(100)}
          >
            <span className="bk-dot shrink-0" aria-hidden="true" />
            <span>
              sys.status: {profile.status} — {profile.locationShort} / remote
            </span>
          </p>

          <h1
            id="hero-title"
            className="bk-par-a mt-8 text-[clamp(3.2rem,11vw,8.5rem)] font-semibold leading-[0.95] tracking-tight"
          >
            <span className="bk-rise block" style={rise(200)}>
              {profile.firstName}
            </span>
            <span className="bk-rise bk-accent block italic" style={rise(300)}>
              {profile.lastName}
              <span className="not-italic text-bk-fg">.</span>
            </span>
          </h1>

          <div className="mt-10 grid items-end gap-10 lg:grid-cols-[1.2fr_1fr]">
            <div className="bk-rise" style={rise(450)}>
              <p className="bk-accent mb-4 font-mono text-sm">
                {profile.role} · {profile.roleLine}
              </p>
              <p className="max-w-xl text-lg leading-relaxed text-bk-muted">{profile.intro}</p>

              <div className="mt-8 flex flex-wrap items-center gap-4">
                <a href="#work" className="bk-btn bk-btn-primary">
                  View Work <span aria-hidden="true">↓</span>
                </a>
                <a href="#contact" className="bk-btn">
                  Get in Touch
                </a>
              </div>

              <ul className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3">
                {socials.map(({ label, href, Icon, external }) => (
                  <li key={label}>
                    <a
                      href={href}
                      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                      className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-bk-muted transition-colors hover:text-bk-accent-ink"
                    >
                      <Icon aria-hidden="true" className="h-3.5 w-3.5" />
                      {label} <span aria-hidden="true">↗</span>
                      {external && <span className="sr-only"> (opens in a new tab)</span>}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bk-par-b">
              <div className="bk-rise" style={rise(600)}>
                <p className="mb-1 border-b border-bk-line pb-2 font-mono text-[10px] uppercase tracking-[0.25em] text-bk-muted">
                  system facts — counted from source
                </p>
                <dl>
                  {heroFacts.map((f, i) => (
                    <div key={`${f.label}-${i}`} className="group flex items-baseline justify-between gap-6 border-b border-bk-line py-3">
                      <dt className="max-w-[16rem] text-right text-xs leading-snug text-bk-muted transition-colors group-hover:text-bk-fg">
                        {f.label}
                        {f.source ? ` — ${f.source}` : ""}
                      </dt>
                      <dd className="bk-accent order-first font-display text-3xl font-medium sm:text-4xl">{f.value}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="select-none overflow-hidden border-b border-bk-line py-3" aria-label="Core technologies">
        <ul className="bk-ticker-track whitespace-nowrap font-mono text-xs uppercase tracking-[0.2em] text-bk-muted">
          {[...ticker, ...ticker].map((t, i) => (
            <li
              key={`${t}-${i}`}
              aria-hidden={i >= ticker.length ? "true" : undefined}
              className="mx-3 inline-flex items-center gap-6"
            >
              {t}
              <span className="bk-accent" aria-hidden="true">
                ◆
              </span>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
