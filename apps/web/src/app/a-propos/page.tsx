"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { LazyMotion, domAnimation, m, useScroll, useTransform, useInView } from "framer-motion";
import { AnimatedSection } from "@/components/ui";
import {
  FaHeart, FaLightbulb, FaHandsHelping, FaRocket, FaTrophy, FaGlobeAfrica,
  FaQuoteLeft, FaChurch, FaMusic, FaBookOpen, FaGraduationCap,
  FaYoutube, FaFacebook, FaSpotify, FaArrowRight, FaBaby, FaCross,
  FaMicrophone, FaStar, FaUsers, FaGlobe, FaCalendarAlt, FaHandHoldingHeart,
  FaChevronDown, FaPlay, FaCheckCircle,
} from "react-icons/fa";
import { useI18n } from "@/context/i18n-context";

function CountUp({ end, suffix = "" }: { end: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const step = Math.max(1, Math.floor(end / 40));
    const timer = setInterval(() => {
      start += step;
      if (start >= end) { setVal(end); clearInterval(timer); }
      else setVal(start);
    }, 30);
    return () => clearInterval(timer);
  }, [inView, end]);
  return <span ref={ref}>{val.toLocaleString()}{suffix}</span>;
}

const timeline = [
  { year: "1989", title: "Origines", desc: "Ne a Kinshasa, 3e d'une famille chretienne de 5 enfants", icon: <FaBaby />, color: "border-gold/30" },
  { year: "1999", title: "Conversion", desc: "Donne sa vie a Christ a 10 ans lors d'une campagne", icon: <FaCross />, color: "border-blue-400/30" },
  { year: "2005", title: "Ministere", desc: "Debut dans la louange et la predication", icon: <FaMusic />, color: "border-emerald-400/30" },
  { year: "2017", title: "Emmanuel", desc: "Single viral — 23M+ vues, scene internationale", icon: <FaMicrophone />, color: "border-red-400/30" },
  { year: "2020", title: "Extr'aime", desc: "2e album, collaborations internationales", icon: <FaGlobe />, color: "border-purple-400/30" },
  { year: "2023", title: "C.H.A & Livre", desc: "3e album + best-seller Les Tenebres de Dieu", icon: <FaBookOpen />, color: "border-amber-400/30" },
  { year: "2025", title: "LLM Digital", desc: "Plateforme LLM & Academie — impact global", icon: <FaRocket />, color: "border-cyan-400/30" },
];

const values = [
  { icon: <FaTrophy />, title: "Excellence", desc: "Tout pour la gloire de Dieu avec excellence", color: "text-gold", bg: "bg-gold/10" },
  { icon: <FaGlobeAfrica />, title: "Impact global", desc: "Toucher toutes les nations et cultures", color: "text-blue-400", bg: "bg-blue-400/10" },
  { icon: <FaHandsHelping />, title: "Service", desc: "Servir avec humilite comme Christ", color: "text-emerald-400", bg: "bg-emerald-400/10" },
  { icon: <FaRocket />, title: "Innovation", desc: "Technologies modernes pour l'Evangile", color: "text-purple-400", bg: "bg-purple-400/10" },
  { icon: <FaHeart />, title: "Amour", desc: "L'amour comme fondement de tout", color: "text-rose-400", bg: "bg-rose-400/10" },
  { icon: <FaLightbulb />, title: "Formation", desc: "Equiper la prochaine generation", color: "text-amber-400", bg: "bg-amber-400/10" },
];

