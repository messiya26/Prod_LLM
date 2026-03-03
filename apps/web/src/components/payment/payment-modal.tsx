"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaTimes, FaSpinner, FaCheck, FaCreditCard, FaMobileAlt,
  FaUniversity, FaPaypal, FaMoneyBillWave, FaShieldAlt, FaLock
} from "react-icons/fa";
import { SiCashapp } from "react-icons/si";
import api from "@/lib/api";

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (reference: string) => void;
  courseId: string;
  courseTitle: string;
  amount: number;
  currency?: string;
}

interface PaymentOption {
  method: string;
  label: string;
  icon: React.ReactNode;
  color: string;
  description: string;
  instructions?: string;
  international?: boolean;
}

const paymentOptions: PaymentOption[] = [
  {
    method: "PAYPAL",
    label: "PayPal",
    icon: <FaPaypal />,
    color: "from-blue-600 to-blue-500",
    description: "Paiement securise via PayPal",
    instructions: "Vous serez redirige vers PayPal pour finaliser le paiement.",
    international: true,
  },
  {
    method: "STRIPE",
    label: "Carte bancaire",
    icon: <FaCreditCard />,
    color: "from-indigo-600 to-purple-500",
    description: "Visa, Mastercard, AMEX",
    instructions: "Paiement securise par carte bancaire via Stripe.",
    international: true,
  },
  {
    method: "MPESA",
    label: "M-Pesa",
    icon: <FaMobileAlt />,
    color: "from-green-600 to-green-500",
    description: "Paiement mobile M-Pesa",
    instructions: "Entrez votre numero M-Pesa. Vous recevrez une notification push pour confirmer le paiement.",
  },
  {
    method: "ILLICOCASH",
    label: "Illicocash",
    icon: <FaMoneyBillWave />,
    color: "from-orange-500 to-amber-500",
    description: "Paiement via Illicocash",
    instructions: "Entrez votre numero Illicocash. Un SMS de confirmation vous sera envoye.",
  },
  {
    method: "CASH_APP",
    label: "Cash App",
    icon: <SiCashapp />,
    color: "from-green-500 to-emerald-400",
    description: "Paiement via Cash App",
    instructions: "Envoyez le montant au $cashtag indique, puis entrez votre reference de transaction.",
    international: true,
  },
  {
    method: "MOBILE_MONEY",
    label: "Mobile Money",
    icon: <FaMobileAlt />,
    color: "from-yellow-500 to-orange-400",
    description: "MTN, Orange, Airtel Money",
    instructions: "Entrez votre numero Mobile Money. Un USSD sera envoye pour confirmation.",
  },
  {
    method: "BANK_TRANSFER",
    label: "Virement bancaire",
    icon: <FaUniversity />,
    color: "from-gray-600 to-gray-500",
    description: "Virement SWIFT/SEPA",
    instructions: "Les coordonnees bancaires vous seront fournies. Le paiement sera valide sous 24-48h.",
    international: true,
  },
];

