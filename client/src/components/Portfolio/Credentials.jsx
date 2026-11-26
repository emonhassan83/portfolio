import Section, { ExtLink } from "./ui/Section";
import Reveal from "./ui/Reveal";

function Entry({ item, label }) {
  return (
    <li className="grid gap-2 border-t border-bk-line py-5 first:border-t-0 first:pt-0 sm:grid-cols-[180px_1fr]">
      <p className="bk-mono text-bk-dim">{item.period}</p>
      <div>
        <h4 className="text-lg">
          {item.url ? (
            <ExtLink href={item.url} className="bk-link !text-bk-fg hover:!text-bk-accent-ink">
              {item.title}
            </ExtLink>
          ) : (
            item.title
          )}
        </h4>
        <p className="mt-1 text-bk-muted">{item.org}</p>
        {item.note && <p className="bk-mono mt-2 text-bk-dim">{label} — {item.note}</p>}
      </div>
    </li>
  );
}

export default function Credentials({ education, certifications }) {
  if (!education.length && !certifications.length) return null;

  return (
    <Section id="credentials" index="07" title="Education & Certifications">
      <div className="grid gap-4 lg:grid-cols-2">
        <Reveal className="bk-card p-6 sm:p-8">
          <h3 className="bk-mono mb-6 !font-mono text-sm font-normal text-bk-muted">certifications[]</h3>
          <ol>
            {certifications.map((c, i) => (
              <Entry key={`${c.title}-${i}`} item={c} label="covered" />
            ))}
          </ol>
        </Reveal>
        <Reveal delay={80} className="bk-card p-6 sm:p-8">
          <h3 className="bk-mono mb-6 !font-mono text-sm font-normal text-bk-muted">education[]</h3>
          <ol>
            {education.map((e, i) => (
              <Entry key={`${e.title}-${i}`} item={e} />
            ))}
          </ol>
        </Reveal>
      </div>
    </Section>
  );
}
