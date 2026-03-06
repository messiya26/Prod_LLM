"use client";

import { Suspense, useState, useEffect } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { FaEnvelope, FaLock, FaEye, FaEyeSlash, FaGoogle, FaArrowRight, FaArrowLeft, FaCheckCircle, FaExclamationTriangle } from "react-icons/fa";
import { useAuth } from "@/context/auth-context";
import { FullPageLoader } from "@/components/ui/loader";
import { ValidationModal } from "@/components/ui/validation-modal";
import { useI18n } from "@/context/i18n-context";
import api from "@/lib/api";

export default function Connexion() {
  return (
    <Suspense fallback={<div className="w-full max-w-md animate-pulse" />}>
      <ConnexionContent />
    </Suspense>
  );
}

function ConnexionContent() {
  const { login, loginWithGoogle } = useAuth();
  const { t } = useI18n();
  const searchParams = useSearchParams();
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (searchParams.get("logout")) {
      window.history.replaceState({}, "", "/connexion");
    }
  }, [searchParams]);
  const [fullLoading, setFullLoading] = useState(false);
  const googleError = searchParams.get("error");
  const [error, setError] = useState(googleError === "google_not_configured" ? "La connexion Google n'est pas encore disponible. Utilisez email/mot de passe." : "");
  const [success, setSuccess] = useState("");
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [showValidation, setShowValidation] = useState(false);

  useEffect(() => {
    const token = searchParams.get("token");
    const role = searchParams.get("role");
    if (token) {
      localStorage.setItem("lla_token", token);
      const maxAge = 60 * 60 * 24 * 7;
      document.cookie = `ll-auth-token=${token}; path=/; max-age=${maxAge}; SameSite=Strict`;
      if (role) document.cookie = `ll-user-role=${role}; path=/; max-age=${maxAge}; SameSite=Strict`;
      api.get("/auth/profile").then((u: unknown) => {
        localStorage.setItem("lla_user", JSON.stringify(u));
        window.location.href = role === "ADMIN" ? "/admin" : "/dashboard";
      }).catch(() => {
        setError("Erreur de connexion Google");
      });
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errors: string[] = [];
    if (!email.trim()) errors.push("L'adresse email est requise");
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.push("L'adresse email n'est pas valide");
    if (!password) errors.push("Le mot de passe est requis");
    if (errors.length > 0) {
      setValidationErrors(errors);
      setShowValidation(true);
      return;
    }
    setError("");
    setSuccess("");
    setLoading(true);
    try {
      await login(email, password);
      setSuccess(t("auth.login.success"));
      setLoading(false);
      setFullLoading(true);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : t("auth.login.error");
      // Message specifique pour comptes Google
      const isGoogleAccount = msg.toLowerCase().includes("incorrect") || msg.toLowerCase().includes("unauthorized");
      setError(isGoogleAccount
        ? "Email ou mot de passe incorrect. Si vous vous etes inscrit avec Google, utilisez le bouton 'Continuer avec Google'."
        : msg);
      setLoading(false);
      setFullLoading(false);
      setSuccess("");
    }
  };

  const handleGoogle = async () => {
    setFullLoading(true);
    await loginWithGoogle();
  };

  return (
    <>
      <ValidationModal errors={validationErrors} isOpen={showValidation} onClose={() => setShowValidation(false)} />
      <AnimatePresence>
        {fullLoading && <FullPageLoader message={t("auth.preparing")} />}
      </AnimatePresence>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
        <div className="mb-10">
          <Link href="/" className="inline-flex items-center gap-2 text-cream/40 hover:text-gold text-sm mb-6 transition-colors">
            <FaArrowLeft className="text-xs" /> {t("auth.backHome") || "Retour a l\u0027accueil"}
          </Link>
          <h1 className="text-3xl font-bold text-cream mb-2">{t("auth.welcome")}</h1>
          <p className="text-cream/40 text-sm">{t("auth.login.desc")}</p>
        </div>

        <button onClick={handleGoogle} className="w-full flex items-center justify-center gap-3 py-3.5 rounded-xl border border-cream/10 bg-cream/[0.03] text-cream/70 text-sm font-medium hover:bg-cream/[0.06] hover:border-cream/20 transition-all mb-4">
          <FaGoogle className="text-lg" />
          {t("auth.google")}
        </button>

        <div className="relative mb-6">
          <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-cream/[0.06]" /></div>
          <div className="relative flex justify-center"><span className="bg-dark px-4 text-cream/20 text-xs">{t("auth.or.email")}</span></div>
        </div>

        <AnimatePresence>
          {error && (
            <motion.div initial={{ opacity: 0, y: -10, height: 0 }} animate={{ opacity: 1, y: 0, height: "auto" }} exit={{ opacity: 0, y: -10, height: 0 }} className="mb-4 flex items-center gap-3 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
              <FaExclamationTriangle className="text-xs flex-shrink-0" />{error}
            </motion.div>
          )}
          {success && (
            <motion.div initial={{ opacity: 0, y: -10, height: 0 }} animate={{ opacity: 1, y: 0, height: "auto" }} exit={{ opacity: 0, y: -10, height: 0 }} className="mb-4 flex items-center gap-3 px-4 py-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm">
              <FaCheckCircle className="text-xs flex-shrink-0" />{success}
            </motion.div>
          )}
        </AnimatePresence>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-cream/50 text-xs font-medium mb-2 uppercase tracking-wider">{t("auth.email")}</label>
            <div className="relative">
              <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-cream/20 text-sm" />
              <input type="email" placeholder="votre@email.com" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-cream/[0.03] border border-cream/[0.08] text-cream placeholder:text-cream/20 text-sm focus:outline-none focus:border-gold/40 focus:bg-cream/[0.05] transition-all" />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-cream/50 text-xs font-medium uppercase tracking-wider">{t("auth.password")}</label>
              <Link href="/mot-de-passe-oublie" className="text-gold/60 hover:text-gold text-xs transition-colors">{t("auth.forgot")}</Link>
            </div>
            <div className="relative">
              <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-cream/20 text-sm" />
              <input type={showPassword ? "text" : "password"} placeholder={t("auth.password")} value={password} onChange={(e) => setPassword(e.target.value)} className="w-full pl-11 pr-12 py-3.5 rounded-xl bg-cream/[0.03] border border-cream/[0.08] text-cream placeholder:text-cream/20 text-sm focus:outline-none focus:border-gold/40 focus:bg-cream/[0.05] transition-all" />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-cream/20 hover:text-cream/50 transition-colors">
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>

          <button type="submit" disabled={loading} className="w-full py-4 rounded-xl bg-gradient-to-r from-gold to-gold-light text-navy font-bold text-sm hover:shadow-lg hover:shadow-gold/20 transition-all flex items-center justify-center gap-2 group disabled:opacity-70">
            {loading ? (
              <div className="flex items-center gap-2">
                <motion.div className="flex gap-1">
                  {[0, 1, 2].map((i) => (<motion.div key={i} className="w-1.5 h-1.5 rounded-full bg-navy" animate={{ y: [0, -6, 0] }} transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.1 }} />))}
                </motion.div>
                <span>{t("auth.login.loading")}</span>
              </div>
            ) : (
              <>{t("auth.login.btn")} <FaArrowRight className="text-xs group-hover:translate-x-1 transition-transform" /></>
            )}
          </button>
        </form>

        <p className="mt-8 text-center text-cream/30 text-sm">
          {t("auth.no.account")}{" "}
          <Link href="/inscription" className="text-gold/70 hover:text-gold font-medium transition-colors">{t("auth.create.account")}</Link>
        </p>

        {/* Comptes de test */}
        <div className="mt-6 p-4 rounded-xl bg-cream/[0.02] border border-cream/[0.06]">
          <p className="text-cream/20 text-[10px] uppercase tracking-wider mb-3">Comptes de test</p>
          <div className="space-y-2">
            {[
              { label: "Admin", email: "admin@lordlomboacademie.com", pwd: "Admin2026!" },
              { label: "Etudiant", email: "jean@demo.com", pwd: "Student2026!" },
            ].map((acc) => (
              <button
                key={acc.email}
                onClick={() => { setEmail(acc.email); setPassword(acc.pwd); }}
                className="w-full flex items-center justify-between px-3 py-2 rounded-lg bg-cream/[0.03] hover:bg-cream/[0.06] transition-all text-left"
              >
                <span className="text-cream/50 text-xs font-medium">{acc.label}</span>
                <span className="text-cream/25 text-[10px]">{acc.email}</span>
              </button>
            ))}
          </div>
        </div>
      </motion.div>
    </>
  );
}
