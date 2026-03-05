"use client";

import { useState, useEffect, useCallback } from "react";
import { useI18n } from "@/context/i18n-context";
import { FaSave, FaBell, FaLock, FaGlobe, FaCreditCard, FaShieldAlt, FaSpinner, FaTimes, FaCheck, FaEye, FaEyeSlash, FaExclamationTriangle } from "react-icons/fa";
import api from "@/lib/api";

const tabs = [
  { id: "general", icon: <FaGlobe />, label: "General" },
  { id: "security", icon: <FaLock />, label: "Securite" },
  { id: "notifications", icon: <FaBell />, label: "Notifications" },
  { id: "payments", icon: <FaCreditCard />, label: "Paiements" },
];

const GATEWAY_ICONS: Record<string, string> = {
  STRIPE: "💳", PAYPAL: "🅿️", MPESA: "📱", MOBILE_MONEY: "📲",
  ILLICOCASH: "💰", CASH_APP: "💵", BANK_TRANSFER: "🏦",
};

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
        {activeTab !== "payments" && (
          <button onClick={handleSave} className={`flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-bold transition-all ${saved ? "bg-emerald-500 text-white" : "bg-gold text-navy hover:bg-gold-light"}`}>
            <FaSave className="text-xs" /> {saved ? "Enregistre !" : "Enregistrer"}
          </button>
        )}
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
          {activeTab === "general" && <GeneralTab />}
          {activeTab === "security" && <SecurityTab />}
          {activeTab === "notifications" && <NotificationsTab />}
          {activeTab === "payments" && <PaymentsTab />}
        </div>
      </div>
    </div>
  );
}

function GeneralTab() {
  return (
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
  );
}

function SecurityTab() {
  return (
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
            <div className={`w-10 h-6 rounded-full transition-all cursor-pointer ${s.enabled ? "bg-gold" : "bg-white/10"}`}><div className={`w-5 h-5 rounded-full bg-white shadow-lg mt-0.5 transition-transform ${s.enabled ? "ml-[18px]" : "ml-0.5"}`} /></div>
          </div>
        ))}
      </div>
    </>
  );
}

function NotificationsTab() {
  return (
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
  );
}

