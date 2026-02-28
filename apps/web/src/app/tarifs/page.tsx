"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { AnimatedSection, Badge } from "@/components/ui";
import { FaCheck, FaCrown, FaArrowRight } from "react-icons/fa";
import { useI18n } from "@/context/i18n-context";

export default function Tarifs() {
  const [isAnnual, setIsAnnual] = useState(false);
  const { t } = useI18n();

  const plans = [
    {
      nameKey: "pricing.plan.decouverte",
      price: t("pricing.free"),
      period: "",
      descKey: "pricing.plan.decouverte.desc",
      color: "border-cream/10",
      featureKeys: [
        "pricing.feature.access2",
        "pricing.feature.community",
        "pricing.feature.certParticipation",
        "pricing.feature.emailSupport",
      ],
      ctaKey: "pricing.cta.free",
      popular: false,
      isFree: true,
    },
    {
      nameKey: "pricing.plan.essentiel",
      price: "$29",
      period: "/mois",
      descKey: "pricing.plan.essentiel.desc",
      color: "border-gold/30",
      featureKeys: [
        "pricing.feature.allFormations",
        "pricing.feature.unlimitedModules",
        "pricing.feature.officialCerts",
        "pricing.feature.premiumCommunity",
        "pricing.feature.prioritySupport",
        "pricing.feature.liveMonthly",
      ],
      ctaKey: "pricing.cta.essentiel",
      popular: true,
      isFree: false,
    },
    {
      nameKey: "pricing.plan.premium",
      price: "$79",
      period: "/mois",
      descKey: "pricing.plan.premium.desc",
      color: "border-purple-400/30",
      featureKeys: [
        "pricing.feature.allEssentiel",
        "pricing.feature.coaching",
        "pricing.feature.vipMasterclass",
        "pricing.feature.mentoring",
        "pricing.feature.whatsapp",
        "pricing.feature.livePriority",
        "pricing.feature.earlyAccess",
      ],
      ctaKey: "pricing.cta.premium",
      popular: false,
      isFree: false,
    },
  ];

  const annual = [
    { nameKey: "pricing.plan.essentiel", monthly: 29, annual: 24, save: "17%" },
    { nameKey: "pricing.plan.premium", monthly: 79, annual: 65, save: "18%" },
  ];

  return (
    <>
      <section className="relative py-12 md:py-16 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-gold/[0.03] to-transparent" />
        <div className="max-w-4xl mx-auto px-6 relative text-center">
          <Badge variant="gold" className="mb-6">{t("pricing.badge")}</Badge>
          <h1 className="text-4xl md:text-5xl font-bold text-cream mb-4">
            {t("pricing.title.main1")} <span className="text-gradient-gold">{t("pricing.title.main2")}</span>
          </h1>
          <p className="text-cream/45 max-w-xl mx-auto mb-10">
            {t("pricing.desc.main")}
          </p>

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
        <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-6">
          {plans.map((plan, i) => {
            const annualInfo = annual.find((a) => a.nameKey === plan.nameKey);
            const displayPrice = plan.isFree ? t("pricing.free") : isAnnual && annualInfo ? `$${annualInfo.annual}` : plan.price;
            const displayPeriod = plan.isFree ? "" : t("pricing.month");

            return (
              <AnimatedSection key={plan.nameKey} delay={i * 0.1}>
                <div className={`relative rounded-2xl border ${plan.color} ${plan.popular ? "bg-gradient-to-b from-gold/[0.05] to-transparent" : "bg-cream/[0.01]"} p-8 h-full flex flex-col`}>
                  {plan.popular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <span className="px-4 py-1.5 rounded-full bg-gold text-navy text-xs font-bold flex items-center gap-1.5">
                        <FaCrown className="text-[10px]" /> {t("pricing.popular")}
                      </span>
                    </div>
                  )}

                  <div className="mb-6">
                    <h3 className="text-lg font-bold text-cream mb-1">{t(plan.nameKey)}</h3>
                    <p className="text-cream/35 text-xs">{t(plan.descKey)}</p>
                  </div>

                  <div className="mb-8">
                    <motion.div
                      key={displayPrice}
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex items-end gap-1"
                    >
                      <span className="text-4xl font-bold text-cream">{displayPrice}</span>
                      {displayPeriod && <span className="text-cream/30 text-sm mb-1">{displayPeriod}</span>}
                    </motion.div>
                    {isAnnual && annualInfo && (
                      <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-emerald-400 text-xs mt-2">
                        {t("pricing.savings")} {annualInfo.save} — ${(annualInfo.monthly - annualInfo.annual) * 12}/an
                      </motion.p>
                    )}
                  </div>

                  <ul className="space-y-3 flex-1 mb-8">
                    {plan.featureKeys.map((fk) => (
                      <li key={fk} className="flex items-start gap-3 text-sm text-cream/55">
                        <FaCheck className="text-gold text-xs mt-1 flex-shrink-0" />
                        {t(fk)}
                      </li>
                    ))}
                  </ul>

                  <Link href="/inscription" className={`w-full py-3.5 rounded-xl text-sm font-bold flex items-center justify-center gap-2 group transition-all ${
                    plan.popular
                      ? "bg-gradient-to-r from-gold to-gold-light text-navy hover:shadow-lg hover:shadow-gold/20"
                      : "bg-cream/[0.05] border border-cream/10 text-cream hover:bg-cream/10"
                  }`}>
                    {t(plan.ctaKey)}
                    <FaArrowRight className="text-xs group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </AnimatedSection>
            );
          })}
        </div>
      </section>
    </>
  );
}
