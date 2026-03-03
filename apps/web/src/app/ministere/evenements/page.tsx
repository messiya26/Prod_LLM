"use client";

import { useState } from "react";
import Image from "next/image";
import { FaCalendarAlt, FaMapMarkerAlt, FaUsers, FaTicketAlt, FaPlay, FaVideo, FaClock, FaCheck, FaTimes, FaEnvelope, FaUser, FaPhone, FaArrowRight, FaYoutube } from "react-icons/fa";

const upcoming = [
  { title: "Conference Annuelle LLM 2026", date: "15 Mars 2026", time: "09h00 - 18h00", location: "Kinshasa, RDC", venue: "Stade des Martyrs", type: "Presentiel", typeColor: "from-gold to-gold-light", spots: 2000, price: "Gratuit", desc: "La grande conference annuelle reunissant des milliers de fideles et leaders de toute l'Afrique. Predications, louange et moments de puissance.", image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&h=400&fit=crop", speakers: ["Lord Lombo", "Pasteur Moise K.", "Sandra Mbuyi"] },
  { title: "Concert Emmanuel Live", date: "22 Mars 2026", time: "19h00 - 23h00", location: "Paris, France", venue: "Zenith de Paris", type: "Concert", typeColor: "from-purple-400 to-purple-500", spots: 5000, price: "35 EUR", desc: "Lord Lombo en concert live avec le repertoire complet de l'album Emmanuel. Invites speciaux et moments inoubliables.", image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&h=400&fit=crop", speakers: ["Lord Lombo", "Gamaliel Lombo", "Rachel Anyeme"] },
  { title: "Webinaire Leadership", date: "5 Avril 2026", time: "14h00 - 16h00 (GMT+1)", location: "En ligne", venue: "Zoom / YouTube Live", type: "En ligne", typeColor: "from-blue-400 to-blue-500", spots: 500, price: "15 USD", desc: "Masterclass en direct sur le leadership pastoral et la vision ministerielle. Session Q&A interactive incluse.", image: "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=800&h=400&fit=crop", speakers: ["Lord Lombo"] },
  { title: "Retraite Spirituelle", date: "20-22 Avril 2026", time: "3 jours complets", location: "Matadi, RDC", venue: "Centre de Retraite Hebron", type: "Retraite", typeColor: "from-emerald-400 to-emerald-500", spots: 100, price: "200 USD", desc: "3 jours d'immersion spirituelle avec Lord Lombo. Hebergement et repas inclus dans un cadre exceptionnel au bord du fleuve.", image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=400&fit=crop", speakers: ["Lord Lombo", "Equipe LLM"] },
];

const replays = [
  { title: "Concert C.H.A Tour - Kinshasa", date: "Dec 2025", ytId: "Fb_iRuhfdJA", views: "19M", duration: "2h 15min" },
  { title: "Emmanuel Live - Concert Showbuzz", date: "Nov 2025", ytId: "y-Ecb9qGg94", views: "7.7M", duration: "1h 45min" },
  { title: "Predication 'Yahweh Loba'", date: "Oct 2025", ytId: "APYr7GotcMA", views: "7.8M", duration: "52min" },
  { title: "Amoureux - Clip Officiel", date: "Sep 2025", ytId: "g-gYGn1tqUk", views: "11M", duration: "6min" },
  { title: "Saison - Images du mariage", date: "Aout 2025", ytId: "mpCLxlhgW-0", views: "8.9M", duration: "8min" },
  { title: "Medaille - EP 2025", date: "Juil 2025", ytId: "0GZjMRYZqe8", views: "3.8M", duration: "5min" },
];

export default function Evenements() {
  const [bookingEvent, setBookingEvent] = useState<number | null>(null);
  const [bookingStep, setBookingStep] = useState(1);
  const [formData, setFormData] = useState({ name: "", email: "", phone: "", tickets: 1 });
  const [bookingDone, setBookingDone] = useState(false);
  const [playingVideo, setPlayingVideo] = useState<string | null>(null);

  const handleBooking = (index: number) => {
    setBookingEvent(index);
    setBookingStep(1);
    setBookingDone(false);
    setFormData({ name: "", email: "", phone: "", tickets: 1 });
  };

  const submitBooking = () => {
    if (!formData.name || !formData.email) return;
    setBookingStep(3);
    setTimeout(() => setBookingDone(true), 1500);
  };

  return (
    <>
      {/* Hero */}
      <section className="relative pt-28 pb-16 overflow-hidden hero-gradient">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <span className="inline-block px-4 py-1.5 rounded-full bg-purple-400/10 border border-purple-400/20 text-purple-400 text-xs font-medium tracking-wider uppercase mb-6">Evenements</span>
          <h1 className="text-4xl md:text-6xl font-serif font-bold text-cream mb-4">Evenements & <span className="text-gradient-gold">Conferences</span></h1>
          <p className="text-cream/35 max-w-xl mx-auto text-sm">Concerts, conferences, retraites et masterclass - Vivez des moments de transformation</p>
          <div className="flex items-center justify-center gap-6 mt-8">
            <div className="text-center">
              <div className="text-3xl font-serif font-bold text-gradient-gold">4</div>
              <div className="text-cream/20 text-[10px] uppercase tracking-wider">A venir</div>
            </div>
            <div className="w-px h-10 bg-cream/[0.06]" />
            <div className="text-center">
              <div className="text-3xl font-serif font-bold text-gradient-gold">50+</div>
              <div className="text-cream/20 text-[10px] uppercase tracking-wider">Pays</div>
            </div>
            <div className="w-px h-10 bg-cream/[0.06]" />
            <div className="text-center">
              <div className="text-3xl font-serif font-bold text-gradient-gold">7 600</div>
              <div className="text-cream/20 text-[10px] uppercase tracking-wider">Places</div>
            </div>
          </div>
        </div>
      </section>

      {/* Upcoming */}
      <section className="py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-serif font-bold text-cream mb-8">A <span className="text-gradient-gold">venir</span></h2>
          <div className="space-y-6">
            {upcoming.map((ev, i) => (
              <div key={i} className="rounded-2xl glass-card overflow-hidden hover:border-gold/15 transition-all group">
                <div className="grid lg:grid-cols-5 gap-0">
                  <div className="lg:col-span-2 h-56 lg:h-auto relative overflow-hidden">
                    <Image src={ev.image} alt={ev.title} fill className="object-cover group-hover:scale-105 transition-transform duration-700" sizes="500px" />
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent to-dark/60 hidden lg:block" />
                    <div className="absolute inset-0 bg-gradient-to-t from-dark/60 to-transparent lg:hidden" />
                    <div className="absolute top-4 left-4">
                      <span className={`px-3 py-1.5 rounded-full bg-gradient-to-r ${ev.typeColor} text-white text-[10px] font-bold uppercase shadow-lg`}>{ev.type}</span>
                    </div>
                  </div>
                  <div className="lg:col-span-3 p-6 lg:p-8">
                    <h3 className="text-xl font-serif font-bold text-cream mb-3 group-hover:text-gold transition-colors">{ev.title}</h3>
                    <p className="text-cream/35 text-sm leading-relaxed mb-4">{ev.desc}</p>
                    <div className="grid grid-cols-2 gap-3 mb-5">
                      <div className="flex items-center gap-2 text-cream/30 text-xs"><FaCalendarAlt className="text-gold text-[10px]" /> {ev.date}</div>
                      <div className="flex items-center gap-2 text-cream/30 text-xs"><FaClock className="text-gold text-[10px]" /> {ev.time}</div>
                      <div className="flex items-center gap-2 text-cream/30 text-xs"><FaMapMarkerAlt className="text-gold text-[10px]" /> {ev.location}</div>
                      <div className="flex items-center gap-2 text-cream/30 text-xs"><FaUsers className="text-gold text-[10px]" /> {ev.spots} places</div>
                    </div>
                    <div className="flex items-center gap-2 mb-5">
                      <span className="text-cream/15 text-[10px]">Intervenants :</span>
                      {ev.speakers.map((s) => (
                        <span key={s} className="px-2.5 py-1 rounded-full bg-cream/[0.04] border border-cream/[0.06] text-cream/30 text-[10px]">{s}</span>
                      ))}
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="text-gold font-bold text-lg font-serif">{ev.price}</div>
                      <button onClick={() => handleBooking(i)} className="flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-gold to-gold-light text-navy-deep font-bold text-sm hover:shadow-lg hover:shadow-gold/25 transition-all hover:scale-105">
                        <FaTicketAlt className="text-xs" /> Reserver ma place
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Booking Modal */}
      {bookingEvent !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-dark/80 backdrop-blur-sm" onClick={() => setBookingEvent(null)}>
          <div className="w-full max-w-lg rounded-2xl bg-[#0D1E33] border border-cream/[0.08] p-8 relative animate-fade-in" onClick={(e) => e.stopPropagation()}>
            <button onClick={() => setBookingEvent(null)} className="absolute top-4 right-4 w-8 h-8 rounded-full bg-cream/[0.05] flex items-center justify-center text-cream/30 hover:text-cream transition-all"><FaTimes /></button>

            {bookingDone ? (
              <div className="text-center py-8">
                <div className="w-20 h-20 rounded-full bg-emerald-400/10 flex items-center justify-center mx-auto mb-6 ring-4 ring-emerald-400/10">
                  <FaCheck className="text-emerald-400 text-3xl" />
                </div>
                <h3 className="text-2xl font-serif font-bold text-cream mb-2">Reservation confirmee ! 🎉</h3>
                <p className="text-cream/40 text-sm mb-2">{upcoming[bookingEvent].title}</p>
                <p className="text-cream/25 text-xs mb-6">Un email de confirmation a ete envoye a <span className="text-gold">{formData.email}</span></p>
                <div className="glass-card rounded-xl p-4 mb-6 text-left">
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div><span className="text-cream/20">Evenement :</span><br/><span className="text-cream/50">{upcoming[bookingEvent].title}</span></div>
                    <div><span className="text-cream/20">Date :</span><br/><span className="text-cream/50">{upcoming[bookingEvent].date}</span></div>
                    <div><span className="text-cream/20">Lieu :</span><br/><span className="text-cream/50">{upcoming[bookingEvent].venue}</span></div>
                    <div><span className="text-cream/20">Tickets :</span><br/><span className="text-cream/50">{formData.tickets} place(s)</span></div>
                  </div>
                </div>
                <button onClick={() => setBookingEvent(null)} className="px-8 py-3 rounded-full bg-gradient-to-r from-gold to-gold-light text-navy-deep font-bold text-sm">Fermer</button>
              </div>
            ) : bookingStep === 3 ? (
              <div className="text-center py-12">
                <div className="w-12 h-12 border-4 border-gold/20 border-t-gold rounded-full animate-spin mx-auto mb-4" />
                <p className="text-cream/40 text-sm">Traitement de votre reservation...</p>
              </div>
            ) : (
              <>
                <div className="mb-6">
                  <div className="flex items-center gap-3 mb-1">
                    <FaTicketAlt className="text-gold" />
                    <h3 className="text-lg font-serif font-bold text-cream">Reservation</h3>
                  </div>
                  <p className="text-gold text-sm">{upcoming[bookingEvent].title}</p>
                  <p className="text-cream/20 text-xs">{upcoming[bookingEvent].date} &bull; {upcoming[bookingEvent].venue}</p>
                </div>

                {bookingStep === 1 && (
                  <div className="space-y-4">
                    <div className="relative">
                      <FaUser className="absolute left-4 top-1/2 -translate-y-1/2 text-cream/15 text-xs" />
                      <input type="text" placeholder="Nom complet *" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full pl-10 pr-4 py-3.5 rounded-xl bg-cream/[0.03] border border-cream/[0.06] text-cream text-sm focus:border-gold/30 focus:outline-none transition-colors placeholder:text-cream/15" />
                    </div>
                    <div className="relative">
                      <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-cream/15 text-xs" />
                      <input type="email" placeholder="Email *" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="w-full pl-10 pr-4 py-3.5 rounded-xl bg-cream/[0.03] border border-cream/[0.06] text-cream text-sm focus:border-gold/30 focus:outline-none transition-colors placeholder:text-cream/15" />
                    </div>
                    <div className="relative">
                      <FaPhone className="absolute left-4 top-1/2 -translate-y-1/2 text-cream/15 text-xs" />
                      <input type="tel" placeholder="Telephone" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} className="w-full pl-10 pr-4 py-3.5 rounded-xl bg-cream/[0.03] border border-cream/[0.06] text-cream text-sm focus:border-gold/30 focus:outline-none transition-colors placeholder:text-cream/15" />
                    </div>
                    <div>
                      <label className="text-cream/25 text-xs mb-2 block">Nombre de places</label>
                      <div className="flex items-center gap-3">
                        {[1, 2, 3, 4, 5].map((n) => (
                          <button key={n} onClick={() => setFormData({ ...formData, tickets: n })} className={`w-10 h-10 rounded-xl text-sm font-bold transition-all ${formData.tickets === n ? "bg-gradient-to-r from-gold to-gold-light text-navy-deep" : "bg-cream/[0.03] text-cream/30 border border-cream/[0.06] hover:border-gold/20"}`}>{n}</button>
                        ))}
                      </div>
                    </div>
                    <button onClick={() => { if (formData.name && formData.email) setBookingStep(2); }} className="w-full py-3.5 rounded-xl bg-gradient-to-r from-gold to-gold-light text-navy-deep font-bold text-sm flex items-center justify-center gap-2 mt-4 hover:shadow-lg hover:shadow-gold/25 transition-all">
                      Continuer <FaArrowRight className="text-xs" />
                    </button>
                  </div>
                )}

                {bookingStep === 2 && (
                  <div>
                    <div className="glass-card rounded-xl p-4 mb-5">
                      <div className="text-cream/20 text-xs mb-2">Recapitulatif</div>
                      <div className="flex justify-between text-sm mb-1"><span className="text-cream/50">{formData.tickets}x {upcoming[bookingEvent].title}</span><span className="text-gold font-bold">{upcoming[bookingEvent].price === "Gratuit" ? "Gratuit" : upcoming[bookingEvent].price}</span></div>
                      <div className="text-cream/15 text-xs">{formData.name} &bull; {formData.email}</div>
                    </div>
                    {upcoming[bookingEvent].price === "Gratuit" ? (
                      <button onClick={submitBooking} className="w-full py-3.5 rounded-xl bg-gradient-to-r from-gold to-gold-light text-navy-deep font-bold text-sm flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-gold/25 transition-all">
                        <FaCheck className="text-xs" /> Confirmer la reservation gratuite
                      </button>
                    ) : (
                      <div className="space-y-3">
                        <p className="text-cream/30 text-xs mb-2">Choisissez votre mode de paiement :</p>
                        {[
                          { label: "Carte bancaire", desc: "Visa, Mastercard", color: "border-blue-400/20 hover:bg-blue-400/5", iconBg: "bg-blue-400/10 text-blue-400" },
                          { label: "Mobile Money", desc: "MTN, Orange, Wave", color: "border-amber-400/20 hover:bg-amber-400/5", iconBg: "bg-amber-400/10 text-amber-400" },
                          { label: "PayPal", desc: "Paiement securise", color: "border-sky-400/20 hover:bg-sky-400/5", iconBg: "bg-sky-400/10 text-sky-400" },
                        ].map((m) => (
                          <button key={m.label} onClick={submitBooking} className={`w-full flex items-center gap-4 p-4 rounded-xl border ${m.color} transition-all text-left`}>
                            <div className={`w-10 h-10 rounded-xl ${m.iconBg} flex items-center justify-center text-lg`}>💳</div>
                            <div><div className="text-cream text-sm font-medium">{m.label}</div><div className="text-cream/20 text-[10px]">{m.desc}</div></div>
                          </button>
                        ))}
                      </div>
                    )}
                    <button onClick={() => setBookingStep(1)} className="w-full mt-3 py-2 text-cream/25 text-xs hover:text-cream/50 transition-colors">Retour</button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      )}

      {/* Replays & Archives */}
      <section className="py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-serif font-bold text-cream">Replays & <span className="text-gradient-gold">archives</span></h2>
            <a href="https://www.youtube.com/@LordLomboOfficial/playlists" target="_blank" rel="noopener" className="flex items-center gap-2 text-cream/25 text-xs hover:text-gold transition-all">Voir tout <FaYoutube /></a>
          </div>

          {/* Featured replay */}
          <div className="rounded-2xl overflow-hidden glass-card hover:border-gold/15 transition-all mb-6">
            {playingVideo === replays[0].ytId ? (
              <div className="aspect-video"><iframe src={`https://www.youtube.com/embed/${replays[0].ytId}?autoplay=1&rel=0`} allow="autoplay; encrypted-media" allowFullScreen className="w-full h-full" /></div>
            ) : (
              <div className="aspect-video relative cursor-pointer group" onClick={() => setPlayingVideo(replays[0].ytId)}>
                <Image src={`https://i.ytimg.com/vi/${replays[0].ytId}/maxresdefault.jpg`} alt={replays[0].title} fill className="object-cover" sizes="1200px" />
                <div className="absolute inset-0 bg-dark/40 group-hover:bg-dark/20 transition-all flex items-center justify-center">
                  <div className="w-20 h-20 rounded-full bg-gold/20 backdrop-blur-sm flex items-center justify-center border border-gold/30 group-hover:scale-110 transition-transform"><FaPlay className="text-gold text-2xl ml-1" /></div>
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-dark to-transparent">
                  <div className="text-cream font-bold text-lg">{replays[0].title}</div>
                  <div className="text-cream/40 text-xs">{replays[0].date} &bull; {replays[0].views} vues &bull; {replays[0].duration}</div>
                </div>
              </div>
            )}
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {replays.slice(1).map((r) => (
              <div key={r.ytId} className="rounded-xl overflow-hidden glass-card hover:border-gold/15 transition-all cursor-pointer group" onClick={() => setPlayingVideo(playingVideo === r.ytId ? null : r.ytId)}>
                {playingVideo === r.ytId ? (
                  <div className="aspect-video"><iframe src={`https://www.youtube.com/embed/${r.ytId}?autoplay=1&rel=0`} allow="autoplay; encrypted-media" allowFullScreen className="w-full h-full" /></div>
                ) : (
                  <div className="aspect-video relative">
                    <Image src={`https://i.ytimg.com/vi/${r.ytId}/hqdefault.jpg`} alt={r.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" sizes="400px" />
                    <div className="absolute inset-0 bg-dark/30 group-hover:bg-dark/10 transition-all flex items-center justify-center">
                      <div className="w-12 h-12 rounded-full bg-gold/20 backdrop-blur-sm flex items-center justify-center border border-gold/30 group-hover:scale-110 transition-transform"><FaPlay className="text-gold ml-0.5" /></div>
                    </div>
                    <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded bg-dark/60 backdrop-blur-sm text-cream/50 text-[10px]">{r.duration}</div>
                    <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-dark/60 backdrop-blur-sm text-cream/40 text-[10px]"><FaVideo className="inline mr-1 text-[8px]" />{r.views}</div>
                  </div>
                )}
                <div className="p-4">
                  <h3 className="text-cream font-bold text-sm group-hover:text-gold transition-colors">{r.title}</h3>
                  <div className="text-cream/15 text-xs mt-1">{r.date}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
