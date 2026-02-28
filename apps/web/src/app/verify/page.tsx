"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { FaCheckCircle, FaTimesCircle, FaSpinner } from "react-icons/fa";
import api from "@/lib/api";

export default function VerifyPage() {
  return (
    <Suspense fallback={<VerifyLoading />}>
      <VerifyContent />
    </Suspense>
  );
}

function VerifyLoading() {
  return (
    <div className="min-h-screen bg-dark flex items-center justify-center">
      <FaSpinner className="text-gold text-3xl animate-spin" />
    </div>
  );
}

function VerifyContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const ref = searchParams.get("ref");
  const [status, setStatus] = useState<"loading" | "success" | "error">(ref ? "loading" : "error");
  const [message, setMessage] = useState(ref ? "" : "Lien de verification invalide.");

  useEffect(() => {
    if (!ref) return;

    api.get(`/auth/verify?ref=${encodeURIComponent(ref)}`)
      .then((data: unknown) => {
        const res = data as { accessToken: string; user: { role: string }; message: string };
        setStatus("success");
        setMessage(res.message || "Compte verifie avec succes !");
        localStorage.setItem("lla_token", res.accessToken);
        localStorage.setItem("lla_user", JSON.stringify(res.user));
        const maxAge = 60 * 60 * 24 * 7;
        document.cookie = `ll-auth-token=${res.accessToken}; path=/; max-age=${maxAge}; SameSite=Strict`;
        document.cookie = `ll-user-role=${res.user.role}; path=/; max-age=${maxAge}; SameSite=Strict`;
        setTimeout(() => router.push(res.user.role === "ADMIN" ? "/admin" : "/dashboard"), 3000);
      })
      .catch((err: unknown) => {
        setStatus("error");
        setMessage(err instanceof Error ? err.message : "Lien invalide ou expire.");
      });
  }, [ref, router]);

  return (
    <div className="min-h-screen bg-dark flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full text-center"
      >
        <div className="bg-cream/[0.02] border border-cream/[0.08] rounded-2xl p-10">
          {status === "loading" && (
            <>
              <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }}>
                <FaSpinner className="text-gold text-5xl mx-auto mb-6" />
              </motion.div>
              <h1 className="text-2xl font-bold text-cream mb-2">Verification en cours...</h1>
              <p className="text-cream/40 text-sm">Veuillez patienter quelques instants.</p>
            </>
          )}

          {status === "success" && (
            <>
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 200 }}>
                <FaCheckCircle className="text-emerald-400 text-5xl mx-auto mb-6" />
              </motion.div>
              <h1 className="text-2xl font-bold text-cream mb-2">{message}</h1>
              <p className="text-cream/40 text-sm">Redirection automatique dans quelques secondes...</p>
              <div className="mt-6 h-1 bg-cream/[0.05] rounded-full overflow-hidden">
                <motion.div initial={{ width: 0 }} animate={{ width: "100%" }} transition={{ duration: 3 }} className="h-full bg-gradient-to-r from-gold to-gold-light rounded-full" />
              </div>
            </>
          )}

          {status === "error" && (
            <>
              <FaTimesCircle className="text-red-400 text-5xl mx-auto mb-6" />
              <h1 className="text-2xl font-bold text-cream mb-2">Echec de la verification</h1>
              <p className="text-cream/40 text-sm mb-6">{message}</p>
              <button
                onClick={() => router.push("/connexion")}
                className="px-8 py-3 rounded-xl bg-gradient-to-r from-gold to-gold-light text-navy font-bold text-sm hover:shadow-lg hover:shadow-gold/20 transition-all"
              >
                Retour a la connexion
              </button>
            </>
          )}
        </div>
      </motion.div>
    </div>
  );
}
