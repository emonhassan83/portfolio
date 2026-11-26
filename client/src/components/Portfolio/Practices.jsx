import Section from "./ui/Section";
import Reveal from "./ui/Reveal";

export default function Practices({ practices }) {
  if (!practices.length) return null;

  return (
    <Section id="practices" index="06" title="Engineering Practices" kicker="how the code stays maintainable">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {practices.map((p, i) => (
          <Reveal key={p.title} delay={(i % 3) * 60} className="bk-card bk-card-hover flex flex-col p-5 sm:p-6">
            <span className="bk-mono text-bk-dim">{String(i + 1).padStart(2, "0")}</span>
            <h3 className="mt-3 text-xl">{p.title}</h3>
            <p className="mt-2 text-sm text-bk-muted">{p.body}</p>
            {p.code && (
              <pre className="bk-mono mt-5 overflow-x-auto rounded-lg border border-bk-line bg-bk-bg p-3 text-[0.74rem] leading-relaxed text-bk-muted">
                <code>{p.code}</code>
              </pre>
            )}
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
