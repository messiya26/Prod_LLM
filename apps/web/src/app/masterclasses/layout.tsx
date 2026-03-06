import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Masterclasses exclusives avec le Pasteur Lord Lombo",
  description: "Participez aux masterclasses exclusives du Pasteur Lord Lombo. Sessions intensives de 1 a 3 jours en leadership, worship, ecriture et ministere. Certificat de participation inclus.",
  keywords: ["masterclass Lord Lombo", "masterclass leadership", "masterclass worship", "formation intensive", "session live Lord Lombo"],
  openGraph: {
    title: "Masterclasses | Lord Lombo Ministries",
    description: "Masterclasses exclusives avec le Pasteur Lord Lombo — Leadership, Worship, Ecriture.",
    url: "https://lordlomboministries.com/masterclasses",
    type: "website",
  },
};

export default function MasterclassesLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
