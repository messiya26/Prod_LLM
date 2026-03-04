"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaUser, FaLock, FaBell, FaGlobe, FaSave, FaCheckCircle, FaSpinner, FaTimes } from "react-icons/fa";
import { useAuth } from "@/context/auth-context";
import { useI18n } from "@/context/i18n-context";
import api from "@/lib/api";

function Toast({ message, type, onClose }: { message: string; type: "success" | "error"; onClose: () => void }) {
  useEffect(() => { const t = setTimeout(onClose, 3500); return () => clearTimeout(t); }, [onClose]);
  return (
    <motion.div
      initial={{ opacity: 0, y: -30, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.9 }}
      className={`fixed top-6 right-6 z-[100] flex items-center gap-3 px-6 py-4 rounded-2xl shadow-2xl backdrop-blur-xl border ${
        type === "success"
          ? "bg-emerald-500/15 border-emerald-500/20 text-emerald-400"
          : "bg-red-500/15 border-red-500/20 text-red-400"
      }`}
    >
      {type === "success" ? <FaCheckCircle className="text-lg" /> : <FaTimes className="text-lg" />}
      <span className="text-sm font-medium">{message}</span>
      <button onClick={onClose} className="ml-2 opacity-50 hover:opacity-100 transition-opacity"><FaTimes className="text-xs" /></button>
    </motion.div>
  );
}