function PaymentsTab() {
  const [gateways, setGateways] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [configModal, setConfigModal] = useState<any>(null);
  const [fields, setFields] = useState<any[]>([]);
  const [formData, setFormData] = useState<any>({});
  const [saving, setSaving] = useState(false);
  const [showPasswords, setShowPasswords] = useState<Record<string, boolean>>({});

  const loadGateways = useCallback(() => {
    setLoading(true);
    api.get<any[]>("/payments/gateways")
      .then((data) => setGateways(Array.isArray(data) ? data : []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { loadGateways(); }, [loadGateways]);

  const openConfig = async (gw: any) => {
    setConfigModal(gw);
    setFormData(typeof gw.config === "object" ? { ...gw.config } : {});
    try {
      const f = await api.get<any[]>(`/payments/gateways/${gw.code}/fields`);
      setFields(Array.isArray(f) ? f : []);
    } catch {
      setFields([]);
    }
  };

  const toggleEnabled = async (gw: any) => {
    try {
      await api.put(`/payments/gateways/${gw.id}`, { enabled: !gw.enabled });
      setGateways(gateways.map((g) => g.id === gw.id ? { ...g, enabled: !g.enabled } : g));
    } catch {}
  };

  const toggleSandbox = async (gw: any) => {
    try {
      await api.put(`/payments/gateways/${gw.id}`, { sandboxMode: !gw.sandboxMode });
      setGateways(gateways.map((g) => g.id === gw.id ? { ...g, sandboxMode: !g.sandboxMode } : g));
    } catch {}
  };

  const saveConfig = async () => {
    if (!configModal) return;
    setSaving(true);
    try {
      await api.put(`/payments/gateways/${configModal.id}`, { config: formData });
      setGateways(gateways.map((g) => g.id === configModal.id ? { ...g, config: formData } : g));
      setConfigModal(null);
    } catch {}
    setSaving(false);
  };

  if (loading) return <div className="flex justify-center py-12"><FaSpinner className="animate-spin text-xl text-gold" /></div>;

  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-bold text-white">Passerelles de paiement</h3>
        <span className="text-[10px] text-white/30">{gateways.filter((g) => g.enabled).length}/{gateways.length} actives</span>
      </div>

      <div className="space-y-3">
        {gateways.map((gw) => {
          const hasConfig = typeof gw.config === "object" && Object.values(gw.config).some((v: any) => v && v !== "");
          return (
            <div key={gw.id} className={`rounded-xl border p-4 transition-all ${gw.enabled ? "bg-white/[0.03] border-emerald-500/20" : "bg-white/[0.01] border-white/[0.06]"}`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{GATEWAY_ICONS[gw.code] || "💳"}</span>
                  <div>
                    <div className="text-xs font-semibold text-white">{gw.name}</div>
                    <div className="flex items-center gap-2 mt-1">
                      {gw.enabled ? (
                        <span className="flex items-center gap-1 text-[9px] font-bold text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded-full">
                          <FaCheck className="text-[7px]" /> Actif
                        </span>
                      ) : (
                        <span className="text-[9px] font-bold text-white/20 bg-white/[0.04] px-2 py-0.5 rounded-full">Inactif</span>
                      )}
                      {gw.sandboxMode && gw.enabled && (
                        <span className="flex items-center gap-1 text-[9px] font-bold text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded-full">
                          <FaExclamationTriangle className="text-[7px]" /> Sandbox
                        </span>
                      )}
                      {!hasConfig && gw.enabled && (
                        <span className="text-[9px] text-red-400">Non configure</span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => toggleEnabled(gw)}
                    className={`w-10 h-5 rounded-full transition-all ${gw.enabled ? "bg-emerald-500" : "bg-white/10"}`}
                  >
                    <div className={`w-4 h-4 rounded-full bg-white shadow transition-all ${gw.enabled ? "ml-[22px]" : "ml-[2px]"}`} />
                  </button>
                  <button
                    onClick={() => openConfig(gw)}
                    className="px-3 py-1.5 rounded-lg text-[10px] font-bold bg-gold/10 text-gold border border-gold/20 hover:bg-gold/20 transition-all"
                  >
                    Configurer
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {configModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={() => setConfigModal(null)}>
          <div className="bg-[#0f1e36] rounded-2xl border border-white/[0.1] w-full max-w-lg mx-4 shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between p-5 border-b border-white/[0.06]">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{GATEWAY_ICONS[configModal.code] || "💳"}</span>
                <div>
                  <h3 className="text-sm font-bold text-white">{configModal.name}</h3>
                  <p className="text-[10px] text-white/30">Configuration de la passerelle</p>
                </div>
              </div>
              <button onClick={() => setConfigModal(null)} className="p-2 text-white/30 hover:text-white rounded-lg hover:bg-white/[0.04]">
                <FaTimes />
              </button>
            </div>

            <div className="p-5 space-y-4 max-h-[60vh] overflow-y-auto">
              <div className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] border border-white/[0.04]">
                <div>
                  <div className="text-xs text-white">Mode Sandbox</div>
                  <div className="text-[9px] text-white/30">Activer le mode test (pas de vrais paiements)</div>
                </div>
                <button onClick={() => toggleSandbox(configModal).then(() => setConfigModal({ ...configModal, sandboxMode: !configModal.sandboxMode }))}
                  className={`w-10 h-5 rounded-full transition-all ${configModal.sandboxMode ? "bg-amber-500" : "bg-emerald-500"}`}>
                  <div className={`w-4 h-4 rounded-full bg-white shadow transition-all ${configModal.sandboxMode ? "ml-[2px]" : "ml-[22px]"}`} />
                </button>
              </div>

              {configModal.sandboxMode && (
                <div className="flex items-center gap-2 p-3 rounded-xl bg-amber-500/5 border border-amber-500/10">
                  <FaExclamationTriangle className="text-amber-400 text-xs shrink-0" />
                  <p className="text-[10px] text-amber-400/80">Mode Sandbox actif - Aucun vrai paiement ne sera traite</p>
                </div>
              )}

              {fields.length > 0 ? (
                <div className="space-y-3">
                  {fields.map((f) => (
                    <div key={f.field}>
                      <label className="flex items-center gap-1 text-[10px] text-white/40 font-medium uppercase tracking-wider mb-1.5">
                        {f.label}
                        {f.required && <span className="text-red-400">*</span>}
                      </label>
                      <div className="relative">
                        <input
                          type={f.type === "password" && !showPasswords[f.field] ? "password" : "text"}
                          value={formData[f.field] || ""}
                          onChange={(e) => setFormData({ ...formData, [f.field]: e.target.value })}
                          placeholder={f.type === "password" ? "••••••••" : ""}
                          className="w-full px-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.06] text-white text-xs focus:outline-none focus:border-gold/30 transition-all pr-10"
                        />
                        {f.type === "password" && (
                          <button
                            type="button"
                            onClick={() => setShowPasswords({ ...showPasswords, [f.field]: !showPasswords[f.field] })}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-white/20 hover:text-white/50"
                          >
                            {showPasswords[f.field] ? <FaEyeSlash size={12} /> : <FaEye size={12} />}
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-white/20 text-xs py-4">Aucun champ de configuration</p>
              )}
            </div>

            <div className="flex justify-end gap-3 p-5 border-t border-white/[0.06]">
              <button onClick={() => setConfigModal(null)} className="px-4 py-2 rounded-xl text-xs text-white/40 hover:text-white hover:bg-white/[0.04] transition-all">
                Annuler
              </button>
              <button onClick={saveConfig} disabled={saving}
                className="flex items-center gap-2 px-5 py-2 rounded-xl text-xs font-bold bg-gold text-navy hover:bg-gold-light transition-all disabled:opacity-50">
                {saving ? <FaSpinner className="animate-spin" /> : <FaSave />}
                {saving ? "Enregistrement..." : "Enregistrer"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
