"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useI18n } from "@/context/i18n-context";
import {
  FaSearch, FaTimes, FaSpinner, FaUserShield, FaEnvelope,
  FaUsers, FaBookOpen, FaCalendarAlt, FaUserTie, FaPaperPlane,
  FaCheck, FaChevronLeft, FaChevronRight, FaShieldAlt, FaGraduationCap,
  FaChalkboardTeacher, FaEdit, FaExclamationTriangle, FaLock, FaEye,
  FaCog, FaTrash, FaUserPlus, FaClipboardList,
} from "react-icons/fa";
import api from "@/lib/api";

interface Student {
  id: string; firstName: string; lastName: string; email: string;
  role: string; createdAt: string; phone?: string; emailVerified?: boolean;
  enrollments?: { id: string; progress: number; status: string; course: { id: string; title: string; slug: string; instructor?: { firstName: string; lastName: string } | null } }[];
  courses?: { id: string; title: string; _count?: { enrollments: number } }[];
}

const ROLES = [
  { key: "STUDENT", label: "Etudiant", icon: <FaGraduationCap />, color: "bg-emerald-400/10 text-emerald-400 border-emerald-400/20" },
  { key: "INSTRUCTOR", label: "Formateur", icon: <FaChalkboardTeacher />, color: "bg-blue-400/10 text-blue-400 border-blue-400/20" },
  { key: "MODERATOR", label: "Moderateur", icon: <FaUserShield />, color: "bg-purple-400/10 text-purple-400 border-purple-400/20" },
  { key: "ADMIN", label: "Admin", icon: <FaShieldAlt />, color: "bg-red-400/10 text-red-400 border-red-400/20" },
  { key: "SUPER_ADMIN", label: "Super Admin", icon: <FaShieldAlt />, color: "bg-amber-400/10 text-amber-400 border-amber-400/20" },
];

const PERMISSIONS_MAP: Record<string, { label: string; icon: JSX.Element }[]> = {
  STUDENT: [
    { label: "Consulter les formations", icon: <FaEye /> },
    { label: "S'inscrire aux cours", icon: <FaUserPlus /> },
    { label: "Suivre sa progression", icon: <FaClipboardList /> },
  ],
  INSTRUCTOR: [
    { label: "Creer et gerer ses formations", icon: <FaBookOpen /> },
    { label: "Gerer les modules et lecons", icon: <FaCog /> },
    { label: "Voir les etudiants inscrits", icon: <FaUsers /> },
    { label: "Ajouter des ressources (PDF, audio)", icon: <FaClipboardList /> },
    { label: "Creer des quiz", icon: <FaEdit /> },
  ],
  MODERATOR: [
    { label: "Moderer les contenus", icon: <FaShieldAlt /> },
    { label: "Gerer les commentaires", icon: <FaEdit /> },
    { label: "Voir les transactions", icon: <FaEye /> },
    { label: "Gerer les messages contact", icon: <FaEnvelope /> },
    { label: "Acces lecture au dashboard", icon: <FaClipboardList /> },
  ],
  ADMIN: [
    { label: "Acces complet au dashboard", icon: <FaCog /> },
    { label: "Gerer tous les utilisateurs", icon: <FaUsers /> },
    { label: "Creer/modifier/supprimer les formations", icon: <FaBookOpen /> },
    { label: "Voir toutes les transactions", icon: <FaEye /> },
    { label: "Gerer les formateurs", icon: <FaChalkboardTeacher /> },
    { label: "Envoyer des invitations", icon: <FaPaperPlane /> },
    { label: "Gerer les sessions live", icon: <FaCalendarAlt /> },
  ],
  SUPER_ADMIN: [
    { label: "Tous les droits Administrateur", icon: <FaShieldAlt /> },
    { label: "Changer les roles de tous les membres", icon: <FaUserShield /> },
    { label: "Supprimer des comptes", icon: <FaTrash /> },
    { label: "Configurer les paiements", icon: <FaCog /> },
    { label: "Acces aux logs et statistiques avancees", icon: <FaClipboardList /> },
    { label: "Gerer les habilitations", icon: <FaLock /> },
  ],
};

