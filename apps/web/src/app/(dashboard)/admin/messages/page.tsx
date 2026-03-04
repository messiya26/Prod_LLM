"use client";

import { useState, useEffect, useCallback } from "react";
import { useI18n } from "@/context/i18n-context";
import { FaReply, FaTrash, FaCircle, FaSearch, FaInbox, FaSpinner, FaCheck } from "react-icons/fa";
import api from "@/lib/api";

interface Message {
  id: string;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  read: boolean;
  createdAt: string;
}

export default function AdminMessages() {
  const { t } = useI18n();
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<string | null>(null);
  const [replyText, setReplyText] = useState("");
  const [sending, setSending] = useState(false);

  const fetchMessages = useCallback(async () => {
    try {
      const data = await api.get<any>("/contact");
      const list = Array.isArray(data) ? data : data?.data || [];
      setMessages(list);
    } catch {} finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchMessages(); }, [fetchMessages]);

  const filtered = messages.filter((m) =>
    m.name.toLowerCase().includes(search.toLowerCase()) ||
    m.subject.toLowerCase().includes(search.toLowerCase())
  );
  const unread = messages.filter(m => !m.read).length;
  const activeMsg = messages.find(m => m.id === selected);

  const handleSelect = async (id: string) => {
    setSelected(id);
    const msg = messages.find(m => m.id === id);
    if (msg && !msg.read) {
      try {
        await api.put(`/contact/${id}/read`, {});
        setMessages(prev => prev.map(m => m.id === id ? { ...m, read: true } : m));
      } catch {}
    }
  };

  const handleReply = async () => {
    if (!activeMsg || !replyText.trim()) return;
    setSending(true);
    try {
      await api.post("/mail/send", {
        to: activeMsg.email,
        subject: `Re: ${activeMsg.subject}`,
        html: `<p>${replyText}</p>`,
      });
      setReplyText("");
    } catch {} finally { setSending(false); }
  };

  const handleDelete = async (id: string) => {
    try {
      await api.delete(`/contact/${id}`);
      setMessages(prev => prev.filter(m => m.id !== id));
      if (selected === id) setSelected(null);
    } catch {}
  };

  const formatDate = (d: string) => {
    const date = new Date(d);
    return date.toLocaleDateString("fr-FR", { day: "2-digit", month: "short" }) + " " + date.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });
  };

  if (loading) return (
    <div className="flex items-center justify-center h-64"><FaSpinner className="text-gold text-2xl animate-spin" /></div>
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-white">{t("dash.messages")}</h1>
        <p className="text-white/30 text-sm">{unread} non lu{unread > 1 ? "s" : ""} &middot; {messages.length} total</p>
      </div>

      <div className="grid lg:grid-cols-5 gap-5 h-[calc(100vh-220px)]">
        <div className="lg:col-span-2 rounded-2xl bg-white/[0.02] border border-white/[0.06] overflow-hidden flex flex-col">
          <div className="p-3 border-b border-white/[0.04]">
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-white/20 text-xs" />
              <input type="text" placeholder={t("dash.search")} value={search} onChange={(e) => setSearch(e.target.value)} className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.06] text-white placeholder:text-white/20 text-xs focus:outline-none focus:border-gold/30 transition-all" />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto">
            {filtered.length === 0 && (
              <div className="text-center py-12"><FaInbox className="text-white/10 text-3xl mx-auto mb-2" /><p className="text-white/20 text-xs">Aucun message</p></div>
            )}
            {filtered.map((m) => (
              <button key={m.id} onClick={() => handleSelect(m.id)} className={`w-full text-left px-4 py-4 border-b border-white/[0.03] hover:bg-white/[0.03] transition-all ${selected === m.id ? "bg-gold/5 border-l-2 border-l-gold" : ""}`}>
                <div className="flex items-center gap-2 mb-1">
                  {!m.read && <FaCircle className="text-gold text-[6px]" />}
                  <span className={`text-xs font-medium ${m.read ? "text-white/50" : "text-white"}`}>{m.name}</span>
                  <span className="text-[10px] text-white/20 ml-auto">{formatDate(m.createdAt)}</span>
                </div>
                <div className={`text-xs mb-1 truncate ${m.read ? "text-white/35" : "text-white/70 font-medium"}`}>{m.subject}</div>
                <div className="text-[10px] text-white/20 truncate">{m.message}</div>
              </button>
            ))}
          </div>
        </div>

        <div className="lg:col-span-3 rounded-2xl bg-white/[0.02] border border-white/[0.06] overflow-hidden flex flex-col">
          {activeMsg ? (
            <>
              <div className="p-5 border-b border-white/[0.04] flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-white">{activeMsg.subject}</h3>
                  <p className="text-[10px] text-white/30 mt-1">De : {activeMsg.name} &lt;{activeMsg.email}&gt;{activeMsg.phone ? ` - ${activeMsg.phone}` : ""}</p>
                  <p className="text-[10px] text-white/20 mt-0.5">{formatDate(activeMsg.createdAt)}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => handleDelete(activeMsg.id)} className="p-2 rounded-lg hover:bg-red-400/10 text-white/30 hover:text-red-400 transition-all"><FaTrash className="text-sm" /></button>
                </div>
              </div>
              <div className="flex-1 p-6 overflow-y-auto">
                <p className="text-sm text-white/60 leading-relaxed whitespace-pre-wrap">{activeMsg.message}</p>
              </div>
              <div className="p-4 border-t border-white/[0.04]">
                <div className="flex items-center gap-3">
                  <input type="text" placeholder="Repondre par email..." value={replyText} onChange={e => setReplyText(e.target.value)}
                    onKeyDown={e => e.key === "Enter" && handleReply()}
                    className="flex-1 px-4 py-3 rounded-xl bg-white/[0.04] border border-white/[0.06] text-white placeholder:text-white/20 text-sm focus:outline-none focus:border-gold/30 transition-all" />
                  <button onClick={handleReply} disabled={sending || !replyText.trim()}
                    className="px-5 py-3 rounded-xl bg-gold text-navy font-bold text-sm hover:bg-gold-light transition-all disabled:opacity-50 flex items-center gap-2">
                    {sending ? <FaSpinner className="animate-spin" /> : <FaReply className="text-xs" />} Envoyer
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <FaInbox className="text-white/10 text-4xl mx-auto mb-3" />
                <p className="text-white/20 text-sm">Selectionnez un message</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
