import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Conditions G\u00e9n\u00e9rales de Vente | Lord Lombo Acad\u00e9mie",
};

export default function CGV() {
  return (
    <div className="py-16 md:py-24 px-6">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold text-cream mb-8">Conditions G\u00e9n\u00e9rales de Vente</h1>
        <div className="space-y-6 text-cream/70 text-sm leading-relaxed">
          <section>
            <h2 className="text-xl font-bold text-cream mb-3">Objet</h2>
            <p>Les pr\u00e9sentes CGV r\u00e9gissent la vente de formations musicales en ligne propos\u00e9es par Lord Lombo Acad\u00e9mie.</p>
          </section>
          <section>
            <h2 className="text-xl font-bold text-cream mb-3">Tarifs et paiement</h2>
            <p>Les prix sont indiqu\u00e9s en USD. Le paiement s&apos;effectue en ligne via les moyens de paiement accept\u00e9s (Mobile Money, carte bancaire).</p>
          </section>
          <section>
            <h2 className="text-xl font-bold text-cream mb-3">Acc\u00e8s aux formations</h2>
            <p>L&apos;acc\u00e8s est accord\u00e9 d\u00e8s confirmation du paiement et reste actif pour la dur\u00e9e de l&apos;abonnement souscrit.</p>
          </section>
          <section>
            <h2 className="text-xl font-bold text-cream mb-3">Droit de r\u00e9tractation</h2>
            <p>Conform\u00e9ment \u00e0 la r\u00e9glementation, vous disposez de 14 jours pour exercer votre droit de r\u00e9tractation \u00e0 compter de la date d&apos;achat.</p>
          </section>
        </div>
      </div>
    </div>
  );
}
