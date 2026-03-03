"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { FaBookOpen, FaStar, FaDownload, FaShoppingCart, FaTimes, FaQuoteLeft, FaAmazon, FaBookReader, FaChevronRight, FaFeatherAlt, FaPenFancy, FaRegLightbulb, FaArrowRight } from "react-icons/fa";

const book = {
  title: "Les Tenebres de Dieu",
  subtitle: "Le Processus Qui Conduit A La Grandeur",
  desc: "Ouvrage phare de Lord Lombo explorant les saisons obscures de la vie comme des tremplins vers la grandeur divine. A travers des temoignages personnels et des enseignements bibliques profonds, decouvrez comment les epreuves, les echecs et les moments de doute sont en realite les instruments de Dieu pour forger des leaders d'exception.",
  formats: [
    { name: "Livre physique", icon: "📚", available: true },
    { name: "E-book PDF", icon: "📱", available: true },
    { name: "Kindle", icon: "📖", available: true },
    { name: "Audiobook", icon: "🎧", available: false },
  ],
  price: "25",
  rating: 4.9,
  reviews: 342,
  chapters: 18,
  pages: 280,
  amazonUrl: "https://www.amazon.fr/T%C3%A9n%C3%A8bres-Dieu-Processus-Conduit-Grandeur/dp/0692756914",
  extract: [
    { type: "chapter", title: "Chapitre 1 — L'Appel Dans l'Obscurite" },
    { type: "text", content: "Il y a des saisons dans la vie ou tout semble s'effondrer. Ou le ciel parait ferme. Ou les prieres semblent rebondir contre un mur invisible. C'est precisement dans ces moments que Dieu fait son oeuvre la plus profonde en nous." },
    { type: "text", content: "Je me souviens de cette nuit ou, seul dans ma chambre a Kinshasa, je pleurais sans comprendre pourquoi tout ce que j'avais bati semblait s'ecrouler. Mon ministere traversait une crise. Mes proches m'avaient abandonne. Ma sante declinait." },
    { type: "quote", content: "Les tenebres ne sont pas l'absence de Dieu, mais le lieu secret ou Il faconne les diamants.", author: "Lord Lombo" },
    { type: "text", content: "Pourtant, c'est dans cette obscurite que j'ai entendu Sa voix plus clairement que jamais. Pas une voix audible, mais une conviction profonde : 'Ce que tu traverses n'est pas une punition. C'est un processus. C'est Mon atelier.'" },
    { type: "text", content: "David a du fuir dans le desert. Joseph a ete jete dans une fosse. Moise a passe 40 ans dans l'anonymat. Chacun d'eux est passe par les tenebres avant d'atteindre la grandeur que Dieu leur avait destinee." },
    { type: "quote", content: "Car nos legeres afflictions du moment present produisent pour nous, au-dela de toute mesure, un poids eternel de gloire.", author: "2 Corinthiens 4:17" },
  ],
  testimonials: [
    { name: "Pasteur Jean-Marie K.", location: "Kinshasa, RDC", text: "Ce livre a transforme ma vision du ministere. J'ai compris que mes epreuves etaient en realite des promotions deguisees.", rating: 5 },
    { name: "Sandra M.", location: "Paris, France", text: "J'ai pleure a chaque chapitre. Lord Lombo ecrit avec une authenticite rare. Un livre que je recommande a tous ceux qui traversent des saisons difficiles.", rating: 5 },
    { name: "Rev. Patrick N.", location: "Brazzaville, Congo", text: "Un manuel de survie spirituelle. Les enseignements sont profonds mais accessibles. Je l'utilise maintenant comme outil de formation dans mon eglise.", rating: 5 },
  ],
};

const upcomingBooks = [
  {
    title: "Le Leadership Selon Le Coeur de Dieu",
    status: "En cours de redaction",
    year: "2026",
    progress: 65,
    desc: "Comment diriger avec integrite, compassion et la sagesse divine dans un monde en constante evolution.",
    color: "from-gold to-amber-400",
    icon: "👑",
    chapters: "12 chapitres prevus",
  },
  {
    title: "L'Art de la Predication Puissante",
    status: "Prevu",
    year: "2027",
    progress: 20,
    desc: "Les secrets d'une predication qui touche les coeurs, transforme les vies et glorifie Dieu.",
    color: "from-purple-400 to-pink-400",
    icon: "🔥",
    chapters: "15 chapitres prevus",
  },
  {
    title: "Batir un Ministere Impactant",
    status: "Prevu",
    year: "2027",
    progress: 10,
    desc: "De la vision a la realisation : guide pratique pour construire un ministere qui traverse les generations.",
    color: "from-emerald-400 to-teal-400",
    icon: "🏗️",
    chapters: "20 chapitres prevus",
  },
];

