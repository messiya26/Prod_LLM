"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui";
import { BookingModal } from "@/components/ui/booking-modal";
import { useI18n } from "@/context/i18n-context";
import { useAuth } from "@/context/auth-context";
import {
  FaCross, FaCrown, FaUserTie, FaHandsHelping, FaUsers,
  FaCalendarAlt, FaNewspaper, FaPodcast, FaVideo, FaDownload,
  FaComments, FaGlobe, FaPray,
  FaEnvelope, FaQuestionCircle, FaFileInvoiceDollar, FaPhoneAlt,
  FaArrowRight, FaStar, FaChurch, FaHeart,
  FaUser, FaSignOutAlt, FaCog, FaChartBar,
  FaMusic, FaBookOpen, FaTicketAlt, FaHandHoldingHeart, FaMicrophone, FaRss,
} from "react-icons/fa";

interface MegaMenuItem {
  labelKey: string;
  href: string;
  icon: React.ReactNode;
  descKey: string;
  badgeKey?: string;
}

interface MegaMenuSection {
  titleKey: string;
  navKey: string;
  items: MegaMenuItem[];
  featured?: { titleKey: string; descKey: string; image: string; href: string; badgeKey?: string };
}

const megaMenuData: MegaMenuSection[] = [
  {
    titleKey: "mega.formations",
    navKey: "nav.academie",
    items: [
      { labelKey: "mega.croissance", href: "/formations", icon: <FaCross />, descKey: "mega.croissance.desc", badgeKey: "badge.populaire" },
      { labelKey: "mega.leadership", href: "/formations", icon: <FaCrown />, descKey: "mega.leadership.desc" },
      { labelKey: "mega.dev", href: "/formations", icon: <FaUserTie />, descKey: "mega.dev.desc", badgeKey: "badge.nouveau" },
      { labelKey: "mega.pastorale", href: "/formations", icon: <FaChurch />, descKey: "mega.pastorale.desc" },
      { labelKey: "mega.chantres", href: "/formations", icon: <FaPray />, descKey: "mega.chantres.desc" },
      { labelKey: "mega.coaching", href: "/formations", icon: <FaHandsHelping />, descKey: "mega.coaching.desc" },
    ],
    featured: {
      titleKey: "mega.masterclass",
      descKey: "mega.masterclass.desc",
      image: "https://images.unsplash.com/photo-1504052434569-70ad5836ab65?w=400&h=250&fit=crop",
      href: "/masterclasses",
      badgeKey: "badge.exclusif",
    },
  },
  {
    navKey: "nav.ministere",
    items: [
      { labelKey: "mega.apropos", href: "/a-propos", icon: <FaStar />, descKey: "mega.apropos.desc" },
      { labelKey: "mega.events", href: "/ministere/evenements", icon: <FaCalendarAlt />, descKey: "mega.events.desc" },
      { labelKey: "mega.musique", href: "/ministere/musique", icon: <FaMusic />, descKey: "mega.musique.desc" },
      { labelKey: "mega.livres2", href: "/ministere/livres", icon: <FaBookOpen />, descKey: "mega.livres2.desc" },
      { labelKey: "mega.blog2", href: "/ministere/blog", icon: <FaRss />, descKey: "mega.blog2.desc" },
      { labelKey: "mega.soutenir", href: "/ministere/dons", icon: <FaHandHoldingHeart />, descKey: "mega.soutenir.desc", badgeKey: "badge.nouveau" },
    ],
    featured: {
      titleKey: "mega.conference",
      descKey: "mega.conference.desc",
      image: "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=400&h=250&fit=crop",
      href: "/ministere/evenements",
    },
  },
  {
    titleKey: "mega.ressources",
    navKey: "nav.ressources",
    items: [
      { labelKey: "mega.blog", href: "/ressources", icon: <FaNewspaper />, descKey: "mega.blog.desc" },
      { labelKey: "mega.podcasts", href: "/ressources", icon: <FaPodcast />, descKey: "mega.podcasts.desc", badgeKey: "badge.nouveau" },
      { labelKey: "mega.videos", href: "/ressources", icon: <FaVideo />, descKey: "mega.videos.desc" },
      { labelKey: "mega.livres", href: "/ressources", icon: <FaDownload />, descKey: "mega.livres.desc" },
    ],
  },
  {
    titleKey: "mega.communaute",
    navKey: "nav.communaute",
    items: [
      { labelKey: "mega.forum", href: "/communaute", icon: <FaComments />, descKey: "mega.forum.desc" },
      { labelKey: "mega.temoignages", href: "/communaute", icon: <FaUsers />, descKey: "mega.histoires" },
      { labelKey: "mega.alumni", href: "/communaute", icon: <FaGlobe />, descKey: "mega.alumni.desc" },
    ],
  },
  {
    titleKey: "mega.contact",
    navKey: "nav.contact",
    items: [
      { labelKey: "mega.nous", href: "/contact", icon: <FaEnvelope />, descKey: "mega.nous.desc" },
      { labelKey: "mega.devis", href: "/contact", icon: <FaFileInvoiceDollar />, descKey: "mega.devis.desc" },
      { labelKey: "mega.faq", href: "/faq", icon: <FaQuestionCircle />, descKey: "mega.faq.desc" },
      { labelKey: "mega.tel", href: "/contact", icon: <FaPhoneAlt />, descKey: "mega.tel.desc" },
    ],
  },
];

