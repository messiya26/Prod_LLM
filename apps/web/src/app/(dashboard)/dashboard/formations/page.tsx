"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { FaBookOpen, FaPlay, FaClock, FaChartLine, FaSearch, FaAward } from "react-icons/fa";
import { useAuth } from "@/context/auth-context";
import { useI18n } from "@/context/i18n-context";
import api from "@/lib/api";

interface Enrollment {
  id: string;
  progress: number;
  status: string;
  course: {
    id: string;
    title: string;
    slug: string;
    thumbnail: string | null;
    level: string;
    _count?: { modules: number };
  };
}

export default function MesFormations() {
  const { user } = useAuth();
  const { locale } = useI18n();
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "active" | "completed">("all");
  const [search, setSearch] = useState("");

  useEffect(() => {
    api.get<any[]>("/enrollments")
      .then((data) => setEnrollments(Array.isArray(data) ? data : []))
      .catch(() => setEnrollments([]))
      .finally(() => setLoading(false));
  }, []);

  const filtered = enrollments.filter((e) => {
    if (filter === "active" && e.progress >= 100) return false;
    if (filter === "completed" && e.progress < 100) return false;
    if (search && !e.course.title.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="space-y-6 max-w-[1200px]">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-cream">{locale === "fr" ? "Mes formations" : "My courses"}</h1>
          <p className="text-cream/40 text-sm mt-1">{enrollments.length} {locale === "fr" ? "formation(s) inscrite(s)" : "enrolled course(s)"}</p>
        </div>
        <div className="flex gap-3">
          <div className="relative">
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-cream/20 text-xs" />
            <input
              type="text"
              placeholder={locale === "fr" ? "Rechercher..." : "Search..."}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 pr-4 py-2 rounded-lg bg-cream/[0.03] border border-cream/[0.08] text-cream text-sm placeholder:text-cream/20 focus:outline-none focus:border-gold/30 w-48"
            />
          </div>
          <div className="flex rounded-lg border border-cream/[0.08] overflow-hidden">
            {(["all", "active", "completed"] as const).map((f) => (
              <button key={f} onClick={() => setFilter(f)} className={`px-3 py-2 text-xs font-medium transition-all ${filter === f ? "bg-gold/20 text-gold" : "text-cream/40 hover:text-cream/60"}`}>
                {f === "all" ? (locale === "fr" ? "Toutes" : "All") : f === "active" ? (locale === "fr" ? "En cours" : "Active") : (locale === "fr" ? "Terminees" : "Completed")}
              </button>
            ))}
          </div>
        </div>
      </div>

      {loading ? (
        <div className="grid gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-28 rounded-xl bg-cream/[0.02] animate-pulse" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-16">
          <FaBookOpen className="text-cream/10 text-5xl mx-auto mb-4" />
          <h3 className="text-cream/40 text-lg font-medium mb-2">{locale === "fr" ? "Aucune formation trouvee" : "No courses found"}</h3>
          <p className="text-cream/20 text-sm mb-6">{locale === "fr" ? "Explorez notre catalogue pour commencer votre parcours" : "Browse our catalog to start your journey"}</p>
          <Link href="/formations" className="inline-block px-6 py-3 rounded-xl bg-gradient-to-r from-gold to-gold-light text-navy font-bold text-sm">
            {locale === "fr" ? "Voir le catalogue" : "Browse catalog"}
          </Link>
        </motion.div>
      ) : (
        <div className="space-y-3">
          {filtered.map((enrollment, i) => {
            const moduleCount = enrollment.course._count?.modules ?? 0;
            return (
            <motion.div key={enrollment.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
              <Link href={`/dashboard/formations/${enrollment.course.slug}`}
                className="flex items-center gap-5 p-4 rounded-xl bg-cream/[0.02] border border-cream/[0.05] hover:border-gold/20 hover:bg-cream/[0.04] transition-all group"
              >
                <div className="relative w-24 h-16 rounded-lg overflow-hidden flex-shrink-0 bg-cream/[0.05]">
                  {enrollment.course.thumbnail ? (
                    <Image src={enrollment.course.thumbnail.startsWith("http") ? enrollment.course.thumbnail : `${process.env.NEXT_PUBLIC_API_URL?.replace("/api/v1", "") || "https://prod-llm.onrender.com"}${enrollment.course.thumbnail}`} alt={enrollment.course.title} fill className="object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center"><FaPlay className="text-gold/30" /></div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-cream font-semibold text-sm group-hover:text-gold transition-colors truncate">{enrollment.course.title}</h3>
                  <div className="flex items-center gap-3 mt-1 text-cream/30 text-xs">
                    <span>{moduleCount} {locale === "fr" ? "modules" : "modules"}</span>
                    <span className="capitalize">{enrollment.course.level?.toLowerCase().replace("_", " ")}</span>
                    <span className={`px-1.5 py-0.5 rounded text-[10px] font-medium ${enrollment.progress >= 100 ? "bg-emerald-400/10 text-emerald-400" : "bg-gold/10 text-gold"}`}>
                      {enrollment.progress >= 100 ? (locale === "fr" ? "Termine" : "Done") : (locale === "fr" ? "En cours" : "Active")}
                    </span>
                  </div>
                  <div className="mt-2 flex items-center gap-3">
                    <div className="flex-1 h-1.5 bg-cream/[0.05] rounded-full overflow-hidden">
                      <div className="h-full rounded-full bg-gradient-to-r from-gold to-gold-light transition-all" style={{ width: `${enrollment.progress}%` }} />
                    </div>
                    <span className="text-gold text-xs font-bold">{enrollment.progress}%</span>
                  </div>
                </div>
                <FaChartLine className="text-cream/20 group-hover:text-gold transition-colors flex-shrink-0" />
              </Link>
              {enrollment.progress >= 100 && (
                <button onClick={async () => {
                  try {
                    await api.post(`/certificates/generate/${enrollment.id}`);
                    window.location.href = "/dashboard/certificats";
                  } catch { window.location.href = "/dashboard/certificats"; }
                }}
                  className="mt-1 ml-[116px] inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gold/10 text-gold text-xs font-medium hover:bg-gold/20 transition-all">
                  <FaAward className="text-[10px]" /> {locale === "fr" ? "Obtenir le certificat" : "Get certificate"}
                </button>
              )}
            </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
