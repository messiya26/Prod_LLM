"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useI18n } from "@/context/i18n-context";
import { FaSearch, FaArrowUp, FaArrowDown, FaSpinner, FaTimes, FaCreditCard, FaUser, FaBookOpen, FaCalendarAlt, FaHashtag } from "react-icons/fa";
import api from "@/lib/api";

interface Payment {
  id: string;
  reference: string;
  amount: string;
  currency: string;
  status: string;
  method: string;
  createdAt: string;
  user: { firstName: string; lastName: string; email: string };
  course: { title: string };
}

const statusMap: Record<string, { label: string; cls: string }> = {
  COMPLETED: { label: "Termine", cls: "bg-emerald-400/10 text-emerald-400" },
  PENDING: { label: "En attente", cls: "bg-amber-400/10 text-amber-400" },
  FAILED: { label: "Echoue", cls: "bg-red-400/10 text-red-400" },
  REFUNDED: { label: "Rembourse", cls: "bg-orange-400/10 text-orange-400" },
};

const methodLabels: Record<string, string> = {
  PAYPAL: "PayPal",
  STRIPE: "Carte bancaire",
  MOBILE_MONEY: "Mobile Money",
  ILLICOCASH: "Illicocash",
  CASH_APP: "Cash App",
  MPESA: "M-Pesa",
  BANK_TRANSFER: "Virement",
  FREE: "Gratuit",
};

