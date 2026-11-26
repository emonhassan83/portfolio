"use client";

import { useRef, useState } from "react";
import ArchitectureDiagram from "./ArchitectureDiagram";

const legend = [
  { kind: "client", label: "client" },
  { kind: "edge", label: "edge / interface" },
  { kind: "service", label: "service" },
  { kind: "async", label: "async / jobs" },
  { kind: "data", label: "state" },
  { kind: "external", label: "third-party" },
];


const swatch = {
  client: "border-[var(--bk-muted)]",
  edge: "border-dashed border-[var(--bk-dim)]",
  service: "border-[var(--bk-accent-ink)] bg-[var(--bk-accent-soft)]",
  async: "border-[var(--bk-warn)]",
  data: "border-[var(--bk-fg)]",
  external: "border-[var(--bk-dim)]",
};

/** Tabbed explorer: one architecture diagram + request trace per system. */
export default function Architecture({ views, principles }) {
  const [active, setActive] = useState(0);
  const tabs = useRef([]);
  const view = views[active] || views[0];

  const onKey = (e) => {
    let next = null;
    if (e.key === "ArrowRight") next = (active + 1) % views.length;
    if (e.key === "ArrowLeft") next = (active - 1 + views.length) % views.length;
    if (e.key === "Home") next = 0;
    if (e.key === "End") next = views.length - 1;
    if (next !== null) {
      e.preventDefault();
      setActive(next);
      tabs.current[next]?.focus();
    }
  };

  return (
    <div className="bk-card overflow-hidden">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-bk-line px-4 py-3 sm:px-6">
        <div role="tablist" aria-label="Systems" className="flex flex-wrap gap-1" onKeyDown={onKey}>
          {views.map((v, i) => (
            <button
              key={v.key}
              ref={(el) => {
                tabs.current[i] = el;
              }}
              role="tab"
              type="button"
              id={`arch-tab-${v.key}`}
              aria-selected={active === i}
              aria-controls={`arch-panel-${v.key}`}
              tabIndex={active === i ? 0 : -1}
              onClick={() => setActive(i)}
              className={`bk-mono rounded-md px-3 py-2 transition-colors ${
                active === i ? "bg-bk-accent text-bk-on-accent" : "text-bk-muted hover:text-bk-fg"
              }`}
            >
              {v.label}
            </button>
          ))}
        </div>
        <span className="bk-mono hidden text-bk-dim sm:inline">← → to switch</span>
      </div>

      <div
        role="tabpanel"
        id={`arch-panel-${view.key}`}
        aria-labelledby={`arch-tab-${view.key}`}
        className="grid gap-8 p-4 sm:p-6 lg:grid-cols-[1fr_320px]"
      >
        <div className="min-w-0">
          <p className="bk-mono mb-4 text-bk-muted">{view.name}</p>
          <ArchitectureDiagram key={view.key} columns={view.architecture} title={view.name} />
          <ul className="mt-5 flex flex-wrap gap-x-4 gap-y-2" aria-label="Legend">
            {legend.map((l) => (
              <li key={l.kind} className="bk-mono flex items-center gap-2 text-bk-dim">
                <span className={`inline-block h-3 w-4 rounded-sm border ${swatch[l.kind]}`} aria-hidden="true" />
                {l.label}
              </li>
            ))}
          </ul>
        </div>

        <div className="border-t border-bk-line pt-6 lg:border-l lg:border-t-0 lg:pl-6 lg:pt-0">
          {view.flow ? (
            <>
              <p className="bk-mono mb-4 text-bk-dim">request.trace</p>
              <ol className="space-y-4">
                {view.flow.map((step, i) => (
                  <li key={i} className="flex gap-3 text-sm text-bk-muted">
                    <span className="bk-mono shrink-0 text-bk-accent-ink">{String(i + 1).padStart(2, "0")}</span>
                    <span>{step}</span>
                  </li>
                ))}
              </ol>
            </>
          ) : (
            <>
              <p className="bk-mono mb-4 text-bk-dim">principles</p>
              <ul className="space-y-4 text-sm text-bk-muted">
                {principles.map((p, i) => (
                  <li key={i}>{p}</li>
                ))}
              </ul>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
