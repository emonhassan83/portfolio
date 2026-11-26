import Image from "next/image";
import profileImg from "../../assets/profile.png";
import Section from "./ui/Section";
import Reveal from "./ui/Reveal";
import ContactForm from "./ContactForm";

export default function Contact({ profile, links }) {
  const { contact = {} } = profile;
  const channels = [
    { key: "email", label: "send_email", href: links.email, external: false },
    { key: "linkedin", label: "linkedin", href: links.linkedin, external: true },
    { key: "github", label: "github", href: links.github, external: true },
    { key: "whatsapp", label: "whatsapp", href: links.whatsapp, external: true },
  ].filter((c) => c.href);

  return (
    <Section id="contact" index="09" title="Contact">
      <div className="grid gap-4 lg:grid-cols-12">
        <Reveal className="bk-card p-6 sm:p-8 lg:col-span-7">
          {contact.accepting && (
            <p className="bk-mono text-bk-muted">
              accepting: <span className="bk-accent">{contact.accepting}</span>
              <span className="text-bk-dim"> — remote or {profile.locationShort}</span>
            </p>
          )}
          <h3 className="mt-5 text-3xl sm:text-4xl">
            {contact.headline}
            <span className="bk-accent">.</span>
          </h3>
          <a href={links.email} className="bk-link mt-4 text-lg !text-bk-fg hover:!text-bk-accent-ink">
            {profile.email}
          </a>
          <div className="mt-8">
            <ContactForm />
          </div>
        </Reveal>

        <div className="grid gap-4 lg:col-span-5">
          <Reveal delay={80} className="bk-card flex items-center gap-4 p-5">
            <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-full border border-bk-line">
              <Image src={profile.photo || profileImg} alt="" fill sizes="64px" className="object-cover object-top" />
            </div>
            <div>
              <p className="text-bk-fg">that's me — say hi</p>
              <p className="bk-mono mt-1 flex items-center gap-2 text-bk-dim">
                <span className="bk-dot" aria-hidden="true" /> {contact.availability}
              </p>
            </div>
          </Reveal>

          <ul className="grid grid-cols-2 gap-4">
            {channels.map((c, i) => (
              <Reveal as="li" key={c.key} delay={100 + i * 40}>
                <a
                  href={c.href}
                  {...(c.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                  className="bk-card bk-card-hover group flex h-full min-h-[96px] flex-col justify-between p-4"
                >
                  <span className="bk-mono text-bk-dim">{String(i + 1).padStart(2, "0")}</span>
                  <span className="bk-mono flex items-center justify-between text-bk-fg group-hover:text-bk-accent-ink">
                    {c.label} <span aria-hidden="true">↗</span>
                  </span>
                  {c.external && <span className="sr-only"> (opens in a new tab)</span>}
                </a>
              </Reveal>
            ))}
          </ul>

          <Reveal delay={260} className="bk-card p-5">
            <p className="bk-mono text-bk-dim">location</p>
            <p className="mt-1 text-bk-fg">{profile.location} — open to remote</p>
            <a href={profile.resume} target="_blank" rel="noopener noreferrer" className="bk-link bk-mono mt-3">
              download resume.pdf <span aria-hidden="true">↗</span>
            </a>
          </Reveal>
        </div>
      </div>
    </Section>
  );
}
