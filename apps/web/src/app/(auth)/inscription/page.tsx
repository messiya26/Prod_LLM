"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { FaUser, FaEnvelope, FaLock, FaEye, FaEyeSlash, FaPhone, FaGoogle, FaArrowRight, FaArrowLeft, FaCheck, FaExclamationTriangle } from "react-icons/fa";
import { useAuth } from "@/context/auth-context";
import { FullPageLoader } from "@/components/ui/loader";
import { ValidationModal } from "@/components/ui/validation-modal";
import { useI18n } from "@/context/i18n-context";

export default function Inscription() {
  const { register, loginWithGoogle } = useAuth();
  const { t } = useI18n();
  const [showPassword, setShowPassword] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingMsg, setLoadingMsg] = useState("");
  const [error, setError] = useState("");
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [showValidation, setShowValidation] = useState(false);

  const requirements = [
    { labelKey: "auth.pwd.min", test: (p: string) => p.length >= 8 },
    { labelKey: "auth.pwd.upper", test: (p: string) => /[A-Z]/.test(p) },
    { labelKey: "auth.pwd.digit", test: (p: string) => /[0-9]/.test(p) },
  ];

  const allValid = requirements.every((r) => r.test(password));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errors: string[] = [];
    if (!firstName.trim()) errors.push("Le prenom est requis");
    if (!lastName.trim()) errors.push("Le nom est requis");
    if (!email.trim()) errors.push("L'adresse email est requise");
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.push("L'adresse email n'est pas valide");
    if (!password) errors.push("Le mot de passe est requis");
    else if (!allValid) errors.push("Le mot de passe ne respecte pas les criteres de securite");
    if (errors.length > 0) {
      setValidationErrors(errors);
      setShowValidation(true);
      return;
    }
    setError("");
    setLoading(true);
    setLoadingMsg("Creation de votre compte...");
    try {
      await register({ firstName, lastName, email, password, phone: phone || undefined });
      setLoadingMsg("Compte cree ! Verification de votre email...");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : t("auth.register.error"));
      setLoading(false);
      setLoadingMsg("");
    }
  };

  const handleGoogle = async () => {
    setLoading(true);
    setLoadingMsg("Connexion avec Google...");
    await loginWithGoogle();
  };

  return (
    <>
      <ValidationModal errors={validationErrors} isOpen={showValidation} onClose={() => setShowValidation(false)} />
      <AnimatePresence>
        {loading && <FullPageLoader message={loadingMsg} />}
      </AnimatePresence>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
        <div className="mb-8">
          <Link href="/" className="inline-flex items-center gap-2 text-cream/40 hover:text-gold text-sm mb-6 transition-colors">
            <FaArrowLeft className="text-xs" /> {t("auth.backHome")}
          </Link>
          <h1 className="text-3xl font-bold text-cream mb-2">{t("auth.join")}</h1>
          <p className="text-cream/40 text-sm">{t("auth.register.desc")}</p>
        </div>

        <button onClick={handleGoogle} className="w-full flex items-center justify-center gap-3 py-3.5 rounded-xl border border-cream/10 bg-cream/[0.03] text-cream/70 text-sm font-medium hover:bg-cream/[0.06] hover:border-cream/20 transition-all mb-6">
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
        </AnimatePresence>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-cream/50 text-xs font-medium mb-2 uppercase tracking-wider">{t("auth.firstName")}</label>
              <div className="relative">
                <FaUser className="absolute left-4 top-1/2 -translate-y-1/2 text-cream/20 text-sm" />
                <input type="text" placeholder="Jean" value={firstName} onChange={(e) => setFirstName(e.target.value)} className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-cream/[0.03] border border-cream/[0.08] text-cream placeholder:text-cream/20 text-sm focus:outline-none focus:border-gold/40 focus:bg-cream/[0.05] transition-all" />
              </div>
            </div>
            <div>
              <label className="block text-cream/50 text-xs font-medium mb-2 uppercase tracking-wider">{t("auth.lastName")}</label>
              <input type="text" placeholder="Kisula" value={lastName} onChange={(e) => setLastName(e.target.value)} className="w-full px-4 py-3.5 rounded-xl bg-cream/[0.03] border border-cream/[0.08] text-cream placeholder:text-cream/20 text-sm focus:outline-none focus:border-gold/40 focus:bg-cream/[0.05] transition-all" />
            </div>
          </div>

          <div>
            <label className="block text-cream/50 text-xs font-medium mb-2 uppercase tracking-wider">{t("auth.email")}</label>
            <div className="relative">
              <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-cream/20 text-sm" />
              <input type="email" placeholder="votre@email.com" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-cream/[0.03] border border-cream/[0.08] text-cream placeholder:text-cream/20 text-sm focus:outline-none focus:border-gold/40 focus:bg-cream/[0.05] transition-all" />
            </div>
          </div>

          <div>
            <label className="block text-cream/50 text-xs font-medium mb-2 uppercase tracking-wider">{t("auth.phone")}</label>
            <div className="relative">
              <FaPhone className="absolute left-4 top-1/2 -translate-y-1/2 text-cream/20 text-sm" />
              <input type="tel" placeholder="+243 XXX XXX XXX" value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-cream/[0.03] border border-cream/[0.08] text-cream placeholder:text-cream/20 text-sm focus:outline-none focus:border-gold/40 focus:bg-cream/[0.05] transition-all" />
            </div>
          </div>

          <div>
            <label className="block text-cream/50 text-xs font-medium mb-2 uppercase tracking-wider">{t("auth.password")}</label>
            <div className="relative">
              <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-cream/20 text-sm" />
              <input type={showPassword ? "text" : "password"} placeholder={t("auth.pwd.placeholder")} value={password} onChange={(e) => setPassword(e.target.value)} className="w-full pl-11 pr-12 py-3.5 rounded-xl bg-cream/[0.03] border border-cream/[0.08] text-cream placeholder:text-cream/20 text-sm focus:outline-none focus:border-gold/40 focus:bg-cream/[0.05] transition-all" />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-cream/20 hover:text-cream/50 transition-colors">
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            {password && (
              <div className="mt-3 space-y-1.5">
                {requirements.map((r) => (
                  <motion.div key={r.labelKey} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className={`flex items-center gap-2 text-xs transition-colors ${r.test(password) ? "text-emerald-400" : "text-cream/25"}`}>
                    <FaCheck className="text-[10px]" />
                    {t(r.labelKey)}
                  </motion.div>
                ))}
              </div>
            )}
          </div>

          <div className="flex items-start gap-3 pt-1">
            <input type="checkbox" className="mt-1 accent-gold" />
            <span className="text-cream/30 text-xs leading-relaxed">
              {t("auth.accept")}{" "}
              <Link href="/cgv" className="text-gold/60 hover:text-gold transition-colors">{t("auth.terms")}</Link>
              {" "}{t("auth.and")}{" "}
              <Link href="/politique-confidentialite" className="text-gold/60 hover:text-gold transition-colors">{t("auth.privacy")}</Link>
            </span>
          </div>

          <button type="submit" disabled={loading} className="w-full py-4 rounded-xl bg-gradient-to-r from-gold to-gold-light text-navy font-bold text-sm hover:shadow-lg hover:shadow-gold/20 transition-all flex items-center justify-center gap-2 group disabled:opacity-70">
            {loading ? (
              <div className="flex items-center gap-2">
                <motion.div className="flex gap-1">
                  {[0, 1, 2].map((i) => (<motion.div key={i} className="w-1.5 h-1.5 rounded-full bg-navy" animate={{ y: [0, -6, 0] }} transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.1 }} />))}
                </motion.div>
                <span>{t("auth.register.loading")}</span>
              </div>
            ) : (
              <>{t("auth.register.btn")} <FaArrowRight className="text-xs group-hover:translate-x-1 transition-transform" /></>
            )}
          </button>
        </form>

        <p className="mt-6 text-center text-cream/30 text-sm">
          {t("auth.already")}{" "}
          <Link href="/connexion" className="text-gold/70 hover:text-gold font-medium transition-colors">{t("auth.login.link")}</Link>
        </p>
      </motion.div>
    </>
  );
}
