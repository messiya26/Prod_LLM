"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useI18n } from "@/context/i18n-context";
import { FaSearch, FaTimes, FaSpinner, FaUserShield, FaEnvelope, FaUsers, FaBookOpen, FaCalendarAlt, FaUserTie, FaPaperPlane, FaCheck } from "react-icons/fa";
import api from "@/lib/api";

interface Student {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  createdAt: string;
  phone?: string;
  enrollments?: { id: string; progress: number; status: string; course: { id: string; title: string; slug: string; instructor?: { firstName: string; lastName: string } | null } }[];
}

export default function AdminUtilisateurs() {
  const { t, locale } = useI18n();
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Student | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [inviteModal, setInviteModal] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState<"INSTRUCTOR" | "ADMIN">("INSTRUCTOR");
  const [inviting, setInviting] = useState(false);
  const [toast, setToast] = useState<{ msg: string; type: "success" | "error" } | null>(null);

  useEffect(() => {
    api.get<Student[]>("/users?limit=100")
      .then(setStudents)
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

  const handleInvite = async () => {
    if (!inviteEmail) return;
    setInviting(true);
    try {
      await api.post("/users/invite", { email: inviteEmail, role: inviteRole });
      showToast("Invitation envoyee !");
      setInviteModal(false);
      setInviteEmail("");
    } catch (err: any) {
      showToast(err?.message || "Erreur lors de l'envoi", "error");
    } finally { setInviting(false); }
  };

  const filtered = students.filter((s) =>
    `${s.firstName} ${s.lastName}`.toLowerCase().includes(search.toLowerCase()) ||
    s.email.toLowerCase().includes(search.toLowerCase())
  );

  const roleColor = (r: string) => r === "ADMIN" ? "bg-red-400/10 text-red-400" : r === "INSTRUCTOR" ? "bg-blue-400/10 text-blue-400" : "bg-emerald-400/10 text-emerald-400";
  const roleLabel = (r: string) => r === "ADMIN" ? "Admin" : r === "INSTRUCTOR" ? "Formateur" : "Etudiant";

  if (loading) return <div className="flex items-center justify-center h-64"><FaSpinner className="text-gold text-2xl animate-spin" /></div>;

  return (
    <>
      <AnimatePresence>
        {toast && (
          <motion.div initial={{ opacity: 0, y: -30, scale: 0.9 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -20 }}
            className={`fixed top-6 right-6 z-[100] flex items-center gap-3 px-6 py-4 rounded-2xl shadow-2xl backdrop-blur-xl border ${
              toast.type === "success" ? "bg-emerald-500/15 border-emerald-500/20 text-emerald-400" : "bg-red-500/15 border-red-500/20 text-red-400"
            }`}>
            {toast.type === "success" ? <FaCheck /> : <FaTimes />}
            <span className="text-sm font-medium">{toast.msg}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-white">{t("dash.students")}</h1>
            <p className="text-white/30 text-sm">{filtered.length} utilisateur(s)</p>
          </div>
          <button onClick={() => setInviteModal(true)}
            className="flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-gold to-gold-light text-navy text-sm font-bold hover:shadow-lg hover:shadow-gold/20 transition-all active:scale-95">
            <FaUserShield className="text-xs" /> Inviter un membre
          </button>
        </div>

        <div className="grid grid-cols-3 gap-4">
          {[
            { label: "Total", value: students.length, color: "text-white" },
            { label: "Etudiants", value: students.filter(s => s.role === "STUDENT").length, color: "text-emerald-400" },
            { label: "Admin / Formateurs", value: students.filter(s => s.role !== "STUDENT").length, color: "text-blue-400" },
          ].map(s => (
            <div key={s.label} className="rounded-xl bg-white/[0.02] border border-white/[0.06] p-4">
              <div className="text-white/30 text-xs mb-1">{s.label}</div>
              <div className={`text-xl font-bold ${s.color}`}>{s.value}</div>
            </div>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <div className="relative flex-1 max-w-md">
            <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 text-sm" />
            <input type="text" placeholder={t("dash.search")} value={search} onChange={(e) => setSearch(e.target.value)} className="w-full pl-11 pr-4 py-3 rounded-xl bg-white/[0.04] border border-white/[0.06] text-white placeholder:text-white/20 text-sm focus:outline-none focus:border-gold/30 transition-all" />
          </div>
        </div>

        <div className="rounded-2xl bg-white/[0.02] border border-white/[0.06] overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/[0.04]">
                {["Utilisateur", "Email", "Role", "Date d'inscription", ""].map((h) => (
                  <th key={h} className="text-left text-white/25 text-[10px] font-medium uppercase tracking-wider px-6 py-3">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((s) => (
                <tr key={s.id} className="border-b border-white/[0.02] hover:bg-white/[0.015] transition-colors cursor-pointer" onClick={() => openDetail(s)}>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-gold/30 to-gold-light/20 flex items-center justify-center text-[10px] font-bold text-gold">
                        {s.firstName?.[0]}{s.lastName?.[0]}
                      </div>
                      <span className="text-sm font-medium text-white">{s.firstName} {s.lastName}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-xs text-white/40">{s.email}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-medium ${roleColor(s.role)}`}>{roleLabel(s.role)}</span>
                  </td>
                  <td className="px-6 py-4 text-xs text-white/25">{new Date(s.createdAt).toLocaleDateString("fr-FR")}</td>
                  <td className="px-6 py-4 text-white/20 hover:text-white/50 text-xs">Voir &rarr;</td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={5} className="text-center py-12 text-white/20 text-sm">Aucun utilisateur trouve</td></tr>
              )}
            </tbody>
          </table>
        </div>
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
                    {selected.firstName?.[0]}{selected.lastName?.[0]}
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-white">{selected.firstName} {selected.lastName}</h2>
                    <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${roleColor(selected.role)}`}>{roleLabel(selected.role)}</span>
                  </div>
                </div>
              </div>
              <div className="p-6 space-y-5">
                {detailLoading ? (
                  <div className="flex justify-center py-8"><FaSpinner className="text-gold animate-spin text-xl" /></div>
                ) : (
                  <>
                    <div className="grid grid-cols-2 gap-3">
                      {[
                        { icon: <FaEnvelope className="text-xs text-gold" />, label: "Email", value: selected.email },
                        { icon: <FaCalendarAlt className="text-xs text-gold" />, label: "Inscription", value: new Date(selected.createdAt).toLocaleDateString("fr-FR") },
                      ].map(item => (
                        <div key={item.label} className="bg-white/[0.02] rounded-xl p-3 border border-white/[0.04]">
                          <div className="flex items-center gap-2 text-white/30 text-[10px] uppercase tracking-wider mb-1">{item.icon} {item.label}</div>
                          <div className="text-white text-sm">{item.value}</div>
                        </div>
                      ))}
                    </div>

                    {selected.enrollments && selected.enrollments.length > 0 && (
                      <div>
                        <h3 className="text-white/50 text-xs font-medium uppercase tracking-wider mb-3 flex items-center gap-2">
                          <FaBookOpen className="text-gold text-[10px]" /> Formations inscrites ({selected.enrollments.length})
                        </h3>
                        <div className="space-y-2">
                          {selected.enrollments.map((e) => (
                            <div key={e.id} className="bg-white/[0.02] rounded-xl p-3 border border-white/[0.04]">
                              <div className="flex items-center justify-between mb-2">
                                <span className="text-white text-sm font-medium">{e.course.title}</span>
                                <span className="text-gold text-xs font-bold">{e.progress}%</span>
                              </div>
                              <div className="w-full h-1.5 bg-white/[0.05] rounded-full overflow-hidden mb-2">
                                <div className="h-full rounded-full bg-gradient-to-r from-gold to-gold-light" style={{ width: `${e.progress}%` }} />
                              </div>
                              {e.course.instructor && (
                                <div className="flex items-center gap-1.5 text-white/30 text-[10px]">
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
            <motion.div initial={{ opacity: 0, scale: 0.92, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.92, y: 20 }}
              className="bg-[#0d1a2e] border border-gold/10 rounded-2xl w-full max-w-sm shadow-2xl" onClick={(e) => e.stopPropagation()}>
              <div className="p-6 border-b border-white/[0.06] flex items-center justify-between">
                <h2 className="text-white font-bold">Inviter un membre</h2>
                <button onClick={() => setInviteModal(false)} className="text-white/30 hover:text-white"><FaTimes /></button>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-white/40 text-xs mb-1.5 uppercase tracking-wider">Email</label>
                  <input type="email" value={inviteEmail} onChange={(e) => setInviteEmail(e.target.value)} placeholder="email@exemple.com"
                    className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white placeholder:text-white/20 text-sm focus:outline-none focus:border-gold/40" />
                </div>
                <div>
                  <label className="block text-white/40 text-xs mb-1.5 uppercase tracking-wider">Role</label>
                  <div className="flex gap-3">
                    {([{ key: "INSTRUCTOR" as const, label: "Formateur" }, { key: "ADMIN" as const, label: "Administrateur" }]).map(r => (
                      <button key={r.key} onClick={() => setInviteRole(r.key)}
                        className={`flex-1 py-3 rounded-xl text-sm font-medium border transition-all ${inviteRole === r.key ? "border-gold/30 bg-gold/10 text-gold" : "border-white/[0.08] text-white/40 hover:text-white/60"}`}>
                        {r.label}
                      </button>
                    ))}
                  </div>
                </div>
                <button onClick={handleInvite} disabled={inviting || !inviteEmail}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-gold to-gold-light text-navy font-bold text-sm disabled:opacity-60 flex items-center justify-center gap-2">
                  {inviting ? <><FaSpinner className="animate-spin" /> Envoi...</> : <><FaPaperPlane className="text-xs" /> Envoyer l'invitation</>}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
