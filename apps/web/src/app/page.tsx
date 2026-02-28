"use client";

import dynamic from "next/dynamic";
import { LazyMotion, domAnimation, m } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Button, AnimatedSection, GoldDivider, Badge } from "@/components/ui";
import { FloatingParticles } from "@/components/ui/floating-particles";
import { AnimatedCounter } from "@/components/ui/animated-counter";
import { useI18n } from "@/context/i18n-context";
import { FaPlay, FaCrown, FaCross, FaCertificate, FaGlobe, FaHandsHelping, FaStar, FaArrowRight, FaBookOpen } from "react-icons/fa";

const TestimonialCarousel = dynamic(() => import("@/components/ui/testimonial-carousel").then(m => ({ default: m.TestimonialCarousel })), { ssr: false });
const FormationCarousel = dynamic(() => import("@/components/ui/formation-carousel").then(m => ({ default: m.FormationCarousel })), { ssr: false });

const featureKeys = [
  { icon: <FaCross className="text-3xl" />, titleKey: "feature.croissance", descKey: "feature.croissance.desc", image: "https://images.unsplash.com/photo-1504052434569-70ad5836ab65?w=400&h=300&fit=crop" },
  { icon: <FaCrown className="text-3xl" />, titleKey: "feature.leadership", descKey: "feature.leadership.desc", image: "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=400&h=300&fit=crop" },
  { icon: <FaBookOpen className="text-3xl" />, titleKey: "feature.pastorale", descKey: "feature.pastorale.desc", image: "https://images.unsplash.com/photo-1507925921958-8a62f3d1a50d?w=400&h=300&fit=crop" },
  { icon: <FaHandsHelping className="text-3xl" />, titleKey: "feature.coaching", descKey: "feature.coaching.desc", image: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=300&fit=crop" },
  { icon: <FaGlobe className="text-3xl" />, titleKey: "feature.online", descKey: "feature.online.desc", image: "https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=400&h=300&fit=crop" },
  { icon: <FaCertificate className="text-3xl" />, titleKey: "feature.certificats", descKey: "feature.certificats.desc", image: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=400&h=300&fit=crop" },
];

const stepKeys = [
  { num: "01", titleKey: "step.1", descKey: "step.1.desc", image: "https://images.unsplash.com/photo-1553877522-43269d4ea984?w=300&h=200&fit=crop" },
  { num: "02", titleKey: "step.2", descKey: "step.2.desc", image: "https://images.unsplash.com/photo-1504052434569-70ad5836ab65?w=300&h=200&fit=crop" },
  { num: "03", titleKey: "step.3", descKey: "step.3.desc", image: "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=300&h=200&fit=crop" },
  { num: "04", titleKey: "step.4", descKey: "step.4.desc", image: "https://images.unsplash.com/photo-1507925921958-8a62f3d1a50d?w=300&h=200&fit=crop" },
];

export default function Home() {
  const { t } = useI18n();

  return (
    <LazyMotion features={domAnimation}>
      <>
      {/* HERO */}
      <section className="relative min-h-screen flex items-center overflow-hidden">
        <div className="absolute inset-0">
          <Image src="https://images.unsplash.com/photo-1504052434569-70ad5836ab65?w=1920&h=1080&fit=crop" alt="Transformation" fill className="object-cover" priority sizes="100vw" />
          <div className="absolute inset-0 bg-gradient-to-r from-dark via-dark/85 to-dark/40" />
          <div className="absolute inset-0 bg-gradient-to-t from-dark via-transparent to-dark/30" />
        </div>
        <FloatingParticles count={8} />
        <div className="relative z-10 max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-12 items-center py-24">
          <div>
            <m.div initial={{ opacity: 0, x: -40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
              <Badge variant="gold" className="mb-6 animate-pulse-glow">
                <FaStar className="inline mr-1" /> {t("home.badge")}
              </Badge>
            </m.div>
            <m.h1 initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }} className="text-5xl sm:text-6xl md:text-7xl font-bold leading-[1.05] mb-8">
              <span className="text-cream">{t("home.hero.title1")}</span><br />
              <span className="text-gradient-gold gold-glow">{t("home.hero.title2")}</span>
            </m.h1>
            <m.p initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.5 }} className="text-lg md:text-xl text-cream/60 mb-10 max-w-lg leading-relaxed">
              {t("home.hero.desc")}
            </m.p>
            <m.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.8 }} className="flex flex-col sm:flex-row gap-4">
              <Link href="/inscription">
                <Button size="lg" className="group text-lg px-10 py-5 animate-pulse-glow">
                  {t("home.hero.cta")}
                  <FaArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <button className="flex items-center gap-3 text-cream/70 hover:text-gold transition-all group">
                <span className="w-14 h-14 rounded-full border-2 border-gold/40 flex items-center justify-center group-hover:border-gold group-hover:bg-gold/10 transition-all group-hover:scale-110">
                  <FaPlay className="text-gold text-sm ml-0.5" />
                </span>
                <span className="font-medium">{t("home.hero.discover")}</span>
              </button>
            </m.div>
          </div>
          <m.div initial={{ opacity: 0, scale: 0.8, rotate: 3 }} animate={{ opacity: 1, scale: 1, rotate: 0 }} transition={{ duration: 1, delay: 0.4 }} className="hidden lg:block">
            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-r from-gold/20 to-navy-light/30 rounded-3xl blur-2xl" />
              <div className="relative rounded-2xl overflow-hidden shadow-2xl shadow-black/50 ring-1 ring-gold/20">
                <Image src="https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=700&h=500&fit=crop" alt="Conference" width={700} height={500} className="object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-dark/50 to-transparent" />
                <div className="absolute bottom-6 left-6 right-6">
                  <div className="glass rounded-xl p-4 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-gold flex items-center justify-center text-navy">
                      <FaPlay className="text-sm ml-0.5" />
                    </div>
                    <div>
                      <div className="text-cream font-bold text-sm">{t("home.hero.masterclass")}</div>
                      <div className="text-cream/50 text-xs">{t("home.hero.masterclass.sub")}</div>
                    </div>
                    <div className="ml-auto">
                      <div className="animate-border-dance rounded-full px-3 py-1">
                        <span className="text-white text-xs font-bold">LIVE</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </m.div>
        </div>
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10">
          <m.div animate={{ y: [0, 10, 0] }} transition={{ duration: 2, repeat: Infinity }} className="w-6 h-10 border-2 border-cream/20 rounded-full flex justify-center pt-2">
            <div className="w-1.5 h-1.5 bg-gold rounded-full" />
          </m.div>
        </div>
      </section>

      {/* STATS */}
      <section className="py-12 md:py-16 relative">
        <div className="absolute inset-0 animate-shimmer" />
        <div className="max-w-6xl mx-auto px-6 relative">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
            <AnimatedCounter end={5} suffix="+" label={t("home.stats.years")} />
            <AnimatedCounter end={30} suffix="+" label={t("home.stats.formations")} />
            <AnimatedCounter end={500} suffix="+" label={t("home.stats.lives")} />
            <AnimatedCounter end={98} suffix="%" label={t("home.stats.satisfaction")} />
          </div>
        </div>
      </section>

      {/* FORMATIONS */}
      <section className="py-14 md:py-20 px-6 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-dark via-navy/10 to-dark" />
        <div className="max-w-7xl mx-auto relative">
          <AnimatedSection className="text-center mb-14">
            <Badge variant="gold" className="mb-4">{t("home.programs.badge")}</Badge>
            <h2 className="text-3xl md:text-5xl font-bold text-cream mb-5">
              {t("home.programs.title1")} <span className="text-gradient-gold">{t("home.programs.title2")}</span>
            </h2>
            <p className="text-cream/50 max-w-2xl mx-auto text-lg">{t("home.programs.desc")}</p>
          </AnimatedSection>
          <FormationCarousel />
        </div>
      </section>

      <GoldDivider width="w-48" />

      {/* POURQUOI NOUS */}
      <section className="py-14 md:py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <AnimatedSection className="text-center mb-14">
            <Badge variant="gold" className="mb-4">{t("home.why.badge")}</Badge>
            <h2 className="text-3xl md:text-5xl font-bold text-cream mb-5">
              {t("home.why.title1")} <span className="text-gradient-gold">{t("home.why.title2")}</span>
            </h2>
          </AnimatedSection>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featureKeys.map((f, i) => (
              <AnimatedSection key={f.titleKey} delay={i * 0.1}>
                <div className="relative rounded-2xl overflow-hidden card-hover-lift group h-[280px]">
                  <Image src={f.image} alt={t(f.titleKey)} fill className="object-cover transition-transform duration-700 group-hover:scale-110" sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw" />
                  <div className="absolute inset-0 bg-gradient-to-t from-dark via-dark/70 to-dark/20 group-hover:from-dark group-hover:via-dark/80 transition-all duration-500" />
                  <div className="absolute inset-0 flex flex-col justify-end p-7">
                    <div className="w-12 h-12 rounded-xl bg-gold/20 backdrop-blur-sm flex items-center justify-center text-gold mb-4 group-hover:bg-gold/30 group-hover:scale-110 transition-all duration-300">{f.icon}</div>
                    <h3 className="text-lg font-bold text-cream mb-2 group-hover:text-gold transition-colors">{t(f.titleKey)}</h3>
                    <p className="text-cream/50 text-sm leading-relaxed">{t(f.descKey)}</p>
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* COMMENT CA MARCHE */}
      <section className="py-14 md:py-20 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-navy/20 via-dark to-dark" />
        <div className="max-w-6xl mx-auto relative">
          <AnimatedSection className="text-center mb-16">
            <Badge variant="gold" className="mb-4">{t("home.how.badge")}</Badge>
            <h2 className="text-3xl md:text-5xl font-bold text-cream">
              {t("home.how.title1")} <span className="text-gradient-gold">{t("home.how.title2")}</span>
            </h2>
          </AnimatedSection>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {stepKeys.map((s, i) => (
              <AnimatedSection key={s.num} delay={i * 0.15}>
                <div className="group cursor-pointer">
                  <div className="relative rounded-2xl overflow-hidden h-[180px] mb-5">
                    <Image src={s.image} alt={t(s.titleKey)} fill className="object-cover transition-transform duration-700 group-hover:scale-110" sizes="(max-width: 768px) 50vw, 25vw" />
                    <div className="absolute inset-0 bg-dark/50 group-hover:bg-dark/30 transition-all" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-5xl font-bold text-gradient-gold opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all">{s.num}</span>
                    </div>
                  </div>
                  <h3 className="text-lg font-bold text-cream mb-2 group-hover:text-gold transition-colors">{t(s.titleKey)}</h3>
                  <p className="text-cream/45 text-sm">{t(s.descKey)}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* TEMOIGNAGES */}
      <section className="py-14 md:py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <AnimatedSection className="text-center mb-14">
            <Badge variant="gold" className="mb-4">{t("home.testimonials.badge")}</Badge>
            <h2 className="text-3xl md:text-5xl font-bold text-cream mb-5">
              {t("home.testimonials.title1")} <span className="text-gradient-gold">{t("home.testimonials.title2")}</span>
            </h2>
          </AnimatedSection>
          <TestimonialCarousel />
        </div>
      </section>

      {/* CTA */}
      <section className="relative py-16 md:py-20 overflow-hidden">
        <div className="absolute inset-0">
          <Image src="https://images.unsplash.com/photo-1507925921958-8a62f3d1a50d?w=1920&h=600&fit=crop" alt="CTA" fill className="object-cover" sizes="100vw" />
          <div className="absolute inset-0 bg-gradient-to-r from-dark via-dark/90 to-dark/80" />
        </div>
        <div className="max-w-3xl mx-auto text-center relative z-10 px-6">
          <AnimatedSection>
            <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold text-cream mb-6 leading-tight">
              {t("home.cta.title1")} <span className="text-gradient-gold">{t("home.cta.title2")}</span> ?
            </h2>
            <p className="text-cream/50 text-lg md:text-xl mb-10 max-w-xl mx-auto">{t("home.cta.desc")}</p>
            <Link href="/inscription">
              <Button size="lg" className="text-lg px-12 py-5 animate-pulse-glow">
                {t("home.cta.button")}
                <FaArrowRight className="ml-3" />
              </Button>
            </Link>
            <p className="text-cream/30 text-sm mt-5">{t("home.cta.sub")} &bull; {t("home.cta.sub2")} &bull; {t("home.cta.sub3")}</p>
          </AnimatedSection>
        </div>
      </section>
    </>
    </LazyMotion>
  );
}
