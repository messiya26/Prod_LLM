"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import {
  FaBookOpen, FaClock, FaTrophy, FaChartLine, FaPlay,
  FaCalendarAlt, FaArrowRight, FaBell, FaFire, FaStar, FaEnvelope
} from "react-icons/fa";
import { useAuth } from "@/context/auth-context";
import { useI18n } from "@/context/i18n-context";
import api from "@/lib/api";

interface EnrollmentData {
  id: string;
  progress: number;
  status: string;
  course: { id: string; title: string; slug: string; thumbnail: string | null; level: string; _count?: { modules: number } };
}

export default function Dashboard() {
  const { user, resendVerification } = useAuth();
  const { t, locale } = useI18n();
  const [resent, setResent] = useState(false);
  const [enrollments, setEnrollments] = useState<EnrollmentData[]>([]);
  const [loadingEnroll, setLoadingEnroll] = useState(true);
  const hour = new Date().getHours();
  const greeting = hour < 12 ? t("dash.hello") : hour < 18 ? t("dash.afternoon") : t("dash.evening");

  useEffect(() => {
    api.get<EnrollmentData[]>("/enrollments")
      .then((d) => setEnrollments(Array.isArray(d) ? d : []))
      .catch(() => {})
      .finally(() => setLoadingEnroll(false));
  }, []);

  const totalProgress = useMemo(() => {
    const active = enrollments.filter(e => e.progress > 0);
    if (!active.length) return 0;
    return Math.round(active.reduce((s, e) => s + e.progress, 0) / active.length);
  }, [enrollments]);

  const stats = [
    { icon: <FaBookOpen />, labelKey: "dash.activeFormations", value: String(enrollments.length), color: "bg-blue-500" },
    { icon: <FaClock />, labelKey: "dash.courseHours", value: `${enrollments.length * 8}h`, color: "bg-emerald-500" },
    { icon: <FaTrophy />, labelKey: "dash.certificates", value: String(enrollments.filter(e => e.progress >= 100).length), color: "bg-gold" },
    { icon: <FaChartLine />, labelKey: "dash.avgProgress", value: `${totalProgress}%`, color: "bg-rose-500" },
  ];

  return (
    <div className="space-y-6 max-w-[1400px]">
      {user && !user.emailVerified && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-3 p-4 rounded-xl bg-amber-500/10 border border-amber-500/20">
          <FaEnvelope className="text-amber-400 flex-shrink-0" />
          <p className="text-amber-200 text-sm flex-1">
            Votre email n&apos;est pas encore verifie. Consultez votre boite de reception pour confirmer votre compte.
          </p>
          <button
            onClick={async () => { await resendVerification(); setResent(true); }}
            disabled={resent}
            className="px-4 py-2 rounded-lg bg-amber-500/20 text-amber-300 text-xs font-medium hover:bg-amber-500/30 transition-all disabled:opacity-50"
          >
            {resent ? "Email renvoye !" : "Renvoyer le lien"}
          </button>
        </motion.div>
      )}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="relative rounded-2xl overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-[#0d1a2e] via-[#0f1f35] to-[#122640]" />
        <div className="absolute top-0 right-0 w-64 h-64 bg-gold/5 rounded-full -translate-y-1/2 translate-x-1/3" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-gold/3 rounded-full translate-y-1/2 -translate-x-1/3" />
        <div className="relative p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <FaFire className="text-gold text-sm" />
              <span className="text-gold text-xs font-medium">3 {t("dash.streak")}</span>
            </div>
            <h1 className="text-xl md:text-2xl font-bold text-white mb-1">
              {greeting}, {user?.firstName || t("dash.learner")}
            </h1>
            <p className="text-white/35 text-sm">{t("dash.progress.desc")} <span className="text-gold font-semibold">{totalProgress}%</span>.</p>
          </div>
          <Link href="/formations">
            <button className="flex items-center gap-2 px-5 py-3 rounded-xl bg-gold text-navy font-bold text-sm hover:bg-gold-light transition-all shadow-lg shadow-gold/20 group whitespace-nowrap">
              {t("dash.continue")}
              <FaArrowRight className="text-xs group-hover:translate-x-1 transition-transform" />
            </button>
          </Link>
        </div>
      </motion.div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s, i) => (
          <motion.div key={s.labelKey} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }} className="rounded-2xl bg-white/[0.02] border border-white/[0.06] p-5 hover:border-white/10 transition-all">
            <div className={`w-10 h-10 rounded-xl ${s.color} flex items-center justify-center text-white text-sm shadow-lg mb-3`}>{s.icon}</div>
            <div className="text-2xl font-bold text-white">{s.value}</div>
            <div className="text-white/30 text-xs mt-1">{t(s.labelKey)}</div>
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-5">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-white">{t("dash.myCourses")}</h2>
            <Link href="/dashboard/formations" className="text-[10px] text-gold hover:text-gold-light transition-colors">{t("dash.seeAll")}</Link>
          </div>
          {loadingEnroll ? (
            <div className="space-y-3">{[1,2].map(i => <div key={i} className="h-28 rounded-2xl bg-white/[0.02] animate-pulse" />)}</div>
          ) : enrollments.length === 0 ? (
            <div className="rounded-2xl bg-white/[0.02] border border-white/[0.06] p-8 text-center">
              <FaBookOpen className="text-white/10 text-3xl mx-auto mb-3" />
              <p className="text-white/30 text-sm mb-4">{locale === "fr" ? "Aucune formation inscrite" : "No enrolled courses"}</p>
              <Link href="/formations" className="inline-block px-5 py-2.5 rounded-xl bg-gold text-navy font-bold text-xs">{locale === "fr" ? "Explorer le catalogue" : "Browse catalog"}</Link>
            </div>
          ) : (
            enrollments.slice(0, 3).map((e, i) => (
              <motion.div key={e.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 + i * 0.08 }}>
                <Link href={`/dashboard/formation/${e.course.slug}`} className="rounded-2xl overflow-hidden bg-white/[0.02] border border-white/[0.06] group cursor-pointer hover:border-gold/20 transition-all flex flex-col sm:flex-row">
                  <div className="relative w-full sm:w-44 h-32 sm:h-auto flex-shrink-0">
                    {e.course.thumbnail ? (
                      <Image src={e.course.thumbnail} alt={e.course.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" sizes="200px" />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-gold/10 to-gold/5 flex items-center justify-center"><FaPlay className="text-gold/30 text-xl" /></div>
                    )}
                    {e.progress > 0 && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-12 h-12 rounded-full bg-gold/20 backdrop-blur-sm flex items-center justify-center border border-gold/30 group-hover:scale-110 transition-transform">
                          <FaPlay className="text-gold text-sm ml-0.5" />
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="flex-1 p-5">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="text-sm font-bold text-white group-hover:text-gold transition-colors">{e.course.title}</h3>
                      <span className="text-gold font-bold text-sm">{e.progress}%</span>
                    </div>
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-[10px] text-white/30">{e.course._count?.modules ?? 0} {t("dash.modules")}</span>
                      <span className="text-[10px] text-white/15">|</span>
                      <span className="text-[10px] text-white/30 capitalize">{e.course.level?.toLowerCase().replace("_", " ")}</span>
                    </div>
                    <div className="w-full h-1.5 rounded-full bg-white/[0.06]">
                      <div className="h-full rounded-full bg-gradient-to-r from-gold to-gold-light transition-all duration-700" style={{ width: `${e.progress}%` }} />
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))
          )}
        </div>

        <div className="space-y-5">
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="rounded-2xl bg-white/[0.02] border border-white/[0.06] p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-white">{t("dash.events")}</h3>
              <FaCalendarAlt className="text-white/15 text-xs" />
            </div>
            <div className="space-y-3">
              {[
                { title: "Masterclass Live - Leadership", date: "28 Fev 2026", time: "14h00", live: true },
                { title: "Session Q&A - Formation Pastorale", date: "02 Mar 2026", time: "10h00", live: false },
                { title: "Webinaire - Croissance Spirituelle", date: "05 Mar 2026", time: "18h00", live: false },
              ].map((ev) => (
                <div key={ev.title} className="flex items-start gap-3 p-3 rounded-xl hover:bg-white/[0.03] transition-all cursor-pointer group">
                  <div className="w-10 h-10 rounded-xl bg-gold/10 flex items-center justify-center flex-shrink-0">
                    {ev.live ? <FaPlay className="text-gold text-xs" /> : <FaCalendarAlt className="text-gold/50 text-xs" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-medium text-white group-hover:text-gold transition-colors truncate">{ev.title}</div>
                    <div className="text-[10px] text-white/25">{ev.date} - {ev.time}</div>
                  </div>
                  {ev.live && <span className="px-2 py-0.5 text-[9px] font-bold rounded-full bg-red-500/15 text-red-400 animate-pulse">LIVE</span>}
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="rounded-2xl bg-white/[0.02] border border-white/[0.06] p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-white">{t("dash.notifications")}</h3>
              <div className="relative"><FaBell className="text-white/15 text-xs" /><span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full" /></div>
            </div>
            <div className="space-y-2">
              {[
                { text: "Nouveau module disponible dans Leadership & Influence", time: "Il y a 2h" },
                { text: "Votre certificat Croissance Spirituelle est bientot pret", time: "Il y a 1j" },
                { text: "Live Masterclass demain a 14h00", time: "Il y a 1j" },
              ].map((n) => (
                <div key={n.text} className="p-3 rounded-xl hover:bg-white/[0.03] transition-all cursor-pointer">
                  <div className="text-xs text-white/60">{n.text}</div>
                  <div className="text-[10px] text-white/20 mt-1">{n.time}</div>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="rounded-2xl bg-gradient-to-br from-gold/10 to-gold/5 border border-gold/10 p-5">
            <div className="flex items-center gap-2 mb-3">
              <FaStar className="text-gold text-sm" />
              <h3 className="text-sm font-bold text-white">{t("dash.recommended")}</h3>
            </div>
            <p className="text-white/35 text-xs mb-4">{t("dash.recommended.desc")}</p>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-gold/20 flex items-center justify-center"><FaBookOpen className="text-gold" /></div>
              <div>
                <div className="text-xs font-bold text-white">{t("formations.f4.title")}</div>
                <div className="text-[10px] text-white/30">12 {t("dash.modules")} - 18{t("dash.contentHours")}</div>
              </div>
            </div>
            <button className="w-full py-2.5 rounded-xl bg-gold text-navy font-bold text-xs hover:bg-gold-light transition-all">{t("dash.discover")}</button>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
