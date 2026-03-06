"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaShieldAlt, FaSpinner, FaSearch, FaCheck, FaTimes,
  FaUserTie, FaUsers, FaBookOpen, FaVideo, FaMoneyBillWave,
  FaEdit, FaTrash, FaStar, FaGem,
} from "react-icons/fa";
import api from "@/lib/api";

const PERMISSIONS = [
  { key: "manage_courses", label: "Gerer les formations", icon: <FaBookOpen />, desc: "Creer, modifier, supprimer des formations" },
  { key: "manage_users", label: "Gerer les utilisateurs", icon: <FaUsers />, desc: "Voir et modifier les comptes utilisateurs" },
  { key: "manage_live", label: "Gerer les sessions live", icon: <FaVideo />, desc: "Programmer et lancer des sessions en direct" },
  { key: "manage_payments", label: "Gerer les paiements", icon: <FaMoneyBillWave />, desc: "Voir et gerer les transactions" },
  { key: "manage_content", label: "Gerer le contenu", icon: <FaEdit />, desc: "Blog, evenements, site content" },
  { key: "manage_masterclasses", label: "Gerer les masterclasses", icon: <FaStar />, desc: "Creer et gerer les masterclasses" },
  { key: "manage_subscriptions", label: "Gerer les abonnements", icon: <FaGem />, desc: "Plans tarifaires et souscriptions" },
  { key: "delete_data", label: "Supprimer des donnees", icon: <FaTrash />, desc: "Suppression definitive de donnees" },
];

const ROLE_DEFAULTS: Record<string, string[]> = {
  STUDENT: [],
  INSTRUCTOR: ["manage_courses", "manage_live"],
  MODERATOR: ["manage_courses", "manage_content", "manage_live"],
  ADMIN: ["manage_courses", "manage_users", "manage_live", "manage_payments", "manage_content", "manage_masterclasses", "manage_subscriptions"],
  SUPER_ADMIN: PERMISSIONS.map(p => p.key),
};

interface UserRow { id: string; email: string; firstName: string; lastName: string; role: string; }

