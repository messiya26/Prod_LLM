"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { AnimatedSection, Badge } from "@/components/ui";
import {
  FaCalendarAlt, FaClock, FaGlobe, FaMapMarkerAlt, FaUsers, FaChair,
  FaCrown, FaCheck, FaArrowRight, FaSpinner, FaCertificate, FaPlayCircle,
  FaLock, FaShieldAlt, FaChevronDown, FaStar, FaBookOpen, FaFire,
} from "react-icons/fa";
import { useI18n } from "@/context/i18n-context";
import { useAuth } from "@/context/auth-context";
import api from "@/lib/api";

interface MC {
  id: string; title: string; titleEn: string; slug: string;
  description: string; descriptionEn: string; shortDesc: string; shortDescEn: string;
  category: string; level: string; format: string; status: string;
  startDate: string; endDate: string; dailyStartTime: string; dailyEndTime: string;
  location: string; price: number; currency: string;
  earlyBirdPrice: number | null; earlyBirdEnd: string | null;
  maxSeats: number; seatsLeft: number;
  programFr: string; programEn: string; whatYouLearnFr: string; whatYouLearnEn: string;
  prerequisites: string; includedFr: string; includedEn: string;
  isFeatured: boolean; certificateIncluded: boolean; replayAvailable: boolean;
  instructor?: { id: string; firstName: string; lastName: string; avatar: string | null; bio?: string };
  _count?: { registrations: number };
}

const formatLabels: Record<string, { fr: string; en: string; icon: any }> = {
  ONLINE: { fr: "En ligne", en: "Online", icon: FaGlobe },
  IN_PERSON: { fr: "Presentiel", en: "In Person", icon: FaMapMarkerAlt },
  HYBRID: { fr: "Hybride", en: "Hybrid", icon: FaGlobe },
};

const levelLabels: Record<string, { fr: string; en: string }> = {
  all: { fr: "Tous niveaux", en: "All levels" },
  beginner: { fr: "Debutant", en: "Beginner" },
  intermediate: { fr: "Intermediaire", en: "Intermediate" },
  advanced: { fr: "Avance", en: "Advanced" },
};

const catGradients: Record<string, string> = {
  worship: "from-indigo-900/80 via-purple-900/60 to-gold/20",
  leadership: "from-amber-900/80 via-orange-900/60 to-gold/20",
  writing: "from-emerald-900/80 via-teal-900/60 to-gold/20",
  music: "from-rose-900/80 via-pink-900/60 to-gold/20",
  general: "from-navy via-navy/80 to-gold/10",
  ministry: "from-sky-900/80 via-blue-900/60 to-gold/20",
};

const catIcons: Record<string, any> = { worship: FaStar, leadership: FaCrown, writing: FaBookOpen, music: FaPlayCircle, general: FaFire };

