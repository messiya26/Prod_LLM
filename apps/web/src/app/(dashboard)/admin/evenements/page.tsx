"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaPlus, FaEdit, FaTrash, FaSearch, FaEye, FaEyeSlash, FaSpinner, FaTimes, FaCheck, FaCalendarAlt, FaMapMarkerAlt, FaVideo, FaUsers, FaExclamationTriangle } from "react-icons/fa";
import api from "@/lib/api";

interface Evt { id: string; title: string; slug: string; description: string; image: string; location: string; isOnline: boolean; link: string; date: string; endDate: string; price: number; capacity: number; registrations: number; published: boolean; createdAt: string; author: { firstName: string; lastName: string } }

export default function AdminEvenements() {
  const [events, setEvents] = useState<Evt[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState<Evt | null>(null);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ msg: string; type: "success" | "error" } | null>(null);
  const [confirmDel, setConfirmDel] = useState<Evt | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [form, setForm] = useState({ title: "", description: "", image: "", location: "", isOnline: false, link: "", date: "", endDate: "", price: 0, capacity: 0, published: false });

  const showToast = (msg: string, type: "success" | "error" = "success") => { setToast({ msg, type }); setTimeout(() => setToast(null), 3000); };

  useEffect(() => { api.get<Evt[]>("/events/admin").then(setEvents).catch(() => {}).finally(() => setLoading(false)); }, []);

  const openNew = () => { setEditing(null); setForm({ title: "", description: "", image: "", location: "", isOnline: false, link: "", date: "", endDate: "", price: 0, capacity: 0, published: false }); setModal(true); };
  const openEdit = (e: Evt) => {
    setEditing(e);
    setForm({ title: e.title, description: e.description, image: e.image || "", location: e.location || "", isOnline: e.isOnline, link: e.link || "", date: e.date ? new Date(e.date).toISOString().slice(0, 16) : "", endDate: e.endDate ? new Date(e.endDate).toISOString().slice(0, 16) : "", price: e.price, capacity: e.capacity || 0, published: e.published });
    setModal(true);
  };

  const handleSave = async () => {
    if (!form.title || !form.description || !form.date) return showToast("Titre, description et date requis", "error");
    setSaving(true);
    try {
      const payload = { ...form, price: Number(form.price), capacity: Number(form.capacity) || null };
      if (editing) {
        const updated = await api.put<Evt>(`/events/${editing.id}`, payload);
        setEvents(prev => prev.map(e => e.id === editing.id ? updated : e));
        showToast("Evenement mis a jour");
      } else {
        const created = await api.post<Evt>("/events", payload);
        setEvents(prev => [created, ...prev]);
        showToast("Evenement cree");
      }
      setModal(false);
    } catch { showToast("Erreur", "error"); }
    finally { setSaving(false); }
  };

  const handleDelete = async () => {
    if (!confirmDel) return;
    setDeleting(true);
    try { await api.delete(`/events/${confirmDel.id}`); setEvents(prev => prev.filter(e => e.id !== confirmDel.id)); showToast("Evenement supprime"); }
    catch { showToast("Erreur", "error"); }
    finally { setDeleting(false); setConfirmDel(null); }
  };

  const togglePublish = async (e: Evt) => {
    try {
      const updated = await api.put<Evt>(`/events/${e.id}`, { published: !e.published });
      setEvents(prev => prev.map(x => x.id === e.id ? updated : x));
      showToast(updated.published ? "Publie" : "Depublie");
    } catch { showToast("Erreur", "error"); }
  };

  const filtered = events.filter(e => e.title.toLowerCase().includes(search.toLowerCase()));

  if (loading) return <div className="flex items-center justify-center h-64"><FaSpinner className="text-gold text-2xl animate-spin" /></div>;

  return (
    <>
      <AnimatePresence>{toast && (<motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className={`fixed top-6 right-6 z-[100] flex items-center gap-3 px-6 py-4 rounded-2xl shadow-2xl border text-sm font-medium backdrop-blur-md ${toast.type === "success" ? "bg-emerald-500/15 border-emerald-500/20 text-emerald-400" : "bg-red-500/15 border-red-500/20 text-red-400"}`}>{toast.type === "success" ? <FaCheck /> : <FaTimes />}{toast.msg}</motion.div>)}</AnimatePresence>

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div><h1 className="text-xl font-bold text-white">Gestion des Evenements</h1><p className="text-white/30 text-sm">{events.length} evenement(s)</p></div>
          <button onClick={openNew} className="flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-gold to-gold-light text-navy text-sm font-bold hover:shadow-lg hover:shadow-gold/20 transition-all"><FaPlus className="text-xs" /> Nouvel evenement</button>
        </div>

        <div className="relative max-w-sm">
          <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 text-sm" />
          <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Rechercher..." className="w-full pl-11 pr-4 py-3 rounded-xl bg-white/[0.04] border border-white/[0.06] text-white placeholder:text-white/20 text-sm focus:outline-none focus:border-gold/30" />
        </div>

        <div className="grid gap-3">
          {filtered.map(e => (
            <div key={e.id} className="rounded-xl bg-white/[0.02] border border-white/[0.06] p-4 flex items-center gap-4 hover:border-gold/10 transition-all">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-gold/10 to-gold/5 flex flex-col items-center justify-center flex-shrink-0">
                <span className="text-gold font-bold text-sm">{new Date(e.date).getDate()}</span>
                <span className="text-gold/50 text-[9px] uppercase">{new Date(e.date).toLocaleString("fr-FR", { month: "short" })}</span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-white font-bold text-sm truncate">{e.title}</h3>
                  <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${e.published ? "bg-emerald-400/10 text-emerald-400" : "bg-amber-400/10 text-amber-400"}`}>{e.published ? "Publie" : "Brouillon"}</span>
                  {e.isOnline && <span className="px-2 py-0.5 rounded-full bg-blue-400/10 text-blue-400 text-[9px] flex items-center gap-1"><FaVideo className="text-[7px]" /> En ligne</span>}
                </div>
                <div className="flex items-center gap-3 text-white/30 text-[10px]">
                  <span className="flex items-center gap-1"><FaCalendarAlt className="text-[8px]" /> {new Date(e.date).toLocaleDateString("fr-FR")}</span>
                  {e.location && <span className="flex items-center gap-1"><FaMapMarkerAlt className="text-[8px]" /> {e.location}</span>}
                  <span className="flex items-center gap-1"><FaUsers className="text-[8px]" /> {e.registrations}/{e.capacity || "∞"}</span>
                  {e.price > 0 && <span className="text-gold font-bold">{e.price.toLocaleString()} FCFA</span>}
                </div>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <button onClick={() => togglePublish(e)} className="text-white/20 hover:text-gold text-sm transition-colors">{e.published ? <FaEyeSlash /> : <FaEye />}</button>
                <button onClick={() => openEdit(e)} className="text-white/20 hover:text-gold text-sm transition-colors"><FaEdit /></button>
                <button onClick={() => setConfirmDel(e)} className="text-white/20 hover:text-red-400 text-sm transition-colors"><FaTrash /></button>
              </div>
            </div>
          ))}
          {filtered.length === 0 && <div className="text-center py-16 text-white/20 text-sm">Aucun evenement. Planifiez votre premier evenement !</div>}
        </div>
      </div>

      {/* Delete confirm */}
      <AnimatePresence>{confirmDel && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[90] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4" onClick={() => setConfirmDel(null)}>
          <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }} className="bg-[#0d1a2e] border border-gold/10 rounded-2xl w-full max-w-md shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="p-5 border-b border-white/[0.06] flex items-center gap-3 bg-red-500/5"><div className="w-10 h-10 rounded-xl bg-red-500/15 text-red-400 flex items-center justify-center"><FaExclamationTriangle /></div><h2 className="text-white font-bold">Supprimer l&apos;evenement</h2></div>
            <div className="p-5"><p className="text-white/60 text-sm mb-6">Supprimer &ldquo;{confirmDel.title}&rdquo; ?</p>
              <div className="flex gap-3"><button onClick={() => setConfirmDel(null)} disabled={deleting} className="flex-1 py-3 rounded-xl border border-white/[0.08] text-white/50 text-sm font-medium transition-all disabled:opacity-40">Annuler</button><button onClick={handleDelete} disabled={deleting} className="flex-1 py-3 rounded-xl bg-red-500 text-white text-sm font-bold flex items-center justify-center gap-2 disabled:opacity-60">{deleting ? <FaSpinner className="animate-spin" /> : <FaCheck className="text-xs" />} Confirmer</button></div>
            </div>
          </motion.div>
        </motion.div>
      )}</AnimatePresence>

      {/* Editor Modal */}
      <AnimatePresence>{modal && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[80] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" onClick={() => !saving && setModal(false)}>
          <motion.div initial={{ scale: 0.92, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.92 }} className="bg-[#0d1a2e] border border-gold/10 rounded-2xl w-full max-w-2xl shadow-2xl max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="p-5 border-b border-white/[0.06] flex items-center justify-between sticky top-0 bg-[#0d1a2e] z-10">
              <h2 className="text-white font-bold flex items-center gap-2"><FaCalendarAlt className="text-gold text-sm" /> {editing ? "Modifier" : "Nouvel evenement"}</h2>
              <button onClick={() => setModal(false)} className="text-white/30 hover:text-white"><FaTimes /></button>
            </div>
            <div className="p-5 space-y-4">
              <div><label className="block text-white/40 text-xs mb-1.5 uppercase">Titre</label><input value={form.title} onChange={e => setForm(f => ({...f, title: e.target.value}))} className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white text-sm focus:outline-none focus:border-gold/40" /></div>
              <div><label className="block text-white/40 text-xs mb-1.5 uppercase">Description</label><textarea value={form.description} onChange={e => setForm(f => ({...f, description: e.target.value}))} rows={4} className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white text-sm focus:outline-none focus:border-gold/40 resize-y" /></div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-white/40 text-xs mb-1.5 uppercase">Date debut</label><input type="datetime-local" value={form.date} onChange={e => setForm(f => ({...f, date: e.target.value}))} className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white text-sm focus:outline-none focus:border-gold/40" /></div>
                <div><label className="block text-white/40 text-xs mb-1.5 uppercase">Date fin</label><input type="datetime-local" value={form.endDate} onChange={e => setForm(f => ({...f, endDate: e.target.value}))} className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white text-sm focus:outline-none focus:border-gold/40" /></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-white/40 text-xs mb-1.5 uppercase">Lieu</label><input value={form.location} onChange={e => setForm(f => ({...f, location: e.target.value}))} className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white text-sm focus:outline-none focus:border-gold/40" placeholder="Kinshasa, RDC" /></div>
                <div><label className="block text-white/40 text-xs mb-1.5 uppercase">Lien (si en ligne)</label><input value={form.link} onChange={e => setForm(f => ({...f, link: e.target.value}))} className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white text-sm focus:outline-none focus:border-gold/40" placeholder="https://..." /></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-white/40 text-xs mb-1.5 uppercase">Prix (FCFA)</label><input type="number" value={form.price} onChange={e => setForm(f => ({...f, price: Number(e.target.value)}))} className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white text-sm focus:outline-none focus:border-gold/40" /></div>
                <div><label className="block text-white/40 text-xs mb-1.5 uppercase">Capacite</label><input type="number" value={form.capacity} onChange={e => setForm(f => ({...f, capacity: Number(e.target.value)}))} className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white text-sm focus:outline-none focus:border-gold/40" placeholder="0 = illimite" /></div>
              </div>
              <div className="flex gap-4">
                <label className="flex items-center gap-3 cursor-pointer"><input type="checkbox" checked={form.isOnline} onChange={e => setForm(f => ({...f, isOnline: e.target.checked}))} className="sr-only peer" /><div className="w-10 h-5 bg-white/[0.08] rounded-full peer-checked:bg-blue-400/30 relative transition-all"><div className={`absolute top-0.5 w-4 h-4 rounded-full transition-all ${form.isOnline ? "left-5 bg-blue-400" : "left-0.5 bg-white/30"}`} /></div><span className="text-white/50 text-sm">En ligne</span></label>
                <label className="flex items-center gap-3 cursor-pointer"><input type="checkbox" checked={form.published} onChange={e => setForm(f => ({...f, published: e.target.checked}))} className="sr-only peer" /><div className="w-10 h-5 bg-white/[0.08] rounded-full peer-checked:bg-gold/30 relative transition-all"><div className={`absolute top-0.5 w-4 h-4 rounded-full transition-all ${form.published ? "left-5 bg-gold" : "left-0.5 bg-white/30"}`} /></div><span className="text-white/50 text-sm">Publier</span></label>
              </div>
              <button onClick={handleSave} disabled={saving} className="w-full py-3 rounded-xl bg-gradient-to-r from-gold to-gold-light text-navy font-bold text-sm disabled:opacity-60 flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-gold/20 transition-all">
                {saving ? <><FaSpinner className="animate-spin" /> Enregistrement...</> : <><FaCheck className="text-xs" /> {editing ? "Mettre a jour" : "Creer l'evenement"}</>}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}</AnimatePresence>
    </>
  );
}
