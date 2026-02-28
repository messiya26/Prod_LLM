"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AnimatedSection, Badge, Button } from "@/components/ui";
import { useI18n } from "@/context/i18n-context";
import { FaEnvelope, FaPhoneAlt, FaMapMarkerAlt, FaPaperPlane, FaCheck, FaClock, FaCalendarAlt, FaExclamationTriangle, FaShieldAlt, FaTimes } from "react-icons/fa";
import api from "@/lib/api";

export default function Contact() {
  const { t, locale } = useI18n();
  const [form, setForm] = useState({ name: "", email: "", phone: "", subject: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [showErrorPopup, setShowErrorPopup] = useState(false);
  const [errorList, setErrorList] = useState<string[]>([]);
  const [isInjection, setIsInjection] = useState(false);

  const dangerousPattern = /(<script|javascript:|on\w+=|<iframe|<object|<embed|eval\(|document\.|window\.|alert\()/i;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const validate = (): boolean => {
    const errs: Record<string, string> = {};
    const errMessages: string[] = [];
    let injection = false;

    if (dangerousPattern.test(form.name) || dangerousPattern.test(form.message) || dangerousPattern.test(form.email)) {
      injection = true;
      errMessages.push(locale === "fr" ? "Contenu malveillant detecte. Votre tentative a ete enregistree." : "Malicious content detected. Your attempt has been logged.");
    }

    if (!injection) {
      if (!form.name.trim() || form.name.trim().length < 2) {
        errs.name = locale === "fr" ? "Le nom est requis (min. 2 caracteres)" : "Name is required (min. 2 chars)";
        errMessages.push(errs.name);
      }
      if (!form.email.trim() || !emailRegex.test(form.email)) {
        errs.email = locale === "fr" ? "Adresse email invalide" : "Invalid email address";
        errMessages.push(errs.email);
      }
      if (!form.subject) {
        errs.subject = locale === "fr" ? "Veuillez choisir un sujet" : "Please select a subject";
        errMessages.push(errs.subject);
      }
      if (!form.message.trim() || form.message.trim().length < 10) {
        errs.message = locale === "fr" ? "Le message est requis (min. 10 caracteres)" : "Message is required (min. 10 chars)";
        errMessages.push(errs.message);
      }
    }

    setFieldErrors(errs);
    if (errMessages.length > 0) {
      setIsInjection(injection);
      setErrorList(errMessages);
      setShowErrorPopup(true);
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!validate()) return;
    setLoading(true);
    try {
      await api.post("/contact", form);
      setSent(true);
      setForm({ name: "", email: "", phone: "", subject: "", message: "" });
      setFieldErrors({});
    } catch {
      setError(t("contact.form.error"));
    }
    setLoading(false);
  };

  const update = (key: string, val: string) => {
    setForm((f) => ({ ...f, [key]: val }));
    if (fieldErrors[key]) setFieldErrors((e) => { const n = { ...e }; delete n[key]; return n; });
  };

  const fieldCls = (key: string) => fieldErrors[key]
    ? "w-full px-4 py-3.5 rounded-xl bg-red-500/[0.05] border border-red-500/30 text-cream placeholder:text-cream/20 text-sm focus:outline-none focus:border-red-400/50 transition-all"
    : "w-full px-4 py-3.5 rounded-xl bg-cream/[0.03] border border-cream/[0.08] text-cream placeholder:text-cream/20 text-sm focus:outline-none focus:border-gold/40 transition-all";

  const FieldError = ({ name }: { name: string }) => fieldErrors[name] ? (
    <motion.p initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="text-red-400 text-[11px] mt-1.5">{fieldErrors[name]}</motion.p>
  ) : null;

  return (
    <>
      <section className="relative py-12 md:py-16 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-gold/[0.03] to-transparent" />
        <div className="max-w-4xl mx-auto px-6 relative text-center">
          <Badge variant="gold" className="mb-6">{t("contact.badge")}</Badge>
          <h1 className="text-4xl md:text-5xl font-bold text-cream mb-4">
            {t("contact.title1")} <span className="text-gradient-gold">{t("contact.title2")}</span>
          </h1>
          <p className="text-cream/45 max-w-xl mx-auto">{t("contact.desc")}</p>
        </div>
      </section>

      <section className="pb-12 px-6">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-5 gap-10">
          <div className="lg:col-span-2 space-y-6">
            <AnimatedSection>
              <div className="rounded-2xl bg-cream/[0.02] border border-cream/[0.06] p-7 space-y-6">
                <h3 className="text-lg font-bold text-cream">{t("contact.info")}</h3>
                {[
                  { icon: <FaEnvelope />, label: t("contact.email"), value: "contact@lordlomboacademie.com", color: "text-blue-400 bg-blue-400/10" },
                  { icon: <FaPhoneAlt />, label: t("contact.phone"), value: "+243 XXX XXX XXX", color: "text-emerald-400 bg-emerald-400/10" },
                  { icon: <FaMapMarkerAlt />, label: t("contact.address"), value: "Kinshasa, RD Congo", color: "text-amber-400 bg-amber-400/10" },
                  { icon: <FaClock />, label: t("contact.hours"), value: t("contact.hours.value"), color: "text-gold bg-gold/10" },
                ].map((item) => (
                  <div key={item.label} className="flex items-start gap-4">
                    <div className={`w-10 h-10 rounded-xl ${item.color} flex items-center justify-center flex-shrink-0`}>{item.icon}</div>
                    <div>
                      <div className="text-cream/40 text-xs font-medium uppercase tracking-wider mb-1">{item.label}</div>
                      <div className="text-cream text-sm">{item.value}</div>
                    </div>
                  </div>
                ))}
              </div>
            </AnimatedSection>

            <AnimatedSection delay={0.1}>
              <div className="rounded-2xl bg-gradient-to-br from-gold/10 to-gold/5 border border-gold/10 p-7">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-gold/20 flex items-center justify-center">
                    <FaCalendarAlt className="text-gold text-sm" />
                  </div>
                  <h3 className="text-lg font-bold text-cream">{t("contact.rdv")}</h3>
                </div>
                <p className="text-cream/40 text-sm mb-5">{t("contact.rdv.desc")}</p>
                <Button variant="primary" size="sm">{t("contact.rdv.button")}</Button>
              </div>
            </AnimatedSection>
          </div>

          <div className="lg:col-span-3">
            <AnimatedSection delay={0.1}>
              <div className="rounded-2xl bg-cream/[0.02] border border-cream/[0.06] p-8">
                <AnimatePresence mode="wait">
                  {sent ? (
                    <motion.div key="success" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-16">
                      <div className="w-20 h-20 rounded-full bg-emerald-400/10 flex items-center justify-center mx-auto mb-6">
                        <FaCheck className="text-emerald-400 text-3xl" />
                      </div>
                      <h3 className="text-2xl font-bold text-cream mb-3">{t("contact.form.success")}</h3>
                      <p className="text-cream/40 mb-6">{t("contact.form.success.desc")}</p>
                      <Button variant="outline" size="sm" onClick={() => setSent(false)}>{t("contact.form.another")}</Button>
                    </motion.div>
                  ) : (
                    <motion.form key="form" onSubmit={handleSubmit} className="space-y-5">
                      <h3 className="text-lg font-bold text-cream mb-2">{t("contact.form.title")}</h3>

                      {error && <div className="px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">{error}</div>}

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-cream/50 text-xs font-medium mb-2 uppercase tracking-wider">{t("contact.form.name")}</label>
                          <input type="text" value={form.name} onChange={(e) => update("name", e.target.value)} placeholder="Jean Kisula" className={fieldCls("name")} />
                          <FieldError name="name" />
                        </div>
                        <div>
                          <label className="block text-cream/50 text-xs font-medium mb-2 uppercase tracking-wider">{t("contact.form.email")}</label>
                          <input type="email" value={form.email} onChange={(e) => update("email", e.target.value)} placeholder="votre@email.com" className={fieldCls("email")} />
                          <FieldError name="email" />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-cream/50 text-xs font-medium mb-2 uppercase tracking-wider">{t("contact.form.phone")}</label>
                          <input type="tel" value={form.phone} onChange={(e) => update("phone", e.target.value)} placeholder="+243 XXX XXX XXX" className="w-full px-4 py-3.5 rounded-xl bg-cream/[0.03] border border-cream/[0.08] text-cream placeholder:text-cream/20 text-sm focus:outline-none focus:border-gold/40 transition-all" />
                        </div>
                        <div>
                          <label className="block text-cream/50 text-xs font-medium mb-2 uppercase tracking-wider">{t("contact.form.subject")}</label>
                          <select value={form.subject} onChange={(e) => update("subject", e.target.value)} className={fieldCls("subject")}>
                            <option value="" className="bg-dark">{t("contact.form.subject.choose")}</option>
                            <option value="Information generale" className="bg-dark">{t("contact.form.subject.info")}</option>
                            <option value="Inscription formation" className="bg-dark">{t("contact.form.subject.inscription")}</option>
                            <option value="Partenariat" className="bg-dark">{t("contact.form.subject.partnership")}</option>
                            <option value="Support technique" className="bg-dark">{t("contact.form.subject.support")}</option>
                            <option value="Demande de devis" className="bg-dark">{t("contact.form.subject.quote")}</option>
                            <option value="Autre" className="bg-dark">{t("contact.form.subject.other")}</option>
                          </select>
                          <FieldError name="subject" />
                        </div>
                      </div>

                      <div>
                        <label className="block text-cream/50 text-xs font-medium mb-2 uppercase tracking-wider">{t("contact.form.message")}</label>
                        <textarea rows={5} value={form.message} onChange={(e) => update("message", e.target.value)} placeholder="..." className={fieldCls("message").replace("py-3.5", "py-3.5") + " resize-none"} />
                        <FieldError name="message" />
                      </div>

                      <button type="submit" disabled={loading} className="w-full py-4 rounded-xl bg-gradient-to-r from-gold to-gold-light text-navy font-bold text-sm hover:shadow-lg hover:shadow-gold/20 transition-all flex items-center justify-center gap-2 disabled:opacity-70">
                        {loading ? (
                          <motion.div className="flex gap-1">
                            {[0, 1, 2].map((i) => (
                              <motion.div key={i} className="w-1.5 h-1.5 rounded-full bg-navy" animate={{ y: [0, -6, 0] }} transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.1 }} />
                            ))}
                          </motion.div>
                        ) : (
                          <><FaPaperPlane className="text-xs" /> {t("contact.form.send")}</>
                        )}
                      </button>
                    </motion.form>
                  )}
                </AnimatePresence>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      <AnimatePresence>
        {showErrorPopup && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={() => setShowErrorPopup(false)}>
            <motion.div initial={{ scale: 0.8, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.8, opacity: 0, y: 20 }} transition={{ type: "spring", damping: 25 }} onClick={(e) => e.stopPropagation()} className="w-full max-w-md rounded-2xl border overflow-hidden" style={{ background: "linear-gradient(145deg, rgba(20,20,30,0.98), rgba(10,10,18,0.99))", borderColor: isInjection ? "rgba(239,68,68,0.3)" : "rgba(245,158,11,0.3)" }}>
              <div className={`px-6 pt-6 pb-4 flex items-start gap-4 ${isInjection ? "bg-red-500/[0.05]" : "bg-amber-500/[0.05]"}`}>
                <motion.div initial={{ rotate: -15, scale: 0 }} animate={{ rotate: 0, scale: 1 }} transition={{ type: "spring", delay: 0.15 }} className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${isInjection ? "bg-red-500/15" : "bg-amber-500/15"}`}>
                  {isInjection ? <FaShieldAlt className="text-red-400 text-xl" /> : <FaExclamationTriangle className="text-amber-400 text-xl" />}
                </motion.div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-cream">{isInjection ? (locale === "fr" ? "Alerte securite" : "Security Alert") : (locale === "fr" ? "Champs incomplets" : "Incomplete Fields")}</h3>
                  <p className="text-cream/40 text-xs mt-1">{isInjection ? (locale === "fr" ? "Activite suspecte detectee" : "Suspicious activity detected") : (locale === "fr" ? "Veuillez corriger les erreurs suivantes" : "Please fix the following errors")}</p>
                </div>
                <button onClick={() => setShowErrorPopup(false)} className="text-cream/30 hover:text-cream transition-colors"><FaTimes /></button>
              </div>
              <div className="px-6 py-4 space-y-2">
                {errorList.map((err, i) => (
                  <motion.div key={i} initial={{ x: -10, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.1 + i * 0.05 }} className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm ${isInjection ? "bg-red-500/[0.06] text-red-300 border border-red-500/10" : "bg-amber-500/[0.06] text-amber-300 border border-amber-500/10"}`}>
                    <span className="w-5 h-5 rounded-full bg-cream/[0.06] flex items-center justify-center text-[10px] font-bold flex-shrink-0">{i + 1}</span>
                    {err}
                  </motion.div>
                ))}
              </div>
              <div className="px-6 pb-6 pt-2">
                <button onClick={() => setShowErrorPopup(false)} className={`w-full py-3 rounded-xl font-semibold text-sm transition-all ${isInjection ? "bg-red-500/15 text-red-300 hover:bg-red-500/25 border border-red-500/20" : "bg-gradient-to-r from-gold to-gold-light text-navy hover:shadow-lg hover:shadow-gold/20"}`}>
                  {locale === "fr" ? "Compris" : "Got it"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
