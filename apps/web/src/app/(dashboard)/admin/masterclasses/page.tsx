"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaPlus, FaEdit, FaTrash, FaEye, FaUsers, FaCalendarAlt,
  FaSpinner, FaTimes, FaCheck, FaCrown, FaGlobe, FaMapMarkerAlt,
  FaClock, FaChair, FaDollarSign, FaArrowRight,
} from "react-icons/fa";
import api from "@/lib/api";
import { useI18n } from "@/context/i18n-context";

interface Masterclass {
  id: string; title: string; titleEn: string; slug: string;
  shortDesc: string; shortDescEn: string; description: string;
  descriptionEn: string; thumbnail: string; bannerImage: string;
  category: string; level: string; format: string; status: string;
  startDate: string; endDate: string; dailyStartTime: string; dailyEndTime: string;
  timezone: string; location: string; meetingLink: string;
  price: number; currency: string; earlyBirdPrice: number | null; earlyBirdEnd: string | null;
  maxSeats: number; seatsLeft: number; instructorId: string | null;
  programFr: string; programEn: string; whatYouLearnFr: string; whatYouLearnEn: string;
  prerequisites: string; includedFr: string; includedEn: string;
  isFeatured: boolean; certificateIncluded: boolean; replayAvailable: boolean;
  instructor?: { id: string; firstName: string; lastName: string; avatar: string | null };
  _count?: { registrations: number };
}

const statusColors: Record<string, string> = {
  DRAFT: "bg-gray-400/20 text-gray-400",
  PUBLISHED: "bg-emerald-400/20 text-emerald-400",
  ONGOING: "bg-blue-400/20 text-blue-400",
  COMPLETED: "bg-cream/20 text-cream/60",
  CANCELLED: "bg-red-400/20 text-red-400",
};

const formatLabels: Record<string, string> = { ONLINE: "En ligne", IN_PERSON: "Presentiel", HYBRID: "Hybride" };
const levelLabels: Record<string, string> = { all: "Tous niveaux", beginner: "Debutant", intermediate: "Intermediaire", advanced: "Avance" };
const categoryLabels: Record<string, string> = { general: "General", worship: "Louange", leadership: "Leadership", writing: "Ecriture", music: "Musique", ministry: "Ministere" };

const emptyForm = {
  title: "", titleEn: "", description: "", descriptionEn: "",
  shortDesc: "", shortDescEn: "", thumbnail: "", bannerImage: "",
  category: "general", level: "all", format: "ONLINE", status: "DRAFT",
  startDate: "", endDate: "", dailyStartTime: "09:00", dailyEndTime: "17:00",
  timezone: "Africa/Kinshasa", location: "", meetingLink: "",
  price: 0, currency: "USD", earlyBirdPrice: "", earlyBirdEnd: "",
  maxSeats: 50, instructorId: "",
  isFeatured: false, certificateIncluded: true, replayAvailable: true,
};

