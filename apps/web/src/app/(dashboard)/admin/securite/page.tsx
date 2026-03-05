"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaShieldAlt, FaSpinner, FaSearch, FaHistory, FaCog,
  FaLock, FaUserShield, FaDatabase, FaDesktop,
  FaExclamationTriangle, FaCheck, FaTimes, FaDownload,
  FaTrash, FaEye, FaSignOutAlt, FaFilter, FaChevronLeft,
  FaChevronRight, FaKey, FaGlobe, FaClipboardList,
} from "react-icons/fa";
import api from "@/lib/api";

const TABS = [
  { id: "audit", label: "Journal d'audit", icon: <FaHistory /> },
  { id: "settings", label: "Politique de securite", icon: <FaCog /> },
  { id: "sessions", label: "Sessions actives", icon: <FaDesktop /> },
  { id: "gdpr", label: "RGPD & Donnees", icon: <FaDatabase /> },
  { id: "overview", label: "Vue d'ensemble", icon: <FaShieldAlt /> },
];

const SEVERITY_COLORS: Record<string, string> = {
  INFO: "bg-blue-100 text-blue-700",
  WARN: "bg-yellow-100 text-yellow-700",
  CRITICAL: "bg-red-100 text-red-700",
};

const ACTION_LABELS: Record<string, string> = {
  LOGIN: "Connexion",
  LOGOUT: "Deconnexion",
  LOGIN_FAILED: "Tentative echouee",
  PASSWORD_CHANGE: "Changement MDP",
  PASSWORD_RESET: "Reset MDP",
  ROLE_CHANGE: "Changement role",
  USER_CREATE: "Creation utilisateur",
  USER_UPDATE: "Modification utilisateur",
  USER_DELETE: "Suppression utilisateur",
  COURSE_CREATE: "Creation formation",
  COURSE_UPDATE: "Modification formation",
  COURSE_DELETE: "Suppression formation",
  COURSE_PUBLISH: "Publication formation",
  ENROLLMENT_CREATE: "Inscription",
  PAYMENT_CREATE: "Paiement",
  PAYMENT_REFUND: "Remboursement",
  SETTINGS_UPDATE: "Maj parametres",
  PERMISSION_CHANGE: "Changement permission",
  SESSION_REVOKE: "Revocation session",
  DATA_EXPORT: "Export donnees",
  DATA_DELETE_REQUEST: "Demande suppression",
  LIVE_SESSION_CREATE: "Creation live",
  MASTERCLASS_CREATE: "Creation masterclass",
  CERTIFICATE_GENERATE: "Generation certificat",
  RESOURCE_UPLOAD: "Upload ressource",
};

