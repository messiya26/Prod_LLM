import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Conditions Generales de Vente",
  description: "CGV de Lord Lombo Ministries Academie. Conditions d'inscription, de paiement, d'acces aux formations et politique de remboursement.",
  robots: { index: true, follow: true },
};

export default function CGVLayout({ children }: { children: React.ReactNode }) {
  return children;
}
