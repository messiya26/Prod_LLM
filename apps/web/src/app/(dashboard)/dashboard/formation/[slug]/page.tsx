"use client";

import { useState, useEffect, Suspense } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  FaPlay, FaLock, FaCheck, FaChevronDown,
  FaArrowLeft, FaClock, FaBookOpen, FaCreditCard, FaMobileAlt,
  FaCheckCircle, FaTimes, FaFilePdf, FaHeadphones, FaDownload,
  FaQuestion, FaClipboardList, FaTrophy, FaRedo, FaExclamationCircle,
} from "react-icons/fa";
import { useAuth } from "@/context/auth-context";
import { useI18n } from "@/context/i18n-context";
import api from "@/lib/api";
import PaymentModal from "@/components/payment/payment-modal";

interface Lesson { id: string; title: string; duration?: number; completed?: boolean; }
interface Module { id: string; title: string; order: number; lessons: Lesson[]; }
interface CourseResource { id: string; title: string; description?: string; type: string; url: string; fileSize?: number; duration?: number; }
interface QuizQuestion { id: string; question: string; options: string[]; explanation?: string; order: number; }
interface Quiz { id: string; title: string; description?: string; passingScore: number; questions: QuizQuestion[]; }
interface CourseDetail {
  id: string; title: string; description: string; slug: string; thumbnail: string | null;
  level: string; price: number; currency?: string;
  modules: Module[];
  enrollment?: { id: string; progress: number; paid: boolean; completedLessons: string[]; };
}

type Tab = "contenu" | "ressources" | "quiz";

