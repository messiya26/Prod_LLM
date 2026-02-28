"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  FaUsers, FaBookOpen, FaVideo, FaDollarSign,
  FaArrowRight, FaChevronLeft, FaChevronRight,
  FaEllipsisV, FaGlobeAfrica
} from "react-icons/fa";
import { useI18n } from "@/context/i18n-context";

const chartData = [32, 45, 38, 52, 48, 60, 55, 70, 65, 78, 72, 85, 80, 92, 88, 95, 90, 105, 98, 115, 108, 120, 115, 130, 125, 140, 135, 148, 142, 155];

export default function AdminDashboard() {
  const { t } = useI18n();
  const [calMonth, setCalMonth] = useState(new Date().getMonth());
  const [calYear, setCalYear] = useState(new Date().getFullYear());

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

  const stats = [
    { icon: <FaUsers />, labelKey: "admin.totalStudents", value: "1,247", bg: "from-blue-500/20 to-blue-600/10", iconBg: "bg-blue-500", iconColor: "text-white" },
    { icon: <FaBookOpen />, labelKey: "admin.totalFormations", value: "12", bg: "from-emerald-500/20 to-emerald-600/10", iconBg: "bg-emerald-500", iconColor: "text-white" },
    { icon: <FaVideo />, labelKey: "admin.totalVideos", value: "186", bg: "from-rose-500/20 to-rose-600/10", iconBg: "bg-rose-500", iconColor: "text-white" },
    { icon: <FaDollarSign />, labelKey: "admin.totalRevenue", value: "$12,450", bg: "from-gold/20 to-gold/10", iconBg: "bg-gold", iconColor: "text-navy" },
  ];

  const topCourses = [
    { nameKey: "formations.f4.title", sales: 347, revenue: "$2,500", color: "bg-amber-500" },
    { nameKey: "formations.f2.title", sales: 283, revenue: "$1,450", color: "bg-blue-500" },
    { nameKey: "formations.f1.title", sales: 219, revenue: "$1,240", color: "bg-emerald-500" },
    { nameKey: "formations.f3.title", sales: 198, revenue: "$980", color: "bg-gold" },
  ];

  const transactions = [
    { name: "Marie Katanga", amount: "$150", time: "06:24 PM", avatar: "MK" },
    { name: "Patrick Mbala", amount: "$87", time: "11:47 AM", avatar: "PM" },
    { name: "Grace Mutombo", amount: "$132", time: "07:16 PM", avatar: "GM" },
    { name: "David Luntala", amount: "$95", time: "09:30 AM", avatar: "DL" },
  ];

  const engagementData = [
    { country: "RD Congo", pct: 63, color: "bg-gold" },
    { country: "Congo-Brazza", pct: 21, color: "bg-emerald-500" },
    { country: "France", pct: 11, color: "bg-amber-500" },
    { country: "Belgique", pct: 5, color: "bg-rose-500" },
  ];

  const recentEnrollments = [
    { name: "Marie Katanga", courseKey: "formations.f4.title", dateKey: "admin.ago2h", amount: "$150", statusKey: "admin.active" },
    { name: "Patrick Mbala", courseKey: "formations.f2.title", dateKey: "admin.ago5h", amount: "$87", statusKey: "admin.active" },
    { name: "Grace Mutombo", courseKey: "formations.f1.title", dateKey: "admin.yesterday", amount: "$132", statusKey: "admin.pending" },
    { name: "David Luntala", courseKey: "formations.f3.title", dateKey: "admin.ago2d", amount: "$95", statusKey: "admin.active" },
    { name: "Sarah Ngoy", courseKey: "formations.f4.title", dateKey: "admin.ago3d", amount: "$150", statusKey: "admin.active" },
  ];

  return (
    <div className="space-y-6 max-w-[1400px]">
      <div>
        <h1 className="text-xl font-bold text-white">{t("admin.dashboard")}</h1>
        <p className="text-white/30 text-sm">{t("admin.overview")}</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s, i) => (
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
              <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-white/10" /><span className="text-[10px] text-white/30">{t("admin.lastMonth")}</span></div>
              <button className="text-white/20 hover:text-white/40 transition-colors"><FaEllipsisV className="text-xs" /></button>
            </div>
          </div>
          <div className="relative h-36">
            <svg viewBox={`0 0 ${svgW} ${svgH}`} className="w-full h-full" preserveAspectRatio="none">
              <defs><linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#D4A853" stopOpacity="0.3" /><stop offset="100%" stopColor="#D4A853" stopOpacity="0" /></linearGradient></defs>
              <polygon points={`0,${svgH} ${points} ${svgW},${svgH}`} fill="url(#chartGrad)" />
              <polyline points={points} fill="none" stroke="#D4A853" strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" />
              <circle cx={(19 / 29) * svgW} cy={svgH - (chartData[19] / maxChart) * svgH} r="5" fill="#D4A853" stroke="#0a0e1a" strokeWidth="3" />
            </svg>
            <div className="absolute bg-[#0d1a2e] border border-gold/20 rounded-lg px-3 py-2 shadow-xl pointer-events-none" style={{ left: `${(19 / 29) * 100}%`, top: `${((1 - chartData[19] / maxChart) * 100) - 28}%`, transform: "translateX(-50%)" }}>
              <div className="text-[10px] text-white/40">{t("admin.thisMonth")}</div>
              <div className="text-sm font-bold text-white">1,247</div>
            </div>
            <div className="absolute bottom-0 left-0 right-0 flex justify-between text-[10px] text-white/15 px-1">
              {["01", "05", "10", "15", "20", "25", "30"].map((d) => (<span key={d}>{d}</span>))}
            </div>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }} className="lg:col-span-2 rounded-2xl bg-white/[0.02] border border-white/[0.06] p-6">
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-sm font-bold text-white">{t("admin.topFormations")}</h3>
            <Link href="/admin/formations" className="text-[10px] text-gold hover:text-gold-light transition-colors">{t("dash.seeAll")}</Link>
          </div>
          <div className="space-y-4">
            {topCourses.map((c) => (
              <div key={c.nameKey} className="flex items-center gap-3 group">
                <div className={`w-9 h-9 rounded-xl ${c.color} flex items-center justify-center text-white text-xs font-bold flex-shrink-0`}>{t(c.nameKey).charAt(0)}</div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-medium text-white truncate">{t(c.nameKey)}</div>
                  <div className="text-[10px] text-white/25">{c.sales} {t("admin.sales")}</div>
                </div>
                <div className="text-right"><div className="text-xs font-bold text-white">{c.revenue}</div></div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="rounded-2xl bg-white/[0.02] border border-white/[0.06] p-6">
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-sm font-bold text-white">{t("admin.transactions")}</h3>
            <Link href="/admin/transactions" className="text-[10px] text-gold hover:text-gold-light transition-colors">{t("dash.seeAll")}</Link>
          </div>
          <div className="space-y-3">
            {transactions.map((tr) => (
              <div key={tr.name} className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-gold/30 to-gold-light/20 flex items-center justify-center text-[10px] font-bold text-gold flex-shrink-0">{tr.avatar}</div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-medium text-white">{t("admin.received")} <span className="text-emerald-400 font-bold">{tr.amount}</span></div>
                  <div className="text-[10px] text-white/25">{t("admin.from")} {tr.name}</div>
                </div>
                <div className="text-[10px] text-white/20">{tr.time}</div>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }} className="rounded-2xl bg-white/[0.02] border border-white/[0.06] p-6">
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-sm font-bold text-white">{t("admin.engagement")}</h3>
            <FaEllipsisV className="text-white/15 text-xs cursor-pointer hover:text-white/30 transition-colors" />
          </div>
          <div className="flex items-center justify-center mb-5">
            <div className="relative w-28 h-28">
              <FaGlobeAfrica className="w-full h-full text-gold/20" />
              <div className="absolute inset-0 flex items-center justify-center"><div className="w-3 h-3 rounded-full bg-gold shadow-lg shadow-gold/40 animate-pulse" /></div>
              {[{ top: "20%", left: "25%", size: "w-2 h-2", color: "bg-emerald-400" }, { top: "40%", left: "70%", size: "w-1.5 h-1.5", color: "bg-amber-400" }, { top: "65%", left: "40%", size: "w-2 h-2", color: "bg-rose-400" }].map((dot, i) => (
                <div key={i} className={`absolute ${dot.size} ${dot.color} rounded-full shadow-lg animate-pulse`} style={{ top: dot.top, left: dot.left }} />
              ))}
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

      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.55 }} className="rounded-2xl bg-white/[0.02] border border-white/[0.06] overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.04]">
          <h3 className="text-sm font-bold text-white">{t("admin.recentEnroll")}</h3>
          <Link href="/admin/utilisateurs" className="text-[10px] text-gold hover:text-gold-light flex items-center gap-1 transition-colors">{t("dash.seeAll")} <FaArrowRight className="text-[8px]" /></Link>
        </div>
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/[0.04]">
              {["admin.student", "admin.formation", "admin.date", "admin.amount", "admin.status"].map((hk) => (
                <th key={hk} className="text-left text-white/25 text-[10px] font-medium uppercase tracking-wider px-6 py-3">{t(hk)}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {recentEnrollments.map((u) => (
              <tr key={u.name + u.courseKey} className="border-b border-white/[0.02] hover:bg-white/[0.015] transition-colors">
                <td className="px-6 py-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-gold/30 to-gold-light/20 flex items-center justify-center text-[10px] font-bold text-gold">{u.name.split(" ").map(n => n[0]).join("")}</div>
                    <span className="text-xs font-medium text-white">{u.name}</span>
                  </div>
                </td>
                <td className="px-6 py-3 text-xs text-white/40">{t(u.courseKey)}</td>
                <td className="px-6 py-3 text-xs text-white/25">{t(u.dateKey)}</td>
                <td className="px-6 py-3 text-xs font-semibold text-white">{u.amount}</td>
                <td className="px-6 py-3">
                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-medium ${u.statusKey === "admin.active" ? "bg-emerald-400/10 text-emerald-400" : "bg-amber-400/10 text-amber-400"}`}>{t(u.statusKey)}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </motion.div>
    </div>
  );
}
