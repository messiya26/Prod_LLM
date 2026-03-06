import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "FAQ - Questions Frequentes",
  description: "Trouvez les reponses a vos questions sur les formations, inscriptions, paiements, certificats et masterclasses de Lord Lombo Ministries Academie.",
  openGraph: {
    title: "FAQ | Lord Lombo Ministries",
    description: "Questions frequentes sur l'Academie Lord Lombo Ministries.",
  },
};

export default function FAQLayout({ children }: { children: React.ReactNode }) {
  return children;
}