function FormationDetailContent() {
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
  const [activeTab, setActiveTab] = useState<Tab>("contenu");

  // Resources & Quiz state
  const [resources, setResources] = useState<CourseResource[]>([]);
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [quizAnswers, setQuizAnswers] = useState<Record<string, string>>({});
  const [quizResult, setQuizResult] = useState<{ score: number; passed: boolean; correct: number; total: number } | null>(null);
  const [quizLoading, setQuizLoading] = useState(false);
  const [completedLessons, setCompletedLessons] = useState<Set<string>>(new Set());

  useEffect(() => {
    const loadCourse = async () => {
      try {
        const data = await api.get<CourseDetail>(`/courses/${slug}`);
        try {
          const enr = await api.get<{ enrolled: boolean; id?: string; status?: string; progress?: number }>(`/enrollments/check/${slug}`);
          if (enr?.enrolled && enr.id) {
            data.enrollment = {
              id: enr.id,
              progress: enr.progress || 0,
              paid: enr.status === "ACTIVE",
              completedLessons: [],
            };
          }
        } catch {}
        setCourse(data);
        if (data.modules?.length > 0) setExpandedModules(new Set([data.modules[0].id]));
        if (data.enrollment?.completedLessons) setCompletedLessons(new Set(data.enrollment.completedLessons));
        loadResources(data.id);
        loadQuiz(data.id);
      } catch {
        const demoId = `demo-${slug}`;
        setCourse({
          id: demoId, title: "Formation Demo", description: "Contenu de demonstration",
          slug: slug as string, thumbnail: null, level: "ALL_LEVELS", price: 149,
          modules: [
            { id: "m1", title: "Module 1 — Introduction", order: 1, lessons: [
              { id: "l1", title: "Lecon 1 — Bienvenue", duration: 10 },
              { id: "l2", title: "Lecon 2 — Les fondements", duration: 15 },
            ]},
            { id: "m2", title: "Module 2 — Approfondissement", order: 2, lessons: [
              { id: "l3", title: "Lecon 3 — Les principes", duration: 20 },
            ]},
          ],
          enrollment: undefined,
        });
        setExpandedModules(new Set(["m1"]));
        loadResources(demoId);
        loadQuiz(demoId);
      }
    };
    loadCourse().finally(() => setLoading(false));
  }, [slug]);

  const loadResources = (courseId: string) => {
    const demoResources: CourseResource[] = [
      { id: "r1", title: "Support de cours PDF", description: "Les piliers du leadership pastoral — 45 pages", type: "PDF", url: "#", fileSize: 2450000 },
      { id: "r2", title: "Version audio du cours", description: "Ecoutez le cours en deplacement", type: "AUDIO", url: "#", duration: 3600 },
      { id: "r3", title: "Fiche recapitulative", description: "Resume des points cles du module", type: "DOCUMENT", url: "#", fileSize: 850000 },
    ];
    api.get<CourseResource[]>(`/resources/course/${courseId}`)
      .then((data) => setResources(data.length > 0 ? data : demoResources))
      .catch(() => setResources(demoResources));
  };

  const loadQuiz = (courseId: string) => {
    const demoQuiz: Quiz = {
      id: "q-demo", title: "Quiz d'evaluation", passingScore: 70,
      questions: [
        { id: "qq1", question: "Quel est le fondement essentiel du leadership pastoral ?", options: ["La priere et l'etude de la Parole", "Le charisme naturel", "La formation academique", "L'experience ministerielle"], order: 0 },
        { id: "qq2", question: "Quelle est la cle d'une vision ministerielle impactante ?", options: ["La clarte et l'ancrage dans la foi", "Les ressources financieres", "Le nombre de membres", "La renommee internationale"], order: 1 },
        { id: "qq3", question: "Comment un leader pastoral gere-t-il les conflits dans l'eglise ?", options: ["Avec sagesse, amour et dans la priere", "Par l'autorite et la discipline stricte", "En evitant les confrontations", "En consultant d'abord les anciens uniquement"], order: 2 },
      ],
    };
    api.get<Quiz>(`/resources/quiz/course/${courseId}`)
      .then((data) => setQuiz(data || demoQuiz))
      .catch(() => setQuiz(demoQuiz));
  };

  const toggleModule = (id: string) => {
    setExpandedModules((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const markLessonDone = async (lesson: Lesson) => {
    if (!course?.enrollment) return;
    try {
      await api.post(`/resources/lessons/${lesson.id}/complete`, { enrollmentId: course.enrollment.id });
      setCompletedLessons((prev) => new Set([...prev, lesson.id]));
    } catch {}
  };

  const submitQuiz = async () => {
    if (!quiz || Object.keys(quizAnswers).length < quiz.questions.length) return;
    setQuizLoading(true);
    try {
      const answers = Object.entries(quizAnswers).map(([questionId, answer]) => ({ questionId, answer }));
      const result = await api.post<{ score: number; passed: boolean; correct: number; total: number }>(
        `/resources/quiz/${quiz.id}/submit`, { answers }
      );
      setQuizResult(result);
    } catch {
      let correct = 0;
      quiz.questions.forEach((q) => { if (quizAnswers[q.id] === q.options[0]) correct++; });
      const score = Math.round((correct / quiz.questions.length) * 100);
      setQuizResult({ score, passed: score >= quiz.passingScore, correct, total: quiz.questions.length });
    } finally {
      setQuizLoading(false);
    }
  };

  const formatSize = (bytes?: number) => {
    if (!bytes) return "";
    if (bytes >= 1000000) return `${(bytes / 1000000).toFixed(1)} MB`;
    return `${Math.round(bytes / 1000)} KB`;
  };

  const formatDuration = (sec?: number) => {
    if (!sec) return "";
    const m = Math.floor(sec / 60);
    const h = Math.floor(m / 60);
    return h > 0 ? `${h}h ${m % 60}min` : `${m}min`;
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-10 h-10 border-4 border-gold/20 border-t-gold rounded-full animate-spin" />
    </div>
  );

  if (!course) return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-cream/40">Formation introuvable</p>
    </div>
  );

  const allLessons = course.modules.flatMap((m) => m.lessons);
  const progress = course.enrollment
    ? Math.round((completedLessons.size / Math.max(allLessons.length, 1)) * 100)
    : 0;
  const isEnrolled = !!course.enrollment;
  const isPaid = course.enrollment?.paid ?? false;

  const tabs: { id: Tab; label: string; icon: React.ReactNode; count?: number }[] = [
    { id: "contenu", label: locale === "fr" ? "Contenu" : "Content", icon: <FaBookOpen /> },
    { id: "ressources", label: locale === "fr" ? "Ressources" : "Resources", icon: <FaFilePdf />, count: resources.length },
    { id: "quiz", label: "Quiz", icon: <FaClipboardList />, count: quiz?.questions.length },
  ];

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="sticky top-0 z-30 bg-[#0b1829]/95 backdrop-blur-xl border-b border-cream/[0.06] px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-4 min-w-0">
            <Link href="/dashboard/formations" className="text-cream/40 hover:text-gold transition-colors flex-shrink-0">
              <FaArrowLeft />
            </Link>
            <div className="min-w-0">
              <h1 className="text-cream font-bold text-sm md:text-base truncate">{course.title}</h1>
              <div className="text-cream/30 text-xs">{progress}% {locale === "fr" ? "complete" : "complete"}</div>
            </div>
          </div>
          {isEnrolled && (
            <div className="flex items-center gap-3">
              <div className="w-24 h-1.5 bg-cream/[0.06] rounded-full overflow-hidden">
                <div style={{ width: `${progress}%` }} className="h-full bg-gradient-to-r from-gold to-gold-light rounded-full transition-all" />
              </div>
              <span className="text-gold text-xs font-bold">{progress}%</span>
            </div>
          )}
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main content */}
          <div className="lg:col-span-2">
            {/* Video player */}
            <div className="rounded-2xl overflow-hidden bg-[#070f1c] mb-6 aspect-video flex items-center justify-center relative border border-cream/[0.06]">
              {activeLesson ? (
                <div className="text-center">
                  <FaPlay className="text-gold text-3xl mx-auto mb-3" />
                  <p className="text-cream text-sm font-medium">{activeLesson.title}</p>
                  <p className="text-cream/30 text-xs mt-1">{locale === "fr" ? "Lecture en cours..." : "Now playing..."}</p>
                </div>
              ) : (
                <div className="text-center p-8">
                  <FaPlay className="text-cream/10 text-5xl mx-auto mb-4" />
                  <p className="text-cream/30 text-sm">{locale === "fr" ? "Selectionnez une lecon pour commencer" : "Select a lesson to start"}</p>
                </div>
              )}
              {activeLesson && (
                <button
                  onClick={() => markLessonDone(activeLesson)}
                  className="absolute bottom-4 right-4 flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-400 text-xs hover:bg-emerald-500/30 transition-all"
                >
                  <FaCheck className="text-[10px]" /> {locale === "fr" ? "Marquer comme termine" : "Mark as done"}
                </button>
              )}
            </div>

            {/* Tabs */}
            <div className="flex gap-1 p-1 rounded-xl bg-cream/[0.03] border border-cream/[0.06] mb-6">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-xs font-medium transition-all ${
                    activeTab === tab.id ? "bg-gold text-navy shadow-lg" : "text-cream/40 hover:text-cream"
                  }`}
                >
                  {tab.icon}
                  {tab.label}
                  {tab.count !== undefined && tab.count > 0 && (
                    <span className={`px-1.5 py-0.5 rounded-full text-[9px] font-bold ${activeTab === tab.id ? "bg-navy/20" : "bg-cream/10"}`}>
                      {tab.count}
                    </span>
                  )}
                </button>
              ))}
            </div>

            {/* Tab content */}
            <AnimatePresence mode="wait">
              {activeTab === "contenu" && (
                <motion.div key="contenu" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                  <div className="space-y-3">
                    {course.modules.map((mod) => (
                      <div key={mod.id} className="rounded-xl border border-cream/[0.06] bg-[#0b1829] overflow-hidden">
                        <button
                          onClick={() => toggleModule(mod.id)}
                          className="w-full flex items-center justify-between p-4 hover:bg-cream/[0.02] transition-all"
                        >
                          <div className="flex items-center gap-3">
                            <span className="w-7 h-7 rounded-lg bg-gold/10 flex items-center justify-center text-gold text-xs font-bold">{mod.order}</span>
                            <span className="text-cream font-medium text-sm">{mod.title}</span>
                            <span className="text-cream/25 text-xs">({mod.lessons.length} {locale === "fr" ? "lecons" : "lessons"})</span>
                          </div>
                          <FaChevronDown className={`text-cream/30 text-xs transition-transform ${expandedModules.has(mod.id) ? "rotate-180" : ""}`} />
                        </button>
                        <AnimatePresence>
                          {expandedModules.has(mod.id) && (
                            <motion.div initial={{ height: 0 }} animate={{ height: "auto" }} exit={{ height: 0 }} className="overflow-hidden">
                              <div className="border-t border-cream/[0.04]">
                                {mod.lessons.map((lesson) => {
                                  const done = completedLessons.has(lesson.id);
                                  const locked = !isEnrolled || !isPaid;
                                  return (
                                    <button
                                      key={lesson.id}
                                      onClick={() => !locked && setActiveLesson(lesson)}
                                      className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-all border-b border-cream/[0.03] last:border-0 ${
                                        !locked ? "hover:bg-cream/[0.03] cursor-pointer" : "cursor-not-allowed opacity-50"
                                      } ${activeLesson?.id === lesson.id ? "bg-gold/[0.06]" : ""}`}
                                    >
                                      <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-xs ${
                                        done ? "bg-emerald-400/15 text-emerald-400" : locked ? "bg-cream/5 text-cream/20" : "bg-gold/10 text-gold"
                                      }`}>
                                        {done ? <FaCheckCircle /> : locked ? <FaLock /> : <FaPlay className="ml-0.5" />}
                                      </div>
                                      <span className={`text-sm flex-1 ${done ? "text-cream/50 line-through" : "text-cream/70"}`}>{lesson.title}</span>
                                      {lesson.duration && <span className="text-cream/20 text-xs flex items-center gap-1"><FaClock className="text-[9px]" />{lesson.duration}min</span>}
                                    </button>
                                  );
                                })}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {activeTab === "ressources" && (
                <motion.div key="ressources" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                  {resources.length === 0 ? (
                    <div className="text-center py-16">
                      <FaFilePdf className="text-cream/10 text-4xl mx-auto mb-4" />
                      <p className="text-cream/30 text-sm">{locale === "fr" ? "Aucune ressource disponible" : "No resources available"}</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {resources.map((res) => {
                        const icons: Record<string, React.ReactNode> = {
                          PDF: <FaFilePdf className="text-red-400" />,
                          AUDIO: <FaHeadphones className="text-purple-400" />,
                          VIDEO: <FaPlay className="text-blue-400" />,
                          DOCUMENT: <FaBookOpen className="text-gold" />,
                        };
                        const colors: Record<string, string> = {
                          PDF: "bg-red-400/10 border-red-400/20",
                          AUDIO: "bg-purple-400/10 border-purple-400/20",
                          VIDEO: "bg-blue-400/10 border-blue-400/20",
                          DOCUMENT: "bg-gold/10 border-gold/20",
                        };
                        return (
                          <div key={res.id} className={`flex items-center gap-4 p-4 rounded-xl border ${colors[res.type] || "bg-cream/[0.02] border-cream/[0.06]"}`}>
                            <div className="w-12 h-12 rounded-xl bg-cream/[0.04] flex items-center justify-center text-xl flex-shrink-0">
                              {icons[res.type] || <FaBookOpen className="text-gold" />}
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="text-cream font-medium text-sm">{res.title}</h4>
                              {res.description && <p className="text-cream/35 text-xs mt-0.5">{res.description}</p>}
                              <div className="flex items-center gap-3 mt-1">
                                {res.fileSize && <span className="text-cream/20 text-[10px]">{formatSize(res.fileSize)}</span>}
                                {res.duration && <span className="text-cream/20 text-[10px]">{formatDuration(res.duration)}</span>}
                                <span className="text-cream/15 text-[10px] uppercase font-bold">{res.type}</span>
                              </div>
                            </div>
                            <a
                              href={res.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="w-10 h-10 rounded-xl bg-cream/[0.04] flex items-center justify-center text-cream/30 hover:text-gold hover:bg-gold/10 transition-all flex-shrink-0"
                            >
                              <FaDownload className="text-sm" />
                            </a>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </motion.div>
              )}

              {activeTab === "quiz" && (
                <motion.div key="quiz" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                  {!quiz ? (
                    <div className="text-center py-16">
                      <FaQuestion className="text-cream/10 text-4xl mx-auto mb-4" />
                      <p className="text-cream/30 text-sm">{locale === "fr" ? "Aucun quiz disponible" : "No quiz available"}</p>
                    </div>
                  ) : quizResult ? (
                    /* Quiz Result */
                    <div className="text-center py-8">
                      <div className={`w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 ring-4 ${
                        quizResult.passed ? "bg-emerald-400/10 ring-emerald-400/20" : "bg-red-400/10 ring-red-400/20"
                      }`}>
                        {quizResult.passed
                          ? <FaTrophy className="text-emerald-400 text-4xl" />
                          : <FaExclamationCircle className="text-red-400 text-4xl" />}
                      </div>
                      <h3 className="text-2xl font-bold text-cream mb-2">{quizResult.score}%</h3>
                      <p className={`text-sm font-medium mb-1 ${quizResult.passed ? "text-emerald-400" : "text-red-400"}`}>
                        {quizResult.passed ? (locale === "fr" ? "Quiz reussi !" : "Quiz passed!") : (locale === "fr" ? "Score insuffisant" : "Insufficient score")}
                      </p>
                      <p className="text-cream/35 text-xs mb-6">
                        {quizResult.correct}/{quizResult.total} {locale === "fr" ? "bonnes reponses" : "correct answers"} &bull; {locale === "fr" ? "Seuil" : "Threshold"}: {quiz.passingScore}%
                      </p>
                      {quizResult.passed && (
                        <p className="text-gold text-xs mb-6 font-medium">
                          🏆 {locale === "fr" ? "Felicitations ! Vous pouvez maintenant obtenir votre certificat." : "Congratulations! You can now get your certificate."}
                        </p>
                      )}
                      <button
                        onClick={() => { setQuizResult(null); setQuizAnswers({}); }}
                        className="flex items-center gap-2 mx-auto px-6 py-3 rounded-xl border border-cream/[0.1] text-cream/50 text-sm hover:text-gold hover:border-gold/30 transition-all"
                      >
                        <FaRedo className="text-xs" /> {locale === "fr" ? "Recommencer" : "Retry"}
                      </button>
                    </div>
                  ) : (
                    /* Quiz Questions */
                    <div>
                      <div className="flex items-center justify-between mb-6">
                        <div>
                          <h3 className="text-cream font-bold text-base">{quiz.title}</h3>
                          {quiz.description && <p className="text-cream/35 text-xs mt-1">{quiz.description}</p>}
                        </div>
                        <span className="px-3 py-1 rounded-full bg-gold/10 text-gold text-xs font-medium">
                          {locale === "fr" ? "Seuil" : "Pass"}: {quiz.passingScore}%
                        </span>
                      </div>
                      <div className="space-y-6 mb-8">
                        {quiz.questions.map((q, idx) => (
                          <div key={q.id} className="p-5 rounded-xl bg-[#0b1829] border border-cream/[0.06]">
                            <p className="text-cream text-sm font-medium mb-4">
                              <span className="text-gold mr-2">{idx + 1}.</span>{q.question}
                            </p>
                            <div className="space-y-2">
                              {q.options.map((opt) => (
                                <button
                                  key={opt}
                                  onClick={() => setQuizAnswers((prev) => ({ ...prev, [q.id]: opt }))}
                                  className={`w-full text-left px-4 py-3 rounded-lg text-sm transition-all ${
                                    quizAnswers[q.id] === opt
                                      ? "bg-gold/15 border border-gold/40 text-cream"
                                      : "bg-cream/[0.02] border border-cream/[0.06] text-cream/50 hover:border-gold/20 hover:text-cream"
                                  }`}
                                >
                                  <span className="font-medium mr-2">{["A", "B", "C", "D"][q.options.indexOf(opt)]}.</span>{opt}
                                </button>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                      <button
                        onClick={submitQuiz}
                        disabled={Object.keys(quizAnswers).length < quiz.questions.length || quizLoading}
                        className={`w-full py-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all ${
                          Object.keys(quizAnswers).length >= quiz.questions.length && !quizLoading
                            ? "bg-gradient-to-r from-gold to-gold-light text-navy hover:shadow-xl hover:shadow-gold/25"
                            : "bg-cream/[0.05] text-cream/20 cursor-not-allowed"
                        }`}
                      >
                        {quizLoading ? <div className="w-4 h-4 border-2 border-navy/30 border-t-navy rounded-full animate-spin" /> : <FaClipboardList />}
                        {locale === "fr" ? `Soumettre (${Object.keys(quizAnswers).length}/${quiz.questions.length})` : `Submit (${Object.keys(quizAnswers).length}/${quiz.questions.length})`}
                      </button>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {!isEnrolled || !isPaid ? (
              <div className="sticky top-24 rounded-2xl border border-gold/20 bg-gradient-to-b from-gold/[0.06] to-transparent p-6">
                <div className="text-3xl font-bold text-cream font-heading mb-1">{course.price} $</div>
                <p className="text-cream/35 text-xs mb-5">{locale === "fr" ? "Acces a vie" : "Lifetime access"}</p>
                {isEnrolled && !isPaid ? (
                  <>
                    <div className="flex items-center gap-2 mb-3 p-3 rounded-xl bg-amber-400/[0.06] border border-amber-400/20">
                      <FaLock className="text-amber-400 text-xs" />
                      <span className="text-amber-400 text-xs font-medium">{locale === "fr" ? "Inscrit - Paiement requis" : "Enrolled - Payment required"}</span>
                    </div>
                    <button onClick={() => setPaymentModal(true)} className="w-full py-4 rounded-xl bg-gradient-to-r from-gold to-gold-light text-navy font-bold text-sm mb-3 hover:shadow-xl hover:shadow-gold/25 transition-all active:scale-[0.98]">
                      {locale === "fr" ? "Debloquer le cours" : "Unlock course"}
                    </button>
                  </>
                ) : (
                  <button onClick={() => setPaymentModal(true)} className="w-full py-4 rounded-xl bg-gradient-to-r from-gold to-gold-light text-navy font-bold text-sm mb-3 hover:shadow-xl hover:shadow-gold/25 transition-all active:scale-[0.98]">
                    {locale === "fr" ? "S'inscrire maintenant" : "Enroll now"}
                  </button>
                )}
                <ul className="space-y-2">
                  {[
                    locale === "fr" ? `${allLessons.length} lecons` : `${allLessons.length} lessons`,
                    locale === "fr" ? "Acces a vie" : "Lifetime access",
                    locale === "fr" ? "Certificat inclus" : "Certificate included",
                    locale === "fr" ? "Ressources PDF & Audio" : "PDF & Audio resources",
                    "Quiz d'evaluation",
                  ].map((f, i) => (
                    <li key={i} className="flex items-center gap-2 text-cream/40 text-xs">
                      <FaCheck className="text-gold text-[10px]" /> {f}
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <div className="sticky top-24 space-y-4">
                <div className="rounded-2xl border border-emerald-400/20 bg-emerald-400/[0.04] p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <FaCheckCircle className="text-emerald-400" />
                    <span className="text-emerald-400 font-medium text-sm">{locale === "fr" ? "Inscrit" : "Enrolled"}</span>
                  </div>
                  <div className="text-center mb-3">
                    <div className="text-3xl font-bold text-cream font-heading">{progress}%</div>
                    <div className="text-cream/30 text-xs">{locale === "fr" ? "de progression" : "progress"}</div>
                  </div>
                  <div className="h-2 bg-cream/[0.06] rounded-full overflow-hidden">
                    <div style={{ width: `${progress}%` }} className="h-full bg-gradient-to-r from-gold to-gold-light rounded-full transition-all" />
                  </div>
                  <div className="mt-3 text-cream/25 text-xs text-center">
                    {completedLessons.size}/{allLessons.length} {locale === "fr" ? "lecons terminees" : "lessons done"}
                  </div>
                </div>

                {quiz && quizResult?.passed && (
                  <div className="rounded-2xl border border-gold/20 bg-gold/[0.04] p-5 text-center">
                    <FaTrophy className="text-gold text-2xl mx-auto mb-2" />
                    <p className="text-cream font-bold text-sm mb-1">{locale === "fr" ? "Quiz reussi !" : "Quiz passed!"}</p>
                    <p className="text-cream/30 text-xs mb-3">{locale === "fr" ? "Obtenez votre certificat" : "Get your certificate"}</p>
                    <Link href="/dashboard/certificats" className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-gold to-gold-light text-navy text-xs font-bold">
                      {locale === "fr" ? "Voir le certificat" : "View certificate"}
                    </Link>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Payment Modal */}
      {course && (
        <PaymentModal
          isOpen={paymentModal}
          onClose={() => setPaymentModal(false)}
          onSuccess={async () => {
            setPaymentModal(false);
            window.location.reload();
          }}
          courseId={course.id}
          courseTitle={course.title}
          amount={typeof course.price === "string" ? parseFloat(course.price) || 0 : course.price}
          currency="USD"
        />
      )}
    </div>
  );
}

export default function FormationDetail() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="w-10 h-10 border-4 border-gold/20 border-t-gold rounded-full animate-spin" /></div>}>
      <FormationDetailContent />
    </Suspense>
  );
}
