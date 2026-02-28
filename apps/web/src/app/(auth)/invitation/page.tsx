"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { FaCheckCircle, FaTimesCircle, FaSpinner } from "react-icons/fa";
import api from "@/lib/api";

export default function InvitationPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const ref = searchParams.get("ref");
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState("");
  const [role, setRole] = useState("");

  useEffect(() => {
    if (!ref) {
      setStatus("error");
      setMessage("Lien d'invitation invalide");
      return;
    }
    api.post<{ message: string; role: string }>("/users/accept-invitation", { token: ref })
      .then((data) => {
        setStatus("success");
        setMessage(data.message || "Invitation acceptee");
        setRole(data.role || "");
      })
      .catch((err: any) => {
        setStatus("error");
        setMessage(err?.response?.data?.message || err?.message || "Erreur lors de l'acceptation");
      });
  }, [ref]);

  return (
    <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-[#0d1a2e] border border-cream/[0.08] rounded-2xl p-10 text-center max-w-md w-full">
        {status === "loading" && (
          <>
            <FaSpinner className="text-gold text-4xl mx-auto mb-4 animate-spin" />
            <h1 className="text-cream text-xl font-bold">Traitement de l'invitation...</h1>
          </>
        )}
        {status === "success" && (
          <>
            <FaCheckCircle className="text-emerald-400 text-5xl mx-auto mb-4" />
            <h1 className="text-cream text-xl font-bold mb-2">Invitation acceptee !</h1>
            <p className="text-cream/50 text-sm mb-2">{message}</p>
            {role && <p className="text-gold text-sm font-medium mb-6">Role : {role === "ADMIN" ? "Administrateur" : "Formateur"}</p>}
            <button onClick={() => router.push("/connexion")} className="px-8 py-3 rounded-xl bg-gradient-to-r from-gold to-gold-light text-navy font-bold text-sm">
              Se connecter
            </button>
          </>
        )}
        {status === "error" && (
          <>
            <FaTimesCircle className="text-red-400 text-5xl mx-auto mb-4" />
            <h1 className="text-cream text-xl font-bold mb-2">Erreur</h1>
            <p className="text-cream/50 text-sm mb-6">{message}</p>
            <button onClick={() => router.push("/")} className="px-8 py-3 rounded-xl border border-cream/[0.1] text-cream/60 text-sm hover:text-cream">
              Retour a l'accueil
            </button>
          </>
        )}
      </motion.div>
    </div>
  );
}
