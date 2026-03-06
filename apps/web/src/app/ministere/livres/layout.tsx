import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Livres & Publications | Les Tenebres de Dieu — Best-seller",
  description: "Procurez-vous les livres du Pasteur Lord Lombo dont le best-seller 'Les Tenebres de Dieu'. Extraits gratuits, format papier et numerique.",
  keywords: ["Les Tenebres de Dieu", "livre Lord Lombo", "publications chretiennes", "best-seller spirituel", "livres foi"],
  openGraph: {
    title: "Livres | Lord Lombo Ministries",
    description: "Les Tenebres de Dieu et autres publications du Pasteur Lord Lombo.",
    url: "https://lordlomboministries.com/ministere/livres",
  },
};

export default function LivresLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
