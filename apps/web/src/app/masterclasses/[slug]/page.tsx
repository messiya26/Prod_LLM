"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { AnimatedSection, Badge } from "@/components/ui";
import {
  FaCalendarAlt, FaClock, FaGlobe, FaMapMarkerAlt, FaUsers, FaChair,
  FaCheck, FaArrowRight, FaSpinner, FaCertificate, FaPlayCircle,
  FaShieldAlt, FaArrowLeft, FaCrown, FaBookOpen,
  FaChevronDown, FaChevronUp, FaStar, FaFire, FaGraduationCap,
} from "react-icons/fa";
import { useI18n } from "@/context/i18n-context";
import { useAuth } from "@/context/auth-context";
import api from "@/lib/api";

const catGradients: Record<string, string> = {
  worship: "from-indigo-900 via-purple-900/80 to-gold/20",
  leadership: "from-amber-900 via-orange-900/80 to-gold/20",
  writing: "from-emerald-900 via-teal-900/80 to-gold/20",
  music: "from-rose-900 via-pink-900/80 to-gold/20",
  general: "from-navy via-navy/90 to-gold/10",
};

export default function MasterclassDetail({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const [mc, setMc] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [registering, setRegistering] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [openDay, setOpenDay] = useState<number>(0);
  const { locale } = useI18n();
  const { user } = useAuth();
  const router = useRouter();
  const fr = locale === "fr";

  useEffect(() => {
    api.get(`/masterclasses/${slug}`).then((d: any) => {
      setMc(d);
      if (user && d.registrations?.some((r: any) => r.user?.id === user.sub)) setIsRegistered(true);
    }).catch(() => router.push("/masterclasses")).finally(() => setLoading(false));
  }, [slug]);

  useEffect(() => {
    if (user && mc) {
      api.get(`/masterclasses/${mc.id}/check-registration`).then((r: any) => { if (r) setIsRegistered(true); }).catch(() => {});
    }
  }, [user, mc]);

  const handleRegister = async () => {
    if (!user) { router.push("/inscription"); return; }
    setRegistering(true);
    try {
      await api.post(`/masterclasses/${mc.id}/register`, {});
      setIsRegistered(true);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 4000);
    } catch (e: any) { setErrorMsg(e?.message || (fr ? "Erreur lors de l'inscription" : "Registration error")); }
    finally { setRegistering(false); }
  };

  if (loading) return <div className="flex items-center justify-center min-h-[50vh]"><FaSpinner className="animate-spin text-gold text-3xl" /></div>;
  if (!mc) return null;

  const program: any[] = (() => { try { return JSON.parse(fr ? mc.programFr : mc.programEn || mc.programFr); } catch { return []; } })();
  const whatYouLearn: string[] = (() => { try { return JSON.parse(fr ? mc.whatYouLearnFr : mc.whatYouLearnEn || mc.whatYouLearnFr); } catch { return []; } })();
  const included: string[] = (() => { try { return JSON.parse(fr ? mc.includedFr : mc.includedEn || mc.includedFr); } catch { return []; } })();
  const prereqs: string[] = (() => { try { return JSON.parse(mc.prerequisites); } catch { return []; } })();

  const days = Math.max(1, Math.ceil((new Date(mc.endDate).getTime() - new Date(mc.startDate).getTime()) / 86400000));
  const eb = mc.earlyBirdPrice && mc.earlyBirdEnd && new Date() < new Date(mc.earlyBirdEnd);
  const sym = mc.currency === "EUR" ? "\u20ac" : mc.currency === "XAF" ? "FCFA " : "$";
  const pctFull = ((mc.maxSeats - mc.seatsLeft) / mc.maxSeats) * 100;
  const du = Math.max(0, Math.ceil((new Date(mc.startDate).getTime() - Date.now()) / 86400000));
  const grad = catGradients[mc.category] || catGradients.general;

  return (
    <>
      {/* Hero Banner */}
      <section className={`relative overflow-hidden bg-gradient-to-br ${grad}`}>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_20%,rgba(212,175,55,0.12),transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_80%_80%,rgba(0,0,0,0.4),transparent_50%)]" />
        <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-6 pb-8 md:pt-8 md:pb-10 relative">
          <button onClick={() => router.push("/masterclasses")} className="flex items-center gap-2 text-cream/40 hover:text-cream text-xs mb-4 transition-colors">
            <FaArrowLeft className="text-[10px]" /> {fr ? "Toutes les masterclasses" : "All masterclasses"}
          </button>

          <div className="grid lg:grid-cols-5 gap-6 items-start">
            {/* Left content */}
            <div className="lg:col-span-3">
              <div className="flex items-center gap-2 mb-3 flex-wrap">
                <Badge variant="gold">{days} {fr ? "jour(s)" : "day(s)"}</Badge>
                {mc.isFeatured && <span className="px-2.5 py-0.5 rounded-full bg-gold text-navy text-[10px] font-bold flex items-center gap-1"><FaCrown className="text-[8px]" /> {fr ? "A la une" : "Featured"}</span>}
                {eb && <span className="px-2.5 py-0.5 rounded-full bg-emerald-500 text-white text-[10px] font-bold animate-pulse">Early Bird -{Math.round((1 - mc.earlyBirdPrice / mc.price) * 100)}%</span>}
                <span className="px-2.5 py-0.5 rounded-full bg-cream/10 text-cream/50 text-[10px]">{mc.format === "ONLINE" ? (fr ? "En ligne" : "Online") : mc.format === "HYBRID" ? (fr ? "Hybride" : "Hybrid") : (fr ? "Presentiel" : "In Person")}</span>
              </div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-cream mb-2 leading-tight">{fr ? mc.title : mc.titleEn || mc.title}</h1>
              <p className="text-cream/45 text-sm md:text-base mb-4 max-w-2xl">{fr ? mc.shortDesc : mc.shortDescEn || mc.shortDesc}</p>
              <div className="flex flex-wrap items-center gap-3 text-xs text-cream/40">
                <span className="flex items-center gap-1.5 bg-cream/[0.06] px-2.5 py-1.5 rounded-lg"><FaCalendarAlt className="text-gold" /> {new Date(mc.startDate).toLocaleDateString(fr ? "fr-FR" : "en-US", { day: "numeric", month: "short" })}</span>
                <span className="flex items-center gap-1.5 bg-cream/[0.06] px-2.5 py-1.5 rounded-lg"><FaClock className="text-gold" /> {mc.dailyStartTime}-{mc.dailyEndTime}</span>
                {mc.location && <span className="flex items-center gap-1.5 bg-cream/[0.06] px-2.5 py-1.5 rounded-lg"><FaMapMarkerAlt className="text-gold" /> {mc.location}</span>}
                <span className="flex items-center gap-1.5 bg-cream/[0.06] px-2.5 py-1.5 rounded-lg"><FaUsers className="text-gold" /> {mc._count?.registrations || 0} {fr ? "inscrits" : "registered"}</span>
              </div>
              {/* Instructor inline */}
              {mc.instructor && (
                <div className="flex items-center gap-3 mt-4 p-3 rounded-xl bg-cream/[0.04] border border-cream/[0.06] max-w-sm">
                  <div className="w-10 h-10 rounded-full bg-gold/20 flex items-center justify-center text-gold font-bold text-sm flex-shrink-0">{mc.instructor.firstName[0]}{mc.instructor.lastName[0]}</div>
                  <div>
                    <p className="text-cream text-sm font-bold">{mc.instructor.firstName} {mc.instructor.lastName}</p>
                    <p className="text-cream/30 text-[10px]">{fr ? "Votre instructeur" : "Your instructor"}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Right pricing card */}
            <div className="lg:col-span-2 lg:sticky lg:top-20">
              <div className="rounded-2xl border border-gold/25 bg-[#0a1628]/90 backdrop-blur-xl p-5 shadow-2xl shadow-black/30">
                <div className="text-center mb-4">
                  {eb && <div className="text-cream/25 text-xs line-through">{sym}{mc.price}</div>}
                  <div className="text-3xl font-bold text-cream">{mc.price === 0 ? (fr ? "Gratuit" : "Free") : `${sym}${eb ? mc.earlyBirdPrice : mc.price}`}</div>
                  {mc.price > 0 && <div className="text-cream/25 text-[10px] mt-0.5">{fr ? "par personne" : "per person"}</div>}
                  {eb && <div className="mt-1.5 text-emerald-400 text-[10px] font-bold">{fr ? "Economisez" : "Save"} {sym}{mc.price - mc.earlyBirdPrice!}</div>}
                </div>

                <div className="space-y-2 mb-4 text-xs">
                  {[
                    { icon: <FaCalendarAlt />, label: fr ? "Duree" : "Duration", val: `${days} ${fr ? "jour(s)" : "day(s)"}` },
                    { icon: <FaClock />, label: fr ? "Horaires" : "Hours", val: `${mc.dailyStartTime} - ${mc.dailyEndTime}` },
                    { icon: <FaChair />, label: fr ? "Places" : "Seats", val: `${mc.seatsLeft}/${mc.maxSeats}` },
                    ...(mc.certificateIncluded ? [{ icon: <FaCertificate />, label: fr ? "Certificat" : "Certificate", val: fr ? "Inclus" : "Included" }] : []),
                    ...(mc.replayAvailable ? [{ icon: <FaPlayCircle />, label: "Replay", val: fr ? "Disponible" : "Available" }] : []),
                  ].map((r, i) => (
                    <div key={i} className="flex justify-between items-center py-1.5 border-b border-cream/[0.04] last:border-0">
                      <span className="text-cream/40 flex items-center gap-1.5"><span className="text-gold">{r.icon}</span>{r.label}</span>
                      <span className="text-cream font-medium">{r.val}</span>
                    </div>
                  ))}
                </div>

                <div className="w-full h-1.5 rounded-full bg-cream/[0.06] overflow-hidden mb-3">
                  <motion.div initial={{ width: 0 }} animate={{ width: `${pctFull}%` }} transition={{ duration: 1, ease: "easeOut" }}
                    className={`h-full rounded-full ${pctFull > 80 ? "bg-red-400" : pctFull > 50 ? "bg-orange-400" : "bg-gold"}`} />
                </div>
                {pctFull > 70 && <p className="text-red-400 text-[10px] text-center mb-2 font-bold animate-pulse">{fr ? "Places limitees !" : "Limited seats!"}</p>}

                {isRegistered ? (
                  <div className="py-3 rounded-xl bg-emerald-500/20 text-emerald-400 text-center text-sm font-bold flex items-center justify-center gap-2">
                    <FaCheck /> {fr ? "Inscrit(e)" : "Registered"}
                  </div>
                ) : (
                  <button onClick={handleRegister} disabled={registering || mc.seatsLeft <= 0}
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-gold to-gold-light text-navy font-bold text-sm hover:shadow-lg hover:shadow-gold/25 transition-all disabled:opacity-60 flex items-center justify-center gap-2 group">
                    {registering ? <FaSpinner className="animate-spin" /> : <>{fr ? "S'inscrire maintenant" : "Register now"} <FaArrowRight className="text-xs group-hover:translate-x-1 transition-transform" /></>}
                  </button>
                )}

                <div className="flex items-center justify-center gap-1.5 mt-3 text-cream/15 text-[10px]">
                  <FaShieldAlt /> {fr ? "Paiement securise" : "Secure payment"}
                </div>

                {du > 0 && (
                  <div className="mt-3 py-2 rounded-lg bg-gold/10 text-center">
                    <span className="text-gold text-xs font-bold">{fr ? "Commence dans" : "Starts in"} {du} {fr ? "jours" : "days"}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Content sections - compact */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6">

        {/* What you'll learn */}
        {whatYouLearn.length > 0 && (
          <section className="py-8">
            <AnimatedSection>
              <div className="rounded-2xl border border-gold/10 bg-gradient-to-br from-gold/[0.03] to-transparent p-6">
                <h2 className="text-xl font-bold text-cream mb-4 flex items-center gap-2"><FaGraduationCap className="text-gold" /> {fr ? "Ce que vous apprendrez" : "What you'll learn"}</h2>
                <div className="grid sm:grid-cols-2 gap-2.5">
                  {whatYouLearn.map((item, i) => (
                    <motion.div key={i} initial={{ opacity: 0, x: -10 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.06 }}
                      className="flex items-start gap-2.5 p-2.5 rounded-lg hover:bg-cream/[0.02] transition-colors">
                      <div className="w-5 h-5 rounded-full bg-gold/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <FaCheck className="text-gold text-[8px]" />
                      </div>
                      <span className="text-cream/60 text-sm">{item}</span>
                    </motion.div>
                  ))}
                </div>
              </div>
            </AnimatedSection>
          </section>
        )}

        {/* Program */}
        {program.length > 0 && (
          <section className="py-6">
            <h2 className="text-xl font-bold text-cream mb-4 flex items-center gap-2"><FaCalendarAlt className="text-gold" /> {fr ? "Programme detaille" : "Detailed program"}</h2>
            <div className="space-y-2">
              {program.map((day, i) => (
                <AnimatedSection key={i} delay={i * 0.08}>
                  <div className="rounded-xl border border-cream/[0.08] bg-white/[0.01] overflow-hidden">
                    <button onClick={() => setOpenDay(openDay === i ? -1 : i)}
                      className="w-full flex items-center justify-between px-4 py-3.5 hover:bg-cream/[0.02] transition-all">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${openDay === i ? "bg-gold text-navy" : "bg-gold/15 text-gold"} transition-all`}>
                          <span className="font-bold text-xs">{day.day || `J${i + 1}`}</span>
                        </div>
                        <div className="text-left">
                          <h3 className="text-cream font-bold text-sm">{day.title}</h3>
                          <p className="text-cream/25 text-[10px]">{(day.items || []).length} {fr ? "sessions" : "sessions"}</p>
                        </div>
                      </div>
                      <motion.div animate={{ rotate: openDay === i ? 180 : 0 }}><FaChevronDown className="text-cream/20 text-xs" /></motion.div>
                    </button>
                    <AnimatePresence>
                      {openDay === i && (
                        <motion.div initial={{ height: 0 }} animate={{ height: "auto" }} exit={{ height: 0 }} className="overflow-hidden">
                          <div className="px-4 pb-4 pl-16 space-y-2">
                            {(day.items || []).map((item: string, ii: number) => (
                              <motion.div key={ii} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: ii * 0.05 }}
                                className="flex items-center gap-2.5 text-sm text-cream/50 py-1">
                                <div className="w-1.5 h-1.5 rounded-full bg-gold flex-shrink-0" />
                                {item}
                              </motion.div>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </AnimatedSection>
              ))}
            </div>
          </section>
        )}

        {/* Included + prereqs side by side */}
        <section className="py-6">
          <div className="grid sm:grid-cols-2 gap-4">
            {included.length > 0 && (
              <AnimatedSection>
                <div className="rounded-xl border border-emerald-500/10 bg-emerald-500/[0.02] p-5 h-full">
                  <h3 className="text-base font-bold text-cream mb-3 flex items-center gap-2"><FaStar className="text-emerald-400" /> {fr ? "Inclus" : "Included"}</h3>
                  <ul className="space-y-2">
                    {included.map((item, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-cream/55">
                        <FaCheck className="text-emerald-400 text-[10px] mt-1 flex-shrink-0" /> {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </AnimatedSection>
            )}
            {prereqs.length > 0 && (
              <AnimatedSection delay={0.1}>
                <div className="rounded-xl border border-cream/[0.08] bg-white/[0.01] p-5 h-full">
                  <h3 className="text-base font-bold text-cream mb-3 flex items-center gap-2"><FaBookOpen className="text-gold" /> {fr ? "Prerequis" : "Prerequisites"}</h3>
                  <ul className="space-y-2">
                    {prereqs.map((item, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-cream/55">
                        <FaArrowRight className="text-gold text-[10px] mt-1 flex-shrink-0" /> {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </AnimatedSection>
            )}
          </div>
        </section>

        {/* Instructor full section */}
        {mc.instructor?.bio && (
          <section className="py-6 pb-12">
            <AnimatedSection>
              <div className="rounded-xl border border-cream/[0.08] bg-gradient-to-r from-cream/[0.02] to-transparent p-5 flex flex-col sm:flex-row items-center gap-5">
                <div className="w-16 h-16 rounded-full bg-gold/20 flex items-center justify-center text-gold text-xl font-bold flex-shrink-0">
                  {mc.instructor.firstName[0]}{mc.instructor.lastName[0]}
                </div>
                <div className="text-center sm:text-left">
                  <p className="text-cream/25 text-[10px] uppercase tracking-widest mb-0.5">{fr ? "Votre instructeur" : "Your instructor"}</p>
                  <h3 className="text-lg font-bold text-cream">{mc.instructor.firstName} {mc.instructor.lastName}</h3>
                  <p className="text-cream/40 text-sm mt-1">{mc.instructor.bio}</p>
                </div>
              </div>
            </AnimatedSection>
          </section>
        )}
      </div>

      {/* Success modal — style Adobe-like */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[99] flex items-center justify-center bg-black/70 backdrop-blur-sm px-4"
            onClick={() => setShowSuccess(false)}>
            <motion.div initial={{ scale: 0.7, y: 30, opacity: 0 }} animate={{ scale: 1, y: 0, opacity: 1 }} exit={{ scale: 0.8, y: 20, opacity: 0 }}
              transition={{ type: "spring", damping: 20, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-[#0d1a2e] border border-gold/20 rounded-3xl p-8 sm:p-10 text-center max-w-md w-full relative overflow-hidden">
              {/* Glow bg */}
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_30%,rgba(16,185,129,0.08),transparent_60%)]" />
              {/* Close */}
              <button onClick={() => setShowSuccess(false)} className="absolute top-4 right-4 text-cream/20 hover:text-cream/60 transition-colors text-lg">✕</button>
              {/* Illustration */}
              <div className="relative mx-auto mb-6 w-28 h-28">
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                  className="absolute inset-0 rounded-full bg-gradient-to-br from-emerald-500/20 to-emerald-600/5 flex items-center justify-center">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-emerald-500/30 to-emerald-400/10 flex items-center justify-center">
                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.4, type: "spring" }}>
                      <FaCheck className="text-emerald-400 text-3xl" />
                    </motion.div>
                  </div>
                </motion.div>
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
                  className="absolute -top-1 -right-1 text-2xl">🎓</motion.div>
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}
                  className="absolute -bottom-1 -left-1 text-lg">✨</motion.div>
              </div>
              {/* Title */}
              <motion.h3 initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
                className="text-cream text-xl sm:text-2xl font-bold mb-2">
                {fr ? "Votre inscription a ete traitee." : "Your registration has been processed."}
              </motion.h3>
              <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
                className="text-cream/40 text-sm mb-6">
                {fr ? "Nous vous avons envoye un e-mail de confirmation a" : "We sent a confirmation email to"}
                <br />
                <span className="text-cream/70 font-medium">{user?.email || "votre adresse email"}</span>
              </motion.p>
              {/* Event details card */}
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
                className="rounded-2xl border border-cream/[0.08] bg-cream/[0.02] p-5 text-left mb-6">
                <h4 className="text-cream font-bold text-sm mb-3 truncate">{fr ? mc.title : mc.titleEn || mc.title}</h4>
                <div className="space-y-2 text-xs text-cream/50">
                  <div className="flex items-center gap-2.5">
                    <FaCalendarAlt className="text-gold flex-shrink-0" />
                    <span>{new Date(mc.startDate).toLocaleDateString(fr ? "fr-FR" : "en-US", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <FaClock className="text-gold flex-shrink-0" />
                    <span>{mc.dailyStartTime} - {mc.dailyEndTime}</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <FaMapMarkerAlt className="text-gold flex-shrink-0" />
                    <span>{mc.location || (mc.format === "ONLINE" ? (fr ? "En ligne" : "Online") : (fr ? "A confirmer" : "TBC"))}</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <FaGlobe className="text-gold flex-shrink-0" />
                    <span>{fr ? "Tout le monde peut voir et rejoindre." : "Everyone can see and join."}</span>
                  </div>
                </div>
              </motion.div>
              {/* CTA */}
              <motion.button initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}
                onClick={() => setShowSuccess(false)}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-gold to-gold-light text-navy font-bold text-sm hover:shadow-lg hover:shadow-gold/20 transition-all">
                {fr ? "Compris !" : "Got it!"}
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Error modal */}
      <AnimatePresence>
        {errorMsg && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[99] flex items-center justify-center bg-black/70 backdrop-blur-sm px-4"
            onClick={() => setErrorMsg(null)}>
            <motion.div initial={{ scale: 0.8, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.8, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-[#0d1a2e] border border-red-500/20 rounded-2xl p-8 text-center max-w-sm w-full">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-500/15 flex items-center justify-center">
                <span className="text-red-400 text-3xl">!</span>
              </div>
              <h3 className="text-cream text-lg font-bold mb-2">{fr ? "Une erreur est survenue" : "An error occurred"}</h3>
              <p className="text-cream/40 text-sm mb-6">{errorMsg}</p>
              <button onClick={() => setErrorMsg(null)}
                className="w-full py-3 rounded-xl bg-cream/10 text-cream font-bold text-sm hover:bg-cream/15 transition-all">
                {fr ? "Fermer" : "Close"}
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
