"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaVideo, FaPlay, FaUsers, FaClock, FaTimes, FaSpinner, FaPlus,
  FaCalendar, FaCalendarAlt, FaChevronLeft, FaChevronRight, FaTrash,
} from "react-icons/fa";
import { SiZoom, SiGooglemeet } from "react-icons/si";
import { useAuth } from "@/context/auth-context";
import api from "@/lib/api";

interface Course { id: string; title: string; slug: string }
interface LiveSession {
  id: string; title: string; description?: string;
  platform: "JITSI" | "ZOOM" | "GOOGLE_MEET";
  status: "SCHEDULED" | "LIVE" | "ENDED" | "CANCELLED";
  meetingUrl?: string; roomName: string;
  scheduledAt: string; duration?: number; replayUrl?: string;
  courseId?: string; course?: { id: string; title: string };
  host?: { firstName: string; lastName: string };
  _count: { attendees: number };
}

const platformIcon: Record<string, React.ReactNode> = {
  JITSI: <FaVideo className="text-blue-400" />,
  ZOOM: <SiZoom className="text-blue-500" />,
  GOOGLE_MEET: <SiGooglemeet className="text-green-400" />,
};
const platformLabel: Record<string, string> = { JITSI: "Jitsi Meet", ZOOM: "Zoom", GOOGLE_MEET: "Google Meet" };
const statusColors: Record<string, string> = {
  SCHEDULED: "bg-amber-400/10 text-amber-400 border-amber-400/20",
  LIVE: "bg-red-500/10 text-red-400 border-red-500/20",
  ENDED: "bg-white/[0.04] text-white/30 border-white/[0.06]",
  CANCELLED: "bg-red-400/10 text-red-300/50 border-red-400/10",
};

