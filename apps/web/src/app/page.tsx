"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { LazyMotion, domAnimation, m, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Button, AnimatedSection, Badge } from "@/components/ui";
import { FloatingParticles } from "@/components/ui/floating-particles";
import { AnimatedCounter } from "@/components/ui/animated-counter";
import { useI18n } from "@/context/i18n-context";
import api from "@/lib/api";
import { FaPlay, FaCrown, FaCross, FaCertificate, FaGlobe, FaHandsHelping, FaStar, FaArrowRight, FaBookOpen, FaMusic, FaCalendarAlt, FaHandHoldingHeart, FaYoutube, FaQuoteLeft, FaChevronLeft, FaChevronRight, FaTimes, FaSpotify, FaFacebook } from "react-icons/fa";

const TestimonialCarousel = dynamic(() => import("@/components/ui/testimonial-carousel").then(m => ({ default: m.TestimonialCarousel })), { ssr: false });
const FormationCarousel = dynamic(() => import("@/components/ui/formation-carousel").then(m => ({ default: m.FormationCarousel })), { ssr: false });
const MasterclassShowcase = dynamic(() => import("@/components/ui/masterclass-showcase").then(m => ({ default: m.MasterclassShowcase })), { ssr: false });

const featureKeys = [
  { icon: <FaCross className="text-2xl" />, titleKey: "feature.croissance", descKey: "feature.croissance.desc", image: "https://images.unsplash.com/photo-1504052434569-70ad5836ab65?w=400&h=300&fit=crop" },
  { icon: <FaCrown className="text-2xl" />, titleKey: "feature.leadership", descKey: "feature.leadership.desc", image: "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=400&h=300&fit=crop" },
  { icon: <FaBookOpen className="text-2xl" />, titleKey: "feature.pastorale", descKey: "feature.pastorale.desc", image: "https://images.unsplash.com/photo-1507925921958-8a62f3d1a50d?w=400&h=300&fit=crop" },
  { icon: <FaHandsHelping className="text-2xl" />, titleKey: "feature.coaching", descKey: "feature.coaching.desc", image: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=300&fit=crop" },
  { icon: <FaGlobe className="text-2xl" />, titleKey: "feature.online", descKey: "feature.online.desc", image: "https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=400&h=300&fit=crop" },
  { icon: <FaCertificate className="text-2xl" />, titleKey: "feature.certificats", descKey: "feature.certificats.desc", image: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=400&h=300&fit=crop" },
];

const LLM_PROMO_SLIDES = [
  {
    title: "Lord Lombo Ministries",
    subtitle: "Musique \u2022 Livres \u2022 Formations \u2022 Evenements",
    desc: "Decouvrez l'ecosysteme complet du Pasteur Lord Lombo — 377K abonnes, 115M+ vues, 50+ pays touches",
    cta: "Decouvrir le Ministere",
    href: "/a-propos",
    bg: "from-[#0a1628] via-[#0d1a2e] to-[#1a0f2e]",
    accent: "gold",
    icon: <FaStar />,
    stats: [{ v: "377K+", l: "YouTube" }, { v: "115M+", l: "Vues" }, { v: "50+", l: "Pays" }],
  },
  {
    title: "Nouveau Single Disponible",
    subtitle: "Ecoutez maintenant sur toutes les plateformes",
    desc: "Rejoignez des millions d'auditeurs dans le monde — streaming, concerts et plus encore",
    cta: "Ecouter maintenant",
    href: "/ministere/musique",
    bg: "from-[#1a0f0a] via-[#1f1209] to-[#0d1a2e]",
    accent: "red-400",
    icon: <FaMusic />,
    stats: [{ v: "83K+", l: "Spotify" }, { v: "23M", l: "Emmanuel" }, { v: "3", l: "Albums" }],
  },
  {
    title: "Les Tenebres de Dieu",
    subtitle: "Best-seller — 18 chapitres transformateurs",
    desc: "Procurez-vous le livre evenement du Pasteur Lord Lombo — disponible en format papier et numerique",
    cta: "Decouvrir le livre",
    href: "/ministere/livres",
    bg: "from-[#0a1628] via-[#0f1f35] to-[#0a1215]",
    accent: "amber-400",
    icon: <FaBookOpen />,
    stats: [{ v: "18", l: "Chapitres" }, { v: "4.9\u2605", l: "Note" }, { v: "5K+", l: "Vendus" }],
  },
  {
    title: "Soutenez la Vision",
    subtitle: "Chaque don fait la difference",
    desc: "Participez a l'impact mondial du ministere. Vos dons soutiennent les formations, evenements et projets humanitaires.",
    cta: "Faire un don",
    href: "/ministere/dons",
    bg: "from-[#0a1628] via-[#15102a] to-[#1a0a15]",
    accent: "rose-400",
    icon: <FaHandHoldingHeart />,
    stats: [{ v: "3200+", l: "Donateurs" }, { v: "100%", l: "Transparent" }, { v: "\u221e", l: "Impact" }],
  },
];

export default function Home() {
  const { t, locale } = useI18n();
  const fr = locale === "fr";
  const [promoIdx, setPromoIdx] = useState(0);
  const [promoDismissed, setPromoDismissed] = useState(false);
  const [heroMcList, setHeroMcList] = useState<any[]>([]);
  const [heroMcIdx, setHeroMcIdx] = useState(0);
  const [siteContent, setSiteContent] = useState<Record<string, string>>({});

  useEffect(() => {
    api.get("/site-content").then((res: any) => {
      const list = Array.isArray(res) ? res : res.data || [];
      const map: Record<string, string> = {};
      list.forEach((item: any) => { map[item.key] = item.value; });
      setSiteContent(map);
    }).catch(() => {});
  }, []);

  useEffect(() => {
    api.get("/masterclasses?status=PUBLISHED&limit=6").then((res: any) => {
      const list = Array.isArray(res) ? res : res.data || [];
      setHeroMcList(list);
    }).catch(() => {});
  }, []);

  useEffect(() => {
    if (heroMcList.length <= 1) return;
    const t = setInterval(() => setHeroMcIdx((i) => (i + 1) % heroMcList.length), 4000);
    return () => clearInterval(t);
  }, [heroMcList.length]);

  const heroMc = heroMcList[heroMcIdx] || null;

  const mcFallbackImages: Record<string, string> = {
    worship: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=700&h=500&fit=crop",
    leadership: "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=700&h=500&fit=crop",
    writing: "https://images.unsplash.com/photo-1455390582262-044cdead277a?w=700&h=500&fit=crop",
    music: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=700&h=500&fit=crop",
    general: "https://images.unsplash.com/photo-1504052434569-70ad5836ab65?w=700&h=500&fit=crop",
  };
  const heroMcImage = heroMc?.thumbnail || mcFallbackImages[heroMc?.category] || mcFallbackImages.general;

  useEffect(() => {
    if (promoDismissed) return;
    const timer = setInterval(() => setPromoIdx((i) => (i + 1) % LLM_PROMO_SLIDES.length), 6000);
    return () => clearInterval(timer);
  }, [promoDismissed]);

  const promo = LLM_PROMO_SLIDES[promoIdx];

  return (
    <LazyMotion features={domAnimation}>
      <>
      {/* PROMO BANNER LLM — Visible avant tout scroll */}
      {!promoDismissed && (
        <m.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className={`relative overflow-hidden bg-gradient-to-r ${promo.bg}`}>
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_left,rgba(212,175,55,0.06),transparent_50%)]" />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-4 relative">
            <div className="flex items-center gap-3 sm:gap-6">
              <div className={`hidden sm:flex w-10 h-10 rounded-xl bg-${promo.accent}/15 items-center justify-center text-${promo.accent} text-lg flex-shrink-0`}>
                {promo.icon}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="text-cream font-bold text-sm truncate">{promo.title}</span>
                  <span className="hidden md:inline text-cream/20 text-xs">|</span>
                  <span className="hidden md:inline text-cream/40 text-xs truncate">{promo.subtitle}</span>
                </div>
                <div className="hidden sm:flex items-center gap-4">
                  {promo.stats.map((s, i) => (
                    <span key={i} className="text-cream/30 text-[10px]"><strong className="text-gold text-xs">{s.v}</strong> {s.l}</span>
                  ))}
                </div>
              </div>
              <Link href={promo.href} className="flex-shrink-0 px-4 py-2 rounded-full bg-gradient-to-r from-gold to-gold-light text-navy font-bold text-[11px] hover:shadow-lg hover:shadow-gold/20 transition-all whitespace-nowrap">
                {promo.cta} <FaArrowRight className="inline ml-1 text-[9px]" />
              </Link>
              <div className="flex items-center gap-1 flex-shrink-0">
                <button onClick={() => setPromoIdx((i) => (i - 1 + LLM_PROMO_SLIDES.length) % LLM_PROMO_SLIDES.length)} className="w-6 h-6 rounded-full bg-cream/[0.04] flex items-center justify-center text-cream/20 hover:text-cream/60 transition-all text-[8px]"><FaChevronLeft /></button>
                <button onClick={() => setPromoIdx((i) => (i + 1) % LLM_PROMO_SLIDES.length)} className="w-6 h-6 rounded-full bg-cream/[0.04] flex items-center justify-center text-cream/20 hover:text-cream/60 transition-all text-[8px]"><FaChevronRight /></button>
                <button onClick={() => setPromoDismissed(true)} className="w-6 h-6 rounded-full bg-cream/[0.04] flex items-center justify-center text-cream/20 hover:text-cream/60 transition-all text-[8px] ml-1"><FaTimes /></button>
              </div>
            </div>
            {/* Slide dots */}
            <div className="flex items-center justify-center gap-1.5 mt-2">
              {LLM_PROMO_SLIDES.map((_, i) => (
                <button key={i} onClick={() => setPromoIdx(i)} className={`h-1 rounded-full transition-all ${i === promoIdx ? "w-5 bg-gold" : "w-1.5 bg-cream/10 hover:bg-cream/20"}`} />
              ))}
            </div>
          </div>
        </m.div>
      )}

      {/* HERO — Plus compact */}
      <section className="relative min-h-[85vh] sm:min-h-screen flex items-center overflow-hidden">
        <div className="absolute inset-0">
          <Image src="https://images.unsplash.com/photo-1504052434569-70ad5836ab65?w=1920&h=1080&fit=crop" alt="Transformation" fill className="object-cover" priority sizes="100vw" />
          <div className="absolute inset-0 bg-gradient-to-r from-dark via-dark/85 to-dark/40" />
          <div className="absolute inset-0 bg-gradient-to-t from-dark via-transparent to-dark/30" />
        </div>
        <FloatingParticles count={6} />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 grid lg:grid-cols-2 gap-8 lg:gap-12 items-center py-16 sm:py-24">
          <div>
            <m.div initial={{ opacity: 0, x: -40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
              <Badge variant="gold" className="mb-4 sm:mb-6 animate-pulse-glow text-xs">
                <FaStar className="inline mr-1" /> {t("home.badge")}
              </Badge>
            </m.div>
            <m.h1 initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }} className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.05] mb-6 sm:mb-8">
              <span className="text-cream">{t("home.hero.title1")}</span><br />
              <span className="text-gradient-gold gold-glow">{t("home.hero.title2")}</span>
            </m.h1>
            <m.p initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.5 }} className="text-base sm:text-lg md:text-xl text-cream/60 mb-8 sm:mb-10 max-w-lg leading-relaxed">
              {t("home.hero.desc")}
            </m.p>
            <m.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.8 }} className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <Link href="/inscription">
                <Button size="lg" className="group text-base sm:text-lg px-8 sm:px-10 py-4 sm:py-5 animate-pulse-glow w-full sm:w-auto">
                  {t("home.hero.cta")}
                  <FaArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link href="/masterclasses" className="flex items-center justify-center sm:justify-start gap-3 text-cream/70 hover:text-gold transition-all group">
                <span className="w-12 h-12 sm:w-14 sm:h-14 rounded-full border-2 border-gold/40 flex items-center justify-center group-hover:border-gold group-hover:bg-gold/10 transition-all group-hover:scale-110">
                  <FaPlay className="text-gold text-sm ml-0.5" />
                </span>
                <span className="font-medium">{t("home.hero.discover")}</span>
              </Link>
            </m.div>
          </div>
          <m.div initial={{ opacity: 0, scale: 0.8, rotate: 3 }} animate={{ opacity: 1, scale: 1, rotate: 0 }} transition={{ duration: 1, delay: 0.4 }} className="hidden lg:block">
            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-r from-gold/20 to-navy-light/30 rounded-3xl blur-2xl" />
              <div className="relative rounded-2xl overflow-hidden shadow-2xl shadow-black/50 ring-1 ring-gold/20">
                <AnimatePresence mode="wait">
                  <m.div key={heroMcIdx} initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -40 }} transition={{ duration: 0.5 }}>
                    <Link href={heroMc ? `/masterclasses/${heroMc.slug}` : "/masterclasses"} className="block group">
                      <Image src={heroMcImage} alt={heroMc ? (fr ? heroMc.title : heroMc.titleEn || heroMc.title) : "Masterclass"} width={700} height={500} className="object-cover transition-transform duration-700 group-hover:scale-105" />
                      <div className="absolute inset-0 bg-gradient-to-t from-dark/70 via-dark/20 to-transparent" />
                      <div className="absolute bottom-4 left-4 right-4">
                        <div className="glass rounded-xl p-3 flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gold flex items-center justify-center text-navy group-hover:scale-110 transition-transform">
                            <FaPlay className="text-xs ml-0.5" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="text-cream font-bold text-xs truncate">
                              {heroMc ? (fr ? heroMc.title : heroMc.titleEn || heroMc.title) : t("home.hero.masterclass")}
                            </div>
                            <div className="text-cream/50 text-[10px] truncate">
                              {heroMc ? (fr ? heroMc.shortDesc : heroMc.shortDescEn || heroMc.shortDesc) : t("home.hero.masterclass.sub")}
                            </div>
                          </div>
                          <div className="ml-auto flex-shrink-0">
                            {heroMc && heroMc.seatsLeft < heroMc.maxSeats * 0.3 ? (
                              <span className="px-2.5 py-0.5 rounded-full bg-red-500/20 text-red-400 text-[10px] font-bold animate-pulse">{fr ? "COMPLET" : "FULL"}</span>
                            ) : (
                              <div className="animate-border-dance rounded-full px-2.5 py-0.5">
                                <span className="text-white text-[10px] font-bold">LIVE</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                      {heroMc && (
                        <div className="absolute top-3 right-3 flex gap-2">
                          {heroMc.certificateIncluded && <span className="px-3 py-1 rounded-lg bg-black/60 text-emerald-400 text-[11px] font-bold backdrop-blur-md border border-emerald-400/30"><FaCertificate className="inline mr-1 text-[10px]" />{fr ? "Certifie" : "Certified"}</span>}
                          <span className="px-3 py-1 rounded-lg bg-black/60 text-gold text-[11px] font-bold backdrop-blur-md border border-gold/30">
                            <FaCalendarAlt className="inline mr-1 text-[10px]" />{new Date(heroMc.startDate).toLocaleDateString(fr ? "fr-FR" : "en-US", { day: "numeric", month: "short" })}
                          </span>
                        </div>
                      )}
                    </Link>
                  </m.div>
                </AnimatePresence>
                {/* Mini dots + progress */}
                {heroMcList.length > 1 && (
                  <div className="absolute bottom-[72px] left-4 flex items-center gap-1.5 z-10">
                    {heroMcList.map((_, i) => (
                      <button key={i} onClick={(e) => { e.preventDefault(); setHeroMcIdx(i); }}
                        className={`rounded-full transition-all duration-300 ${i === heroMcIdx ? "w-6 h-1.5 bg-gold" : "w-1.5 h-1.5 bg-cream/25 hover:bg-cream/50"}`} />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </m.div>
        </div>
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 hidden sm:block">
          <m.div animate={{ y: [0, 8, 0] }} transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="flex flex-col items-center gap-2 cursor-pointer group"
            onClick={() => window.scrollBy({ top: window.innerHeight * 0.8, behavior: "smooth" })}>
            <span className="text-cream/40 text-[10px] uppercase tracking-[0.25em] font-semibold group-hover:text-gold transition-colors">Scroll</span>
            <svg width="16" height="24" viewBox="0 0 16 24" fill="none" className="text-gold/60 group-hover:text-gold transition-colors">
              <path d="M8 0v18M2 14l6 6 6-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </m.div>
        </div>
      </section>

      {/* STATS — Plus compact */}
      <section className="py-8 sm:py-12 relative">
        <div className="absolute inset-0 animate-shimmer" />
        <div className="max-w-5xl mx-auto px-4 sm:px-6 relative">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-8">
            <AnimatedCounter end={parseInt(siteContent.stat_students) || 2500} suffix="+" label={siteContent.stat_students_label || t("home.stats.years")} />
            <AnimatedCounter end={parseInt(siteContent.stat_courses) || 45} suffix="+" label={siteContent.stat_courses_label || t("home.stats.formations")} />
            <AnimatedCounter end={parseInt(siteContent.stat_countries) || 30} suffix="+" label={siteContent.stat_countries_label || t("home.stats.lives")} />
            <AnimatedCounter end={parseInt(siteContent.stat_satisfaction) || 98} suffix="%" label={siteContent.stat_satisfaction_label || t("home.stats.satisfaction")} />
          </div>
        </div>
      </section>

      {/* FORMATIONS — Plus compact */}
      <section className="py-10 sm:py-16 px-4 sm:px-6 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-dark via-navy/10 to-dark" />
        <div className="max-w-7xl mx-auto relative">
          <AnimatedSection className="text-center mb-8 sm:mb-12">
            <Badge variant="gold" className="mb-3">{t("home.programs.badge")}</Badge>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-cream mb-3">
              {t("home.programs.title1")} <span className="text-gradient-gold">{t("home.programs.title2")}</span>
            </h2>
            <p className="text-cream/50 max-w-xl mx-auto text-sm sm:text-base">{t("home.programs.desc")}</p>
          </AnimatedSection>
          <FormationCarousel />
        </div>
      </section>

      {/* MASTERCLASSES LORD LOMBO — Carousel innovant */}
      <MasterclassShowcase />

      {/* POURQUOI NOUS — Compact 2x3 grid */}
      <section className="py-10 sm:py-16 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <AnimatedSection className="text-center mb-8 sm:mb-12">
            <Badge variant="gold" className="mb-3">{t("home.why.badge")}</Badge>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-cream mb-3">
              {t("home.why.title1")} <span className="text-gradient-gold">{t("home.why.title2")}</span>
            </h2>
          </AnimatedSection>
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            {featureKeys.map((f, i) => (
              <AnimatedSection key={f.titleKey} delay={i * 0.08}>
                <div className="relative rounded-xl sm:rounded-2xl overflow-hidden card-hover-lift group h-[200px] sm:h-[240px]">
                  <Image src={f.image} alt={t(f.titleKey)} fill className="object-cover transition-transform duration-700 group-hover:scale-110" sizes="(max-width: 768px) 50vw, 33vw" />
                  <div className="absolute inset-0 bg-gradient-to-t from-dark via-dark/70 to-dark/20 group-hover:from-dark group-hover:via-dark/80 transition-all duration-500" />
                  <div className="absolute inset-0 flex flex-col justify-end p-4 sm:p-6">
                    <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-lg sm:rounded-xl bg-gold/20 backdrop-blur-sm flex items-center justify-center text-gold mb-2 sm:mb-3 group-hover:bg-gold/30 group-hover:scale-110 transition-all duration-300">{f.icon}</div>
                    <h3 className="text-sm sm:text-base font-bold text-cream mb-1 group-hover:text-gold transition-colors">{t(f.titleKey)}</h3>
                    <p className="text-cream/50 text-[10px] sm:text-xs leading-relaxed line-clamp-2">{t(f.descKey)}</p>
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* TEMOIGNAGES — Compact */}
      <section className="py-10 sm:py-16 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <AnimatedSection className="text-center mb-8 sm:mb-12">
            <Badge variant="gold" className="mb-3">{t("home.testimonials.badge")}</Badge>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-cream mb-3">
              {t("home.testimonials.title1")} <span className="text-gradient-gold">{t("home.testimonials.title2")}</span>
            </h2>
          </AnimatedSection>
          <TestimonialCarousel dynamicTestimonials={siteContent.testimonials ? (() => { try { return JSON.parse(siteContent.testimonials); } catch { return undefined; } })() : undefined} />
        </div>
      </section>

      {/* CTA — Compact */}
      <section className="relative py-12 sm:py-16 overflow-hidden">
        <div className="absolute inset-0">
          <Image src="https://images.unsplash.com/photo-1507925921958-8a62f3d1a50d?w=1920&h=600&fit=crop" alt="CTA" fill className="object-cover" sizes="100vw" />
          <div className="absolute inset-0 bg-gradient-to-r from-dark via-dark/90 to-dark/80" />
        </div>
        <div className="max-w-3xl mx-auto text-center relative z-10 px-4 sm:px-6">
          <AnimatedSection>
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-cream mb-4 leading-tight">
              {t("home.cta.title1")} <span className="text-gradient-gold">{t("home.cta.title2")}</span> ?
            </h2>
            <p className="text-cream/50 text-sm sm:text-base md:text-lg mb-8 max-w-xl mx-auto">{t("home.cta.desc")}</p>
            <Link href="/inscription">
              <Button size="lg" className="text-base sm:text-lg px-8 sm:px-12 py-4 sm:py-5 animate-pulse-glow">
                {t("home.cta.button")}
                <FaArrowRight className="ml-3" />
              </Button>
            </Link>
            <p className="text-cream/30 text-xs mt-4">{t("home.cta.sub")} &bull; {t("home.cta.sub2")} &bull; {t("home.cta.sub3")}</p>
          </AnimatedSection>
        </div>
      </section>

      {/* MINISTERE HUB — Plus compact avec visual impact */}
      <section className="relative py-12 sm:py-16 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-dark via-[#0a1628]/60 to-dark" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(212,175,55,0.04),transparent_60%)]" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative">
          <AnimatedSection className="text-center mb-8 sm:mb-10">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold/10 border border-gold/15 text-gold text-[10px] sm:text-xs font-medium tracking-wider uppercase mb-3">
              <FaStar className="text-[8px]" /> Lord Lombo Ministries
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-cream mb-2">
              Au-dela de l&apos;academie, <span className="text-gradient-gold">un ministere</span>
            </h2>
            <p className="text-cream/35 text-xs sm:text-sm max-w-xl mx-auto">Musique, livres, evenements, predications — l&apos;ecosysteme complet</p>
          </AnimatedSection>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
            {[
              { icon: <FaMusic />, title: "Musique", desc: "Emmanuel, Amoureux, C.H.A", href: "/ministere/musique", color: "from-red-500/10 to-red-500/5", iconColor: "text-red-400" },
              { icon: <FaBookOpen />, title: "Livres", desc: "Les Tenebres de Dieu", href: "/ministere/livres", color: "from-amber-500/10 to-amber-500/5", iconColor: "text-amber-400" },
              { icon: <FaCalendarAlt />, title: "Evenements", desc: "Conferences & concerts", href: "/ministere/evenements", color: "from-purple-500/10 to-purple-500/5", iconColor: "text-purple-400" },
              { icon: <FaHandHoldingHeart />, title: "Soutenir", desc: "Participez a l'impact", href: "/ministere/dons", color: "from-rose-500/10 to-rose-500/5", iconColor: "text-rose-400" },
            ].map((p, i) => (
              <Link key={i} href={p.href} className={`group p-4 sm:p-5 rounded-xl sm:rounded-2xl bg-gradient-to-br ${p.color} border border-cream/[0.06] hover:border-gold/20 transition-all text-center`}>
                <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-cream/[0.04] flex items-center justify-center mx-auto mb-2 sm:mb-3 ${p.iconColor} text-lg sm:text-xl group-hover:scale-110 transition-transform`}>{p.icon}</div>
                <h3 className="text-cream font-bold text-xs sm:text-sm mb-1 group-hover:text-gold transition-colors">{p.title}</h3>
                <p className="text-cream/25 text-[10px] sm:text-xs leading-relaxed hidden sm:block">{p.desc}</p>
              </Link>
            ))}
          </div>

          {/* Bande Lord Lombo — Plus compact */}
          <div className="rounded-xl sm:rounded-2xl overflow-hidden relative glass-card">
            <div className="h-[2px] bg-gradient-to-r from-transparent via-gold/40 to-transparent" />
            <div className="grid lg:grid-cols-2 gap-0 items-center">
              <div className="p-5 sm:p-8">
                <div className="flex items-center gap-2 mb-3">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-emerald-400 text-[10px] sm:text-xs font-medium">Actif dans 50+ pays</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-bold font-heading text-cream mb-2">
                  377K abonnes <span className="text-gradient-gold">115M+ vues</span>
                </h3>
                <p className="text-cream/35 text-xs leading-relaxed mb-4">
                  Pasteur, chantre, ecrivain et coach — Lord Lombo impacte des millions de vies.
                </p>
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {["Pasteur", "Chantre", "Ecrivain", "Coach", "Visionnaire"].map((r) => (
                    <span key={r} className="px-2 py-1 rounded-full bg-cream/[0.03] border border-cream/[0.06] text-cream/40 text-[10px]">{r}</span>
                  ))}
                </div>
                <div className="flex flex-wrap gap-2">
                  <Link href="/a-propos" className="flex items-center gap-2 px-4 sm:px-5 py-2 sm:py-2.5 rounded-full bg-gradient-to-r from-gold to-gold-light text-navy font-bold text-xs hover:shadow-lg hover:shadow-gold/25 transition-all hover:scale-105">
                    Decouvrir <FaArrowRight className="text-[9px]" />
                  </Link>
                  <a href="https://www.youtube.com/@LordLomboOfficial" target="_blank" rel="noopener" className="flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-full border border-cream/[0.08] text-cream/40 text-xs hover:border-red-400/30 hover:text-red-400 transition-all">
                    <FaYoutube /> <span className="hidden sm:inline">YouTube</span>
                  </a>
                </div>
              </div>
              <div className="relative h-48 sm:h-56 lg:h-full min-h-[200px]">
                <Image src="/images/lord-lombo.jpeg" alt="Lord Lombo" fill className="object-cover object-top" sizes="600px" />
                <div className="absolute inset-0 bg-gradient-to-r from-dark via-dark/30 to-transparent lg:bg-gradient-to-l" />
                <div className="absolute bottom-3 left-3 right-3">
                  <div className="glass-card rounded-lg p-2.5 flex items-center gap-2 w-fit">
                    <FaQuoteLeft className="text-gold/40 text-xs" />
                    <p className="text-cream/50 text-[10px] italic font-heading">&ldquo;Impacter les nations a travers chaque talent recu&rdquo;</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
    </LazyMotion>
  );
}
