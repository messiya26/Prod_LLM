"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { AnimatedSection, Badge, Button } from "@/components/ui";
import { FaPlay, FaFilter, FaClock, FaBookOpen, FaSearch, FaTimes } from "react-icons/fa";
import { useI18n } from "@/context/i18n-context";

export default function Formations() {
  const { t } = useI18n();
  const [activeCategory, setActiveCategory] = useState("all");
  const [activeLevel, setActiveLevel] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  const categories = [
    { id: "all", labelKey: "formations.cat.all" },
    { id: "spirituel", labelKey: "formations.cat.spirituel" },
    { id: "leadership", labelKey: "formations.cat.leadership" },
    { id: "pastoral", labelKey: "formations.cat.pastoral" },
    { id: "personnel", labelKey: "formations.cat.personnel" },
    { id: "coaching", labelKey: "formations.cat.coaching" },
  ];

  const levels = [
    { id: "Tous niveaux", labelKey: "formations.lvl.all" },
    { id: "Intermediaire", labelKey: "formations.lvl.inter" },
    { id: "Avance", labelKey: "formations.lvl.advanced" },
    { id: "Sur candidature", labelKey: "formations.lvl.candidature" },
  ];

  const formations = [
    {
      slug: "fondements-foi-leadership",
      titleKey: "formations.f1.title", descKey: "formations.f1.desc",
      modules: 10, lessons: 40, levelId: "Tous niveaux", duration: "12", durationUnit: "weeks",
      category: "spirituel",
      image: "https://images.unsplash.com/photo-1504052434569-70ad5836ab65?w=600&h=400&fit=crop",
      gradient: "from-indigo-600/80 to-purple-900/90", popular: true, price: "149",
    },
    {
      slug: "leadership-vision-ministerielle",
      titleKey: "formations.f2.title", descKey: "formations.f2.desc",
      modules: 12, lessons: 48, levelId: "Intermediaire", duration: "16", durationUnit: "weeks",
      category: "leadership",
      image: "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=600&h=400&fit=crop",
      gradient: "from-amber-600/80 to-orange-900/90", popular: true, price: "199",
    },
    {
      slug: "communication-influence",
      titleKey: "formations.f3.title", descKey: "formations.f3.desc",
      modules: 8, lessons: 32, levelId: "Tous niveaux", duration: "10", durationUnit: "weeks",
      category: "personnel",
      image: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=600&h=400&fit=crop",
      gradient: "from-emerald-600/80 to-teal-900/90", popular: false, price: "129",
    },
    {
      slug: "counseling-pastoral-avance",
      titleKey: "formations.f4.title", descKey: "formations.f4.desc",
      modules: 15, lessons: 60, levelId: "Avance", duration: "20", durationUnit: "weeks",
      category: "pastoral",
      image: "https://images.unsplash.com/photo-1507925921958-8a62f3d1a50d?w=600&h=400&fit=crop",
      gradient: "from-blue-600/80 to-indigo-900/90", popular: false, price: "249",
    },
    {
      slug: "louange-adoration",
      titleKey: "formations.f5.title", descKey: "formations.f5.desc",
      modules: 8, lessons: 24, levelId: "Tous niveaux", duration: "8", durationUnit: "weeks",
      category: "spirituel",
      image: "https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=600&h=400&fit=crop",
      gradient: "from-rose-600/80 to-pink-900/90", popular: false, price: "119",
    },
    {
      slug: "mentorat-ministeriel",
      titleKey: "formations.f6.title", descKey: "formations.f6.desc",
      modules: 6, lessons: 18, levelId: "Sur candidature", duration: "6", durationUnit: "months",
      category: "coaching",
      image: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=600&h=400&fit=crop",
      gradient: "from-violet-600/80 to-indigo-900/90", popular: false, price: "quote",
    },
    {
      slug: "gestion-emotions-resilience",
      titleKey: "formations.f7.title", descKey: "formations.f7.desc",
      modules: 7, lessons: 28, levelId: "Tous niveaux", duration: "8", durationUnit: "weeks",
      category: "personnel",
      image: "https://images.unsplash.com/photo-1544027993-37dbfe43562a?w=600&h=400&fit=crop",
      gradient: "from-cyan-600/80 to-blue-900/90", popular: false, price: "139",
    },
    {
      slug: "leadership-feminin",
      titleKey: "formations.f8.title", descKey: "formations.f8.desc",
      modules: 9, lessons: 36, levelId: "Intermediaire", duration: "12", durationUnit: "weeks",
      category: "leadership",
      image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=600&h=400&fit=crop",
      gradient: "from-fuchsia-600/80 to-purple-900/90", popular: true, price: "179",
    },
    {
      slug: "theologie-pratique",
      titleKey: "formations.f9.title", descKey: "formations.f9.desc",
      modules: 14, lessons: 56, levelId: "Avance", duration: "18", durationUnit: "weeks",
      category: "pastoral",
      image: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=600&h=400&fit=crop",
      gradient: "from-slate-600/80 to-gray-900/90", popular: false, price: "219",
    },
  ];

  const filtered = formations.filter((f) => {
    if (activeCategory !== "all" && f.category !== activeCategory) return false;
    if (activeLevel && f.levelId !== activeLevel) return false;
    if (searchTerm) {
      const title = t(f.titleKey).toLowerCase();
      const desc = t(f.descKey).toLowerCase();
      const s = searchTerm.toLowerCase();
      if (!title.includes(s) && !desc.includes(s)) return false;
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
                {t(cat.labelKey)}
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

          {filtered.length === 0 ? (
            <AnimatedSection>
              <div className="text-center py-20">
                <div className="w-20 h-20 rounded-full bg-cream/5 flex items-center justify-center mx-auto mb-6"><FaSearch className="text-cream/20 text-2xl" /></div>
                <h3 className="text-xl font-bold text-cream mb-3">{t("formations.noResult")}</h3>
                <p className="text-cream/40 mb-6">{t("formations.noResult.desc")}</p>
                <Button variant="outline" size="sm" onClick={clearFilters}>{t("formations.resetFilters")}</Button>
              </div>
            </AnimatedSection>
          ) : (
            <motion.div layout className="grid md:grid-cols-2 lg:grid-cols-3 gap-7">
              <AnimatePresence mode="popLayout">
                {filtered.map((f, i) => (
                  <motion.div key={f.slug} layout initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} transition={{ duration: 0.3, delay: i * 0.05 }}>
                    <Link href={`/formations/${f.slug}`}>
                      <div className="relative rounded-2xl overflow-hidden card-hover-lift group h-[500px] cursor-pointer">
                        <Image src={f.image} alt={t(f.titleKey)} fill className="object-cover transition-transform duration-700 group-hover:scale-110" sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw" />
                        <div className={`absolute inset-0 bg-gradient-to-t ${f.gradient}`} />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                        {f.popular && <div className="absolute top-5 right-5"><Badge variant="gold" className="animate-pulse-glow">{t("formations.popular")}</Badge></div>}
                        <div className="absolute top-5 left-5">
                          <span className="px-3 py-1.5 rounded-full bg-gold/90 text-navy text-sm font-bold shadow-lg">
                            {f.price === "quote" ? t("formations.onQuote") : `${f.price} $`}
                          </span>
                        </div>
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                          <div className="w-16 h-16 rounded-full bg-gold/20 backdrop-blur-md flex items-center justify-center border border-gold/30 group-hover:scale-110 transition-transform">
                            <FaPlay className="text-gold text-xl ml-1" />
                          </div>
                        </div>
                        <div className="absolute bottom-0 left-0 right-0 p-7">
                          <div className="flex items-center gap-2 mb-3 flex-wrap">
                            <Badge>{getLevelLabel(f.levelId)}</Badge>
                            <Badge variant="navy"><FaBookOpen className="inline mr-1 text-[10px]" />{f.modules} {t("formations.modules")}</Badge>
                            <Badge variant="navy"><FaClock className="inline mr-1 text-[10px]" />{f.duration} {f.durationUnit === "weeks" ? t("formations.weeks") : t("formations.months")}</Badge>
                          </div>
                          <h3 className="text-xl font-bold text-white mb-2 group-hover:text-gold transition-colors duration-300">{t(f.titleKey)}</h3>
                          <p className="text-white/60 text-sm leading-relaxed mb-4 line-clamp-2">{t(f.descKey)}</p>
                          <span className="inline-flex items-center gap-2 text-gold font-medium text-sm opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-300">
                            {t("formations.discoverProgram")} &rarr;
                          </span>
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
    </>
  );
}