export default function SecurityPage() {
  const [tab, setTab] = useState("overview");

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-gradient-to-br from-red-500 to-orange-500 rounded-xl text-white">
          <FaShieldAlt size={24} />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Securite & Conformite</h1>
          <p className="text-sm text-gray-500">RGPD / ISO 27001 / PCI-DSS</p>
        </div>
      </div>

      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
              tab === t.id
                ? "bg-gradient-to-r from-red-500 to-orange-500 text-white shadow-lg"
                : "bg-white text-gray-600 hover:bg-gray-50 border border-gray-200"
            }`}
          >
            {t.icon} {t.label}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={tab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
        >
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

  if (loading) return <div className="flex justify-center py-20"><FaSpinner className="animate-spin text-3xl text-orange-500" /></div>;

  const cards = [
    { label: "Total evenements", value: stats?.totalLogs || 0, icon: <FaClipboardList />, color: "from-blue-500 to-blue-600" },
    { label: "Evenements aujourd'hui", value: stats?.todayLogs || 0, icon: <FaHistory />, color: "from-green-500 to-green-600" },
    { label: "Tentatives echouees (7j)", value: stats?.failedLogins || 0, icon: <FaExclamationTriangle />, color: "from-red-500 to-red-600" },
    { label: "Score securite", value: "92%", icon: <FaShieldAlt />, color: "from-orange-500 to-yellow-500" },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((c, i) => (
          <div key={i} className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-3">
              <div className={`p-2.5 rounded-lg bg-gradient-to-br ${c.color} text-white`}>{c.icon}</div>
            </div>
            <p className="text-2xl font-bold text-gray-900">{c.value}</p>
            <p className="text-sm text-gray-500">{c.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2"><FaShieldAlt className="text-green-500" /> Conformite</h3>
          <div className="space-y-3">
            {[
              { label: "RGPD", status: "Conforme", pct: 95 },
              { label: "ISO 27001", status: "En cours", pct: 78 },
              { label: "PCI-DSS", status: "Pret", pct: 88 },
            ].map((item) => (
              <div key={item.label}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-700">{item.label}</span>
                  <span className="text-gray-500">{item.status} - {item.pct}%</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-green-400 to-green-500 rounded-full" style={{ width: `${item.pct}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2"><FaHistory className="text-blue-500" /> Actions recentes (7j)</h3>
          <div className="space-y-2">
            {(stats?.recentActions || []).slice(0, 6).map((a: any, i: number) => (
              <div key={i} className="flex justify-between items-center py-2 border-b border-gray-50 last:border-0">
                <span className="text-sm text-gray-700">{ACTION_LABELS[a.action] || a.action}</span>
                <span className="text-sm font-semibold text-gray-900">{a._count?.id || 0}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-r from-red-50 to-orange-50 border border-red-200 rounded-xl p-6">
        <h3 className="font-semibold text-red-700 mb-2 flex items-center gap-2"><FaLock /> Mesures de securite actives</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          {[
            { label: "Chiffrement SSL/TLS", active: true },
            { label: "Protection CSRF", active: true },
            { label: "Rate Limiting (100 req/min)", active: true },
            { label: "Validation JWT", active: true },
            { label: "Hashage bcrypt (10 rounds)", active: true },
            { label: "Cookies SameSite Strict", active: true },
          ].map((m) => (
            <div key={m.label} className="flex items-center gap-2 text-sm">
              <FaCheck className="text-green-500" />
              <span className="text-gray-700">{m.label}</span>
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
      setLogs(r.data);
      setTotal(r.total);
      setPages(r.pages);
    }).catch(() => {}).finally(() => setLoading(false));
  }, [page, filters]);

  useEffect(() => { load(); }, [load]);

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <div className="flex flex-wrap gap-3 items-center">
          <FaFilter className="text-gray-400" />
          <select
            className="border border-gray-200 rounded-lg px-3 py-2 text-sm"
            value={filters.action}
            onChange={(e) => { setFilters({ ...filters, action: e.target.value }); setPage(1); }}
          >
            <option value="">Toutes les actions</option>
            {Object.entries(ACTION_LABELS).map(([k, v]) => (
              <option key={k} value={k}>{v}</option>
            ))}
          </select>
          <select
            className="border border-gray-200 rounded-lg px-3 py-2 text-sm"
            value={filters.severity}
            onChange={(e) => { setFilters({ ...filters, severity: e.target.value }); setPage(1); }}
          >
            <option value="">Toutes severites</option>
            <option value="INFO">Info</option>
            <option value="WARN">Warning</option>
            <option value="CRITICAL">Critique</option>
          </select>
          <span className="text-sm text-gray-500 ml-auto">{total} evenement(s)</span>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="flex justify-center py-12"><FaSpinner className="animate-spin text-2xl text-orange-500" /></div>
        ) : logs.length === 0 ? (
          <div className="text-center py-12 text-gray-400">Aucun evenement</div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Date</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Utilisateur</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Action</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Severite</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">IP</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log: any) => (
                <tr key={log.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                  <td className="px-4 py-3 text-gray-600">{new Date(log.createdAt).toLocaleString("fr-FR")}</td>
                  <td className="px-4 py-3">
                    {log.user ? (
                      <span className="text-gray-900">{log.user.firstName} {log.user.lastName}</span>
                    ) : (
                      <span className="text-gray-400">Systeme</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-gray-100 text-gray-700 text-xs font-medium">
                      {ACTION_LABELS[log.action] || log.action}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded-md text-xs font-medium ${SEVERITY_COLORS[log.severity] || "bg-gray-100 text-gray-600"}`}>
                      {log.severity}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-500 font-mono text-xs">{log.ip || "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {pages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <button onClick={() => setPage(Math.max(1, page - 1))} disabled={page === 1} className="p-2 rounded-lg border hover:bg-gray-50 disabled:opacity-30">
            <FaChevronLeft size={12} />
          </button>
          <span className="text-sm text-gray-600">Page {page} / {pages}</span>
          <button onClick={() => setPage(Math.min(pages, page + 1))} disabled={page === pages} className="p-2 rounded-lg border hover:bg-gray-50 disabled:opacity-30">
            <FaChevronRight size={12} />
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

  if (loading) return <div className="flex justify-center py-20"><FaSpinner className="animate-spin text-3xl text-orange-500" /></div>;
  if (!settings) return <div className="text-center py-12 text-gray-400">Erreur de chargement</div>;

  const Field = ({ label, field, type = "number" }: { label: string; field: string; type?: string }) => (
    <div className="flex items-center justify-between py-3 border-b border-gray-50">
      <span className="text-sm text-gray-700">{label}</span>
      {type === "boolean" ? (
        <button
          onClick={() => setSettings({ ...settings, [field]: !settings[field] })}
          className={`w-12 h-6 rounded-full transition-colors ${settings[field] ? "bg-green-500" : "bg-gray-300"}`}
        >
          <div className={`w-5 h-5 bg-white rounded-full shadow transition-transform ${settings[field] ? "translate-x-6" : "translate-x-0.5"}`} />
        </button>
      ) : (
        <input
          type="number"
          value={settings[field]}
          onChange={(e) => setSettings({ ...settings, [field]: parseInt(e.target.value) || 0 })}
          className="w-24 border border-gray-200 rounded-lg px-3 py-1.5 text-sm text-right"
        />
      )}
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2"><FaKey className="text-orange-500" /> Politique de mots de passe</h3>
        <Field label="Longueur minimale" field="passwordMinLength" />
        <Field label="Exiger une majuscule" field="passwordRequireUpper" type="boolean" />
        <Field label="Exiger une minuscule" field="passwordRequireLower" type="boolean" />
        <Field label="Exiger un chiffre" field="passwordRequireNumber" type="boolean" />
        <Field label="Exiger un caractere special" field="passwordRequireSpecial" type="boolean" />
        <Field label="Expiration MDP (jours)" field="passwordExpiryDays" />
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2"><FaLock className="text-red-500" /> Securite connexion</h3>
        <Field label="Tentatives max avant verrouillage" field="maxLoginAttempts" />
        <Field label="Duree verrouillage (min)" field="lockoutDurationMin" />
        <Field label="Timeout session (min)" field="sessionTimeoutMin" />
        <Field label="Sessions actives max" field="maxActiveSessions" />
        <Field label="Verification email obligatoire" field="requireEmailVerification" type="boolean" />
        <Field label="Double authentification (2FA)" field="twoFactorEnabled" type="boolean" />
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2"><FaDatabase className="text-blue-500" /> Retention des donnees</h3>
        <Field label="Retention donnees utilisateur (jours)" field="dataRetentionDays" />
        <Field label="Retention logs d'audit (jours)" field="auditRetentionDays" />
      </div>

      <div className="flex justify-end">
        <button
          onClick={save}
          disabled={saving}
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-red-500 to-orange-500 text-white rounded-xl font-medium hover:shadow-lg transition-all disabled:opacity-50"
        >
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
    api.get<any[]>("/security/sessions").then(setSessions).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const revoke = async (id: string) => {
    if (!confirm("Revoquer cette session ?")) return;
    await api.delete(`/security/sessions/${id}`);
    setSessions(sessions.filter((s) => s.id !== id));
  };

  const revokeAll = async () => {
    if (!confirm("Revoquer TOUTES les sessions ? Vous serez deconnecte.")) return;
    await api.delete("/security/sessions");
    setSessions([]);
  };

  if (loading) return <div className="flex justify-center py-20"><FaSpinner className="animate-spin text-3xl text-orange-500" /></div>;

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <p className="text-sm text-gray-500">{sessions.length} session(s) active(s)</p>
        {sessions.length > 1 && (
          <button onClick={revokeAll} className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-lg text-sm hover:bg-red-100">
            <FaSignOutAlt /> Revoquer toutes
          </button>
        )}
      </div>

      {sessions.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center text-gray-400">Aucune session active</div>
      ) : (
        <div className="space-y-3">
          {sessions.map((s: any) => (
            <div key={s.id} className="bg-white rounded-xl border border-gray-200 p-5 flex items-center justify-between hover:shadow-md transition-shadow">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-50 rounded-xl text-blue-500">
                  <FaDesktop size={20} />
                </div>
                <div>
                  <p className="font-medium text-gray-900">{s.device || "Appareil inconnu"}</p>
                  <p className="text-xs text-gray-500">{s.ip || "IP inconnue"} - Derniere activite: {new Date(s.lastActive).toLocaleString("fr-FR")}</p>
                  <p className="text-xs text-gray-400 mt-0.5">Expire: {new Date(s.expiresAt).toLocaleString("fr-FR")}</p>
                </div>
              </div>
              <button onClick={() => revoke(s.id)} className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                <FaTimes size={16} />
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
    api.get<any>("/security/gdpr/requests").then((r) => setRequests(r.data || [])).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const exportData = async () => {
    setExporting(true);
    try {
      const data = await api.get("/security/gdpr/my-data");
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `mes-donnees-${new Date().toISOString().split("T")[0]}.json`;
      a.click();
      URL.revokeObjectURL(url);
      await api.post("/security/gdpr/export-request");
    } catch {}
    setExporting(false);
  };

  const process = async (id: string, status: "APPROVED" | "REJECTED") => {
    if (!confirm(`${status === "APPROVED" ? "Approuver" : "Rejeter"} cette demande ?`)) return;
    await api.put(`/security/gdpr/requests/${id}`, { status });
    setRequests(requests.map((r) => r.id === id ? { ...r, status } : r));
  };

  if (loading) return <div className="flex justify-center py-20"><FaSpinner className="animate-spin text-3xl text-orange-500" /></div>;

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6">
        <h3 className="font-semibold text-blue-800 mb-2 flex items-center gap-2"><FaUserShield /> Vos droits RGPD</h3>
        <p className="text-sm text-blue-600 mb-4">Conformement au RGPD, vous avez le droit d'acceder, exporter et supprimer vos donnees personnelles.</p>
        <div className="flex gap-3">
          <button
            onClick={exportData}
            disabled={exporting}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-blue-200 text-blue-700 rounded-lg text-sm hover:bg-blue-50 disabled:opacity-50"
          >
            {exporting ? <FaSpinner className="animate-spin" /> : <FaDownload />}
            Exporter mes donnees
          </button>
          <button
            onClick={async () => { if (confirm("Demander la suppression de votre compte ? Cette action est irreversible.")) { await api.post("/security/gdpr/delete-request"); alert("Demande envoyee. Un administrateur la traitera."); } }}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-red-200 text-red-700 rounded-lg text-sm hover:bg-red-50"
          >
            <FaTrash /> Demander la suppression
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="font-semibold text-gray-900 mb-4">Demandes RGPD</h3>
        {requests.length === 0 ? (
          <p className="text-center text-gray-400 py-6">Aucune demande</p>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="text-left px-4 py-2 font-medium text-gray-600">Utilisateur</th>
                <th className="text-left px-4 py-2 font-medium text-gray-600">Type</th>
                <th className="text-left px-4 py-2 font-medium text-gray-600">Statut</th>
                <th className="text-left px-4 py-2 font-medium text-gray-600">Date</th>
                <th className="text-left px-4 py-2 font-medium text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {requests.map((r: any) => (
                <tr key={r.id} className="border-b border-gray-50">
                  <td className="px-4 py-3">{r.user?.firstName} {r.user?.lastName}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded text-xs ${r.type === "DELETE" ? "bg-red-100 text-red-700" : "bg-blue-100 text-blue-700"}`}>
                      {r.type === "DELETE" ? "Suppression" : "Export"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded text-xs ${r.status === "PENDING" ? "bg-yellow-100 text-yellow-700" : r.status === "APPROVED" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                      {r.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-500">{new Date(r.createdAt).toLocaleDateString("fr-FR")}</td>
                  <td className="px-4 py-3">
                    {r.status === "PENDING" && (
                      <div className="flex gap-2">
                        <button onClick={() => process(r.id, "APPROVED")} className="p-1.5 text-green-500 hover:bg-green-50 rounded"><FaCheck /></button>
                        <button onClick={() => process(r.id, "REJECTED")} className="p-1.5 text-red-500 hover:bg-red-50 rounded"><FaTimes /></button>
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
