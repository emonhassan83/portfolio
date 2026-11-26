"use client";

import { useEffect, useState } from "react";
import { terminal } from "../../data/portfolio";

const TYPE_MS = 38;
const PAUSE_MS = 420;

/**
 * Types each command, then prints its output. The server render shows the full
 * transcript, so it is readable without JS.
 */
export default function Terminal() {
  const full = terminal.map((t) => ({ cmd: t.cmd, typed: t.cmd, out: t.out, done: true }));
  const [lines, setLines] = useState(full);
  const [typing, setTyping] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const timers = [];
    const wait = (ms) => new Promise((r) => timers.push(setTimeout(r, ms)));

    (async () => {
      setTyping(true);
      setLines([]);
      for (let i = 0; i < terminal.length; i++) {
        const { cmd, out } = terminal[i];
        setLines((prev) => [...prev, { cmd, typed: "", out, done: false }]);
        for (let c = 1; c <= cmd.length; c++) {
          await wait(TYPE_MS);
          if (cancelled) return;
          setLines((prev) => prev.map((l, idx) => (idx === i ? { ...l, typed: cmd.slice(0, c) } : l)));
        }
        await wait(PAUSE_MS);
        if (cancelled) return;
        setLines((prev) => prev.map((l, idx) => (idx === i ? { ...l, done: true } : l)));
        await wait(PAUSE_MS);
      }
      if (!cancelled) setTyping(false);
    })();

    return () => {
      cancelled = true;
      timers.forEach(clearTimeout);
    };
  }, []);

  return (
    <div className="bk-card bk-term overflow-hidden" role="img" aria-label="Terminal showing a short introduction and tech stack">
      <div className="flex items-center justify-between border-b border-bk-line px-4 py-3">
        <div className="flex gap-1.5" aria-hidden="true">
          <span className="h-2.5 w-2.5 rounded-full bg-[var(--bk-line-strong)]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[var(--bk-line-strong)]" />
          <span className="h-2.5 w-2.5 rounded-full bg-bk-accent" />
        </div>
        <span className="bk-mono text-bk-dim">emon@prod: ~</span>
        <span className="bk-mono text-bk-dim">zsh</span>
      </div>
      <div aria-hidden="true" className="bk-mono min-h-[248px] space-y-3 p-4 text-[0.8rem] leading-relaxed sm:p-5">
        {lines.map((l, i) => (
          <div key={i}>
            <p className="text-bk-fg">
              <span className="bk-accent">➜</span> <span className="text-bk-muted">~</span> {l.typed}
              {!l.done && <span className="bk-caret" />}
            </p>
            {l.done &&
              l.out.map((o) => (
                <p key={o} className="pl-4 text-bk-muted">
                  {o}
                </p>
              ))}
          </div>
        ))}
        {!typing && (
          <p className="text-bk-fg">
            <span className="bk-accent">➜</span> <span className="text-bk-muted">~</span>
            <span className="bk-caret" />
          </p>
        )}
      </div>
    </div>
  );
}