export function Header() {
  const { locale, setLocale, t } = useI18n();
  const { user, logout } = useAuth();
  const [activeIdx, setActiveIdx] = useState<number | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [bookingOpen, setBookingOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
      setActiveIdx(null);
      setProfileOpen(false);
    };
    const handleClick = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileOpen(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    document.addEventListener("mousedown", handleClick);
    return () => { window.removeEventListener("scroll", handleScroll); document.removeEventListener("mousedown", handleClick); };
  }, []);

  const handleMenuEnter = (idx: number) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setActiveIdx(idx);
  };

  const handleMenuLeave = () => {
    timeoutRef.current = setTimeout(() => setActiveIdx(null), 300);
  };

  const section = activeIdx !== null ? megaMenuData[activeIdx] : null;

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled || activeIdx !== null ? "bg-[rgba(11,24,41,0.85)] backdrop-blur-[30px] shadow-2xl shadow-black/30" : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">
            <Link href="/" className="flex items-center gap-3 group flex-shrink-0">
              <Image
                src="/images/logo-llm-official.jpeg"
                alt="Lord Lombo Ministries"
                width={40}
                height={40}
                className="rounded-lg group-hover:opacity-90 transition-all duration-300"
              />
              <div className="hidden sm:block">
                <span className="text-base font-bold text-cream group-hover:text-gold transition-colors font-heading leading-none block">
                  Lord Lombo Ministries
                </span>
              </div>
            </Link>

            <nav
              className="hidden lg:flex items-center gap-0.5 rounded-full px-2 py-1.5 outline-none"
              onMouseLeave={handleMenuLeave}
            >
              {megaMenuData.map((menu, idx) => (
                <div key={menu.navKey} onMouseEnter={() => handleMenuEnter(idx)} className="relative">
                  <Link
                    href={menu.items[0].href}
                    className={`px-5 py-2 text-sm font-medium rounded-full transition-all duration-200 block outline-none focus:outline-none focus-visible:outline-none ${
                      activeIdx === idx
                        ? "text-navy bg-gold shadow-md shadow-gold/20"
                        : "text-cream/70 hover:text-cream"
                    }`}
                  >
                    {t(menu.navKey)}
                  </Link>
                </div>
              ))}
            </nav>

            <div className="hidden lg:flex items-center gap-3">
              {/* Language switcher */}
              <div className="flex items-center rounded-lg border border-cream/10 overflow-hidden">
                <button
                  onClick={() => setLocale("fr")}
                  className={`px-2.5 py-1.5 text-[11px] font-bold transition-all ${
                    locale === "fr" ? "bg-gold text-navy" : "text-cream/40 hover:text-cream/60"
                  }`}
                >
                  FR
                </button>
                <button
                  onClick={() => setLocale("en")}
                  className={`px-2.5 py-1.5 text-[11px] font-bold transition-all ${
                    locale === "en" ? "bg-gold text-navy" : "text-cream/40 hover:text-cream/60"
                  }`}
                >
                  EN
                </button>
              </div>

              <button
                onClick={() => setBookingOpen(true)}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gold/10 border border-gold/20 text-gold text-sm font-medium hover:bg-gold/20 hover:border-gold/40 transition-all group"
              >
                <FaCalendarAlt className="text-xs" />
                {t("nav.rdv")}
                <FaArrowRight className="text-xs opacity-0 -ml-2 group-hover:opacity-100 group-hover:ml-0 transition-all" />
              </button>
              {user ? (
                <div ref={profileRef} className="relative">
                  <button
                    onClick={() => setProfileOpen(!profileOpen)}
                    className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl border border-cream/[0.08] hover:border-gold/30 hover:bg-cream/[0.03] transition-all group"
                  >
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gold to-gold-light flex items-center justify-center text-navy font-bold text-xs">
                      {(user.firstName?.[0] || "U").toUpperCase()}{(user.lastName?.[0] || "").toUpperCase()}
                    </div>
                    <span className="text-cream/70 text-sm font-medium group-hover:text-cream transition-colors hidden xl:block">{user.firstName}</span>
                  </button>
                  <AnimatePresence>
                    {profileOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 8, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 8, scale: 0.95 }}
                        transition={{ duration: 0.15 }}
                        className="absolute right-0 top-full mt-2 w-56 bg-[#111827] border border-cream/[0.08] rounded-xl shadow-2xl shadow-black/40 overflow-hidden z-[999]"
                      >
                        <div className="px-4 py-3 border-b border-cream/[0.06]">
                          <p className="text-cream text-sm font-semibold">{user.firstName} {user.lastName}</p>
                          <p className="text-cream/40 text-xs truncate">{user.email}</p>
                        </div>
                        <div className="py-1.5">
                          <Link href={user.role === "ADMIN" ? "/admin" : "/dashboard"} onClick={() => setProfileOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-cream/60 text-sm hover:bg-cream/[0.04] hover:text-cream transition-all">
                            <FaChartBar className="text-xs" />
                            {user.role === "ADMIN" ? "Administration" : "Mon espace"}
                          </Link>
                          <Link href={user.role === "ADMIN" ? "/admin/parametres" : "/dashboard?tab=settings"} onClick={() => setProfileOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-cream/60 text-sm hover:bg-cream/[0.04] hover:text-cream transition-all">
                            <FaCog className="text-xs" />
                            {locale === "fr" ? "Parametres" : "Settings"}
                          </Link>
                        </div>
                        <div className="border-t border-cream/[0.06] py-1.5">
                          <button onClick={() => { setProfileOpen(false); logout(); }} className="flex items-center gap-3 w-full px-4 py-2.5 text-red-400/70 text-sm hover:bg-red-500/[0.06] hover:text-red-400 transition-all">
                            <FaSignOutAlt className="text-xs" />
                            {locale === "fr" ? "Deconnexion" : "Logout"}
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <>
                  <Link href="/connexion">
                    <Button variant="ghost" size="sm">{t("nav.login")}</Button>
                  </Link>
                  <Link href="/inscription">
                    <Button variant="primary" size="sm">{t("nav.register")}</Button>
                  </Link>
                </>
              )}
            </div>

            <div className="flex items-center gap-3 lg:hidden">
              {/* Mobile language switcher */}
              <div className="flex items-center rounded-md border border-cream/10 overflow-hidden">
                <button
                  onClick={() => setLocale("fr")}
                  className={`px-2 py-1 text-[10px] font-bold ${locale === "fr" ? "bg-gold text-navy" : "text-cream/40"}`}
                >
                  FR
                </button>
                <button
                  onClick={() => setLocale("en")}
                  className={`px-2 py-1 text-[10px] font-bold ${locale === "en" ? "bg-gold text-navy" : "text-cream/40"}`}
                >
                  EN
                </button>
              </div>

              <button
                onClick={() => setBookingOpen(true)}
                className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gold/10 border border-gold/20 text-gold text-xs font-medium"
              >
                <FaCalendarAlt /> RDV
              </button>
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="text-cream/70 hover:text-gold p-2 transition-colors"
                aria-label="Menu"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  {mobileOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* MEGA MENU */}
        <AnimatePresence>
          {activeIdx !== null && section && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="hidden lg:block absolute left-1/2 -translate-x-1/2 top-full z-[100]"
              style={{ width: section.featured ? "780px" : "420px" }}
              onMouseEnter={() => { if (timeoutRef.current) clearTimeout(timeoutRef.current); }}
              onMouseLeave={handleMenuLeave}
            >
              <div className="mt-2 glass-strong rounded-2xl border border-cream/8 shadow-2xl shadow-black/40 p-6">
                <div className={`grid gap-7 ${section.featured ? "grid-cols-5" : "grid-cols-1"}`}>
                  <div className={section.featured ? "col-span-3" : "col-span-1"}>
                    <h3 className="text-xs font-bold text-gold/50 uppercase tracking-[0.2em] mb-4">
                      {t(section.titleKey)}
                    </h3>
                    <div className={`grid ${section.items.length > 3 ? "grid-cols-2" : "grid-cols-1"} gap-0.5`}>
                      {section.items.map((item, i) => (
                        <motion.div
                          key={item.labelKey}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.03 }}
                        >
                          <Link
                            href={item.href}
                            onClick={() => setActiveIdx(null)}
                            className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-gold/10 transition-all group"
                          >
                            <div className="w-9 h-9 rounded-lg bg-gold/8 flex items-center justify-center text-gold/50 group-hover:bg-gold/15 group-hover:text-gold transition-all flex-shrink-0 text-sm">
                              {item.icon}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <span className="text-sm font-medium text-cream/80 group-hover:text-gold transition-colors">
                                  {t(item.labelKey)}
                                </span>
                                {item.badgeKey && (
                                  <span className="px-1.5 py-0.5 text-[9px] font-bold rounded-full bg-gold/15 text-gold">
                                    {t(item.badgeKey)}
                                  </span>
                                )}
                              </div>
                              <span className="text-xs text-cream/30">{t(item.descKey)}</span>
                            </div>
                          </Link>
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  {section.featured && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.1 }}
                      className="col-span-2"
                    >
                      <Link href={section.featured.href} onClick={() => setActiveIdx(null)} className="block group h-full">
                        <div className="relative rounded-2xl overflow-hidden h-full min-h-[220px]">
                          <Image
                            src={section.featured.image}
                            alt={t(section.featured.titleKey)}
                            fill
                            className="object-cover transition-transform duration-700 group-hover:scale-110"
                            sizes="350px"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-dark via-dark/60 to-transparent" />
                          <div className="absolute bottom-0 left-0 right-0 p-5">
                            {section.featured.badgeKey && (
                              <span className="inline-block px-2 py-0.5 text-[9px] font-bold rounded-full bg-gold/20 text-gold border border-gold/30 mb-2">
                                {t(section.featured.badgeKey)}
                              </span>
                            )}
                            <h4 className="text-base font-bold text-cream group-hover:text-gold transition-colors mb-1">
                              {t(section.featured.titleKey)}
                            </h4>
                            <p className="text-cream/45 text-xs">{t(section.featured.descKey)}</p>
                          </div>
                        </div>
                      </Link>
                    </motion.div>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* MOBILE MENU */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden glass-strong overflow-hidden border-t border-cream/5 max-h-[80vh] overflow-y-auto"
            >
              <div className="px-4 pb-6 pt-2">
                {megaMenuData.map((menu) => (
                  <MobileMenuSection key={menu.navKey} section={menu} onClose={() => setMobileOpen(false)} />
                ))}
                <div className="flex gap-3 mt-5 pt-5 border-t border-cream/5">
                  <Link href="/connexion" className="flex-1" onClick={() => setMobileOpen(false)}>
                    <Button variant="outline" size="sm" className="w-full">{t("nav.login")}</Button>
                  </Link>
                  <Link href="/inscription" className="flex-1" onClick={() => setMobileOpen(false)}>
                    <Button variant="primary" size="sm" className="w-full">{t("nav.register")}</Button>
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      <BookingModal isOpen={bookingOpen} onClose={() => setBookingOpen(false)} />
    </>
  );
}

function MobileMenuSection({ section, onClose }: { section: MegaMenuSection; onClose: () => void }) {
  const [open, setOpen] = useState(false);
  const { t } = useI18n();
  return (
    <div className="border-b border-cream/5">
      <button onClick={() => setOpen(!open)} className="w-full flex items-center justify-between py-3 text-cream/70 hover:text-gold transition-colors">
        <span className="font-medium">{t(section.navKey)}</span>
        <motion.span animate={{ rotate: open ? 180 : 0 }} className="text-xs text-cream/30">&#9660;</motion.span>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
            <div className="pb-3 pl-2 space-y-1">
              {section.items.map((item) => (
                <Link key={item.labelKey} href={item.href} onClick={onClose} className="flex items-center gap-3 py-2 px-3 rounded-lg text-cream/50 hover:text-gold hover:bg-cream/5 transition-all text-sm">
                  <span className="text-gold/40">{item.icon}</span>
                  <span>{t(item.labelKey)}</span>
                  {item.badgeKey && <span className="px-1.5 py-0.5 text-[9px] font-bold rounded-full bg-gold/15 text-gold">{t(item.badgeKey)}</span>}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
