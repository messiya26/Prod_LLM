"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { AnimatedSection, GoldDivider, Badge } from "@/components/ui";
import { FloatingParticles } from "@/components/ui/floating-particles";
import { TestimonialCarousel } from "@/components/ui/testimonial-carousel";
import { FaHeart, FaLightbulb, FaHandsHelping, FaRocket, FaTrophy, FaGlobeAfrica, FaQuoteLeft, FaChalkboardTeacher, FaUsers, FaLaptop, FaGraduationCap } from "react-icons/fa";
import { useI18n } from "@/context/i18n-context";

export default function APropos() {
  const { t } = useI18n();

  const values = [
    { icon: <FaTrophy className="text-2xl" />, titleKey: "about.val.excellence", descKey: "about.val.excellence.desc" },
    { icon: <FaGlobeAfrica className="text-2xl" />, titleKey: "about.val.access", descKey: "about.val.access.desc" },
    { icon: <FaHandsHelping className="text-2xl" />, titleKey: "about.val.accomp", descKey: "about.val.accomp.desc" },
    { icon: <FaRocket className="text-2xl" />, titleKey: "about.val.innovation", descKey: "about.val.innovation.desc" },
    { icon: <FaHeart className="text-2xl" />, titleKey: "about.val.amour", descKey: "about.val.amour.desc" },
    { icon: <FaLightbulb className="text-2xl" />, titleKey: "about.val.transform", descKey: "about.val.transform.desc" },
  ];

  const timeline = [
    { year: "2015", eventKey: "about.timeline.2015", icon: <FaChalkboardTeacher />, stat: "50+", statLabel: "Leaders formes", color: "from-gold/20 to-gold/5" },
    { year: "2019", eventKey: "about.timeline.2019", icon: <FaUsers />, stat: "500+", statLabel: "Pasteurs & chantres", color: "from-blue-500/20 to-blue-500/5" },
    { year: "2024", eventKey: "about.timeline.2024", icon: <FaLaptop />, stat: "100%", statLabel: "Digital", color: "from-emerald-500/20 to-emerald-500/5" },
    { year: "2026", eventKey: "about.timeline.2026", icon: <FaGraduationCap />, stat: "Global", statLabel: "Lancement mondial", color: "from-purple-500/20 to-purple-500/5" },
  ];

  return (
    <>
      <section className="relative py-12 md:py-16 overflow-hidden">
        <div className="absolute inset-0">
          <Image src="https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=1920&h=600&fit=crop" alt="Lord Lombo" fill className="object-cover" priority sizes="100vw" />
          <div className="absolute inset-0 bg-gradient-to-b from-dark/80 via-dark/70 to-dark" />
        </div>
        <FloatingParticles count={8} />
        <div className="max-w-4xl mx-auto px-6 relative z-10 text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
            <Badge variant="gold" className="mb-6">{t("about.badge")}</Badge>
            <h1 className="text-4xl md:text-6xl font-bold text-cream mb-6 leading-tight">
              Lord Lombo <span className="text-gradient-gold">Academie</span>
            </h1>
            <p className="text-cream/55 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
              {t("about.subtitle")}
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-12 md:py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <AnimatedSection>
              <div className="relative rounded-2xl overflow-hidden h-[400px] lg:h-[500px]">
                <Image src="/lord-lombo.jpg" alt="Lord Lombo" fill className="object-cover object-top brightness-105 contrast-105 saturate-[0.9]" sizes="(max-width: 1024px) 100vw, 50vw" />
                <div className="absolute inset-0 bg-gradient-to-t from-dark/50 via-dark/10 to-dark/20" />
              </div>
            </AnimatedSection>

            <AnimatedSection delay={0.2}>
              <Badge variant="gold" className="mb-4">{t("about.founder")}</Badge>
              <h2 className="text-3xl md:text-4xl font-bold text-cream mb-6">
                {t("about.founder.title")} <span className="text-gradient-gold">Lord Lombo</span>
              </h2>
              <div className="space-y-4 text-cream/60 leading-relaxed">
                <p>{t("about.founder.p1")}</p>
                <p>
                  {t("about.founder.p2.pre")} <span className="text-gold font-semibold">{t("about.founder.p2")}</span> {t("about.founder.p2.post")}
                </p>
              </div>

              <div className="glass rounded-xl p-5 mt-8 gold-border-glow">
                <div className="flex items-start gap-3">
                  <FaQuoteLeft className="text-gold/30 text-2xl flex-shrink-0 mt-1" />
                  <div>
                    <p className="text-cream/70 italic leading-relaxed">&ldquo;{t("about.quote")}&rdquo;</p>
                    <p className="text-gold text-sm font-semibold mt-3">— Lord Lombo</p>
                  </div>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      <section className="py-12 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8">
            <AnimatedSection>
              <div className="glass rounded-3xl p-8 md:p-10 gold-border-glow h-full">
                <Badge variant="gold" className="mb-4">{t("about.mission")}</Badge>
                <h3 className="text-2xl font-bold text-cream mb-4">{t("about.mission.title")}</h3>
                <p className="text-cream/55 leading-relaxed">{t("about.mission.desc")}</p>
              </div>
            </AnimatedSection>
            <AnimatedSection delay={0.15}>
              <div className="glass rounded-3xl p-8 md:p-10 gold-border-glow h-full">
                <Badge variant="gold" className="mb-4">{t("about.vision")}</Badge>
                <h3 className="text-2xl font-bold text-cream mb-4">{t("about.vision.title")}</h3>
                <p className="text-cream/55 leading-relaxed">{t("about.vision.desc")}</p>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      <GoldDivider width="w-48" />

      <section className="py-16 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-navy/15 via-dark to-dark" />
        <div className="max-w-6xl mx-auto relative">
          <AnimatedSection className="text-center mb-16">
            <Badge variant="gold" className="mb-4">{t("about.history")}</Badge>
            <h2 className="text-3xl md:text-5xl font-bold text-cream">
              {t("about.history.title")} <span className="text-gradient-gold">l&apos;Academie</span>
            </h2>
            <p className="text-cream/45 mt-4 max-w-xl mx-auto">{t("about.history.subtitle")}</p>
          </AnimatedSection>

          {/* Desktop: horizontal timeline */}
          <div className="hidden md:block relative">
            <div className="absolute top-[60px] left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-gold/30 to-transparent" />
            <div className="grid grid-cols-4 gap-6">
              {timeline.map((item, i) => (
                <AnimatedSection key={item.year} delay={i * 0.15}>
                  <div className="relative flex flex-col items-center group">
                    <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${item.color} border border-gold/10 flex items-center justify-center text-gold text-2xl mb-4 group-hover:scale-110 group-hover:border-gold/30 transition-all duration-500 shadow-lg shadow-gold/5`}>
                      {item.icon}
                    </div>
                    <div className="w-3 h-3 rounded-full bg-gold shadow-lg shadow-gold/40 ring-4 ring-dark mb-4 group-hover:scale-125 transition-transform" />
                    <div className="w-px h-8 bg-gradient-to-b from-gold/40 to-transparent mb-4" />
                    <div className="glass rounded-2xl p-6 text-center w-full group-hover:border-gold/20 transition-all duration-500 card-hover-lift">
                      <div className="text-gold font-bold text-2xl font-serif mb-2">{item.year}</div>
                      <p className="text-cream/55 text-sm leading-relaxed mb-4">{t(item.eventKey)}</p>
                      <div className="pt-3 border-t border-cream/[0.06]">
                        <div className="text-2xl font-bold text-gradient-gold font-serif">{item.stat}</div>
                        <div className="text-cream/25 text-[10px] uppercase tracking-wider mt-0.5">{item.statLabel}</div>
                      </div>
                    </div>
                  </div>
                </AnimatedSection>
              ))}
            </div>
          </div>

          {/* Mobile: vertical zigzag */}
          <div className="md:hidden relative">
            <div className="absolute left-8 top-0 bottom-0 w-[2px] bg-gradient-to-b from-gold/40 via-gold/20 to-transparent" />
            {timeline.map((item, i) => (
              <AnimatedSection key={item.year} delay={i * 0.15}>
                <div className="flex items-start gap-6 mb-10 relative">
                  <div className="flex flex-col items-center flex-shrink-0">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${item.color} border border-gold/10 flex items-center justify-center text-gold text-lg z-10`}>
                      {item.icon}
                    </div>
                    <div className="w-3 h-3 rounded-full bg-gold shadow-lg shadow-gold/30 ring-3 ring-dark mt-2" />
                  </div>
                  <div className="glass rounded-xl p-5 flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-gold font-bold text-xl font-serif">{item.year}</span>
                      <span className="px-2 py-0.5 rounded-full bg-gold/10 text-gold text-[10px] font-medium">{item.stat}</span>
                    </div>
                    <p className="text-cream/55 text-sm leading-relaxed">{t(item.eventKey)}</p>
                    <div className="text-cream/20 text-[10px] mt-2">{item.statLabel}</div>
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <AnimatedSection className="text-center mb-14">
            <Badge variant="gold" className="mb-4">{t("about.values")}</Badge>
            <h2 className="text-3xl md:text-5xl font-bold text-cream">{t("about.values.title")} <span className="text-gradient-gold">{t("about.values.title2")}</span></h2>
          </AnimatedSection>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {values.map((v, i) => (
              <AnimatedSection key={v.titleKey} delay={i * 0.1}>
                <div className="glass rounded-2xl p-7 card-hover-lift group h-full">
                  <div className="w-12 h-12 rounded-xl bg-gold/10 flex items-center justify-center text-gold mb-5 group-hover:bg-gold/20 group-hover:scale-110 transition-all duration-300">{v.icon}</div>
                  <h3 className="text-lg font-bold text-cream mb-2 group-hover:text-gold transition-colors">{t(v.titleKey)}</h3>
                  <p className="text-cream/45 text-sm leading-relaxed">{t(v.descKey)}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      <GoldDivider width="w-48" />

      <section className="py-12 md:py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <AnimatedSection className="text-center mb-14">
            <Badge variant="gold" className="mb-4">{t("about.testimonials")}</Badge>
            <h2 className="text-3xl md:text-5xl font-bold text-cream mb-5">
              {t("about.testimonials.title")} <span className="text-gradient-gold">{t("about.testimonials.title2")}</span>
            </h2>
            <p className="text-cream/45 max-w-xl mx-auto">{t("about.testimonials.desc")}</p>
          </AnimatedSection>
          <TestimonialCarousel />
        </div>
      </section>
    </>
  );
}