const PAGE_SIZE = 10;

export default function AdminUtilisateurs() {
  const { t, locale } = useI18n();
  const [users, setUsers] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterRole, setFilterRole] = useState<string>("ALL");
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<Student | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [inviteModal, setInviteModal] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState<"INSTRUCTOR" | "MODERATOR" | "ADMIN">("INSTRUCTOR");
  const [inviting, setInviting] = useState(false);
  const [changingRole, setChangingRole] = useState<string | null>(null);
  const [toast, setToast] = useState<{ msg: string; type: "success" | "error" } | null>(null);
  const [activeTab, setActiveTab] = useState<"users" | "instructors" | "roles">("users");
  const [confirmModal, setConfirmModal] = useState<{
    title: string; message: string; action: () => Promise<void>; type: "warning" | "danger" | "info";
  } | null>(null);
  const [confirmLoading, setConfirmLoading] = useState(false);

  useEffect(() => {
    api.get<Student[]>("/users?limit=200")
      .then(setUsers)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const showToast = (msg: string, type: "success" | "error" = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  const openDetail = async (s: Student) => {
    setSelected(s);
    setDetailLoading(true);
    try {
      const detail = await api.get<Student>(`/users/${s.id}`);
      setSelected(detail);
    } catch {} finally { setDetailLoading(false); }
  };

  const doChangeRole = async (userId: string, newRole: string) => {
    setChangingRole(userId);
    try {
      await api.put(`/auth/users/${userId}/role`, { role: newRole });
      setUsers((prev) => prev.map((u) => u.id === userId ? { ...u, role: newRole } : u));
      if (selected?.id === userId) setSelected((prev) => prev ? { ...prev, role: newRole } : null);
      showToast("Role mis a jour avec succes !");
    } catch { showToast("Erreur lors du changement de role", "error"); }
    finally { setChangingRole(null); }
  };

  const handleChangeRole = (userId: string, newRole: string) => {
    const user = users.find(u => u.id === userId);
    const roleName = ROLES.find(r => r.key === newRole)?.label || newRole;
    setConfirmModal({
      title: "Confirmer le changement de role",
      message: `Etes-vous sur de vouloir changer le role de ${user?.firstName} ${user?.lastName} en "${roleName}" ? Cette action modifiera ses droits d'acces immediatement.`,
      type: newRole === "SUPER_ADMIN" || newRole === "ADMIN" ? "danger" : "warning",
      action: async () => { await doChangeRole(userId, newRole); },
    });
  };

  const handleInvite = async () => {
    if (!inviteEmail) return;
    setConfirmModal({
      title: "Confirmer l'envoi de l'invitation",
      message: `Envoyer une invitation a ${inviteEmail} en tant que ${ROLES.find(r => r.key === inviteRole)?.label} ? Un email sera envoye avec un lien d'inscription.`,
      type: "info",
      action: async () => {
        setInviting(true);
        try {
          await api.post("/invitations", { email: inviteEmail, role: inviteRole });
          showToast("Invitation envoyee avec succes !");
          setInviteModal(false);
          setInviteEmail("");
        } catch (err: any) {
          showToast(err?.message || "Erreur lors de l'envoi", "error");
        } finally { setInviting(false); }
      },
    });
  };

  const executeConfirm = async () => {
    if (!confirmModal) return;
    setConfirmLoading(true);
    try {
      await confirmModal.action();
    } finally {
      setConfirmLoading(false);
      setConfirmModal(null);
    }
  };

  const filtered = users.filter((s) => {
    const matchSearch = `${s.firstName} ${s.lastName}`.toLowerCase().includes(search.toLowerCase()) || s.email.toLowerCase().includes(search.toLowerCase());
    const matchRole = filterRole === "ALL" || s.role === filterRole;
    return matchSearch && matchRole;
  });

  const instructors = users.filter((u) => u.role === "INSTRUCTOR" || u.role === "ADMIN" || u.role === "MODERATOR");
  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const getRoleStyle = (r: string) => ROLES.find((x) => x.key === r) || ROLES[0];

  if (loading) return <div className="flex items-center justify-center h-64"><FaSpinner className="text-gold text-2xl animate-spin" /></div>;

  return (
    <>
      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div initial={{ opacity: 0, y: -30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
            className={`fixed top-6 right-6 z-[100] flex items-center gap-3 px-6 py-4 rounded-2xl shadow-2xl border text-sm font-medium backdrop-blur-md ${
              toast.type === "success" ? "bg-emerald-500/15 border-emerald-500/20 text-emerald-400" : "bg-red-500/15 border-red-500/20 text-red-400"
            }`}>
            {toast.type === "success" ? <FaCheck /> : <FaTimes />}{toast.msg}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Confirmation Modal */}
      <AnimatePresence>
        {confirmModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[90] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
            onClick={() => !confirmLoading && setConfirmModal(null)}>
            <motion.div initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 400 }}
              className="bg-[#0d1a2e] border border-gold/10 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden" onClick={(e) => e.stopPropagation()}>
              <div className={`p-5 border-b border-white/[0.06] flex items-center gap-3 ${
                confirmModal.type === "danger" ? "bg-red-500/5" : confirmModal.type === "warning" ? "bg-amber-500/5" : "bg-gold/5"
              }`}>
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                  confirmModal.type === "danger" ? "bg-red-500/15 text-red-400" : confirmModal.type === "warning" ? "bg-amber-500/15 text-amber-400" : "bg-gold/15 text-gold"
                }`}>
                  <FaExclamationTriangle className="text-lg" />
                </div>
                <h2 className="text-white font-bold text-base">{confirmModal.title}</h2>
              </div>
              <div className="p-5">
                <p className="text-white/60 text-sm leading-relaxed mb-6">{confirmModal.message}</p>
                <div className="flex gap-3">
                  <button onClick={() => setConfirmModal(null)} disabled={confirmLoading}
                    className="flex-1 py-3 rounded-xl border border-white/[0.08] text-white/50 text-sm font-medium hover:bg-white/[0.04] transition-all disabled:opacity-40">
                    Annuler
                  </button>
                  <button onClick={executeConfirm} disabled={confirmLoading}
                    className={`flex-1 py-3 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all disabled:opacity-60 ${
                      confirmModal.type === "danger" ? "bg-red-500 text-white hover:bg-red-600" :
                      confirmModal.type === "warning" ? "bg-amber-500 text-navy hover:bg-amber-400" :
                      "bg-gradient-to-r from-gold to-gold-light text-navy"
                    }`}>
                    {confirmLoading ? <FaSpinner className="animate-spin" /> : <FaCheck className="text-xs" />}
                    {confirmLoading ? "En cours..." : "Confirmer"}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-white">Gestion des membres</h1>
            <p className="text-white/30 text-sm">{users.length} utilisateur(s) au total</p>
          </div>
          <button onClick={() => setInviteModal(true)}
            className="flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-gold to-gold-light text-navy text-sm font-bold hover:shadow-lg hover:shadow-gold/20 transition-all">
            <FaUserShield className="text-xs" /> Inviter un membre
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {[
            { label: "Total", value: users.length, color: "text-white", icon: <FaUsers /> },
            { label: "Etudiants", value: users.filter(s => s.role === "STUDENT").length, color: "text-emerald-400", icon: <FaGraduationCap /> },
            { label: "Formateurs", value: users.filter(s => s.role === "INSTRUCTOR").length, color: "text-blue-400", icon: <FaChalkboardTeacher /> },
            { label: "Moderateurs", value: users.filter(s => s.role === "MODERATOR").length, color: "text-purple-400", icon: <FaUserShield /> },
            { label: "Admins", value: users.filter(s => s.role === "ADMIN" || s.role === "SUPER_ADMIN").length, color: "text-red-400", icon: <FaShieldAlt /> },
          ].map(s => (
            <div key={s.label} className="rounded-xl bg-white/[0.02] border border-white/[0.06] p-4 flex items-center gap-3">
              <div className={`text-lg ${s.color}`}>{s.icon}</div>
              <div>
                <div className="text-white/30 text-[10px] uppercase">{s.label}</div>
                <div className={`text-xl font-bold ${s.color}`}>{s.value}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-1 p-1 rounded-xl bg-white/[0.02] border border-white/[0.06] w-fit">
          {[
            { id: "users" as const, label: "Tous les membres", icon: <FaUsers className="text-[10px]" /> },
            { id: "instructors" as const, label: "Equipe", icon: <FaChalkboardTeacher className="text-[10px]" /> },
            { id: "roles" as const, label: "Roles & Habilitations", icon: <FaLock className="text-[10px]" /> },
          ].map((tab) => (
            <button key={tab.id} onClick={() => { setActiveTab(tab.id); setPage(1); }}
              className={`px-5 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${activeTab === tab.id ? "bg-gold text-navy" : "text-white/40 hover:text-white"}`}>
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>

        {/* TAB: Users */}
        {activeTab === "users" && (
          <>
            <div className="flex flex-wrap items-center gap-3">
              <div className="relative flex-1 max-w-sm">
                <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 text-sm" />
                <input type="text" placeholder="Rechercher..." value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                  className="w-full pl-11 pr-4 py-3 rounded-xl bg-white/[0.04] border border-white/[0.06] text-white placeholder:text-white/20 text-sm focus:outline-none focus:border-gold/30" />
              </div>
              <div className="flex gap-2 flex-wrap">
                {[{ key: "ALL", label: "Tous" }, ...ROLES.map(r => ({ key: r.key, label: r.label }))].map((r) => (
                  <button key={r.key} onClick={() => { setFilterRole(r.key); setPage(1); }}
                    className={`px-3 py-2 rounded-lg text-xs font-medium transition-all ${filterRole === r.key ? "bg-gold text-navy" : "bg-white/[0.04] text-white/40 hover:text-white border border-white/[0.06]"}`}>
                    {r.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="rounded-2xl bg-white/[0.02] border border-white/[0.06] overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/[0.04]">
                    {["Utilisateur", "Email", "Role", "Statut", "Date", "Actions"].map((h) => (
                      <th key={h} className="text-left text-white/25 text-[10px] font-medium uppercase tracking-wider px-4 py-3">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {paginated.map((s) => {
                    const roleStyle = getRoleStyle(s.role);
                    return (
                      <tr key={s.id} className="border-b border-white/[0.02] hover:bg-white/[0.015] transition-colors">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3 cursor-pointer" onClick={() => openDetail(s)}>
                            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-gold/30 to-gold-light/20 flex items-center justify-center text-[10px] font-bold text-gold">
                              {s.firstName?.[0]}{s.lastName?.[0] || ""}
                            </div>
                            <span className="text-sm font-medium text-white">{s.firstName} {s.lastName}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-xs text-white/40">{s.email}</td>
                        <td className="px-4 py-3">
                          <span className={`px-2.5 py-1 rounded-full text-[10px] font-medium border ${roleStyle.color}`}>
                            {roleStyle.label}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${s.emailVerified ? "bg-emerald-400/10 text-emerald-400" : "bg-amber-400/10 text-amber-400"}`}>
                            {s.emailVerified ? "Verifie" : "En attente"}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-xs text-white/25">{new Date(s.createdAt).toLocaleDateString("fr-FR")}</td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <button onClick={() => openDetail(s)} className="text-white/20 hover:text-gold text-xs transition-colors" title="Voir details">
                              <FaEye />
                            </button>
                            <div className="relative group">
                              <button className="text-white/20 hover:text-gold text-xs transition-colors" title="Changer le role">
                                <FaEdit />
                              </button>
                              <div className="absolute right-0 top-full mt-1 bg-[#0d1a2e] border border-gold/10 rounded-xl shadow-2xl p-2 min-w-[140px] hidden group-hover:block z-50">
                                {ROLES.filter(r => r.key !== s.role).map((r) => (
                                  <button key={r.key} onClick={() => handleChangeRole(s.id, r.key)}
                                    disabled={changingRole === s.id}
                                    className="w-full text-left px-3 py-2 rounded-lg text-xs text-white/60 hover:bg-gold/10 hover:text-gold transition-all flex items-center gap-2 disabled:opacity-40">
                                    {r.icon} {r.label}
                                  </button>
                                ))}
                              </div>
                            </div>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                  {paginated.length === 0 && (
                    <tr><td colSpan={6} className="text-center py-12 text-white/20 text-sm">Aucun utilisateur trouve</td></tr>
                  )}
                </tbody>
              </table>
            </div>

            {totalPages > 1 && (
              <div className="flex items-center justify-between">
                <p className="text-white/25 text-xs">
                  {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, filtered.length)} sur {filtered.length}
                </p>
                <div className="flex items-center gap-2">
                  <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}
                    className="w-8 h-8 rounded-lg bg-white/[0.04] border border-white/[0.06] flex items-center justify-center text-white/40 hover:text-gold disabled:opacity-30 transition-all">
                    <FaChevronLeft className="text-xs" />
                  </button>
                  {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                    const start = Math.max(1, page - 2);
                    return start + i;
                  }).filter(p => p <= totalPages).map((p) => (
                    <button key={p} onClick={() => setPage(p)}
                      className={`w-8 h-8 rounded-lg text-xs font-medium transition-all ${page === p ? "bg-gold text-navy" : "bg-white/[0.04] border border-white/[0.06] text-white/40 hover:text-gold"}`}>
                      {p}
                    </button>
                  ))}
                  <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages}
                    className="w-8 h-8 rounded-lg bg-white/[0.04] border border-white/[0.06] flex items-center justify-center text-white/40 hover:text-gold disabled:opacity-30 transition-all">
                    <FaChevronRight className="text-xs" />
                  </button>
                </div>
              </div>
            )}
          </>
        )}

        {/* TAB: Instructors / Team */}
        {activeTab === "instructors" && (
          <div className="space-y-4">
            <p className="text-white/30 text-sm">{instructors.length} membre(s) de l&apos;equipe</p>
            <div className="grid md:grid-cols-2 gap-4">
              {instructors.map((inst) => {
                const perms = PERMISSIONS_MAP[inst.role] || [];
                return (
                  <motion.div key={inst.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                    className="rounded-2xl bg-white/[0.02] border border-white/[0.06] p-5 hover:border-gold/15 transition-all">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-gold/30 to-gold-light/20 flex items-center justify-center text-gold font-bold text-base">
                          {inst.firstName?.[0]}{inst.lastName?.[0] || ""}
                        </div>
                        <div>
                          <h3 className="text-white font-bold text-sm">{inst.firstName} {inst.lastName}</h3>
                          <p className="text-white/30 text-xs">{inst.email}</p>
                        </div>
                      </div>
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-medium border ${getRoleStyle(inst.role).color}`}>
                        {getRoleStyle(inst.role).label}
                      </span>
                    </div>
                    <div className="space-y-2">
                      <p className="text-white/20 text-[10px] uppercase tracking-wider mb-2">Habilitations</p>
                      <div className="flex flex-wrap gap-1.5">
                        {perms.slice(0, 4).map((perm) => (
                          <span key={perm.label} className="px-2 py-1 rounded-full bg-gold/10 text-gold text-[10px] flex items-center gap-1">
                            <FaCheck className="text-[7px]" /> {perm.label}
                          </span>
                        ))}
                        {perms.length > 4 && (
                          <span className="px-2 py-1 rounded-full bg-white/[0.04] text-white/30 text-[10px]">+{perms.length - 4} autres</span>
                        )}
                      </div>
                    </div>
                    <div className="mt-4 pt-4 border-t border-white/[0.04] flex items-center justify-between">
                      <div className="flex gap-2">
                        {ROLES.filter(r => r.key !== inst.role && r.key !== "STUDENT").slice(0, 3).map((r) => (
                          <button key={r.key} onClick={() => handleChangeRole(inst.id, r.key)}
                            disabled={changingRole === inst.id}
                            className="text-[10px] text-white/30 hover:text-gold transition-colors flex items-center gap-1 disabled:opacity-50 px-2 py-1 rounded-lg hover:bg-gold/5">
                            {changingRole === inst.id ? <FaSpinner className="animate-spin text-[8px]" /> : <FaEdit className="text-[8px]" />}
                            {r.label}
                          </button>
                        ))}
                      </div>
                      <button onClick={() => openDetail(inst)} className="text-xs text-white/20 hover:text-gold transition-colors">Details →</button>
                    </div>
                  </motion.div>
                );
              })}
              {instructors.length === 0 && (
                <div className="col-span-2 text-center py-16 text-white/20">
                  <FaChalkboardTeacher className="text-3xl mx-auto mb-3 opacity-30" />
                  <p className="text-sm">Aucun membre dans l&apos;equipe. Invitez-en un !</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB: Roles & Habilitations */}
        {activeTab === "roles" && (
          <div className="space-y-6">
            <p className="text-white/40 text-sm">Vue d&apos;ensemble des roles et permissions associees sur la plateforme.</p>
            <div className="grid gap-4">
              {ROLES.map((role) => {
                const perms = PERMISSIONS_MAP[role.key] || [];
                const count = users.filter(u => u.role === role.key).length;
                return (
                  <motion.div key={role.key} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                    className="rounded-2xl bg-white/[0.02] border border-white/[0.06] overflow-hidden hover:border-gold/10 transition-all">
                    <div className="p-5 flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-lg ${role.color} border`}>
                          {role.icon}
                        </div>
                        <div>
                          <h3 className="text-white font-bold text-base">{role.label}</h3>
                          <p className="text-white/30 text-xs">{count} utilisateur(s) avec ce role</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className={`px-3 py-1.5 rounded-full text-xs font-medium border ${role.color}`}>
                          {perms.length} permission(s)
                        </span>
                      </div>
                    </div>
                    <div className="px-5 pb-5">
                      <div className="bg-white/[0.02] rounded-xl border border-white/[0.04] p-4">
                        <p className="text-white/25 text-[10px] uppercase tracking-wider mb-3 flex items-center gap-2">
                          <FaLock className="text-gold text-[9px]" /> Permissions
                        </p>
                        <div className="grid md:grid-cols-2 gap-2">
                          {perms.map((perm) => (
                            <div key={perm.label} className="flex items-center gap-2.5 py-1.5">
                              <div className="w-6 h-6 rounded-lg bg-gold/10 flex items-center justify-center text-gold text-[10px]">
                                {perm.icon}
                              </div>
                              <span className="text-white/60 text-xs">{perm.label}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                      {count > 0 && (
                        <div className="mt-3 flex items-center gap-2 flex-wrap">
                          <span className="text-white/20 text-[10px]">Membres :</span>
                          {users.filter(u => u.role === role.key).slice(0, 5).map(u => (
                            <button key={u.id} onClick={() => openDetail(u)}
                              className="px-2 py-0.5 rounded-full bg-white/[0.04] border border-white/[0.06] text-white/50 text-[10px] hover:text-gold hover:border-gold/20 transition-all">
                              {u.firstName} {u.lastName?.[0]}.
                            </button>
                          ))}
                          {count > 5 && <span className="text-white/20 text-[10px]">+{count - 5} autres</span>}
                        </div>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Detail Modal */}
      <AnimatePresence>
        {selected && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[80] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" onClick={() => setSelected(null)}>
            <motion.div initial={{ opacity: 0, scale: 0.92, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.92, y: 20 }}
              className="bg-[#0d1a2e] border border-gold/10 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden max-h-[85vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
              <div className="relative bg-gradient-to-br from-gold/10 to-transparent p-6 border-b border-white/[0.06]">
                <button onClick={() => setSelected(null)} className="absolute top-4 right-4 text-white/30 hover:text-white"><FaTimes /></button>
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-gold to-gold-light flex items-center justify-center text-navy font-bold text-lg">
                    {selected.firstName?.[0]}{selected.lastName?.[0] || ""}
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-white">{selected.firstName} {selected.lastName}</h2>
                    <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full border ${getRoleStyle(selected.role).color}`}>{getRoleStyle(selected.role).label}</span>
                  </div>
                </div>
              </div>
              <div className="p-6 space-y-5">
                {detailLoading ? (
                  <div className="flex justify-center py-8"><FaSpinner className="text-gold animate-spin text-xl" /></div>
                ) : (
                  <>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-white/[0.02] rounded-xl p-3 border border-white/[0.04]">
                        <div className="flex items-center gap-2 text-white/30 text-[10px] uppercase mb-1"><FaEnvelope className="text-gold text-[10px]" /> Email</div>
                        <div className="text-white text-sm break-all">{selected.email}</div>
                      </div>
                      <div className="bg-white/[0.02] rounded-xl p-3 border border-white/[0.04]">
                        <div className="flex items-center gap-2 text-white/30 text-[10px] uppercase mb-1"><FaCalendarAlt className="text-gold text-[10px]" /> Inscription</div>
                        <div className="text-white text-sm">{new Date(selected.createdAt).toLocaleDateString("fr-FR")}</div>
                      </div>
                    </div>

                    {/* Habilitations in detail */}
                    <div>
                      <p className="text-white/30 text-[10px] uppercase tracking-wider mb-3 flex items-center gap-2">
                        <FaLock className="text-gold text-[9px]" /> Habilitations actuelles
                      </p>
                      <div className="bg-white/[0.02] rounded-xl border border-white/[0.04] p-3 space-y-1.5">
                        {(PERMISSIONS_MAP[selected.role] || []).map((perm) => (
                          <div key={perm.label} className="flex items-center gap-2 py-1">
                            <FaCheck className="text-gold text-[8px]" />
                            <span className="text-white/50 text-xs">{perm.label}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Change role */}
                    <div>
                      <p className="text-white/30 text-[10px] uppercase tracking-wider mb-3">Changer le role</p>
                      <div className="flex flex-wrap gap-2">
                        {ROLES.map((r) => (
                          <button key={r.key} onClick={() => handleChangeRole(selected.id, r.key)}
                            disabled={selected.role === r.key || changingRole === selected.id}
                            className={`py-2 px-3 rounded-xl text-xs font-medium border transition-all disabled:opacity-40 flex items-center gap-1.5 ${
                              selected.role === r.key ? `${r.color} opacity-100` : "border-white/[0.08] text-white/40 hover:text-white hover:border-gold/20"
                            }`}>
                            {r.icon} {r.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {selected.enrollments && selected.enrollments.length > 0 && (
                      <div>
                        <h3 className="text-white/50 text-xs font-medium uppercase tracking-wider mb-3 flex items-center gap-2">
                          <FaBookOpen className="text-gold text-[10px]" /> Formations ({selected.enrollments.length})
                        </h3>
                        <div className="space-y-2">
                          {selected.enrollments.map((e) => (
                            <div key={e.id} className="bg-white/[0.02] rounded-xl p-3 border border-white/[0.04]">
                              <div className="flex justify-between mb-1.5">
                                <span className="text-white text-sm">{e.course.title}</span>
                                <span className="text-gold text-xs font-bold">{e.progress}%</span>
                              </div>
                              <div className="w-full h-1 bg-white/[0.05] rounded-full overflow-hidden">
                                <div className="h-full bg-gradient-to-r from-gold to-gold-light rounded-full" style={{ width: `${e.progress}%` }} />
                              </div>
                              {e.course.instructor && (
                                <div className="flex items-center gap-1.5 text-white/30 text-[10px] mt-1">
                                  <FaUserTie className="text-[8px]" /> {e.course.instructor.firstName} {e.course.instructor.lastName}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {(!selected.enrollments || selected.enrollments.length === 0) && (
                      <div className="text-center py-6 text-white/20 text-sm">
                        <FaBookOpen className="text-2xl mx-auto mb-2 opacity-30" />
                        Aucune formation inscrite
                      </div>
                    )}
                  </>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Invite Modal */}
      <AnimatePresence>
        {inviteModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[80] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" onClick={() => !inviting && setInviteModal(false)}>
            <motion.div initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.92 }}
              className="bg-[#0d1a2e] border border-gold/10 rounded-2xl w-full max-w-sm shadow-2xl" onClick={(e) => e.stopPropagation()}>
              <div className="p-5 border-b border-white/[0.06] flex items-center justify-between">
                <h2 className="text-white font-bold flex items-center gap-2"><FaUserShield className="text-gold text-sm" /> Inviter un membre</h2>
                <button onClick={() => setInviteModal(false)} className="text-white/30 hover:text-white"><FaTimes /></button>
              </div>
              <div className="p-5 space-y-4">
                <div>
                  <label className="block text-white/40 text-xs mb-1.5 uppercase tracking-wider">Email</label>
                  <input type="email" value={inviteEmail} onChange={(e) => setInviteEmail(e.target.value)} placeholder="email@exemple.com"
                    className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white placeholder:text-white/20 text-sm focus:outline-none focus:border-gold/40" />
                </div>
                <div>
                  <label className="block text-white/40 text-xs mb-1.5 uppercase tracking-wider">Role</label>
                  <div className="grid grid-cols-3 gap-2">
                    {([{ key: "INSTRUCTOR" as const, label: "Formateur", icon: <FaChalkboardTeacher /> }, { key: "MODERATOR" as const, label: "Moderateur", icon: <FaUserShield /> }, { key: "ADMIN" as const, label: "Admin", icon: <FaShieldAlt /> }]).map(r => (
                      <button key={r.key} onClick={() => setInviteRole(r.key)}
                        className={`py-3 rounded-xl text-xs font-medium border transition-all flex flex-col items-center gap-1.5 ${inviteRole === r.key ? "border-gold/30 bg-gold/10 text-gold" : "border-white/[0.08] text-white/40 hover:text-white/60"}`}>
                        {r.icon}
                        {r.label}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="bg-white/[0.02] rounded-xl border border-white/[0.04] p-3">
                  <p className="text-white/25 text-[10px] uppercase mb-2">Permissions associees</p>
                  <div className="space-y-1">
                    {(PERMISSIONS_MAP[inviteRole] || []).slice(0, 3).map(p => (
                      <div key={p.label} className="flex items-center gap-2 text-white/40 text-[10px]">
                        <FaCheck className="text-gold text-[7px]" /> {p.label}
                      </div>
                    ))}
                  </div>
                </div>
                <button onClick={handleInvite} disabled={inviting || !inviteEmail}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-gold to-gold-light text-navy font-bold text-sm disabled:opacity-60 flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-gold/20 transition-all">
                  {inviting ? <><FaSpinner className="animate-spin" /> Envoi...</> : <><FaPaperPlane className="text-xs" /> Envoyer l&apos;invitation</>}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
