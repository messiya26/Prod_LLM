"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { FaArrowLeft, FaBookOpen, FaPlay, FaLock, FaCheck, FaFilePdf, FaHeadphones, FaFileAlt, FaLink, FaVideo, FaSpinner, FaDownload, FaChevronDown } from "react-icons/fa";
import { useAuth } from "@/context/auth-context";
import { useI18n } from "@/context/i18n-context";
import api from "@/lib/api";

interface Lesson { id: string; title: string; content?: string; duration?: number; order: number; }
interface Module { id: string; title: string; order: number; lessons: Lesson[]; }
interface Resource { id: string; title: string; description?: string; type: string; url: string; fileSize?: number; duration?: number; }

const typeIcons: Record<string, React.ReactNode> = {
  PDF: <FaFilePdf className="text-red-400" />,
  AUDIO: <FaHeadphones className="text-purple-400" />,
  VIDEO: <FaVideo className="text-blue-400" />,
  DOCUMENT: <FaFileAlt className="text-amber-400" />,
  LINK: <FaLink className="text-emerald-400" />,
};

export default function CourseStudentView() {
  const { slug } = useParams<{ slug: string }>();
  const { user } = useAuth();
  const { locale } = useI18n();
  const [course, setCourse] = useState<any>(null);
  const [modules, setModules] = useState<Module[]>([]);
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [isPaid, setIsPaid] = useState(false);
  const [expandedModule, setExpandedModule] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"modules" | "resources">("modules");
  const [activeLesson, setActiveLesson] = useState<Lesson | null>(null);

  useEffect(() => {
    api.get<any>(`/courses/${slug}`).then((c) => {
      setCourse(c);
      return Promise.all([
        api.get<Module[]>(`/modules/course/${c.id}`).catch(() => []),
        api.get<Resource[]>(`/resources/course/${c.id}`).catch(() => []),
        api.get<{ enrolled: boolean; status?: string }>(`/enrollments/check/${slug}`).catch(() => ({ enrolled: false })),
      ]).then(([m, r, e]) => {
        setModules(Array.isArray(m) ? m : []);
        setResources(Array.isArray(r) ? r : []);
        setIsPaid((e as any).status === "ACTIVE" || (e as any).enrolled);
        if (Array.isArray(m) && m.length > 0) setExpandedModule(m[0].id);
      });
    }).finally(() => setLoading(false));
  }, [slug]);

  const imgBase = process.env.NEXT_PUBLIC_API_URL?.replace("/api/v1", "") || "https://prod-llm.onrender.com";

  if (loading) return <div className="flex items-center justify-center h-64"><FaSpinner className="text-gold text-2xl animate-spin" /></div>;
  if (!course) return <div className="text-center py-20 text-cream/30">Formation introuvable</div>;

  const totalLessons = modules.reduce((s, m) => s + m.lessons.length, 0);

  return (
    <div className="space-y-6">
      <Link href="/dashboard/formations" className="inline-flex items-center gap-2 text-cream/40 hover:text-gold text-sm transition-colors">
        <FaArrowLeft className="text-xs" /> {locale === "fr" ? "Mes formations" : "My courses"}
      </Link>

      <div className="bg-gradient-to-br from-gold/5 to-transparent border border-cream/[0.06] rounded-2xl p-6">
        <h1 className="text-xl font-bold text-cream mb-1">{course.title}</h1>
        <p className="text-cream/40 text-sm mb-4">{course.description}</p>
        <div className="flex gap-4 text-xs text-cream/30">
          <span>{modules.length} {locale === "fr" ? "modules" : "modules"}</span>
          <span>{totalLessons} {locale === "fr" ? "lecons" : "lessons"}</span>
          {course.duration && <span>{course.duration}</span>}
        </div>
      </div>

      <div className="flex gap-2">
        {(["modules", "resources"] as const).map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${activeTab === tab ? "bg-gold/15 text-gold border border-gold/20" : "text-cream/30 hover:text-cream/50"}`}>
            {tab === "modules" ? (locale === "fr" ? "Modules & Lecons" : "Modules & Lessons") : (locale === "fr" ? "Ressources & Litterature" : "Resources & Literature")}
          </button>
        ))}
      </div>

      {activeTab === "modules" ? (
        <div className="space-y-3">
          {modules.length === 0 ? (
            <div className="text-center py-12 text-cream/20 text-sm">
              <FaBookOpen className="text-2xl mx-auto mb-2 opacity-30" />
              {locale === "fr" ? "Aucun module disponible" : "No modules available"}
            </div>
          ) : modules.map((mod, mi) => (
            <motion.div key={mod.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: mi * 0.05 }}
              className="bg-cream/[0.02] border border-cream/[0.05] rounded-xl overflow-hidden">
              <button onClick={() => setExpandedModule(expandedModule === mod.id ? null : mod.id)}
                className="w-full flex items-center gap-3 px-4 py-3 hover:bg-cream/[0.02] transition-colors">
                <span className="w-8 h-8 rounded-lg bg-gold/10 text-gold text-xs font-bold flex items-center justify-center">{mi + 1}</span>
                <span className="flex-1 text-left text-cream text-sm font-medium">{mod.title}</span>
                <span className="text-cream/20 text-xs">{mod.lessons.length} lecon(s)</span>
                <FaChevronDown className={`text-cream/20 text-xs transition-transform ${expandedModule === mod.id ? "rotate-180" : ""}`} />
              </button>
              <AnimatePresence>
                {expandedModule === mod.id && (
                  <motion.div initial={{ height: 0 }} animate={{ height: "auto" }} exit={{ height: 0 }} className="overflow-hidden">
                    <div className="px-4 pb-3 space-y-1 border-t border-cream/[0.04]">
                      {mod.lessons.map((les, li) => (
                        <button key={les.id}
                          onClick={() => isPaid ? setActiveLesson(activeLesson?.id === les.id ? null : les) : undefined}
                          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-all ${
                            activeLesson?.id === les.id ? "bg-gold/10 border border-gold/20" : "hover:bg-cream/[0.03]"
                          } ${!isPaid && li > 0 ? "opacity-40 cursor-not-allowed" : "cursor-pointer"}`}>
                          {isPaid || li === 0 ? (
                            <FaPlay className="text-gold text-[10px]" />
                          ) : (
                            <FaLock className="text-cream/20 text-[10px]" />
                          )}
                          <span className="flex-1 text-cream/60 text-xs">{les.title}</span>
                          {les.duration && <span className="text-cream/15 text-[10px]">{les.duration} min</span>}
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}

          <AnimatePresence>
            {activeLesson && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                className="bg-cream/[0.02] border border-gold/10 rounded-xl p-6">
                <h3 className="text-cream font-semibold mb-3">{activeLesson.title}</h3>
                <div className="text-cream/50 text-sm leading-relaxed whitespace-pre-wrap">
                  {activeLesson.content || (locale === "fr" ? "Contenu de la lecon a venir..." : "Lesson content coming soon...")}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ) : (
        <div className="space-y-3">
          {resources.length === 0 ? (
            <div className="text-center py-12 text-cream/20 text-sm">
              <FaFileAlt className="text-2xl mx-auto mb-2 opacity-30" />
              {locale === "fr" ? "Aucune ressource disponible" : "No resources available"}
            </div>
          ) : resources.map((res) => (
            <motion.div key={res.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="flex items-center gap-4 p-4 bg-cream/[0.02] border border-cream/[0.05] rounded-xl hover:border-gold/10 transition-all group">
              <div className="w-10 h-10 rounded-lg bg-cream/[0.04] flex items-center justify-center text-lg">
                {typeIcons[res.type] || <FaFileAlt className="text-cream/30" />}
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-cream text-sm font-medium truncate">{res.title}</h4>
                {res.description && <p className="text-cream/30 text-xs truncate">{res.description}</p>}
                <div className="flex gap-3 mt-1 text-cream/15 text-[10px]">
                  <span>{res.type}</span>
                  {res.fileSize && <span>{(res.fileSize / 1024 / 1024).toFixed(1)} MB</span>}
                  {res.duration && <span>{res.duration} min</span>}
                </div>
              </div>
              {isPaid ? (
                <a href={res.url.startsWith("http") ? res.url : `${imgBase}${res.url}`} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-gold/10 text-gold text-xs font-medium hover:bg-gold/20 transition-all opacity-0 group-hover:opacity-100">
                  <FaDownload className="text-[10px]" /> {locale === "fr" ? "Telecharger" : "Download"}
                </a>
              ) : (
                <div className="flex items-center gap-1 text-cream/20 text-xs"><FaLock className="text-[10px]" /> {locale === "fr" ? "Acces payant" : "Paid access"}</div>
              )}
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
