"use client";

import { useState } from "react";
import { useI18n } from "@/context/i18n-context";
import { FaReply, FaTrash, FaCircle, FaSearch, FaInbox } from "react-icons/fa";

const messages = [
  { id: "1", from: "Marie Katanga", email: "marie.k@email.com", subject: "Question sur la formation pastorale", preview: "Bonjour, je souhaiterais savoir si la formation pastorale est accessible aux debutants...", date: "2026-02-27 14:30", read: false },
  { id: "2", from: "Patrick Mbala", email: "p.mbala@email.com", subject: "Probleme de connexion", preview: "Je n'arrive pas a me connecter depuis hier soir. J'ai essaye de reinitialiser mon mot de passe...", date: "2026-02-27 11:15", read: false },
  { id: "3", from: "Grace Mutombo", email: "grace.m@email.com", subject: "Demande de certificat", preview: "J'ai termine la formation Croissance Spirituelle avec 92%. Comment obtenir mon certificat ?", date: "2026-02-26 16:45", read: true },
  { id: "4", from: "David Luntala", email: "d.luntala@email.com", subject: "Tarif groupe pour notre eglise", preview: "Notre eglise souhaiterait inscrire 15 membres. Proposez-vous des tarifs de groupe ?", date: "2026-02-26 09:20", read: true },
  { id: "5", from: "Sarah Ngoy", email: "s.ngoy@email.com", subject: "Suggestion d'amelioration", preview: "Il serait bien d'avoir des sous-titres en lingala pour les cours video...", date: "2026-02-25 18:00", read: true },
  { id: "6", from: "Emmanuel Tshisekedi", email: "e.tshi@email.com", subject: "Demande de remboursement", preview: "Suite a un probleme personnel, je souhaiterais annuler mon abonnement et obtenir un remboursement...", date: "2026-02-25 10:30", read: true },
];

export default function AdminMessages() {
  const { t } = useI18n();
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<string | null>(null);
  const filtered = messages.filter((m) => m.from.toLowerCase().includes(search.toLowerCase()) || m.subject.toLowerCase().includes(search.toLowerCase()));
  const unread = messages.filter(m => !m.read).length;
  const activeMsg = messages.find(m => m.id === selected);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-white">{t("dash.messages")}</h1>
        <p className="text-white/30 text-sm">{unread} non lu{unread > 1 ? "s" : ""}</p>
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
            {filtered.map((m) => (
              <button key={m.id} onClick={() => setSelected(m.id)} className={`w-full text-left px-4 py-4 border-b border-white/[0.03] hover:bg-white/[0.03] transition-all ${selected === m.id ? "bg-gold/5 border-l-2 border-l-gold" : ""}`}>
                <div className="flex items-center gap-2 mb-1">
                  {!m.read && <FaCircle className="text-gold text-[6px]" />}
                  <span className={`text-xs font-medium ${m.read ? "text-white/50" : "text-white"}`}>{m.from}</span>
                  <span className="text-[10px] text-white/20 ml-auto">{m.date.split(" ")[1]}</span>
                </div>
                <div className={`text-xs mb-1 truncate ${m.read ? "text-white/35" : "text-white/70 font-medium"}`}>{m.subject}</div>
                <div className="text-[10px] text-white/20 truncate">{m.preview}</div>
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
                  <p className="text-[10px] text-white/30 mt-1">De : {activeMsg.from} &lt;{activeMsg.email}&gt; - {activeMsg.date}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button className="p-2 rounded-lg hover:bg-gold/10 text-white/30 hover:text-gold transition-all"><FaReply className="text-sm" /></button>
                  <button className="p-2 rounded-lg hover:bg-red-400/10 text-white/30 hover:text-red-400 transition-all"><FaTrash className="text-sm" /></button>
                </div>
              </div>
              <div className="flex-1 p-6">
                <p className="text-sm text-white/60 leading-relaxed">{activeMsg.preview}</p>
              </div>
              <div className="p-4 border-t border-white/[0.04]">
                <div className="flex items-center gap-3">
                  <input type="text" placeholder="Repondre..." className="flex-1 px-4 py-3 rounded-xl bg-white/[0.04] border border-white/[0.06] text-white placeholder:text-white/20 text-sm focus:outline-none focus:border-gold/30 transition-all" />
                  <button className="px-5 py-3 rounded-xl bg-gold text-navy font-bold text-sm hover:bg-gold-light transition-all">Envoyer</button>
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
