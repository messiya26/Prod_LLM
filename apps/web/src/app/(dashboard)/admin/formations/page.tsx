"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaPlus, FaTrash, FaSearch, FaEye, FaEyeSlash, FaTimes, FaSpinner, FaCheck,
  FaBookOpen, FaUsers, FaUserTie, FaExclamationTriangle, FaChevronLeft, FaChevronRight,
  FaFilePdf, FaHeadphones, FaClipboardList, FaEdit, FaVideo, FaFileAlt, FaQuestionCircle, FaLink
} from "react-icons/fa";
import { useAuth } from "@/context/auth-context";
import api from "@/lib/api";

interface Category { id: string; name: string; slug: string; }
interface Instructor { id: string; firstName: string; lastName: string; }
interface Course {
  id: string; title: string; slug: string; description: string; level: string;
  price: string; published: boolean; categoryId: string;
  category: { name: string }; instructor?: Instructor | null;
  _count: { modules: number; enrollments: number };
}
interface Resource { id: string; title: string; description?: string; type: string; url: string; fileSize?: number; duration?: number; order: number; }
interface QuizQuestion { id: string; question: string; options: string[]; correctAnswer: string; explanation?: string; order: number; }
interface Quiz { id: string; title: string; description?: string; passingScore: number; questions: QuizQuestion[]; }

const levelLabels: Record<string, string> = { BEGINNER: "Debutant", INTERMEDIATE: "Intermediaire", ADVANCED: "Avance", ALL_LEVELS: "Tous niveaux" };
const ITEMS_PER_PAGE = 10;
const resourceTypeIcon: Record<string, React.ReactNode> = {
  PDF: <FaFilePdf className="text-red-400" />,
  AUDIO: <FaHeadphones className="text-purple-400" />,
  VIDEO: <FaVideo className="text-blue-400" />,
  DOCUMENT: <FaFileAlt className="text-amber-400" />,
  LINK: <FaLink className="text-emerald-400" />,
};
const resourceTypeBg: Record<string, string> = {
  PDF: "bg-red-400/10 border-red-400/20",
  AUDIO: "bg-purple-400/10 border-purple-400/20",
  VIDEO: "bg-blue-400/10 border-blue-400/20",
  DOCUMENT: "bg-amber-400/10 border-amber-400/20",
  LINK: "bg-emerald-400/10 border-emerald-400/20",
};