export default function AdminMasterclasses() {
  const { locale } = useI18n();
  const [items, setItems] = useState<Masterclass[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Masterclass | null>(null);
  const [form, setForm] = useState<any>({ ...emptyForm });
  const [saving, setSaving] = useState(false);
  const [showDelete, setShowDelete] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [showDetail, setShowDetail] = useState<Masterclass | null>(null);
  const [regs, setRegs] = useState<any[]>([]);
  const [loadingRegs, setLoadingRegs] = useState(false);
  const [tab, setTab] = useState<"info" | "program" | "registrations">("info");

  const [programItems, setProgramItems] = useState<any[]>([]);
  const [learnItems, setLearnItems] = useState<string[]>([]);
  const [includedItems, setIncludedItems] = useState<string[]>([]);
  const [prereqItems, setPrereqItems] = useState<string[]>([]);

  const fetch = () => {
    api.get<Masterclass[]>("/masterclasses/admin").then(setItems).catch(() => {}).finally(() => setLoading(false));
  };
  useEffect(() => { fetch(); }, []);

  const openCreate = () => {
    setEditing(null);
    setForm({ ...emptyForm });
    setProgramItems([]);
    setLearnItems([]);
    setIncludedItems([]);
    setPrereqItems([]);
    setTab("info");
    setShowModal(true);
  };

  const openEdit = (mc: Masterclass) => {
    setEditing(mc);
    setForm({
      title: mc.title, titleEn: mc.titleEn, description: mc.description, descriptionEn: mc.descriptionEn,
      shortDesc: mc.shortDesc, shortDescEn: mc.shortDescEn, thumbnail: mc.thumbnail, bannerImage: mc.bannerImage,
      category: mc.category, level: mc.level, format: mc.format, status: mc.status,
      startDate: mc.startDate?.slice(0, 16) || "", endDate: mc.endDate?.slice(0, 16) || "",
      dailyStartTime: mc.dailyStartTime, dailyEndTime: mc.dailyEndTime,
      timezone: mc.timezone, location: mc.location, meetingLink: mc.meetingLink,
      price: mc.price, currency: mc.currency,
      earlyBirdPrice: mc.earlyBirdPrice || "", earlyBirdEnd: mc.earlyBirdEnd?.slice(0, 16) || "",
      maxSeats: mc.maxSeats, instructorId: mc.instructorId || "",
      isFeatured: mc.isFeatured, certificateIncluded: mc.certificateIncluded, replayAvailable: mc.replayAvailable,
    });
    try { setProgramItems(JSON.parse(mc.programFr)); } catch { setProgramItems([]); }
    try { setLearnItems(JSON.parse(mc.whatYouLearnFr)); } catch { setLearnItems([]); }
    try { setIncludedItems(JSON.parse(mc.includedFr)); } catch { setIncludedItems([]); }
    try { setPrereqItems(JSON.parse(mc.prerequisites)); } catch { setPrereqItems([]); }
    setTab("info");
    setShowModal(true);
  };

  const viewDetail = async (mc: Masterclass) => {
    setShowDetail(mc);
    setLoadingRegs(true);
    try {
      const r = await api.get<any[]>(`/masterclasses/${mc.id}/registrations`);
      setRegs(r);
    } catch { setRegs([]); }
    finally { setLoadingRegs(false); }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const payload = {
        ...form,
        price: parseFloat(form.price) || 0,
        earlyBirdPrice: form.earlyBirdPrice ? parseFloat(form.earlyBirdPrice) : null,
        earlyBirdEnd: form.earlyBirdEnd || null,
        maxSeats: parseInt(form.maxSeats) || 50,
        instructorId: form.instructorId || null,
        programFr: programItems,
        whatYouLearnFr: learnItems,
        includedFr: includedItems,
        prerequisites: prereqItems,
      };
      if (editing) {
        await api.put(`/masterclasses/${editing.id}`, payload);
      } else {
        await api.post("/masterclasses", payload);
      }
      setShowModal(false);
      fetch();
    } catch { alert("Erreur lors de la sauvegarde"); }
    finally { setSaving(false); }
  };

  const handleDelete = async () => {
    if (!showDelete) return;
    setDeleting(true);
    try { await api.delete(`/masterclasses/${showDelete}`); setShowDelete(null); fetch(); }
    catch { alert("Erreur"); }
    finally { setDeleting(false); }
  };

  const toggleStatus = async (mc: Masterclass, newStatus: string) => {
    await api.put(`/masterclasses/${mc.id}`, { status: newStatus });
    fetch();
  };

  const daysCount = (s: string, e: string) => {
    const d = (new Date(e).getTime() - new Date(s).getTime()) / 86400000;
    return Math.max(1, Math.ceil(d));
  };

  const formatDate = (d: string) => new Date(d).toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric" });

  const inp = "w-full px-3 py-2.5 rounded-xl bg-cream/[0.04] border border-cream/10 text-cream text-sm focus:border-gold/40 outline-none";
  const lbl = "text-cream/50 text-xs font-medium mb-1.5 block";

  if (loading) return <div className="flex items-center justify-center h-64"><FaSpinner className="animate-spin text-gold text-3xl" /></div>;

  return (
    <div className="space-y-6">
      {/* Header + Stats */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-cream">Masterclasses</h1>
          <p className="text-cream/40 text-sm mt-1">Gerez vos evenements intensifs et exclusifs</p>
        </div>
        <button onClick={openCreate} className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-gold to-gold-light text-navy font-bold text-sm hover:shadow-lg hover:shadow-gold/20 transition-all">
          <FaPlus /> Nouvelle masterclass
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Total", value: items.length, color: "text-cream" },
          { label: "Publiees", value: items.filter(i => i.status === "PUBLISHED").length, color: "text-emerald-400" },
          { label: "A venir", value: items.filter(i => new Date(i.startDate) > new Date()).length, color: "text-gold" },
          { label: "Inscrits", value: items.reduce((s, i) => s + (i._count?.registrations || 0), 0), color: "text-blue-400" },
        ].map(s => (
          <div key={s.label} className="rounded-2xl bg-white/[0.02] border border-white/[0.06] p-4 text-center">
            <div className={`text-2xl font-bold ${s.color}`}>{s.value}</div>
            <div className="text-cream/40 text-xs mt-1">{s.label}</div>
          </div>
        ))}
      </div>

      {/* List */}
      <div className="space-y-3">
        {items.map(mc => (
          <motion.div key={mc.id} layout initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl border border-cream/[0.08] bg-white/[0.02] p-5 hover:bg-white/[0.04] transition-all">
            <div className="flex items-start gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                  <h3 className="text-base font-bold text-cream truncate">{mc.title}</h3>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${statusColors[mc.status]}`}>{mc.status}</span>
                  {mc.isFeatured && <span className="px-2 py-0.5 rounded-full bg-gold/20 text-gold text-[10px] font-bold flex items-center gap-1"><FaCrown className="text-[8px]" /> Featured</span>}
                  <span className="px-2 py-0.5 rounded-full bg-cream/[0.06] text-cream/40 text-[10px]">{formatLabels[mc.format]}</span>
                  <span className="px-2 py-0.5 rounded-full bg-cream/[0.06] text-cream/40 text-[10px]">{categoryLabels[mc.category] || mc.category}</span>
                </div>
                <p className="text-cream/40 text-xs mb-2 line-clamp-1">{mc.shortDesc}</p>
                <div className="flex items-center gap-4 text-xs text-cream/30">
                  <span className="flex items-center gap-1"><FaCalendarAlt /> {formatDate(mc.startDate)} - {formatDate(mc.endDate)} ({daysCount(mc.startDate, mc.endDate)}j)</span>
                  <span className="flex items-center gap-1"><FaClock /> {mc.dailyStartTime} - {mc.dailyEndTime}</span>
                  <span className="flex items-center gap-1"><FaChair /> {mc.seatsLeft}/{mc.maxSeats} places</span>
                  <span className="flex items-center gap-1"><FaUsers /> {mc._count?.registrations || 0} inscrits</span>
                  <span className="flex items-center gap-1 font-bold text-gold"><FaDollarSign />{mc.price === 0 ? "Gratuit" : `${mc.price} ${mc.currency}`}</span>
                </div>
              </div>
              <div className="flex items-center gap-1.5 flex-shrink-0">
                {mc.status === "DRAFT" && (
                  <button onClick={() => toggleStatus(mc, "PUBLISHED")} title="Publier" className="p-2 rounded-lg bg-emerald-400/10 text-emerald-400 hover:bg-emerald-400/20 transition-all text-xs">Publier</button>
                )}
                {mc.status === "PUBLISHED" && (
                  <button onClick={() => toggleStatus(mc, "DRAFT")} title="Depublier" className="p-2 rounded-lg bg-gray-400/10 text-gray-400 hover:bg-gray-400/20 transition-all text-xs">Brouillon</button>
                )}
                <button onClick={() => viewDetail(mc)} className="p-2 rounded-lg bg-cream/[0.04] text-cream/50 hover:bg-cream/10 hover:text-cream transition-all"><FaEye className="text-sm" /></button>
                <button onClick={() => openEdit(mc)} className="p-2 rounded-lg bg-cream/[0.04] text-cream/50 hover:bg-cream/10 hover:text-cream transition-all"><FaEdit className="text-sm" /></button>
                <button onClick={() => setShowDelete(mc.id)} className="p-2 rounded-lg bg-red-400/10 text-red-400/60 hover:bg-red-400/20 hover:text-red-400 transition-all"><FaTrash className="text-sm" /></button>
              </div>
            </div>
          </motion.div>
        ))}
        {items.length === 0 && <div className="text-center py-16 text-cream/30">Aucune masterclass. Creez la premiere !</div>}
      </div>

      {/* Delete Confirm */}
      <AnimatePresence>
        {showDelete && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[99] flex items-center justify-center bg-black/70 backdrop-blur-sm" onClick={() => setShowDelete(null)}>
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }} onClick={e => e.stopPropagation()}
              className="bg-[#0d1a2e] border border-cream/10 rounded-2xl p-8 max-w-sm w-full mx-4 text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-500/10 flex items-center justify-center"><FaTrash className="text-red-400 text-xl" /></div>
              <h3 className="text-cream text-lg font-bold mb-2">Supprimer cette masterclass ?</h3>
              <p className="text-cream/40 text-sm mb-6">Les inscriptions seront egalement supprimees.</p>
              <div className="flex gap-3">
                <button onClick={() => setShowDelete(null)} className="flex-1 py-2.5 rounded-xl bg-cream/[0.05] text-cream border border-cream/10 text-sm font-medium">Annuler</button>
                <button onClick={handleDelete} disabled={deleting} className="flex-1 py-2.5 rounded-xl bg-red-500 text-white text-sm font-bold disabled:opacity-60">
                  {deleting ? <FaSpinner className="animate-spin mx-auto" /> : "Supprimer"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Detail Modal */}
      <AnimatePresence>
        {showDetail && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[99] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4" onClick={() => setShowDetail(null)}>
            <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }} onClick={e => e.stopPropagation()}
              className="bg-[#0d1a2e] border border-cream/10 rounded-2xl w-full max-w-2xl max-h-[85vh] overflow-y-auto">
              <div className="sticky top-0 bg-[#0d1a2e] border-b border-cream/10 px-6 py-4 flex items-center justify-between z-10">
                <h3 className="text-cream font-bold">{showDetail.title}</h3>
                <button onClick={() => setShowDetail(null)} className="text-cream/40 hover:text-cream"><FaTimes /></button>
              </div>
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-3 gap-3">
                  <div className="bg-cream/[0.03] rounded-xl p-3 text-center">
                    <div className="text-xl font-bold text-gold">{showDetail._count?.registrations || 0}</div>
                    <div className="text-cream/40 text-xs">Inscrits</div>
                  </div>
                  <div className="bg-cream/[0.03] rounded-xl p-3 text-center">
                    <div className="text-xl font-bold text-cream">{showDetail.seatsLeft}</div>
                    <div className="text-cream/40 text-xs">Places restantes</div>
                  </div>
                  <div className="bg-cream/[0.03] rounded-xl p-3 text-center">
                    <div className="text-xl font-bold text-emerald-400">${((showDetail._count?.registrations || 0) * showDetail.price).toLocaleString()}</div>
                    <div className="text-cream/40 text-xs">Revenus estimes</div>
                  </div>
                </div>
                <h4 className="text-cream font-bold text-sm mt-4">Inscrits recents</h4>
                {loadingRegs ? <FaSpinner className="animate-spin text-gold mx-auto" /> : (
                  <div className="space-y-2">
                    {regs.map(r => (
                      <div key={r.id} className="flex items-center justify-between p-3 rounded-xl bg-cream/[0.02] border border-cream/[0.06]">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-gold/20 flex items-center justify-center text-gold text-xs font-bold">
                            {r.user.firstName?.[0]}{r.user.lastName?.[0]}
                          </div>
                          <div>
                            <div className="text-cream text-sm font-medium">{r.user.firstName} {r.user.lastName}</div>
                            <div className="text-cream/30 text-xs">{r.user.email}</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${r.status === "CONFIRMED" ? "bg-emerald-400/20 text-emerald-400" : "bg-orange-400/20 text-orange-400"}`}>{r.status}</span>
                          <span className="text-cream/30 text-xs">{new Date(r.registeredAt).toLocaleDateString("fr-FR")}</span>
                        </div>
                      </div>
                    ))}
                    {regs.length === 0 && <p className="text-cream/30 text-sm text-center py-4">Aucun inscrit</p>}
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Create/Edit Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[99] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4" onClick={() => setShowModal(false)}>
            <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }} onClick={e => e.stopPropagation()}
              className="bg-[#0d1a2e] border border-cream/10 rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-[#0d1a2e] border-b border-cream/10 px-6 py-4 flex items-center justify-between z-10">
                <h3 className="text-cream text-lg font-bold">{editing ? "Modifier la masterclass" : "Nouvelle masterclass"}</h3>
                <button onClick={() => setShowModal(false)} className="text-cream/40 hover:text-cream"><FaTimes /></button>
              </div>

              {/* Tabs */}
              <div className="px-6 pt-4 flex gap-2">
                {(["info", "program"] as const).map(t => (
                  <button key={t} onClick={() => setTab(t)}
                    className={`px-4 py-2 rounded-xl text-xs font-medium transition-all ${tab === t ? "bg-gold text-navy" : "bg-cream/[0.04] text-cream/50 hover:text-cream"}`}>
                    {t === "info" ? "Informations" : "Programme & contenu"}
                  </button>
                ))}
              </div>

              <div className="p-6 space-y-5">
                {tab === "info" && (
                  <>
                    <div className="grid grid-cols-2 gap-4">
                      <div><label className={lbl}>Titre (FR)</label><input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} className={inp} /></div>
                      <div><label className={lbl}>Title (EN)</label><input value={form.titleEn} onChange={e => setForm({ ...form, titleEn: e.target.value })} className={inp} /></div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div><label className={lbl}>Description courte (FR)</label><input value={form.shortDesc} onChange={e => setForm({ ...form, shortDesc: e.target.value })} className={inp} /></div>
                      <div><label className={lbl}>Short desc (EN)</label><input value={form.shortDescEn} onChange={e => setForm({ ...form, shortDescEn: e.target.value })} className={inp} /></div>
                    </div>
                    <div><label className={lbl}>Description complete (FR)</label><textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} rows={3} className={inp} /></div>
                    <div className="grid grid-cols-3 gap-4">
                      <div><label className={lbl}>Categorie</label>
                        <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} className={inp}>
                          {Object.entries(categoryLabels).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                        </select></div>
                      <div><label className={lbl}>Niveau</label>
                        <select value={form.level} onChange={e => setForm({ ...form, level: e.target.value })} className={inp}>
                          {Object.entries(levelLabels).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                        </select></div>
                      <div><label className={lbl}>Format</label>
                        <select value={form.format} onChange={e => setForm({ ...form, format: e.target.value })} className={inp}>
                          {Object.entries(formatLabels).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                        </select></div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div><label className={lbl}>Date debut</label><input type="datetime-local" value={form.startDate} onChange={e => setForm({ ...form, startDate: e.target.value })} className={inp} /></div>
                      <div><label className={lbl}>Date fin</label><input type="datetime-local" value={form.endDate} onChange={e => setForm({ ...form, endDate: e.target.value })} className={inp} /></div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div><label className={lbl}>Heure debut</label><input type="time" value={form.dailyStartTime} onChange={e => setForm({ ...form, dailyStartTime: e.target.value })} className={inp} /></div>
                      <div><label className={lbl}>Heure fin</label><input type="time" value={form.dailyEndTime} onChange={e => setForm({ ...form, dailyEndTime: e.target.value })} className={inp} /></div>
                    </div>
                    <div className="grid grid-cols-4 gap-4">
                      <div><label className={lbl}>Prix</label><input type="number" step="0.01" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} className={inp} /></div>
                      <div><label className={lbl}>Devise</label>
                        <select value={form.currency} onChange={e => setForm({ ...form, currency: e.target.value })} className={inp}>
                          <option value="USD">USD</option><option value="EUR">EUR</option><option value="XAF">XAF</option>
                        </select></div>
                      <div><label className={lbl}>Early bird ($)</label><input type="number" step="0.01" value={form.earlyBirdPrice} onChange={e => setForm({ ...form, earlyBirdPrice: e.target.value })} className={inp} placeholder="Optionnel" /></div>
                      <div><label className={lbl}>Fin early bird</label><input type="datetime-local" value={form.earlyBirdEnd} onChange={e => setForm({ ...form, earlyBirdEnd: e.target.value })} className={inp} /></div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div><label className={lbl}>Places max</label><input type="number" value={form.maxSeats} onChange={e => setForm({ ...form, maxSeats: e.target.value })} className={inp} /></div>
                      <div><label className={lbl}>Lieu (si presentiel)</label><input value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} className={inp} placeholder="Kinshasa, RDC" /></div>
                    </div>
                    <div><label className={lbl}>Lien meeting (Zoom/Meet/Jitsi)</label><input value={form.meetingLink} onChange={e => setForm({ ...form, meetingLink: e.target.value })} className={inp} /></div>
                    <div className="flex gap-6">
                      {[
                        { key: "isFeatured", label: "Mise en avant" },
                        { key: "certificateIncluded", label: "Certificat inclus" },
                        { key: "replayAvailable", label: "Replay disponible" },
                      ].map(c => (
                        <label key={c.key} className="flex items-center gap-2 cursor-pointer">
                          <input type="checkbox" checked={form[c.key]} onChange={e => setForm({ ...form, [c.key]: e.target.checked })} className="w-4 h-4 rounded accent-gold" />
                          <span className="text-cream/60 text-sm">{c.label}</span>
                        </label>
                      ))}
                    </div>
                  </>
                )}

                {tab === "program" && (
                  <>
                    {/* Programme par jour */}
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <label className={lbl}>Programme (par jour)</label>
                        <button onClick={() => setProgramItems([...programItems, { day: `Jour ${programItems.length + 1}`, title: "", items: [] }])}
                          className="text-xs text-gold hover:text-gold-light flex items-center gap-1"><FaPlus /> Ajouter jour</button>
                      </div>
                      {programItems.map((p, pi) => (
                        <div key={pi} className="mb-4 p-4 rounded-xl bg-cream/[0.02] border border-cream/[0.06]">
                          <div className="flex items-center gap-3 mb-3">
                            <input value={p.day} onChange={e => { const c = [...programItems]; c[pi].day = e.target.value; setProgramItems(c); }}
                              className={`${inp} w-24`} placeholder="Jour 1" />
                            <input value={p.title} onChange={e => { const c = [...programItems]; c[pi].title = e.target.value; setProgramItems(c); }}
                              className={`${inp} flex-1`} placeholder="Titre du jour" />
                            <button onClick={() => setProgramItems(programItems.filter((_, i) => i !== pi))} className="text-red-400/60 hover:text-red-400"><FaTimes /></button>
                          </div>
                          <div className="space-y-1.5 ml-4">
                            {(p.items || []).map((item: string, ii: number) => (
                              <div key={ii} className="flex items-center gap-2">
                                <span className="text-gold text-xs">-</span>
                                <input value={item} onChange={e => { const c = [...programItems]; c[pi].items[ii] = e.target.value; setProgramItems(c); }}
                                  className={`${inp} flex-1 text-xs`} />
                                <button onClick={() => { const c = [...programItems]; c[pi].items.splice(ii, 1); setProgramItems(c); }} className="text-red-400/40 hover:text-red-400"><FaTimes className="text-[10px]" /></button>
                              </div>
                            ))}
                            <button onClick={() => { const c = [...programItems]; c[pi].items = [...(c[pi].items || []), ""]; setProgramItems(c); }}
                              className="text-xs text-cream/30 hover:text-cream/60 flex items-center gap-1 mt-1"><FaPlus className="text-[8px]" /> Ajouter element</button>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Ce que vous apprendrez */}
                    <ListEditor label="Ce que vous apprendrez" items={learnItems} setItems={setLearnItems} inp={inp} />
                    <ListEditor label="Inclus dans la masterclass" items={includedItems} setItems={setIncludedItems} inp={inp} />
                    <ListEditor label="Prerequis" items={prereqItems} setItems={setPrereqItems} inp={inp} />
                  </>
                )}
              </div>

              <div className="sticky bottom-0 bg-[#0d1a2e] border-t border-cream/10 px-6 py-4 flex justify-end gap-3">
                <button onClick={() => setShowModal(false)} className="px-5 py-2.5 rounded-xl bg-cream/[0.05] border border-cream/10 text-cream text-sm font-medium">Annuler</button>
                <button onClick={handleSave} disabled={saving || !form.title || !form.startDate}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-gold to-gold-light text-navy font-bold text-sm disabled:opacity-60">
                  {saving ? <FaSpinner className="animate-spin" /> : editing ? "Enregistrer" : "Creer"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function ListEditor({ label, items, setItems, inp }: { label: string; items: string[]; setItems: (v: string[]) => void; inp: string }) {
  const [val, setVal] = useState("");
  const add = () => { if (val.trim()) { setItems([...items, val.trim()]); setVal(""); } };
  return (
    <div>
      <label className="text-cream/50 text-xs font-medium mb-1.5 block">{label}</label>
      <div className="flex gap-2 mb-2">
        <input value={val} onChange={e => setVal(e.target.value)} onKeyDown={e => e.key === "Enter" && (e.preventDefault(), add())}
          className={`${inp} flex-1`} placeholder="Ajouter..." />
        <button onClick={add} className="px-3 py-2 rounded-xl bg-gold/20 text-gold text-sm hover:bg-gold/30"><FaPlus /></button>
      </div>
      <div className="flex flex-wrap gap-1.5">
        {items.map((f, i) => (
          <span key={i} className="px-2.5 py-1 rounded-lg bg-cream/[0.04] text-cream/60 text-xs flex items-center gap-1.5">
            <FaCheck className="text-gold text-[8px]" /> {f}
            <button onClick={() => setItems(items.filter((_, idx) => idx !== i))} className="ml-1 text-red-400/60 hover:text-red-400"><FaTimes className="text-[8px]" /></button>
          </span>
        ))}
      </div>
    </div>
  );
}
