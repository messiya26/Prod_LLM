"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FaUsers, FaSpinner, FaBookOpen, FaSearch } from "react-icons/fa";
import { useAuth } from "@/context/auth-context";
import api from "@/lib/api";

interface StudentEnroll {
  id: string;
  progress: number;
  status: string;
  createdAt: string;
  user: { id: string; firstName: string; lastName: string; email: string; avatar: string | null };
  course: { id: string; title: string };
}

export default function InstructorStudentsPage() {
  const { user } = useAuth();
  const [students, setStudents] = useState<StudentEnroll[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    api.get<StudentEnroll[]>("/payments/instructor/students")
      .then(d => setStudents(Array.isArray(d) ? d : []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const filtered = students.filter(s =>
    `${s.user.firstName} ${s.user.lastName} ${s.user.email} ${s.course.title}`.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <div className="flex items-center justify-center h-64"><FaSpinner className="text-gold text-2xl animate-spin" /></div>;

  return (
    <div className="space-y-6 max-w-[1200px]">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-white">Mes Etudiants</h1>
          <p className="text-white/30 text-sm">{students.length} inscription(s) a vos formations</p>
        </div>
        <div className="flex items-center gap-2 bg-white/[0.04] rounded-xl px-4 py-2.5 border border-white/[0.06]">
          <FaSearch className="text-white/20 text-sm" />
          <input type="text" placeholder="Rechercher..." value={search} onChange={e => setSearch(e.target.value)}
            className="bg-transparent text-sm text-white placeholder:text-white/20 focus:outline-none w-48" />
        </div>
      </div>

      <div className="bg-[#0d1a2e] rounded-2xl border border-white/[0.06] overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="text-white/30 text-xs border-b border-white/[0.06] bg-white/[0.02]">
              <th className="px-5 py-3 font-medium">Etudiant</th>
              <th className="px-5 py-3 font-medium">Formation</th>
              <th className="px-5 py-3 font-medium">Progression</th>
              <th className="px-5 py-3 font-medium">Statut</th>
              <th className="px-5 py-3 font-medium">Inscrit le</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((s, i) => (
              <motion.tr key={s.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }}
                className="border-b border-white/[0.03] hover:bg-white/[0.02]">
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-gold to-gold-light flex items-center justify-center text-navy text-xs font-bold">
                      {s.user.firstName[0]}{s.user.lastName?.[0] || ""}
                    </div>
                    <div>
                      <p className="text-white text-sm font-medium">{s.user.firstName} {s.user.lastName}</p>
                      <p className="text-white/30 text-xs">{s.user.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-5 py-4 text-white/60 text-sm">{s.course.title}</td>
                <td className="px-5 py-4">
                  <div className="flex items-center gap-2">
                    <div className="w-20 h-1.5 rounded-full bg-white/10 overflow-hidden">
                      <div className="h-full rounded-full bg-gold" style={{ width: `${s.progress}%` }} />
                    </div>
                    <span className="text-white/50 text-xs">{s.progress}%</span>
                  </div>
                </td>
                <td className="px-5 py-4">
                  <span className={`px-2 py-1 rounded-full text-[10px] font-medium ${
                    s.status === "ACTIVE" ? "bg-emerald-500/10 text-emerald-400" :
                    s.status === "COMPLETED" ? "bg-gold/10 text-gold" :
                    "bg-white/5 text-white/40"
                  }`}>
                    {s.status === "ACTIVE" ? "Actif" : s.status === "COMPLETED" ? "Termine" : s.status}
                  </span>
                </td>
                <td className="px-5 py-4 text-white/40 text-xs">{new Date(s.createdAt).toLocaleDateString("fr-FR")}</td>
              </motion.tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div className="text-center py-12">
            <FaUsers className="text-white/10 text-3xl mx-auto mb-3" />
            <p className="text-white/30 text-sm">Aucun etudiant inscrit a vos formations</p>
          </div>
        )}
      </div>
    </div>
  );
}
