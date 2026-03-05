"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useI18n } from "@/context/i18n-context";
import {
  FaSearch, FaArrowUp, FaArrowDown, FaSpinner, FaTimes, FaCreditCard,
  FaUser, FaBookOpen, FaCalendarAlt, FaHashtag, FaEye, FaDownload,
  FaChevronLeft, FaUsers, FaReceipt, FaCheckCircle, FaClock, FaTimesCircle,
} from "react-icons/fa";
import api from "@/lib/api";

interface Payment {
  id: string;
  reference: string;
  amount: string;
  currency: string;
  status: string;
  method: string;
  createdAt: string;
  userId?: string;
  user: { id?: string; firstName: string; lastName: string; email: string };
  course: { id?: string; title: string };
}

const statusMap: Record<string, { label: string; cls: string; icon: any }> = {
  COMPLETED: { label: "Paye", cls: "bg-emerald-400/10 text-emerald-400 border-emerald-400/20", icon: <FaCheckCircle /> },
  PENDING: { label: "En attente", cls: "bg-amber-400/10 text-amber-400 border-amber-400/20", icon: <FaClock /> },
  FAILED: { label: "Echoue", cls: "bg-red-400/10 text-red-400 border-red-400/20", icon: <FaTimesCircle /> },
  REFUNDED: { label: "Rembourse", cls: "bg-orange-400/10 text-orange-400 border-orange-400/20", icon: <FaTimesCircle /> },
};

const methodLabels: Record<string, string> = {
  PAYPAL: "PayPal", STRIPE: "Carte bancaire", MOBILE_MONEY: "Mobile Money",
  ILLICOCASH: "Illicocash", CASH_APP: "Cash App", MPESA: "M-Pesa",
  BANK_TRANSFER: "Virement", FREE: "Gratuit",
};

function generateReceiptHTML(p: Payment) {
  return `<!DOCTYPE html><html><head><meta charset="utf-8"><title>Recu ${p.reference}</title>
<style>*{margin:0;padding:0;box-sizing:border-box}body{font-family:system-ui,-apple-system,sans-serif;background:#f8f9fa;padding:40px}
.receipt{max-width:600px;margin:auto;background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,.08)}
.header{background:linear-gradient(135deg,#0a1628,#162d50);color:#fff;padding:32px;text-align:center}
.header h1{font-size:20px;margin-bottom:4px}.header .ref{color:#d4a853;font-size:13px;font-family:monospace}
.body{padding:32px}.row{display:flex;justify-content:space-between;padding:14px 0;border-bottom:1px solid #f0f0f0}
.row:last-child{border:none}.label{color:#888;font-size:13px}.value{font-weight:600;font-size:14px;color:#222}
.amount-box{text-align:center;background:#f8f6f0;border-radius:12px;padding:24px;margin:20px 0}
.amount{font-size:32px;font-weight:700;color:#0a1628}
.status{display:inline-block;padding:6px 16px;border-radius:20px;font-size:12px;font-weight:600}
.COMPLETED{background:#d1fae5;color:#059669}.PENDING{background:#fef3c7;color:#d97706}
.FAILED{background:#fee2e2;color:#dc2626}.REFUNDED{background:#ffedd5;color:#ea580c}
.footer{text-align:center;padding:24px;color:#999;font-size:11px;border-top:1px solid #f0f0f0}
@media print{body{padding:0;background:#fff}.receipt{box-shadow:none}}</style></head>
<body><div class="receipt"><div class="header"><h1>Lord Lombo Academy</h1><p class="ref">${p.reference}</p></div>
<div class="body"><div class="amount-box"><div class="amount">${parseFloat(p.amount).toLocaleString("fr-FR")} FCFA</div>
<div class="currency"><span class="status ${p.status}">${statusMap[p.status]?.label || p.status}</span></div></div>
<div class="row"><span class="label">Client</span><span class="value">${p.user?.firstName} ${p.user?.lastName}</span></div>
<div class="row"><span class="label">Email</span><span class="value">${p.user?.email || "-"}</span></div>
<div class="row"><span class="label">Formation</span><span class="value">${p.course?.title || "-"}</span></div>
<div class="row"><span class="label">Methode</span><span class="value">${methodLabels[p.method] || p.method}</span></div>
<div class="row"><span class="label">Date</span><span class="value">${new Date(p.createdAt).toLocaleString("fr-FR")}</span></div>
<div class="row"><span class="label">Reference</span><span class="value" style="font-family:monospace;font-size:12px">${p.reference}</span></div>
</div><div class="footer">Ce document est genere automatiquement par Lord Lombo Academy.<br/>Pour toute question, contactez support@lordlomboministries.com</div></div></body></html>`;
}