export default function AdminTransactions() {
  const { t } = useI18n();
  const [payments, setPayments] = useState<Payment[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Payment | null>(null);
  const [page, setPage] = useState(1);
  const PAGE_SIZE = 10;

  useEffect(() => {
    api.get<Payment[]>("/payments")
      .then(setPayments)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const filtered = payments.filter((tx) =>
    `${tx.user.firstName} ${tx.user.lastName}`.toLowerCase().includes(search.toLowerCase()) ||
    tx.reference.toLowerCase().includes(search.toLowerCase())
  );
  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  useEffect(() => { setPage(1); }, [search]);

  const totalRevenue = payments.filter(tx => tx.status === "COMPLETED").reduce((s, tx) => s + parseFloat(tx.amount), 0);
  const pendingAmount = payments.filter(tx => tx.status === "PENDING").reduce((s, tx) => s + parseFloat(tx.amount), 0);
  const refundedAmount = payments.filter(tx => tx.status === "REFUNDED").reduce((s, tx) => s + parseFloat(tx.amount), 0);

  if (loading) return <div className="flex items-center justify-center h-64"><FaSpinner className="text-gold text-2xl animate-spin" /></div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-white">{t("admin.transactions")}</h1>
          <p className="text-white/30 text-sm">{payments.length} transactions</p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Revenus total", value: `$${totalRevenue.toLocaleString("fr-FR", { minimumFractionDigits: 2 })}`, icon: <FaArrowUp className="text-emerald-400" />, color: "text-emerald-400" },
          { label: "En attente", value: `$${pendingAmount.toLocaleString("fr-FR", { minimumFractionDigits: 2 })}`, icon: <FaArrowDown className="text-amber-400" />, color: "text-amber-400" },
          { label: "Rembourse", value: `$${refundedAmount.toLocaleString("fr-FR", { minimumFractionDigits: 2 })}`, icon: <FaArrowDown className="text-red-400" />, color: "text-red-400" },
        ].map((s) => (
          <div key={s.label} className="rounded-2xl bg-white/[0.02] border border-white/[0.06] p-5">
            <div className="flex items-center gap-2 mb-2">{s.icon}<span className="text-white/30 text-xs">{s.label}</span></div>
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
          <thead><tr className="border-b border-white/[0.04]">
            {["Reference", t("admin.student"), t("admin.formation"), t("admin.amount"), t("admin.date"), "Methode", t("admin.status")].map((h) => (
              <th key={h} className="text-left text-white/25 text-[10px] font-medium uppercase tracking-wider px-6 py-3">{h}</th>
            ))}
          </tr></thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr><td colSpan={7} className="text-center py-12 text-white/20 text-sm">Aucune transaction</td></tr>
            ) : paged.map((tx) => (
              <tr key={tx.id} className="border-b border-white/[0.02] hover:bg-white/[0.015] transition-colors cursor-pointer" onClick={() => setSelected(tx)}>
                <td className="px-6 py-4 text-xs text-white/40 font-mono">{tx.reference}</td>
                <td className="px-6 py-4 text-xs text-white font-medium">{tx.user.firstName} {tx.user.lastName}</td>
                <td className="px-6 py-4 text-xs text-white/40">{tx.course.title}</td>
                <td className="px-6 py-4 text-xs text-gold font-bold">${tx.amount}</td>
                <td className="px-6 py-4 text-xs text-white/25">{new Date(tx.createdAt).toLocaleDateString("fr-FR")}</td>
                <td className="px-6 py-4 text-xs text-white/35">{methodLabels[tx.method] || tx.method}</td>
                <td className="px-6 py-4">
                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-medium ${statusMap[tx.status]?.cls || "bg-white/10 text-white/40"}`}>
                    {statusMap[tx.status]?.label || tx.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-white/20 text-xs">{filtered.length} resultats &middot; Page {page}/{totalPages}</p>
          <div className="flex gap-1">
            <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
              className="px-3 py-1.5 rounded-lg text-xs text-white/30 hover:text-gold disabled:opacity-20 transition-colors">&larr;</button>
            {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
              const start = Math.max(1, Math.min(page - 2, totalPages - 4));
              return start + i;
            }).filter(p => p <= totalPages).map(n => (
              <button key={n} onClick={() => setPage(n)}
                className={`w-8 h-8 rounded-lg text-xs font-medium transition-all ${page === n ? "bg-gold/20 text-gold" : "text-white/30 hover:text-gold"}`}>{n}</button>
            ))}
            <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
              className="px-3 py-1.5 rounded-lg text-xs text-white/30 hover:text-gold disabled:opacity-20 transition-colors">&rarr;</button>
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
                  <div className="w-10 h-10 rounded-xl bg-gold/10 flex items-center justify-center"><FaCreditCard className="text-gold" /></div>
                  <div>
                    <h2 className="text-lg font-bold text-white">Transaction</h2>
                    <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${statusMap[selected.status]?.cls}`}>{statusMap[selected.status]?.label}</span>
                  </div>
                </div>
              </div>
              <div className="p-6 space-y-4">
                <div className="text-center bg-white/[0.02] rounded-xl p-5 border border-white/[0.04]">
                  <div className="text-gold text-3xl font-bold">${selected.amount}</div>
                  <div className="text-white/30 text-xs mt-1">{selected.currency}</div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { icon: <FaHashtag className="text-xs text-gold" />, label: "Reference", value: selected.reference },
                    { icon: <FaCreditCard className="text-xs text-gold" />, label: "Methode", value: methodLabels[selected.method] || selected.method },
                    { icon: <FaUser className="text-xs text-gold" />, label: "Client", value: `${selected.user.firstName} ${selected.user.lastName}` },
                    { icon: <FaBookOpen className="text-xs text-gold" />, label: "Formation", value: selected.course.title },
                    { icon: <FaCalendarAlt className="text-xs text-gold" />, label: "Date", value: new Date(selected.createdAt).toLocaleString("fr-FR") },
                  ].map(item => (
                    <div key={item.label} className={`bg-white/[0.02] rounded-xl p-3 border border-white/[0.04] ${item.label === "Reference" ? "col-span-2" : ""}`}>
                      <div className="flex items-center gap-2 text-white/30 text-[10px] uppercase tracking-wider mb-1">{item.icon} {item.label}</div>
                      <div className="text-white text-sm font-medium truncate">{item.value}</div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
