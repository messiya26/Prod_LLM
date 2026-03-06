"use client";

import { useState } from "react";
import Link from "next/link";
import { FaEnvelope, FaArrowLeft, FaCheck, FaSpinner, FaLock } from "react-icons/fa";
import api from "@/lib/api";

export default function MotDePasseOubliePage() {
  const [email, setEmail] = useState("");
  const [step, setStep] = useState<"email" | "sent" | "reset">("email");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSendReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    setError("");
    try {
      await api.post("/auth/forgot-password", { email });
      setStep("sent");
    } catch (err: any) {
      setError(err?.response?.data?.message || "Une erreur est survenue. Verifiez votre adresse email.");
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setError("Les mots de passe ne correspondent pas");
      return;
    }
    if (newPassword.length < 8) {
      setError("Le mot de passe doit contenir au moins 8 caracteres");
      return;
    }
    setLoading(true);
    setError("");
    try {
      await api.post("/auth/reset-password", { email, code, newPassword });
      setStep("reset");
    } catch (err: any) {
      setError(err?.response?.data?.message || "Code invalide ou expire. Veuillez reessayer.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a1628] to-[#0d1a2e] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#d4af37] to-[#f0c75e] flex items-center justify-center mx-auto mb-4">
            <FaLock className="text-[#0a1628] text-2xl" />
          </div>
          <h1 className="text-2xl font-bold text-[#f5f0e8]">
            {step === "reset" ? "Mot de passe reinitialise !" : "Mot de passe oublie ?"}
          </h1>
          <p className="text-[#f5f0e8]/50 mt-2 text-sm">
            {step === "email" && "Entrez votre adresse email pour recevoir un code de reinitialisation"}
            {step === "sent" && "Un code a ete envoye a votre adresse email"}
            {step === "reset" && "Vous pouvez maintenant vous connecter avec votre nouveau mot de passe"}
          </p>
        </div>

        <div className="bg-white/[0.04] backdrop-blur-xl border border-white/[0.08] rounded-2xl p-8">
          {step === "email" && (
            <form onSubmit={handleSendReset} className="space-y-5">
              <div>
                <label className="text-[#f5f0e8]/50 text-xs font-medium uppercase tracking-wider mb-2 block">Adresse email</label>
                <div className="relative">
                  <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-[#d4af37]/40" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="votre@email.com"
                    required
                    className="w-full bg-white/[0.06] border border-white/[0.08] rounded-xl pl-11 pr-4 py-3 text-[#f5f0e8] placeholder:text-white/20 focus:outline-none focus:border-[#d4af37]/40 focus:ring-1 focus:ring-[#d4af37]/20 transition-all"
                  />
                </div>
              </div>
              {error && <p className="text-red-400 text-sm bg-red-400/10 rounded-lg p-3">{error}</p>}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-[#d4af37] to-[#f0c75e] text-[#0a1628] font-bold flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-[#d4af37]/20 transition-all disabled:opacity-50"
              >
                {loading ? <FaSpinner className="animate-spin" /> : "Envoyer le code"}
              </button>
            </form>
          )}

          {step === "sent" && (
            <form onSubmit={handleResetPassword} className="space-y-5">
              <div>
                <label className="text-[#f5f0e8]/50 text-xs font-medium uppercase tracking-wider mb-2 block">Code de verification</label>
                <input
                  type="text"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="Entrez le code recu par email"
                  required
                  className="w-full bg-white/[0.06] border border-white/[0.08] rounded-xl px-4 py-3 text-[#f5f0e8] placeholder:text-white/20 focus:outline-none focus:border-[#d4af37]/40 focus:ring-1 focus:ring-[#d4af37]/20 transition-all text-center text-lg tracking-widest"
                />
              </div>
              <div>
                <label className="text-[#f5f0e8]/50 text-xs font-medium uppercase tracking-wider mb-2 block">Nouveau mot de passe</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Min. 8 caracteres"
                  required
                  minLength={8}
                  className="w-full bg-white/[0.06] border border-white/[0.08] rounded-xl px-4 py-3 text-[#f5f0e8] placeholder:text-white/20 focus:outline-none focus:border-[#d4af37]/40 focus:ring-1 focus:ring-[#d4af37]/20 transition-all"
                />
              </div>
              <div>
                <label className="text-[#f5f0e8]/50 text-xs font-medium uppercase tracking-wider mb-2 block">Confirmer le mot de passe</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirmez votre mot de passe"
                  required
                  minLength={8}
                  className="w-full bg-white/[0.06] border border-white/[0.08] rounded-xl px-4 py-3 text-[#f5f0e8] placeholder:text-white/20 focus:outline-none focus:border-[#d4af37]/40 focus:ring-1 focus:ring-[#d4af37]/20 transition-all"
                />
              </div>
              {error && <p className="text-red-400 text-sm bg-red-400/10 rounded-lg p-3">{error}</p>}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-[#d4af37] to-[#f0c75e] text-[#0a1628] font-bold flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-[#d4af37]/20 transition-all disabled:opacity-50"
              >
                {loading ? <FaSpinner className="animate-spin" /> : "Reinitialiser le mot de passe"}
              </button>
              <button type="button" onClick={() => { setStep("email"); setError(""); }} className="w-full text-[#d4af37]/60 text-sm hover:text-[#d4af37] transition-colors">
                Renvoyer le code
              </button>
            </form>
          )}

          {step === "reset" && (
            <div className="text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 flex items-center justify-center mx-auto">
                <FaCheck className="text-emerald-400 text-2xl" />
              </div>
              <p className="text-[#f5f0e8]/60 text-sm">Votre mot de passe a ete reinitialise avec succes.</p>
              <Link href="/connexion" className="block w-full py-3 rounded-xl bg-gradient-to-r from-[#d4af37] to-[#f0c75e] text-[#0a1628] font-bold text-center hover:shadow-lg hover:shadow-[#d4af37]/20 transition-all">
                Se connecter
              </Link>
            </div>
          )}
        </div>

        <div className="text-center mt-6">
          <Link href="/connexion" className="text-[#d4af37]/60 hover:text-[#d4af37] text-sm flex items-center justify-center gap-2 transition-colors">
            <FaArrowLeft className="text-xs" /> Retour a la connexion
          </Link>
        </div>
      </div>
    </div>
  );
}
