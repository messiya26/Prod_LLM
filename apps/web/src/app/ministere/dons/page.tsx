"use client";

import { useState } from "react";
import { FaHeart, FaHandHoldingHeart, FaGraduationCap, FaMusic, FaChurch, FaCheck, FaCreditCard, FaMobileAlt, FaPaypal, FaTimes, FaSeedling, FaPrayingHands, FaGlobe } from "react-icons/fa";

const amounts = [10, 25, 50, 100, 250, 500];

const projects = [
  { icon: "🎓", title: "Lord Lombo Academie", desc: "Formez la prochaine generation de leaders pastoraux et spirituels pour impacter l'Afrique et le monde.", goal: 50000, raised: 32000, color: "from-gold to-gold-light", borderColor: "border-gold/20 hover:border-gold/40", bgGlow: "bg-gold/[0.03]" },
  { icon: "🎵", title: "Prochain Album", desc: "Soutenez la production du nouvel album studio de Lord Lombo. Chaque note est une priere.", goal: 30000, raised: 18000, color: "from-purple-400 to-purple-500", borderColor: "border-purple-400/20 hover:border-purple-400/40", bgGlow: "bg-purple-400/[0.03]" },
  { icon: "⛪", title: "Missions Evangeliques", desc: "Financez des campagnes d'evangelisation dans les villages recules de la RDC et du Congo.", goal: 20000, raised: 12000, color: "from-emerald-400 to-emerald-500", borderColor: "border-emerald-400/20 hover:border-emerald-400/40", bgGlow: "bg-emerald-400/[0.03]" },
  { icon: "🌍", title: "Expansion Mondiale", desc: "Soutenez l'implantation du ministere dans de nouveaux pays. La vision est globale.", goal: 40000, raised: 22000, color: "from-blue-400 to-blue-500", borderColor: "border-blue-400/20 hover:border-blue-400/40", bgGlow: "bg-blue-400/[0.03]" },
];

const methods = [
  { icon: <FaCreditCard />, label: "Carte bancaire", desc: "Visa, Mastercard, 3D Secure", color: "bg-blue-500/10 text-blue-400", border: "border-blue-400/15 hover:border-blue-400/30 hover:bg-blue-400/5" },
  { icon: <FaMobileAlt />, label: "Mobile Money", desc: "MTN, Orange, Airtel, Wave", color: "bg-amber-500/10 text-amber-400", border: "border-amber-400/15 hover:border-amber-400/30 hover:bg-amber-400/5" },
  { icon: <FaPaypal />, label: "PayPal", desc: "Paiement securise", color: "bg-sky-500/10 text-sky-400", border: "border-sky-400/15 hover:border-sky-400/30 hover:bg-sky-400/5" },
];

const impactStats = [
  { icon: "🙏", value: "3 200+", label: "Donateurs actifs" },
  { icon: "🌍", value: "38", label: "Pays donateurs" },
  { icon: "📖", value: "100%", label: "Transparence" },
  { icon: "❤️", value: "∞", label: "Impact eternel" },
];