export default function MasterclassesPage() {
  const [items, setItems] = useState<MC[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const { locale } = useI18n();
  const router = useRouter();
  const fr = locale === "fr";

  useEffect(() => {
    api.get<MC[]>("/masterclasses").then(setItems).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const filtered = filter === "all" ? items : items.filter(i => i.category === filter);
  const featured = items.filter(i => i.isFeatured);
  const categories = [...new Set(items.map(i => i.category))];

  const daysCount = (s: string, e: string) => Math.max(1, Math.ceil((new Date(e).getTime() - new Date(s).getTime()) / 86400000));
  const formatDate = (d: string) => new Date(d).toLocaleDateString(fr ? "fr-FR" : "en-US", { day: "numeric", month: "long", year: "numeric" });
  const isEarlyBird = (mc: MC) => mc.earlyBirdPrice && mc.earlyBirdEnd && new Date() < new Date(mc.earlyBirdEnd);
  const currSym = (c: string) => c === "EUR" ? "\u20ac" : c === "XAF" ? "FCFA " : "$";

  const daysUntil = (d: string) => {
    const diff = Math.ceil((new Date(d).getTime() - Date.now()) / 86400000);
    return diff > 0 ? diff : 0;
  };

  if (loading) return <div className="flex items-center justify-center min-h-[60vh]"><FaSpinner className="animate-spin text-gold text-4xl" /></div>;

  return (
    <>
      {/* Hero */}
      <section className="relative py-16 md:py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-gold/[0.04] via-transparent to-gold/[0.02]" />
        <div className="absolute top-20 right-20 w-96 h-96 bg-gold/[0.03] rounded-full blur-[120px]" />
        <div className="max-w-5xl mx-auto px-6 relative text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <Badge variant="gold" className="mb-6">{fr ? "Evenements exclusifs" : "Exclusive events"}</Badge>
            <h1 className="text-4xl md:text-6xl font-bold text-cream mb-5">
              {fr ? "Masterclasses" : "Masterclasses"} <span className="text-gradient-gold">{fr ? "d'exception" : "of excellence"}</span>
            </h1>
            <p className="text-cream/45 max-w-2xl mx-auto text-lg">
              {fr
                ? "Des experiences d'apprentissage intensives et transformatrices, directement avec Pastor Lord Lombo et des intervenants de renommee."
                : "Intensive and transformative learning experiences, directly with Pastor Lord Lombo and renowned speakers."
              }
            </p>
          </motion.div>
        </div>
      </section>

      {/* Featured */}
      {featured.length > 0 && (
        <section className="px-6 -mt-8 mb-12">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-2 gap-6">
              {featured.map((mc, i) => {
                const eb = isEarlyBird(mc);
                const days = daysCount(mc.startDate, mc.endDate);
                const du = daysUntil(mc.startDate);
                const CatIcon = catIcons[mc.category] || FaFire;
                return (
                  <AnimatedSection key={mc.id} delay={i * 0.15}>
                    <div onClick={() => router.push(`/masterclasses/${mc.slug}`)}
                      className="relative rounded-3xl border border-gold/20 bg-gradient-to-br from-gold/[0.06] to-transparent p-8 cursor-pointer group hover:border-gold/40 transition-all hover:shadow-xl hover:shadow-gold/10">
                      <div className="absolute top-4 right-4">
                        <span className="px-3 py-1.5 rounded-full bg-gold text-navy text-xs font-bold flex items-center gap-1.5">
                          <FaCrown className="text-[10px]" /> {fr ? "A la une" : "Featured"}
                        </span>
                      </div>
                      {eb && (
                        <div className="absolute top-4 left-4">
                          <span className="px-3 py-1.5 rounded-full bg-emerald-500 text-white text-xs font-bold animate-pulse">
                            Early Bird -{Math.round((1 - mc.earlyBirdPrice! / mc.price) * 100)}%
                          </span>
                        </div>
                      )}
                      <div className="mt-8 mb-4 flex items-center gap-2">
                        <span className="px-2.5 py-1 rounded-lg bg-cream/[0.06] text-cream/50 text-xs flex items-center gap-1"><CatIcon className="text-gold" /> {mc.category}</span>
                        <span className="px-2.5 py-1 rounded-lg bg-cream/[0.06] text-cream/50 text-xs">{(levelLabels[mc.level] || levelLabels.all)[fr ? "fr" : "en"]}</span>
                        <span className="px-2.5 py-1 rounded-lg bg-cream/[0.06] text-cream/50 text-xs">{days} {fr ? "jour(s)" : "day(s)"}</span>
                      </div>
                      <h2 className="text-2xl font-bold text-cream mb-2 group-hover:text-gold transition-colors">{fr ? mc.title : mc.titleEn || mc.title}</h2>
                      <p className="text-cream/40 text-sm mb-6 line-clamp-2">{fr ? mc.shortDesc : mc.shortDescEn || mc.shortDesc}</p>
                      <div className="flex items-center gap-4 text-xs text-cream/35 mb-6">
                        <span className="flex items-center gap-1"><FaCalendarAlt className="text-gold" /> {formatDate(mc.startDate)}</span>
                        <span className="flex items-center gap-1"><FaClock className="text-gold" /> {mc.dailyStartTime} - {mc.dailyEndTime}</span>
                        {mc.format !== "ONLINE" && <span className="flex items-center gap-1"><FaMapMarkerAlt className="text-gold" /> {mc.location}</span>}
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          {mc.instructor && (
                            <div className="flex items-center gap-2">
                              <div className="w-8 h-8 rounded-full bg-gold/20 flex items-center justify-center text-gold text-xs font-bold">
                                {mc.instructor.firstName[0]}
                              </div>
                              <span className="text-cream/50 text-xs">{mc.instructor.firstName} {mc.instructor.lastName}</span>
                            </div>
                          )}
                        </div>
                        <div className="text-right">
                          {eb && <div className="text-cream/25 text-xs line-through">{currSym(mc.currency)}{mc.price}</div>}
                          <div className="text-2xl font-bold text-cream">{mc.price === 0 ? (fr ? "Gratuit" : "Free") : `${currSym(mc.currency)}${eb ? mc.earlyBirdPrice : mc.price}`}</div>
                        </div>
                      </div>
                      {du > 0 && (
                        <div className="mt-4 pt-4 border-t border-cream/[0.06] flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="flex items-center gap-1 text-xs text-cream/30"><FaChair /> {mc.seatsLeft} {fr ? "places" : "seats"}</div>
                            <div className="w-24 h-1.5 rounded-full bg-cream/[0.06] overflow-hidden">
                              <div className="h-full bg-gold rounded-full" style={{ width: `${((mc.maxSeats - mc.seatsLeft) / mc.maxSeats) * 100}%` }} />
                            </div>
                          </div>
                          <span className="text-gold text-xs font-bold flex items-center gap-1">{fr ? "Dans" : "In"} {du} {fr ? "jours" : "days"} <FaArrowRight /></span>
                        </div>
                      )}
                    </div>
                  </AnimatedSection>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Filter + All */}
      <section className="px-6 pb-20">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-3 mb-8 overflow-x-auto pb-2">
            <button onClick={() => setFilter("all")} className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${filter === "all" ? "bg-gold text-navy" : "bg-cream/[0.04] text-cream/50 hover:text-cream"}`}>
              {fr ? "Toutes" : "All"}
            </button>
            {categories.map(cat => (
              <button key={cat} onClick={() => setFilter(cat)} className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all capitalize ${filter === cat ? "bg-gold text-navy" : "bg-cream/[0.04] text-cream/50 hover:text-cream"}`}>
                {cat}
              </button>
            ))}
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {filtered.map((mc, i) => {
              const eb = isEarlyBird(mc);
              const days = daysCount(mc.startDate, mc.endDate);
              const du = daysUntil(mc.startDate);
              const pctFull = ((mc.maxSeats - mc.seatsLeft) / mc.maxSeats) * 100;
              return (
                <AnimatedSection key={mc.id} delay={i * 0.08}>
                  <div onClick={() => router.push(`/masterclasses/${mc.slug}`)}
                    className="rounded-2xl border border-cream/10 bg-white/[0.01] overflow-hidden cursor-pointer group hover:border-gold/20 transition-all hover:shadow-lg hover:shadow-gold/5">
                    <div className={`relative h-44 bg-gradient-to-br ${catGradients[mc.category] || catGradients.general} flex items-center justify-center overflow-hidden`}>
                      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(212,175,55,0.15),transparent_60%)]" />
                      {mc.thumbnail ? (
                        <img src={mc.thumbnail.startsWith("http") ? mc.thumbnail : `https://prod-llm.onrender.com${mc.thumbnail}`} alt={mc.title} className="absolute inset-0 w-full h-full object-cover opacity-60" />
                      ) : null}
                      <div className="relative text-center z-10">
                        {(() => { const Icon = catIcons[mc.category] || FaFire; return <Icon className="text-gold/40 text-4xl mx-auto mb-2" />; })()}
                        <div className="text-4xl font-bold text-cream/50 mb-0.5">{days}</div>
                        <div className="text-cream/30 text-[10px] uppercase tracking-widest">{fr ? "jour(s) intensif(s)" : "intensive day(s)"}</div>
                      </div>
                      <div className="absolute top-3 right-3 flex gap-1.5">
                        {eb && <span className="px-2 py-0.5 rounded-full bg-emerald-500 text-white text-[10px] font-bold">Early Bird</span>}
                        <span className="px-2 py-0.5 rounded-full bg-cream/10 text-cream/50 text-[10px]">{(formatLabels[mc.format] || formatLabels.ONLINE)[fr ? "fr" : "en"]}</span>
                      </div>
                      <div className="absolute bottom-3 left-3">
                        <span className="px-2.5 py-1 rounded-lg bg-black/40 backdrop-blur text-cream text-xs flex items-center gap-1">
                          <FaCalendarAlt className="text-gold text-[10px]" /> {formatDate(mc.startDate)}
                        </span>
                      </div>
                    </div>
                    <div className="p-5">
                      <h3 className="text-base font-bold text-cream mb-1.5 group-hover:text-gold transition-colors line-clamp-2">{fr ? mc.title : mc.titleEn || mc.title}</h3>
                      <p className="text-cream/35 text-xs mb-4 line-clamp-2">{fr ? mc.shortDesc : mc.shortDescEn || mc.shortDesc}</p>
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-1 text-xs text-cream/30">
                          <FaChair /> {mc.seatsLeft}/{mc.maxSeats}
                        </div>
                        <div className="text-right">
                          {eb && <span className="text-cream/20 text-xs line-through mr-1">{currSym(mc.currency)}{mc.price}</span>}
                          <span className="text-lg font-bold text-cream">{mc.price === 0 ? (fr ? "Gratuit" : "Free") : `${currSym(mc.currency)}${eb ? mc.earlyBirdPrice : mc.price}`}</span>
                        </div>
                      </div>
                      <div className="w-full h-1 rounded-full bg-cream/[0.06] overflow-hidden mb-3">
                        <div className={`h-full rounded-full transition-all ${pctFull > 80 ? "bg-red-400" : pctFull > 50 ? "bg-orange-400" : "bg-gold"}`} style={{ width: `${pctFull}%` }} />
                      </div>
                      <div className="flex items-center gap-3 text-[10px] text-cream/25">
                        {mc.instructor && <span className="flex items-center gap-1 text-cream/40 font-medium">Par {mc.instructor.firstName} {mc.instructor.lastName}</span>}
                        <span className="ml-auto flex items-center gap-3">
                          {mc.certificateIncluded && <span className="flex items-center gap-1"><FaCertificate className="text-gold" /> Certificat</span>}
                          {mc.replayAvailable && <span className="flex items-center gap-1"><FaPlayCircle className="text-gold" /> Replay</span>}
                        </span>
                      </div>
                      {du > 0 && <div className="text-center mt-2"><span className="text-gold text-xs font-bold">{fr ? "Dans" : "In"} {du} {fr ? "jours" : "days"}</span></div>}
                    </div>
                  </div>
                </AnimatedSection>
              );
            })}
          </div>

          {filtered.length === 0 && (
            <div className="text-center py-20 text-cream/30">
              {fr ? "Aucune masterclass disponible pour le moment." : "No masterclasses available at this time."}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