export default function LivePage() {
  const { user } = useAuth();
  const canCreate = ["INSTRUCTOR", "ADMIN", "SUPER_ADMIN"].includes(user?.role || "");

  const [upcoming, setUpcoming] = useState<LiveSession[]>([]);
  const [past, setPast] = useState<LiveSession[]>([]);
  const [myLives, setMyLives] = useState<LiveSession[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [joining, setJoining] = useState<string | null>(null);
  const [activeSession, setActiveSession] = useState<LiveSession | null>(null);
  const [showCreate, setShowCreate] = useState(false);
  const [creating, setCreating] = useState(false);
  const [tab, setTab] = useState<"upcoming" | "calendar" | "my" | "past">("upcoming");
  const [calMonth, setCalMonth] = useState(new Date());

  const [form, setForm] = useState({
    title: "", description: "", platform: "JITSI",
    scheduledAt: "", courseId: "", maxAttendees: 50, meetingUrl: "",
  });

  useEffect(() => {
    const fetches: Promise<any>[] = [
      api.get<LiveSession[]>("/live/upcoming").catch(() => []),
      api.get<LiveSession[]>("/live/past").catch(() => []),
    ];
    if (canCreate) {
      fetches.push(api.get<LiveSession[]>("/live/instructor/my").catch(() => []));
      fetches.push(api.get<Course[]>("/courses?instructorOnly=true").catch(() => []));
    }
    Promise.all(fetches).then(([u, p, m, c]) => {
      setUpcoming(Array.isArray(u) ? u : []);
      setPast(Array.isArray(p) ? p : []);
      if (m) setMyLives(Array.isArray(m) ? m : []);
      if (c) setCourses(Array.isArray(c) ? c : []);
    }).finally(() => setLoading(false));
  }, [canCreate]);

  const handleJoin = async (session: LiveSession) => {
    setJoining(session.id);
    try {
      await api.post(`/live/${session.id}/join`, {});
      if (session.platform === "JITSI") setActiveSession(session);
      else if (session.meetingUrl) window.open(session.meetingUrl, "_blank");
    } catch {} finally { setJoining(null); }
  };

  const handleLeave = async () => {
    if (!activeSession) return;
    try { await api.post(`/live/${activeSession.id}/leave`, {}); } catch {}
    setActiveSession(null);
  };

  const handleCreate = async () => {
    if (!form.title || !form.scheduledAt) return;
    setCreating(true);
    try {
      const body: any = {
        title: form.title, description: form.description || undefined,
        platform: form.platform, scheduledAt: new Date(form.scheduledAt).toISOString(),
        maxAttendees: form.maxAttendees,
      };
      if (form.courseId) body.courseId = form.courseId;
      if (form.meetingUrl) body.meetingUrl = form.meetingUrl;
      const created = await api.post<LiveSession>("/live", body);
      setMyLives(prev => [created, ...prev]);
      setUpcoming(prev => [created, ...prev]);
      setShowCreate(false);
      setForm({ title: "", description: "", platform: "JITSI", scheduledAt: "", courseId: "", maxAttendees: 50, meetingUrl: "" });
    } catch (e: any) {
      alert(e.message || "Erreur lors de la creation");
    } finally { setCreating(false); }
  };

  const handleStart = async (id: string) => {
    try {
      await api.post(`/live/${id}/start`, {});
      setMyLives(prev => prev.map(s => s.id === id ? { ...s, status: "LIVE" as const } : s));
      setUpcoming(prev => prev.map(s => s.id === id ? { ...s, status: "LIVE" as const } : s));
    } catch {}
  };

  const handleEnd = async (id: string) => {
    try {
      await api.post(`/live/${id}/end`, {});
      setMyLives(prev => prev.map(s => s.id === id ? { ...s, status: "ENDED" as const } : s));
      setUpcoming(prev => prev.filter(s => s.id !== id));
    } catch {}
  };

  const handleCancel = async (id: string) => {
    if (!confirm("Annuler cette session ?")) return;
    try {
      await api.post(`/live/${id}/cancel`, {});
      setMyLives(prev => prev.map(s => s.id === id ? { ...s, status: "CANCELLED" as const } : s));
      setUpcoming(prev => prev.filter(s => s.id !== id));
    } catch {}
  };

  const formatDate = (d: string) => new Date(d).toLocaleDateString("fr-FR", { weekday: "short", day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" });

  const allSessions = [...upcoming, ...past, ...myLives].reduce((acc, s) => {
    if (!acc.find(x => x.id === s.id)) acc.push(s);
    return acc;
  }, [] as LiveSession[]);

  const calDays = () => {
    const y = calMonth.getFullYear(), m = calMonth.getMonth();
    const first = new Date(y, m, 1).getDay();
    const daysInMonth = new Date(y, m + 1, 0).getDate();
    const days: { day: number; sessions: LiveSession[] }[] = [];
    for (let i = 0; i < (first === 0 ? 6 : first - 1); i++) days.push({ day: 0, sessions: [] });
    for (let d = 1; d <= daysInMonth; d++) {
      const dayStr = `${y}-${String(m + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
      const sessions = allSessions.filter(s => s.scheduledAt.startsWith(dayStr));
      days.push({ day: d, sessions });
    }
    return days;
  };

  if (loading) return (
    <div className="flex items-center justify-center h-64"><FaSpinner className="text-gold text-2xl animate-spin" /></div>
  );

  return (
    <>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-white mb-1">Sessions Live</h1>
            <p className="text-white/30 text-sm">
              {canCreate ? "Gerez et planifiez vos sessions en direct" : "Rejoignez les sessions en direct et visionnez les replays"}
            </p>
          </div>
          {canCreate && (
            <button onClick={() => setShowCreate(true)}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-gold/80 to-amber-600/80 text-[#0a1628] text-sm font-bold hover:from-gold hover:to-amber-500 transition-all active:scale-95">
              <FaPlus className="text-xs" /> Planifier une session
            </button>
          )}
        </div>

        {/* Tabs */}
        <div className="flex gap-1 p-1 rounded-xl bg-white/[0.03] border border-white/[0.06] w-fit">
          {[
            { key: "upcoming", label: "A venir", icon: <FaClock className="text-[10px]" /> },
            { key: "calendar", label: "Agenda", icon: <FaCalendarAlt className="text-[10px]" /> },
            ...(canCreate ? [{ key: "my", label: "Mes sessions", icon: <FaVideo className="text-[10px]" /> }] : []),
            { key: "past", label: "Replays", icon: <FaPlay className="text-[10px]" /> },
          ].map(t => (
            <button key={t.key} onClick={() => setTab(t.key as any)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-medium transition-all ${tab === t.key ? "bg-gold/20 text-gold" : "text-white/40 hover:text-white/60"}`}>
              {t.icon}{t.label}
            </button>
          ))}
        </div>

        {/* TAB: Upcoming */}
        {tab === "upcoming" && (
          <div className="space-y-3">
            {upcoming.filter(s => s.status === "LIVE").map(s => (
              <motion.div key={s.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                className="rounded-2xl bg-red-500/[0.05] border border-red-500/20 p-6">
                <div className="flex items-center justify-between flex-wrap gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-xl bg-red-500/20 flex items-center justify-center animate-pulse">
                      {platformIcon[s.platform]}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                        <h3 className="text-white font-bold">{s.title}</h3>
                      </div>
                      <div className="flex items-center gap-3 mt-1 text-xs text-white/30">
                        <span>{platformLabel[s.platform]}</span>
                        <span className="flex items-center gap-1"><FaUsers className="text-[10px]" />{s._count?.attendees || 0}</span>
                        {s.course && <span className="text-gold/60">{s.course.title}</span>}
                      </div>
                    </div>
                  </div>
                  <button onClick={() => handleJoin(s)} disabled={joining === s.id}
                    className="flex items-center gap-2 px-6 py-3 rounded-xl bg-red-500 text-white text-sm font-bold hover:bg-red-400 transition-all active:scale-95 disabled:opacity-60">
                    {joining === s.id ? <FaSpinner className="animate-spin" /> : <FaPlay className="text-xs" />}
                    Rejoindre
                  </button>
                </div>
              </motion.div>
            ))}

            {upcoming.filter(s => s.status === "SCHEDULED").map((s, i) => (
              <motion.div key={s.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                className="rounded-2xl bg-white/[0.02] border border-white/[0.06] p-5 flex items-center justify-between flex-wrap gap-3 hover:border-gold/15 transition-all">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-white/[0.04] flex items-center justify-center">
                    {platformIcon[s.platform]}
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">{s.title}</h3>
                    <div className="flex items-center gap-3 mt-1 text-[10px] text-white/30 flex-wrap">
                      <span>{platformLabel[s.platform]}</span>
                      <span><FaClock className="inline text-[8px] mr-0.5" />{formatDate(s.scheduledAt)}</span>
                      {s.course && <span className="text-gold/50">{s.course.title}</span>}
                      {s.host && <span>par {s.host.firstName} {s.host.lastName}</span>}
                    </div>
                  </div>
                </div>
                <div className="px-4 py-2 rounded-lg bg-amber-400/10 text-amber-400 text-xs font-medium">Bientot</div>
              </motion.div>
            ))}

            {upcoming.length === 0 && (
              <div className="text-center py-16">
                <FaCalendar className="text-white/10 text-4xl mx-auto mb-3" />
                <p className="text-white/20 text-sm">Aucune session planifiee</p>
              </div>
            )}
          </div>
        )}

        {/* TAB: Calendar/Agenda */}
        {tab === "calendar" && (
          <div className="rounded-2xl bg-white/[0.02] border border-white/[0.06] p-6">
            <div className="flex items-center justify-between mb-6">
              <button onClick={() => setCalMonth(new Date(calMonth.getFullYear(), calMonth.getMonth() - 1, 1))}
                className="p-2 rounded-lg hover:bg-white/[0.05] text-white/40 hover:text-white transition-all"><FaChevronLeft /></button>
              <h3 className="text-white font-bold capitalize">
                {calMonth.toLocaleDateString("fr-FR", { month: "long", year: "numeric" })}
              </h3>
              <button onClick={() => setCalMonth(new Date(calMonth.getFullYear(), calMonth.getMonth() + 1, 1))}
                className="p-2 rounded-lg hover:bg-white/[0.05] text-white/40 hover:text-white transition-all"><FaChevronRight /></button>
            </div>
            <div className="grid grid-cols-7 gap-1 text-center mb-2">
              {["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"].map(d => (
                <div key={d} className="text-[10px] text-white/30 font-medium py-1">{d}</div>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-1">
              {calDays().map((d, i) => (
                <div key={i} className={`min-h-[70px] rounded-lg p-1.5 text-xs ${d.day === 0 ? "" : "bg-white/[0.02] border border-white/[0.04] hover:border-white/10 transition-all"}`}>
                  {d.day > 0 && (
                    <>
                      <div className={`text-[10px] mb-1 ${d.day === new Date().getDate() && calMonth.getMonth() === new Date().getMonth() ? "text-gold font-bold" : "text-white/40"}`}>{d.day}</div>
                      {d.sessions.slice(0, 2).map(s => (
                        <div key={s.id} className={`text-[8px] px-1 py-0.5 rounded mb-0.5 truncate ${s.status === "LIVE" ? "bg-red-500/20 text-red-400" : s.status === "SCHEDULED" ? "bg-gold/15 text-gold" : "bg-white/[0.04] text-white/30"}`}>
                          {s.title}
                        </div>
                      ))}
                      {d.sessions.length > 2 && <div className="text-[8px] text-white/20">+{d.sessions.length - 2}</div>}
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB: My Sessions (Instructor/Admin) */}
        {tab === "my" && canCreate && (
          <div className="space-y-3">
            {myLives.length === 0 ? (
              <div className="text-center py-16">
                <FaVideo className="text-white/10 text-4xl mx-auto mb-3" />
                <p className="text-white/20 text-sm">Vous n'avez pas encore de session</p>
                <button onClick={() => setShowCreate(true)} className="mt-4 px-5 py-2 rounded-lg bg-gold/20 text-gold text-xs hover:bg-gold/30 transition-all">
                  <FaPlus className="inline mr-1.5 text-[10px]" />Creer ma premiere session
                </button>
              </div>
            ) : myLives.map((s, i) => (
              <motion.div key={s.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
                className="rounded-2xl bg-white/[0.02] border border-white/[0.06] p-5">
                <div className="flex items-center justify-between flex-wrap gap-3">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-white/[0.04] flex items-center justify-center">
                      {platformIcon[s.platform]}
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-white">{s.title}</h3>
                      <div className="flex items-center gap-3 mt-1 text-[10px] text-white/30 flex-wrap">
                        <span>{formatDate(s.scheduledAt)}</span>
                        <span className={`px-2 py-0.5 rounded-full border text-[9px] font-medium ${statusColors[s.status]}`}>
                          {s.status === "SCHEDULED" ? "Planifie" : s.status === "LIVE" ? "En direct" : s.status === "ENDED" ? "Termine" : "Annule"}
                        </span>
                        {s.course && <span className="text-gold/50">{s.course.title}</span>}
                        <span><FaUsers className="inline text-[8px] mr-0.5" />{s._count?.attendees || 0}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {s.status === "SCHEDULED" && (
                      <>
                        <button onClick={() => handleStart(s.id)}
                          className="px-4 py-2 rounded-lg bg-green-500/20 text-green-400 text-xs font-medium hover:bg-green-500/30 transition-all">
                          Demarrer
                        </button>
                        <button onClick={() => handleCancel(s.id)}
                          className="px-3 py-2 rounded-lg bg-red-400/10 text-red-400/60 text-xs hover:bg-red-400/20 transition-all">
                          <FaTimes />
                        </button>
                      </>
                    )}
                    {s.status === "LIVE" && (
                      <>
                        <button onClick={() => handleJoin(s)}
                          className="px-4 py-2 rounded-lg bg-red-500 text-white text-xs font-bold hover:bg-red-400 transition-all">
                          <FaPlay className="inline mr-1.5 text-[10px]" />Rejoindre
                        </button>
                        <button onClick={() => handleEnd(s.id)}
                          className="px-3 py-2 rounded-lg bg-white/[0.06] text-white/40 text-xs hover:bg-white/10 transition-all">
                          Terminer
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* TAB: Past/Replays */}
        {tab === "past" && (
          <div className="space-y-3">
            {past.length === 0 ? (
              <div className="text-center py-16">
                <FaPlay className="text-white/10 text-4xl mx-auto mb-3" />
                <p className="text-white/20 text-sm">Aucun replay disponible</p>
              </div>
            ) : past.map((s, i) => (
              <motion.div key={s.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                className="rounded-2xl bg-white/[0.02] border border-white/[0.06] p-5 flex items-center justify-between flex-wrap gap-3">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-white/[0.04] flex items-center justify-center"><FaPlay className="text-white/30" /></div>
                  <div>
                    <h3 className="text-sm font-bold text-white">{s.title}</h3>
                    <div className="flex items-center gap-3 mt-1 text-[10px] text-white/30">
                      <span>{formatDate(s.scheduledAt)}</span>
                      {s.duration && <span>{s.duration} min</span>}
                      {s.course && <span className="text-gold/50">{s.course.title}</span>}
                    </div>
                  </div>
                </div>
                {s.replayUrl ? (
                  <a href={s.replayUrl} target="_blank" rel="noopener noreferrer"
                    className="px-4 py-2 rounded-lg bg-gold/10 text-gold text-xs hover:bg-gold/20 transition-all flex items-center gap-1.5">
                    <FaPlay className="text-[8px]" /> Voir le replay
                  </a>
                ) : (
                  <span className="px-4 py-2 text-white/15 text-xs">Replay indisponible</span>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Modal Creation */}
      <AnimatePresence>
        {showCreate && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/70 flex items-center justify-center p-4" onClick={() => setShowCreate(false)}>
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
              className="bg-[#0d1a2e] border border-white/[0.08] rounded-2xl w-full max-w-lg overflow-hidden" onClick={e => e.stopPropagation()}>
              <div className="p-6 border-b border-white/[0.06] flex items-center justify-between">
                <h2 className="text-white font-bold">Planifier une session live</h2>
                <button onClick={() => setShowCreate(false)} className="text-white/30 hover:text-white transition-all"><FaTimes /></button>
              </div>
              <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
                <div>
                  <label className="block text-white/50 text-xs mb-1.5">Titre *</label>
                  <input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white text-sm placeholder-white/20 focus:border-gold/30 focus:outline-none"
                    placeholder="Ex: Session Q&A Leadership" />
                </div>
                <div>
                  <label className="block text-white/50 text-xs mb-1.5">Description</label>
                  <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white text-sm placeholder-white/20 focus:border-gold/30 focus:outline-none resize-none h-20"
                    placeholder="Description de la session..." />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-white/50 text-xs mb-1.5">Plateforme *</label>
                    <select value={form.platform} onChange={e => setForm({ ...form, platform: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white text-sm focus:border-gold/30 focus:outline-none">
                      <option value="JITSI">Jitsi Meet (integre)</option>
                      <option value="ZOOM">Zoom</option>
                      <option value="GOOGLE_MEET">Google Meet</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-white/50 text-xs mb-1.5">Date et heure *</label>
                    <input type="datetime-local" value={form.scheduledAt} onChange={e => setForm({ ...form, scheduledAt: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white text-sm focus:border-gold/30 focus:outline-none" />
                  </div>
                </div>
                {courses.length > 0 && (
                  <div>
                    <label className="block text-white/50 text-xs mb-1.5">Lier a une formation</label>
                    <select value={form.courseId} onChange={e => setForm({ ...form, courseId: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white text-sm focus:border-gold/30 focus:outline-none">
                      <option value="">-- Aucune (session libre) --</option>
                      {courses.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
                    </select>
                  </div>
                )}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-white/50 text-xs mb-1.5">Participants max</label>
                    <input type="number" value={form.maxAttendees} onChange={e => setForm({ ...form, maxAttendees: parseInt(e.target.value) || 50 })}
                      className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white text-sm focus:border-gold/30 focus:outline-none" />
                  </div>
                  {form.platform !== "JITSI" && (
                    <div>
                      <label className="block text-white/50 text-xs mb-1.5">Lien meeting</label>
                      <input value={form.meetingUrl} onChange={e => setForm({ ...form, meetingUrl: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white text-sm placeholder-white/20 focus:border-gold/30 focus:outline-none"
                        placeholder="https://zoom.us/j/..." />
                    </div>
                  )}
                </div>
              </div>
              <div className="p-6 border-t border-white/[0.06] flex justify-end gap-3">
                <button onClick={() => setShowCreate(false)}
                  className="px-5 py-2.5 rounded-xl text-white/40 text-sm hover:text-white/60 transition-all">Annuler</button>
                <button onClick={handleCreate} disabled={creating || !form.title || !form.scheduledAt}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-gold/80 to-amber-600/80 text-[#0a1628] text-sm font-bold hover:from-gold hover:to-amber-500 transition-all active:scale-95 disabled:opacity-40">
                  {creating ? <FaSpinner className="animate-spin" /> : "Planifier la session"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Jitsi Embed */}
      <AnimatePresence>
        {activeSession && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black flex flex-col">
            <div className="flex items-center justify-between px-6 py-3 bg-[#0d1a2e] border-b border-white/[0.06] shrink-0">
              <div className="flex items-center gap-3">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse" />
                <h3 className="text-white font-bold text-sm">{activeSession.title}</h3>
                <span className="text-white/20 text-xs">via {platformLabel[activeSession.platform]}</span>
              </div>
              <button onClick={handleLeave}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-500 text-white text-xs font-bold hover:bg-red-400 transition-all">
                <FaTimes /> Quitter
              </button>
            </div>
            <div className="flex-1">
              <iframe
                src={`https://meet.jit.si/${activeSession.roomName}#userInfo.displayName="${user?.firstName || "Participant"}"&config.prejoinPageEnabled=false`}
                className="w-full h-full border-0"
                allow="camera; microphone; fullscreen; display-capture; autoplay; clipboard-write"
                style={{ height: "calc(100vh - 56px)" }}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
