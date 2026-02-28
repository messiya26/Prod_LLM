import type { Metadata } from "next";
import { ConditionalLayout } from "@/components/layout/conditional-layout";
import { Providers } from "./providers";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Lord Lombo Academie | Transformation Spirituelle & Leadership",
    template: "%s | Lord Lombo Academie",
  },
  description:
    "Plateforme de formation en ligne dediee a la transformation spirituelle, au leadership et au developpement personnel par Lord Lombo.",
  keywords: [
    "Lord Lombo",
    "academie",
    "formation spirituelle",
    "leadership",
    "developpement personnel",
    "formation pastorale",
    "coaching",
  ],
  metadataBase: new URL("https://lordlomboacademie.com"),
  openGraph: {
    type: "website",
    locale: "fr_FR",
    siteName: "Lord Lombo Academie",
    title: "Lord Lombo Academie | Transformation Spirituelle & Leadership",
    description: "Formations d'excellence en leadership spirituel, developpement personnel et transformation de vie.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Lord Lombo Academie",
    description: "Formations d'excellence en leadership spirituel et transformation de vie.",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body className="antialiased min-h-screen flex flex-col">
        <Providers>
          <ConditionalLayout>{children}</ConditionalLayout>
        </Providers>
      </body>
    </html>
  );
}
