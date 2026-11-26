import Section, { Chip, ExtLink } from "./ui/Section";
import Reveal from "./ui/Reveal";
import ArchitectureDiagram from "./ArchitectureDiagram";

const span = {
  lg: "lg:col-span-6",
  md: "lg:col-span-6",
  sm: "lg:col-span-3",
};

export default function Projects({ projects, email }) {
  if (!projects.length) return null;

  return (
    <Section id="work" index="03" title="Selected Work" kicker={`ls ./projects — ${projects.length} entries`}>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-12">
        {projects.map((p, i) => (
          <Reveal
            as="article"
            key={p.slug}
            delay={(i % 3) * 60}
            aria-labelledby={`${p.slug}-title`}
            className={`bk-card bk-card-hover flex flex-col p-5 sm:p-6 ${span[p.size] || span.sm} ${p.size !== "sm" ? "md:col-span-2" : ""}`}
          >
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="bk-mono text-bk-dim">{p.id}</span>
              {p.proprietary ? <Chip>proprietary system</Chip> : <Chip accent>case study</Chip>}
            </div>

            {p.architecture && (
              <div className="mt-5 hidden rounded-[10px] border border-bk-line bg-bk-bg p-3 sm:block" aria-hidden="true">
                <ArchitectureDiagram columns={p.architecture} title={p.name} compact />
              </div>
            )}

            <p className="bk-mono mt-5 text-bk-muted">{p.category}</p>
            <h3 id={`${p.slug}-title`} className="mt-2 text-2xl sm:text-3xl">
              {p.name}
            </h3>

            {p.summary ? (
              <p className="mt-3 text-bk-muted">{p.summary}</p>
            ) : (
              <p className="mt-3 text-bk-muted">
                Built under a client agreement, so the code is private. I can walk through the architecture on a call.
              </p>
            )}

            {p.role && <p className="bk-mono mt-4 text-bk-dim">role — {p.role}</p>}

            {p.highlights.length > 0 && (
              <details className="group mt-5 border-t border-bk-line pt-4">
                <summary className="bk-mono flex cursor-pointer list-none items-center justify-between text-bk-fg marker:hidden">
                  <span>engineering notes ({p.highlights.length})</span>
                  <span aria-hidden="true" className="text-bk-accent-ink transition-transform group-open:rotate-45">
                    +
                  </span>
                </summary>
                <ul className="mt-4 space-y-3">
                  {p.highlights.map((h, hi) => (
                    <li key={hi} className="flex gap-3 text-sm text-bk-muted">
                      <span className="bk-mono shrink-0 text-bk-dim">[{String(hi + 1).padStart(2, "0")}]</span>
                      <span>{h}</span>
                    </li>
                  ))}
                </ul>
              </details>
            )}

            <div className="mt-auto pt-6">
              {p.stack.length > 0 && (
                <ul className="flex flex-wrap gap-2" aria-label={`${p.name} technologies`}>
                  {p.stack.map((s) => (
                    <li key={s}>
                      <Chip>{s}</Chip>
                    </li>
                  ))}
                </ul>
              )}
              <div className="bk-mono mt-5 flex flex-wrap gap-x-5 gap-y-2">
                {p.links.map((l) => (
                  <ExtLink key={l.href} href={l.href} aria-label={`${p.name} ${l.label.toLowerCase()}`}>
                    {l.label}
                  </ExtLink>
                ))}
                {p.proprietary && (
                  <a href={`mailto:${email}?subject=${encodeURIComponent(`About ${p.name}`)}`} className="bk-link">
                    Ask about it <span aria-hidden="true">→</span>
                  </a>
                )}
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
