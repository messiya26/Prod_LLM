"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  FaUsers, FaBookOpen, FaVideo, FaDollarSign,
  FaArrowRight, FaChevronLeft, FaChevronRight,
  FaEllipsisV, FaGlobeAfrica, FaSpinner
} from "react-icons/fa";
import { useI18n } from "@/context/i18n-context";
import api from "@/lib/api";

interface DashStats { totalStudents: number; totalCourses: number; totalLive: number; totalRevenue: number; }
interface RecentEnroll { id: string; user: { firstName: string; lastName: string }; course: { title: string }; createdAt: string; status: string; }
interface Payment { id: string; amount: number; currency: string; user?: { firstName: string; lastName: string }; createdAt: string; }

const chartData = [32, 45, 38, 52, 48, 60, 55, 70, 65, 78, 72, 85, 80, 92, 88, 95, 90, 105, 98, 115, 108, 120, 115, 130, 125, 140, 135, 148, 142, 155];

export default function AdminDashboard() {
  const { t } = useI18n();
  const [calMonth, setCalMonth] = useState(new Date().getMonth());
  const [calYear, setCalYear] = useState(new Date().getFullYear());
  const [stats, setStats] = useState<DashStats>({ totalStudents: 0, totalCourses: 0, totalLive: 0, totalRevenue: 0 });
  const [enrollments, setEnrollments] = useState<RecentEnroll[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    try {
      const [users, courses, live, pays, enroll] = await Promise.all([
        api.get<any[]>("/users").catch(() => []),
        api.get<any[]>("/courses").catch(() => []),
        api.get<any[]>("/live").catch(() => []),
        api.get<any[]>("/payments").catch(() => []),
        api.get<any[]>("/enrollments/admin/recent").catch(() => []),
      ]);
      const uArr = Array.isArray(users) ? users : [];
      const cArr = Array.isArray(courses) ? courses : [];
      const lArr = Array.isArray(live) ? live : [];
      const pArr = Array.isArray(pays) ? pays : [];
      const eArr = Array.isArray(enroll) ? enroll : [];
      setStats({
        totalStudents: uArr.length,
        totalCourses: cArr.length,
        totalLive: lArr.length,
        totalRevenue: pArr.reduce((s: number, p: any) => s + (p.amount || 0), 0),
      });
      setPayments(pArr.slice(0, 4));
      setEnrollments(eArr.slice(0, 5));
    } catch {} finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const calDays = useMemo(() => {
    const first = new Date(calYear, calMonth, 1).getDay();
    const total = new Date(calYear, calMonth + 1, 0).getDate();
    const days: (number | null)[] = Array(first).fill(null);
    for (let i = 1; i <= total; i++) days.push(i);
    return days;
  }, [calMonth, calYear]);

  const monthKeys = ["admin.month.jan","admin.month.feb","admin.month.mar","admin.month.apr","admin.month.may","admin.month.jun","admin.month.jul","admin.month.aug","admin.month.sep","admin.month.oct","admin.month.nov","admin.month.dec"];
  const dayKeys = ["admin.day.sun","admin.day.mon","admin.day.tue","admin.day.wed","admin.day.thu","admin.day.fri","admin.day.sat"];

  const today = new Date().getDate();
  const isCurrentMonth = calMonth === new Date().getMonth() && calYear === new Date().getFullYear();
  const maxChart = Math.max(...chartData);
  const svgW = 500;
  const svgH = 120;
  const points = chartData.map((v, i) => `${(i / (chartData.length - 1)) * svgW},${svgH - (v / maxChart) * svgH}`).join(" ");

  const formatCurrency = (amount: number) => `$${amount.toLocaleString("en-US", { minimumFractionDigits: 0 })}`;

  const statCards = [
    { icon: <FaUsers />, labelKey: "admin.totalStudents", value: stats.totalStudents.toLocaleString(), bg: "from-blue-500/20 to-blue-600/10", iconBg: "bg-blue-500", iconColor: "text-white" },
    { icon: <FaBookOpen />, labelKey: "admin.totalFormations", value: String(stats.totalCourses), bg: "from-emerald-500/20 to-emerald-600/10", iconBg: "bg-emerald-500", iconColor: "text-white" },
    { icon: <FaVideo />, labelKey: "admin.totalVideos", value: String(stats.totalLive), bg: "from-rose-500/20 to-rose-600/10", iconBg: "bg-rose-500", iconColor: "text-white" },
    { icon: <FaDollarSign />, labelKey: "admin.totalRevenue", value: formatCurrency(stats.totalRevenue), bg: "from-gold/20 to-gold/10", iconBg: "bg-gold", iconColor: "text-navy" },
  ];

  const engagementData = [
    { country: "RD Congo", pct: 63, color: "bg-gold" },
    { country: "Congo-Brazza", pct: 21, color: "bg-emerald-500" },
    { country: "France", pct: 11, color: "bg-amber-500" },
    { country: "Belgique", pct: 5, color: "bg-rose-500" },
  ];

  if (loading) return (
    <div className="flex items-center justify-center h-64"><FaSpinner className="text-gold text-2xl animate-spin" /></div>
  );

  return (
    <div className="space-y-6 max-w-[1400px]">
      <div>
        <h1 className="text-xl font-bold text-white">{t("admin.dashboard")}</h1>
        <p className="text-white/30 text-sm">{t("admin.overview")}</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((s, i) => (
          <motion.div key={s.labelKey} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }} className={`rounded-2xl bg-gradient-to-br ${s.bg} border border-white/[0.06] p-5 relative overflow-hidden group hover:border-white/10 transition-all`}>
            <div className="absolute top-0 right-0 w-24 h-24 bg-white/[0.02] rounded-full -translate-y-1/2 translate-x-1/2" />
            <div className={`w-11 h-11 rounded-xl ${s.iconBg} ${s.iconColor} flex items-center justify-center text-lg shadow-lg mb-3`}>{s.icon}</div>
            <div className="text-2xl font-bold text-white">{s.value}</div>
            <div className="text-white/35 text-xs mt-1">{t(s.labelKey)}</div>
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-5 gap-5">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="lg:col-span-3 rounded-2xl bg-white/[0.02] border border-white/[0.06] p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-sm font-bold text-white">{t("admin.activity")}</h3>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-gold" /><span className="text-[10px] text-white/30">{t("admin.thisMonth")}</span></div>
            </div>
          </div>
          <div className="relative h-36">
            <svg viewBox={`0 0 ${svgW} ${svgH}`} className="w-full h-full" preserveAspectRatio="none">
              <defs><linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#D4A853" stopOpacity="0.3" /><stop offset="100%" stopColor="#D4A853" stopOpacity="0" /></linearGradient></defs>
              <polygon points={`0,${svgH} ${points} ${svgW},${svgH}`} fill="url(#chartGrad)" />
              <polyline points={points} fill="none" stroke="#D4A853" strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" />
            </svg>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }} className="lg:col-span-2 rounded-2xl bg-white/[0.02] border border-white/[0.06] p-6">
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-sm font-bold text-white">{t("admin.transactions")}</h3>
            <Link href="/admin/transactions" className="text-[10px] text-gold hover:text-gold-light transition-colors">{t("dash.seeAll")}</Link>
          </div>
          <div className="space-y-3">
            {payments.length === 0 && <p className="text-white/20 text-xs text-center py-4">Aucune transaction</p>}
            {payments.map((tr) => (
              <div key={tr.id} className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-gold/30 to-gold-light/20 flex items-center justify-center text-[10px] font-bold text-gold flex-shrink-0">
                  {(tr.user?.firstName?.[0] || "?")}{(tr.user?.lastName?.[0] || "")}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-medium text-white">{t("admin.received")} <span className="text-emerald-400 font-bold">{formatCurrency(tr.amount)}</span></div>
                  <div className="text-[10px] text-white/25">{tr.user ? `${tr.user.firstName} ${tr.user.lastName}` : "Anonyme"}</div>
                </div>
                <div className="text-[10px] text-white/20">{new Date(tr.createdAt).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}</div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      <div className="grid md:grid-cols-2 gap-5">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }} className="rounded-2xl bg-white/[0.02] border border-white/[0.06] p-6">
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-sm font-bold text-white">{t("admin.engagement")}</h3>
            <FaEllipsisV className="text-white/15 text-xs cursor-pointer hover:text-white/30 transition-colors" />
          </div>
          <div className="flex items-center justify-center mb-5">
            <div className="relative w-28 h-28">
              <FaGlobeAfrica className="w-full h-full text-gold/20" />
              <div className="absolute inset-0 flex items-center justify-center"><div className="w-3 h-3 rounded-full bg-gold shadow-lg shadow-gold/40 animate-pulse" /></div>
            </div>
          </div>
          <div className="flex flex-wrap justify-center gap-3">
            {engagementData.map((e) => (
              <div key={e.country} className="flex items-center gap-1.5">
                <span className={`w-2 h-2 rounded-full ${e.color}`} />
                <span className="text-[10px] text-white/40">{e.country}</span>
                <span className="text-[10px] font-bold text-white/60">{e.pct}%</span>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="rounded-2xl bg-white/[0.02] border border-white/[0.06] p-6">
          <div className="flex items-center justify-between mb-4"><h3 className="text-sm font-bold text-white">{t("admin.calendar")}</h3></div>
          <div className="flex items-center justify-between mb-4">
            <button onClick={() => { if (calMonth === 0) { setCalMonth(11); setCalYear(calYear - 1); } else setCalMonth(calMonth - 1); }} className="w-7 h-7 rounded-lg bg-gold/10 text-gold flex items-center justify-center hover:bg-gold/20 transition-colors text-xs"><FaChevronLeft /></button>
            <span className="text-xs font-semibold text-white">{t(monthKeys[calMonth])} {calYear}</span>
            <button onClick={() => { if (calMonth === 11) { setCalMonth(0); setCalYear(calYear + 1); } else setCalMonth(calMonth + 1); }} className="w-7 h-7 rounded-lg bg-gold/10 text-gold flex items-center justify-center hover:bg-gold/20 transition-colors text-xs"><FaChevronRight /></button>
          </div>
          <div className="grid grid-cols-7 gap-0.5 text-center mb-2">
            {dayKeys.map((dk) => (<div key={dk} className="text-[9px] font-medium text-white/20 py-1">{t(dk)}</div>))}
          </div>
          <div className="grid grid-cols-7 gap-0.5 text-center">
            {calDays.map((day, i) => (
              <div key={i} className={`py-1.5 text-[11px] rounded-lg transition-all cursor-pointer ${!day ? "" : day === today && isCurrentMonth ? "bg-gold text-navy font-bold shadow-lg shadow-gold/30" : "text-white/40 hover:bg-white/[0.04] hover:text-white"}`}>{day || ""}</div>
            ))}
          </div>
        </motion.div>
      </div>

      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.55 }} className="rounded-2xl bg-white/[0.02] border border-white/[0.06] overflow-hidden overflow-x-auto">
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.04]">
          <h3 className="text-sm font-bold text-white">{t("admin.recentEnroll")}</h3>
          <Link href="/admin/utilisateurs" className="text-[10px] text-gold hover:text-gold-light flex items-center gap-1 transition-colors">{t("dash.seeAll")} <FaArrowRight className="text-[8px]" /></Link>
        </div>
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/[0.04]">
              {["admin.student", "admin.formation", "admin.date", "admin.status"].map((hk) => (
                <th key={hk} className="text-left text-white/25 text-[10px] font-medium uppercase tracking-wider px-6 py-3">{t(hk)}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {enrollments.length === 0 && (
              <tr><td colSpan={4} className="px-6 py-8 text-center text-white/20 text-xs">Aucune inscription recente</td></tr>
            )}
            {enrollments.map((u) => (
              <tr key={u.id} className="border-b border-white/[0.02] hover:bg-white/[0.015] transition-colors">
                <td className="px-6 py-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-gold/30 to-gold-light/20 flex items-center justify-center text-[10px] font-bold text-gold">
                      {u.user?.firstName?.[0] || "?"}{u.user?.lastName?.[0] || ""}
                    </div>
                    <span className="text-xs font-medium text-white">{u.user?.firstName} {u.user?.lastName}</span>
                  </div>
                </td>
                <td className="px-6 py-3 text-xs text-white/40">{u.course?.title}</td>
                <td className="px-6 py-3 text-xs text-white/25">{new Date(u.createdAt).toLocaleDateString("fr-FR", { day: "2-digit", month: "short" })}</td>
                <td className="px-6 py-3">
                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-medium ${u.status === "ACTIVE" ? "bg-emerald-400/10 text-emerald-400" : "bg-amber-400/10 text-amber-400"}`}>{u.status === "ACTIVE" ? t("admin.active") : t("admin.pending")}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </motion.div>
    </div>
  );
}
