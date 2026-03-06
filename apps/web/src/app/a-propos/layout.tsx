import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "A propos de Lord Lombo Ministries | Pasteur, Chantre, Visionnaire",
  description: "Decouvrez l'histoire du Pasteur Lord Lombo — fondateur de Lord Lombo Ministries, artiste international avec 377K+ abonnes YouTube et 115M+ vues. Pasteur, chantre, auteur best-seller et coach en leadership.",
  keywords: ["Lord Lombo biographie", "Lord Lombo Ministries", "pasteur Lord Lombo", "chantre congolais", "Emmanuel Lord Lombo", "Les Tenebres de Dieu"],
  openGraph: {
    title: "A propos | Lord Lombo Ministries",
    description: "Pasteur. Chantre. Visionnaire. Decouvrez l'histoire et la vision de Lord Lombo.",
    url: "https://lordlomboministries.com/a-propos",
    type: "profile",
  },
};

export default function AProposLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