export default function AdminFormations() {
  const { user } = useAuth();
  const [courses, setCourses] = useState<Course[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [instructors, setInstructors] = useState<Instructor[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [viewCourse, setViewCourse] = useState<Course | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<Course | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [toggling, setToggling] = useState<string | null>(null);
  const [toast, setToast] = useState<{ msg: string; type: "success" | "error" } | null>(null);
  const [form, setForm] = useState({ title: "", description: "", price: "", level: "ALL_LEVELS", categoryId: "", instructorId: "" });
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);
  const [page, setPage] = useState(1);

  const [manageCourse, setManageCourse] = useState<Course | null>(null);
  const [manageTab, setManageTab] = useState<"resources" | "quiz" | "modules">("resources");
  const [resources, setResources] = useState<Resource[]>([]);
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [loadingContent, setLoadingContent] = useState(false);
  const [showResourceForm, setShowResourceForm] = useState(false);
  const [showQuizForm, setShowQuizForm] = useState(false);
  const [showQuestionForm, setShowQuestionForm] = useState(false);
  const [savingContent, setSavingContent] = useState(false);
  const [resForm, setResForm] = useState({ title: "", description: "", type: "PDF", url: "" });
  const [quizForm, setQuizForm] = useState({ title: "", description: "", passingScore: 70 });
  const [qForm, setQForm] = useState({ question: "", options: ["", "", "", ""], correctAnswer: "", explanation: "" });
  const [actionConfirm, setActionConfirm] = useState<{ title: string; message: string; action: () => Promise<void>; type: "danger" | "warning" } | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  interface ModuleData { id: string; title: string; order: number; lessons: LessonData[]; }
  interface LessonData { id: string; title: string; content?: string; duration?: number; order: number; }
  const [modules, setModules] = useState<ModuleData[]>([]);
  const [loadingModules, setLoadingModules] = useState(false);
  const [showModuleForm, setShowModuleForm] = useState(false);
  const [moduleForm, setModuleForm] = useState({ title: "" });
  const [editingModule, setEditingModule] = useState<string | null>(null);
  const [showLessonForm, setShowLessonForm] = useState<string | null>(null);
  const [lessonForm, setLessonForm] = useState({ title: "", content: "", duration: 30 });
  const [editingLesson, setEditingLesson] = useState<string | null>(null);
  const [expandedModule, setExpandedModule] = useState<string | null>(null);

  const showToast = (msg: string, type: "success" | "error" = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  const fetchData = useCallback(async () => {
    try {
      const [c, cat, inst] = await Promise.all([
        api.get<Course[]>("/courses"),
        api.get<Category[]>("/courses/categories"),
        api.get<Instructor[]>("/courses/instructors"),
      ]);
      setCourses(c);
      setCategories(cat);
      setInstructors(inst);
    } catch {} finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const filtered = courses.filter((f) => f.title.toLowerCase().includes(search.toLowerCase()));
  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const paged = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  useEffect(() => { setPage(1); }, [search]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      let thumbnail = "";
      if (thumbnailFile) {
        const fd = new FormData();
        fd.append("file", thumbnailFile);
        const upRes = await api.upload<{ url: string }>("/upload", fd);
        thumbnail = upRes.url;
      }
      await api.post("/courses", {
        title: form.title, description: form.description,
        price: parseFloat(form.price) || 0, level: form.level,
        categoryId: form.categoryId, instructorId: form.instructorId || undefined,
        thumbnail,
      });
      setShowModal(false);
      setForm({ title: "", description: "", price: "", level: "ALL_LEVELS", categoryId: "", instructorId: "" });
      setThumbnailFile(null); setThumbnailPreview(null);
      showToast("Formation ajoutee avec succes !");
      await fetchData();
    } catch { showToast("Erreur lors de la creation", "error"); } finally { setSaving(false); }
  };

  const handleToggle = (id: string) => {
    const course = courses.find(c => c.id === id);
    if (!course) return;
    setActionConfirm({
      title: course.published ? "Depublier la formation" : "Publier la formation",
      message: course.published
        ? `La formation "${course.title}" ne sera plus visible publiquement.`
        : `La formation "${course.title}" sera visible par tous les visiteurs.`,
      type: "warning",
      action: async () => {
        setToggling(id);
        try {
          await api.put(`/courses/${id}/toggle-publish`);
          showToast(course.published ? "Formation depubliee" : "Formation publiee !");
          await fetchData();
        } catch { showToast("Erreur lors du changement de statut", "error"); } finally { setToggling(null); }
      },
    });
  };

  const requestDelete = (course: { id: string; title: string }) => {
    setActionConfirm({
      title: "Supprimer la formation",
      message: `Etes-vous sur de vouloir supprimer "${course.title}" ? Cette action est irreversible et supprimera tous les modules, lecons et inscriptions associes.`,
      type: "danger",
      action: async () => {
        setDeleting(course.id);
        try {
          await api.delete(`/courses/${course.id}`);
          showToast("Formation supprimee");
          await fetchData();
        } catch { showToast("Erreur lors de la suppression", "error"); } finally { setDeleting(null); }
      },
    });
  };

  const openManage = async (course: Course) => {
    setManageCourse(course);
    setManageTab("resources");
    setLoadingContent(true);
    setModules([]);
    try {
      const [res, q] = await Promise.all([
        api.get<Resource[]>(`/resources/course/${course.id}`).catch(() => []),
        api.get<Quiz>(`/resources/quiz/course/${course.id}`).catch(() => null),
      ]);
      setResources(Array.isArray(res) ? res : []);
      setQuiz(q);
    } catch {} finally { setLoadingContent(false); }
    fetchModules(course.id);
  };

  const fetchModules = async (courseId: string) => {
    setLoadingModules(true);
    try {
      const mods = await api.get<ModuleData[]>(`/modules/course/${courseId}`);
      setModules(Array.isArray(mods) ? mods : []);
    } catch { setModules([]); } finally { setLoadingModules(false); }
  };

  const handleAddModule = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!manageCourse || !moduleForm.title.trim()) return;
    setSavingContent(true);
    try {
      await api.post(`/modules/course/${manageCourse.id}`, { title: moduleForm.title });
      showToast("Module ajoute !");
      setModuleForm({ title: "" }); setShowModuleForm(false);
      await fetchModules(manageCourse.id);
    } catch { showToast("Erreur ajout module", "error"); } finally { setSavingContent(false); }
  };

  const handleUpdateModule = async (id: string, title: string) => {
    setSavingContent(true);
    try {
      await api.put(`/modules/${id}`, { title });
      showToast("Module mis a jour");
      setEditingModule(null);
      if (manageCourse) await fetchModules(manageCourse.id);
    } catch { showToast("Erreur", "error"); } finally { setSavingContent(false); }
  };

  const handleDeleteModule = async (id: string) => {
    setSavingContent(true);
    try {
      await api.delete(`/modules/${id}`);
      showToast("Module supprime");
      if (manageCourse) await fetchModules(manageCourse.id);
    } catch { showToast("Erreur suppression", "error"); } finally { setSavingContent(false); }
  };

  const handleAddLesson = async (e: React.FormEvent, moduleId: string) => {
    e.preventDefault();
    if (!lessonForm.title.trim()) return;
    setSavingContent(true);
    try {
      await api.post(`/modules/${moduleId}/lessons`, {
        title: lessonForm.title,
        content: lessonForm.content || undefined,
        duration: lessonForm.duration || 30,
      });
      showToast("Lecon ajoutee !");
      setLessonForm({ title: "", content: "", duration: 30 }); setShowLessonForm(null);
      if (manageCourse) await fetchModules(manageCourse.id);
    } catch { showToast("Erreur ajout lecon", "error"); } finally { setSavingContent(false); }
  };

  const handleUpdateLesson = async (id: string, data: { title?: string; content?: string; duration?: number }) => {
    setSavingContent(true);
    try {
      await api.put(`/modules/lessons/${id}`, data);
      showToast("Lecon mise a jour");
      setEditingLesson(null);
      if (manageCourse) await fetchModules(manageCourse.id);
    } catch { showToast("Erreur", "error"); } finally { setSavingContent(false); }
  };

  const handleDeleteLesson = async (id: string) => {
    setSavingContent(true);
    try {
      await api.delete(`/modules/lessons/${id}`);
      showToast("Lecon supprimee");
      if (manageCourse) await fetchModules(manageCourse.id);
    } catch { showToast("Erreur suppression", "error"); } finally { setSavingContent(false); }
  };

  const [resFile, setResFile] = useState<File | null>(null);
  const [uploadingRes, setUploadingRes] = useState(false);

  const handleAddResource = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!manageCourse) return;
    setSavingContent(true);
    try {
      let fileUrl = resForm.url;
      if (resFile && resForm.type !== "LINK") {
        setUploadingRes(true);
        const formData = new FormData();
        formData.append("file", resFile);
        const uploaded = await api.upload<{ url: string }>("/upload", formData);
        fileUrl = uploaded.url;
        setUploadingRes(false);
      }
      await api.post(`/resources/course/${manageCourse.id}`, {
        title: resForm.title, description: resForm.description || undefined,
        type: resForm.type, url: fileUrl, fileSize: resFile?.size,
      });
      const res = await api.get<Resource[]>(`/resources/course/${manageCourse.id}`).catch(() => []);
      setResources(Array.isArray(res) ? res : []);
      setShowResourceForm(false);
      setResForm({ title: "", description: "", type: "PDF", url: "" });
      setResFile(null);
      showToast("Ressource ajoutee !");
    } catch { showToast("Erreur", "error"); } finally { setSavingContent(false); setUploadingRes(false); }
  };

  const handleDeleteResource = async (id: string) => {
    const res = resources.find(r => r.id === id);
    setActionConfirm({
      title: "Supprimer la ressource",
      message: `Etes-vous sur de vouloir supprimer "${res?.title || "cette ressource"}" ? Cette action est irreversible.`,
      type: "danger",
      action: async () => {
        if (!manageCourse) return;
        try {
          await api.delete(`/resources/${id}`);
          setResources(prev => prev.filter(r => r.id !== id));
          showToast("Ressource supprimee");
        } catch { showToast("Erreur", "error"); }
      },
    });
  };

  const handleCreateQuiz = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!manageCourse) return;
    setSavingContent(true);
    try {
      const q = await api.post<Quiz>(`/resources/quiz/course/${manageCourse.id}`, {
        title: quizForm.title, description: quizForm.description || undefined,
        passingScore: quizForm.passingScore,
      });
      setQuiz(q);
      setShowQuizForm(false);
      showToast("Quiz cree !");
    } catch { showToast("Erreur", "error"); } finally { setSavingContent(false); }
  };

  const handleAddQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!quiz) return;
    setSavingContent(true);
    try {
      await api.post(`/resources/quiz/${quiz.id}/questions`, {
        question: qForm.question,
        options: qForm.options.filter(o => o.trim()),
        correctAnswer: qForm.correctAnswer,
        explanation: qForm.explanation || undefined,
      });
      const q = await api.get<Quiz>(`/resources/quiz/course/${manageCourse!.id}`).catch(() => null);
      setQuiz(q);
      setShowQuestionForm(false);
      setQForm({ question: "", options: ["", "", "", ""], correctAnswer: "", explanation: "" });
      showToast("Question ajoutee !");
    } catch { showToast("Erreur", "error"); } finally { setSavingContent(false); }
  };

  const handleDeleteQuestion = async (id: string) => {
    const q = quiz?.questions.find(q => q.id === id);
    setActionConfirm({
      title: "Supprimer la question",
      message: `Supprimer la question "${q?.question?.substring(0, 50) || ""}..." du quiz ?`,
      type: "danger",
      action: async () => {
        try {
          await api.delete(`/resources/quiz/questions/${id}`);
          if (quiz) setQuiz({ ...quiz, questions: quiz.questions.filter(q => q.id !== id) });
          showToast("Question supprimee");
        } catch { showToast("Erreur", "error"); }
      },
    });
  };

  const isAdmin = user?.role === "ADMIN";

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <FaSpinner className="text-gold text-2xl animate-spin" />
    </div>
  );

  return (
    <>
      <AnimatePresence>
        {toast && (
          <motion.div initial={{ opacity: 0, y: -30, scale: 0.9 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -20, scale: 0.9 }}
            className={`fixed top-6 right-6 z-[100] flex items-center gap-3 px-6 py-4 rounded-2xl shadow-2xl backdrop-blur-xl border ${
              toast.type === "success" ? "bg-emerald-500/15 border-emerald-500/20 text-emerald-400" : "bg-red-500/15 border-red-500/20 text-red-400"
            }`}>
            {toast.type === "success" ? <FaCheck /> : <FaTimes />}
            <span className="text-sm font-medium">{toast.msg}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Action Confirmation Modal */}
      <AnimatePresence>
        {actionConfirm && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[95] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
            onClick={() => !actionLoading && setActionConfirm(null)}>
            <motion.div initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 400 }}
              className="bg-[#0d1a2e] border border-gold/10 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden" onClick={(e) => e.stopPropagation()}>
              <div className={`p-5 border-b border-white/[0.06] flex items-center gap-3 ${actionConfirm.type === "danger" ? "bg-red-500/5" : "bg-amber-500/5"}`}>
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${actionConfirm.type === "danger" ? "bg-red-500/15 text-red-400" : "bg-amber-500/15 text-amber-400"}`}>
                  <FaExclamationTriangle className="text-lg" />
                </div>
                <h2 className="text-white font-bold text-base">{actionConfirm.title}</h2>
              </div>
              <div className="p-5">
                <p className="text-white/60 text-sm leading-relaxed mb-6">{actionConfirm.message}</p>
                <div className="flex gap-3">
                  <button onClick={() => setActionConfirm(null)} disabled={actionLoading}
                    className="flex-1 py-3 rounded-xl border border-white/[0.08] text-white/50 text-sm font-medium hover:bg-white/[0.04] transition-all disabled:opacity-40">
                    Annuler
                  </button>
                  <button onClick={async () => { setActionLoading(true); try { await actionConfirm.action(); } finally { setActionLoading(false); setActionConfirm(null); } }} disabled={actionLoading}
                    className={`flex-1 py-3 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all disabled:opacity-60 ${
                      actionConfirm.type === "danger" ? "bg-red-500 text-white hover:bg-red-600" : "bg-amber-500 text-navy hover:bg-amber-400"
                    }`}>
                    {actionLoading ? <FaSpinner className="animate-spin" /> : <FaCheck className="text-xs" />}
                    {actionLoading ? "En cours..." : "Confirmer"}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-xl font-bold text-white mb-1">Formations</h1>
          <p className="text-white/30 text-sm">{courses.length} formations au total</p>
        </div>
        <button onClick={() => { setForm({ title: "", description: "", price: "", level: "ALL_LEVELS", categoryId: categories[0]?.id || "", instructorId: "" }); setShowModal(true); }}
          className="flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-gold to-gold-light text-navy text-sm font-bold hover:shadow-lg hover:shadow-gold/20 transition-all active:scale-95">
          <FaPlus className="text-xs" /> Nouvelle formation
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {[
          { label: "Total", value: courses.length, color: "text-white" },
          { label: "Publiees", value: courses.filter(c => c.published).length, color: "text-emerald-400" },
          { label: "Brouillons", value: courses.filter(c => !c.published).length, color: "text-amber-400" },
          { label: "Inscrits", value: courses.reduce((s, c) => s + c._count.enrollments, 0), color: "text-blue-400" },
        ].map(s => (
          <div key={s.label} className="rounded-xl bg-white/[0.02] border border-white/[0.06] p-4">
            <div className="text-white/30 text-xs mb-1">{s.label}</div>
            <div className={`text-xl font-bold ${s.color}`}>{s.value}</div>
          </div>
        ))}
      </div>

      <div className="relative mb-6 max-w-sm">
        <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 text-sm" />
        <input type="text" placeholder="Rechercher..." value={search} onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-11 pr-4 py-3 rounded-xl bg-white/[0.04] border border-white/[0.06] text-white placeholder:text-white/20 text-sm focus:outline-none focus:border-gold/40 transition-all" />
      </div>

      <div className="rounded-xl border border-white/[0.05] overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/[0.05] bg-white/[0.01]">
              {["Formation", "Categorie", "Formateur", "Prix", "Inscrits", "Statut", "Actions"].map(h => (
                <th key={h} className="text-left text-white/40 text-xs font-medium uppercase tracking-wider px-5 py-3">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paged.map((f, i) => (
              <motion.tr key={f.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.02 }}
                className="border-b border-white/[0.03] hover:bg-white/[0.02] transition-colors">
                <td className="px-5 py-4">
                  <div className="text-sm text-white font-medium">{f.title}</div>
                  <div className="text-[10px] text-white/25">{levelLabels[f.level] || f.level}</div>
                </td>
                <td className="px-5 py-4 text-sm text-white/40">{f.category?.name}</td>
                <td className="px-5 py-4 text-sm text-white/40">{f.instructor ? `${f.instructor.firstName} ${f.instructor.lastName}` : "\u2014"}</td>
                <td className="px-5 py-4 text-sm text-gold font-medium">{parseFloat(f.price) === 0 ? "Gratuit" : `$${f.price}`}</td>
                <td className="px-5 py-4 text-sm text-white/40">{f._count.enrollments}</td>
                <td className="px-5 py-4">
                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-medium ${f.published ? "bg-emerald-400/10 text-emerald-400" : "bg-amber-400/10 text-amber-400"}`}>
                    {f.published ? "Publie" : "Brouillon"}
                  </span>
                </td>
                <td className="px-5 py-4">
                  <div className="flex items-center justify-end gap-1">
                    <button onClick={() => setViewCourse(f)} className="p-2 rounded-lg hover:bg-blue-400/10 text-white/30 hover:text-blue-400 transition-all" title="Voir">
                      <FaEye className="text-xs" />
                    </button>
                    <button onClick={() => openManage(f)} className="p-2 rounded-lg hover:bg-gold/10 text-white/30 hover:text-gold transition-all" title="Gerer contenu">
                      <FaEdit className="text-xs" />
                    </button>
                    <button onClick={() => handleToggle(f.id)} disabled={toggling === f.id}
                      className="p-2 rounded-lg hover:bg-white/[0.05] text-white/30 hover:text-white transition-all disabled:opacity-40" title={f.published ? "Depublier" : "Publier"}>
                      {toggling === f.id ? <FaSpinner className="text-xs animate-spin" /> : f.published ? <FaEyeSlash className="text-xs" /> : <FaEye className="text-xs" />}
                    </button>
                    {isAdmin && (
                      <button onClick={() => requestDelete(f)} disabled={deleting === f.id}
                        className="p-2 rounded-lg hover:bg-red-400/10 text-white/30 hover:text-red-400 transition-all disabled:opacity-40" title="Supprimer">
                        {deleting === f.id ? <FaSpinner className="text-xs animate-spin" /> : <FaTrash className="text-xs" />}
                      </button>
                    )}
                  </div>
                </td>
              </motion.tr>
            ))}
            {filtered.length === 0 && (
              <tr><td colSpan={7} className="text-center py-12 text-white/20 text-sm">Aucune formation trouvee</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-4">
          <p className="text-white/30 text-xs">{filtered.length} resultats &middot; Page {page}/{totalPages}</p>
          <div className="flex items-center gap-1">
            <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
              className="p-2 rounded-lg hover:bg-white/[0.05] text-white/30 hover:text-white transition-all disabled:opacity-20">
              <FaChevronLeft className="text-xs" />
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(n => (
              <button key={n} onClick={() => setPage(n)}
                className={`w-8 h-8 rounded-lg text-xs font-medium transition-all ${n === page ? "bg-gold/20 text-gold border border-gold/30" : "text-white/30 hover:bg-white/[0.05] hover:text-white"}`}>
                {n}
              </button>
            ))}
            <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
              className="p-2 rounded-lg hover:bg-white/[0.05] text-white/30 hover:text-white transition-all disabled:opacity-20">
              <FaChevronRight className="text-xs" />
            </button>
          </div>
        </div>
      )}

      {/* View Course Modal */}
      <AnimatePresence>
        {viewCourse && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[80] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" onClick={() => setViewCourse(null)}>
            <motion.div initial={{ opacity: 0, scale: 0.92, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.92, y: 20 }}
              className="bg-[#0d1a2e] border border-gold/10 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden" onClick={(e) => e.stopPropagation()}>
              <div className="relative bg-gradient-to-br from-gold/10 to-transparent p-6 border-b border-white/[0.06]">
                <button onClick={() => setViewCourse(null)} className="absolute top-4 right-4 text-white/30 hover:text-white"><FaTimes /></button>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-gold/10 flex items-center justify-center"><FaBookOpen className="text-gold" /></div>
                  <div>
                    <h2 className="text-lg font-bold text-white">{viewCourse.title}</h2>
                    <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${viewCourse.published ? "bg-emerald-400/10 text-emerald-400" : "bg-amber-400/10 text-amber-400"}`}>
                      {viewCourse.published ? "Publie" : "Brouillon"}
                    </span>
                  </div>
                </div>
              </div>
              <div className="p-6 space-y-5">
                <p className="text-white/50 text-sm leading-relaxed">{viewCourse.description || "Pas de description"}</p>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { label: "Categorie", value: viewCourse.category?.name || "\u2014", icon: <FaBookOpen className="text-xs text-gold" /> },
                    { label: "Niveau", value: levelLabels[viewCourse.level] || viewCourse.level, icon: <FaBookOpen className="text-xs text-gold" /> },
                    { label: "Prix", value: parseFloat(viewCourse.price) === 0 ? "Gratuit" : `$${viewCourse.price}`, icon: <FaBookOpen className="text-xs text-gold" /> },
                    { label: "Formateur", value: viewCourse.instructor ? `${viewCourse.instructor.firstName} ${viewCourse.instructor.lastName}` : "Non assigne", icon: <FaUserTie className="text-xs text-gold" /> },
                    { label: "Modules", value: `${viewCourse._count.modules}`, icon: <FaBookOpen className="text-xs text-gold" /> },
                    { label: "Inscrits", value: `${viewCourse._count.enrollments}`, icon: <FaUsers className="text-xs text-gold" /> },
                  ].map(item => (
                    <div key={item.label} className="bg-white/[0.02] rounded-xl p-3 border border-white/[0.04]">
                      <div className="flex items-center gap-2 text-white/30 text-[10px] uppercase tracking-wider mb-1">{item.icon} {item.label}</div>
                      <div className="text-white text-sm font-medium">{item.value}</div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Action Confirmation Modal */}
      <AnimatePresence>
        {actionConfirm && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[90] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4" onClick={() => setActionConfirm(null)}>
            <motion.div initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className={`bg-[#0d1a2e] border rounded-2xl w-full max-w-sm shadow-2xl overflow-hidden ${actionConfirm.type === "danger" ? "border-red-500/20" : "border-gold/20"}`}
              onClick={(e) => e.stopPropagation()}>
              <div className="p-6 text-center">
                <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${actionConfirm.type === "danger" ? "bg-red-500/10" : "bg-gold/10"}`}>
                  <FaExclamationTriangle className={`text-2xl ${actionConfirm.type === "danger" ? "text-red-400" : "text-gold"}`} />
                </div>
                <h3 className="text-white font-bold text-lg mb-2">{actionConfirm.title}</h3>
                <p className="text-white/40 text-sm mb-6">{actionConfirm.message}</p>
                <div className="flex gap-3">
                  <button onClick={() => setActionConfirm(null)} className="flex-1 py-3 rounded-xl border border-white/[0.08] text-white/50 text-sm hover:text-white hover:bg-white/[0.04] transition-all">
                    Annuler
                  </button>
                  <button onClick={async () => { setActionLoading(true); try { await actionConfirm.action(); } finally { setActionLoading(false); setActionConfirm(null); } }}
                    disabled={actionLoading}
                    className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all disabled:opacity-60 flex items-center justify-center gap-2 ${
                      actionConfirm.type === "danger" ? "bg-red-500/20 border border-red-500/30 text-red-400 hover:bg-red-500/30" : "bg-gold/20 border border-gold/30 text-gold hover:bg-gold/30"
                    }`}>
                    {actionLoading ? <FaSpinner className="animate-spin" /> : <FaCheck className="text-xs" />}
                    Confirmer
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Create Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" onClick={() => !saving && setShowModal(false)}>
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-[#0d1a2e] border border-gold/10 rounded-2xl w-full max-w-lg shadow-2xl" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.06]">
                <h2 className="text-lg font-bold text-white">Nouvelle formation</h2>
                <button onClick={() => setShowModal(false)} className="text-white/30 hover:text-white transition-colors"><FaTimes /></button>
              </div>
              <form onSubmit={handleCreate} className="p-6 space-y-4">
                <div>
                  <label className="block text-white/50 text-xs font-medium mb-1.5 uppercase tracking-wider">Titre *</label>
                  <input type="text" required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white placeholder:text-white/20 text-sm focus:outline-none focus:border-gold/40 transition-all"
                    placeholder="Ex: Leadership Pastoral" />
                </div>
                <div>
                  <label className="block text-white/50 text-xs font-medium mb-1.5 uppercase tracking-wider">Description *</label>
                  <textarea required value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3}
                    className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white placeholder:text-white/20 text-sm focus:outline-none focus:border-gold/40 transition-all resize-none"
                    placeholder="Decrivez la formation..." />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-white/50 text-xs font-medium mb-1.5 uppercase tracking-wider">Prix ($)</label>
                    <input type="number" step="0.01" min="0" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white placeholder:text-white/20 text-sm focus:outline-none focus:border-gold/40 transition-all"
                      placeholder="0 = Gratuit" />
                  </div>
                  <div>
                    <label className="block text-white/50 text-xs font-medium mb-1.5 uppercase tracking-wider">Niveau</label>
                    <select value={form.level} onChange={(e) => setForm({ ...form, level: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white text-sm focus:outline-none focus:border-gold/40 transition-all">
                      {Object.entries(levelLabels).map(([k, v]) => <option key={k} value={k} className="bg-[#0d1a2e]">{v}</option>)}
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-white/50 text-xs font-medium mb-1.5 uppercase tracking-wider">Categorie *</label>
                    <select required value={form.categoryId} onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white text-sm focus:outline-none focus:border-gold/40 transition-all">
                      <option value="" className="bg-[#0d1a2e]">Choisir...</option>
                      {categories.map(c => <option key={c.id} value={c.id} className="bg-[#0d1a2e]">{c.name}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-white/50 text-xs font-medium mb-1.5 uppercase tracking-wider">Formateur</label>
                    <select value={form.instructorId} onChange={(e) => setForm({ ...form, instructorId: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white text-sm focus:outline-none focus:border-gold/40 transition-all">
                      <option value="" className="bg-[#0d1a2e]">Aucun</option>
                      {instructors.map(i => <option key={i.id} value={i.id} className="bg-[#0d1a2e]">{i.firstName} {i.lastName}</option>)}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-white/50 text-xs font-medium mb-1.5 uppercase tracking-wider">Miniature / Image</label>
                  <div className="relative">
                    {thumbnailPreview ? (
                      <div className="relative w-full h-32 rounded-xl overflow-hidden border border-gold/20">
                        <img src={thumbnailPreview} alt="preview" className="w-full h-full object-cover" />
                        <button type="button" onClick={() => { setThumbnailFile(null); setThumbnailPreview(null); }}
                          className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/60 flex items-center justify-center text-white hover:bg-red-500/80 transition-all">
                          <FaTimes className="text-[10px]" />
                        </button>
                      </div>
                    ) : (
                      <label className="flex flex-col items-center justify-center w-full h-32 rounded-xl border-2 border-dashed border-white/10 hover:border-gold/30 bg-white/[0.02] cursor-pointer transition-all group">
                        <FaPlus className="text-white/20 group-hover:text-gold/50 mb-1 transition-colors" />
                        <span className="text-white/20 text-xs group-hover:text-white/40">Cliquer pour ajouter</span>
                        <input type="file" accept="image/*" className="hidden" onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) { setThumbnailFile(file); setThumbnailPreview(URL.createObjectURL(file)); }
                        }} />
                      </label>
                    )}
                  </div>
                </div>
                <div className="flex justify-end gap-3 pt-2">
                  <button type="button" onClick={() => setShowModal(false)} className="px-5 py-2.5 rounded-xl text-white/40 text-sm hover:text-white hover:bg-white/[0.04] transition-all">
                    Annuler
                  </button>
                  <button type="submit" disabled={saving}
                    className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-gold to-gold-light text-navy text-sm font-bold hover:shadow-lg hover:shadow-gold/20 transition-all disabled:opacity-60 active:scale-95">
                    {saving ? <><FaSpinner className="animate-spin" /> Enregistrement...</> : <><FaPlus className="text-xs" /> Creer</>}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Manage Content Modal */}
      <AnimatePresence>
        {manageCourse && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[85] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4" onClick={() => { setManageCourse(null); setShowResourceForm(false); setShowQuizForm(false); setShowQuestionForm(false); }}>
            <motion.div initial={{ opacity: 0, scale: 0.92, y: 30 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.92, y: 30 }}
              className="bg-[#0d1a2e] border border-gold/10 rounded-2xl w-full max-w-2xl shadow-2xl max-h-[85vh] flex flex-col" onClick={(e) => e.stopPropagation()}>

              <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.06] shrink-0">
                <div>
                  <h2 className="text-lg font-bold text-white">{manageCourse.title}</h2>
                  <p className="text-white/30 text-xs">Gestion du contenu</p>
                </div>
                <button onClick={() => setManageCourse(null)} className="text-white/30 hover:text-white transition-colors"><FaTimes /></button>
              </div>

              <div className="flex border-b border-white/[0.06] shrink-0">
                {([
                  { key: "resources" as const, label: "Ressources", icon: <FaFilePdf className="text-xs" /> },
                  { key: "quiz" as const, label: "Quiz", icon: <FaQuestionCircle className="text-xs" /> },
                  { key: "modules" as const, label: "Modules", icon: <FaBookOpen className="text-xs" /> },
                ]).map(tab => (
                  <button key={tab.key} onClick={() => setManageTab(tab.key)}
                    className={`flex items-center gap-2 px-5 py-3 text-sm font-medium transition-all border-b-2 ${
                      manageTab === tab.key ? "border-gold text-gold" : "border-transparent text-white/30 hover:text-white/60"
                    }`}>
                    {tab.icon} {tab.label}
                  </button>
                ))}
              </div>

              <div className="flex-1 overflow-y-auto p-6">
                {loadingContent ? (
                  <div className="flex items-center justify-center h-32"><FaSpinner className="text-gold text-xl animate-spin" /></div>
                ) : manageTab === "resources" ? (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <p className="text-white/40 text-sm">{resources.length} ressource(s)</p>
                      <button onClick={() => { setResForm({ title: "", description: "", type: "PDF", url: "" }); setShowResourceForm(true); }}
                        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gold/10 text-gold text-xs font-medium hover:bg-gold/20 transition-all">
                        <FaPlus className="text-[10px]" /> Ajouter
                      </button>
                    </div>

                    {resources.length === 0 && !showResourceForm && (
                      <div className="text-center py-10">
                        <FaFileAlt className="text-white/10 text-3xl mx-auto mb-3" />
                        <p className="text-white/20 text-sm">Aucune ressource</p>
                      </div>
                    )}

                    {resources.map(r => (
                      <div key={r.id} className={`flex items-center gap-4 p-4 rounded-xl border group transition-all hover:shadow-lg ${resourceTypeBg[r.type] || "bg-white/[0.02] border-white/[0.06]"}`}>
                        <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 text-lg ${
                          r.type === "PDF" ? "bg-red-400/15" : r.type === "AUDIO" ? "bg-purple-400/15" : r.type === "VIDEO" ? "bg-blue-400/15" : r.type === "DOCUMENT" ? "bg-amber-400/15" : "bg-emerald-400/15"
                        }`}>
                          {resourceTypeIcon[r.type] || <FaFileAlt className="text-white/30" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-white text-sm font-medium truncate">{r.title}</p>
                          {r.description && <p className="text-white/20 text-[10px] truncate">{r.description}</p>}
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded ${
                              r.type === "PDF" ? "bg-red-400/10 text-red-400" : r.type === "AUDIO" ? "bg-purple-400/10 text-purple-400" : r.type === "VIDEO" ? "bg-blue-400/10 text-blue-400" : r.type === "DOCUMENT" ? "bg-amber-400/10 text-amber-400" : "bg-emerald-400/10 text-emerald-400"
                            }`}>{r.type}</span>
                            {r.fileSize ? <span className="text-white/15 text-[10px]">{(r.fileSize / 1024 / 1024).toFixed(1)} MB</span> : null}
                            {r.duration ? <span className="text-white/15 text-[10px]">{r.duration} min</span> : null}
                          </div>
                        </div>
                        <a href={r.url.startsWith("http") ? r.url : `${process.env.NEXT_PUBLIC_API_URL?.replace("/api/v1", "") || "http://localhost:4000"}${r.url}`} target="_blank" rel="noopener noreferrer"
                          className="p-2 rounded-lg hover:bg-blue-400/10 text-white/20 hover:text-blue-400 transition-all" title="Voir/Telecharger">
                          <FaEye className="text-xs" />
                        </a>
                        <button onClick={() => setActionConfirm({ title: "Supprimer la ressource", message: `Supprimer "${r.title}" ?`, type: "danger", action: () => handleDeleteResource(r.id) })}
                          className="p-2 rounded-lg hover:bg-red-400/10 text-white/20 hover:text-red-400 transition-all opacity-0 group-hover:opacity-100">
                          <FaTrash className="text-xs" />
                        </button>
                      </div>
                    ))}

                    <AnimatePresence>
                      {showResourceForm && (
                        <motion.form initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}
                          onSubmit={handleAddResource} className="p-4 rounded-xl border border-gold/10 bg-white/[0.01] space-y-3">
                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <label className="block text-white/40 text-[10px] uppercase tracking-wider mb-1">Titre *</label>
                              <input type="text" required value={resForm.title} onChange={e => setResForm({ ...resForm, title: e.target.value })}
                                className="w-full px-3 py-2 rounded-lg bg-white/[0.04] border border-white/[0.08] text-white text-sm focus:outline-none focus:border-gold/40" placeholder="Guide PDF..." />
                            </div>
                            <div>
                              <label className="block text-white/40 text-[10px] uppercase tracking-wider mb-1">Type *</label>
                              <select value={resForm.type} onChange={e => { setResForm({ ...resForm, type: e.target.value, url: "" }); setResFile(null); }}
                                className="w-full px-3 py-2 rounded-lg bg-white/[0.04] border border-white/[0.08] text-white text-sm focus:outline-none focus:border-gold/40">
                                {[
                                  { v: "PDF", l: "PDF (livre, support)" },
                                  { v: "AUDIO", l: "Audio (podcast, cours)" },
                                  { v: "VIDEO", l: "Video (tutoriel)" },
                                  { v: "DOCUMENT", l: "Document (Word, Excel...)" },
                                  { v: "LINK", l: "Lien externe" },
                                ].map(t => <option key={t.v} value={t.v} className="bg-[#0d1a2e]">{t.l}</option>)}
                              </select>
                            </div>
                          </div>
                          {resForm.type === "LINK" ? (
                            <div>
                              <label className="block text-white/40 text-[10px] uppercase tracking-wider mb-1">URL *</label>
                              <input type="url" required value={resForm.url} onChange={e => setResForm({ ...resForm, url: e.target.value })}
                                className="w-full px-3 py-2 rounded-lg bg-white/[0.04] border border-white/[0.08] text-white text-sm focus:outline-none focus:border-gold/40" placeholder="https://..." />
                            </div>
                          ) : (
                            <div>
                              <label className="block text-white/40 text-[10px] uppercase tracking-wider mb-1">
                                {resForm.type === "PDF" ? "Fichier PDF" : resForm.type === "AUDIO" ? "Fichier audio" : resForm.type === "VIDEO" ? "Fichier video ou URL" : "Fichier document"} *
                              </label>
                              <div className="flex gap-2">
                                <label className="flex-1 relative cursor-pointer">
                                  <input type="file"
                                    accept={resForm.type === "PDF" ? ".pdf" : resForm.type === "AUDIO" ? "audio/*" : resForm.type === "VIDEO" ? "video/*,.mp4,.webm" : ".doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.csv"}
                                    onChange={e => { const f = e.target.files?.[0]; if (f) { setResFile(f); setResForm({ ...resForm, url: f.name }); } }}
                                    className="absolute inset-0 opacity-0 cursor-pointer" />
                                  <div className={`w-full px-3 py-2 rounded-lg border text-sm flex items-center gap-2 ${
                                    resFile ? "bg-gold/5 border-gold/20 text-gold" : "bg-white/[0.04] border-white/[0.08] text-white/40"
                                  }`}>
                                    {resFile ? (
                                      <><FaCheck className="text-[10px]" /> {resFile.name} <span className="text-white/20 text-[10px] ml-auto">{(resFile.size / 1024 / 1024).toFixed(1)} MB</span></>
                                    ) : (
                                      <><FaPlus className="text-[10px]" /> Choisir un fichier...</>
                                    )}
                                  </div>
                                </label>
                                {resForm.type === "VIDEO" && (
                                  <input type="url" value={resForm.url.startsWith("http") ? resForm.url : ""} onChange={e => { setResForm({ ...resForm, url: e.target.value }); setResFile(null); }}
                                    className="flex-1 px-3 py-2 rounded-lg bg-white/[0.04] border border-white/[0.08] text-white text-sm focus:outline-none focus:border-gold/40" placeholder="Ou URL YouTube..." />
                                )}
                              </div>
                              {uploadingRes && <p className="text-gold/60 text-[10px] mt-1 flex items-center gap-1"><FaSpinner className="animate-spin" /> Upload en cours...</p>}
                            </div>
                          )}
                          <div>
                            <label className="block text-white/40 text-[10px] uppercase tracking-wider mb-1">Description</label>
                            <input type="text" value={resForm.description} onChange={e => setResForm({ ...resForm, description: e.target.value })}
                              className="w-full px-3 py-2 rounded-lg bg-white/[0.04] border border-white/[0.08] text-white text-sm focus:outline-none focus:border-gold/40" placeholder="Optionnel..." />
                          </div>
                          <div className="flex justify-end gap-2">
                            <button type="button" onClick={() => setShowResourceForm(false)} className="px-4 py-2 text-white/30 text-xs hover:text-white transition-all">Annuler</button>
                            <button type="submit" disabled={savingContent}
                              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gold/20 text-gold text-xs font-medium hover:bg-gold/30 transition-all disabled:opacity-50">
                              {savingContent ? <FaSpinner className="animate-spin text-[10px]" /> : <FaCheck className="text-[10px]" />} Ajouter
                            </button>
                          </div>
                        </motion.form>
                      )}
                    </AnimatePresence>
                  </div>
                ) : manageTab === "quiz" ? (
                  <div className="space-y-4">
                    {!quiz ? (
                      <div className="text-center py-10">
                        <FaClipboardList className="text-white/10 text-3xl mx-auto mb-3" />
                        <p className="text-white/20 text-sm mb-4">Aucun quiz pour cette formation</p>
                        {!showQuizForm ? (
                          <button onClick={() => { setQuizForm({ title: `Quiz - ${manageCourse.title}`, description: "", passingScore: 70 }); setShowQuizForm(true); }}
                            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gold/10 text-gold text-xs font-medium hover:bg-gold/20 transition-all mx-auto">
                            <FaPlus className="text-[10px]" /> Creer un quiz
                          </button>
                        ) : (
                          <motion.form initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                            onSubmit={handleCreateQuiz} className="p-4 rounded-xl border border-gold/10 bg-white/[0.01] space-y-3 text-left max-w-md mx-auto">
                            <div>
                              <label className="block text-white/40 text-[10px] uppercase tracking-wider mb-1">Titre *</label>
                              <input type="text" required value={quizForm.title} onChange={e => setQuizForm({ ...quizForm, title: e.target.value })}
                                className="w-full px-3 py-2 rounded-lg bg-white/[0.04] border border-white/[0.08] text-white text-sm focus:outline-none focus:border-gold/40" />
                            </div>
                            <div>
                              <label className="block text-white/40 text-[10px] uppercase tracking-wider mb-1">Score minimum (%)</label>
                              <input type="number" min={0} max={100} value={quizForm.passingScore} onChange={e => setQuizForm({ ...quizForm, passingScore: parseInt(e.target.value) || 70 })}
                                className="w-full px-3 py-2 rounded-lg bg-white/[0.04] border border-white/[0.08] text-white text-sm focus:outline-none focus:border-gold/40" />
                            </div>
                            <div className="flex justify-end gap-2">
                              <button type="button" onClick={() => setShowQuizForm(false)} className="px-4 py-2 text-white/30 text-xs hover:text-white">Annuler</button>
                              <button type="submit" disabled={savingContent}
                                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gold/20 text-gold text-xs font-medium hover:bg-gold/30 disabled:opacity-50">
                                {savingContent ? <FaSpinner className="animate-spin text-[10px]" /> : <FaCheck className="text-[10px]" />} Creer
                              </button>
                            </div>
                          </motion.form>
                        )}
                      </div>
                    ) : (
                      <>
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-white text-sm font-medium">{quiz.title}</p>
                            <p className="text-white/25 text-xs">Score minimum : {quiz.passingScore}% &middot; {quiz.questions?.length || 0} question(s)</p>
                          </div>
                          <button onClick={() => { setQForm({ question: "", options: ["", "", "", ""], correctAnswer: "", explanation: "" }); setShowQuestionForm(true); }}
                            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gold/10 text-gold text-xs font-medium hover:bg-gold/20 transition-all">
                            <FaPlus className="text-[10px]" /> Question
                          </button>
                        </div>

                        {(quiz.questions || []).map((q, idx) => (
                          <div key={q.id} className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] group">
                            <div className="flex items-start justify-between gap-3">
                              <div className="flex-1">
                                <p className="text-white text-sm font-medium mb-2">
                                  <span className="text-gold/60 mr-2">Q{idx + 1}.</span>{q.question}
                                </p>
                                <div className="grid grid-cols-2 gap-2">
                                  {(Array.isArray(q.options) ? q.options : []).map((opt, oi) => (
                                    <div key={oi} className={`px-3 py-1.5 rounded-lg text-xs ${opt === q.correctAnswer ? "bg-emerald-400/10 text-emerald-400 border border-emerald-400/20" : "bg-white/[0.02] text-white/40 border border-white/[0.04]"}`}>
                                      {opt} {opt === q.correctAnswer && <FaCheck className="inline text-[8px] ml-1" />}
                                    </div>
                                  ))}
                                </div>
                                {q.explanation && <p className="text-white/20 text-xs mt-2 italic">{q.explanation}</p>}
                              </div>
                              <button onClick={() => handleDeleteQuestion(q.id)} className="p-2 rounded-lg hover:bg-red-400/10 text-white/15 hover:text-red-400 transition-all opacity-0 group-hover:opacity-100 shrink-0">
                                <FaTrash className="text-xs" />
                              </button>
                            </div>
                          </div>
                        ))}

                        <AnimatePresence>
                          {showQuestionForm && (
                            <motion.form initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}
                              onSubmit={handleAddQuestion} className="p-4 rounded-xl border border-gold/10 bg-white/[0.01] space-y-3">
                              <div>
                                <label className="block text-white/40 text-[10px] uppercase tracking-wider mb-1">Question *</label>
                                <textarea required value={qForm.question} onChange={e => setQForm({ ...qForm, question: e.target.value })} rows={2}
                                  className="w-full px-3 py-2 rounded-lg bg-white/[0.04] border border-white/[0.08] text-white text-sm focus:outline-none focus:border-gold/40 resize-none" />
                              </div>
                              <div className="grid grid-cols-2 gap-2">
                                {qForm.options.map((opt, i) => (
                                  <div key={i}>
                                    <label className="block text-white/40 text-[10px] uppercase tracking-wider mb-1">Option {i + 1} {i < 2 ? "*" : ""}</label>
                                    <input type={i < 2 ? "text" : "text"} required={i < 2} value={opt}
                                      onChange={e => { const o = [...qForm.options]; o[i] = e.target.value; setQForm({ ...qForm, options: o }); }}
                                      className="w-full px-3 py-2 rounded-lg bg-white/[0.04] border border-white/[0.08] text-white text-sm focus:outline-none focus:border-gold/40" />
                                  </div>
                                ))}
                              </div>
                              <div>
                                <label className="block text-white/40 text-[10px] uppercase tracking-wider mb-1">Reponse correcte *</label>
                                <select required value={qForm.correctAnswer} onChange={e => setQForm({ ...qForm, correctAnswer: e.target.value })}
                                  className="w-full px-3 py-2 rounded-lg bg-white/[0.04] border border-white/[0.08] text-white text-sm focus:outline-none focus:border-gold/40">
                                  <option value="" className="bg-[#0d1a2e]">Choisir...</option>
                                  {qForm.options.filter(o => o.trim()).map((o, i) => <option key={i} value={o} className="bg-[#0d1a2e]">{o}</option>)}
                                </select>
                              </div>
                              <div>
                                <label className="block text-white/40 text-[10px] uppercase tracking-wider mb-1">Explication</label>
                                <input type="text" value={qForm.explanation} onChange={e => setQForm({ ...qForm, explanation: e.target.value })}
                                  className="w-full px-3 py-2 rounded-lg bg-white/[0.04] border border-white/[0.08] text-white text-sm focus:outline-none focus:border-gold/40" placeholder="Optionnel..." />
                              </div>
                              <div className="flex justify-end gap-2">
                                <button type="button" onClick={() => setShowQuestionForm(false)} className="px-4 py-2 text-white/30 text-xs hover:text-white">Annuler</button>
                                <button type="submit" disabled={savingContent}
                                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gold/20 text-gold text-xs font-medium hover:bg-gold/30 disabled:opacity-50">
                                  {savingContent ? <FaSpinner className="animate-spin text-[10px]" /> : <FaCheck className="text-[10px]" />} Ajouter
                                </button>
                              </div>
                            </motion.form>
                          )}
                        </AnimatePresence>
                      </>
                    )}
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-white/30 text-xs">{modules.length} module(s)</p>
                      <button onClick={() => { setModuleForm({ title: "" }); setShowModuleForm(true); }}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gold/20 text-gold text-xs font-medium hover:bg-gold/30 transition-colors">
                        <FaPlus className="text-[10px]" /> Module
                      </button>
                    </div>

                    <AnimatePresence>
                      {showModuleForm && (
                        <motion.form initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
                          onSubmit={handleAddModule} className="flex gap-2 mb-3">
                          <input type="text" required value={moduleForm.title} onChange={e => setModuleForm({ title: e.target.value })}
                            className="flex-1 px-3 py-2 rounded-lg bg-white/[0.04] border border-white/[0.08] text-white text-sm focus:outline-none focus:border-gold/40"
                            placeholder="Titre du module..." autoFocus />
                          <button type="submit" disabled={savingContent}
                            className="px-3 py-2 rounded-lg bg-gold/20 text-gold text-xs font-medium hover:bg-gold/30 disabled:opacity-50">
                            {savingContent ? <FaSpinner className="animate-spin" /> : <FaCheck />}
                          </button>
                          <button type="button" onClick={() => setShowModuleForm(false)} className="px-2 text-white/30 hover:text-white"><FaTimes className="text-xs" /></button>
                        </motion.form>
                      )}
                    </AnimatePresence>

                    {loadingModules ? (
                      <div className="text-center py-6"><FaSpinner className="text-gold/40 text-lg animate-spin mx-auto" /></div>
                    ) : modules.length === 0 ? (
                      <div className="text-center py-8">
                        <FaBookOpen className="text-white/10 text-2xl mx-auto mb-2" />
                        <p className="text-white/20 text-xs">Aucun module. Cliquez sur + Module pour commencer.</p>
                      </div>
                    ) : (
                      <div className="space-y-2 max-h-[350px] overflow-y-auto pr-1">
                        {modules.map((mod, mi) => (
                          <div key={mod.id} className="rounded-xl border border-white/[0.06] bg-white/[0.02] overflow-hidden">
                            <div className="flex items-center gap-2 px-3 py-2.5 cursor-pointer hover:bg-white/[0.03] transition-colors"
                              onClick={() => setExpandedModule(expandedModule === mod.id ? null : mod.id)}>
                              <span className="w-6 h-6 rounded-full bg-gold/15 text-gold text-[10px] font-bold flex items-center justify-center">{mi + 1}</span>
                              {editingModule === mod.id ? (
                                <input type="text" defaultValue={mod.title} autoFocus
                                  onBlur={e => { if (e.target.value.trim() && e.target.value !== mod.title) handleUpdateModule(mod.id, e.target.value); else setEditingModule(null); }}
                                  onKeyDown={e => { if (e.key === "Enter") { e.preventDefault(); (e.target as HTMLInputElement).blur(); } if (e.key === "Escape") setEditingModule(null); }}
                                  onClick={e => e.stopPropagation()}
                                  className="flex-1 px-2 py-0.5 rounded bg-white/[0.06] border border-gold/30 text-white text-sm focus:outline-none" />
                              ) : (
                                <span className="flex-1 text-white text-sm font-medium">{mod.title}</span>
                              )}
                              <span className="text-white/20 text-[10px]">{mod.lessons.length} lecon(s)</span>
                              <button onClick={e => { e.stopPropagation(); setEditingModule(mod.id); }} className="text-white/20 hover:text-gold text-xs transition-colors"><FaEdit /></button>
                              <button onClick={e => { e.stopPropagation(); setActionConfirm({ title: "Supprimer le module", message: `Supprimer "${mod.title}" et toutes ses lecons ?`, type: "danger", action: () => handleDeleteModule(mod.id) }); }}
                                className="text-white/20 hover:text-red-400 text-xs transition-colors"><FaTrash /></button>
                            </div>

                            <AnimatePresence>
                              {expandedModule === mod.id && (
                                <motion.div initial={{ height: 0 }} animate={{ height: "auto" }} exit={{ height: 0 }} className="overflow-hidden">
                                  <div className="px-3 pb-3 pt-1 border-t border-white/[0.04] space-y-1.5">
                                    {mod.lessons.map((les, li) => (
                                      <div key={les.id} className="flex items-center gap-2 px-2 py-1.5 rounded-lg bg-white/[0.02] hover:bg-white/[0.04] group">
                                        <span className="text-white/20 text-[10px] w-5">{li + 1}.</span>
                                        {editingLesson === les.id ? (
                                          <input type="text" defaultValue={les.title} autoFocus
                                            onBlur={e => { if (e.target.value.trim() && e.target.value !== les.title) handleUpdateLesson(les.id, { title: e.target.value }); else setEditingLesson(null); }}
                                            onKeyDown={e => { if (e.key === "Enter") (e.target as HTMLInputElement).blur(); if (e.key === "Escape") setEditingLesson(null); }}
                                            className="flex-1 px-2 py-0.5 rounded bg-white/[0.06] border border-gold/30 text-white text-xs focus:outline-none" />
                                        ) : (
                                          <span className="flex-1 text-white/60 text-xs">{les.title}</span>
                                        )}
                                        {les.duration && <span className="text-white/15 text-[10px]">{les.duration} min</span>}
                                        <button onClick={() => setEditingLesson(les.id)} className="opacity-0 group-hover:opacity-100 text-white/20 hover:text-gold text-[10px] transition-all"><FaEdit /></button>
                                        <button onClick={() => setActionConfirm({ title: "Supprimer la lecon", message: `Supprimer "${les.title}" ?`, type: "danger", action: () => handleDeleteLesson(les.id) })}
                                          className="opacity-0 group-hover:opacity-100 text-white/20 hover:text-red-400 text-[10px] transition-all"><FaTrash /></button>
                                      </div>
                                    ))}

                                    {showLessonForm === mod.id ? (
                                      <motion.form initial={{ opacity: 0 }} animate={{ opacity: 1 }} onSubmit={e => handleAddLesson(e, mod.id)}
                                        className="space-y-2 p-2 rounded-lg bg-white/[0.03] border border-white/[0.06]">
                                        <input type="text" required value={lessonForm.title} onChange={e => setLessonForm({ ...lessonForm, title: e.target.value })}
                                          className="w-full px-2 py-1.5 rounded bg-white/[0.04] border border-white/[0.08] text-white text-xs focus:outline-none focus:border-gold/40"
                                          placeholder="Titre de la lecon..." autoFocus />
                                        <div className="flex gap-2">
                                          <input type="text" value={lessonForm.content} onChange={e => setLessonForm({ ...lessonForm, content: e.target.value })}
                                            className="flex-1 px-2 py-1.5 rounded bg-white/[0.04] border border-white/[0.08] text-white text-xs focus:outline-none focus:border-gold/40"
                                            placeholder="Contenu / description..." />
                                          <input type="number" value={lessonForm.duration} onChange={e => setLessonForm({ ...lessonForm, duration: +e.target.value })}
                                            className="w-16 px-2 py-1.5 rounded bg-white/[0.04] border border-white/[0.08] text-white text-xs focus:outline-none focus:border-gold/40"
                                            placeholder="min" min={1} />
                                        </div>
                                        <div className="flex justify-end gap-2">
                                          <button type="button" onClick={() => setShowLessonForm(null)} className="text-white/30 text-[10px] hover:text-white">Annuler</button>
                                          <button type="submit" disabled={savingContent}
                                            className="flex items-center gap-1 px-3 py-1 rounded bg-gold/20 text-gold text-[10px] font-medium hover:bg-gold/30 disabled:opacity-50">
                                            {savingContent ? <FaSpinner className="animate-spin" /> : <FaCheck />} Ajouter
                                          </button>
                                        </div>
                                      </motion.form>
                                    ) : (
                                      <button onClick={() => { setLessonForm({ title: "", content: "", duration: 30 }); setShowLessonForm(mod.id); }}
                                        className="flex items-center gap-1 text-gold/40 hover:text-gold text-[10px] px-2 py-1 transition-colors">
                                        <FaPlus /> Ajouter une lecon
                                      </button>
                                    )}
                                  </div>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
