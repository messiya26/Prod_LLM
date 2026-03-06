import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tarifs & Formules d'abonnement | Decouverte, Essentiel, Premium",
  description: "Choisissez la formule qui vous convient : Decouverte (gratuit), Essentiel (29$/mois) ou Premium (79$/mois). Acces aux cours, masterclasses, certificats et mentorat personnalise.",
  keywords: ["tarif formation en ligne", "abonnement cours", "Lord Lombo academie prix", "formation gratuite", "cours premium"],
  openGraph: {
    title: "Tarifs | Lord Lombo Ministries",
    description: "Formules d'abonnement accessibles pour tous — de gratuit a premium.",
    url: "https://lordlomboministries.com/tarifs",
  },
};

export default function TarifsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