export default function PermissionsPage() {
  const [users, setUsers] = useState<UserRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedUser, setSelectedUser] = useState<UserRow | null>(null);
  const [userPerms, setUserPerms] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);
  const [modal, setModal] = useState(false);

  const fetchUsers = useCallback(async () => {
    try {
      const data = await api.get<UserRow[]>("/users");
      setUsers(Array.isArray(data) ? data : []);
    } catch {} finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchUsers(); }, [fetchUsers]);

  const filtered = users.filter(u =>
    `${u.firstName} ${u.lastName} ${u.email} ${u.role}`.toLowerCase().includes(search.toLowerCase())
  );

  const PAGE_SIZE = 10;
  const [page, setPage] = useState(1);
  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const openPerms = (u: UserRow) => {
    setSelectedUser(u);
    setUserPerms([...(ROLE_DEFAULTS[u.role] || [])]);
    setModal(true);
  };

  const togglePerm = (key: string) => {
    setUserPerms(prev => prev.includes(key) ? prev.filter(p => p !== key) : [...prev, key]);
  };

  const roleColors: Record<string, string> = {
    STUDENT: "bg-blue-500/10 text-blue-400",
    INSTRUCTOR: "bg-emerald-500/10 text-emerald-400",
    MODERATOR: "bg-amber-500/10 text-amber-400",
    ADMIN: "bg-gold/10 text-gold",
    SUPER_ADMIN: "bg-red-500/10 text-red-400",
  };

  const roleLabels: Record<string, string> = {
    STUDENT: "Apprenant",
    INSTRUCTOR: "Formateur",
    MODERATOR: "Moderateur",
    ADMIN: "Administrateur",
    SUPER_ADMIN: "Super Admin",
  };

  if (loading) return <div className="flex items-center justify-center h-64"><FaSpinner className="text-gold text-2xl animate-spin" /></div>;

  return (
    <div className="space-y-6 max-w-[1200px]">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2"><FaShieldAlt className="text-gold" /> Gestion des Habilitations</h1>
          <p className="text-white/30 text-sm">Definissez les permissions par utilisateur et par role</p>
        </div>
        <div className="flex items-center gap-2 bg-white/[0.04] rounded-xl px-4 py-2.5 border border-white/[0.06]">
          <FaSearch className="text-white/20 text-sm" />
          <input type="text" placeholder="Rechercher..." value={search} onChange={e => setSearch(e.target.value)}
            className="bg-transparent text-sm text-white placeholder:text-white/20 focus:outline-none w-48" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
        {Object.entries(ROLE_DEFAULTS).map(([role, perms]) => (
          <div key={role} className={`p-4 rounded-xl border border-white/[0.06] bg-[#0d1a2e]`}>
            <div className={`inline-block px-2 py-1 rounded-full text-[10px] font-bold mb-2 ${roleColors[role]}`}>{roleLabels[role]}</div>
            <p className="text-white/50 text-xs mb-2">{perms.length} permission(s)</p>
            <div className="space-y-1">
              {PERMISSIONS.slice(0, 4).map(p => (
                <div key={p.key} className="flex items-center gap-1.5 text-[10px]">
                  {perms.includes(p.key) ? <FaCheck className="text-emerald-400" /> : <FaTimes className="text-white/15" />}
                  <span className={perms.includes(p.key) ? "text-white/60" : "text-white/20"}>{p.label}</span>
                </div>
              ))}
              {PERMISSIONS.length > 4 && <p className="text-white/20 text-[10px]">+{PERMISSIONS.length - 4} autres...</p>}
            </div>
          </div>
        ))}
      </div>

      <div className="bg-[#0d1a2e] rounded-2xl border border-white/[0.06] overflow-hidden">
        <div className="px-5 py-3 border-b border-white/[0.06] bg-white/[0.02]">
          <h2 className="text-white font-semibold text-sm">Utilisateurs ({filtered.length})</h2>
        </div>
        <table className="w-full text-left">
          <thead>
            <tr className="text-white/30 text-xs border-b border-white/[0.06]">
              <th className="px-5 py-3 font-medium">Utilisateur</th>
              <th className="px-5 py-3 font-medium">Role</th>
              <th className="px-5 py-3 font-medium">Permissions</th>
              <th className="px-5 py-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginated.map(u => (
              <tr key={u.id} className="border-b border-white/[0.03] hover:bg-white/[0.02]">
                <td className="px-5 py-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gold to-gold-light flex items-center justify-center text-navy text-xs font-bold">
                      {u.firstName[0]}{u.lastName?.[0] || ""}
                    </div>
                    <div>
                      <p className="text-white text-sm">{u.firstName} {u.lastName}</p>
                      <p className="text-white/30 text-[10px]">{u.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-5 py-3">
                  <span className={`px-2 py-1 rounded-full text-[10px] font-bold ${roleColors[u.role] || "bg-white/5 text-white/40"}`}>
                    {roleLabels[u.role] || u.role}
                  </span>
                </td>
                <td className="px-5 py-3 text-white/40 text-xs">{(ROLE_DEFAULTS[u.role] || []).length} permissions</td>
                <td className="px-5 py-3">
                  <button onClick={() => openPerms(u)} className="px-3 py-1.5 rounded-lg text-xs bg-gold/10 text-gold hover:bg-gold/20 transition-all">
                    <FaShieldAlt className="inline mr-1" /> Configurer
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-5 py-3 border-t border-white/[0.06]">
            <p className="text-white/20 text-xs">{(page - 1) * PAGE_SIZE + 1}-{Math.min(page * PAGE_SIZE, filtered.length)} sur {filtered.length}</p>
            <div className="flex items-center gap-1">
              <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="w-8 h-8 rounded-lg flex items-center justify-center text-white/30 hover:text-gold disabled:opacity-20 disabled:cursor-not-allowed transition-all"><FaShieldAlt className="text-[10px]" /></button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(n => (
                <button key={n} onClick={() => setPage(n)} className={`w-8 h-8 rounded-lg text-xs font-medium transition-all ${page === n ? "bg-gold/20 text-gold border border-gold/30" : "text-white/40 hover:text-gold"}`}>{n}</button>
              ))}
              <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="w-8 h-8 rounded-lg flex items-center justify-center text-white/30 hover:text-gold disabled:opacity-20 disabled:cursor-not-allowed transition-all"><FaShieldAlt className="text-[10px]" /></button>
            </div>
          </div>
        )}
      </div>

      <AnimatePresence>
        {modal && selectedUser && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
              className="bg-[#0d1a2e] rounded-2xl border border-gold/10 w-full max-w-lg max-h-[80vh] overflow-y-auto"
            >
              <div className="p-5 border-b border-white/[0.06] flex items-center justify-between">
                <div>
                  <h3 className="text-white font-bold">Permissions de {selectedUser.firstName} {selectedUser.lastName}</h3>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${roleColors[selectedUser.role]}`}>{roleLabels[selectedUser.role]}</span>
                </div>
                <button onClick={() => setModal(false)} className="text-white/30 hover:text-white"><FaTimes /></button>
              </div>
              <div className="p-5 space-y-3">
                {PERMISSIONS.map(p => (
                  <button key={p.key} onClick={() => togglePerm(p.key)}
                    className={`w-full flex items-center gap-4 p-3 rounded-xl transition-all ${
                      userPerms.includes(p.key) ? "bg-gold/10 border border-gold/20" : "bg-white/[0.03] border border-white/[0.06] hover:bg-white/[0.06]"
                    }`}
                  >
                    <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${
                      userPerms.includes(p.key) ? "bg-gold/20 text-gold" : "bg-white/5 text-white/20"
                    }`}>{p.icon}</div>
                    <div className="text-left flex-1">
                      <p className={`text-sm font-medium ${userPerms.includes(p.key) ? "text-white" : "text-white/40"}`}>{p.label}</p>
                      <p className="text-white/20 text-[10px]">{p.desc}</p>
                    </div>
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center ${
                      userPerms.includes(p.key) ? "bg-gold text-navy" : "bg-white/10"
                    }`}>
                      {userPerms.includes(p.key) && <FaCheck className="text-[8px]" />}
                    </div>
                  </button>
                ))}
              </div>
              <div className="p-5 border-t border-white/[0.06] flex items-center justify-between">
                <p className="text-white/30 text-xs">{userPerms.length} permission(s) selectionnee(s)</p>
                <div className="flex gap-2">
                  <button onClick={() => setModal(false)} className="px-4 py-2 rounded-xl text-xs text-white/40 hover:text-white bg-white/5">Annuler</button>
                  <button onClick={() => { setModal(false); }} className="px-4 py-2 rounded-xl text-xs bg-gold text-navy font-bold hover:bg-gold-light">Enregistrer</button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
