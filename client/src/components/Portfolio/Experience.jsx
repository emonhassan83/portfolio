import Section, { Chip, ExtLink } from "./ui/Section";
import Reveal from "./ui/Reveal";

export default function Experience({ experience }) {
  if (!experience.length) return null;

  return (
    <Section id="experience" index="02" title="Experience" kicker="tail -f career.log">
      <ol className="relative space-y-4">
        {experience.map((job, i) => (
          <Reveal as="li" key={job.id} delay={i * 60} className="bk-card p-6 sm:p-8">
            <div className="grid gap-6 md:grid-cols-[220px_1fr]">
              <div className="bk-mono space-y-3">
                <p className="text-bk-fg">{job.period}</p>
                <div className="flex flex-wrap gap-2">
                  {job.type && <Chip>{job.type}</Chip>}
                  {job.status && (
                    <Chip accent>
                      <span className="bk-dot !h-1.5 !w-1.5" aria-hidden="true" /> {job.status}
                    </Chip>
                  )}
                </div>
                <p className="text-bk-dim">{job.id}</p>
              </div>

              <div>
                <h3 className="text-xl sm:text-2xl">
                  {job.role} <span className="text-bk-dim">—</span>{" "}
                  {job.url ? (
                    <ExtLink href={job.url} className="bk-link !text-bk-fg hover:!text-bk-accent-ink">
                      {job.company}
                    </ExtLink>
                  ) : (
                    job.company
                  )}
                </h3>

                <ul className="mt-5 space-y-3">
                  {job.points.map((p, pi) => (
                    <li key={pi} className="flex gap-3 text-bk-muted">
                      <span className="bk-mono mt-[3px] shrink-0 text-bk-dim">[{String(pi + 1).padStart(2, "0")}]</span>
                      <span>{p}</span>
                    </li>
                  ))}
                </ul>

                <ul className="mt-6 flex flex-wrap gap-2" aria-label="Technologies used">
                  {job.stack.map((s) => (
                    <li key={s}>
                      <Chip>{s}</Chip>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </Reveal>
        ))}
      </ol>
    </Section>
  );
}
