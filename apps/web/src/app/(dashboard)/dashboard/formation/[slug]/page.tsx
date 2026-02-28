"use client";

import { useState, useEffect } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  FaPlay, FaLock, FaCheck, FaChevronDown, FaChevronRight,
  FaArrowLeft, FaClock, FaBookOpen, FaCreditCard, FaMobileAlt,
  FaCheckCircle, FaTimes,
} from "react-icons/fa";
import { useAuth } from "@/context/auth-context";
import { useI18n } from "@/context/i18n-context";
import api from "@/lib/api";

interface Lesson {
  id: string;
  title: string;
  duration: string;
  completed: boolean;
  videoUrl?: string;
}

interface Module {
  id: string;
  title: string;
  order: number;
  lessons: Lesson[];
}

interface CourseDetail {
  id: string;
  title: string;
  description: string;
  slug: string;
  thumbnail: string | null;
  duration: string;
  level: string;
  price: number;
  currency: string;
  modules: Module[];
  enrollment?: {
    id: string;
    progress: number;
    paid: boolean;
    completedLessons: string[];
  };
}

export default function FormationDetail() {
  const { slug } = useParams<{ slug: string }>();
  const searchParams = useSearchParams();
  const showPay = searchParams.get("pay") === "1";
  const { user } = useAuth();
  const { locale } = useI18n();
  const [course, setCourse] = useState<CourseDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [expandedModules, setExpandedModules] = useState<Set<string>>(new Set());
  const [paymentModal, setPaymentModal] = useState(showPay);
  const [paymentMethod, setPaymentMethod] = useState<"card" | "mobile">("card");
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [activeLesson, setActiveLesson] = useState<Lesson | null>(null);

  useEffect(() => {
    api.get<CourseDetail>(`/courses/${slug}/detail`)
      .then((data) => {
        setCourse(data);
        if (data.modules?.length > 0) {
          setExpandedModules(new Set([data.modules[0].id]));
        }
      })
      .catch(() => {
        setCourse({
          id: "demo",
          title: "Formation Leadership Pastoral",
          description: "Une formation complete pour developper vos competences en leadership pastoral.",
          slug: slug || "demo",
          thumbnail: null,
          duration: "12h",
          level: "intermediaire",
          price: 49,
          currency: "USD",
          modules: [
            {
              id: "m1", title: "Introduction au Leadership", order: 1,
              lessons: [
                { id: "l1", title: "Bienvenue et objectifs", duration: "15min", completed: true },
                { id: "l2", title: "Les fondements du leadership", duration: "30min", completed: true },
                { id: "l3", title: "Votre vision personnelle", duration: "25min", completed: false },
              ],
            },
            {
              id: "m2", title: "Communication Efficace", order: 2,
              lessons: [
                { id: "l4", title: "L'art de la prise de parole", duration: "35min", completed: false },
                { id: "l5", title: "Ecoute active et empathie", duration: "20min", completed: false },
                { id: "l6", title: "Gerer les conflits", duration: "40min", completed: false },
              ],
            },
            {
              id: "m3", title: "Gestion d'Equipe", order: 3,
              lessons: [
                { id: "l7", title: "Constituer une equipe solide", duration: "30min", completed: false },
                { id: "l8", title: "Deleguer avec confiance", duration: "25min", completed: false },
                { id: "l9", title: "Evaluer et encourager", duration: "20min", completed: false },
              ],
            },
          ],
          enrollment: { id: "e1", progress: 22, paid: false, completedLessons: ["l1", "l2"] },
        });
      })
      .finally(() => setLoading(false));
  }, [slug]);

  const toggleModule = (id: string) => {
    setExpandedModules((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const isPaid = course?.enrollment?.paid ?? false;
  const totalLessons = course?.modules?.reduce((acc, m) => acc + m.lessons.length, 0) || 0;
  const completedLessons = course?.enrollment?.completedLessons?.length || 0;
  const progress = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

  const handlePayment = () => {
    setPaymentLoading(true);
    setTimeout(() => {
      setPaymentLoading(false);
      setPaymentModal(false);
      if (course?.enrollment) course.enrollment.paid = true;
      setCourse({ ...course! });
    }, 2000);
  };

  if (loading) {
    return (
      <div className="space-y-4 max-w-[900px]">
        <div className="h-8 w-48 bg-cream/[0.03] rounded-lg animate-pulse" />
        <div className="h-40 bg-cream/[0.02] rounded-xl animate-pulse" />
        <div className="space-y-3">
          {[1, 2, 3].map((i) => <div key={i} className="h-20 bg-cream/[0.02] rounded-xl animate-pulse" />)}
        </div>
      </div>
    );
  }

  if (!course) return null;

  return (
    <div className="space-y-6 max-w-[900px]">
      <Link href="/dashboard/formations" className="inline-flex items-center gap-2 text-cream/30 hover:text-cream/60 text-sm transition-colors">
        <FaArrowLeft className="text-xs" /> {locale === "fr" ? "Retour aux formations" : "Back to courses"}
      </Link>

      <div className="bg-cream/[0.02] border border-cream/[0.05] rounded-xl p-6">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-cream">{course.title}</h1>
            <p className="text-cream/40 text-sm mt-2 leading-relaxed">{course.description}</p>
            <div className="flex flex-wrap items-center gap-4 mt-4 text-cream/30 text-xs">
              <span className="flex items-center gap-1.5"><FaClock />{course.duration}</span>
              <span className="flex items-center gap-1.5"><FaBookOpen />{totalLessons} {locale === "fr" ? "lecons" : "lessons"}</span>
              <span className="capitalize px-2 py-0.5 rounded bg-cream/[0.05]">{course.level}</span>
              <span className="text-gold font-bold text-base">{course.price} {course.currency}</span>
            </div>
          </div>
          <div className="w-full md:w-48 flex flex-col items-center gap-3">
            <div className="relative w-32 h-32">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="42" fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="6" />
                <circle cx="50" cy="50" r="42" fill="none" stroke="url(#gold-grad)" strokeWidth="6" strokeLinecap="round" strokeDasharray={`${progress * 2.64} ${264 - progress * 2.64}`} />
                <defs><linearGradient id="gold-grad" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#C4A767" /><stop offset="100%" stopColor="#E8D5A3" /></linearGradient></defs>
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-2xl font-bold text-gold">{progress}%</span>
                <span className="text-cream/30 text-[10px]">{completedLessons}/{totalLessons}</span>
              </div>
            </div>
            {!isPaid && (
              <button onClick={() => setPaymentModal(true)} className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-gold to-gold-light text-navy font-bold text-sm hover:shadow-lg hover:shadow-gold/20 transition-all">
                {locale === "fr" ? "Debloquer la formation" : "Unlock course"}
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="space-y-2">
        {course.modules.map((mod, mi) => {
          const modCompleted = mod.lessons.filter((l) => course.enrollment?.completedLessons?.includes(l.id)).length;
          const modTotal = mod.lessons.length;
          const expanded = expandedModules.has(mod.id);
          return (
            <div key={mod.id} className="border border-cream/[0.05] rounded-xl overflow-hidden">
              <button onClick={() => toggleModule(mod.id)} className="w-full flex items-center justify-between p-4 hover:bg-cream/[0.02] transition-all">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold ${modCompleted === modTotal ? "bg-emerald-500/20 text-emerald-400" : "bg-cream/[0.05] text-cream/40"}`}>
                    {modCompleted === modTotal ? <FaCheck /> : mi + 1}
                  </div>
                  <div className="text-left">
                    <h3 className="text-cream font-semibold text-sm">{mod.title}</h3>
                    <p className="text-cream/30 text-xs">{modCompleted}/{modTotal} {locale === "fr" ? "terminees" : "completed"}</p>
                  </div>
                </div>
                <motion.div animate={{ rotate: expanded ? 180 : 0 }}>
                  <FaChevronDown className="text-cream/20 text-xs" />
                </motion.div>
              </button>
              <AnimatePresence>
                {expanded && (
                  <motion.div initial={{ height: 0 }} animate={{ height: "auto" }} exit={{ height: 0 }} className="overflow-hidden">
                    <div className="px-4 pb-3 space-y-1">
                      {mod.lessons.map((lesson) => {
                        const done = course.enrollment?.completedLessons?.includes(lesson.id);
                        const locked = !isPaid && !done;
                        return (
                          <button
                            key={lesson.id}
                            onClick={() => !locked && setActiveLesson(lesson)}
                            disabled={locked}
                            className={`w-full flex items-center gap-3 p-3 rounded-lg text-left transition-all ${
                              activeLesson?.id === lesson.id ? "bg-gold/10 border border-gold/20" :
                              locked ? "opacity-40 cursor-not-allowed" : "hover:bg-cream/[0.03]"
                            }`}
                          >
                            <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 ${
                              done ? "bg-emerald-500/20 text-emerald-400" : locked ? "bg-cream/[0.03] text-cream/15" : "bg-gold/10 text-gold"
                            }`}>
                              {done ? <FaCheck className="text-[9px]" /> : locked ? <FaLock className="text-[9px]" /> : <FaPlay className="text-[9px]" />}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className={`text-sm truncate ${done ? "text-cream/50" : "text-cream"}`}>{lesson.title}</p>
                            </div>
                            <span className="text-cream/20 text-xs flex-shrink-0">{lesson.duration}</span>
                          </button>
                        );
                      })}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>

      <AnimatePresence>
        {paymentModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="bg-[#0d1a2e] border border-gold/10 rounded-2xl w-full max-w-md overflow-hidden">
              <div className="p-6 border-b border-cream/[0.05] flex items-center justify-between">
                <h2 className="text-cream font-bold text-lg">{locale === "fr" ? "Paiement" : "Payment"}</h2>
                <button onClick={() => setPaymentModal(false)} className="text-cream/30 hover:text-cream"><FaTimes /></button>
              </div>
              <div className="p-6 space-y-5">
                <div className="bg-cream/[0.02] rounded-xl p-4">
                  <p className="text-cream text-sm font-medium">{course.title}</p>
                  <p className="text-gold text-2xl font-bold mt-1">{course.price} {course.currency}</p>
                </div>
                <div className="flex gap-3">
                  {([
                    { key: "card" as const, icon: <FaCreditCard />, label: locale === "fr" ? "Carte bancaire" : "Credit card" },
                    { key: "mobile" as const, icon: <FaMobileAlt />, label: "Mobile Money" },
                  ]).map((m) => (
                    <button key={m.key} onClick={() => setPaymentMethod(m.key)}
                      className={`flex-1 flex items-center gap-2 justify-center p-3 rounded-xl border text-sm font-medium transition-all ${
                        paymentMethod === m.key ? "border-gold/30 bg-gold/10 text-gold" : "border-cream/[0.08] text-cream/40 hover:text-cream/60"
                      }`}>
                      {m.icon} {m.label}
                    </button>
                  ))}
                </div>
                {paymentMethod === "card" ? (
                  <div className="space-y-3">
                    <input placeholder={locale === "fr" ? "Numero de carte" : "Card number"} className="w-full px-4 py-3 rounded-lg bg-cream/[0.03] border border-cream/[0.08] text-cream text-sm placeholder:text-cream/20 focus:outline-none focus:border-gold/30" />
                    <div className="flex gap-3">
                      <input placeholder="MM/YY" className="flex-1 px-4 py-3 rounded-lg bg-cream/[0.03] border border-cream/[0.08] text-cream text-sm placeholder:text-cream/20 focus:outline-none focus:border-gold/30" />
                      <input placeholder="CVC" className="w-24 px-4 py-3 rounded-lg bg-cream/[0.03] border border-cream/[0.08] text-cream text-sm placeholder:text-cream/20 focus:outline-none focus:border-gold/30" />
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <select className="w-full px-4 py-3 rounded-lg bg-cream/[0.03] border border-cream/[0.08] text-cream text-sm focus:outline-none focus:border-gold/30">
                      <option>MTN Mobile Money</option>
                      <option>Orange Money</option>
                      <option>Airtel Money</option>
                      <option>M-Pesa</option>
                    </select>
                    <input placeholder={locale === "fr" ? "Numero de telephone" : "Phone number"} className="w-full px-4 py-3 rounded-lg bg-cream/[0.03] border border-cream/[0.08] text-cream text-sm placeholder:text-cream/20 focus:outline-none focus:border-gold/30" />
                  </div>
                )}
                <button onClick={handlePayment} disabled={paymentLoading}
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-gold to-gold-light text-navy font-bold text-sm hover:shadow-lg hover:shadow-gold/20 transition-all disabled:opacity-60 flex items-center justify-center gap-2">
                  {paymentLoading ? (
                    <><div className="w-4 h-4 border-2 border-navy/30 border-t-navy rounded-full animate-spin" /> {locale === "fr" ? "Traitement..." : "Processing..."}</>
                  ) : (
                    <><FaCheckCircle /> {locale === "fr" ? `Payer ${course.price} ${course.currency}` : `Pay ${course.price} ${course.currency}`}</>
                  )}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
