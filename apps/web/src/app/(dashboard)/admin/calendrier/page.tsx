"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { useI18n } from "@/context/i18n-context";
import { FaChevronLeft, FaChevronRight, FaPlus, FaClock, FaUsers, FaSpinner } from "react-icons/fa";
import api from "@/lib/api";

interface CalEvent {
  id: string;
  title: string;
  date: string;
  time: string;
  type: string;
  attendees: number;
}

const typeColors: Record<string, string> = {
  live: "bg-red-500/15 text-red-400 border-red-500/20",
  event: "bg-blue-500/15 text-blue-400 border-blue-500/20",
  webinar: "bg-emerald-500/15 text-emerald-400 border-emerald-500/20",
  coaching: "bg-gold/15 text-gold border-gold/20",
  workshop: "bg-purple-500/15 text-purple-400 border-purple-500/20",
};

export default function AdminCalendrier() {
  const { t } = useI18n();
  const [month, setMonth] = useState(new Date().getMonth());
  const [year, setYear] = useState(new Date().getFullYear());
  const [events, setEvents] = useState<CalEvent[]>([]);
  const [loading, setLoading] = useState(true);

  const monthKeys = ["admin.month.jan","admin.month.feb","admin.month.mar","admin.month.apr","admin.month.may","admin.month.jun","admin.month.jul","admin.month.aug","admin.month.sep","admin.month.oct","admin.month.nov","admin.month.dec"];
  const dayKeys = ["admin.day.sun","admin.day.mon","admin.day.tue","admin.day.wed","admin.day.thu","admin.day.fri","admin.day.sat"];

  const fetchEvents = useCallback(async () => {
    try {
      const [liveData, eventsData] = await Promise.all([
        api.get<any[]>("/live").catch(() => []),
        api.get<any[]>("/events/admin").catch(() => []),
      ]);

      const mapped: CalEvent[] = [];

      if (Array.isArray(liveData)) {
        liveData.forEach((s: any) => {
          const d = new Date(s.scheduledAt);
          mapped.push({
            id: s.id,
            title: s.title,
            date: d.toISOString().split("T")[0],
            time: d.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" }),
            type: "live",
            attendees: s._count?.attendees || 0,
          });
        });
      }

      if (Array.isArray(eventsData)) {
        eventsData.forEach((e: any) => {
          const d = new Date(e.date || e.startDate);
          mapped.push({
            id: e.id,
            title: e.title,
            date: d.toISOString().split("T")[0],
            time: d.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" }),
            type: e.type?.toLowerCase() || "event",
            attendees: e.capacity || e._count?.registrations || 0,
          });
        });
      }

      setEvents(mapped);
    } catch {} finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchEvents(); }, [fetchEvents]);

  const calDays = useMemo(() => {
    const first = new Date(year, month, 1).getDay();
    const total = new Date(year, month + 1, 0).getDate();
    const days: (number | null)[] = Array(first).fill(null);
    for (let i = 1; i <= total; i++) days.push(i);
    return days;
  }, [month, year]);

  const today = new Date();
  const isCurrentMonth = month === today.getMonth() && year === today.getFullYear();

  const getEventsForDay = (day: number) => {
    const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    return events.filter(e => e.date === dateStr);
  };

  const upcomingEvents = events
    .filter(e => new Date(e.date) >= new Date(today.toISOString().split("T")[0]))
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(0, 8);

  if (loading) return (
    <div className="flex items-center justify-center h-64"><FaSpinner className="text-gold text-2xl animate-spin" /></div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-white">{t("admin.calendar")}</h1>
          <p className="text-white/30 text-sm">{events.length} evenements</p>
        </div>
        <button onClick={() => window.location.href = "/admin/evenements"} className="flex items-center gap-2 px-5 py-3 rounded-xl bg-gold text-navy text-sm font-bold hover:bg-gold-light transition-all"><FaPlus className="text-xs" /> Nouvel evenement</button>
      </div>

      <div className="grid lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 rounded-2xl bg-white/[0.02] border border-white/[0.06] p-6">
          <div className="flex items-center justify-between mb-6">
            <button onClick={() => { if (month === 0) { setMonth(11); setYear(year - 1); } else setMonth(month - 1); }} className="w-8 h-8 rounded-lg bg-gold/10 text-gold flex items-center justify-center hover:bg-gold/20 transition-colors"><FaChevronLeft className="text-xs" /></button>
            <span className="text-sm font-bold text-white">{t(monthKeys[month])} {year}</span>
            <button onClick={() => { if (month === 11) { setMonth(0); setYear(year + 1); } else setMonth(month + 1); }} className="w-8 h-8 rounded-lg bg-gold/10 text-gold flex items-center justify-center hover:bg-gold/20 transition-colors"><FaChevronRight className="text-xs" /></button>
          </div>
          <div className="grid grid-cols-7 gap-1 mb-2">
            {dayKeys.map((dk) => (<div key={dk} className="text-center text-[10px] font-medium text-white/25 py-2">{t(dk)}</div>))}
          </div>
          <div className="grid grid-cols-7 gap-1">
            {calDays.map((day, i) => {
              const dayEvents = day ? getEventsForDay(day) : [];
              return (
                <div key={i} className={`min-h-[70px] rounded-lg p-1.5 transition-all ${!day ? "" : day === today.getDate() && isCurrentMonth ? "bg-gold/10 border border-gold/20" : "hover:bg-white/[0.03] border border-transparent"}`}>
                  {day && <div className={`text-[11px] mb-1 ${day === today.getDate() && isCurrentMonth ? "text-gold font-bold" : "text-white/40"}`}>{day}</div>}
                  {dayEvents.map((ev) => (<div key={ev.id} className={`text-[8px] px-1.5 py-0.5 rounded border truncate mb-0.5 ${typeColors[ev.type] || typeColors.event}`}>{ev.title.substring(0, 15)}...</div>))}
                </div>
              );
            })}
          </div>
        </div>

        <div className="rounded-2xl bg-white/[0.02] border border-white/[0.06] p-5">
          <h3 className="text-sm font-bold text-white mb-4">Prochains evenements</h3>
          <div className="space-y-3">
            {upcomingEvents.length === 0 && <p className="text-white/20 text-xs text-center py-8">Aucun evenement a venir</p>}
            {upcomingEvents.map((ev) => (
              <div key={ev.id} className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.04] hover:border-gold/20 transition-all cursor-pointer">
                <div className={`inline-block px-2 py-0.5 rounded text-[9px] font-medium border mb-2 ${typeColors[ev.type] || typeColors.event}`}>{ev.type}</div>
                <h4 className="text-xs font-bold text-white mb-2">{ev.title}</h4>
                <div className="flex items-center gap-3 text-[10px] text-white/30">
                  <span className="flex items-center gap-1"><FaClock className="text-[8px]" />{ev.time}</span>
                  <span className="flex items-center gap-1"><FaUsers className="text-[8px]" />{ev.attendees}</span>
                </div>
                <div className="text-[10px] text-white/20 mt-1">{ev.date}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
