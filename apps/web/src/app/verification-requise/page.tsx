"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { FaEnvelope, FaPaperPlane, FaCheckCircle, FaArrowLeft } from "react-icons/fa";
import Link from "next/link";
import { useAuth } from "@/context/auth-context";

export default function VerificationRequise() {
  const { user, resendVerification, logout } = useAuth();
  const [resent, setResent] = useState(false);
  const [sending, setSending] = useState(false);

  const handleResend = async () => {
    setSending(true);
    await resendVerification();
    setSending(false);
    setResent(true);
    setTimeout(() => setResent(false), 30000);
  };

  return (
    <div className="min-h-screen bg-dark flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-lg w-full"
      >
        <div className="bg-cream/[0.02] border border-cream/[0.08] rounded-3xl p-10 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-gold/[0.03] to-transparent pointer-events-none" />

          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
            className="relative z-10"
          >
            <div className="w-20 h-20 rounded-full bg-gold/10 flex items-center justify-center mx-auto mb-6">
              <FaEnvelope className="text-gold text-3xl" />
            </div>
          </motion.div>

          <div className="relative z-10">
            <h1 className="text-2xl font-bold text-cream mb-3">
              Verifiez votre adresse email
            </h1>
            <p className="text-cream/50 text-sm leading-relaxed mb-2">
              Un email de confirmation a ete envoye a :
            </p>
            <p className="text-gold font-semibold text-base mb-6">
              {user?.email || "votre adresse email"}
            </p>
            <p className="text-cream/40 text-xs leading-relaxed mb-8">
              Cliquez sur le lien dans l&apos;email pour activer votre compte et acceder a vos formations. Verifiez egalement votre dossier spam.
            </p>

            <div className="space-y-3">
              <button
                onClick={handleResend}
                disabled={resent || sending}
                className="w-full py-3.5 rounded-xl font-bold text-sm transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 bg-gradient-to-r from-gold to-gold-light text-navy hover:shadow-lg hover:shadow-gold/20"
              >
                {sending ? (
                  <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }}>
                    <FaPaperPlane className="text-sm" />
                  </motion.div>
                ) : resent ? (
                  <>
                    <FaCheckCircle className="text-sm" />
                    Email renvoye avec succes !
                  </>
                ) : (
                  <>
                    <FaPaperPlane className="text-sm" />
                    Renvoyer l&apos;email de verification
                  </>
                )}
              </button>

              <div className="flex gap-3">
                <Link
                  href="/"
                  className="flex-1 py-3 rounded-xl border border-cream/[0.08] text-cream/50 text-sm font-medium hover:bg-cream/[0.03] transition-all flex items-center justify-center gap-2"
                >
                  <FaArrowLeft className="text-xs" />
                  Accueil
                </Link>
                <button
                  onClick={logout}
                  className="flex-1 py-3 rounded-xl border border-cream/[0.08] text-cream/50 text-sm font-medium hover:bg-cream/[0.03] transition-all"
                >
                  Changer de compte
                </button>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
