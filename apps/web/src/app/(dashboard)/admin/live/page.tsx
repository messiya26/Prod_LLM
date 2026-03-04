"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaVideo, FaPlay, FaUsers, FaClock, FaPlus, FaTimes, FaSpinner, FaCheck,
  FaStop, FaBan, FaTrash, FaExternalLinkAlt, FaChevronLeft, FaChevronRight,
  FaDesktop, FaExclamationTriangle, FaBook
} from "react-icons/fa";
import { SiZoom, SiGooglemeet } from "react-icons/si";
import { useAuth } from "@/context/auth-context";
import api from "@/lib/api";

interface LiveSession {
  id: string; title: string; description?: string;
  platform: "JITSI" | "ZOOM" | "GOOGLE_MEET";
  status: "SCHEDULED" | "LIVE" | "ENDED" | "CANCELLED";
  meetingUrl?: string; roomName: string; hostId: string;
  courseId?: string; courseName?: string; maxAttendees: number;
  scheduledAt: string; startedAt?: string; endedAt?: string;
  duration?: number; replayUrl?: string;
  _count: { attendees: number };
}

interface CourseOption { id: string; title: string; }

const platformLabel: Record<string, string> = { JITSI: "Jitsi Meet", ZOOM: "Zoom", GOOGLE_MEET: "Google Meet" };
const platformIcon: Record<string, React.ReactNode> = {
  JITSI: <FaVideo className="text-blue-400" />,
  ZOOM: <SiZoom className="text-blue-500" />,
  GOOGLE_MEET: <SiGooglemeet className="text-green-400" />,
};
const statusColors: Record<string, string> = {
  SCHEDULED: "bg-amber-400/10 text-amber-400",
  LIVE: "bg-red-500/20 text-red-400",
  ENDED: "bg-white/[0.06] text-white/40",
  CANCELLED: "bg-red-400/5 text-red-400/50",
};

const ITEMS_PER_PAGE = 8;

