/* eslint-disable react-refresh/only-export-components -- Next.js route segment config export */
import Hero from "../../components/Portfolio/Hero";
import About from "../../components/Portfolio/About";
import Experience from "../../components/Portfolio/Experience";
import Projects from "../../components/Portfolio/Projects";
import Architecture from "../../components/Portfolio/Architecture";
import Stack from "../../components/Portfolio/Stack";
import Practices from "../../components/Portfolio/Practices";
import Credentials from "../../components/Portfolio/Credentials";
import GitHub from "../../components/Portfolio/GitHub";
import Contributions from "../../components/Portfolio/Contributions";
import Contact from "../../components/Portfolio/Contact";
import Section from "../../components/Portfolio/ui/Section";
import Reveal from "../../components/Portfolio/ui/Reveal";
import { getPortfolio } from "../../lib/getPortfolio";

// Content is edited in the dashboard; the page is rebuilt at most every 60s,
// or immediately when the backend calls /api/revalidate.
export const revalidate = 60;

/** Serialisable views for the client-side architecture explorer. */
const architectureViews = (c) => [
  {
    key: "reference",
    label: "Reference",
    name: c.referenceArchitecture.name,
    architecture: c.referenceArchitecture.architecture,
    flow: null,
  },
  ...c.projects
    .filter((p) => p.architecture)
    .map((p) => ({
      key: p.slug,
      label: p.name,
      name: `${p.name} — ${p.category}`,
      architecture: p.architecture,
      flow: p.flow,
    })),
];

export default async function HomePage() {
  const c = await getPortfolio();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: c.profile.name,
    jobTitle: c.profile.role,
    url: c.site.url,
    email: `mailto:${c.profile.email}`,
    address: { "@type": "PostalAddress", addressLocality: c.profile.location },
    sameAs: [c.links.github, c.links.linkedin, c.links.medium].filter(Boolean),
    knowsAbout: c.stackGroups.flatMap((g) => g.items.map((i) => i.name)),
  };

  return (
    <>
      <script
        type="application/ld+json"
        // "<" is escaped so dashboard text can never close the script tag.
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />
      <Hero profile={c.profile} links={c.links} heroFacts={c.heroFacts} ticker={c.ticker} />
      <About profile={c.profile} links={c.links} />
      <Experience experience={c.experience} />
      <Projects projects={c.projects} email={c.profile.email} />
      <Section id="architecture" index="04" title="System Architecture" kicker="explore each system">
        <Reveal>
          <Architecture views={architectureViews(c)} principles={c.referenceArchitecture.principles || []} />
        </Reveal>
      </Section>
      <Stack stackGroups={c.stackGroups} />
      <Practices practices={c.practices} />
      <Credentials education={c.education} certifications={c.certifications} />
      <GitHub links={c.links} fallbackRepos={c.fallbackRepos} blurb={c.profile.githubBlurb}>
        <Contributions githubUser={c.links.githubUser} />
      </GitHub>
      <Contact profile={c.profile} links={c.links} />
    </>
  );
}
