"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  FaDollarSign, FaUsers, FaBookOpen, FaChartLine,
  FaSpinner, FaArrowUp, FaArrowDown,
} from "react-icons/fa";
import { useAuth } from "@/context/auth-context";
import api from "@/lib/api";

interface InstructorStats {
  totalRevenue: number;
  totalStudents: number;
  payments: any[];
  courses: { id: string; title: string; revenue: number; students: number }[];
}

export default function RevenusPage() {
  const { user } = useAuth();
  const [stats, setStats] = useState<InstructorStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get<InstructorStats>("/payments/instructor/stats")
      .then(d => setStats(d))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="flex items-center justify-center h-64"><FaSpinner className="text-gold text-2xl animate-spin" /></div>;

  const fmt = (n: number) => `${n.toLocaleString("fr-FR")} FCFA`;

  return (
    <div className="space-y-6 max-w-[1200px]">
      <div>
        <h1 className="text-xl font-bold text-white">Mes Revenus</h1>
        <p className="text-white/30 text-sm">Suivi de vos gains en tant que formateur</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { icon: <FaDollarSign />, label: "Revenu total", value: fmt(stats?.totalRevenue || 0), color: "from-gold/20 to-gold/5", iconBg: "bg-gold" },
          { icon: <FaUsers />, label: "Etudiants inscrits", value: String(stats?.totalStudents || 0), color: "from-blue-500/20 to-blue-500/5", iconBg: "bg-blue-500" },
          { icon: <FaBookOpen />, label: "Formations actives", value: String(stats?.courses?.length || 0), color: "from-emerald-500/20 to-emerald-500/5", iconBg: "bg-emerald-500" },
        ].map((s, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
            className={`p-5 rounded-2xl bg-gradient-to-br ${s.color} border border-white/[0.06]`}
          >
            <div className={`w-10 h-10 rounded-xl ${s.iconBg} flex items-center justify-center text-white mb-3`}>{s.icon}</div>
            <p className="text-white/40 text-xs mb-1">{s.label}</p>
            <p className="text-white text-xl font-bold">{s.value}</p>
          </motion.div>
        ))}
      </div>

      <div className="bg-[#0d1a2e] rounded-2xl border border-white/[0.06] p-5">
        <h2 className="text-white font-semibold mb-4">Revenus par formation</h2>
        <div className="space-y-3">
          {stats?.courses?.map((c, i) => (
            <div key={c.id} className="flex items-center justify-between p-3 rounded-xl bg-white/[0.03] hover:bg-white/[0.06] transition-all">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-gold/10 flex items-center justify-center text-gold text-xs font-bold">{i + 1}</div>
                <div>
                  <p className="text-white text-sm font-medium">{c.title}</p>
                  <p className="text-white/30 text-xs">{c.students} etudiant(s)</p>
                </div>
              </div>
              <p className="text-gold font-bold text-sm">{fmt(c.revenue)}</p>
            </div>
          ))}
          {(!stats?.courses || stats.courses.length === 0) && (
            <p className="text-white/30 text-sm text-center py-8">Aucune formation avec des revenus pour le moment</p>
          )}
        </div>
      </div>

      <div className="bg-[#0d1a2e] rounded-2xl border border-white/[0.06] p-5">
        <h2 className="text-white font-semibold mb-4">Derniers paiements recus</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-white/30 text-xs border-b border-white/[0.06]">
                <th className="pb-3 font-medium">Etudiant</th>
                <th className="pb-3 font-medium">Formation</th>
                <th className="pb-3 font-medium">Montant</th>
                <th className="pb-3 font-medium">Date</th>
              </tr>
            </thead>
            <tbody>
              {stats?.payments?.map((p: any) => (
                <tr key={p.id} className="border-b border-white/[0.03] hover:bg-white/[0.02]">
                  <td className="py-3 text-white text-sm">{p.user?.firstName} {p.user?.lastName}</td>
                  <td className="py-3 text-white/60 text-sm">{p.course?.title}</td>
                  <td className="py-3 text-gold font-medium text-sm">{fmt(p.amount)}</td>
                  <td className="py-3 text-white/40 text-xs">{new Date(p.createdAt).toLocaleDateString("fr-FR")}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {(!stats?.payments || stats.payments.length === 0) && (
            <p className="text-white/30 text-sm text-center py-8">Aucun paiement recu</p>
          )}
        </div>
      </div>
    </div>
  );
}
