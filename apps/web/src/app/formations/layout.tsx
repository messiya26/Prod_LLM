import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Formations en ligne | Leadership, Worship, Developpement Personnel",
  description: "Decouvrez nos formations en ligne en leadership spirituel, worship, theologie et developpement personnel. Cours certifiants avec le Pasteur Lord Lombo et des formateurs d'excellence. Acces gratuit et premium.",
  keywords: ["formation en ligne", "cours leadership", "formation worship", "formation pastorale", "Lord Lombo cours", "e-learning chretien", "formation spirituelle en ligne", "certificat formation"],
  openGraph: {
    title: "Formations | Lord Lombo Ministries",
    description: "Formations d'excellence en leadership spirituel, worship et developpement personnel par Lord Lombo Ministries.",
    url: "https://lordlomboministries.com/formations",
    type: "website",
  },
};

export default function FormationsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
