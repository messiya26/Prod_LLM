import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Mentions l\u00e9gales | Lord Lombo Acad\u00e9mie",
};

export default function MentionsLegales() {
  return (
    <div className="py-16 md:py-24 px-6">
      <div className="max-w-3xl mx-auto prose-invert">
        <h1 className="text-3xl md:text-4xl font-bold text-cream mb-8">Mentions l\u00e9gales</h1>
        <div className="space-y-6 text-cream/70 text-sm leading-relaxed">
          <section>
            <h2 className="text-xl font-bold text-cream mb-3">\u00c9diteur du site</h2>
            <p>Lord Lombo Acad\u00e9mie<br />Si\u00e8ge social : Kinshasa, R\u00e9publique D\u00e9mocratique du Congo<br />Email : contact@lordlomboacademie.com</p>
          </section>
          <section>
            <h2 className="text-xl font-bold text-cream mb-3">H\u00e9bergement</h2>
            <p>Le site est h\u00e9berg\u00e9 par Vercel Inc., 440 N Bayard St #201, Wilmington, DE 19801, \u00c9tats-Unis.</p>
          </section>
          <section>
            <h2 className="text-xl font-bold text-cream mb-3">Propri\u00e9t\u00e9 intellectuelle</h2>
            <p>L&apos;ensemble du contenu de ce site (textes, images, vid\u00e9os, logos) est prot\u00e9g\u00e9 par le droit d&apos;auteur. Toute reproduction sans autorisation pr\u00e9alable est interdite.</p>
          </section>
        </div>
      </div>
    </div>
  );
}