export default function Dons() {
  const [selected, setSelected] = useState(50);
  const [custom, setCustom] = useState("");
  const [recurring, setRecurring] = useState(1);
  const [selectedMethod, setSelectedMethod] = useState<number | null>(null);
  const [donationModal, setDonationModal] = useState(false);
  const [donationDone, setDonationDone] = useState(false);
  const [projectModal, setProjectModal] = useState<number | null>(null);

  const finalAmount = custom ? Number(custom) : selected;

  const handleDonate = () => {
    if (selectedMethod === null) return;
    setDonationModal(true);
    setDonationDone(false);
    setTimeout(() => setDonationDone(true), 2000);
  };

  const handleProjectDonate = (idx: number) => {
    setProjectModal(idx);
    setDonationDone(false);
  };

  const confirmProjectDonate = () => {
    setDonationDone(false);
    setTimeout(() => setDonationDone(true), 1500);
  };

  return (
    <>
      {/* Hero */}
      <section className="relative pt-28 pb-20 overflow-hidden hero-gradient">
        <div className="absolute inset-0">
          <div className="absolute top-1/3 left-1/4 w-80 h-80 bg-gold/[0.04] rounded-full blur-[100px]" />
          <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-rose-500/[0.03] rounded-full blur-[100px]" />
        </div>
        <div className="max-w-6xl mx-auto px-6 text-center relative">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-gold/20 to-rose-400/10 flex items-center justify-center mx-auto mb-6 ring-4 ring-gold/5 animate-pulse">
            <span className="text-3xl">🤲</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-serif font-bold text-cream mb-4">
            Soutenez la <span className="text-gradient-gold">vision</span>
          </h1>
          <p className="text-cream/40 max-w-2xl mx-auto text-sm mb-3">Chaque contribution, quelle que soit sa taille, a un impact eternel sur des vies a travers le monde</p>
          <p className="text-gold/60 italic text-sm font-serif max-w-lg mx-auto">&ldquo;Donnez, et il vous sera donne : on versera dans votre sein une bonne mesure, serree, secouee et qui deborde.&rdquo; — Luc 6:38</p>

          {/* Impact stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-10 max-w-3xl mx-auto">
            {impactStats.map((s, i) => (
              <div key={i} className="glass-card rounded-xl p-4 text-center hover:border-gold/15 transition-all">
                <span className="text-2xl block mb-1">{s.icon}</span>
                <div className="text-lg font-serif font-bold text-gradient-gold">{s.value}</div>
                <div className="text-cream/20 text-[10px] uppercase tracking-wider">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Donation Form */}
      <section className="py-16 px-6 -mt-8">
        <div className="max-w-4xl mx-auto">
          <div className="rounded-2xl glass-card p-8 md:p-12 relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-gold via-rose-400 to-purple-400" />

            {/* Toggle */}
            <div className="flex items-center gap-3 mb-8">
              <div className="flex rounded-full bg-cream/[0.04] p-0.5">
                {[{ label: "Don ponctuel", val: 0 }, { label: "Don mensuel", val: 1 }, { label: "Don annuel", val: 2 }].map((t) => (
                  <button key={t.val} onClick={() => setRecurring(t.val)} className={`px-5 py-2.5 rounded-full text-xs font-medium transition-all ${recurring === t.val ? "bg-gradient-to-r from-gold to-gold-light text-navy-deep shadow-lg shadow-gold/15" : "text-cream/30 hover:text-cream/50"}`}>{t.label}</button>
                ))}
              </div>
              {recurring > 0 && <span className="px-3 py-1 rounded-full bg-emerald-400/10 text-emerald-400 text-[10px] animate-pulse">🌱 Impact regulier</span>}
            </div>

            {/* Amounts */}
            <p className="text-cream/40 text-sm mb-4 flex items-center gap-2">💰 Choisissez un montant :</p>
            <div className="grid grid-cols-3 md:grid-cols-6 gap-3 mb-6">
              {amounts.map((a) => (
                <button key={a} onClick={() => { setSelected(a); setCustom(""); }} className={`py-3.5 rounded-xl text-sm font-bold transition-all relative overflow-hidden ${selected === a && !custom ? "bg-gradient-to-r from-gold to-gold-light text-navy-deep shadow-lg shadow-gold/20 scale-105" : "bg-cream/[0.03] text-cream/40 hover:text-gold hover:bg-gold/5 border border-cream/[0.06] hover:border-gold/20"}`}>
                  {a} $
                  {a === 100 && <span className="absolute -top-0.5 -right-0.5 px-1.5 py-0.5 rounded-bl-lg rounded-tr-lg bg-rose-500 text-white text-[7px] font-bold">Populaire</span>}
                </button>
              ))}
            </div>
            <div className="mb-8">
              <input type="number" placeholder="💎 Autre montant ($)" value={custom} onChange={(e) => { setCustom(e.target.value); setSelected(0); }} className="w-full px-5 py-3.5 rounded-xl bg-cream/[0.03] border border-cream/[0.06] text-cream text-sm focus:border-gold/30 focus:outline-none transition-colors placeholder:text-cream/20" />
            </div>

            {/* Payment methods */}
            <p className="text-cream/40 text-sm mb-4 flex items-center gap-2">💳 Mode de paiement :</p>
            <div className="grid md:grid-cols-3 gap-3 mb-8">
              {methods.map((m, i) => (
                <button key={i} onClick={() => setSelectedMethod(i)} className={`flex items-center gap-3 p-4 rounded-xl border transition-all text-left ${selectedMethod === i ? "border-gold/40 bg-gold/[0.06] ring-2 ring-gold/10" : m.border}`}>
                  <div className={`w-11 h-11 rounded-xl ${m.color} flex items-center justify-center text-lg`}>{m.icon}</div>
                  <div>
                    <div className="text-cream text-sm font-medium">{m.label}</div>
                    <div className="text-cream/20 text-[10px]">{m.desc}</div>
                  </div>
                  {selectedMethod === i && <FaCheck className="text-gold text-xs ml-auto" />}
                </button>
              ))}
            </div>

            {/* Submit */}
            <button onClick={handleDonate} disabled={selectedMethod === null} className={`w-full py-4 rounded-xl font-bold text-base flex items-center justify-center gap-3 transition-all ${selectedMethod !== null ? "bg-gradient-to-r from-gold to-gold-light text-navy-deep hover:shadow-xl hover:shadow-gold/25 hover:scale-[1.01] cursor-pointer" : "bg-cream/[0.05] text-cream/20 cursor-not-allowed"}`}>
              ❤️ Donner {finalAmount} $ {recurring === 1 ? "/ mois" : recurring === 2 ? "/ an" : ""}
            </button>

            <p className="text-cream/15 text-[10px] text-center mt-4">🔒 Paiement 100% securise &bull; Recu fiscal disponible sur demande</p>
          </div>
        </div>
      </section>

      {/* Donation Success Modal */}
      {donationModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-dark/80 backdrop-blur-sm" onClick={() => setDonationModal(false)}>
          <div className="w-full max-w-md rounded-2xl bg-[#0D1E33] border border-cream/[0.08] p-8 text-center animate-fade-in" onClick={(e) => e.stopPropagation()}>
            {!donationDone ? (
              <div className="py-8">
                <div className="w-12 h-12 border-4 border-gold/20 border-t-gold rounded-full animate-spin mx-auto mb-4" />
                <p className="text-cream/40 text-sm">Traitement de votre don...</p>
              </div>
            ) : (
              <>
                <div className="text-5xl mb-4">🎉</div>
                <div className="w-16 h-16 rounded-full bg-emerald-400/10 flex items-center justify-center mx-auto mb-4 ring-4 ring-emerald-400/10">
                  <FaCheck className="text-emerald-400 text-2xl" />
                </div>
                <h3 className="text-2xl font-serif font-bold text-cream mb-2">Merci pour votre generosite !</h3>
                <p className="text-cream/40 text-sm mb-2">Votre don de <span className="text-gold font-bold">{finalAmount} $</span> a ete recu avec succes.</p>
                <p className="text-cream/25 text-xs italic font-serif mb-6">&ldquo;Dieu aime celui qui donne avec joie.&rdquo; — 2 Corinthiens 9:7</p>
                <p className="text-cream/20 text-xs mb-6">Un recu vous sera envoye par email. Que Dieu vous benisse abondamment. 🙏</p>
                <button onClick={() => setDonationModal(false)} className="px-8 py-3 rounded-full bg-gradient-to-r from-gold to-gold-light text-navy-deep font-bold text-sm">Amen ! Fermer</button>
              </>
            )}
          </div>
        </div>
      )}

      {/* Verse Banner */}
      <section className="py-10 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="glass-card rounded-2xl p-8 relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-gold/30 to-transparent" />
            <span className="text-3xl block mb-3">📖</span>
            <blockquote className="text-cream/50 text-base md:text-lg font-serif italic leading-relaxed mb-3">
              &ldquo;Il y a plus de bonheur a donner qu&apos;a recevoir.&rdquo;
            </blockquote>
            <div className="text-gold text-xs font-medium">— Actes 20:35</div>
          </div>
        </div>
      </section>

      {/* Projects */}
      <section className="py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-3xl block mb-3">🎯</span>
            <h2 className="text-3xl font-serif font-bold text-cream mb-2">Soutenez un <span className="text-gradient-gold">projet specifique</span></h2>
            <p className="text-cream/25 text-sm">Choisissez le projet qui vous tient a coeur et voyez votre impact en temps reel</p>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {projects.map((p, i) => {
              const pct = Math.round((p.raised / p.goal) * 100);
              return (
                <div key={i} className={`rounded-2xl border ${p.borderColor} ${p.bgGlow} overflow-hidden transition-all group relative`}>
                  <div className={`h-1 bg-gradient-to-r ${p.color}`} />
                  <div className="p-7">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <span className="text-3xl">{p.icon}</span>
                        <div>
                          <h3 className="text-cream font-bold text-base group-hover:text-gold transition-colors">{p.title}</h3>
                          <p className="text-cream/25 text-xs leading-relaxed mt-1">{p.desc}</p>
                        </div>
                      </div>
                    </div>
                    <div className="mb-4">
                      <div className="flex justify-between text-xs mb-2">
                        <span className="text-gold font-bold text-base">{p.raised.toLocaleString()} $</span>
                        <span className="text-cream/20">objectif : {p.goal.toLocaleString()} $</span>
                      </div>
                      <div className="h-3 bg-cream/[0.05] rounded-full overflow-hidden relative">
                        <div style={{ width: `${pct}%` }} className={`h-full rounded-full bg-gradient-to-r ${p.color} transition-all duration-1000 relative`}>
                          <div className="absolute right-0 top-0 bottom-0 w-2 bg-white/30 rounded-full animate-pulse" />
                        </div>
                      </div>
                      <div className="flex justify-between mt-1.5">
                        <span className="text-cream/20 text-[10px]">{pct}% atteint</span>
                        <span className="text-cream/15 text-[10px]">{(p.goal - p.raised).toLocaleString()} $ restants</span>
                      </div>
                    </div>
                    <button onClick={() => handleProjectDonate(i)} className={`w-full py-3 rounded-xl bg-gradient-to-r ${p.color} text-white font-bold text-sm flex items-center justify-center gap-2 hover:shadow-lg transition-all hover:scale-[1.02]`}>
                      ❤️ Soutenir ce projet
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="text-center mt-8">
            <p className="text-cream/15 text-[10px] italic font-serif">&ldquo;Celui qui seme genereusement moissonnera aussi genereusement.&rdquo; — 2 Corinthiens 9:6 🌱</p>
          </div>
        </div>
      </section>

      {/* Project Donation Modal */}
      {projectModal !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-dark/80 backdrop-blur-sm" onClick={() => setProjectModal(null)}>
          <div className="w-full max-w-md rounded-2xl bg-[#0D1E33] border border-cream/[0.08] p-8 animate-fade-in" onClick={(e) => e.stopPropagation()}>
            <button onClick={() => setProjectModal(null)} className="absolute top-4 right-4 w-8 h-8 rounded-full bg-cream/[0.05] flex items-center justify-center text-cream/30 hover:text-cream"><FaTimes /></button>

            {donationDone ? (
              <div className="text-center py-4">
                <div className="text-5xl mb-4">🙏</div>
                <div className="w-16 h-16 rounded-full bg-emerald-400/10 flex items-center justify-center mx-auto mb-4 ring-4 ring-emerald-400/10"><FaCheck className="text-emerald-400 text-2xl" /></div>
                <h3 className="text-xl font-serif font-bold text-cream mb-2">Don recu pour {projects[projectModal].title} !</h3>
                <p className="text-cream/25 text-xs italic font-serif mb-6">&ldquo;Car la ou est votre tresor, la aussi sera votre coeur.&rdquo; — Matthieu 6:21</p>
                <button onClick={() => { setProjectModal(null); setDonationDone(false); }} className="px-8 py-3 rounded-full bg-gradient-to-r from-gold to-gold-light text-navy-deep font-bold text-sm">Amen !</button>
              </div>
            ) : (
              <>
                <div className="text-center mb-6">
                  <span className="text-4xl block mb-2">{projects[projectModal].icon}</span>
                  <h3 className="text-lg font-serif font-bold text-cream">{projects[projectModal].title}</h3>
                  <p className="text-cream/25 text-xs mt-1">{projects[projectModal].desc}</p>
                </div>
                <div className="grid grid-cols-3 gap-2 mb-5">
                  {[25, 50, 100].map((a) => (
                    <button key={a} onClick={() => { setSelected(a); setCustom(""); }} className={`py-3 rounded-xl text-sm font-bold transition-all ${selected === a && !custom ? `bg-gradient-to-r ${projects[projectModal].color} text-white shadow-lg` : "bg-cream/[0.03] text-cream/30 border border-cream/[0.06]"}`}>{a} $</button>
                  ))}
                </div>
                <input type="number" placeholder="Autre montant" value={custom} onChange={(e) => { setCustom(e.target.value); setSelected(0); }} className="w-full px-4 py-3 rounded-xl bg-cream/[0.03] border border-cream/[0.06] text-cream text-sm mb-5 focus:border-gold/30 focus:outline-none placeholder:text-cream/15" />
                <button onClick={confirmProjectDonate} className={`w-full py-3.5 rounded-xl bg-gradient-to-r ${projects[projectModal].color} text-white font-bold text-sm flex items-center justify-center gap-2 hover:shadow-lg transition-all`}>
                  ❤️ Donner {custom || selected} $ pour ce projet
                </button>
              </>
            )}
          </div>
        </div>
      )}

      {/* Why Give */}
      <section className="py-16 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-serif font-bold text-cream">Pourquoi <span className="text-gradient-gold">donner</span> ?</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-5">
            {[
              { emoji: "🌱", title: "Semez dans l'eternite", desc: "Votre don finance des formations, des albums et des missions qui touchent des generations. L'impact depasse le temps.", verse: "Galates 6:9" },
              { emoji: "🤝", title: "Transparence totale", desc: "100% des dons sont utilises pour les projets. Rapports financiers publics disponibles. Aucun frais cache.", verse: "Proverbes 11:1" },
              { emoji: "🌍", title: "Impact mondial", desc: "Votre generosite touche des vies dans plus de 50 pays. Chaque dollar compte dans l'avancement du Royaume.", verse: "Matthieu 28:19" },
            ].map((item, i) => (
              <div key={i} className="p-6 rounded-2xl glass-card hover:border-gold/15 transition-all text-center group">
                <span className="text-4xl block mb-4 group-hover:scale-110 transition-transform">{item.emoji}</span>
                <h3 className="text-cream font-bold text-sm mb-2">{item.title}</h3>
                <p className="text-cream/25 text-xs leading-relaxed mb-3">{item.desc}</p>
                <span className="text-gold/40 text-[10px] italic font-serif">{item.verse}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