export default function AdminLive() {
  const { user } = useAuth();
  const [sessions, setSessions] = useState<LiveSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"upcoming" | "past">("upcoming");
  const [showModal, setShowModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<LiveSession | null>(null);
  const [toast, setToast] = useState<{ msg: string; type: "success" | "error" } | null>(null);
  const [page, setPage] = useState(1);
  const [courses, setCourses] = useState<CourseOption[]>([]);
  const [form, setForm] = useState({
    title: "", description: "", platform: "JITSI",
    scheduledAt: "", maxAttendees: 100, meetingUrl: "", courseId: "",
  });

  const showToast = (msg: string, type: "success" | "error" = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  const fetchSessions = useCallback(async () => {
    try {
      const data = await api.get<LiveSession[]>("/live");
      setSessions(Array.isArray(data) ? data : []);
    } catch {} finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchSessions(); }, [fetchSessions]);

  useEffect(() => {
    api.get<CourseOption[]>("/courses?published=true").then(data => {
      if (Array.isArray(data)) setCourses(data);
    }).catch(() => {});
  }, []);

  const upcoming = sessions.filter(s => s.status === "SCHEDULED" || s.status === "LIVE");
  const past = sessions.filter(s => s.status === "ENDED" || s.status === "CANCELLED");
  const current = activeTab === "upcoming" ? upcoming : past;
  const totalPages = Math.max(1, Math.ceil(current.length / ITEMS_PER_PAGE));
  const paged = current.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  useEffect(() => { setPage(1); }, [activeTab]);

  const stats = {
    total: upcoming.length,
    live: sessions.filter(s => s.status === "LIVE").length,
    totalViewers: sessions.reduce((s, x) => s + x._count.attendees, 0),
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.post("/live", {
        title: form.title,
        description: form.description || undefined,
        platform: form.platform,
        scheduledAt: new Date(form.scheduledAt).toISOString(),
        maxAttendees: form.maxAttendees,
        meetingUrl: form.meetingUrl || undefined,
        courseId: form.courseId || undefined,
      });
      setShowModal(false);
      setForm({ title: "", description: "", platform: "JITSI", scheduledAt: "", maxAttendees: 100, meetingUrl: "", courseId: "" });
      showToast("Session programmee !");
      await fetchSessions();
    } catch { showToast("Erreur lors de la creation", "error"); } finally { setSaving(false); }
  };

  const handleStart = async (id: string) => {
    setActionLoading(id);
    try {
      await api.post(`/live/${id}/start`, {});
      showToast("Session demarree !");
      await fetchSessions();
    } catch { showToast("Erreur", "error"); } finally { setActionLoading(null); }
  };

  const handleEnd = async (id: string) => {
    setActionLoading(id);
    try {
      await api.post(`/live/${id}/end`, {});
      showToast("Session terminee");
      await fetchSessions();
    } catch { showToast("Erreur", "error"); } finally { setActionLoading(null); }
  };

  const handleCancel = async (id: string) => {
    setActionLoading(id);
    try {
      await api.post(`/live/${id}/cancel`, {});
      showToast("Session annulee");
      await fetchSessions();
    } catch { showToast("Erreur", "error"); } finally { setActionLoading(null); }
  };

  const handleDelete = async () => {
    if (!deleteConfirm) return;
    setActionLoading(deleteConfirm.id);
    try {
      await api.delete(`/live/${deleteConfirm.id}`);
      setDeleteConfirm(null);
      showToast("Session supprimee");
      await fetchSessions();
    } catch { showToast("Erreur", "error"); } finally { setActionLoading(null); }
  };

  const formatDate = (d: string) => {
    const date = new Date(d);
    return date.toLocaleDateString("fr-FR", { day: "2-digit", month: "short", year: "numeric" });
  };
  const formatTime = (d: string) => new Date(d).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });

  if (loading) return (
    <div className="flex items-center justify-center h-64"><FaSpinner className="text-gold text-2xl animate-spin" /></div>
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
          <h1 className="text-xl font-bold text-white">Sessions Live</h1>
          <p className="text-white/30 text-sm">Jitsi Meet &middot; Zoom &middot; Google Meet</p>
        </div>
        <button onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-5 py-3 rounded-xl bg-red-500 text-white text-sm font-bold hover:bg-red-400 transition-all shadow-lg shadow-red-500/20 active:scale-95">
          <FaPlus className="text-xs" /> Programmer une session
        </button>
      </div>

      <div className="grid md:grid-cols-3 gap-4 mb-6">
        {[
          { icon: <FaVideo />, label: "A venir", value: stats.total, color: "bg-amber-500" },
          { icon: <FaPlay />, label: "En direct", value: stats.live, color: "bg-red-500" },
          { icon: <FaUsers />, label: "Participants total", value: stats.totalViewers, color: "bg-blue-500" },
        ].map(s => (
          <div key={s.label} className="rounded-2xl bg-white/[0.02] border border-white/[0.06] p-5">
            <div className={`w-10 h-10 rounded-xl ${s.color} flex items-center justify-center text-white text-sm mb-3`}>{s.icon}</div>
            <div className="text-xl font-bold text-white">{s.value}</div>
            <div className="text-white/30 text-xs mt-1">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="flex items-center gap-2 bg-white/[0.02] rounded-xl p-1 w-fit border border-white/[0.06] mb-6">
        {(["upcoming", "past"] as const).map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)}
            className={`px-5 py-2.5 rounded-lg text-sm font-medium transition-all ${activeTab === tab ? "bg-gold text-navy" : "text-white/40 hover:text-white/70"}`}>
            {tab === "upcoming" ? `A venir (${upcoming.length})` : `Historique (${past.length})`}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {paged.length === 0 && (
          <div className="text-center py-16">
            <FaVideo className="text-white/10 text-4xl mx-auto mb-3" />
            <p className="text-white/20 text-sm">{activeTab === "upcoming" ? "Aucune session programmee" : "Aucun historique"}</p>
          </div>
        )}
        {paged.map((s, i) => (
          <motion.div key={s.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}
            className={`rounded-2xl bg-white/[0.02] border p-5 flex items-center justify-between hover:border-gold/20 transition-all ${
              s.status === "LIVE" ? "border-red-500/30 bg-red-500/[0.03]" : "border-white/[0.06]"
            }`}>
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                s.status === "LIVE" ? "bg-red-500/20 animate-pulse" : "bg-white/[0.04]"
              }`}>
                {platformIcon[s.platform]}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold text-white">{s.title}</h3>
                  <span className={`px-2 py-0.5 rounded-full text-[9px] font-medium ${statusColors[s.status]}`}>
                    {s.status === "LIVE" ? "EN DIRECT" : s.status === "SCHEDULED" ? "Programme" : s.status === "ENDED" ? "Termine" : "Annule"}
                  </span>
                </div>
                <div className="flex items-center gap-3 mt-1 text-[10px] text-white/30">
                  <span>{platformLabel[s.platform]}</span>
                  <span>{formatDate(s.scheduledAt)}</span>
                  <span>{formatTime(s.scheduledAt)}</span>
                  <span className="flex items-center gap-1"><FaUsers className="text-[8px]" />{s._count.attendees}/{s.maxAttendees}</span>
                  {s.duration && <span><FaClock className="inline text-[8px] mr-0.5" />{s.duration} min</span>}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {s.status === "SCHEDULED" && (
                <>
                  <button onClick={() => handleStart(s.id)} disabled={actionLoading === s.id}
                    className="px-4 py-2 rounded-lg bg-red-500/10 text-red-400 text-xs hover:bg-red-500/20 transition-all flex items-center gap-1.5 disabled:opacity-50">
                    {actionLoading === s.id ? <FaSpinner className="animate-spin text-[10px]" /> : <FaPlay className="text-[8px]" />} Lancer
                  </button>
                  <button onClick={() => handleCancel(s.id)} disabled={actionLoading === s.id}
                    className="px-3 py-2 rounded-lg bg-white/[0.04] text-white/30 text-xs hover:text-amber-400 hover:bg-amber-400/10 transition-all disabled:opacity-50">
                    <FaBan className="text-xs" />
                  </button>
                </>
              )}
              {s.status === "LIVE" && (
                <>
                  {s.meetingUrl && (
                    <a href={s.meetingUrl} target="_blank" rel="noopener noreferrer"
                      className="px-4 py-2 rounded-lg bg-blue-500/10 text-blue-400 text-xs hover:bg-blue-500/20 transition-all flex items-center gap-1.5">
                      <FaExternalLinkAlt className="text-[8px]" /> Rejoindre
                    </a>
                  )}
                  <button onClick={() => handleEnd(s.id)} disabled={actionLoading === s.id}
                    className="px-4 py-2 rounded-lg bg-red-500/10 text-red-400 text-xs hover:bg-red-500/20 transition-all flex items-center gap-1.5 disabled:opacity-50">
                    {actionLoading === s.id ? <FaSpinner className="animate-spin text-[10px]" /> : <FaStop className="text-[8px]" />} Terminer
                  </button>
                </>
              )}
              {s.status === "ENDED" && s.replayUrl && (
                <a href={s.replayUrl} target="_blank" rel="noopener noreferrer"
                  className="px-4 py-2 rounded-lg bg-gold/10 text-gold text-xs hover:bg-gold/20 transition-all flex items-center gap-1.5">
                  <FaPlay className="text-[8px]" /> Replay
                </a>
              )}
              <button onClick={() => setDeleteConfirm(s)}
                className="p-2 rounded-lg hover:bg-red-400/10 text-white/15 hover:text-red-400 transition-all">
                <FaTrash className="text-xs" />
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-4">
          <p className="text-white/30 text-xs">Page {page}/{totalPages}</p>
          <div className="flex items-center gap-1">
            <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
              className="p-2 rounded-lg hover:bg-white/[0.05] text-white/30 hover:text-white transition-all disabled:opacity-20">
              <FaChevronLeft className="text-xs" />
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(n => (
              <button key={n} onClick={() => setPage(n)}
                className={`w-8 h-8 rounded-lg text-xs font-medium transition-all ${n === page ? "bg-gold/20 text-gold border border-gold/30" : "text-white/30 hover:bg-white/[0.05]"}`}>
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

      {/* Create Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" onClick={() => !saving && setShowModal(false)}>
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-[#0d1a2e] border border-gold/10 rounded-2xl w-full max-w-lg shadow-2xl" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.06]">
                <h2 className="text-lg font-bold text-white">Programmer une session live</h2>
                <button onClick={() => setShowModal(false)} className="text-white/30 hover:text-white"><FaTimes /></button>
              </div>
              <form onSubmit={handleCreate} className="p-6 space-y-4">
                <div>
                  <label className="block text-white/50 text-xs font-medium mb-1.5 uppercase tracking-wider">Titre *</label>
                  <input type="text" required value={form.title} onChange={e => setForm({ ...form, title: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white placeholder:text-white/20 text-sm focus:outline-none focus:border-gold/40 transition-all"
                    placeholder="Ex: Masterclass Leadership" />
                </div>
                <div>
                  <label className="block text-white/50 text-xs font-medium mb-1.5 uppercase tracking-wider">Description</label>
                  <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} rows={2}
                    className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white placeholder:text-white/20 text-sm focus:outline-none focus:border-gold/40 transition-all resize-none"
                    placeholder="Optionnel..." />
                </div>
                <div>
                  <label className="block text-white/50 text-xs font-medium mb-1.5 uppercase tracking-wider">Formation liee</label>
                  <div className="relative">
                    <FaBook className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 text-xs" />
                    <select value={form.courseId} onChange={e => setForm({ ...form, courseId: e.target.value })}
                      className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white text-sm focus:outline-none focus:border-gold/40 transition-all appearance-none">
                      <option value="" className="bg-[#0d1a2e]">Aucune (session libre)</option>
                      {courses.map(c => (
                        <option key={c.id} value={c.id} className="bg-[#0d1a2e]">{c.title}</option>
                      ))}
                    </select>
                  </div>
                  <p className="text-white/20 text-[10px] mt-1.5">Les etudiants inscrits seront notifies automatiquement</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-white/50 text-xs font-medium mb-1.5 uppercase tracking-wider">Plateforme *</label>
                    <div className="flex gap-2">
                      {(["JITSI", "ZOOM", "GOOGLE_MEET"] as const).map(p => (
                        <button key={p} type="button" onClick={() => setForm({ ...form, platform: p, meetingUrl: "" })}
                          className={`flex-1 flex flex-col items-center gap-1.5 py-3 rounded-xl border text-xs font-medium transition-all ${
                            form.platform === p ? "border-gold/40 bg-gold/10 text-gold" : "border-white/[0.06] bg-white/[0.02] text-white/30 hover:border-white/10"
                          }`}>
                          <span className="text-base">{platformIcon[p]}</span>
                          <span className="text-[9px]">{p === "GOOGLE_MEET" ? "Meet" : p === "JITSI" ? "Jitsi" : "Zoom"}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="block text-white/50 text-xs font-medium mb-1.5 uppercase tracking-wider">Max participants</label>
                    <input type="number" min={1} value={form.maxAttendees} onChange={e => setForm({ ...form, maxAttendees: parseInt(e.target.value) || 100 })}
                      className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white text-sm focus:outline-none focus:border-gold/40 transition-all" />
                  </div>
                </div>
                <div>
                  <label className="block text-white/50 text-xs font-medium mb-1.5 uppercase tracking-wider">Date et heure *</label>
                  <input type="datetime-local" required value={form.scheduledAt} onChange={e => setForm({ ...form, scheduledAt: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white text-sm focus:outline-none focus:border-gold/40 transition-all" />
                </div>
                {form.platform !== "JITSI" && (
                  <div>
                    <label className="block text-white/50 text-xs font-medium mb-1.5 uppercase tracking-wider">
                      Lien {form.platform === "ZOOM" ? "Zoom" : "Google Meet"} *
                    </label>
                    <input type="url" required={form.platform !== "JITSI"} value={form.meetingUrl}
                      onChange={e => setForm({ ...form, meetingUrl: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white placeholder:text-white/20 text-sm focus:outline-none focus:border-gold/40 transition-all"
                      placeholder={form.platform === "ZOOM" ? "https://zoom.us/j/..." : "https://meet.google.com/..."} />
                    <p className="text-white/20 text-[10px] mt-1.5">
                      {form.platform === "ZOOM" ? "Collez le lien de votre reunion Zoom" : "Collez le lien Google Meet"}
                    </p>
                  </div>
                )}
                {form.platform === "JITSI" && (
                  <div className="bg-blue-500/5 border border-blue-500/10 rounded-xl p-3">
                    <p className="text-blue-400/70 text-xs">Jitsi Meet est gratuit et sans installation. Le lien sera genere automatiquement.</p>
                  </div>
                )}
                <div className="flex justify-end gap-3 pt-2">
                  <button type="button" onClick={() => setShowModal(false)} className="px-5 py-2.5 rounded-xl text-white/40 text-sm hover:text-white hover:bg-white/[0.04] transition-all">
                    Annuler
                  </button>
                  <button type="submit" disabled={saving}
                    className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-red-500 text-white text-sm font-bold hover:bg-red-400 transition-all disabled:opacity-60 active:scale-95 shadow-lg shadow-red-500/20">
                    {saving ? <><FaSpinner className="animate-spin" /> Programmation...</> : <><FaVideo className="text-xs" /> Programmer</>}
                  </button>
                </div>
              </form>
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
              className="bg-[#0d1a2e] border border-red-500/20 rounded-2xl w-full max-w-sm shadow-2xl" onClick={e => e.stopPropagation()}>
              <div className="p-6 text-center">
                <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center mx-auto mb-4">
                  <FaExclamationTriangle className="text-red-400 text-2xl" />
                </div>
                <h3 className="text-white font-bold text-lg mb-2">Supprimer cette session ?</h3>
                <p className="text-gold font-semibold text-sm mb-4">{deleteConfirm.title}</p>
                <div className="flex gap-3">
                  <button onClick={() => setDeleteConfirm(null)} className="flex-1 py-3 rounded-xl border border-white/[0.08] text-white/50 text-sm hover:text-white hover:bg-white/[0.04] transition-all">
                    Annuler
                  </button>
                  <button onClick={handleDelete} disabled={!!actionLoading}
                    className="flex-1 py-3 rounded-xl bg-red-500/20 border border-red-500/30 text-red-400 text-sm font-bold hover:bg-red-500/30 transition-all disabled:opacity-60 flex items-center justify-center gap-2">
                    {actionLoading ? <FaSpinner className="animate-spin" /> : <FaTrash className="text-xs" />} Supprimer
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
