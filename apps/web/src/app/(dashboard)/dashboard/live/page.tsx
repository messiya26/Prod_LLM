"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaVideo, FaPlay, FaUsers, FaClock, FaTimes, FaSpinner, FaExternalLinkAlt, FaCalendar } from "react-icons/fa";
import { SiZoom, SiGooglemeet } from "react-icons/si";
import { useAuth } from "@/context/auth-context";
import api from "@/lib/api";

interface LiveSession {
  id: string; title: string; description?: string;
  platform: "JITSI" | "ZOOM" | "GOOGLE_MEET";
  status: "SCHEDULED" | "LIVE" | "ENDED" | "CANCELLED";
  meetingUrl?: string; roomName: string;
  scheduledAt: string; duration?: number; replayUrl?: string;
  _count: { attendees: number };
}

const platformIcon: Record<string, React.ReactNode> = {
  JITSI: <FaVideo className="text-blue-400" />,
  ZOOM: <SiZoom className="text-blue-500" />,
  GOOGLE_MEET: <SiGooglemeet className="text-green-400" />,
};
const platformLabel: Record<string, string> = { JITSI: "Jitsi Meet", ZOOM: "Zoom", GOOGLE_MEET: "Google Meet" };

export default function StudentLive() {
  const { user } = useAuth();
  const [upcoming, setUpcoming] = useState<LiveSession[]>([]);
  const [past, setPast] = useState<LiveSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [joining, setJoining] = useState<string | null>(null);
  const [activeSession, setActiveSession] = useState<LiveSession | null>(null);

  useEffect(() => {
    Promise.all([
      api.get<LiveSession[]>("/live/upcoming").catch(() => []),
      api.get<LiveSession[]>("/live/past").catch(() => []),
    ]).then(([u, p]) => {
      setUpcoming(Array.isArray(u) ? u : []);
      setPast(Array.isArray(p) ? p : []);
    }).finally(() => setLoading(false));
  }, []);

  const handleJoin = async (session: LiveSession) => {
    setJoining(session.id);
    try {
      await api.post(`/live/${session.id}/join`, {});
      if (session.platform === "JITSI") {
        setActiveSession(session);
      } else if (session.meetingUrl) {
        window.open(session.meetingUrl, "_blank");
      }
    } catch {} finally { setJoining(null); }
  };

  const handleLeave = async () => {
    if (!activeSession) return;
    try { await api.post(`/live/${activeSession.id}/leave`, {}); } catch {}
    setActiveSession(null);
  };

  const formatDate = (d: string) => new Date(d).toLocaleDateString("fr-FR", { weekday: "short", day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" });

  if (loading) return (
    <div className="flex items-center justify-center h-64"><FaSpinner className="text-gold text-2xl animate-spin" /></div>
  );

  return (
    <>
      <div className="space-y-6">
        <div>
          <h1 className="text-xl font-bold text-white mb-1">Sessions Live</h1>
          <p className="text-white/30 text-sm">Rejoignez les sessions en direct et visionnez les replays</p>
        </div>

        {upcoming.filter(s => s.status === "LIVE").length > 0 && (
          <div className="space-y-3">
            <h2 className="text-sm font-bold text-red-400 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" /> En direct maintenant
            </h2>
            {upcoming.filter(s => s.status === "LIVE").map(s => (
              <motion.div key={s.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                className="rounded-2xl bg-red-500/[0.05] border border-red-500/20 p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-xl bg-red-500/20 flex items-center justify-center animate-pulse">
                      {platformIcon[s.platform]}
                    </div>
                    <div>
                      <h3 className="text-white font-bold">{s.title}</h3>
                      <div className="flex items-center gap-3 mt-1 text-xs text-white/30">
                        <span>{platformLabel[s.platform]}</span>
                        <span className="flex items-center gap-1"><FaUsers className="text-[10px]" />{s._count.attendees} participants</span>
                      </div>
                      {s.description && <p className="text-white/40 text-xs mt-2">{s.description}</p>}
                    </div>
                  </div>
                  <button onClick={() => handleJoin(s)} disabled={joining === s.id}
                    className="flex items-center gap-2 px-6 py-3 rounded-xl bg-red-500 text-white text-sm font-bold hover:bg-red-400 transition-all shadow-lg shadow-red-500/20 active:scale-95 disabled:opacity-60">
                    {joining === s.id ? <FaSpinner className="animate-spin" /> : <FaPlay className="text-xs" />}
                    Rejoindre
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {upcoming.filter(s => s.status === "SCHEDULED").length > 0 && (
          <div className="space-y-3">
            <h2 className="text-sm font-bold text-white/60 flex items-center gap-2">
              <FaCalendar className="text-xs text-gold" /> Prochaines sessions
            </h2>
            {upcoming.filter(s => s.status === "SCHEDULED").map((s, i) => (
              <motion.div key={s.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                className="rounded-2xl bg-white/[0.02] border border-white/[0.06] p-5 flex items-center justify-between hover:border-gold/15 transition-all">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-white/[0.04] flex items-center justify-center">
                    {platformIcon[s.platform]}
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">{s.title}</h3>
                    <div className="flex items-center gap-3 mt-1 text-[10px] text-white/30">
                      <span>{platformLabel[s.platform]}</span>
                      <span><FaClock className="inline text-[8px] mr-0.5" />{formatDate(s.scheduledAt)}</span>
                      <span className="flex items-center gap-1"><FaUsers className="text-[8px]" />{s._count.attendees} inscrits</span>
                    </div>
                  </div>
                </div>
                <div className="px-4 py-2 rounded-lg bg-amber-400/10 text-amber-400 text-xs font-medium">
                  Bientot
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {past.length > 0 && (
          <div className="space-y-3">
            <h2 className="text-sm font-bold text-white/60 flex items-center gap-2">
              <FaPlay className="text-xs text-gold" /> Replays disponibles
            </h2>
            {past.map((s, i) => (
              <motion.div key={s.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                className="rounded-2xl bg-white/[0.02] border border-white/[0.06] p-5 flex items-center justify-between hover:border-white/10 transition-all">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-white/[0.04] flex items-center justify-center">
                    <FaPlay className="text-white/30" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">{s.title}</h3>
                    <div className="flex items-center gap-3 mt-1 text-[10px] text-white/30">
                      <span>{formatDate(s.scheduledAt)}</span>
                      {s.duration && <span>{s.duration} min</span>}
                      <span>{s._count.attendees} participants</span>
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

        {upcoming.length === 0 && past.length === 0 && (
          <div className="text-center py-20">
            <FaVideo className="text-white/10 text-5xl mx-auto mb-4" />
            <p className="text-white/20 text-sm">Aucune session live pour le moment</p>
            <p className="text-white/10 text-xs mt-1">Les prochaines sessions apparaitront ici</p>
          </div>
        )}
      </div>

      {/* Jitsi Embed Modal */}
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
