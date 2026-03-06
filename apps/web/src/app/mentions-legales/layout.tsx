import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Mentions Legales",
  description: "Mentions legales du site Lord Lombo Ministries. Informations sur l'editeur, l'hebergement, la propriete intellectuelle et la responsabilite.",
  robots: { index: true, follow: true },
};

export default function MentionsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
