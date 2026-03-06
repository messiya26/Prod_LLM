import type { Metadata } from "next";
import { ConditionalLayout } from "@/components/layout/conditional-layout";
import { GoogleAnalytics } from "@/components/analytics/google-analytics";
import { Providers } from "./providers";
import "./globals.css";

const SITE_URL = "https://lordlomboministries.com";
const SITE_NAME = "Lord Lombo Ministries";
const SITE_DESC = "Plateforme officielle de Lord Lombo Ministries — Academie de formation en leadership spirituel, worship, developpement personnel. Cours en ligne, masterclasses, certificats, sessions live avec le Pasteur Lord Lombo.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Lord Lombo Ministries | Academie de Formation Spirituelle & Leadership",
    template: "%s | Lord Lombo Ministries",
  },
  description: SITE_DESC,
  keywords: [
    "Lord Lombo", "Lord Lombo Ministries", "Lord Lombo Academie",
    "lord lombo", "lord lombo ministries", "lord lombo academie",
    "Pasteur Lord Lombo", "pasteur lord lombo",
    "formation spirituelle", "leadership chretien", "cours en ligne",
    "masterclass", "worship", "louange", "developpement personnel",
    "formation pastorale", "coaching spirituel", "certificat",
    "e-learning", "formation biblique", "ministere", "Kinshasa",
    "RD Congo", "Afrique", "formation en ligne gratuite",
    "Lord Lombo musique", "Emmanuel Lord Lombo",
    "Les Tenebres de Dieu", "formation leadership",
    "lord lombo formation", "lord lombo cours",
    "lord lombo worship", "lord lombo louange",
    "academie lord lombo", "lordlomboministries",
    "formation chretienne en ligne", "ecole biblique en ligne",
    "formation gospel", "lord lombo live", "lord lombo masterclass",
  ],
  authors: [{ name: "Lord Lombo Ministries", url: SITE_URL }],
  creator: "Messiya Group",
  publisher: "Lord Lombo Ministries",
  formatDetection: { email: false, telephone: false },
  alternates: {
    canonical: SITE_URL,
    languages: { "fr-FR": SITE_URL, "en-US": `${SITE_URL}/en` },
  },
  openGraph: {
    type: "website",
    locale: "fr_FR",
    alternateLocale: ["en_US"],
    url: SITE_URL,
    siteName: SITE_NAME,
    title: "Lord Lombo Ministries | Academie de Formation & Leadership Spirituel",
    description: SITE_DESC,
    images: [
      {
        url: `${SITE_URL}/images/og-image.jpg`,
        width: 1200,
        height: 630,
        alt: "Lord Lombo Ministries - Academie de Formation",
        type: "image/jpeg",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Lord Lombo Ministries | Academie de Formation Spirituelle",
    description: "Formations d'excellence en leadership spirituel, worship et transformation de vie par le Pasteur Lord Lombo.",
    images: [`${SITE_URL}/images/og-image.jpg`],
    creator: "@lordlombo",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "X9Yv90W5k8dFtmRqJe2gb0AmDi4mGUk-ywsT1j3m9nA",
  },
  category: "education",
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${SITE_URL}/#organization`,
      name: "Lord Lombo Ministries",
      url: SITE_URL,
      logo: {
        "@type": "ImageObject",
        url: `${SITE_URL}/images/logo-llm-official.jpeg`,
        width: 200,
        height: 200,
      },
      sameAs: [
        "https://www.youtube.com/@LordLomboOfficial",
        "https://web.facebook.com/LordLombo",
        "https://www.instagram.com/lordlombo",
        "https://open.spotify.com/artist/7LYWtUyWFb2GIE5sjigMvX",
      ],
      contactPoint: {
        "@type": "ContactPoint",
        contactType: "customer service",
        availableLanguage: ["French", "English"],
      },
    },
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      url: SITE_URL,
      name: SITE_NAME,
      description: SITE_DESC,
      publisher: { "@id": `${SITE_URL}/#organization` },
      potentialAction: {
        "@type": "SearchAction",
        target: {
          "@type": "EntryPoint",
          urlTemplate: `${SITE_URL}/formations?q={search_term_string}`,
        },
        "query-input": "required name=search_term_string",
      },
      inLanguage: ["fr-FR", "en-US"],
    },
    {
      "@type": "EducationalOrganization",
      "@id": `${SITE_URL}/#school`,
      name: "Lord Lombo Academie",
      url: `${SITE_URL}/formations`,
      parentOrganization: { "@id": `${SITE_URL}/#organization` },
      description: "Academie de formation en leadership spirituel, worship et developpement personnel fondee par le Pasteur Lord Lombo.",
      areaServed: "Worldwide",
      availableLanguage: ["French", "English"],
    },
    {
      "@type": "Person",
      "@id": `${SITE_URL}/#person`,
      name: "Lord Lombo",
      jobTitle: "Pasteur, Chantre, Auteur, Fondateur",
      url: `${SITE_URL}/a-propos`,
      sameAs: [
        "https://www.youtube.com/@LordLomboOfficial",
        "https://web.facebook.com/LordLombo",
        "https://open.spotify.com/artist/7LYWtUyWFb2GIE5sjigMvX",
      ],
      worksFor: { "@id": `${SITE_URL}/#organization` },
    },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <head>
        <link rel="canonical" href={SITE_URL} />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/images/logo-llm-official.jpeg" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#d4af37" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="mobile-web-app-capable" content="yes" />
        <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
        <link rel="dns-prefetch" href="https://fonts.gstatic.com" />
        <link rel="dns-prefetch" href="https://prod-llm.onrender.com" />
        <link rel="preconnect" href="https://fonts.googleapis.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://prod-llm.onrender.com" crossOrigin="anonymous" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="antialiased min-h-screen flex flex-col">
        <GoogleAnalytics />
        <Providers>
          <ConditionalLayout>{children}</ConditionalLayout>
        </Providers>
      </body>
    </html>
  );
}
