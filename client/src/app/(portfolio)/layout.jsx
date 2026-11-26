/* eslint-disable react-refresh/only-export-components -- Next.js metadata/viewport exports */
import { Fraunces, Archivo, JetBrains_Mono } from "next/font/google";
import "../../styles/portfolio.css";
import Navbar from "../../components/Portfolio/Navbar";
import Footer from "../../components/Portfolio/Footer";
import SmoothScroll from "../../components/Portfolio/motion/SmoothScroll";
import PointerFx from "../../components/Portfolio/motion/PointerFx";
import Mascot from "../../components/Portfolio/motion/Mascot";
import StatusBar from "../../components/Portfolio/StatusBar";
import { getPortfolio } from "../../lib/getPortfolio";

const display = Fraunces({ subsets: ["latin"], style: ["normal", "italic"], variable: "--font-display", display: "swap" });
const body = Archivo({ subsets: ["latin"], variable: "--font-body", display: "swap" });
const mono = JetBrains_Mono({ subsets: ["latin"], weight: ["400", "500"], variable: "--font-mono", display: "swap" });

export async function generateMetadata() {
  const { site, profile, links } = await getPortfolio();
  return {
    metadataBase: new URL(site.url),
    title: site.title,
    description: site.description,
    keywords: [
      "Backend Engineer", "Node.js", "TypeScript", "Express.js", "MongoDB", "PostgreSQL", "Prisma",
      "Redis", "BullMQ", "REST API", "GraphQL", "Docker", "AWS", "System Design", profile.name,
    ],
    authors: [{ name: profile.name, url: links.github }],
    alternates: { canonical: "/" },
    openGraph: {
      type: "website",
      url: "/",
      title: site.title,
      description: site.description,
      siteName: profile.name,
      locale: "en_US",
    },
    twitter: {
      card: "summary_large_image",
      title: site.title,
      description: site.description,
    },
    robots: { index: true, follow: true },
  };
}

export const viewport = {
  themeColor: "#0f0f0a",
};

// Apply the saved day/night preference before first paint
const themeScript = `try{var t=localStorage.getItem('bk-theme');if(t==='light'){document.documentElement.setAttribute('data-bk-theme','light')}}catch(e){}`;

export default async function PortfolioLayout({ children }) {
  const { site, profile, links, navItems } = await getPortfolio();
  const brand = { firstName: profile.firstName, lastName: profile.lastName, resume: profile.resume, photo: profile.photo };

  return (
    <div id="top" className={`bk pb-9 ${display.variable} ${body.variable} ${mono.variable}`}>
      <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      <a href="#main" className="bk-skip">
        Skip to content
      </a>
      <SmoothScroll />
      <PointerFx />
      <Mascot />
      <Navbar navItems={navItems} brand={brand} />
      <main id="main">{children}</main>
      <Footer navItems={navItems} profile={profile} links={links} />
      <StatusBar profile={profile} site={site} />
    </div>
  );
}
