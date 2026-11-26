import Section from "./ui/Section";
import Reveal from "./ui/Reveal";
import StackIcon from "./StackIcon";

export default function Stack({ stackGroups }) {
  if (!stackGroups.length) return null;
  const total = stackGroups.reduce((n, g) => n + g.items.length, 0);

  return (
    <Section id="stack" index="05" title="Stack Index" kicker={`${stackGroups.length} groups · ${total} entries`}>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {stackGroups.map((group, gi) => (
          <Reveal key={group.title} delay={gi * 50} className="bk-card bk-card-hover p-5">
            <div className="mb-5 flex items-baseline justify-between gap-4">
              <h3 className="text-lg">
                <span className="bk-mono mr-2 text-bk-dim">{String(gi + 1).padStart(2, "0")} /</span>
                {group.title}
              </h3>
              <span className="bk-mono shrink-0 text-bk-dim">{group.items.length} entries</span>
            </div>
            <ul className="grid grid-cols-2 gap-2">
              {group.items.map((item) => (
                <li
                  key={item.name}
                  className="bk-tile flex items-center gap-3 rounded-lg border border-bk-line bg-bk-bg px-3 py-2.5 transition-colors hover:border-[var(--bk-line-strong)]"
                >
                  <StackIcon icon={item.icon || undefined} mono={item.mono || undefined} name={item.name} />
                  <span className="truncate text-sm text-bk-fg">{item.name}</span>
                </li>
              ))}
            </ul>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
