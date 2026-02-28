"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaPlus, FaTrash, FaSearch, FaEye, FaEyeSlash, FaTimes, FaSpinner, FaCheck, FaBookOpen, FaUsers, FaUserTie, FaExclamationTriangle } from "react-icons/fa";
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

const levelLabels: Record<string, string> = { BEGINNER: "Debutant", INTERMEDIATE: "Intermediaire", ADVANCED: "Avance", ALL_LEVELS: "Tous niveaux" };

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

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.post("/courses", {
        title: form.title, description: form.description,
        price: parseFloat(form.price) || 0, level: form.level,
        categoryId: form.categoryId, instructorId: form.instructorId || undefined,
      });
      setShowModal(false);
      setForm({ title: "", description: "", price: "", level: "ALL_LEVELS", categoryId: "", instructorId: "" });
      showToast("Formation ajoutee avec succes !");
      await fetchData();
    } catch { showToast("Erreur lors de la creation", "error"); } finally { setSaving(false); }
  };

  const handleToggle = async (id: string) => {
    setToggling(id);
    try {
      await api.patch(`/courses/${id}`, { published: !courses.find(c => c.id === id)?.published });
      await fetchData();
    } catch {} finally { setToggling(null); }
  };

  const handleDelete = async () => {
    if (!deleteConfirm) return;
    setDeleting(deleteConfirm.id);
    try {
      await api.delete(`/courses/${deleteConfirm.id}`);
      setDeleteConfirm(null);
      showToast("Formation supprimee");
      await fetchData();
    } catch { showToast("Erreur lors de la suppression", "error"); } finally { setDeleting(null); }
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
            {filtered.map((f, i) => (
              <motion.tr key={f.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.02 }}
                className="border-b border-white/[0.03] hover:bg-white/[0.02] transition-colors">
                <td className="px-5 py-4">
                  <div className="text-sm text-white font-medium">{f.title}</div>
                  <div className="text-[10px] text-white/25">{levelLabels[f.level] || f.level}</div>
                </td>
                <td className="px-5 py-4 text-sm text-white/40">{f.category?.name}</td>
                <td className="px-5 py-4 text-sm text-white/40">{f.instructor ? `${f.instructor.firstName} ${f.instructor.lastName}` : "—"}</td>
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
                    <button onClick={() => handleToggle(f.id)} disabled={toggling === f.id}
                      className="p-2 rounded-lg hover:bg-white/[0.05] text-white/30 hover:text-white transition-all disabled:opacity-40" title={f.published ? "Depublier" : "Publier"}>
                      {toggling === f.id ? <FaSpinner className="text-xs animate-spin" /> : f.published ? <FaEyeSlash className="text-xs" /> : <FaEye className="text-xs" />}
                    </button>
                    {isAdmin && (
                      <button onClick={() => setDeleteConfirm(f)} disabled={deleting === f.id}
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
                    { label: "Categorie", value: viewCourse.category?.name || "—", icon: <FaBookOpen className="text-xs text-gold" /> },
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

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {deleteConfirm && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[90] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4" onClick={() => setDeleteConfirm(null)}>
            <motion.div initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-[#0d1a2e] border border-red-500/20 rounded-2xl w-full max-w-sm shadow-2xl overflow-hidden" onClick={(e) => e.stopPropagation()}>
              <div className="p-6 text-center">
                <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center mx-auto mb-4">
                  <FaExclamationTriangle className="text-red-400 text-2xl" />
                </div>
                <h3 className="text-white font-bold text-lg mb-2">Confirmer la suppression</h3>
                <p className="text-white/40 text-sm mb-1">Vous allez supprimer :</p>
                <p className="text-gold font-semibold text-sm mb-4">{deleteConfirm.title}</p>
                {deleteConfirm._count.enrollments > 0 && (
                  <div className="bg-red-500/5 border border-red-500/10 rounded-xl p-3 mb-4">
                    <p className="text-red-400/80 text-xs"><strong>{deleteConfirm._count.enrollments}</strong> etudiant(s) inscrit(s) seront affectes</p>
                  </div>
                )}
                <p className="text-white/25 text-xs mb-6">Cette action est irreversible.</p>
                <div className="flex gap-3">
                  <button onClick={() => setDeleteConfirm(null)} className="flex-1 py-3 rounded-xl border border-white/[0.08] text-white/50 text-sm hover:text-white hover:bg-white/[0.04] transition-all">
                    Annuler
                  </button>
                  <button onClick={handleDelete} disabled={!!deleting}
                    className="flex-1 py-3 rounded-xl bg-red-500/20 border border-red-500/30 text-red-400 text-sm font-bold hover:bg-red-500/30 transition-all disabled:opacity-60 flex items-center justify-center gap-2">
                    {deleting ? <FaSpinner className="animate-spin" /> : <FaTrash className="text-xs" />}
                    Supprimer
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
    </>
  );
}