export default function Livres() {
  const [showExtract, setShowExtract] = useState(false);
  const [notifyEmail, setNotifyEmail] = useState("");
  const [notifyBook, setNotifyBook] = useState<number | null>(null);
  const [notified, setNotified] = useState(false);
  const [animatedStats, setAnimatedStats] = useState({ chapters: 0, pages: 0, rating: 0 });

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedStats({ chapters: book.chapters, pages: book.pages, rating: book.rating });
    }, 300);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      {/* Hero — immersive book showcase */}
      <section className="relative pt-24 pb-0 overflow-hidden">
        <div className="absolute inset-0 hero-gradient" />
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/3 w-[500px] h-[500px] bg-gold/[0.03] rounded-full blur-[120px]" />
          <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-purple-500/[0.02] rounded-full blur-[100px]" />
        </div>

        <div className="max-w-6xl mx-auto px-6 relative">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gold/[0.06] border border-gold/10 mb-6">
              <FaPenFancy className="text-gold text-xs" />
              <span className="text-gold text-xs font-medium tracking-wider uppercase">Livres & Publications</span>
              <FaPenFancy className="text-gold text-xs" />
            </div>
            <h1 className="text-4xl md:text-6xl font-serif font-bold text-cream mb-3">
              Des mots qui <span className="text-gradient-gold">transforment</span>
            </h1>
            <p className="text-cream/30 max-w-xl mx-auto text-sm">Chaque page est une rencontre avec la profondeur de Dieu. Chaque chapitre, une cle vers votre destinee.</p>
          </div>

          {/* Featured Book — cinematic layout */}
          <div className="relative rounded-3xl overflow-hidden glass-card border-gold/10">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-gold via-amber-300 to-gold" />
            <div className="grid lg:grid-cols-2 gap-0">
              {/* Book visual side */}
              <div className="relative p-8 lg:p-12 flex flex-col items-center justify-center min-h-[400px] lg:min-h-[550px]">
                <div className="absolute inset-0 bg-gradient-to-br from-navy via-[#0a1628] to-royal opacity-80" />
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(212,175,55,0.08),transparent_70%)]" />
                
                {/* Floating particles */}
                <div className="absolute top-10 left-10 w-2 h-2 bg-gold/20 rounded-full animate-pulse" />
                <div className="absolute top-20 right-16 w-1.5 h-1.5 bg-gold/15 rounded-full animate-pulse" style={{ animationDelay: "0.5s" }} />
                <div className="absolute bottom-16 left-20 w-1 h-1 bg-gold/25 rounded-full animate-pulse" style={{ animationDelay: "1s" }} />

                <div className="relative z-10 group">
                  {/* Book with 3D effect */}
                  <div className="relative" style={{ perspective: "1000px" }}>
                    <div className="transform transition-transform duration-700 group-hover:rotate-y-3" style={{ transformStyle: "preserve-3d" }}>
                      <div className="relative">
                        <div className="absolute -inset-6 bg-gradient-to-br from-gold/15 via-transparent to-gold/10 rounded-3xl blur-2xl group-hover:from-gold/25 transition-all duration-700" />
                        <Image src="/images/tenebres-de-dieu.png" alt="Les Tenebres de Dieu" width={240} height={340} className="relative w-56 md:w-64 h-auto rounded-xl shadow-2xl shadow-black/50 ring-1 ring-gold/10 group-hover:shadow-gold/20 transition-all duration-500" />
                        {/* Spine effect */}
                        <div className="absolute left-0 top-2 bottom-2 w-3 bg-gradient-to-r from-gold/20 to-transparent rounded-l-lg" />
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-center gap-1 mt-6 mb-2">
                    {[...Array(5)].map((_, j) => <FaStar key={j} className="text-gold text-sm drop-shadow-[0_0_3px_rgba(212,175,55,0.5)]" />)}
                  </div>
                  <p className="text-cream/30 text-xs text-center">{book.rating}/5 — {book.reviews} avis verifies</p>
                </div>
              </div>

              {/* Content side */}
              <div className="p-8 lg:p-12 flex flex-col justify-center">
                <div className="flex items-center gap-2 mb-3">
                  <span className="px-2.5 py-1 rounded-full bg-emerald-400/10 text-emerald-400 text-[10px] font-bold uppercase tracking-wider">Best-seller</span>
                  <span className="px-2.5 py-1 rounded-full bg-gold/10 text-gold text-[10px] font-bold uppercase tracking-wider">Disponible</span>
                </div>

                <h2 className="text-3xl md:text-4xl font-serif font-bold text-cream mb-2">{book.title}</h2>
                <p className="text-gold/70 text-sm italic font-serif mb-5">{book.subtitle}</p>
                <p className="text-cream/35 text-sm leading-relaxed mb-6">{book.desc}</p>

                {/* Animated stats */}
                <div className="grid grid-cols-3 gap-3 mb-6">
                  {[
                    { value: animatedStats.chapters, label: "Chapitres", suffix: "", icon: "📖" },
                    { value: animatedStats.pages, label: "Pages", suffix: "", icon: "📄" },
                    { value: animatedStats.rating, label: "Note", suffix: "/5", icon: "⭐" },
                  ].map((s, i) => (
                    <div key={i} className="p-4 rounded-xl bg-cream/[0.03] border border-cream/[0.06] text-center hover:border-gold/15 transition-all group/stat">
                      <span className="text-lg block mb-1 group-hover/stat:scale-110 transition-transform">{s.icon}</span>
                      <div className="text-2xl font-serif font-bold text-gold">{s.value}{s.suffix}</div>
                      <div className="text-cream/20 text-[10px] uppercase tracking-wider">{s.label}</div>
                    </div>
                  ))}
                </div>

                {/* Formats */}
                <div className="flex flex-wrap gap-2 mb-6">
                  {book.formats.map((f) => (
                    <span key={f.name} className={`px-3 py-2 rounded-xl text-xs flex items-center gap-1.5 transition-all ${f.available ? "bg-cream/[0.04] border border-cream/[0.08] text-cream/40 hover:border-gold/20 hover:text-gold cursor-pointer" : "bg-cream/[0.02] border border-cream/[0.04] text-cream/15 cursor-not-allowed"}`}>
                      <span>{f.icon}</span> {f.name}
                      {!f.available && <span className="text-[8px] text-amber-400/60">Bientot</span>}
                    </span>
                  ))}
                </div>

                {/* CTA buttons */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                  <a href={book.amazonUrl} target="_blank" rel="noopener noreferrer" className="flex-1 px-6 py-4 rounded-xl bg-gradient-to-r from-gold to-gold-light text-navy-deep font-bold text-sm flex items-center justify-center gap-2 hover:shadow-xl hover:shadow-gold/25 transition-all hover:scale-[1.02]">
                    <FaShoppingCart /> Acheter — {book.price} $
                  </a>
                  <button onClick={() => setShowExtract(true)} className="flex-1 px-6 py-4 rounded-xl border border-gold/20 text-gold text-sm font-medium flex items-center justify-center gap-2 hover:bg-gold/[0.06] hover:border-gold/40 transition-all hover:scale-[1.02]">
                    <FaBookReader /> Lire l'extrait gratuit
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Extract Modal — immersive reading */}
      {showExtract && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-dark/90 backdrop-blur-md" onClick={() => setShowExtract(false)}>
          <div className="w-full max-w-2xl max-h-[85vh] rounded-2xl bg-gradient-to-b from-[#0D1E33] to-[#091525] border border-cream/[0.08] overflow-hidden animate-fade-in" onClick={(e) => e.stopPropagation()}>
            {/* Modal header — book spine style */}
            <div className="relative p-6 pb-4 border-b border-cream/[0.06]">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-gold via-amber-300 to-gold" />
              <button onClick={() => setShowExtract(false)} className="absolute top-4 right-4 w-8 h-8 rounded-full bg-cream/[0.05] flex items-center justify-center text-cream/30 hover:text-cream hover:bg-cream/[0.1] transition-all"><FaTimes /></button>
              <div className="flex items-center gap-4">
                <div className="w-14 h-20 rounded-lg overflow-hidden ring-1 ring-gold/20 shadow-lg flex-shrink-0">
                  <Image src="/images/tenebres-de-dieu.png" alt="Cover" width={56} height={80} className="w-full h-full object-cover" />
                </div>
                <div>
                  <p className="text-cream/20 text-[10px] uppercase tracking-widest mb-1">Extrait gratuit</p>
                  <h3 className="text-lg font-serif font-bold text-cream">Les Tenebres de Dieu</h3>
                  <p className="text-gold/50 text-xs italic">par Lord Lombo</p>
                </div>
              </div>
            </div>

            {/* Reading content — elegant typography */}
            <div className="overflow-y-auto max-h-[60vh] p-6 md:p-8 space-y-5 custom-scrollbar">
              {book.extract.map((block, i) => {
                if (block.type === "chapter") return (
                  <div key={i} className="text-center py-4">
                    <div className="w-8 h-px bg-gold/30 mx-auto mb-4" />
                    <h4 className="text-gold font-serif font-bold text-lg tracking-wide">{block.title}</h4>
                    <div className="w-8 h-px bg-gold/30 mx-auto mt-4" />
                  </div>
                );
                if (block.type === "quote") return (
                  <div key={i} className="relative my-6 mx-4">
                    <div className="absolute -left-2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-gold/40 via-gold/20 to-transparent rounded-full" />
                    <FaQuoteLeft className="text-gold/20 text-xl mb-2 ml-3" />
                    <blockquote className="text-cream/60 italic font-serif text-base leading-relaxed pl-3">&ldquo;{block.content}&rdquo;</blockquote>
                    <p className="text-gold/40 text-xs font-medium mt-2 pl-3">— {block.author}</p>
                  </div>
                );
                return (
                  <p key={i} className="text-cream/40 text-sm leading-[1.85] font-light first-letter:text-2xl first-letter:font-serif first-letter:text-gold/60 first-letter:float-left first-letter:mr-1.5 first-letter:mt-0.5">{block.content}</p>
                );
              })}

              {/* End of extract */}
              <div className="text-center pt-6 pb-2">
                <div className="w-16 h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent mx-auto mb-6" />
                <p className="text-cream/20 text-xs mb-4">Fin de l'extrait gratuit</p>
                <p className="text-cream/30 text-sm mb-6 italic font-serif">&ldquo;Pour decouvrir la suite de ce voyage transformateur...&rdquo;</p>
                <a href={book.amazonUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-gradient-to-r from-gold to-gold-light text-navy-deep font-bold text-sm hover:shadow-xl hover:shadow-gold/25 transition-all hover:scale-105">
                  <FaAmazon /> Commander sur Amazon — {book.price} $
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Testimonials */}
      <section className="py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10">
            <span className="text-3xl block mb-3">💬</span>
            <h2 className="text-2xl font-serif font-bold text-cream">Ce que les lecteurs <span className="text-gradient-gold">en disent</span></h2>
          </div>
          <div className="grid md:grid-cols-3 gap-5">
            {book.testimonials.map((t, i) => (
              <div key={i} className="p-6 rounded-2xl glass-card hover:border-gold/15 transition-all relative group">
                <FaQuoteLeft className="text-gold/10 text-3xl absolute top-4 right-4 group-hover:text-gold/20 transition-all" />
                <div className="flex gap-0.5 mb-3">
                  {[...Array(t.rating)].map((_, j) => <FaStar key={j} className="text-gold text-xs" />)}
                </div>
                <p className="text-cream/40 text-sm leading-relaxed mb-4 italic">&ldquo;{t.text}&rdquo;</p>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gold/20 to-gold/5 flex items-center justify-center text-gold text-xs font-bold">{t.name.charAt(0)}</div>
                  <div>
                    <div className="text-cream text-xs font-medium">{t.name}</div>
                    <div className="text-cream/20 text-[10px]">{t.location}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Quote banner */}
      <section className="py-8 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="rounded-2xl relative overflow-hidden p-8 md:p-10 text-center" style={{ background: "linear-gradient(135deg, rgba(212,175,55,0.06) 0%, rgba(10,22,40,0.8) 50%, rgba(139,92,246,0.04) 100%)" }}>
            <div className="absolute inset-0 border border-gold/[0.08] rounded-2xl" />
            <FaFeatherAlt className="text-gold/20 text-2xl mx-auto mb-4" />
            <blockquote className="text-cream/50 text-lg md:text-xl font-serif italic leading-relaxed mb-3">
              &ldquo;Ecrire, c'est ouvrir une porte que Dieu a placee dans votre coeur pour que d'autres puissent y entrer et trouver la lumiere.&rdquo;
            </blockquote>
            <p className="text-gold/50 text-xs font-medium">— Lord Lombo</p>
          </div>
        </div>
      </section>

      {/* Upcoming books — creative timeline */}
      <section className="py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-3xl block mb-3">🚀</span>
            <h2 className="text-3xl font-serif font-bold text-cream mb-2">Prochaines <span className="text-gradient-gold">publications</span></h2>
            <p className="text-cream/25 text-sm">Des oeuvres en preparation qui continueront a impacter des vies</p>
          </div>

          <div className="space-y-5">
            {upcomingBooks.map((b, i) => (
              <div key={i} className="rounded-2xl glass-card overflow-hidden hover:border-gold/15 transition-all group">
                <div className={`h-1 bg-gradient-to-r ${b.color}`} />
                <div className="p-6 md:p-8">
                  <div className="flex flex-col md:flex-row md:items-center gap-5">
                    <div className="flex items-center gap-4 flex-1 min-w-0">
                      <div className="w-14 h-14 rounded-xl bg-cream/[0.04] border border-cream/[0.06] flex items-center justify-center text-2xl flex-shrink-0 group-hover:scale-110 transition-transform">{b.icon}</div>
                      <div className="min-w-0">
                        <h3 className="text-cream font-bold text-base group-hover:text-gold transition-colors">{b.title}</h3>
                        <p className="text-cream/25 text-xs leading-relaxed mt-1">{b.desc}</p>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2 flex-shrink-0">
                      <div className="flex items-center gap-2">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold bg-gradient-to-r ${b.color} text-white`}>{b.status}</span>
                        <span className="text-cream/20 text-xs">{b.year}</span>
                      </div>
                      <div className="w-40">
                        <div className="flex justify-between text-[10px] mb-1">
                          <span className="text-cream/20">{b.chapters}</span>
                          <span className="text-cream/30">{b.progress}%</span>
                        </div>
                        <div className="h-1.5 bg-cream/[0.05] rounded-full overflow-hidden">
                          <div style={{ width: `${b.progress}%` }} className={`h-full rounded-full bg-gradient-to-r ${b.color} transition-all duration-1000`} />
                        </div>
                      </div>
                      <button onClick={() => { setNotifyBook(i); setNotified(false); }} className="text-cream/25 text-[10px] hover:text-gold transition-colors flex items-center gap-1 mt-1">
                        <FaRegLightbulb className="text-[8px]" /> Me notifier a la sortie
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Notify modal */}
      {notifyBook !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-dark/80 backdrop-blur-sm" onClick={() => setNotifyBook(null)}>
          <div className="w-full max-w-sm rounded-2xl bg-[#0D1E33] border border-cream/[0.08] p-8 text-center animate-fade-in" onClick={(e) => e.stopPropagation()}>
            {notified ? (
              <>
                <span className="text-4xl block mb-3">🎉</span>
                <h3 className="text-lg font-serif font-bold text-cream mb-2">Vous serez notifie !</h3>
                <p className="text-cream/30 text-xs mb-5">Nous vous informerons des la sortie de <span className="text-gold">{upcomingBooks[notifyBook].title}</span></p>
                <button onClick={() => setNotifyBook(null)} className="px-6 py-2.5 rounded-full bg-gradient-to-r from-gold to-gold-light text-navy-deep font-bold text-sm">Parfait !</button>
              </>
            ) : (
              <>
                <span className="text-3xl block mb-3">{upcomingBooks[notifyBook].icon}</span>
                <h3 className="text-lg font-serif font-bold text-cream mb-1">{upcomingBooks[notifyBook].title}</h3>
                <p className="text-cream/25 text-xs mb-5">Recevez une notification des la sortie</p>
                <input type="email" placeholder="Votre email" value={notifyEmail} onChange={(e) => setNotifyEmail(e.target.value)} className="w-full px-4 py-3 rounded-xl bg-cream/[0.03] border border-cream/[0.06] text-cream text-sm mb-3 focus:border-gold/30 focus:outline-none placeholder:text-cream/15" />
                <button onClick={() => { if (notifyEmail) setNotified(true); }} className="w-full py-3 rounded-xl bg-gradient-to-r from-gold to-gold-light text-navy-deep font-bold text-sm flex items-center justify-center gap-2">
                  Me notifier <FaArrowRight className="text-xs" />
                </button>
              </>
            )}
          </div>
        </div>
      )}

      {/* CTA bottom */}
      <section className="py-12 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="rounded-2xl glass-card p-8 md:p-10 relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(212,175,55,0.04),transparent_60%)]" />
            <span className="text-3xl block mb-3 relative">📚</span>
            <h3 className="text-xl font-serif font-bold text-cream mb-2 relative">Procurez-vous votre exemplaire</h3>
            <p className="text-cream/25 text-xs mb-6 relative">Disponible en librairie, sur Amazon et en format numerique</p>
            <a href={book.amazonUrl} target="_blank" rel="noopener noreferrer" className="relative inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-gradient-to-r from-gold to-gold-light text-navy-deep font-bold text-sm hover:shadow-xl hover:shadow-gold/25 transition-all hover:scale-105">
              <FaAmazon /> Commander maintenant
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
