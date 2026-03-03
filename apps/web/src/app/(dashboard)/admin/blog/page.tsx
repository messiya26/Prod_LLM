"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaPlus, FaEdit, FaTrash, FaSearch, FaEye, FaEyeSlash, FaSpinner, FaTimes, FaCheck, FaImage, FaExclamationTriangle } from "react-icons/fa";
import api from "@/lib/api";

interface BlogPost { id: string; title: string; slug: string; excerpt: string; content: string; image: string; category: string; tags: string; published: boolean; createdAt: string; author: { firstName: string; lastName: string } }

const CATEGORIES = ["general", "predication", "temoignage", "enseignement", "actualite", "devotion"];

export default function AdminBlog() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState<BlogPost | null>(null);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ msg: string; type: "success" | "error" } | null>(null);
  const [confirmDel, setConfirmDel] = useState<BlogPost | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [form, setForm] = useState({ title: "", excerpt: "", content: "", image: "", category: "general", tags: "", published: false });

  const showToast = (msg: string, type: "success" | "error" = "success") => { setToast({ msg, type }); setTimeout(() => setToast(null), 3000); };

  useEffect(() => { api.get<BlogPost[]>("/blog/admin").then(setPosts).catch(() => {}).finally(() => setLoading(false)); }, []);

  const openNew = () => { setEditing(null); setForm({ title: "", excerpt: "", content: "", image: "", category: "general", tags: "", published: false }); setModal(true); };
  const openEdit = (p: BlogPost) => { setEditing(p); setForm({ title: p.title, excerpt: p.excerpt || "", content: p.content, image: p.image || "", category: p.category, tags: p.tags || "", published: p.published }); setModal(true); };

  const handleSave = async () => {
    if (!form.title || !form.content) return showToast("Titre et contenu requis", "error");
    setSaving(true);
    try {
      if (editing) {
        const updated = await api.put<BlogPost>(`/blog/${editing.id}`, form);
        setPosts(prev => prev.map(p => p.id === editing.id ? updated : p));
        showToast("Article mis a jour");
      } else {
        const created = await api.post<BlogPost>("/blog", form);
        setPosts(prev => [created, ...prev]);
        showToast("Article cree");
      }
      setModal(false);
    } catch { showToast("Erreur", "error"); }
    finally { setSaving(false); }
  };

  const handleDelete = async () => {
    if (!confirmDel) return;
    setDeleting(true);
    try { await api.delete(`/blog/${confirmDel.id}`); setPosts(prev => prev.filter(p => p.id !== confirmDel.id)); showToast("Article supprime"); }
    catch { showToast("Erreur", "error"); }
    finally { setDeleting(false); setConfirmDel(null); }
  };

  const togglePublish = async (p: BlogPost) => {
    try {
      const updated = await api.put<BlogPost>(`/blog/${p.id}`, { published: !p.published });
      setPosts(prev => prev.map(x => x.id === p.id ? updated : x));
      showToast(updated.published ? "Article publie" : "Article depublie");
    } catch { showToast("Erreur", "error"); }
  };

  const handleUploadImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const fd = new FormData();
    fd.append("file", file);
    try {
      const res = await api.upload<{ url: string }>("/upload", fd);
      setForm(f => ({ ...f, image: res.url }));
    } catch { showToast("Erreur upload", "error"); }
  };

  const filtered = posts.filter(p => p.title.toLowerCase().includes(search.toLowerCase()));

  if (loading) return <div className="flex items-center justify-center h-64"><FaSpinner className="text-gold text-2xl animate-spin" /></div>;

  return (
    <>
      <AnimatePresence>{toast && (<motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className={`fixed top-6 right-6 z-[100] flex items-center gap-3 px-6 py-4 rounded-2xl shadow-2xl border text-sm font-medium backdrop-blur-md ${toast.type === "success" ? "bg-emerald-500/15 border-emerald-500/20 text-emerald-400" : "bg-red-500/15 border-red-500/20 text-red-400"}`}>{toast.type === "success" ? <FaCheck /> : <FaTimes />}{toast.msg}</motion.div>)}</AnimatePresence>

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div><h1 className="text-xl font-bold text-white">Gestion du Blog</h1><p className="text-white/30 text-sm">{posts.length} article(s)</p></div>
          <button onClick={openNew} className="flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-gold to-gold-light text-navy text-sm font-bold hover:shadow-lg hover:shadow-gold/20 transition-all"><FaPlus className="text-xs" /> Nouvel article</button>
        </div>

        <div className="relative max-w-sm">
          <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 text-sm" />
          <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Rechercher..." className="w-full pl-11 pr-4 py-3 rounded-xl bg-white/[0.04] border border-white/[0.06] text-white placeholder:text-white/20 text-sm focus:outline-none focus:border-gold/30" />
        </div>

        <div className="grid gap-3">
          {filtered.map(p => (
            <div key={p.id} className="rounded-xl bg-white/[0.02] border border-white/[0.06] p-4 flex items-center gap-4 hover:border-gold/10 transition-all">
              {p.image ? <img src={p.image.startsWith("/") ? `http://localhost:3002${p.image}` : p.image} alt="" className="w-16 h-16 rounded-lg object-cover flex-shrink-0" /> : <div className="w-16 h-16 rounded-lg bg-white/[0.04] flex items-center justify-center text-white/15 flex-shrink-0"><FaImage className="text-xl" /></div>}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-white font-bold text-sm truncate">{p.title}</h3>
                  <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${p.published ? "bg-emerald-400/10 text-emerald-400" : "bg-amber-400/10 text-amber-400"}`}>{p.published ? "Publie" : "Brouillon"}</span>
                  <span className="px-2 py-0.5 rounded-full bg-white/[0.04] text-white/30 text-[9px]">{p.category}</span>
                </div>
                <p className="text-white/30 text-xs truncate">{p.excerpt || p.content.substring(0, 100)}</p>
                <p className="text-white/15 text-[10px] mt-1">{p.author.firstName} {p.author.lastName} • {new Date(p.createdAt).toLocaleDateString("fr-FR")}</p>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <button onClick={() => togglePublish(p)} className="text-white/20 hover:text-gold text-sm transition-colors" title={p.published ? "Depublier" : "Publier"}>{p.published ? <FaEyeSlash /> : <FaEye />}</button>
                <button onClick={() => openEdit(p)} className="text-white/20 hover:text-gold text-sm transition-colors"><FaEdit /></button>
                <button onClick={() => setConfirmDel(p)} className="text-white/20 hover:text-red-400 text-sm transition-colors"><FaTrash /></button>
              </div>
            </div>
          ))}
          {filtered.length === 0 && <div className="text-center py-16 text-white/20 text-sm">Aucun article. Creez votre premier article !</div>}
        </div>
      </div>

      {/* Delete confirm */}
      <AnimatePresence>{confirmDel && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[90] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4" onClick={() => setConfirmDel(null)}>
          <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }} className="bg-[#0d1a2e] border border-gold/10 rounded-2xl w-full max-w-md shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="p-5 border-b border-white/[0.06] flex items-center gap-3 bg-red-500/5"><div className="w-10 h-10 rounded-xl bg-red-500/15 text-red-400 flex items-center justify-center"><FaExclamationTriangle /></div><h2 className="text-white font-bold">Supprimer l&apos;article</h2></div>
            <div className="p-5"><p className="text-white/60 text-sm mb-6">Supprimer &ldquo;{confirmDel.title}&rdquo; ? Cette action est irreversible.</p>
              <div className="flex gap-3"><button onClick={() => setConfirmDel(null)} disabled={deleting} className="flex-1 py-3 rounded-xl border border-white/[0.08] text-white/50 text-sm font-medium hover:bg-white/[0.04] transition-all disabled:opacity-40">Annuler</button><button onClick={handleDelete} disabled={deleting} className="flex-1 py-3 rounded-xl bg-red-500 text-white text-sm font-bold flex items-center justify-center gap-2 disabled:opacity-60">{deleting ? <FaSpinner className="animate-spin" /> : <FaCheck className="text-xs" />}{deleting ? "Suppression..." : "Confirmer"}</button></div>
            </div>
          </motion.div>
        </motion.div>
      )}</AnimatePresence>

      {/* Editor Modal */}
      <AnimatePresence>{modal && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[80] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" onClick={() => !saving && setModal(false)}>
          <motion.div initial={{ scale: 0.92, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.92 }} className="bg-[#0d1a2e] border border-gold/10 rounded-2xl w-full max-w-2xl shadow-2xl max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="p-5 border-b border-white/[0.06] flex items-center justify-between sticky top-0 bg-[#0d1a2e] z-10">
              <h2 className="text-white font-bold flex items-center gap-2"><FaEdit className="text-gold text-sm" /> {editing ? "Modifier l'article" : "Nouvel article"}</h2>
              <button onClick={() => setModal(false)} className="text-white/30 hover:text-white"><FaTimes /></button>
            </div>
            <div className="p-5 space-y-4">
              <div><label className="block text-white/40 text-xs mb-1.5 uppercase">Titre</label><input value={form.title} onChange={e => setForm(f => ({...f, title: e.target.value}))} className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white text-sm focus:outline-none focus:border-gold/40" placeholder="Titre de l'article" /></div>
              <div><label className="block text-white/40 text-xs mb-1.5 uppercase">Resume</label><input value={form.excerpt} onChange={e => setForm(f => ({...f, excerpt: e.target.value}))} className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white text-sm focus:outline-none focus:border-gold/40" placeholder="Resume court" /></div>
              <div><label className="block text-white/40 text-xs mb-1.5 uppercase">Contenu</label><textarea value={form.content} onChange={e => setForm(f => ({...f, content: e.target.value}))} rows={8} className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white text-sm focus:outline-none focus:border-gold/40 resize-y" placeholder="Contenu de l'article..." /></div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-white/40 text-xs mb-1.5 uppercase">Categorie</label>
                  <select value={form.category} onChange={e => setForm(f => ({...f, category: e.target.value}))} className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white text-sm focus:outline-none focus:border-gold/40">
                    {CATEGORIES.map(c => <option key={c} value={c} className="bg-[#0d1a2e]">{c.charAt(0).toUpperCase() + c.slice(1)}</option>)}
                  </select>
                </div>
                <div><label className="block text-white/40 text-xs mb-1.5 uppercase">Tags (virgule)</label><input value={form.tags} onChange={e => setForm(f => ({...f, tags: e.target.value}))} className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white text-sm focus:outline-none focus:border-gold/40" placeholder="foi, priere, ..." /></div>
              </div>
              <div><label className="block text-white/40 text-xs mb-1.5 uppercase">Image</label>
                <div className="flex items-center gap-3">
                  <input type="file" accept="image/*" onChange={handleUploadImage} className="text-xs text-white/40 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:bg-gold/10 file:text-gold file:text-xs file:font-bold file:cursor-pointer" />
                  {form.image && <img src={form.image.startsWith("/") ? `http://localhost:3002${form.image}` : form.image} alt="" className="w-12 h-12 rounded-lg object-cover" />}
                </div>
              </div>
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" checked={form.published} onChange={e => setForm(f => ({...f, published: e.target.checked}))} className="sr-only peer" />
                <div className="w-10 h-5 bg-white/[0.08] rounded-full peer-checked:bg-gold/30 relative transition-all"><div className={`absolute top-0.5 w-4 h-4 rounded-full transition-all ${form.published ? "left-5 bg-gold" : "left-0.5 bg-white/30"}`} /></div>
                <span className="text-white/50 text-sm">Publier immediatement</span>
              </label>
              <button onClick={handleSave} disabled={saving} className="w-full py-3 rounded-xl bg-gradient-to-r from-gold to-gold-light text-navy font-bold text-sm disabled:opacity-60 flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-gold/20 transition-all">
                {saving ? <><FaSpinner className="animate-spin" /> Enregistrement...</> : <><FaCheck className="text-xs" /> {editing ? "Mettre a jour" : "Creer l'article"}</>}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}</AnimatePresence>
    </>
  );
}
