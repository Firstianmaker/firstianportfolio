import type { Metadata, Viewport } from "next";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { getPortfolio } from "@/content/portfolio";
import { cvHref, displayProfile } from "@/content/presentation";
import { siteUrl } from "@/data/site";
import "../globals.css";
import "../portfolio-revision.css";
import { Inter, Oswald, JetBrains_Mono } from "next/font/google";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const oswald = Oswald({ subsets: ["latin"], variable: "--font-oswald", display: "swap" });
const mono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono", display: "swap" });

export async function generateMetadata(): Promise<Metadata> {
  const { profile } = await getPortfolio();
  return {
    metadataBase: new URL(siteUrl),
    title: {
      default: `${profile.name} — ${profile.role}`,
      template: `%s — ${profile.name}`,
    },
    description:
      `${profile.role} portfolio of ${profile.name}, featuring web, mobile, backend, and machine-learning projects.`,
    keywords: [
      profile.name,
      "Software Engineer",
      "Full-Stack Developer",
      "Android Developer",
      "Backend Developer",
      "Machine Learning",
      "Portfolio",
    ],
    authors: [{ name: profile.name }],
    creator: profile.name,
    alternates: {
      canonical: "/",
    },
    openGraph: {
      type: "website",
      title: `${profile.name} — ${profile.role}`,
      description: profile.intro,
      siteName: `${profile.name} Portfolio`,
      locale: "en_US",
    },
    twitter: {
      card: "summary_large_image",
      title: `${profile.name} — ${profile.role}`,
      description: profile.intro,
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  colorScheme: "dark",
  themeColor: "#02050E",
};

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const { profile } = await getPortfolio();
  return (
    <html lang="en" data-scroll-behavior="smooth" className={`${inter.variable} ${oswald.variable} ${mono.variable}`}>
      <body>
        <a
          href="#main-content"
          className="skip-link"
        >
          Skip to content
        </a>
        <Header name={profile.name} cvLink={cvHref(displayProfile(profile))} cvIndonesianLink={cvHref(profile, "id")} musicUrl={profile.musicUrl} />
        <main id="main-content">{children}</main>
        <Footer profile={profile} />
      </body>
    </html>
  );
}
