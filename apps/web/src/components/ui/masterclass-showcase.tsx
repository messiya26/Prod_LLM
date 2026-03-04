"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { AnimatedSection, Badge } from "@/components/ui";
import {
  FaCrown, FaArrowRight, FaChevronLeft, FaChevronRight,
  FaCalendarAlt, FaClock, FaUsers, FaMapMarkerAlt, FaCertificate,
  FaFire, FaStar, FaPlayCircle,
} from "react-icons/fa";
import { useI18n } from "@/context/i18n-context";
import api from "@/lib/api";

const catColors: Record<string, { bg: string; text: string; gradient: string }> = {
  worship: { bg: "bg-indigo-500/15", text: "text-indigo-400", gradient: "from-indigo-600/20 via-purple-600/10 to-transparent" },
  leadership: { bg: "bg-amber-500/15", text: "text-amber-400", gradient: "from-amber-600/20 via-orange-600/10 to-transparent" },
  writing: { bg: "bg-emerald-500/15", text: "text-emerald-400", gradient: "from-emerald-600/20 via-teal-600/10 to-transparent" },
  music: { bg: "bg-rose-500/15", text: "text-rose-400", gradient: "from-rose-600/20 via-pink-600/10 to-transparent" },
  general: { bg: "bg-gold/15", text: "text-gold", gradient: "from-gold/20 via-gold/5 to-transparent" },
};

