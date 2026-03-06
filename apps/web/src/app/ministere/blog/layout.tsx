import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blog | Actualites, Enseignements & Reflexions spirituelles",
  description: "Articles, enseignements et reflexions du Pasteur Lord Lombo et de l'equipe Lord Lombo Ministries. Leadership, foi, croissance spirituelle et impact social.",
  keywords: ["blog Lord Lombo", "articles spirituels", "enseignements chretiens", "leadership blog", "reflexions foi"],
  openGraph: {
    title: "Blog | Lord Lombo Ministries",
    description: "Enseignements, reflexions et actualites du ministere.",
    url: "https://lordlomboministries.com/ministere/blog",
  },
};

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
