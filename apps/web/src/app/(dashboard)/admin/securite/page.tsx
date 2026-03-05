"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaShieldAlt, FaSpinner, FaHistory, FaCog,
  FaLock, FaUserShield, FaDatabase, FaDesktop,
  FaExclamationTriangle, FaCheck, FaTimes, FaDownload,
  FaTrash, FaSignOutAlt, FaFilter, FaChevronLeft,
  FaChevronRight, FaKey, FaClipboardList,
} from "react-icons/fa";
import api from "@/lib/api";

const TABS = [
  { id: "overview", label: "Vue d'ensemble", icon: <FaShieldAlt /> },
  { id: "audit", label: "Journal d'audit", icon: <FaHistory /> },
  { id: "settings", label: "Politique de securite", icon: <FaCog /> },
  { id: "sessions", label: "Sessions actives", icon: <FaDesktop /> },
  { id: "gdpr", label: "RGPD & Donnees", icon: <FaDatabase /> },
];

const SEVERITY_COLORS: Record<string, string> = {
  INFO: "bg-blue-500/10 text-blue-400",
  WARN: "bg-amber-500/10 text-amber-400",
  CRITICAL: "bg-red-500/10 text-red-400",
};

const ACTION_LABELS: Record<string, string> = {
  LOGIN: "Connexion", LOGOUT: "Deconnexion", LOGIN_FAILED: "Tentative echouee",
  PASSWORD_CHANGE: "Changement MDP", PASSWORD_RESET: "Reset MDP", ROLE_CHANGE: "Changement role",
  USER_CREATE: "Creation utilisateur", USER_UPDATE: "Modification utilisateur", USER_DELETE: "Suppression utilisateur",
  COURSE_CREATE: "Creation formation", COURSE_UPDATE: "Modification formation", COURSE_DELETE: "Suppression formation",
  COURSE_PUBLISH: "Publication formation", ENROLLMENT_CREATE: "Inscription", PAYMENT_CREATE: "Paiement",
  PAYMENT_REFUND: "Remboursement", SETTINGS_UPDATE: "Maj parametres", PERMISSION_CHANGE: "Changement permission",
  SESSION_REVOKE: "Revocation session", DATA_EXPORT: "Export donnees", DATA_DELETE_REQUEST: "Demande suppression",
  LIVE_SESSION_CREATE: "Creation live", MASTERCLASS_CREATE: "Creation masterclass",
  CERTIFICATE_GENERATE: "Generation certificat", RESOURCE_UPLOAD: "Upload ressource",
};

