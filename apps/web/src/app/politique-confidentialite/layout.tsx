import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Politique de Confidentialite - Protection des Donnees",
  description: "Politique de confidentialite et protection des donnees personnelles de Lord Lombo Ministries. Conforme RGPD et ISO 27001.",
  robots: { index: true, follow: true },
};

export default function PolitiqueLayout({ children }: { children: React.ReactNode }) {
  return children;
}
