"use client";

import { useState } from "react";
import { useI18n } from "@/context/i18n-context";
import { FaSave, FaBell, FaLock, FaGlobe, FaCreditCard, FaShieldAlt } from "react-icons/fa";

const tabs = [
  { id: "general", icon: <FaGlobe />, label: "General" },
  { id: "security", icon: <FaLock />, label: "Securite" },
  { id: "notifications", icon: <FaBell />, label: "Notifications" },
  { id: "payments", icon: <FaCreditCard />, label: "Paiements" },
];

export default function AdminParametres() {
  const { t } = useI18n();
  const [activeTab, setActiveTab] = useState("general");
  const [saved, setSaved] = useState(false);

  const handleSave = () => { setSaved(true); setTimeout(() => setSaved(false), 2000); };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-white">{t("dash.settings")}</h1>
          <p className="text-white/30 text-sm">Configuration de la plateforme</p>
        </div>
        <button onClick={handleSave} className={`flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-bold transition-all ${saved ? "bg-emerald-500 text-white" : "bg-gold text-navy hover:bg-gold-light"}`}>
          <FaSave className="text-xs" /> {saved ? "Enregistre !" : "Enregistrer"}
        </button>
      </div>

      <div className="grid lg:grid-cols-4 gap-5">
        <div className="rounded-2xl bg-white/[0.02] border border-white/[0.06] p-3">
          <nav className="space-y-1">
            {tabs.map((tab) => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-medium transition-all ${activeTab === tab.id ? "bg-gold/10 text-gold border border-gold/10" : "text-white/40 hover:text-white/60 hover:bg-white/[0.03]"}`}>
                <span className="text-sm">{tab.icon}</span>{tab.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="lg:col-span-3 rounded-2xl bg-white/[0.02] border border-white/[0.06] p-6 space-y-6">
          {activeTab === "general" && (
            <>
              <h3 className="text-sm font-bold text-white mb-4">Informations generales</h3>
              <div className="grid md:grid-cols-2 gap-4">
                {[
                  { label: "Nom de la plateforme", value: "Lord Lombo Academie", type: "text" },
                  { label: "Email de contact", value: "contact@lordlomboacademie.com", type: "email" },
                  { label: "Telephone", value: "+243 XXX XXX XXX", type: "tel" },
                  { label: "Devise", value: "USD ($)", type: "text" },
                ].map((f) => (
                  <div key={f.label}>
                    <label className="block text-white/40 text-[10px] font-medium uppercase tracking-wider mb-2">{f.label}</label>
                    <input type={f.type} defaultValue={f.value} className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/[0.06] text-white text-sm focus:outline-none focus:border-gold/30 transition-all" />
                  </div>
                ))}
              </div>
              <div>
                <label className="block text-white/40 text-[10px] font-medium uppercase tracking-wider mb-2">Description</label>
                <textarea rows={3} defaultValue="Plateforme de formation en ligne dediee a la transformation spirituelle, au leadership et au developpement personnel." className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/[0.06] text-white text-sm focus:outline-none focus:border-gold/30 transition-all resize-none" />
              </div>
            </>
          )}

          {activeTab === "security" && (
            <>
              <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2"><FaShieldAlt className="text-gold" /> Securite</h3>
              <div className="space-y-4">
                {[
                  { label: "Authentification 2FA", desc: "Activer l'authentification a deux facteurs pour les admins", enabled: true },
                  { label: "Verification email obligatoire", desc: "Les utilisateurs doivent verifier leur email", enabled: true },
                  { label: "Rate limiting API", desc: "Limiter les requetes a 100/min par IP", enabled: true },
                  { label: "Protection CSRF", desc: "Protection contre les attaques Cross-Site Request Forgery", enabled: true },
                  { label: "Content Security Policy", desc: "Headers CSP stricts pour prevenir les injections XSS", enabled: true },
                ].map((s) => (
                  <div key={s.label} className="flex items-center justify-between p-4 rounded-xl bg-white/[0.02] border border-white/[0.04]">
                    <div><div className="text-xs font-medium text-white">{s.label}</div><div className="text-[10px] text-white/30 mt-0.5">{s.desc}</div></div>
                    <div className={`w-10 h-6 rounded-full transition-all cursor-pointer ${s.enabled ? "bg-gold" : "bg-white/10"}`}><div className={`w-5 h-5 rounded-full bg-white shadow-lg mt-0.5 transition-transform ${s.enabled ? "translate-x-4.5 ml-[18px]" : "ml-0.5"}`} /></div>
                  </div>
                ))}
              </div>
            </>
          )}

          {activeTab === "notifications" && (
            <>
              <h3 className="text-sm font-bold text-white mb-4">Notifications</h3>
              <div className="space-y-4">
                {[
                  { label: "Nouvelle inscription", desc: "Recevoir un email a chaque nouvelle inscription", enabled: true },
                  { label: "Nouveau paiement", desc: "Notification pour chaque transaction reussie", enabled: true },
                  { label: "Message de contact", desc: "Alerte quand un visiteur utilise le formulaire de contact", enabled: true },
                  { label: "Rappel de live", desc: "Rappel 1h avant chaque session live", enabled: false },
                ].map((n) => (
                  <div key={n.label} className="flex items-center justify-between p-4 rounded-xl bg-white/[0.02] border border-white/[0.04]">
                    <div><div className="text-xs font-medium text-white">{n.label}</div><div className="text-[10px] text-white/30 mt-0.5">{n.desc}</div></div>
                    <div className={`w-10 h-6 rounded-full transition-all cursor-pointer ${n.enabled ? "bg-gold" : "bg-white/10"}`}><div className={`w-5 h-5 rounded-full bg-white shadow-lg mt-0.5 transition-transform ${n.enabled ? "ml-[18px]" : "ml-0.5"}`} /></div>
                  </div>
                ))}
              </div>
            </>
          )}

          {activeTab === "payments" && (
            <>
              <h3 className="text-sm font-bold text-white mb-4">Configuration des paiements</h3>
              <div className="space-y-4">
                {[
                  { name: "Stripe", status: "Connecte", icon: "💳", active: true },
                  { name: "PayPal", status: "Connecte", icon: "🅿️", active: true },
                  { name: "Mobile Money (MTN)", status: "Phase 2", icon: "📱", active: false },
                  { name: "Mobile Money (Orange)", status: "Phase 2", icon: "📱", active: false },
                  { name: "Wave", status: "Phase 2", icon: "🌊", active: false },
                ].map((p) => (
                  <div key={p.name} className={`flex items-center justify-between p-4 rounded-xl border ${p.active ? "bg-white/[0.02] border-white/[0.06]" : "bg-white/[0.01] border-white/[0.03]"}`}>
                    <div className="flex items-center gap-3">
                      <span className="text-xl">{p.icon}</span>
                      <div><div className="text-xs font-medium text-white">{p.name}</div><div className={`text-[10px] mt-0.5 ${p.active ? "text-emerald-400" : "text-white/20"}`}>{p.status}</div></div>
                    </div>
                    <button className={`px-3 py-1.5 rounded-lg text-[10px] font-medium transition-all ${p.active ? "bg-emerald-400/10 text-emerald-400 border border-emerald-400/20" : "bg-white/[0.04] text-white/30 border border-white/[0.06]"}`}>{p.active ? "Configure" : "Bientot"}</button>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