export default function APropos() {
  const { t } = useI18n();
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 150]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  return (
    <LazyMotion features={domAnimation}>
    <>
      {/* HERO — Immersif plein ecran avec parallaxe */}
      <section ref={heroRef} className="relative h-screen flex items-center overflow-hidden">
        <m.div style={{ y: heroY }} className="absolute inset-0">
          <Image src="/images/lord-lombo.jpeg" alt="Lord Lombo" fill className="object-cover object-top scale-105" sizes="100vw" priority />
          <div className="absolute inset-0 bg-gradient-to-r from-dark via-dark/70 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-dark via-dark/20 to-dark/50" />
        </m.div>

        {/* Grain overlay */}
        <div className="absolute inset-0 opacity-[0.03] bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48ZmlsdGVyIGlkPSJhIiB4PSIwIiB5PSIwIj48ZmVUdXJidWxlbmNlIGJhc2VGcmVxdWVuY3k9Ii43NSIgc3RpdGNoVGlsZXM9InN0aXRjaCIgdHlwZT0iZnJhY3RhbE5vaXNlIi8+PGZlQ29sb3JNYXRyaXggdHlwZT0ic2F0dXJhdGUiIHZhbHVlcz0iMCIvPjwvZmlsdGVyPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbHRlcj0idXJsKCNhKSIvPjwvc3ZnPg==')]" />

        <m.div style={{ opacity: heroOpacity }} className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 w-full">
          <div className="grid lg:grid-cols-5 gap-8 items-center">
            {/* Texte principal — 3 cols */}
            <div className="lg:col-span-3">
              <m.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
                <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold/10 border border-gold/20 text-gold text-[10px] sm:text-xs font-medium tracking-wider uppercase mb-4">
                  <FaStar className="text-[8px]" /> Lord Lombo Ministries
                </span>
              </m.div>
              <m.h1 initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.15 }}
                className="text-4xl sm:text-6xl md:text-7xl font-bold font-heading leading-[0.92] mb-4">
                <span className="text-cream">Pasteur.</span><br />
                <span className="text-cream">Chantre.</span><br />
                <span className="text-gradient-gold gold-glow">Visionnaire.</span>
              </m.h1>
              <m.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.4 }}
                className="text-cream/50 text-sm sm:text-base max-w-md leading-relaxed mb-5">
                Fondateur de Lord Lombo Ministries, auteur best-seller et artiste international — une vie consacree a impacter les nations.
              </m.p>
              <m.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }} className="flex flex-wrap gap-2 mb-6">
                {["Pasteur", "Chantre", "Ecrivain", "Coach", "Visionnaire"].map((r) => (
                  <span key={r} className="px-2.5 py-1 rounded-full bg-cream/[0.06] border border-cream/[0.08] text-cream/50 text-[10px] backdrop-blur-sm">{r}</span>
                ))}
              </m.div>
              <m.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.75 }} className="flex flex-wrap gap-2.5 items-center">
                <Link href="/formations" className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-gold to-gold-light text-navy font-bold text-xs hover:shadow-xl hover:shadow-gold/25 transition-all hover:scale-105">
                  Rejoindre l&apos;Academie <FaArrowRight className="text-[9px]" />
                </Link>
                <a href="https://www.youtube.com/@LordLomboOfficial" target="_blank" rel="noopener" className="flex items-center gap-2 px-4 py-2.5 rounded-full border border-cream/10 text-cream/40 text-xs hover:text-red-400 hover:border-red-400/30 transition-all backdrop-blur-sm">
                  <FaPlay className="text-[9px]" /> Regarder
                </a>
                <div className="flex gap-1.5 ml-1">
                  <a href="https://www.youtube.com/@LordLomboOfficial" target="_blank" rel="noopener" className="w-8 h-8 rounded-full bg-cream/[0.04] border border-cream/[0.06] flex items-center justify-center text-cream/25 hover:text-red-400 transition-all text-sm backdrop-blur-sm"><FaYoutube /></a>
                  <a href="https://web.facebook.com/LordLombo" target="_blank" rel="noopener" className="w-8 h-8 rounded-full bg-cream/[0.04] border border-cream/[0.06] flex items-center justify-center text-cream/25 hover:text-blue-400 transition-all text-sm backdrop-blur-sm"><FaFacebook /></a>
                  <a href="https://open.spotify.com/artist/7LYWtUyWFb2GIE5sjigMvX" target="_blank" rel="noopener" className="w-8 h-8 rounded-full bg-cream/[0.04] border border-cream/[0.06] flex items-center justify-center text-cream/25 hover:text-emerald-400 transition-all text-sm backdrop-blur-sm"><FaSpotify /></a>
                </div>
              </m.div>
            </div>

            {/* Stats colonne droite — 2 cols */}
            <div className="lg:col-span-2 hidden lg:block">
              <div className="grid grid-cols-2 gap-3">
                {[
                  { icon: <FaYoutube className="text-red-400" />, value: 377, suffix: "K+", label: "Abonnes YouTube", gradient: "from-red-500/10 to-red-500/5" },
                  { icon: <FaGlobe className="text-blue-400" />, value: 115, suffix: "M+", label: "Vues totales", gradient: "from-blue-500/10 to-blue-500/5" },
                  { icon: <FaSpotify className="text-emerald-400" />, value: 83, suffix: "K+", label: "Auditeurs Spotify", gradient: "from-emerald-500/10 to-emerald-500/5" },
                  { icon: <FaChurch className="text-gold" />, value: 15, suffix: "+", label: "Annees de ministere", gradient: "from-gold/10 to-gold/5" },
                  { icon: <FaGlobe className="text-purple-400" />, value: 50, suffix: "+", label: "Pays touches", gradient: "from-purple-500/10 to-purple-500/5" },
                  { icon: <FaUsers className="text-rose-400" />, value: 3200, suffix: "+", label: "Donateurs actifs", gradient: "from-rose-500/10 to-rose-500/5" },
                ].map((s, i) => (
                  <m.div key={i} initial={{ opacity: 0, y: 20, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ delay: 0.5 + i * 0.1, duration: 0.4 }}
                    className={`rounded-xl bg-gradient-to-br ${s.gradient} border border-cream/[0.06] p-3.5 backdrop-blur-xl hover:border-gold/15 transition-all group cursor-default`}>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-base group-hover:scale-110 transition-transform">{s.icon}</span>
                      <span className="text-cream font-bold text-lg font-heading leading-none">
                        <CountUp end={s.value} suffix={s.suffix} />
                      </span>
                    </div>
                    <div className="text-cream/25 text-[10px]">{s.label}</div>
                  </m.div>
                ))}
              </div>
            </div>
          </div>
        </m.div>

        {/* Mobile stats bar */}
        <div className="absolute bottom-0 left-0 right-0 lg:hidden z-10">
          <div className="bg-dark/80 backdrop-blur-xl border-t border-cream/[0.04]">
            <div className="flex justify-around px-2 py-3">
              {[
                { v: "377K+", l: "YouTube", c: "text-red-400" },
                { v: "115M+", l: "Vues", c: "text-blue-400" },
                { v: "50+", l: "Pays", c: "text-purple-400" },
                { v: "15+", l: "Annees", c: "text-gold" },
              ].map((s, i) => (
                <div key={i} className="text-center">
                  <div className={`text-sm font-bold font-heading ${s.c}`}>{s.v}</div>
                  <div className="text-cream/20 text-[8px]">{s.l}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* VISION & CITATION — Bande pleine immersive */}
      <section className="relative py-10 sm:py-12 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-[#0d1a2e] via-[#0a1628] to-[#0d1a2e]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(212,175,55,0.05),transparent_50%)]" />
        <div className="max-w-5xl mx-auto px-4 sm:px-6 relative">
          <div className="flex flex-col md:flex-row items-center gap-6 md:gap-10">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gold/10 border border-gold/15 flex items-center justify-center flex-shrink-0">
              <FaQuoteLeft className="text-gold text-xl sm:text-2xl" />
            </div>
            <div className="text-center md:text-left flex-1">
              <blockquote className="text-lg sm:text-xl md:text-2xl font-heading text-cream/70 italic leading-relaxed mb-2">
                &ldquo;Impacter les nations a travers la musique, l&apos;enseignement, l&apos;ecriture et le coaching. Chaque talent est un outil au service du Royaume.&rdquo;
              </blockquote>
              <div className="flex items-center gap-2 justify-center md:justify-start">
                <div className="w-8 h-0.5 bg-gold/40 rounded-full" />
                <p className="text-gold font-bold text-xs tracking-wider uppercase">Pasteur Lord Lombo</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* BIOGRAPHIE — Grille seree sans espace perdu */}
      <section className="py-10 sm:py-14 px-4 sm:px-6 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-dark via-[#0a1628]/30 to-dark" />
        <div className="max-w-6xl mx-auto relative">
          <div className="grid lg:grid-cols-12 gap-4 sm:gap-5">
            {/* Photo — 5 cols */}
            <div className="lg:col-span-5 relative">
              <div className="sticky top-24">
                <div className="relative rounded-xl sm:rounded-2xl overflow-hidden">
                  <Image src="/images/lord-lombo-2.jpeg" alt="Lord Lombo" width={600} height={750} className="w-full object-cover h-[350px] sm:h-[420px]" />
                  <div className="absolute inset-0 bg-gradient-to-t from-dark/90 via-transparent to-transparent" />
                  {/* Overlay card */}
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { icon: <FaMusic className="text-red-400" />, label: "3 Albums" },
                        { icon: <FaBookOpen className="text-amber-400" />, label: "1 Livre" },
                        { icon: <FaGlobe className="text-blue-400" />, label: "50+ Pays" },
                      ].map((s, i) => (
                        <div key={i} className="rounded-lg bg-dark/60 backdrop-blur-xl border border-cream/[0.06] p-2 text-center">
                          <div className="text-sm mb-0.5">{s.icon}</div>
                          <div className="text-cream/50 text-[9px] font-medium">{s.label}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Bio texte — 7 cols */}
            <div className="lg:col-span-7 space-y-4 sm:space-y-5">
              <div>
                <span className="inline-block px-3 py-1 rounded-full bg-gold/10 text-gold text-[10px] font-medium uppercase tracking-wider mb-3">Biographie</span>
                <h2 className="text-2xl sm:text-3xl font-bold font-heading text-cream leading-tight">
                  Un parcours marque par la <span className="text-gradient-gold">grace divine</span>
                </h2>
              </div>

              {/* Bio cards empilees */}
              {[
                { title: "Les origines", text: "Originaire de Kinshasa, troisieme d'une famille chretienne de 5 enfants. Son pere pasteur et sa mere servante du Tres-Haut, Lord a ete trempe dans la parole de Dieu des son jeune age.", icon: <FaBaby className="text-gold" /> },
                { title: "L'appel", text: "Un an apres le deces de sa mere, le jour de ses 10 ans, Lord donne sa vie a Christ lors d'une campagne d'evangelisation organisee par son pere. Le debut d'un voyage extraordinaire.", icon: <FaCross className="text-blue-400" /> },
                { title: "L'ascension", text: "Membre de la famille Philadelphia, diplome en biologie-chimie du College Boboto. Collaborations avec Sandra Mbuyi, Gamaliel Lombo, Rachel Anyeme. Le single Emmanuel (23M+ vues) propulse son ministere.", icon: <FaStar className="text-amber-400" /> },
                { title: "La vision", text: "Aujourd'hui a la tete de Lord Lombo Ministries, il impacte des millions de vies a travers la musique, l'enseignement, l'ecriture et le coaching. Sa plateforme digitale etend cet impact au monde entier.", icon: <FaRocket className="text-emerald-400" /> },
              ].map((b, i) => (
                <m.div key={i} initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                  className="flex gap-3 sm:gap-4 group">
                  <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-cream/[0.03] border border-cream/[0.06] flex items-center justify-center flex-shrink-0 group-hover:border-gold/20 transition-all text-sm">
                    {b.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-cream font-bold text-sm mb-1 group-hover:text-gold transition-colors">{b.title}</h3>
                    <p className="text-cream/35 text-xs leading-relaxed">{b.text}</p>
                  </div>
                </m.div>
              ))}

              {/* Signature */}
              <div className="pt-4 border-t border-cream/[0.04] flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-gold to-gold-light flex items-center justify-center text-navy font-bold text-lg font-heading">LL</div>
                <div>
                  <div className="text-cream font-bold text-sm">Lord Lombo</div>
                  <div className="text-cream/25 text-[10px]">Fondateur, Lord Lombo Ministries</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TIMELINE — Horizontale innovante */}
      <section className="py-10 sm:py-14 px-4 sm:px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,rgba(212,175,55,0.03),transparent_60%)]" />
        <div className="max-w-6xl mx-auto relative">
          <AnimatedSection className="text-center mb-6 sm:mb-8">
            <span className="inline-block px-3 py-1 rounded-full bg-gold/10 text-gold text-[10px] font-medium uppercase tracking-wider mb-3">Parcours</span>
            <h2 className="text-2xl sm:text-3xl font-bold font-heading text-cream">
              De Kinshasa <span className="text-gradient-gold">au monde</span>
            </h2>
          </AnimatedSection>

          {/* Scroll horizontal sur mobile, grille sur desktop */}
          <div className="overflow-x-auto pb-4 -mx-4 px-4 sm:mx-0 sm:px-0 scrollbar-hide">
            <div className="flex sm:grid sm:grid-cols-4 lg:grid-cols-7 gap-3 min-w-max sm:min-w-0">
              {timeline.map((t, i) => (
                <m.div key={t.year} initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.06 }}
                  className={`w-[140px] sm:w-auto flex-shrink-0 sm:flex-shrink rounded-xl border ${t.color} bg-cream/[0.01] p-3 sm:p-4 hover:bg-cream/[0.02] transition-all group`}>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-7 h-7 rounded-lg bg-cream/[0.04] flex items-center justify-center text-gold text-xs group-hover:scale-110 transition-transform">{t.icon}</div>
                    <span className="text-gold font-bold text-sm font-heading">{t.year}</span>
                  </div>
                  <h3 className="text-cream font-bold text-[11px] mb-1 group-hover:text-gold transition-colors">{t.title}</h3>
                  <p className="text-cream/25 text-[10px] leading-relaxed">{t.desc}</p>
                </m.div>
              ))}
            </div>
          </div>
          {/* Scroll hint mobile */}
          <div className="sm:hidden flex items-center justify-center gap-2 mt-2 text-cream/15 text-[10px]">
            <div className="w-8 h-0.5 bg-cream/10 rounded-full" />
            <span>Glissez pour parcourir</span>
            <div className="w-8 h-0.5 bg-cream/10 rounded-full" />
          </div>
        </div>
      </section>

      {/* PROJETS — Cards avec hover revele */}
      <section className="py-10 sm:py-14 px-4 sm:px-6 relative">
        <div className="max-w-6xl mx-auto">
          <AnimatedSection className="text-center mb-6 sm:mb-8">
            <span className="inline-block px-3 py-1 rounded-full bg-gold/10 text-gold text-[10px] font-medium uppercase tracking-wider mb-3">Ecosysteme</span>
            <h2 className="text-2xl sm:text-3xl font-bold font-heading text-cream mb-2">
              Les projets du <span className="text-gradient-gold">ministere</span>
            </h2>
          </AnimatedSection>

          <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
            {[
              { icon: <FaGraduationCap />, title: "Academie", desc: "Formations & certifications", href: "/formations", badge: "En ligne", color: "text-emerald-400", bg: "hover:border-emerald-400/20" },
              { icon: <FaMusic />, title: "Musique", desc: "Discographie & streaming", href: "/ministere/musique", badge: "115M+ vues", color: "text-red-400", bg: "hover:border-red-400/20" },
              { icon: <FaBookOpen />, title: "Livres", desc: "Publications & e-books", href: "/ministere/livres", badge: "Best-seller", color: "text-amber-400", bg: "hover:border-amber-400/20" },
              { icon: <FaCalendarAlt />, title: "Evenements", desc: "Conferences & concerts", href: "/ministere/evenements", badge: "50+ pays", color: "text-purple-400", bg: "hover:border-purple-400/20" },
              { icon: <FaHandHoldingHeart />, title: "Dons", desc: "Soutenir la vision", href: "/ministere/dons", badge: "3200+", color: "text-rose-400", bg: "hover:border-rose-400/20" },
            ].map((p, i) => (
              <Link key={i} href={p.href} className={`group rounded-xl border border-cream/[0.06] ${p.bg} bg-cream/[0.01] p-4 sm:p-5 transition-all text-center hover:bg-cream/[0.02]`}>
                <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-cream/[0.04] flex items-center justify-center mx-auto mb-3 ${p.color} text-lg sm:text-xl group-hover:scale-110 transition-transform`}>{p.icon}</div>
                <h3 className="text-cream font-bold text-xs sm:text-sm mb-1 group-hover:text-gold transition-colors">{p.title}</h3>
                <p className="text-cream/20 text-[10px] mb-2 hidden sm:block">{p.desc}</p>
                <span className={`inline-block px-2 py-0.5 rounded-full ${p.color} bg-cream/[0.03] text-[9px] font-bold`}>{p.badge}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* VALEURS — Bande compacte */}
      <section className="py-8 sm:py-12 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto">
          <AnimatedSection className="text-center mb-6 sm:mb-8">
            <h2 className="text-xl sm:text-2xl font-bold font-heading text-cream">
              Nos <span className="text-gradient-gold">valeurs</span>
            </h2>
          </AnimatedSection>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-2 sm:gap-3">
            {values.map((v, i) => (
              <m.div key={i} initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }}
                className="group text-center p-3 sm:p-4 rounded-xl border border-cream/[0.04] hover:border-gold/15 transition-all">
                <div className={`w-9 h-9 sm:w-10 sm:h-10 rounded-lg ${v.bg} flex items-center justify-center ${v.color} text-sm sm:text-base mx-auto mb-2 group-hover:scale-110 transition-transform`}>{v.icon}</div>
                <h3 className="text-cream font-bold text-[10px] sm:text-xs mb-0.5">{v.title}</h3>
                <p className="text-cream/20 text-[8px] sm:text-[9px] leading-relaxed hidden sm:block">{v.desc}</p>
              </m.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA — Compact et elegant */}
      <section className="py-8 sm:py-10 px-4 sm:px-6">
        <div className="max-w-3xl mx-auto">
          <div className="rounded-xl sm:rounded-2xl relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-gold/10 via-gold/5 to-gold/10" />
            <div className="absolute inset-0 bg-dark/80" />
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/40 to-transparent" />
            <div className="relative p-6 sm:p-8 text-center">
              <h3 className="text-lg sm:text-xl font-bold font-heading text-cream mb-2">Rejoignez l&apos;aventure</h3>
              <p className="text-cream/30 text-xs mb-5 max-w-sm mx-auto">Formez-vous, donnez, participez — votre vie peut changer</p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-2.5">
                <Link href="/formations" className="px-6 py-2.5 rounded-full bg-gradient-to-r from-gold to-gold-light text-navy font-bold text-xs hover:shadow-xl hover:shadow-gold/25 transition-all hover:scale-105 flex items-center gap-2">
                  <FaGraduationCap className="text-[10px]" /> L&apos;Academie
                </Link>
                <Link href="/ministere/dons" className="px-6 py-2.5 rounded-full border border-cream/[0.1] text-cream/50 text-xs hover:border-gold/30 hover:text-gold transition-all flex items-center gap-2">
                  <FaHandHoldingHeart className="text-[10px]" /> Soutenir
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
    </LazyMotion>
  );
}
