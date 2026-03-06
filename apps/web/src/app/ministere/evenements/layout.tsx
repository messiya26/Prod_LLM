import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Evenements & Concerts | Conferences, Crusades, Worship Nights",
  description: "Retrouvez tous les evenements de Lord Lombo Ministries : concerts, conferences, crusades, worship nights. Reservez vos places en ligne.",
  keywords: ["evenements Lord Lombo", "concert Lord Lombo", "conference spirituelle", "worship night", "crusade Kinshasa"],
  openGraph: {
    title: "Evenements | Lord Lombo Ministries",
    description: "Concerts, conferences et evenements de Lord Lombo Ministries.",
    url: "https://lordlomboministries.com/ministere/evenements",
  },
};

export default function EvenementsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
