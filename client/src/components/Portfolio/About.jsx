import Image from "next/image";
import profileImg from "../../assets/profile.png";
import Section, { Chip, ExtLink } from "./ui/Section";
import Reveal from "./ui/Reveal";

export default function About({ profile, links }) {
  const focus = profile.focusAreas || [];

  return (
    <Section id="about" index="01" title="About" kicker="whoami --verbose">
      <div className="grid gap-4 md:grid-cols-12">
        <Reveal className="bk-card p-6 sm:p-8 md:col-span-8">
          <p className="bk-mono mb-5 text-bk-dim">profile.md</p>
          <div className="space-y-4 text-lg leading-relaxed">
            {profile.about.map((p, i) => (
              <p key={i} className="text-bk-muted first:text-bk-fg">
                {p}
              </p>
            ))}
          </div>
        </Reveal>

        <Reveal delay={80} className="bk-card overflow-hidden md:col-span-4">
          <div className="relative aspect-[4/3] md:aspect-auto md:h-full md:min-h-[280px]">
            <Image
              src={profile.photo || profileImg}
              alt={`Portrait of ${profile.name}`}
              fill
              sizes="(min-width: 768px) 33vw, 100vw"
              className="object-cover object-top grayscale transition duration-500 hover:grayscale-0"
            />
            <div className="absolute inset-x-0 bottom-0 flex items-center justify-between bg-gradient-to-t from-black/80 to-transparent p-4">
              <span className="bk-mono text-[#ecece4]">{profile.name.toLowerCase()}</span>
              <span className="bk-mono flex items-center gap-2 text-[#c5f738]">
                <span className="bk-dot" aria-hidden="true" /> online
              </span>
            </div>
          </div>
        </Reveal>

        <Reveal delay={40} className="bk-card p-6 md:col-span-5">
          <p className="bk-mono mb-4 text-bk-dim">focus_areas[]</p>
          <ul className="flex flex-wrap gap-2">
            {focus.map((f) => (
              <li key={f}>
                <Chip accent>{f}</Chip>
              </li>
            ))}
          </ul>
        </Reveal>

        <Reveal delay={80} className="bk-card p-6 md:col-span-4">
          <p className="bk-mono mb-4 text-bk-dim">env</p>
          <dl className="bk-mono space-y-2 text-bk-muted">
            <div className="flex justify-between gap-4">
              <dt className="text-bk-dim">ROLE</dt>
              <dd className="text-right text-bk-fg">{profile.role.toLowerCase()}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-bk-dim">LOCATION</dt>
              <dd className="text-right text-bk-fg">{profile.location.toLowerCase()}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-bk-dim">WORK_MODE</dt>
              <dd className="text-right text-bk-fg">{profile.workMode}</dd>
            </div>
          </dl>
        </Reveal>

        <Reveal delay={120} className="bk-card flex flex-col justify-between gap-4 p-6 md:col-span-3">
          <p className="bk-mono text-bk-dim">artifacts</p>
          <div className="bk-mono flex flex-col gap-2">
            <a href={profile.resume} target="_blank" rel="noopener noreferrer" className="bk-link">
              resume.pdf <span aria-hidden="true">↗</span>
            </a>
            {links.github && <ExtLink href={links.github}>github</ExtLink>}
            {links.medium && <ExtLink href={links.medium}>writing</ExtLink>}
          </div>
        </Reveal>
      </div>
    </Section>
  );
}
