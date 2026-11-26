"use client";

import { useEffect, useState } from "react";
import Section, { ExtLink } from "./ui/Section";
import Reveal from "./ui/Reveal";

/**
 * Live public repos from the GitHub API, with a static fallback when offline or rate-limited.
 * `children` is the server-rendered contribution heatmap, shown above the repo grid.
 */
export default function GitHub({ children, links, fallbackRepos, blurb }) {
  const API = `https://api.github.com/users/${encodeURIComponent(links.githubUser)}`;
  const [repos, setRepos] = useState(fallbackRepos);
  const [stats, setStats] = useState(null);
  const [live, setLive] = useState(false);

  useEffect(() => {
    const ctrl = new AbortController();
    Promise.all([
      fetch(API, { signal: ctrl.signal }).then((r) => (r.ok ? r.json() : Promise.reject(r.status))),
      fetch(`${API}/repos?per_page=100&sort=pushed`, { signal: ctrl.signal }).then((r) =>
        r.ok ? r.json() : Promise.reject(r.status)
      ),
    ])
      .then(([user, list]) => {
        const own = list.filter((r) => !r.fork && r.name !== links.githubUser);
        const languages = new Set(own.map((r) => r.language).filter(Boolean));
        setStats({ repos: user.public_repos, followers: user.followers, languages: languages.size });
        setRepos(own.slice(0, 6));
        setLive(true);
      })
      .catch(() => {
        /* keep fallback */
      });
    return () => ctrl.abort();
  }, [API, links.githubUser]);

  return (
    <Section id="github" index="08" title="GitHub" kicker={live ? "live · api.github.com" : `@${links.githubUser}`}>
      {children}
      <div className="grid gap-4 lg:grid-cols-12">
        <Reveal className="bk-card flex flex-col justify-between gap-6 p-6 lg:col-span-4">
          <div>
            <p className="bk-mono text-bk-dim">@{links.githubUser}</p>
            {blurb && <p className="mt-3 text-bk-muted">{blurb}</p>}
          </div>
          {stats && (
            <dl className="grid grid-cols-3 gap-3">
              {[
                ["repos", stats.repos],
                ["followers", stats.followers],
                ["languages", stats.languages],
              ].map(([k, v]) => (
                <div key={k}>
                  <dt className="bk-mono text-bk-dim">{k}</dt>
                  <dd className="font-display text-3xl font-semibold">{v}</dd>
                </div>
              ))}
            </dl>
          )}
          <ExtLink href={links.github} className="bk-btn self-start">
            Open profile
          </ExtLink>
        </Reveal>

        <ul className="grid gap-4 sm:grid-cols-2 lg:col-span-8">
          {repos.map((r, i) => (
            <Reveal as="li" key={r.name} delay={(i % 2) * 50}>
              <a
                href={r.html_url || `${links.github}/${r.name}`}
                target="_blank"
                rel="noopener noreferrer"
                className="bk-card bk-card-hover flex h-full flex-col p-5"
              >
                <span className="bk-mono flex items-center justify-between gap-3 text-bk-fg">
                  <span className="truncate">{r.name}</span>
                  <span aria-hidden="true" className="text-bk-dim">↗</span>
                </span>
                <span className="mt-2 line-clamp-2 text-sm text-bk-muted">{r.description || "No description yet."}</span>
                <span className="bk-mono mt-auto flex gap-4 pt-4 text-bk-dim">
                  {r.language && <span>{r.language}</span>}
                  {r.pushed_at && <span>updated {new Date(r.pushed_at).toLocaleDateString("en-GB", { month: "short", year: "numeric" })}</span>}
                </span>
                <span className="sr-only"> (opens in a new tab)</span>
              </a>
            </Reveal>
          ))}
        </ul>
      </div>
    </Section>
  );
}
