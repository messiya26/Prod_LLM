"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { AnimatedSection, Badge, Button } from "@/components/ui";
import { FaPlay, FaFilter, FaClock, FaBookOpen, FaSearch, FaTimes, FaCheck, FaCrown, FaArrowRight, FaSpinner } from "react-icons/fa";
import { useI18n } from "@/context/i18n-context";
import api from "@/lib/api";

interface ApiCourse {
  id: string;
  slug: string;
  title: string;
  description: string;
  price: number;
  level: string;
  duration: string;
  image: string | null;
  thumbnail: string | null;
  published: boolean;
  popular?: boolean;
  category: { id: string; name: string } | null;
  instructor: { id: string; firstName: string; lastName: string; avatar: string | null } | null;
  _count: { modules: number; enrollments: number };
}

interface FormationDisplay {
  slug: string;
  title: string;
  description: string;
  modules: number;
  levelId: string;
  duration: string;
  durationUnit: string;
  category: string;
  image: string;
  gradient: string;
  popular: boolean;
  price: string;
  enrollments: number;
  instructorName: string;
}

const GRADIENTS = [
  "from-indigo-600/80 to-purple-900/90",
  "from-amber-600/80 to-orange-900/90",
  "from-emerald-600/80 to-teal-900/90",
  "from-blue-600/80 to-indigo-900/90",
  "from-rose-600/80 to-pink-900/90",
  "from-violet-600/80 to-indigo-900/90",
  "from-cyan-600/80 to-blue-900/90",
  "from-fuchsia-600/80 to-purple-900/90",
  "from-slate-600/80 to-gray-900/90",
];

const DEFAULT_IMAGES = [
  "https://images.unsplash.com/photo-1504052434569-70ad5836ab65?w=600&h=400&fit=crop",
  "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=600&h=400&fit=crop",
  "https://images.unsplash.com/photo-1552664730-d307ca884978?w=600&h=400&fit=crop",
  "https://images.unsplash.com/photo-1507925921958-8a62f3d1a50d?w=600&h=400&fit=crop",
  "https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=600&h=400&fit=crop",
];

function mapApiCourse(c: ApiCourse, idx: number): FormationDisplay {
  const imgBase = process.env.NEXT_PUBLIC_API_URL?.replace("/api/v1", "") || "http://localhost:3002";
  return {
    slug: c.slug,
    title: c.title,
    description: c.description || "",
    modules: c._count?.modules || 0,
    levelId: c.level || "Tous niveaux",
    duration: c.duration || "8",
    durationUnit: "weeks",
    category: c.category?.name?.toLowerCase() || "general",
    image: (c.image || c.thumbnail) ? ((c.image || c.thumbnail)!.startsWith("http") ? (c.image || c.thumbnail)! : `${imgBase}${c.image || c.thumbnail}`) : DEFAULT_IMAGES[idx % DEFAULT_IMAGES.length],
    gradient: GRADIENTS[idx % GRADIENTS.length],
    popular: c.popular || c._count?.enrollments > 5 || false,
    price: c.price != null ? String(c.price) : "0",
    enrollments: c._count?.enrollments || 0,
    instructorName: c.instructor ? `${c.instructor.firstName} ${c.instructor.lastName}`.trim() : "",
  };
}

