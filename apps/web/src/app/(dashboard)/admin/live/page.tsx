"use client";

import { useState } from "react";
import { useI18n } from "@/context/i18n-context";
import { FaVideo, FaPlay, FaUsers, FaClock, FaDesktop } from "react-icons/fa";

const scheduled = [
  { id: "1", title: "Masterclass - Leadership Spirituel", date: "2026-03-01", time: "14:00", duration: "90 min", enrolled: 45, status: "upcoming" },
  { id: "2", title: "Q&A - Formation Pastorale", date: "2026-03-02", time: "10:00", duration: "60 min", enrolled: 32, status: "upcoming" },
  { id: "3", title: "Webinaire - Croissance Spirituelle", date: "2026-03-05", time: "18:00", duration: "90 min", enrolled: 78, status: "upcoming" },
];

const past = [
  { id: "p1", title: "Live - Introduction au Leadership", date: "2026-02-20", duration: "85 min", viewers: 120, replay: true },
  { id: "p2", title: "Session Q&A Fevrier", date: "2026-02-15", duration: "55 min", viewers: 89, replay: true },
  { id: "p3", title: "Masterclass - Priere", date: "2026-02-10", duration: "92 min", viewers: 156, replay: true },
];

export default function AdminLive() {
  const { t } = useI18n();
  const [activeTab, setActiveTab] = useState<"upcoming" | "past">("upcoming");

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-white">{t("dash.live")}</h1>
          <p className="text-white/30 text-sm">{scheduled.length} sessions programmees</p>
        </div>
        <button className="flex items-center gap-2 px-5 py-3 rounded-xl bg-red-500 text-white text-sm font-bold hover:bg-red-400 transition-all shadow-lg shadow-red-500/20"><FaVideo className="text-xs" /> Demarrer un live</button>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        {[
          { icon: <FaVideo />, label: "Sessions ce mois", value: "6", color: "bg-red-500" },
          { icon: <FaUsers />, label: "Spectateurs total", value: "365", color: "bg-blue-500" },
          { icon: <FaClock />, label: "Heures de live", value: "12h", color: "bg-gold" },
        ].map((s) => (
          <div key={s.label} className="rounded-2xl bg-white/[0.02] border border-white/[0.06] p-5">
            <div className={`w-10 h-10 rounded-xl ${s.color} flex items-center justify-center text-white text-sm mb-3`}>{s.icon}</div>
            <div className="text-xl font-bold text-white">{s.value}</div>
            <div className="text-white/30 text-xs mt-1">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="flex items-center gap-2 bg-white/[0.02] rounded-xl p-1 w-fit border border-white/[0.06]">
        {(["upcoming", "past"] as const).map((tab) => (
          <button key={tab} onClick={() => setActiveTab(tab)} className={`px-5 py-2.5 rounded-lg text-sm font-medium transition-all ${activeTab === tab ? "bg-gold text-navy" : "text-white/40 hover:text-white/70"}`}>
            {tab === "upcoming" ? "A venir" : "Replays"}
          </button>
        ))}
      </div>

      {activeTab === "upcoming" ? (
        <div className="space-y-3">
          {scheduled.map((s) => (
            <div key={s.id} className="rounded-2xl bg-white/[0.02] border border-white/[0.06] p-5 flex items-center justify-between hover:border-gold/20 transition-all">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-red-500/10 flex items-center justify-center"><FaVideo className="text-red-400" /></div>
                <div>
                  <h3 className="text-sm font-bold text-white">{s.title}</h3>
                  <div className="flex items-center gap-3 mt-1 text-[10px] text-white/30">
                    <span>{s.date}</span><span>{s.time}</span><span>{s.duration}</span>
                    <span className="flex items-center gap-1"><FaUsers className="text-[8px]" />{s.enrolled} inscrits</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button className="px-4 py-2 rounded-lg bg-white/[0.04] text-white/40 text-xs hover:text-white hover:bg-white/[0.08] transition-all">Modifier</button>
                <button className="px-4 py-2 rounded-lg bg-red-500/10 text-red-400 text-xs hover:bg-red-500/20 transition-all flex items-center gap-1.5"><FaPlay className="text-[8px]" /> Lancer</button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {past.map((p) => (
            <div key={p.id} className="rounded-2xl bg-white/[0.02] border border-white/[0.06] p-5 flex items-center justify-between hover:border-white/10 transition-all">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center"><FaDesktop className="text-blue-400" /></div>
                <div>
                  <h3 className="text-sm font-bold text-white">{p.title}</h3>
                  <div className="flex items-center gap-3 mt-1 text-[10px] text-white/30">
                    <span>{p.date}</span><span>{p.duration}</span><span>{p.viewers} vues</span>
                  </div>
                </div>
              </div>
              <button className="px-4 py-2 rounded-lg bg-gold/10 text-gold text-xs hover:bg-gold/20 transition-all flex items-center gap-1.5"><FaPlay className="text-[8px]" /> Replay</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