export function MasterclassShowcase() {
  const [masterclasses, setMasterclasses] = useState<any[]>([]);
  const [active, setActive] = useState(0);
  const [direction, setDirection] = useState(0);
  const { locale } = useI18n();
  const fr = locale === "fr";

  useEffect(() => {
    api.get("/masterclasses?status=PUBLISHED&limit=6").then((res: any) => {
      const list = Array.isArray(res) ? res : res.data || [];
      setMasterclasses(list);
    }).catch(() => {});
  }, []);

  const next = useCallback(() => {
    if (masterclasses.length === 0) return;
    setDirection(1);
    setActive((i) => (i + 1) % masterclasses.length);
  }, [masterclasses.length]);

  const prev = useCallback(() => {
    if (masterclasses.length === 0) return;
    setDirection(-1);
    setActive((i) => (i - 1 + masterclasses.length) % masterclasses.length);
  }, [masterclasses.length]);

  useEffect(() => {
    if (masterclasses.length <= 1) return;
    const t = setInterval(next, 5000);
    return () => clearInterval(t);
  }, [masterclasses.length, next]);

  if (masterclasses.length === 0) return null;

  const mc = masterclasses[active];
  const cat = catColors[mc.category] || catColors.general;
  const days = Math.max(1, Math.ceil((new Date(mc.endDate).getTime() - new Date(mc.startDate).getTime()) / 86400000));
  const sym = mc.currency === "EUR" ? "\u20ac" : mc.currency === "XAF" ? "FCFA " : "$";
  const pctFull = ((mc.maxSeats - mc.seatsLeft) / mc.maxSeats) * 100;
  const du = Math.max(0, Math.ceil((new Date(mc.startDate).getTime() - Date.now()) / 86400000));

  const variants = {
    enter: (d: number) => ({ x: d > 0 ? 300 : -300, opacity: 0, scale: 0.95 }),
    center: { x: 0, opacity: 1, scale: 1 },
    exit: (d: number) => ({ x: d > 0 ? -300 : 300, opacity: 0, scale: 0.95 }),
  };

  return (
    <section className="py-10 sm:py-16 px-4 sm:px-6 relative overflow-hidden">
      <div className={`absolute inset-0 bg-gradient-to-br ${cat.gradient} transition-all duration-700`} />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,rgba(212,175,55,0.06),transparent_50%)]" />

      <div className="max-w-7xl mx-auto relative">
        <AnimatedSection className="text-center mb-8 sm:mb-10">
          <Badge variant="gold" className="mb-3">
            <FaCrown className="inline mr-1 text-[10px]" /> {fr ? "Masterclasses Lord Lombo" : "Lord Lombo Masterclasses"}
          </Badge>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-cream mb-2">
            {fr ? "Experiences " : "Transformative "}
            <span className="text-gradient-gold">{fr ? "transformatrices" : "experiences"}</span>
          </h2>
          <p className="text-cream/40 text-sm max-w-lg mx-auto">
            {fr
              ? "Sessions intensives avec le Pasteur Lord Lombo. Places limitees."
              : "Intensive sessions with Pastor Lord Lombo. Limited seats."}
          </p>
        </AnimatedSection>

        <div className="relative">
          {/* Navigation arrows */}
          {masterclasses.length > 1 && (
            <>
              <button onClick={prev} className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-2 z-20 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-cream/[0.06] backdrop-blur-md border border-cream/10 flex items-center justify-center text-cream/40 hover:text-gold hover:border-gold/30 transition-all hover:scale-110">
                <FaChevronLeft />
              </button>
              <button onClick={next} className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-2 z-20 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-cream/[0.06] backdrop-blur-md border border-cream/10 flex items-center justify-center text-cream/40 hover:text-gold hover:border-gold/30 transition-all hover:scale-110">
                <FaChevronRight />
              </button>
            </>
          )}

          {/* Main card */}
          <div className="overflow-hidden rounded-2xl sm:rounded-3xl">
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={mc.id}
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.4, ease: "easeInOut" }}
              >
                <div className="rounded-2xl sm:rounded-3xl border border-gold/15 bg-[#0a1628]/80 backdrop-blur-xl overflow-hidden">
                  <div className="grid lg:grid-cols-5 min-h-[320px] sm:min-h-[360px]">
                    {/* Left visual */}
                    <div className="lg:col-span-2 relative bg-gradient-to-br from-gold/10 via-transparent to-transparent p-6 sm:p-8 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center gap-2 mb-4 flex-wrap">
                          <span className={`px-2.5 py-1 rounded-full ${cat.bg} ${cat.text} text-[10px] font-bold uppercase tracking-wider`}>
                            {mc.category}
                          </span>
                          {mc.isFeatured && (
                            <span className="px-2.5 py-1 rounded-full bg-gold/20 text-gold text-[10px] font-bold flex items-center gap-1">
                              <FaFire className="text-[8px]" /> {fr ? "Populaire" : "Popular"}
                            </span>
                          )}
                        </div>
                        <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-cream mb-3 leading-tight">
                          {fr ? mc.title : mc.titleEn || mc.title}
                        </h3>
                        <p className="text-cream/40 text-sm leading-relaxed line-clamp-3">
                          {fr ? mc.shortDesc : mc.shortDescEn || mc.shortDesc}
                        </p>
                      </div>

                      {/* Instructor badge */}
                      {mc.instructor && (
                        <div className="flex items-center gap-3 mt-4 sm:mt-6">
                          <div className="w-10 h-10 rounded-full bg-gold/20 flex items-center justify-center text-gold font-bold text-sm">
                            {mc.instructor.firstName?.[0]}{mc.instructor.lastName?.[0]}
                          </div>
                          <div>
                            <p className="text-cream text-sm font-bold">{mc.instructor.firstName} {mc.instructor.lastName}</p>
                            <p className="text-cream/25 text-[10px]">{fr ? "Instructeur" : "Instructor"}</p>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Right details */}
                    <div className="lg:col-span-3 p-6 sm:p-8 flex flex-col justify-between border-t lg:border-t-0 lg:border-l border-cream/[0.06]">
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
                        {[
                          { icon: <FaCalendarAlt />, label: new Date(mc.startDate).toLocaleDateString(fr ? "fr-FR" : "en-US", { day: "numeric", month: "short" }), sub: days + (fr ? " jour(s)" : " day(s)") },
                          { icon: <FaClock />, label: `${mc.dailyStartTime}-${mc.dailyEndTime}`, sub: mc.timezone || "UTC" },
                          { icon: <FaUsers />, label: `${mc.seatsLeft}/${mc.maxSeats}`, sub: fr ? "places" : "seats" },
                          { icon: <FaCertificate />, label: mc.certificateIncluded ? (fr ? "Inclus" : "Included") : "-", sub: fr ? "Certificat" : "Certificate" },
                        ].map((item, i) => (
                          <div key={i} className="text-center p-3 rounded-xl bg-cream/[0.03] border border-cream/[0.04]">
                            <span className="text-gold text-sm mb-1 block">{item.icon}</span>
                            <span className="text-cream font-bold text-sm block">{item.label}</span>
                            <span className="text-cream/25 text-[10px]">{item.sub}</span>
                          </div>
                        ))}
                      </div>

                      {/* Progress bar */}
                      <div className="mb-4">
                        <div className="flex justify-between text-[10px] mb-1.5">
                          <span className="text-cream/30">{fr ? "Places restantes" : "Remaining seats"}</span>
                          <span className={`font-bold ${pctFull > 70 ? "text-red-400" : "text-gold"}`}>{Math.round(pctFull)}% {fr ? "rempli" : "filled"}</span>
                        </div>
                        <div className="w-full h-1.5 rounded-full bg-cream/[0.06] overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${pctFull}%` }}
                            transition={{ duration: 1 }}
                            className={`h-full rounded-full ${pctFull > 80 ? "bg-red-400" : pctFull > 50 ? "bg-orange-400" : "bg-gold"}`}
                          />
                        </div>
                      </div>

                      {/* Price + CTA */}
                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <div>
                          <div className="text-2xl sm:text-3xl font-bold text-cream">
                            {mc.price === 0 ? (fr ? "Gratuit" : "Free") : `${sym}${mc.price}`}
                          </div>
                          {mc.earlyBirdPrice && mc.earlyBirdEnd && new Date() < new Date(mc.earlyBirdEnd) && (
                            <span className="text-emerald-400 text-xs font-bold">Early Bird: {sym}{mc.earlyBirdPrice}</span>
                          )}
                          {du > 0 && <p className="text-cream/25 text-xs mt-0.5">{fr ? `Dans ${du} jours` : `In ${du} days`}</p>}
                        </div>
                        <Link href={`/masterclasses/${mc.slug}`}
                          className="inline-flex items-center gap-2 px-6 sm:px-8 py-3 sm:py-3.5 rounded-xl bg-gradient-to-r from-gold to-gold-light text-navy font-bold text-sm hover:shadow-xl hover:shadow-gold/25 transition-all hover:scale-105 group">
                          {fr ? "Decouvrir" : "Discover"}
                          <FaArrowRight className="text-xs group-hover:translate-x-1 transition-transform" />
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Dots */}
          {masterclasses.length > 1 && (
            <div className="flex items-center justify-center gap-2 mt-6">
              {masterclasses.map((_, i) => (
                <button key={i} onClick={() => { setDirection(i > active ? 1 : -1); setActive(i); }}
                  className={`transition-all rounded-full ${i === active ? "w-8 h-2 bg-gold" : "w-2 h-2 bg-cream/15 hover:bg-cream/30"}`} />
              ))}
            </div>
          )}

          {/* Thumbnails */}
          {masterclasses.length > 1 && (
            <div className="flex items-center justify-center gap-3 mt-4 overflow-x-auto pb-2">
              {masterclasses.map((m, i) => {
                const c = catColors[m.category] || catColors.general;
                return (
                  <button key={m.id} onClick={() => { setDirection(i > active ? 1 : -1); setActive(i); }}
                    className={`flex-shrink-0 px-4 py-2.5 rounded-xl border transition-all text-left min-w-[140px] ${
                      i === active ? "border-gold/30 bg-gold/10" : "border-cream/[0.06] bg-cream/[0.02] hover:border-cream/15"
                    }`}>
                    <p className={`text-xs font-bold truncate ${i === active ? "text-gold" : "text-cream/50"}`}>
                      {fr ? m.title : m.titleEn || m.title}
                    </p>
                    <p className="text-cream/20 text-[10px] mt-0.5">
                      {new Date(m.startDate).toLocaleDateString(fr ? "fr-FR" : "en-US", { day: "numeric", month: "short" })}
                    </p>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* CTA to all masterclasses */}
        <div className="text-center mt-8">
          <Link href="/masterclasses" className="inline-flex items-center gap-2 text-gold hover:text-gold-light text-sm font-medium transition-all group">
            {fr ? "Voir toutes les masterclasses" : "View all masterclasses"}
            <FaArrowRight className="text-xs group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </section>
  );
}
