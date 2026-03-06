import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Soutenez la Vision | Faire un don a Lord Lombo Ministries",
  description: "Participez a l'impact mondial de Lord Lombo Ministries. Vos dons soutiennent les formations, evenements, projets humanitaires et l'expansion du ministere dans 50+ pays.",
  keywords: ["don Lord Lombo", "soutenir ministere", "don en ligne", "faire un don chretien", "Lord Lombo Ministries don"],
  openGraph: {
    title: "Faire un don | Lord Lombo Ministries",
    description: "Soutenez la vision — chaque don fait la difference.",
    url: "https://lordlomboministries.com/ministere/dons",
  },
};

export default function DonsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
