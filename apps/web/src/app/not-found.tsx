"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { FaHome, FaArrowRight, FaSearch } from "react-icons/fa";
import { useI18n } from "@/context/i18n-context";

export default function NotFound() {
  const { t } = useI18n();
  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-dark">
      {/* Background pattern */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(212,168,83,0.05)_0%,transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_50%,rgba(212,168,83,0.03)_0%,transparent_60%)]" />
        <svg className="absolute inset-0 w-full h-full opacity-[0.02]" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#D4A853" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      {/* Floating elements */}
      <motion.div
        animate={{ y: [0, -20, 0], rotate: [0, 5, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-[15%] left-[10%] hidden md:block"
      >
        <svg width="120" height="120" viewBox="0 0 120 120" fill="none">
          <path d="M60 10L70 40H100L75 60L85 90L60 72L35 90L45 60L20 40H50L60 10Z" fill="#D4A853" fillOpacity="0.1" stroke="#D4A853" strokeOpacity="0.2" strokeWidth="1" />
        </svg>
      </motion.div>

      <motion.div
        animate={{ y: [0, 15, 0], rotate: [0, -8, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-[20%] right-[8%] hidden md:block"
      >
        <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
          <circle cx="40" cy="40" r="35" stroke="#D4A853" strokeOpacity="0.15" strokeWidth="1" strokeDasharray="5 5" />
          <circle cx="40" cy="40" r="20" fill="#D4A853" fillOpacity="0.05" />
        </svg>
      </motion.div>

      <motion.div
        animate={{ x: [0, 10, 0], y: [0, -10, 0] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-[25%] right-[20%] hidden md:block"
      >
        <svg width="60" height="60" viewBox="0 0 60 60" fill="none">
          <rect x="10" y="10" width="40" height="40" rx="8" stroke="#D4A853" strokeOpacity="0.12" strokeWidth="1" transform="rotate(15 30 30)" />
        </svg>
      </motion.div>

      {/* Curved line decoration */}
      <svg className="absolute left-0 bottom-0 w-full h-1/2 hidden md:block" viewBox="0 0 1400 400" fill="none" preserveAspectRatio="none">
        <path d="M0 350 C200 200, 400 380, 600 280 S900 100, 1100 250 S1300 350, 1400 200" stroke="#D4A853" strokeOpacity="0.08" strokeWidth="1.5" fill="none" />
      </svg>

      {/* Main content */}
      <div className="relative z-10 text-center px-6">
        {/* Big circle with 404 */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, type: "spring" }}
          className="relative inline-block mb-8"
        >
          <div className="w-64 h-64 md:w-80 md:h-80 rounded-full bg-gradient-to-br from-cream/[0.06] to-cream/[0.02] border border-cream/[0.08] flex items-center justify-center mx-auto shadow-2xl shadow-gold/5">
            <div>
              <motion.span
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-[100px] md:text-[140px] font-black text-cream/90 leading-none block"
              >
                404
              </motion.span>
            </div>
          </div>
          <div className="absolute -top-4 -right-4 w-8 h-8 rounded-full bg-gold/20 animate-pulse" />
          <div className="absolute -bottom-2 -left-6 w-5 h-5 rounded-full bg-gold/10 animate-pulse" style={{ animationDelay: "1s" }} />
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-2xl md:text-3xl font-bold text-cream mb-3"
        >
          {t("404.title")}
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="text-cream/40 text-sm md:text-base max-w-md mx-auto mb-8"
        >
          {t("404.desc")}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link href="/">
            <button className="flex items-center gap-2 px-8 py-3.5 rounded-xl bg-gradient-to-r from-gold to-gold-light text-navy font-bold text-sm hover:shadow-lg hover:shadow-gold/20 transition-all group">
              <FaHome className="text-xs" />
              {t("404.home")}
              <FaArrowRight className="text-xs group-hover:translate-x-1 transition-transform" />
            </button>
          </Link>
          <Link href="/formations">
            <button className="flex items-center gap-2 px-6 py-3.5 rounded-xl border border-cream/10 text-cream/60 text-sm font-medium hover:border-gold/30 hover:text-gold transition-all">
              <FaSearch className="text-xs" />
              {t("404.explore")}
            </button>
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
