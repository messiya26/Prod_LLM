"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaUserTie, FaPlus, FaSearch, FaSpinner, FaTrash, FaEdit, FaBookOpen, FaTimes, FaCheck, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { useI18n } from "@/context/i18n-context";
import api from "@/lib/api";

interface Instructor {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  bio?: string;
  _count?: { courses: number };
  courses?: { id: string; title: string; status: string }[];
}

const PAGE_SIZE = 8;

export default function AdminFormateurs() {
  const { t } = useI18n();
  const [instructors, setInstructors] = useState<Instructor[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [selectedInstructor, setSelectedInstructor] = useState<Instructor | null>(null);
  const [toast, setToast] = useState<{ msg: string; type: "success" | "error" } | null>(null);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviting, setInviting] = useState(false);

  const fetchInstructors = useCallback(async () => {
    try {
      const data = await api.get<any[]>("/courses/instructors");
      setInstructors(Array.isArray(data) ? data : []);
    } catch {} finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchInstructors(); }, [fetchInstructors]);

  useEffect(() => {
    if (toast) { const t = setTimeout(() => setToast(null), 3000); return () => clearTimeout(t); }
  }, [toast]);

  const filtered = instructors.filter(i =>
    `${i.firstName} ${i.lastName} ${i.email}`.toLowerCase().includes(search.toLowerCase())
  );
  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handleInvite = async () => {
    if (!inviteEmail.trim()) return;
    setInviting(true);
    try {
      await api.post("/users/invite", { email: inviteEmail, role: "INSTRUCTOR" });
      setToast({ msg: "Invitation envoyee avec succes", type: "success" });
      setInviteEmail("");
      setShowModal(false);
      fetchInstructors();
    } catch {
      setToast({ msg: "Erreur lors de l'invitation", type: "error" });
    } finally { setInviting(false); }
  };

  if (loading) return (
    <div className="flex items-center justify-center h-64"><FaSpinner className="text-gold text-2xl animate-spin" /></div>
  );

  return (
    <div className="space-y-6">
      <AnimatePresence>
        {toast && (
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
            className={`fixed top-6 right-6 z-[100] flex items-center gap-3 px-5 py-3 rounded-xl shadow-2xl backdrop-blur-xl border ${toast.type === "success" ? "bg-emerald-500/15 border-emerald-500/20 text-emerald-400" : "bg-red-500/15 border-red-500/20 text-red-400"}`}>
            {toast.type === "success" ? <FaCheck /> : <FaTimes />}
            <span className="text-sm">{toast.msg}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-white">{t("admin.instructors")}</h1>
          <p className="text-white/30 text-sm">{instructors.length} formateur{instructors.length > 1 ? "s" : ""}</p>
        </div>
        <button onClick={() => setShowModal(true)} className="flex items-center gap-2 px-5 py-3 rounded-xl bg-gold text-navy text-sm font-bold hover:bg-gold-light transition-all">
          <FaPlus className="text-xs" /> Inviter un formateur
        </button>
      </div>

      <div className="relative max-w-sm">
        <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 text-xs" />
        <input type="text" placeholder="Rechercher..." value={search} onChange={e => { setSearch(e.target.value); setPage(1); }}
          className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-gold/30 transition-all" />
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {paginated.map((inst) => (
          <motion.div key={inst.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl bg-white/[0.02] border border-white/[0.06] p-5 hover:border-gold/20 transition-all cursor-pointer"
            onClick={() => setSelectedInstructor(inst)}>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-gold/30 to-gold-light/20 flex items-center justify-center text-sm font-bold text-gold">
                {inst.firstName?.[0]}{inst.lastName?.[0]}
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">{inst.firstName} {inst.lastName}</h3>
                <p className="text-[10px] text-white/30">{inst.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-xs text-white/40">
              <FaBookOpen className="text-gold/50" />
              <span>{inst._count?.courses || 0} formation{(inst._count?.courses || 0) > 1 ? "s" : ""}</span>
            </div>
          </motion.div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12">
          <FaUserTie className="text-white/10 text-4xl mx-auto mb-3" />
          <p className="text-white/20 text-sm">Aucun formateur trouve</p>
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
            className="p-2 rounded-lg bg-white/[0.04] text-white/40 hover:text-white disabled:opacity-30 transition-all"><FaChevronLeft className="text-xs" /></button>
          {Array.from({ length: totalPages }, (_, i) => (
            <button key={i} onClick={() => setPage(i + 1)}
              className={`w-8 h-8 rounded-lg text-xs font-medium transition-all ${page === i + 1 ? "bg-gold text-navy" : "bg-white/[0.04] text-white/40 hover:text-white"}`}>{i + 1}</button>
          ))}
          <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
            className="p-2 rounded-lg bg-white/[0.04] text-white/40 hover:text-white disabled:opacity-30 transition-all"><FaChevronRight className="text-xs" /></button>
        </div>
      )}

      <AnimatePresence>
        {showModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[80] flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={() => setShowModal(false)}>
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }}
              onClick={e => e.stopPropagation()} className="bg-[#0d1a2e] border border-gold/20 rounded-2xl p-8 w-full max-w-md mx-4">
              <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2"><FaUserTie className="text-gold" /> Inviter un formateur</h3>
              <div>
                <label className="block text-white/40 text-xs mb-1.5 uppercase tracking-wider">Adresse email</label>
                <input type="email" value={inviteEmail} onChange={e => setInviteEmail(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && handleInvite()}
                  placeholder="formateur@email.com"
                  className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-gold/30 transition-all" />
                <p className="text-white/20 text-[10px] mt-2">Un email d'invitation sera envoye avec un lien de creation de compte</p>
              </div>
              <div className="flex gap-3 mt-6">
                <button onClick={() => setShowModal(false)} className="flex-1 py-3 rounded-xl border border-white/[0.08] text-white/40 text-sm hover:text-white transition-all">Annuler</button>
                <button onClick={handleInvite} disabled={inviting || !inviteEmail.trim()}
                  className="flex-1 py-3 rounded-xl bg-gold text-navy font-bold text-sm hover:bg-gold-light transition-all disabled:opacity-50 flex items-center justify-center gap-2">
                  {inviting ? <FaSpinner className="animate-spin" /> : <FaPlus className="text-xs" />} Inviter
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {selectedInstructor && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[80] flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={() => setSelectedInstructor(null)}>
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }}
              onClick={e => e.stopPropagation()} className="bg-[#0d1a2e] border border-gold/20 rounded-2xl p-8 w-full max-w-lg mx-4 max-h-[80vh] overflow-y-auto">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-gold/30 to-gold-light/20 flex items-center justify-center text-lg font-bold text-gold">
                  {selectedInstructor.firstName?.[0]}{selectedInstructor.lastName?.[0]}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">{selectedInstructor.firstName} {selectedInstructor.lastName}</h3>
                  <p className="text-sm text-white/40">{selectedInstructor.email}</p>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-gold/15 text-gold border border-gold/20 mt-1 inline-block">{selectedInstructor.role}</span>
                </div>
              </div>

              <h4 className="text-sm font-bold text-white mb-3 flex items-center gap-2"><FaBookOpen className="text-gold/50 text-xs" /> Formations assignees ({selectedInstructor.courses?.length || 0})</h4>
              <div className="space-y-2">
                {selectedInstructor.courses && selectedInstructor.courses.length > 0 ? (
                  selectedInstructor.courses.map(c => (
                    <div key={c.id} className="flex items-center justify-between p-3 rounded-xl bg-white/[0.03] border border-white/[0.04]">
                      <span className="text-xs text-white/60">{c.title}</span>
                      <span className={`px-2 py-0.5 rounded-full text-[9px] font-medium ${c.status === "PUBLISHED" ? "bg-emerald-400/10 text-emerald-400" : "bg-amber-400/10 text-amber-400"}`}>{c.status}</span>
                    </div>
                  ))
                ) : (
                  <p className="text-white/20 text-xs text-center py-4">Aucune formation assignee</p>
                )}
              </div>

              <div className="flex justify-end mt-6">
                <button onClick={() => setSelectedInstructor(null)} className="px-6 py-2.5 rounded-xl bg-white/[0.05] text-white/50 text-sm hover:text-white transition-all">Fermer</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