export default function Parametres() {
  const { user, refreshProfile } = useAuth();
  const { locale, setLocale } = useI18n();
  const [saving, setSaving] = useState(false);
  const [firstName, setFirstName] = useState(user?.firstName || "");
  const [lastName, setLastName] = useState(user?.lastName || "");
  const [phone, setPhone] = useState(user?.phone || "");
  const [notifications, setNotifications] = useState({ email: true, push: false, sms: false });
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);
  const [dirty, setDirty] = useState(false);
  const [showPwdModal, setShowPwdModal] = useState(false);
  const [pwdForm, setPwdForm] = useState({ current: "", newPwd: "", confirm: "" });
  const [pwdSaving, setPwdSaving] = useState(false);

  useEffect(() => {
    if (user) {
      setFirstName(user.firstName || "");
      setLastName(user.lastName || "");
      setPhone((user as any).phone || "");
    }
  }, [user]);

  useEffect(() => {
    if (!user) return;
    const changed = firstName !== (user.firstName || "") || lastName !== (user.lastName || "") || phone !== ((user as any).phone || "");
    setDirty(changed);
  }, [firstName, lastName, phone, user]);

  const handleSave = async () => {
    if (!dirty) return;
    setSaving(true);
    try {
      await api.patch("/auth/profile", { firstName, lastName, phone });
      if (refreshProfile) await refreshProfile();
      setToast({ message: locale === "fr" ? "Modifications enregistrees avec succes !" : "Changes saved successfully!", type: "success" });
      setDirty(false);
    } catch {
      setToast({ message: locale === "fr" ? "Erreur lors de la sauvegarde" : "Error saving changes", type: "error" });
    } finally { setSaving(false); }
  };

  const handlePasswordChange = async () => {
    if (pwdForm.newPwd !== pwdForm.confirm) {
      setToast({ message: locale === "fr" ? "Les mots de passe ne correspondent pas" : "Passwords do not match", type: "error" });
      return;
    }
    if (pwdForm.newPwd.length < 6) {
      setToast({ message: locale === "fr" ? "Le mot de passe doit contenir au moins 6 caracteres" : "Password must be at least 6 characters", type: "error" });
      return;
    }
    setPwdSaving(true);
    try {
      await api.patch("/auth/profile", { currentPassword: pwdForm.current, password: pwdForm.newPwd });
      setToast({ message: locale === "fr" ? "Mot de passe modifie avec succes !" : "Password changed successfully!", type: "success" });
      setShowPwdModal(false);
      setPwdForm({ current: "", newPwd: "", confirm: "" });
    } catch {
      setToast({ message: locale === "fr" ? "Mot de passe actuel incorrect" : "Current password incorrect", type: "error" });
    } finally { setPwdSaving(false); }
  };

  return (
    <div className="space-y-6 max-w-[800px]">
      <AnimatePresence>
        {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      </AnimatePresence>

      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-cream">{locale === "fr" ? "Parametres" : "Settings"}</h1>
        {dirty && (
          <motion.span initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className="text-amber-400/60 text-xs px-3 py-1 rounded-full bg-amber-400/10 border border-amber-400/20">
            {locale === "fr" ? "Modifications non sauvegardees" : "Unsaved changes"}
          </motion.span>
        )}
      </div>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-cream/[0.02] border border-cream/[0.05] rounded-xl p-6">
        <div className="flex items-center gap-3 mb-6">
          <FaUser className="text-gold" />
          <h2 className="text-cream font-semibold">{locale === "fr" ? "Informations personnelles" : "Personal info"}</h2>
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-cream/40 text-xs mb-1.5 uppercase tracking-wider">{locale === "fr" ? "Prenom" : "First name"}</label>
            <input value={firstName} onChange={(e) => setFirstName(e.target.value)} className="w-full px-4 py-3 rounded-lg bg-cream/[0.03] border border-cream/[0.08] text-cream text-sm focus:outline-none focus:border-gold/30 transition-all" />
          </div>
          <div>
            <label className="block text-cream/40 text-xs mb-1.5 uppercase tracking-wider">{locale === "fr" ? "Nom" : "Last name"}</label>
            <input value={lastName} onChange={(e) => setLastName(e.target.value)} className="w-full px-4 py-3 rounded-lg bg-cream/[0.03] border border-cream/[0.08] text-cream text-sm focus:outline-none focus:border-gold/30 transition-all" />
          </div>
          <div>
            <label className="block text-cream/40 text-xs mb-1.5 uppercase tracking-wider">Email</label>
            <input value={user?.email || ""} disabled className="w-full px-4 py-3 rounded-lg bg-cream/[0.02] border border-cream/[0.05] text-cream/40 text-sm cursor-not-allowed" />
          </div>
          <div>
            <label className="block text-cream/40 text-xs mb-1.5 uppercase tracking-wider">{locale === "fr" ? "Telephone" : "Phone"}</label>
            <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+243..." className="w-full px-4 py-3 rounded-lg bg-cream/[0.03] border border-cream/[0.08] text-cream text-sm placeholder:text-cream/20 focus:outline-none focus:border-gold/30 transition-all" />
          </div>
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="bg-cream/[0.02] border border-cream/[0.05] rounded-xl p-6">
        <div className="flex items-center gap-3 mb-6">
          <FaGlobe className="text-gold" />
          <h2 className="text-cream font-semibold">{locale === "fr" ? "Langue" : "Language"}</h2>
        </div>
        <div className="flex gap-3">
          {(["fr", "en"] as const).map((lang) => (
            <button key={lang} onClick={() => setLocale(lang)} className={`px-6 py-3 rounded-lg text-sm font-medium transition-all ${locale === lang ? "bg-gold/20 text-gold border border-gold/30" : "bg-cream/[0.03] text-cream/40 border border-cream/[0.08] hover:text-cream/60"}`}>
              {lang === "fr" ? "Francais" : "English"}
            </button>
          ))}
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-cream/[0.02] border border-cream/[0.05] rounded-xl p-6">
        <div className="flex items-center gap-3 mb-6">
          <FaBell className="text-gold" />
          <h2 className="text-cream font-semibold">Notifications</h2>
        </div>
        <div className="space-y-3">
          {([
            { key: "email" as const, label: locale === "fr" ? "Notifications par email" : "Email notifications" },
            { key: "push" as const, label: locale === "fr" ? "Notifications push" : "Push notifications" },
            { key: "sms" as const, label: "SMS" },
          ]).map((item) => (
            <label key={item.key} className="flex items-center justify-between p-3 rounded-lg hover:bg-cream/[0.02] transition-all cursor-pointer">
              <span className="text-cream/60 text-sm">{item.label}</span>
              <div className={`w-10 h-5 rounded-full transition-all relative cursor-pointer ${notifications[item.key] ? "bg-gold" : "bg-cream/[0.1]"}`}
                onClick={() => setNotifications((n) => ({ ...n, [item.key]: !n[item.key] }))}
              >
                <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all ${notifications[item.key] ? "left-5" : "left-0.5"}`} />
              </div>
            </label>
          ))}
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="bg-cream/[0.02] border border-cream/[0.05] rounded-xl p-6">
        <div className="flex items-center gap-3 mb-6">
          <FaLock className="text-gold" />
          <h2 className="text-cream font-semibold">{locale === "fr" ? "Securite" : "Security"}</h2>
        </div>
        <button onClick={() => setShowPwdModal(true)} className="px-5 py-3 rounded-lg border border-cream/[0.08] text-cream/50 text-sm hover:border-gold/20 hover:text-cream transition-all">
          {locale === "fr" ? "Modifier le mot de passe" : "Change password"}
        </button>
      </motion.div>

      <AnimatePresence>
        {showPwdModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[90] flex items-center justify-center bg-black/60 backdrop-blur-sm"
            onClick={() => setShowPwdModal(false)}>
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
              onClick={e => e.stopPropagation()} className="bg-[#0d1a2e] border border-gold/20 rounded-2xl p-8 w-full max-w-md mx-4">
              <h3 className="text-lg font-bold text-cream mb-6 flex items-center gap-2"><FaLock className="text-gold" /> {locale === "fr" ? "Modifier le mot de passe" : "Change password"}</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-cream/40 text-xs mb-1.5 uppercase tracking-wider">{locale === "fr" ? "Mot de passe actuel" : "Current password"}</label>
                  <input type="password" value={pwdForm.current} onChange={e => setPwdForm({ ...pwdForm, current: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg bg-cream/[0.03] border border-cream/[0.08] text-cream text-sm focus:outline-none focus:border-gold/30 transition-all" />
                </div>
                <div>
                  <label className="block text-cream/40 text-xs mb-1.5 uppercase tracking-wider">{locale === "fr" ? "Nouveau mot de passe" : "New password"}</label>
                  <input type="password" value={pwdForm.newPwd} onChange={e => setPwdForm({ ...pwdForm, newPwd: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg bg-cream/[0.03] border border-cream/[0.08] text-cream text-sm focus:outline-none focus:border-gold/30 transition-all" />
                </div>
                <div>
                  <label className="block text-cream/40 text-xs mb-1.5 uppercase tracking-wider">{locale === "fr" ? "Confirmer" : "Confirm"}</label>
                  <input type="password" value={pwdForm.confirm} onChange={e => setPwdForm({ ...pwdForm, confirm: e.target.value })}
                    onKeyDown={e => e.key === "Enter" && handlePasswordChange()}
                    className="w-full px-4 py-3 rounded-lg bg-cream/[0.03] border border-cream/[0.08] text-cream text-sm focus:outline-none focus:border-gold/30 transition-all" />
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <button onClick={() => setShowPwdModal(false)} className="flex-1 py-3 rounded-xl border border-cream/[0.08] text-cream/40 text-sm hover:text-cream transition-all">
                  {locale === "fr" ? "Annuler" : "Cancel"}
                </button>
                <button onClick={handlePasswordChange} disabled={pwdSaving || !pwdForm.current || !pwdForm.newPwd}
                  className="flex-1 py-3 rounded-xl bg-gold text-navy font-bold text-sm hover:bg-gold-light transition-all disabled:opacity-50 flex items-center justify-center gap-2">
                  {pwdSaving ? <FaSpinner className="animate-spin" /> : <FaSave />} {locale === "fr" ? "Modifier" : "Update"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex justify-end">
        <button onClick={handleSave} disabled={saving || !dirty}
          className={`flex items-center gap-2 px-8 py-3 rounded-xl text-sm font-bold transition-all ${
            dirty ? "bg-gradient-to-r from-gold to-gold-light text-navy hover:shadow-lg hover:shadow-gold/20" : "bg-cream/[0.05] text-cream/20 cursor-not-allowed"
          }`}>
          {saving ? <><FaSpinner className="animate-spin" /> {locale === "fr" ? "Enregistrement..." : "Saving..."}</> : <><FaSave /> {locale === "fr" ? "Enregistrer" : "Save"}</>}
        </button>
      </div>
    </div>
  );
}
