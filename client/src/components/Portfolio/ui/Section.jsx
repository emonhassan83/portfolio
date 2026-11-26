import Reveal from "./Reveal";
import ScrambleText from "../motion/ScrambleText";

/** Numbered section wrapper: "01 /" label, title, optional kicker and a fading rule. */
export default function Section({ id, index, title, kicker, children, className = "" }) {
  const headingId = `${id}-title`;
  return (
    <section id={id} aria-labelledby={headingId} className={`scroll-mt-20 py-20 md:py-28 ${className}`}>
      <div className="mx-auto max-w-shell px-5 sm:px-8">
        <Reveal className="mb-10 md:mb-14">
          <p className="bk-mono text-bk-dim">
            <ScrambleText text={`${index} / ${id}`} />
          </p>
          <div className="mt-2 flex flex-wrap items-end justify-between gap-x-6 gap-y-2">
            <h2 id={headingId} className="text-3xl sm:text-4xl md:text-5xl">
              {title}
            </h2>
            {kicker && (
              <p className="bk-mono text-bk-muted">
                <ScrambleText text={kicker} duration={900} />
              </p>
            )}
          </div>
          <div className="bk-rule mt-5" aria-hidden="true" />
        </Reveal>
        {children}
      </div>
    </section>
  );
}

export function Chip({ children, accent = false, className = "" }) {
  return <span className={`bk-chip ${accent ? "bk-chip-accent" : ""} ${className}`}>{children}</span>;
}

/** External link with ↗ that opens in a new tab safely. */
export function ExtLink({ href, children, className = "bk-link", ...rest }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className={className} {...rest}>
      {children}
      <span aria-hidden="true">↗</span>
      <span className="sr-only"> (opens in a new tab)</span>
    </a>
  );
}