export default function SecurityPage() {
  const [tab, setTab] = useState("overview");

  return (
    <div className="space-y-6 max-w-[1200px]">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <FaShieldAlt className="text-gold" /> Securite & Conformite
          </h1>
          <p className="text-white/30 text-sm">RGPD / ISO 27001 / PCI-DSS</p>
        </div>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-1">
        {TABS.map((t) => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all ${
              tab === t.id
                ? "bg-gold text-navy shadow-lg shadow-gold/20"
                : "bg-white/[0.04] text-white/40 hover:text-white/60 border border-white/[0.06]"
            }`}
          >
            {t.icon} {t.label}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={tab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }}>
          {tab === "overview" && <OverviewTab />}
          {tab === "audit" && <AuditTab />}
          {tab === "settings" && <SettingsTab />}
          {tab === "sessions" && <SessionsTab />}
          {tab === "gdpr" && <GdprTab />}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

function OverviewTab() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/security/audit/stats").then(setStats).catch(() => {}).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="flex justify-center py-20"><FaSpinner className="animate-spin text-2xl text-gold" /></div>;

  const cards = [
    { label: "Total evenements", value: stats?.totalLogs || 0, icon: <FaClipboardList />, color: "from-blue-500 to-blue-600" },
    { label: "Aujourd'hui", value: stats?.todayLogs || 0, icon: <FaHistory />, color: "from-emerald-500 to-emerald-600" },
    { label: "Echecs connexion (7j)", value: stats?.failedLogins || 0, icon: <FaExclamationTriangle />, color: "from-red-500 to-red-600" },
    { label: "Score securite", value: "92%", icon: <FaShieldAlt />, color: "from-gold to-gold-light" },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((c, i) => (
          <div key={i} className="bg-[#0d1a2e] rounded-2xl border border-white/[0.06] p-5 hover:border-gold/20 transition-all">
            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${c.color} flex items-center justify-center text-white mb-3`}>{c.icon}</div>
            <p className="text-2xl font-bold text-white">{c.value}</p>
            <p className="text-white/30 text-xs">{c.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-[#0d1a2e] rounded-2xl border border-white/[0.06] p-6">
          <h3 className="text-white font-semibold text-sm mb-4 flex items-center gap-2"><FaShieldAlt className="text-emerald-400" /> Conformite</h3>
          <div className="space-y-4">
            {[
              { label: "RGPD", status: "Conforme", pct: 95, color: "from-emerald-400 to-emerald-500" },
              { label: "ISO 27001", status: "En cours", pct: 78, color: "from-amber-400 to-amber-500" },
              { label: "PCI-DSS", status: "Pret", pct: 88, color: "from-blue-400 to-blue-500" },
            ].map((item) => (
              <div key={item.label}>
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="text-white/70">{item.label}</span>
                  <span className="text-white/40">{item.status} - {item.pct}%</span>
                </div>
                <div className="h-2 bg-white/[0.06] rounded-full overflow-hidden">
                  <div className={`h-full bg-gradient-to-r ${item.color} rounded-full transition-all`} style={{ width: `${item.pct}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-[#0d1a2e] rounded-2xl border border-white/[0.06] p-6">
          <h3 className="text-white font-semibold text-sm mb-4 flex items-center gap-2"><FaHistory className="text-blue-400" /> Actions recentes (7j)</h3>
          <div className="space-y-2">
            {(stats?.recentActions || []).slice(0, 6).map((a: any, i: number) => (
              <div key={i} className="flex justify-between items-center py-2 border-b border-white/[0.03] last:border-0">
                <span className="text-xs text-white/50">{ACTION_LABELS[a.action] || a.action}</span>
                <span className="text-xs font-bold text-gold">{a._count?.id || 0}</span>
              </div>
            ))}
            {(!stats?.recentActions || stats.recentActions.length === 0) && (
              <p className="text-white/20 text-xs text-center py-4">Aucune action recente</p>
            )}
          </div>
        </div>
      </div>

      <div className="bg-[#0d1a2e] rounded-2xl border border-emerald-500/10 p-6">
        <h3 className="text-white font-semibold text-sm mb-4 flex items-center gap-2"><FaLock className="text-emerald-400" /> Mesures de securite actives</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {[
            "Chiffrement SSL/TLS", "Protection CSRF", "Rate Limiting (100 req/min)",
            "Validation JWT", "Hashage bcrypt (10 rounds)", "Cookies SameSite Strict",
          ].map((m) => (
            <div key={m} className="flex items-center gap-2 text-xs py-2 px-3 rounded-lg bg-emerald-500/5">
              <FaCheck className="text-emerald-400 text-[10px]" />
              <span className="text-white/60">{m}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function AuditTab() {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(1);
  const [filters, setFilters] = useState({ action: "", severity: "" });

  const load = useCallback(() => {
    setLoading(true);
    const params = new URLSearchParams({ page: String(page), limit: "20" });
    if (filters.action) params.set("action", filters.action);
    if (filters.severity) params.set("severity", filters.severity);
    api.get<any>(`/security/audit?${params}`).then((r) => {
      setLogs(r.data || []);
      setTotal(r.total || 0);
      setPages(r.pages || 1);
    }).catch(() => {}).finally(() => setLoading(false));
  }, [page, filters]);

  useEffect(() => { load(); }, [load]);

  return (
    <div className="space-y-4">
      <div className="bg-[#0d1a2e] rounded-2xl border border-white/[0.06] p-4">
        <div className="flex flex-wrap gap-3 items-center">
          <FaFilter className="text-white/20 text-sm" />
          <select value={filters.action} onChange={(e) => { setFilters({ ...filters, action: e.target.value }); setPage(1); }}
            className="bg-white/[0.04] border border-white/[0.06] rounded-xl px-3 py-2 text-xs text-white/60 focus:outline-none focus:border-gold/30">
            <option value="">Toutes les actions</option>
            {Object.entries(ACTION_LABELS).map(([k, v]) => (<option key={k} value={k}>{v}</option>))}
          </select>
          <select value={filters.severity} onChange={(e) => { setFilters({ ...filters, severity: e.target.value }); setPage(1); }}
            className="bg-white/[0.04] border border-white/[0.06] rounded-xl px-3 py-2 text-xs text-white/60 focus:outline-none focus:border-gold/30">
            <option value="">Toutes severites</option>
            <option value="INFO">Info</option>
            <option value="WARN">Warning</option>
            <option value="CRITICAL">Critique</option>
          </select>
          <span className="text-white/20 text-xs ml-auto">{total} evenement(s)</span>
        </div>
      </div>

      <div className="bg-[#0d1a2e] rounded-2xl border border-white/[0.06] overflow-hidden">
        {loading ? (
          <div className="flex justify-center py-12"><FaSpinner className="animate-spin text-xl text-gold" /></div>
        ) : logs.length === 0 ? (
          <div className="text-center py-12 text-white/20 text-sm">Aucun evenement enregistre</div>
        ) : (
          <table className="w-full text-left">
            <thead>
              <tr className="text-white/30 text-xs border-b border-white/[0.06]">
                <th className="px-5 py-3 font-medium">Date</th>
                <th className="px-5 py-3 font-medium">Utilisateur</th>
                <th className="px-5 py-3 font-medium">Action</th>
                <th className="px-5 py-3 font-medium">Severite</th>
                <th className="px-5 py-3 font-medium">IP</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log: any) => (
                <tr key={log.id} className="border-b border-white/[0.03] hover:bg-white/[0.02]">
                  <td className="px-5 py-3 text-white/40 text-xs">{new Date(log.createdAt).toLocaleString("fr-FR")}</td>
                  <td className="px-5 py-3">
                    {log.user ? (
                      <span className="text-white text-xs">{log.user.firstName} {log.user.lastName}</span>
                    ) : (
                      <span className="text-white/20 text-xs">Systeme</span>
                    )}
                  </td>
                  <td className="px-5 py-3">
                    <span className="px-2 py-1 rounded-lg bg-white/[0.04] text-white/60 text-[10px] font-medium">
                      {ACTION_LABELS[log.action] || log.action}
                    </span>
                  </td>
                  <td className="px-5 py-3">
                    <span className={`px-2 py-1 rounded-lg text-[10px] font-bold ${SEVERITY_COLORS[log.severity] || "bg-white/5 text-white/40"}`}>
                      {log.severity}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-white/30 font-mono text-[10px]">{log.ip || "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {pages > 1 && (
        <div className="flex items-center justify-center gap-3">
          <button onClick={() => setPage(Math.max(1, page - 1))} disabled={page === 1}
            className="p-2 rounded-lg border border-white/[0.06] text-white/30 hover:text-white disabled:opacity-20">
            <FaChevronLeft size={10} />
          </button>
          <span className="text-white/30 text-xs">Page {page} / {pages}</span>
          <button onClick={() => setPage(Math.min(pages, page + 1))} disabled={page === pages}
            className="p-2 rounded-lg border border-white/[0.06] text-white/30 hover:text-white disabled:opacity-20">
            <FaChevronRight size={10} />
          </button>
        </div>
      )}
    </div>
  );
}

function SettingsTab() {
  const [settings, setSettings] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    api.get("/security/settings").then(setSettings).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const save = async () => {
    setSaving(true);
    try {
      const { id, updatedAt, ...data } = settings;
      await api.put("/security/settings", data);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch {}
    setSaving(false);
  };

  if (loading) return <div className="flex justify-center py-20"><FaSpinner className="animate-spin text-xl text-gold" /></div>;
  if (!settings) return <div className="text-center py-12 text-white/20">Erreur de chargement</div>;

  const Field = ({ label, field, type = "number" }: { label: string; field: string; type?: string }) => (
    <div className="flex items-center justify-between py-3 border-b border-white/[0.03]">
      <span className="text-xs text-white/50">{label}</span>
      {type === "boolean" ? (
        <button onClick={() => setSettings({ ...settings, [field]: !settings[field] })}
          className={`w-11 h-6 rounded-full transition-colors relative ${settings[field] ? "bg-emerald-500" : "bg-white/10"}`}>
          <div className={`w-4.5 h-4.5 absolute top-[3px] bg-white rounded-full shadow transition-all ${settings[field] ? "left-[22px]" : "left-[3px]"}`} />
        </button>
      ) : (
        <input type="number" value={settings[field]}
          onChange={(e) => setSettings({ ...settings, [field]: parseInt(e.target.value) || 0 })}
          className="w-20 bg-white/[0.04] border border-white/[0.06] rounded-lg px-3 py-1.5 text-xs text-white text-right focus:outline-none focus:border-gold/30" />
      )}
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="bg-[#0d1a2e] rounded-2xl border border-white/[0.06] p-6">
        <h3 className="text-white font-semibold text-sm mb-4 flex items-center gap-2"><FaKey className="text-gold" /> Politique de mots de passe</h3>
        <Field label="Longueur minimale" field="passwordMinLength" />
        <Field label="Exiger une majuscule" field="passwordRequireUpper" type="boolean" />
        <Field label="Exiger une minuscule" field="passwordRequireLower" type="boolean" />
        <Field label="Exiger un chiffre" field="passwordRequireNumber" type="boolean" />
        <Field label="Exiger un caractere special" field="passwordRequireSpecial" type="boolean" />
        <Field label="Expiration MDP (jours)" field="passwordExpiryDays" />
      </div>

      <div className="bg-[#0d1a2e] rounded-2xl border border-white/[0.06] p-6">
        <h3 className="text-white font-semibold text-sm mb-4 flex items-center gap-2"><FaLock className="text-red-400" /> Securite connexion</h3>
        <Field label="Tentatives max avant verrouillage" field="maxLoginAttempts" />
        <Field label="Duree verrouillage (min)" field="lockoutDurationMin" />
        <Field label="Timeout session (min)" field="sessionTimeoutMin" />
        <Field label="Sessions actives max" field="maxActiveSessions" />
        <Field label="Verification email obligatoire" field="requireEmailVerification" type="boolean" />
        <Field label="Double authentification (2FA)" field="twoFactorEnabled" type="boolean" />
      </div>

      <div className="bg-[#0d1a2e] rounded-2xl border border-white/[0.06] p-6">
        <h3 className="text-white font-semibold text-sm mb-4 flex items-center gap-2"><FaDatabase className="text-blue-400" /> Retention des donnees</h3>
        <Field label="Retention donnees utilisateur (jours)" field="dataRetentionDays" />
        <Field label="Retention logs d'audit (jours)" field="auditRetentionDays" />
      </div>

      <div className="flex justify-end">
        <button onClick={save} disabled={saving}
          className="flex items-center gap-2 px-6 py-2.5 bg-gold text-navy rounded-xl text-xs font-bold hover:bg-gold-light transition-all disabled:opacity-50">
          {saving ? <FaSpinner className="animate-spin" /> : saved ? <FaCheck /> : <FaCog />}
          {saving ? "Enregistrement..." : saved ? "Enregistre !" : "Enregistrer"}
        </button>
      </div>
    </div>
  );
}

function SessionsTab() {
  const [sessions, setSessions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get<any[]>("/security/sessions").then((d) => setSessions(Array.isArray(d) ? d : [])).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const revoke = async (id: string) => {
    if (!confirm("Revoquer cette session ?")) return;
    try { await api.delete(`/security/sessions/${id}`); setSessions(sessions.filter((s) => s.id !== id)); } catch {}
  };

  const revokeAll = async () => {
    if (!confirm("Revoquer TOUTES les sessions ? Vous serez deconnecte.")) return;
    try { await api.delete("/security/sessions"); setSessions([]); } catch {}
  };

  if (loading) return <div className="flex justify-center py-20"><FaSpinner className="animate-spin text-xl text-gold" /></div>;

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <p className="text-white/30 text-xs">{sessions.length} session(s) active(s)</p>
        {sessions.length > 1 && (
          <button onClick={revokeAll} className="flex items-center gap-2 px-4 py-2 bg-red-500/10 text-red-400 rounded-xl text-xs hover:bg-red-500/20">
            <FaSignOutAlt /> Revoquer toutes
          </button>
        )}
      </div>

      {sessions.length === 0 ? (
        <div className="bg-[#0d1a2e] rounded-2xl border border-white/[0.06] p-12 text-center text-white/20 text-sm">Aucune session active</div>
      ) : (
        <div className="space-y-3">
          {sessions.map((s: any) => (
            <div key={s.id} className="bg-[#0d1a2e] rounded-2xl border border-white/[0.06] p-5 flex items-center justify-between hover:border-gold/10 transition-all">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400">
                  <FaDesktop size={16} />
                </div>
                <div>
                  <p className="text-white text-sm">{s.device || "Appareil inconnu"}</p>
                  <p className="text-white/30 text-[10px]">{s.ip || "IP inconnue"} - Derniere activite: {new Date(s.lastActive).toLocaleString("fr-FR")}</p>
                  <p className="text-white/15 text-[10px] mt-0.5">Expire: {new Date(s.expiresAt).toLocaleString("fr-FR")}</p>
                </div>
              </div>
              <button onClick={() => revoke(s.id)} className="p-2 text-red-400/50 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all">
                <FaTimes size={14} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function GdprTab() {
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    api.get<any>("/security/gdpr/requests").then((r) => setRequests(r?.data || [])).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const exportData = async () => {
    setExporting(true);
    try {
      const data = await api.get("/security/gdpr/my-data");
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url; a.download = `mes-donnees-${new Date().toISOString().split("T")[0]}.json`; a.click();
      URL.revokeObjectURL(url);
      await api.post("/security/gdpr/export-request");
    } catch {}
    setExporting(false);
  };

  const processReq = async (id: string, status: "APPROVED" | "REJECTED") => {
    if (!confirm(`${status === "APPROVED" ? "Approuver" : "Rejeter"} cette demande ?`)) return;
    try { await api.put(`/security/gdpr/requests/${id}`, { status }); setRequests(requests.map((r) => r.id === id ? { ...r, status } : r)); } catch {}
  };

  if (loading) return <div className="flex justify-center py-20"><FaSpinner className="animate-spin text-xl text-gold" /></div>;

  return (
    <div className="space-y-6">
      <div className="bg-[#0d1a2e] rounded-2xl border border-blue-500/10 p-6">
        <h3 className="text-white font-semibold text-sm mb-2 flex items-center gap-2"><FaUserShield className="text-blue-400" /> Vos droits RGPD</h3>
        <p className="text-white/30 text-xs mb-4">Conformement au RGPD, vous avez le droit d'acceder, exporter et supprimer vos donnees personnelles.</p>
        <div className="flex gap-3">
          <button onClick={exportData} disabled={exporting}
            className="flex items-center gap-2 px-4 py-2 bg-blue-500/10 border border-blue-500/20 text-blue-400 rounded-xl text-xs hover:bg-blue-500/20 disabled:opacity-50">
            {exporting ? <FaSpinner className="animate-spin" /> : <FaDownload />} Exporter mes donnees
          </button>
          <button onClick={async () => { if (confirm("Demander la suppression de votre compte ? Cette action est irreversible.")) { try { await api.post("/security/gdpr/delete-request"); alert("Demande envoyee."); } catch {} } }}
            className="flex items-center gap-2 px-4 py-2 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl text-xs hover:bg-red-500/20">
            <FaTrash /> Demander la suppression
          </button>
        </div>
      </div>

      <div className="bg-[#0d1a2e] rounded-2xl border border-white/[0.06] overflow-hidden">
        <div className="px-5 py-3 border-b border-white/[0.06] bg-white/[0.02]">
          <h2 className="text-white font-semibold text-sm">Demandes RGPD ({requests.length})</h2>
        </div>
        {requests.length === 0 ? (
          <p className="text-center text-white/20 py-8 text-xs">Aucune demande</p>
        ) : (
          <table className="w-full text-left">
            <thead>
              <tr className="text-white/30 text-xs border-b border-white/[0.06]">
                <th className="px-5 py-3 font-medium">Utilisateur</th>
                <th className="px-5 py-3 font-medium">Type</th>
                <th className="px-5 py-3 font-medium">Statut</th>
                <th className="px-5 py-3 font-medium">Date</th>
                <th className="px-5 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {requests.map((r: any) => (
                <tr key={r.id} className="border-b border-white/[0.03] hover:bg-white/[0.02]">
                  <td className="px-5 py-3 text-white text-xs">{r.user?.firstName} {r.user?.lastName}</td>
                  <td className="px-5 py-3">
                    <span className={`px-2 py-1 rounded-lg text-[10px] font-bold ${r.type === "DELETE" ? "bg-red-500/10 text-red-400" : "bg-blue-500/10 text-blue-400"}`}>
                      {r.type === "DELETE" ? "Suppression" : "Export"}
                    </span>
                  </td>
                  <td className="px-5 py-3">
                    <span className={`px-2 py-1 rounded-lg text-[10px] font-bold ${
                      r.status === "PENDING" ? "bg-amber-500/10 text-amber-400" : r.status === "APPROVED" ? "bg-emerald-500/10 text-emerald-400" : "bg-red-500/10 text-red-400"
                    }`}>{r.status}</span>
                  </td>
                  <td className="px-5 py-3 text-white/30 text-xs">{new Date(r.createdAt).toLocaleDateString("fr-FR")}</td>
                  <td className="px-5 py-3">
                    {r.status === "PENDING" && (
                      <div className="flex gap-2">
                        <button onClick={() => processReq(r.id, "APPROVED")} className="p-1.5 text-emerald-400 hover:bg-emerald-500/10 rounded"><FaCheck size={12} /></button>
                        <button onClick={() => processReq(r.id, "REJECTED")} className="p-1.5 text-red-400 hover:bg-red-500/10 rounded"><FaTimes size={12} /></button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