function downloadReceipt(p: Payment) {
  const html = generateReceiptHTML(p);
  const blob = new Blob([html], { type: "text/html" });
  const url = URL.createObjectURL(blob);
  const w = window.open(url, "_blank");
  if (w) { w.onload = () => { setTimeout(() => w.print(), 500); }; }
}

export default function AdminTransactions() {
  const { t } = useI18n();
  const [payments, setPayments] = useState<Payment[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Payment | null>(null);
  const [page, setPage] = useState(1);
  const [studentView, setStudentView] = useState<{ id: string; name: string; email: string } | null>(null);
  const [studentPayments, setStudentPayments] = useState<Payment[]>([]);
  const [studentLoading, setStudentLoading] = useState(false);
  const PAGE_SIZE = 10;

  useEffect(() => {
    api.get<Payment[]>("/payments")
      .then(d => setPayments(Array.isArray(d) ? d : []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const openStudentPayments = (userId: string, name: string, email: string) => {
    setStudentView({ id: userId, name, email });
    setStudentLoading(true);
    api.get<Payment[]>(`/payments/user/${userId}`)
      .then(d => setStudentPayments(Array.isArray(d) ? d : []))
      .catch(() => setStudentPayments([]))
      .finally(() => setStudentLoading(false));
  };

  const filtered = payments.filter((tx) =>
    `${tx.user.firstName} ${tx.user.lastName} ${tx.reference} ${tx.course?.title}`.toLowerCase().includes(search.toLowerCase())
  );
  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  useEffect(() => { setPage(1); }, [search]);

  const totalRevenue = payments.filter(tx => tx.status === "COMPLETED").reduce((s, tx) => s + parseFloat(tx.amount || "0"), 0);
  const pendingAmount = payments.filter(tx => tx.status === "PENDING").reduce((s, tx) => s + parseFloat(tx.amount || "0"), 0);
  const uniqueStudents = new Set(payments.map(tx => tx.user?.email));

  if (loading) return <div className="flex items-center justify-center h-64"><FaSpinner className="text-gold text-2xl animate-spin" /></div>;

  return (
    <div className="space-y-6 max-w-[1300px]">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-white">{t("admin.transactions")}</h1>
          <p className="text-white/30 text-sm">{payments.length} transactions &middot; {uniqueStudents.size} etudiants</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        {[
          { label: "Revenus total", value: `${totalRevenue.toLocaleString("fr-FR")} FCFA`, icon: <FaArrowUp />, color: "text-emerald-400", bg: "from-emerald-500/10 to-emerald-500/5" },
          { label: "En attente", value: `${pendingAmount.toLocaleString("fr-FR")} FCFA`, icon: <FaClock />, color: "text-amber-400", bg: "from-amber-500/10 to-amber-500/5" },
          { label: "Transactions", value: String(payments.length), icon: <FaReceipt />, color: "text-blue-400", bg: "from-blue-500/10 to-blue-500/5" },
          { label: "Etudiants payants", value: String(uniqueStudents.size), icon: <FaUsers />, color: "text-gold", bg: "from-gold/10 to-gold/5" },
        ].map((s) => (
          <div key={s.label} className={`rounded-2xl bg-gradient-to-br ${s.bg} border border-white/[0.06] p-5`}>
            <div className={`w-9 h-9 rounded-xl bg-white/5 flex items-center justify-center ${s.color} mb-3`}>{s.icon}</div>
            <p className="text-white/30 text-xs mb-1">{s.label}</p>
            <div className={`text-xl font-bold ${s.color}`}>{s.value}</div>
          </div>
        ))}
      </div>

      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-md">
          <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 text-sm" />
          <input type="text" placeholder="Rechercher par nom, reference, formation..." value={search} onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-11 pr-4 py-3 rounded-xl bg-white/[0.04] border border-white/[0.06] text-white placeholder:text-white/20 text-sm focus:outline-none focus:border-gold/30" />
        </div>
      </div>

      <div className="rounded-2xl bg-[#0d1a2e] border border-white/[0.06] overflow-hidden">
        <table className="w-full">
          <thead><tr className="border-b border-white/[0.04] bg-white/[0.02]">
            {["Reference", "Etudiant", "Formation", "Montant", "Date", "Methode", "Statut", "Actions"].map((h) => (
              <th key={h} className="text-left text-white/25 text-[10px] font-medium uppercase tracking-wider px-5 py-3">{h}</th>
            ))}
          </tr></thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr><td colSpan={8} className="text-center py-12 text-white/20 text-sm">Aucune transaction</td></tr>
            ) : paged.map((tx, i) => {
              const st = statusMap[tx.status] || { label: tx.status, cls: "bg-white/5 text-white/40", icon: <FaClock /> };
              return (
                <tr key={tx.id} className="border-b border-white/[0.02] hover:bg-white/[0.02] transition-colors">
                  <td className="px-5 py-3 text-xs text-white/30 font-mono">{tx.reference}</td>
                  <td className="px-5 py-3">
                    <button onClick={() => openStudentPayments(tx.userId || tx.user?.id || "", `${tx.user.firstName} ${tx.user.lastName}`, tx.user.email)}
                      className="flex items-center gap-2 group text-left">
                      <div className="w-7 h-7 rounded-full bg-gradient-to-br from-gold to-gold-light flex items-center justify-center text-navy text-[10px] font-bold">
                        {tx.user.firstName[0]}{tx.user.lastName?.[0] || ""}
                      </div>
                      <div>
                        <span className="text-white text-xs font-medium group-hover:text-gold transition-colors">{tx.user.firstName} {tx.user.lastName}</span>
                        <p className="text-white/20 text-[10px]">{tx.user.email}</p>
                      </div>
                    </button>
                  </td>
                  <td className="px-5 py-3 text-xs text-white/40 max-w-[150px] truncate">{tx.course?.title}</td>
                  <td className="px-5 py-3 text-xs text-gold font-bold">{parseFloat(tx.amount || "0").toLocaleString("fr-FR")} F</td>
                  <td className="px-5 py-3 text-xs text-white/25">{new Date(tx.createdAt).toLocaleDateString("fr-FR")}</td>
                  <td className="px-5 py-3 text-xs text-white/35">{methodLabels[tx.method] || tx.method}</td>
                  <td className="px-5 py-3">
                    <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${st.cls}`}>{st.label}</span>
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-1">
                      <button onClick={() => setSelected(tx)} title="Voir"
                        className="w-7 h-7 rounded-lg bg-white/5 hover:bg-gold/10 flex items-center justify-center text-white/25 hover:text-gold transition-all">
                        <FaEye className="text-[10px]" />
                      </button>
                      <button onClick={() => downloadReceipt(tx)} title="Telecharger recu"
                        className="w-7 h-7 rounded-lg bg-white/5 hover:bg-gold/10 flex items-center justify-center text-white/25 hover:text-gold transition-all">
                        <FaDownload className="text-[10px]" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-white/20 text-xs">{filtered.length} resultats &middot; Page {page}/{totalPages}</p>
          <div className="flex gap-1">
            <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
              className="px-3 py-1.5 rounded-lg text-xs text-white/30 hover:text-gold disabled:opacity-20">&larr;</button>
            {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
              const start = Math.max(1, Math.min(page - 2, totalPages - 4));
              return start + i;
            }).filter(p => p <= totalPages).map(n => (
              <button key={n} onClick={() => setPage(n)}
                className={`w-8 h-8 rounded-lg text-xs font-medium ${page === n ? "bg-gold/20 text-gold" : "text-white/30 hover:text-gold"}`}>{n}</button>
            ))}
            <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
              className="px-3 py-1.5 rounded-lg text-xs text-white/30 hover:text-gold disabled:opacity-20">&rarr;</button>
          </div>
        </div>
      )}

      {/* Detail Modal */}
      <AnimatePresence>
        {selected && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[80] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" onClick={() => setSelected(null)}>
            <motion.div initial={{ opacity: 0, scale: 0.92, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.92, y: 20 }}
              className="bg-[#0d1a2e] border border-gold/10 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden" onClick={(e) => e.stopPropagation()}>
              <div className="relative bg-gradient-to-br from-gold/10 to-transparent p-6 border-b border-white/[0.06]">
                <button onClick={() => setSelected(null)} className="absolute top-4 right-4 text-white/30 hover:text-white"><FaTimes /></button>
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-xl bg-gold/10 flex items-center justify-center"><FaCreditCard className="text-gold text-lg" /></div>
                  <div>
                    <h2 className="text-lg font-bold text-white">Detail Transaction</h2>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${statusMap[selected.status]?.cls}`}>
                      {statusMap[selected.status]?.label || selected.status}
                    </span>
                  </div>
                </div>
              </div>
              <div className="p-6 space-y-4">
                <div className="text-center bg-white/[0.02] rounded-xl p-5 border border-white/[0.04]">
                  <div className="text-gold text-3xl font-bold">{parseFloat(selected.amount || "0").toLocaleString("fr-FR")} FCFA</div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { icon: <FaHashtag className="text-xs text-gold" />, label: "Reference", value: selected.reference, full: true },
                    { icon: <FaUser className="text-xs text-gold" />, label: "Etudiant", value: `${selected.user.firstName} ${selected.user.lastName}` },
                    { icon: <FaCreditCard className="text-xs text-gold" />, label: "Methode", value: methodLabels[selected.method] || selected.method },
                    { icon: <FaBookOpen className="text-xs text-gold" />, label: "Formation", value: selected.course?.title || "-", full: true },
                    { icon: <FaCalendarAlt className="text-xs text-gold" />, label: "Date", value: new Date(selected.createdAt).toLocaleString("fr-FR"), full: true },
                  ].map(item => (
                    <div key={item.label} className={`bg-white/[0.02] rounded-xl p-3 border border-white/[0.04] ${(item as any).full ? "col-span-2" : ""}`}>
                      <div className="flex items-center gap-2 text-white/30 text-[10px] uppercase tracking-wider mb-1">{item.icon} {item.label}</div>
                      <div className="text-white text-sm font-medium truncate">{item.value}</div>
                    </div>
                  ))}
                </div>
                <div className="flex gap-2">
                  <button onClick={() => downloadReceipt(selected)}
                    className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-gold/10 text-gold font-bold text-sm hover:bg-gold/20 transition-all border border-gold/20">
                    <FaDownload /> Telecharger le recu
                  </button>
                  <button onClick={() => {
                    const uid = selected.userId || (selected.user as any)?.id;
                    if (uid) { openStudentPayments(uid, `${selected.user.firstName} ${selected.user.lastName}`, selected.user.email); }
                    setSelected(null);
                  }}
                    className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-white/5 text-white/60 font-medium text-sm hover:bg-white/10 transition-all border border-white/[0.06]">
                    <FaUser /> Voir tous ses paiements
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Student Payment History Panel */}
      <AnimatePresence>
        {studentView && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[90] flex items-end md:items-center justify-center bg-black/60 backdrop-blur-sm p-4" onClick={() => setStudentView(null)}>
            <motion.div initial={{ opacity: 0, x: 100 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 100 }}
              className="bg-[#0d1a2e] border border-gold/10 rounded-2xl w-full max-w-xl max-h-[85vh] shadow-2xl overflow-hidden flex flex-col"
              onClick={(e) => e.stopPropagation()}>
              <div className="p-5 border-b border-white/[0.06] bg-gradient-to-r from-gold/5 to-transparent flex items-center gap-4">
                <button onClick={() => setStudentView(null)} className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/40 hover:text-white">
                  <FaChevronLeft className="text-xs" />
                </button>
                <div className="flex items-center gap-3 flex-1">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gold to-gold-light flex items-center justify-center text-navy text-sm font-bold">
                    {studentView.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
                  </div>
                  <div>
                    <h3 className="text-white font-bold">{studentView.name}</h3>
                    <p className="text-white/30 text-xs">{studentView.email}</p>
                  </div>
                </div>
                <button onClick={() => setStudentView(null)} className="text-white/20 hover:text-white"><FaTimes /></button>
              </div>

              <div className="flex-1 overflow-y-auto p-5 space-y-4">
                {studentLoading ? (
                  <div className="flex items-center justify-center py-12"><FaSpinner className="text-gold text-xl animate-spin" /></div>
                ) : studentPayments.length === 0 ? (
                  <div className="text-center py-12">
                    <FaReceipt className="text-white/10 text-3xl mx-auto mb-3" />
                    <p className="text-white/30 text-sm">Aucun paiement pour cet etudiant</p>
                  </div>
                ) : (
                  <>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/10">
                        <p className="text-white/30 text-[10px] uppercase mb-1">Total paye</p>
                        <p className="text-emerald-400 text-lg font-bold">
                          {studentPayments.filter(p => p.status === "COMPLETED").reduce((s, p) => s + parseFloat(p.amount || "0"), 0).toLocaleString("fr-FR")} FCFA
                        </p>
                      </div>
                      <div className="p-4 rounded-xl bg-blue-500/5 border border-blue-500/10">
                        <p className="text-white/30 text-[10px] uppercase mb-1">Nb transactions</p>
                        <p className="text-blue-400 text-lg font-bold">{studentPayments.length}</p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      {studentPayments.map((p) => {
                        const st = statusMap[p.status] || { label: p.status, cls: "bg-white/5 text-white/40", icon: <FaClock /> };
                        return (
                          <div key={p.id} className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/[0.04] hover:border-gold/10 transition-all group">
                            <div className={`w-9 h-9 rounded-lg flex items-center justify-center text-sm ${st.cls}`}>{st.icon}</div>
                            <div className="flex-1 min-w-0">
                              <p className="text-white text-sm font-medium truncate">{p.course?.title || "Formation"}</p>
                              <div className="flex items-center gap-2 mt-0.5">
                                <span className="text-white/20 text-[10px] font-mono">{p.reference}</span>
                                <span className="text-white/10">|</span>
                                <span className="text-white/20 text-[10px]">{methodLabels[p.method] || p.method}</span>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="text-gold font-bold text-sm">{parseFloat(p.amount || "0").toLocaleString("fr-FR")} F</p>
                              <p className="text-white/20 text-[10px]">{new Date(p.createdAt).toLocaleDateString("fr-FR")}</p>
                            </div>
                            <button onClick={(e) => { e.stopPropagation(); downloadReceipt(p); }} title="Telecharger"
                              className="w-7 h-7 rounded-lg bg-white/5 hover:bg-gold/10 flex items-center justify-center text-white/20 hover:text-gold transition-all opacity-0 group-hover:opacity-100">
                              <FaDownload className="text-[10px]" />
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
