"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { AnimatedSection, Badge } from "@/components/ui";
import { FaCheck, FaCrown, FaArrowRight, FaSpinner, FaShieldAlt } from "react-icons/fa";
import { useI18n } from "@/context/i18n-context";
import { useAuth } from "@/context/auth-context";
import api from "@/lib/api";

interface PricingPlan {
  id: string;
  slug: string;
  nameFr: string;
  nameEn: string;
  descFr: string;
  descEn: string;
  monthlyPrice: number;
  annualPrice: number;
  currency: string;
  featuresFr: string;
  featuresEn: string;
  popular: boolean;
  isFree: boolean;
  sortOrder: number;
  ctaFr: string;
  ctaEn: string;
}

export default function Tarifs() {
  const [isAnnual, setIsAnnual] = useState(false);
  const [subscribing, setSubscribing] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState("");
  const [plans, setPlans] = useState<PricingPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const { t, locale } = useI18n();
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    api.get<PricingPlan[]>("/pricing-plans")
      .then(setPlans)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleSubscribe = async (planSlug: string) => {
    if (!user) { router.push("/inscription"); return; }
    setSubscribing(planSlug);
    try {
      await api.post("/subscriptions", {
        plan: planSlug,
        interval: isAnnual ? "annual" : "monthly",
      });
      setSelectedPlan(planSlug);
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        router.push("/dashboard");
      }, 3000);
    } catch {
      alert("Erreur lors de la souscription");
    } finally { setSubscribing(null); }
  };

  const currencySymbol = (c: string) => c === "EUR" ? "\u20ac" : c === "XAF" ? "FCFA " : "$";

  return (
    <>
      <section className="relative py-12 md:py-16 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-gold/[0.03] to-transparent" />
        <div className="max-w-4xl mx-auto px-6 relative text-center">
          <Badge variant="gold" className="mb-6">{t("pricing.badge")}</Badge>
          <h1 className="text-4xl md:text-5xl font-bold text-cream mb-4">
            {t("pricing.title.main1")} <span className="text-gradient-gold">{t("pricing.title.main2")}</span>
          </h1>
          <p className="text-cream/45 max-w-xl mx-auto mb-10">{t("pricing.desc.main")}</p>

          <div className="inline-flex items-center gap-4 p-1.5 rounded-full bg-cream/[0.04] border border-cream/[0.06]">
            <button onClick={() => setIsAnnual(false)} className={`px-6 py-2.5 rounded-full text-sm font-medium transition-all ${!isAnnual ? "bg-gold text-navy shadow-lg shadow-gold/20" : "text-cream/50 hover:text-cream"}`}>
              {t("pricing.toggle.monthly")}
            </button>
            <button onClick={() => setIsAnnual(true)} className={`px-6 py-2.5 rounded-full text-sm font-medium transition-all flex items-center gap-2 ${isAnnual ? "bg-gold text-navy shadow-lg shadow-gold/20" : "text-cream/50 hover:text-cream"}`}>
              {t("pricing.toggle.annual")}
              <span className="px-2 py-0.5 rounded-full bg-emerald-400/20 text-emerald-400 text-[10px] font-bold">-18%</span>
            </button>
          </div>
        </div>
      </section>

      <section className="pb-12 px-6">
        {loading ? (
          <div className="flex justify-center py-20"><FaSpinner className="animate-spin text-gold text-3xl" /></div>
        ) : (
          <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-6">
            {plans.map((plan, i) => {
              const sym = currencySymbol(plan.currency);
              const features: string[] = (() => { try { return JSON.parse(locale === "fr" ? plan.featuresFr : plan.featuresEn); } catch { return []; } })();
              const name = locale === "fr" ? plan.nameFr : plan.nameEn;
              const desc = locale === "fr" ? plan.descFr : plan.descEn;
              const cta = locale === "fr" ? plan.ctaFr : plan.ctaEn;
              const displayPrice = plan.isFree ? (locale === "fr" ? "Gratuit" : "Free") : isAnnual ? `${sym}${plan.annualPrice}` : `${sym}${plan.monthlyPrice}`;
              const displayPeriod = plan.isFree ? "" : (locale === "fr" ? "/mois" : "/month");
              const savePct = plan.monthlyPrice > 0 ? Math.round((1 - plan.annualPrice / plan.monthlyPrice) * 100) : 0;

              return (
                <AnimatedSection key={plan.id} delay={i * 0.1}>
                  <div className={`relative rounded-2xl border ${plan.popular ? "border-gold/30 bg-gradient-to-b from-gold/[0.05] to-transparent" : "border-cream/10 bg-cream/[0.01]"} p-8 h-full flex flex-col`}>
                    {plan.popular && (
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                        <span className="px-4 py-1.5 rounded-full bg-gold text-navy text-xs font-bold flex items-center gap-1.5">
                          <FaCrown className="text-[10px]" /> {locale === "fr" ? "Plus populaire" : "Most popular"}
                        </span>
                      </div>
                    )}

                    <div className="mb-6">
                      <h3 className="text-lg font-bold text-cream mb-1">{name}</h3>
                      <p className="text-cream/35 text-xs">{desc}</p>
                    </div>

                    <div className="mb-8">
                      <motion.div key={displayPrice} initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-end gap-1">
                        <span className="text-4xl font-bold text-cream">{displayPrice}</span>
                        {displayPeriod && <span className="text-cream/30 text-sm mb-1">{displayPeriod}</span>}
                      </motion.div>
                      {isAnnual && !plan.isFree && savePct > 0 && (
                        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-emerald-400 text-xs mt-2">
                          {locale === "fr" ? "Economie" : "Save"} {savePct}% — {sym}{(plan.monthlyPrice - plan.annualPrice) * 12}/{locale === "fr" ? "an" : "yr"}
                        </motion.p>
                      )}
                    </div>

                    <ul className="space-y-3 flex-1 mb-8">
                      {features.map((f, fi) => (
                        <li key={fi} className="flex items-start gap-3 text-sm text-cream/55">
                          <FaCheck className="text-gold text-xs mt-1 flex-shrink-0" />
                          {f}
                        </li>
                      ))}
                    </ul>

                    <button onClick={() => handleSubscribe(plan.slug)} disabled={subscribing === plan.slug}
                      className={`w-full py-3.5 rounded-xl text-sm font-bold flex items-center justify-center gap-2 group transition-all ${
                        plan.popular
                          ? "bg-gradient-to-r from-gold to-gold-light text-navy hover:shadow-lg hover:shadow-gold/20"
                          : "bg-cream/[0.05] border border-cream/10 text-cream hover:bg-cream/10"
                      } disabled:opacity-60`}>
                      {subscribing === plan.slug ? <FaSpinner className="animate-spin" /> : <>{cta} <FaArrowRight className="text-xs group-hover:translate-x-1 transition-transform" /></>}
                    </button>
                  </div>
                </AnimatedSection>
              );
            })}
          </div>
        )}
      </section>

      <AnimatePresence>
        {showSuccess && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[99] flex items-center justify-center bg-black/70 backdrop-blur-sm">
            <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} exit={{ scale: 0.8 }}
              className="bg-[#0d1a2e] border border-gold/20 rounded-2xl p-10 text-center max-w-sm">
              <div className="w-20 h-20 mx-auto mb-5 rounded-full bg-emerald-500/20 flex items-center justify-center">
                <FaCheck className="text-emerald-400 text-3xl" />
              </div>
              <h3 className="text-white text-xl font-bold mb-2">{locale === "fr" ? "Abonnement active !" : "Subscription activated!"}</h3>
              <p className="text-white/40 text-sm mb-1">{locale === "fr" ? "Formule" : "Plan"} {selectedPlan}</p>
              <p className="text-white/25 text-xs">{locale === "fr" ? "Redirection vers votre espace..." : "Redirecting to your dashboard..."}</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