export default function Formations() {
  const { t } = useI18n();
  const [activeCategory, setActiveCategory] = useState("all");
  const [activeLevel, setActiveLevel] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [formations, setFormations] = useState<FormationDisplay[]>([]);
  const [loading, setLoading] = useState(true);
  const [dynamicCategories, setDynamicCategories] = useState<string[]>([]);

  useEffect(() => {
    api.get<ApiCourse[]>("/courses?published=true")
      .then((courses) => {
        const mapped = courses.map(mapApiCourse);
        setFormations(mapped);
        const cats = [...new Set(mapped.map((f) => f.category).filter(Boolean))];
        setDynamicCategories(cats);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const categories = [
    { id: "all", label: t("formations.cat.all") },
    ...dynamicCategories.map((c) => ({ id: c, label: c.charAt(0).toUpperCase() + c.slice(1) })),
  ];

  const levels = [
    { id: "Tous niveaux", labelKey: "formations.lvl.all" },
    { id: "Intermediaire", labelKey: "formations.lvl.inter" },
    { id: "Avance", labelKey: "formations.lvl.advanced" },
    { id: "Sur candidature", labelKey: "formations.lvl.candidature" },
  ];

  const filtered = formations.filter((f) => {
    if (activeCategory !== "all" && f.category !== activeCategory) return false;
    if (activeLevel && f.levelId !== activeLevel) return false;
    if (searchTerm) {
      const s = searchTerm.toLowerCase();
      if (!f.title.toLowerCase().includes(s) && !f.description.toLowerCase().includes(s)) return false;
    }
    return true;
  });

  const clearFilters = () => { setActiveCategory("all"); setActiveLevel(null); setSearchTerm(""); };
  const hasActiveFilters = activeCategory !== "all" || activeLevel || searchTerm;
  const getLevelLabel = (levelId: string) => { const lvl = levels.find((l) => l.id === levelId); return lvl ? t(lvl.labelKey) : levelId; };

  return (
    <>
      <section className="relative py-12 md:py-16 overflow-hidden">
        <div className="absolute inset-0">
          <Image src="https://images.unsplash.com/photo-1504052434569-70ad5836ab65?w=1920&h=600&fit=crop" alt="Formations" fill className="object-cover" priority sizes="100vw" />
          <div className="absolute inset-0 bg-gradient-to-b from-dark/80 via-dark/70 to-dark" />
        </div>
        <div className="max-w-4xl mx-auto px-6 relative z-10 text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
            <Badge variant="gold" className="mb-6">{t("formations.badge2")}</Badge>
            <h1 className="text-4xl md:text-6xl font-bold text-cream mb-6 leading-tight">
              {t("formations.title.main1")} <span className="text-gradient-gold">{t("formations.title.main2")}</span>
            </h1>
            <p className="text-cream/55 text-lg max-w-2xl mx-auto">
              {formations.length} {t("formations.count.desc")}
            </p>
          </motion.div>
        </div>
      </section>

      <section className="sticky top-16 md:top-20 z-40 glass-strong border-b border-cream/5">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center gap-3 mb-4">
            <div className="relative flex-1 max-w-md">
              <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-cream/30 text-sm" />
              <input type="text" placeholder={t("formations.search")} value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-11 pr-4 py-3 rounded-xl bg-cream/5 border border-cream/10 text-cream placeholder:text-cream/30 text-sm focus:outline-none focus:border-gold/40 focus:bg-cream/8 transition-all" />
              {searchTerm && (
                <button onClick={() => setSearchTerm("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-cream/40 hover:text-cream transition-colors"><FaTimes className="text-xs" /></button>
              )}
            </div>
            <button onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-4 py-3 rounded-xl border text-sm font-medium transition-all ${showFilters || hasActiveFilters ? "bg-gold/15 border-gold/30 text-gold" : "bg-cream/5 border-cream/10 text-cream/50 hover:text-cream hover:border-cream/20"}`}>
              <FaFilter className="text-xs" /> {t("formations.filters")}
              {hasActiveFilters && <span className="w-5 h-5 rounded-full bg-gold text-navy text-[10px] font-bold flex items-center justify-center">{(activeCategory !== "all" ? 1 : 0) + (activeLevel ? 1 : 0)}</span>}
            </button>
            {hasActiveFilters && <button onClick={clearFilters} className="text-cream/40 hover:text-gold text-sm transition-colors whitespace-nowrap">{t("formations.clearAll")}</button>}
          </div>
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide">
            {categories.map((cat) => (
              <button key={cat.id} onClick={() => setActiveCategory(cat.id)}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-200 ${activeCategory === cat.id ? "bg-gold text-navy shadow-lg shadow-gold/20" : "bg-cream/5 text-cream/50 hover:bg-cream/10 hover:text-cream"}`}>
                {cat.label}
              </button>
            ))}
          </div>
          <AnimatePresence>
            {showFilters && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
                <div className="pt-4 mt-4 border-t border-cream/5">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-cream/40 text-xs font-medium uppercase tracking-wider mr-2">{t("formations.level")}</span>
                    {levels.map((lvl) => (
                      <button key={lvl.id} onClick={() => setActiveLevel(activeLevel === lvl.id ? null : lvl.id)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${activeLevel === lvl.id ? "bg-gold/20 text-gold border border-gold/30" : "bg-cream/5 text-cream/40 border border-cream/8 hover:text-cream/70"}`}>
                        {t(lvl.labelKey)}
                      </button>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      <section className="py-12 md:py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <p className="text-cream/40 text-sm">
              <span className="text-gold font-semibold">{filtered.length}</span>{" "}
              {filtered.length > 1 ? t("formations.founds") : t("formations.found")}{" "}
              {filtered.length > 1 ? t("formations.foundsLabel") : t("formations.foundLabel")}
            </p>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <FaSpinner className="text-gold text-3xl animate-spin mb-4" />
              <p className="text-cream/40 text-sm">{t("formations.loading") || "Chargement des formations..."}</p>
            </div>
          ) : filtered.length === 0 ? (
            <AnimatedSection>
              <div className="text-center py-20">
                <div className="w-20 h-20 rounded-full bg-cream/5 flex items-center justify-center mx-auto mb-6"><FaSearch className="text-cream/20 text-2xl" /></div>
                <h3 className="text-xl font-bold text-cream mb-3">{t("formations.noResult")}</h3>
                <p className="text-cream/40 mb-6">{t("formations.noResult.desc")}</p>
                <Button variant="outline" size="sm" onClick={clearFilters}>{t("formations.resetFilters")}</Button>
              </div>
            </AnimatedSection>
          ) : (
            <motion.div layout className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
              <AnimatePresence mode="popLayout">
                {filtered.map((f, i) => (
                  <motion.div key={f.slug} layout initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }} transition={{ duration: 0.3, delay: i * 0.04 }}>
                    <Link href={`/formations/${f.slug}`}>
                      <div className="group rounded-2xl overflow-hidden border border-cream/[0.06] hover:border-gold/20 bg-[#0b1829] transition-all duration-300 hover:shadow-xl hover:shadow-black/30 hover:-translate-y-1 cursor-pointer">
                        {/* Image */}
                        <div className="relative h-48 overflow-hidden">
                          <Image src={f.image} alt={f.title} fill className="object-cover transition-transform duration-700 group-hover:scale-105" sizes="(max-width:768px) 100vw,(max-width:1280px) 50vw,33vw" />
                          <div className={`absolute inset-0 bg-gradient-to-t ${f.gradient} opacity-60`} />
                          <div className="absolute inset-0 bg-gradient-to-t from-[#0b1829] via-transparent to-transparent" />
                          {/* Badges top */}
                          <div className="absolute top-3 left-3 right-3 flex items-start justify-between">
                            <span className="px-2.5 py-1 rounded-full bg-gold text-navy text-xs font-bold shadow-lg">
                              {f.price === "quote" ? t("formations.onQuote") : `${f.price} $`}
                            </span>
                            {f.popular && <Badge variant="gold" className="animate-pulse-glow text-[10px]">{t("formations.popular")}</Badge>}
                          </div>
                          {/* Play icon on hover */}
                          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <div className="w-12 h-12 rounded-full bg-gold/20 backdrop-blur-md flex items-center justify-center border border-gold/40">
                              <FaPlay className="text-gold text-sm ml-0.5" />
                            </div>
                          </div>
                        </div>
                        {/* Content */}
                        <div className="p-5">
                          <div className="flex flex-wrap gap-1.5 mb-3">
                            <span className="px-2 py-0.5 rounded-full bg-cream/[0.06] text-cream/50 text-[10px] font-medium">{getLevelLabel(f.levelId)}</span>
                            <span className="px-2 py-0.5 rounded-full bg-cream/[0.06] text-cream/50 text-[10px]"><FaBookOpen className="inline mr-1 text-[9px]" />{f.modules} {t("formations.modules")}</span>
                            <span className="px-2 py-0.5 rounded-full bg-cream/[0.06] text-cream/50 text-[10px]"><FaClock className="inline mr-1 text-[9px]" />{f.duration} {f.durationUnit === "weeks" ? t("formations.weeks") : t("formations.months")}</span>
                          </div>
                          <h3 className="text-base font-bold text-cream mb-1.5 group-hover:text-gold transition-colors leading-snug">{f.title}</h3>
                          <p className="text-cream/40 text-xs leading-relaxed line-clamp-2 mb-4">{f.description}</p>
                          <div className="flex items-center justify-between">
                            <span className="text-gold font-bold text-sm">{f.price === "quote" ? t("formations.onQuote") : `${f.price} $`}</span>
                            <span className="flex items-center gap-1 text-gold/50 text-xs group-hover:text-gold group-hover:gap-2 transition-all">
                              {t("formations.discoverProgram")} &rarr;
                            </span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          )}
        </div>
      </section>

      {/* SECTION FORMULES */}
      <section className="py-16 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0a1628]/40 to-transparent" />
        <div className="max-w-5xl mx-auto relative">
          <AnimatedSection className="text-center mb-12">
            <span className="inline-block px-3 py-1 rounded-full bg-gold/10 text-gold text-xs font-medium uppercase tracking-wider mb-4">{t("pricing.badge")}</span>
            <h2 className="text-3xl md:text-4xl font-bold text-cream mb-2">
              {t("formations.plans.title1")} <span className="text-gradient-gold">{t("formations.plans.title2")}</span>
            </h2>
            <p className="text-cream/35 text-sm max-w-md mx-auto">{t("formations.plans.desc")}</p>
          </AnimatedSection>

          <div className="grid md:grid-cols-3 gap-5 mb-8">
            {[
              {
                name: t("pricing.plan.decouverte"), price: t("pricing.free"), period: "",
                desc: t("pricing.plan.decouverte.desc"), popular: false, color: "border-cream/10",
                features: [t("pricing.feature.access2"), t("pricing.feature.community"), t("pricing.feature.certParticipation"), t("pricing.feature.emailSupport")],
                cta: t("pricing.cta.free"), href: "/inscription", btnStyle: "border border-cream/20 text-cream/70 hover:border-gold/30 hover:text-gold",
              },
              {
                name: t("pricing.plan.essentiel"), price: "$29", period: "/mois",
                desc: t("pricing.plan.essentiel.desc"), popular: true, color: "border-gold/40",
                features: [t("pricing.feature.allFormations"), t("pricing.feature.unlimitedModules"), t("pricing.feature.officialCerts"), t("pricing.feature.premiumCommunity"), t("pricing.feature.prioritySupport"), t("pricing.feature.liveMonthly")],
                cta: t("pricing.cta.essentiel"), href: "/inscription", btnStyle: "bg-gradient-to-r from-gold to-gold-light text-navy font-bold shadow-lg shadow-gold/20",
              },
              {
                name: t("pricing.plan.premium"), price: "$79", period: "/mois",
                desc: t("pricing.plan.premium.desc"), popular: false, color: "border-purple-400/30",
                features: [t("pricing.feature.allEssentiel"), t("pricing.feature.coaching"), t("pricing.feature.vipMasterclass"), t("pricing.feature.mentoring"), t("pricing.feature.whatsapp"), t("pricing.feature.livePriority")],
                cta: t("pricing.cta.premium"), href: "/inscription", btnStyle: "bg-gradient-to-r from-purple-500 to-purple-600 text-white font-bold shadow-lg shadow-purple-500/20",
              },
            ].map((plan, i) => (
              <div key={i} className={`relative rounded-2xl border ${plan.color} p-6 flex flex-col ${plan.popular ? "bg-gradient-to-b from-gold/[0.06] to-transparent" : "bg-[#0b1829]"}`}>
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="px-4 py-1 rounded-full bg-gradient-to-r from-gold to-gold-light text-navy text-[10px] font-bold shadow-lg flex items-center gap-1">
                      <FaCrown className="text-[9px]" /> {t("pricing.popular")}
                    </span>
                  </div>
                )}
                <div className="mb-5">
                  <h3 className="text-cream font-bold text-base mb-1">{plan.name}</h3>
                  <p className="text-cream/30 text-xs mb-4">{plan.desc}</p>
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-bold text-cream font-heading">{plan.price}</span>
                    {plan.period && <span className="text-cream/30 text-sm">{plan.period}</span>}
                  </div>
                </div>
                <ul className="space-y-2.5 mb-6 flex-1">
                  {plan.features.map((f, j) => (
                    <li key={j} className="flex items-start gap-2 text-xs text-cream/50">
                      <FaCheck className="text-gold text-[10px] mt-0.5 flex-shrink-0" /> {f}
                    </li>
                  ))}
                </ul>
                <Link href={plan.href} className={`w-full py-3 rounded-xl text-sm text-center transition-all hover:scale-[1.02] block ${plan.btnStyle}`}>
                  {plan.cta}
                </Link>
              </div>
            ))}
          </div>

          <div className="text-center">
            <p className="text-cream/25 text-xs mb-2">{t("formations.plans.individual")}</p>
            <Link href="/tarifs" className="text-gold/70 text-xs hover:text-gold transition-colors flex items-center gap-1 justify-center">
              {t("formations.plans.seeAll")} <FaArrowRight className="text-[9px]" />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
