"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaSpinner, FaSearch, FaCreditCard, FaDownload, FaEye,
  FaTimes, FaHashtag, FaBookOpen, FaCalendarAlt, FaCheckCircle,
  FaClock, FaTimesCircle, FaReceipt, FaFilePdf,
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
  course: { id: string; title: string };
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
.header img{height:60px;margin-bottom:12px}
.header h1{font-size:20px;margin-bottom:4px}.header .ref{color:#d4a853;font-size:13px;font-family:monospace}
.body{padding:32px}.row{display:flex;justify-content:space-between;padding:14px 0;border-bottom:1px solid #f0f0f0}
.row:last-child{border:none}.label{color:#888;font-size:13px}.value{font-weight:600;font-size:14px;color:#222}
.amount-box{text-align:center;background:#f8f6f0;border-radius:12px;padding:24px;margin:20px 0}
.amount{font-size:32px;font-weight:700;color:#0a1628}.currency{color:#888;font-size:12px}
.status{display:inline-block;padding:6px 16px;border-radius:20px;font-size:12px;font-weight:600}
.COMPLETED{background:#d1fae5;color:#059669}.PENDING{background:#fef3c7;color:#d97706}
.FAILED{background:#fee2e2;color:#dc2626}.REFUNDED{background:#ffedd5;color:#ea580c}
.footer{text-align:center;padding:24px;color:#999;font-size:11px;border-top:1px solid #f0f0f0}
@media print{body{padding:0;background:#fff}.receipt{box-shadow:none}}</style></head>
<body><div class="receipt"><div class="header"><img src="/logo-llm-academie.svg" alt="LL Academie" onerror="this.style.display='none'"><h1>Lord Lombo Academy</h1><p class="ref">${p.reference}</p></div>
<div class="body"><div class="amount-box"><div class="amount">${parseFloat(p.amount).toLocaleString("fr-FR")} FCFA</div>
<div class="currency"><span class="status ${p.status}">${statusMap[p.status]?.label || p.status}</span></div></div>
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
  if (w) {
    w.onload = () => { setTimeout(() => w.print(), 500); };
  }
}

export default function StudentPaymentsPage() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Payment | null>(null);
  const [page, setPage] = useState(1);
  const PAGE_SIZE = 8;

  useEffect(() => {
    api.get<Payment[]>("/payments/my")
      .then(d => setPayments(Array.isArray(d) ? d : []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const filtered = payments.filter(p =>
    `${p.reference} ${p.course?.title} ${methodLabels[p.method]}`.toLowerCase().includes(search.toLowerCase())
  );
  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  useEffect(() => { setPage(1); }, [search]);

  const totalPaid = payments.filter(p => p.status === "COMPLETED").reduce((s, p) => s + parseFloat(p.amount || "0"), 0);

  if (loading) return <div className="flex items-center justify-center h-64"><FaSpinner className="text-gold text-2xl animate-spin" /></div>;

  return (
    <div className="space-y-6 max-w-[1100px]">
      <div>
        <h1 className="text-xl font-bold text-white flex items-center gap-2"><FaReceipt className="text-gold" /> Mes Paiements</h1>
        <p className="text-white/30 text-sm">Historique complet de vos transactions</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-gradient-to-br from-emerald-500/10 to-emerald-500/5 border border-white/[0.06]">
          <p className="text-white/40 text-xs mb-1">Total paye</p>
          <p className="text-emerald-400 text-xl font-bold">{totalPaid.toLocaleString("fr-FR")} FCFA</p>
        </div>
        <div className="p-5 rounded-2xl bg-gradient-to-br from-gold/10 to-gold/5 border border-white/[0.06]">
          <p className="text-white/40 text-xs mb-1">Transactions</p>
          <p className="text-gold text-xl font-bold">{payments.length}</p>
        </div>
        <div className="p-5 rounded-2xl bg-gradient-to-br from-blue-500/10 to-blue-500/5 border border-white/[0.06]">
          <p className="text-white/40 text-xs mb-1">Formations acquises</p>
          <p className="text-blue-400 text-xl font-bold">{new Set(payments.filter(p => p.status === "COMPLETED").map(p => p.course?.id)).size}</p>
        </div>
      </div>

      <div className="flex items-center gap-2 bg-white/[0.04] rounded-xl px-4 py-2.5 border border-white/[0.06] max-w-md">
        <FaSearch className="text-white/20 text-sm" />
        <input type="text" placeholder="Rechercher par reference, formation..." value={search} onChange={e => setSearch(e.target.value)}
          className="bg-transparent text-sm text-white placeholder:text-white/20 focus:outline-none flex-1" />
      </div>

      <div className="space-y-3">
        {paged.length === 0 ? (
          <div className="text-center py-16 bg-[#0d1a2e] rounded-2xl border border-white/[0.06]">
            <FaCreditCard className="text-white/10 text-3xl mx-auto mb-3" />
            <p className="text-white/30 text-sm">Aucun paiement trouve</p>
          </div>
        ) : paged.map((p, i) => {
          const st = statusMap[p.status] || { label: p.status, cls: "bg-white/5 text-white/40", icon: <FaClock /> };
          return (
            <motion.div key={p.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
              className="flex items-center gap-4 p-4 rounded-2xl bg-[#0d1a2e] border border-white/[0.06] hover:border-gold/10 transition-all group"
            >
              <div className={`w-11 h-11 rounded-xl flex items-center justify-center text-lg ${st.cls}`}>{st.icon}</div>
              <div className="flex-1 min-w-0">
                <p className="text-white text-sm font-medium truncate">{p.course?.title || "Formation"}</p>
                <div className="flex items-center gap-3 mt-1">
                  <span className="text-white/25 text-[10px] font-mono">{p.reference}</span>
                  <span className="text-white/15">|</span>
                  <span className="text-white/25 text-[10px]">{methodLabels[p.method] || p.method}</span>
                  <span className="text-white/15">|</span>
                  <span className="text-white/25 text-[10px]">{new Date(p.createdAt).toLocaleDateString("fr-FR")}</span>
                </div>
              </div>
              <div className="text-right mr-2">
                <p className="text-gold font-bold text-sm">{parseFloat(p.amount || "0").toLocaleString("fr-FR")} FCFA</p>
                <span className={`inline-block px-2 py-0.5 rounded-full text-[9px] font-bold mt-1 ${st.cls}`}>{st.label}</span>
              </div>
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => setSelected(p)} title="Voir le detail"
                  className="w-8 h-8 rounded-lg bg-white/5 hover:bg-gold/10 flex items-center justify-center text-white/30 hover:text-gold transition-all">
                  <FaEye className="text-xs" />
                </button>
                <button onClick={() => downloadReceipt(p)} title="Telecharger le recu"
                  className="w-8 h-8 rounded-lg bg-white/5 hover:bg-gold/10 flex items-center justify-center text-white/30 hover:text-gold transition-all">
                  <FaDownload className="text-xs" />
                </button>
              </div>
            </motion.div>
          );
        })}
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-white/20 text-xs">{filtered.length} resultats - Page {page}/{totalPages}</p>
          <div className="flex gap-1">
            <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
              className="px-3 py-1.5 rounded-lg text-xs text-white/30 hover:text-gold disabled:opacity-20">&larr;</button>
            {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
              const start = Math.max(1, Math.min(page - 2, totalPages - 4));
              return start + i;
            }).filter(n => n <= totalPages).map(n => (
              <button key={n} onClick={() => setPage(n)}
                className={`w-8 h-8 rounded-lg text-xs font-medium ${page === n ? "bg-gold/20 text-gold" : "text-white/30 hover:text-gold"}`}>{n}</button>
            ))}
            <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
              className="px-3 py-1.5 rounded-lg text-xs text-white/30 hover:text-gold disabled:opacity-20">&rarr;</button>
          </div>
        </div>
      )}

      <AnimatePresence>
        {selected && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[80] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" onClick={() => setSelected(null)}>
            <motion.div initial={{ opacity: 0, scale: 0.92, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.92, y: 20 }}
              className="bg-[#0d1a2e] border border-gold/10 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden" onClick={e => e.stopPropagation()}>
              <div className="relative bg-gradient-to-br from-gold/10 to-transparent p-6 border-b border-white/[0.06]">
                <button onClick={() => setSelected(null)} className="absolute top-4 right-4 text-white/30 hover:text-white"><FaTimes /></button>
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-xl bg-gold/10 flex items-center justify-center"><FaCreditCard className="text-gold text-lg" /></div>
                  <div>
                    <h2 className="text-lg font-bold text-white">Detail du paiement</h2>
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
                    { icon: <FaHashtag className="text-gold text-xs" />, label: "Reference", value: selected.reference, full: true },
                    { icon: <FaCreditCard className="text-gold text-xs" />, label: "Methode", value: methodLabels[selected.method] || selected.method },
                    { icon: <FaBookOpen className="text-gold text-xs" />, label: "Formation", value: selected.course?.title || "-" },
                    { icon: <FaCalendarAlt className="text-gold text-xs" />, label: "Date", value: new Date(selected.createdAt).toLocaleString("fr-FR"), full: true },
                  ].map(item => (
                    <div key={item.label} className={`bg-white/[0.02] rounded-xl p-3 border border-white/[0.04] ${(item as any).full ? "col-span-2" : ""}`}>
                      <div className="flex items-center gap-2 text-white/30 text-[10px] uppercase tracking-wider mb-1">{item.icon} {item.label}</div>
                      <div className="text-white text-sm font-medium truncate">{item.value}</div>
                    </div>
                  ))}
                </div>
                <button onClick={() => { downloadReceipt(selected); }}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gold/10 text-gold font-bold text-sm hover:bg-gold/20 transition-all border border-gold/20">
                  <FaDownload /> Telecharger le recu
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