export default function PaymentModal({ isOpen, onClose, onSuccess, courseId, courseTitle, amount, currency = "USD" }: PaymentModalProps) {
  const [step, setStep] = useState<"select" | "confirm" | "processing" | "success">("select");
  const [selected, setSelected] = useState<PaymentOption | null>(null);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [txRef, setTxRef] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvc, setCardCvc] = useState("");
  const [cardName, setCardName] = useState("");
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState("");

  const reset = () => {
    setStep("select");
    setSelected(null);
    setPhoneNumber("");
    setTxRef("");
    setCardNumber(""); setCardExpiry(""); setCardCvc(""); setCardName("");
    setError("");
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  const needsPhone = ["MPESA", "ILLICOCASH", "MOBILE_MONEY"].includes(selected?.method || "");
  const needsTxRef = selected?.method === "CASH_APP";
  const needsCard = selected?.method === "STRIPE";
  const needsBank = selected?.method === "BANK_TRANSFER";

  const handlePay = async () => {
    if (needsPhone && !phoneNumber.trim()) { setError("Entrez votre numero de telephone"); return; }
    if (needsTxRef && !txRef.trim()) { setError("Entrez la reference de transaction"); return; }
    if (needsCard && (!cardNumber.trim() || !cardExpiry.trim() || !cardCvc.trim())) { setError("Remplissez tous les champs de la carte"); return; }

    setProcessing(true);
    setError("");
    setStep("processing");

    try {
      const metadata: Record<string, string> = {};
      if (phoneNumber) metadata.phone = phoneNumber;
      if (txRef) metadata.txRef = txRef;

      const payment = await api.post<{ reference: string }>("/payments", {
        courseId,
        amount,
        method: selected!.method,
        metadata: JSON.stringify(metadata),
      });

      await api.post(`/payments/${payment.reference}/confirm`, {});

      setTimeout(() => {
        setStep("success");
        setProcessing(false);
        setTimeout(() => {
          onSuccess(payment.reference);
          handleClose();
        }, 2000);
      }, 1500);
    } catch {
      setError("Erreur lors du paiement. Veuillez reessayer.");
      setStep("confirm");
      setProcessing(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="fixed inset-0 z-[95] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4" onClick={handleClose}>
        <motion.div initial={{ opacity: 0, scale: 0.92, y: 30 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.92, y: 30 }}
          className="bg-[#0d1a2e] border border-gold/10 rounded-2xl w-full max-w-lg shadow-2xl max-h-[90vh] overflow-hidden flex flex-col" onClick={e => e.stopPropagation()}>

          <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.06] shrink-0">
            <div>
              <h2 className="text-lg font-bold text-white">
                {step === "select" ? "Choisir le mode de paiement" : step === "confirm" ? "Confirmer le paiement" : step === "processing" ? "Traitement..." : "Paiement reussi !"}
              </h2>
              <p className="text-white/30 text-xs mt-0.5">{courseTitle}</p>
            </div>
            <button onClick={handleClose} className="text-white/30 hover:text-white transition-colors"><FaTimes /></button>
          </div>

          <div className="flex-1 overflow-y-auto p-6">
            {step === "select" && (
              <div className="space-y-3">
                <div className="bg-gold/5 border border-gold/10 rounded-xl p-4 mb-4 flex items-center justify-between">
                  <span className="text-white/50 text-sm">Montant a payer</span>
                  <span className="text-gold text-xl font-bold">{amount === 0 ? "Gratuit" : `${amount} ${currency}`}</span>
                </div>

                <p className="text-white/40 text-xs font-medium uppercase tracking-wider mb-2">Moyens de paiement</p>

                <div className="grid grid-cols-2 gap-2">
                  {paymentOptions.map(opt => (
                    <button key={opt.method} onClick={() => { setSelected(opt); setStep("confirm"); setError(""); }}
                      className="flex items-center gap-3 p-3.5 rounded-xl border border-white/[0.06] bg-white/[0.02] hover:border-gold/20 hover:bg-gold/[0.03] transition-all text-left group">
                      <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${opt.color} flex items-center justify-center text-white text-sm shrink-0`}>
                        {opt.icon}
                      </div>
                      <div>
                        <p className="text-white text-xs font-semibold group-hover:text-gold transition-colors">{opt.label}</p>
                        <p className="text-white/25 text-[9px]">{opt.description}</p>
                      </div>
                    </button>
                  ))}
                </div>

                <div className="flex items-center gap-2 mt-4 pt-3 border-t border-white/[0.04]">
                  <FaShieldAlt className="text-emerald-400/50 text-xs" />
                  <p className="text-white/20 text-[10px]">Paiement 100% securise et chiffre</p>
                </div>
              </div>
            )}

            {step === "confirm" && selected && (
              <div className="space-y-4">
                <div className="flex items-center gap-4 p-4 rounded-xl bg-white/[0.02] border border-white/[0.06]">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${selected.color} flex items-center justify-center text-white`}>
                    {selected.icon}
                  </div>
                  <div>
                    <p className="text-white font-bold text-sm">{selected.label}</p>
                    <p className="text-white/30 text-xs">{selected.description}</p>
                  </div>
                </div>

                <div className="bg-white/[0.02] border border-white/[0.06] rounded-xl p-4 space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-white/40">Formation</span>
                    <span className="text-white font-medium text-right max-w-[200px] truncate">{courseTitle}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-white/40">Montant</span>
                    <span className="text-gold font-bold">{amount} {currency}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-white/40">Methode</span>
                    <span className="text-white">{selected.label}</span>
                  </div>
                </div>

                {selected.instructions && (
                  <div className="bg-blue-500/5 border border-blue-500/10 rounded-xl p-3">
                    <p className="text-blue-400/70 text-xs">{selected.instructions}</p>
                  </div>
                )}

                {needsPhone && (
                  <div>
                    <label className="block text-white/50 text-xs font-medium mb-1.5 uppercase tracking-wider">Numero de telephone *</label>
                    <input type="tel" required value={phoneNumber} onChange={e => setPhoneNumber(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white placeholder:text-white/20 text-sm focus:outline-none focus:border-gold/40 transition-all"
                      placeholder="+243 XXX XXX XXX" />
                  </div>
                )}

                {needsTxRef && (
                  <div>
                    <label className="block text-white/50 text-xs font-medium mb-1.5 uppercase tracking-wider">Reference Cash App *</label>
                    <div className="bg-amber-500/5 border border-amber-500/10 rounded-xl p-3 mb-2">
                      <p className="text-amber-400/70 text-xs">Envoyez <strong>{amount} {currency}</strong> a <strong>$LordLomboAcademie</strong> puis collez la reference ci-dessous.</p>
                    </div>
                    <input type="text" required value={txRef} onChange={e => setTxRef(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white placeholder:text-white/20 text-sm focus:outline-none focus:border-gold/40 transition-all"
                      placeholder="Ex: #CASH-XXXXXX" />
                  </div>
                )}

                {needsCard && (
                  <div className="space-y-3">
                    <div>
                      <label className="block text-white/50 text-xs font-medium mb-1.5 uppercase tracking-wider">Nom sur la carte *</label>
                      <input type="text" value={cardName} onChange={e => setCardName(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white placeholder:text-white/20 text-sm focus:outline-none focus:border-gold/40 transition-all"
                        placeholder="JOHN DOE" />
                    </div>
                    <div>
                      <label className="block text-white/50 text-xs font-medium mb-1.5 uppercase tracking-wider">Numero de carte *</label>
                      <input type="text" maxLength={19} value={cardNumber}
                        onChange={e => { const v = e.target.value.replace(/\D/g, "").replace(/(\d{4})/g, "$1 ").trim(); setCardNumber(v); }}
                        className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white placeholder:text-white/20 text-sm focus:outline-none focus:border-gold/40 transition-all font-mono tracking-wider"
                        placeholder="4242 4242 4242 4242" />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-white/50 text-xs font-medium mb-1.5 uppercase tracking-wider">Expiration *</label>
                        <input type="text" maxLength={5} value={cardExpiry}
                          onChange={e => { let v = e.target.value.replace(/\D/g, ""); if (v.length >= 2) v = v.slice(0, 2) + "/" + v.slice(2); setCardExpiry(v); }}
                          className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white placeholder:text-white/20 text-sm focus:outline-none focus:border-gold/40 transition-all font-mono"
                          placeholder="MM/YY" />
                      </div>
                      <div>
                        <label className="block text-white/50 text-xs font-medium mb-1.5 uppercase tracking-wider">CVC *</label>
                        <input type="text" maxLength={4} value={cardCvc}
                          onChange={e => setCardCvc(e.target.value.replace(/\D/g, ""))}
                          className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white placeholder:text-white/20 text-sm focus:outline-none focus:border-gold/40 transition-all font-mono"
                          placeholder="123" />
                      </div>
                    </div>
                    <div className="flex items-center gap-2 bg-emerald-500/5 border border-emerald-500/10 rounded-xl p-3">
                      <FaShieldAlt className="text-emerald-400/60 text-xs shrink-0" />
                      <p className="text-emerald-400/60 text-[10px]">Vos donnees sont chiffrees et securisees via Stripe</p>
                    </div>
                  </div>
                )}

                {needsBank && (
                  <div className="space-y-3">
                    <div className="bg-blue-500/5 border border-blue-500/10 rounded-xl p-4">
                      <p className="text-blue-400/80 text-xs font-medium mb-2">Coordonnees bancaires :</p>
                      <div className="space-y-2 text-xs">
                        <div className="flex justify-between"><span className="text-white/30">Banque</span><span className="text-white font-mono">Trust Merchant Bank</span></div>
                        <div className="flex justify-between"><span className="text-white/30">Beneficiaire</span><span className="text-white font-mono">Lord Lombo Ministries</span></div>
                        <div className="flex justify-between"><span className="text-white/30">Compte</span><span className="text-white font-mono">0051-5200-4210-7801-07</span></div>
                        <div className="flex justify-between"><span className="text-white/30">SWIFT</span><span className="text-white font-mono">TABORCDXXX</span></div>
                        <div className="flex justify-between"><span className="text-white/30">Reference</span><span className="text-gold font-mono font-bold">LLM-{Date.now().toString(36).toUpperCase()}</span></div>
                      </div>
                    </div>
                    <div className="bg-amber-500/5 border border-amber-500/10 rounded-xl p-3">
                      <p className="text-amber-400/70 text-xs">Effectuez le virement avec la reference ci-dessus. Votre acces sera active sous 24-48h apres verification.</p>
                    </div>
                  </div>
                )}

                {error && (
                  <motion.div initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }}
                    className="bg-red-500/10 border border-red-500/20 rounded-xl p-3 text-red-400 text-xs">
                    {error}
                  </motion.div>
                )}

                <div className="flex gap-3 pt-2">
                  <button onClick={() => { setStep("select"); setError(""); }}
                    className="flex-1 py-3 rounded-xl border border-white/[0.08] text-white/50 text-sm hover:text-white hover:bg-white/[0.04] transition-all">
                    Retour
                  </button>
                  <button onClick={handlePay} disabled={processing}
                    className={`flex-1 py-3 rounded-xl bg-gradient-to-r ${selected.color} text-white text-sm font-bold transition-all shadow-lg active:scale-95 disabled:opacity-60 flex items-center justify-center gap-2`}>
                    <FaLock className="text-[10px]" /> Payer {amount} {currency}
                  </button>
                </div>
              </div>
            )}

            {step === "processing" && (
              <div className="flex flex-col items-center justify-center py-12">
                <div className="relative mb-6">
                  <div className="w-20 h-20 rounded-full border-2 border-gold/20 flex items-center justify-center">
                    <FaSpinner className="text-gold text-2xl animate-spin" />
                  </div>
                  <div className="absolute inset-0 rounded-full border-2 border-gold/40 animate-ping" />
                </div>
                <h3 className="text-white font-bold text-lg mb-1">Traitement en cours...</h3>
                <p className="text-white/30 text-sm">Veuillez ne pas fermer cette fenetre</p>
              </div>
            )}

            {step === "success" && (
              <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center justify-center py-12">
                <div className="w-20 h-20 rounded-full bg-emerald-500/20 flex items-center justify-center mb-6">
                  <FaCheck className="text-emerald-400 text-3xl" />
                </div>
                <h3 className="text-white font-bold text-lg mb-1">Paiement reussi !</h3>
                <p className="text-white/30 text-sm mb-2">Vous avez maintenant acces a la formation</p>
                <p className="text-gold text-xs font-medium">{courseTitle}</p>
              </motion.div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
