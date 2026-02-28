import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Politique de confidentialit\u00e9 | Lord Lombo Acad\u00e9mie",
};

export default function PolitiqueConfidentialite() {
  return (
    <div className="py-16 md:py-24 px-6">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold text-cream mb-8">Politique de confidentialit\u00e9</h1>
        <div className="space-y-6 text-cream/70 text-sm leading-relaxed">
          <section>
            <h2 className="text-xl font-bold text-cream mb-3">Collecte des donn\u00e9es</h2>
            <p>Nous collectons uniquement les donn\u00e9es n\u00e9cessaires au fonctionnement de la plateforme : nom, email, donn\u00e9es de connexion et historique de formation.</p>
          </section>
          <section>
            <h2 className="text-xl font-bold text-cream mb-3">Utilisation</h2>
            <p>Vos donn\u00e9es sont utilis\u00e9es exclusivement pour la gestion de votre compte, la personnalisation de votre exp\u00e9rience et la communication li\u00e9e \u00e0 vos formations.</p>
          </section>
          <section>
            <h2 className="text-xl font-bold text-cream mb-3">S\u00e9curit\u00e9</h2>
            <p>Toutes les donn\u00e9es sont chiffr\u00e9es et stock\u00e9es de mani\u00e8re s\u00e9curis\u00e9e. Nous ne vendons ni ne partageons vos informations personnelles avec des tiers.</p>
          </section>
          <section>
            <h2 className="text-xl font-bold text-cream mb-3">Vos droits</h2>
            <p>Vous disposez d&apos;un droit d&apos;acc\u00e8s, de rectification et de suppression de vos donn\u00e9es. Contactez-nous \u00e0 contact@lordlomboacademie.com.</p>
          </section>
        </div>
      </div>
    </div>
  );
}
