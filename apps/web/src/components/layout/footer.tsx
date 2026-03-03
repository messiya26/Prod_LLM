"use client";

import Link from "next/link";
import Image from "next/image";
import { FaFacebook, FaInstagram, FaYoutube, FaTiktok, FaEnvelope, FaPhoneAlt, FaMapMarkerAlt, FaHeart, FaArrowRight } from "react-icons/fa";
import { useI18n } from "@/context/i18n-context";

const socials = [
  { icon: <FaFacebook />, href: "#", label: "Facebook", color: "hover:bg-blue-500/20 hover:text-blue-400 hover:border-blue-400/30" },
  { icon: <FaInstagram />, href: "#", label: "Instagram", color: "hover:bg-pink-500/20 hover:text-pink-400 hover:border-pink-400/30" },
  { icon: <FaYoutube />, href: "#", label: "YouTube", color: "hover:bg-red-500/20 hover:text-red-400 hover:border-red-400/30" },
  { icon: <FaTiktok />, href: "#", label: "TikTok", color: "hover:bg-cyan-500/20 hover:text-cyan-400 hover:border-cyan-400/30" },
];

export function Footer() {
  const { t } = useI18n();

  const footerLinks = {
    [t("footer.plateforme")]: [
      { href: "/formations", label: t("footer.catalogue") },
      { href: "/tarifs", label: t("footer.tarifs") },
      { href: "/faq", label: t("footer.faq") },
      { href: "/inscription", label: t("footer.creer") },
    ],
    [t("footer.academie")]: [
      { href: "/a-propos", label: t("footer.apropos") },
      { href: "/a-propos", label: t("footer.vision") },
      { href: "/a-propos", label: t("footer.temoignages") },
      { href: "/a-propos", label: t("footer.equipe") },
    ],
    "Ministere LLM": [
      { href: "/ministere/musique", label: "Musique & Albums" },
      { href: "/ministere/livres", label: "Livres" },
      { href: "/ministere/evenements", label: "Evenements" },
      { href: "/ministere/dons", label: "Faire un don" },
      { href: "/ministere/blog", label: "Blog" },
    ],
    [t("footer.legal")]: [
      { href: "/mentions-legales", label: t("footer.mentions") },
      { href: "/politique-confidentialite", label: t("footer.confidentialite") },
      { href: "/cgv", label: t("footer.cgv") },
    ],
  };

  return (
    <footer className="relative overflow-hidden">
      <div className="relative bg-gradient-to-r from-gold/10 via-gold/5 to-gold/10 border-y border-gold/10">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(240,199,94,0.08),transparent)]" />
        <div className="max-w-7xl mx-auto px-6 py-5 md:py-6 relative">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="text-center md:text-left">
              <h3 className="text-lg md:text-xl font-bold text-cream mb-1">
                {t("footer.newsletter")}
              </h3>
              <p className="text-cream/45 text-sm max-w-md">{t("footer.newsletter.desc")}</p>
            </div>
            <div className="flex w-full md:w-auto gap-0">
              <div className="relative flex-1 md:w-80">
                <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-cream/25 text-sm" />
                <input type="email" placeholder={t("footer.newsletter.placeholder")} className="w-full pl-11 pr-4 py-4 rounded-l-xl bg-dark/60 backdrop-blur-sm border border-cream/10 border-r-0 text-cream placeholder:text-cream/25 text-sm focus:outline-none focus:border-gold/30 transition-all" />
              </div>
              <button className="px-6 py-4 rounded-r-xl bg-gradient-to-r from-gold to-gold-light text-navy font-bold text-sm hover:shadow-lg hover:shadow-gold/20 transition-all flex items-center gap-2 whitespace-nowrap group">
                OK
                <FaArrowRight className="text-xs group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="relative bg-[#060d1a]">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_50%_100%,rgba(240,199,94,0.03),transparent)]" />
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/20 to-transparent" />
        <div className="max-w-7xl mx-auto px-6 pt-7 md:pt-8 pb-4 relative">
          <div className="grid grid-cols-2 md:grid-cols-12 gap-5 md:gap-4">
            <div className="col-span-2 md:col-span-4">
              <Link href="/" className="flex items-center gap-3 mb-4 group">
                <Image src="/images/logo-llm-official.jpeg" alt="Lord Lombo Ministries" width={44} height={44} className="rounded-lg group-hover:opacity-90 transition-all" />
                <div>
                  <span className="text-base font-bold text-cream font-heading leading-none block group-hover:text-gold transition-colors">Lord Lombo Ministries</span>
                </div>
              </Link>

              <div className="space-y-2 mb-5">
                <a href="mailto:contact@lordlomboacademie.com" className="flex items-center gap-3 text-cream/30 hover:text-gold transition-colors text-sm group">
                  <span className="w-8 h-8 rounded-lg bg-cream/5 flex items-center justify-center group-hover:bg-gold/10 transition-colors"><FaEnvelope className="text-xs" /></span>
                  contact@lordlomboacademie.com
                </a>
                <a href="tel:+243000000000" className="flex items-center gap-3 text-cream/30 hover:text-gold transition-colors text-sm group">
                  <span className="w-8 h-8 rounded-lg bg-cream/5 flex items-center justify-center group-hover:bg-gold/10 transition-colors"><FaPhoneAlt className="text-xs" /></span>
                  +243 XXX XXX XXX
                </a>
                <div className="flex items-center gap-3 text-cream/30 text-sm">
                  <span className="w-8 h-8 rounded-lg bg-cream/5 flex items-center justify-center"><FaMapMarkerAlt className="text-xs" /></span>
                  Kinshasa, RD Congo
                </div>
              </div>

              <div className="flex gap-2">
                {socials.map((s) => (
                  <a key={s.label} href={s.href} aria-label={s.label} className={`w-10 h-10 rounded-xl bg-cream/[0.03] border border-cream/[0.06] flex items-center justify-center text-cream/30 transition-all duration-300 ${s.color}`}>{s.icon}</a>
                ))}
              </div>
            </div>

            {Object.entries(footerLinks).map(([title, links]) => (
              <div key={title} className="col-span-1 md:col-span-2">
                <h4 className="text-xs font-bold text-cream/60 uppercase tracking-[0.2em] mb-4 relative">
                  {title}
                  <span className="absolute -bottom-2 left-0 w-6 h-0.5 bg-gradient-to-r from-gold/40 to-transparent rounded-full" />
                </h4>
                <ul className="space-y-2.5">
                  {links.map((link) => (
                    <li key={link.label}>
                      <Link href={link.href} className="text-sm text-cream/30 hover:text-gold hover:translate-x-1 transition-all duration-200 inline-block">{link.label}</Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="mt-6 pt-4 border-t border-cream/[0.04]">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <p className="text-cream/20 text-xs">&copy; {new Date().getFullYear()} {t("footer.copyright")}</p>
              <p className="text-cream/20 text-xs flex items-center gap-1.5">
                {t("footer.by")} <FaHeart className="text-gold/40 text-[10px]" /> {t("footer.par")}{" "}
                <a href="https://messiyagroup.com" target="_blank" rel="noopener noreferrer" className="text-gold/50 hover:text-gold font-semibold transition-colors">Messiya Group</a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
