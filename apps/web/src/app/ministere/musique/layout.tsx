import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Musique & Albums | Lord Lombo — Emmanuel, Extr'aime, C.H.A",
  description: "Decouvrez la discographie du Pasteur Lord Lombo : Emmanuel (23M+ vues), Extr'aime, C.H.A et plus encore. Streaming, clips et concerts.",
  keywords: ["Lord Lombo musique", "Emmanuel Lord Lombo", "album Lord Lombo", "chantre congolais", "musique chretienne", "gospel RDC"],
  openGraph: {
    title: "Musique | Lord Lombo Ministries",
    description: "Discographie complete de Lord Lombo — Emmanuel, Extr'aime, C.H.A.",
    url: "https://lordlomboministries.com/ministere/musique",
  },
};

export default function MusiqueLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
