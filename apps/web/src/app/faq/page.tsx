"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AnimatedSection, Badge } from "@/components/ui";
import { FaChevronDown, FaSearch } from "react-icons/fa";
import { useI18n } from "@/context/i18n-context";

export default function FAQ() {
  const [openItem, setOpenItem] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const { t } = useI18n();

  const faqData = [
    {
      categoryKey: "faq.cat.inscription",
      questions: [
        { qKey: "faq.q1", aKey: "faq.a1" },
        { qKey: "faq.q2", aKey: "faq.a2" },
        { qKey: "faq.q3", aKey: "faq.a3" },
        { qKey: "faq.q4", aKey: "faq.a4" },
      ],
    },
    {
      categoryKey: "faq.cat.formations",
      questions: [
        { qKey: "faq.q5", aKey: "faq.a5" },
        { qKey: "faq.q6", aKey: "faq.a6" },
        { qKey: "faq.q7", aKey: "faq.a7" },
        { qKey: "faq.q8", aKey: "faq.a8" },
      ],
    },
    {
      categoryKey: "faq.cat.tarifs",
      questions: [
        { qKey: "faq.q9", aKey: "faq.a9" },
        { qKey: "faq.q10", aKey: "faq.a10" },
        { qKey: "faq.q11", aKey: "faq.a11" },
        { qKey: "faq.q12", aKey: "faq.a12" },
      ],
    },
    {
      categoryKey: "faq.cat.certificats",
      questions: [
        { qKey: "faq.q13", aKey: "faq.a13" },
        { qKey: "faq.q14", aKey: "faq.a14" },
      ],
    },
  ];

  const filtered = faqData.map((cat) => ({
    ...cat,
    questions: cat.questions.filter(
      (q) => t(q.qKey).toLowerCase().includes(search.toLowerCase()) || t(q.aKey).toLowerCase().includes(search.toLowerCase())
    ),
  })).filter((cat) => cat.questions.length > 0);

  return (
    <>
      <section className="relative py-12 md:py-16 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-gold/[0.03] to-transparent" />
        <div className="max-w-4xl mx-auto px-6 relative text-center">
          <Badge variant="gold" className="mb-6">{t("faq.badge")}</Badge>
          <h1 className="text-4xl md:text-5xl font-bold text-cream mb-4">
            {t("faq.title1")} <span className="text-gradient-gold">{t("faq.title2")}</span>
          </h1>
          <p className="text-cream/45 max-w-xl mx-auto mb-10">
            {t("faq.desc")}
          </p>

          <div className="relative max-w-lg mx-auto">
            <FaSearch className="absolute left-5 top-1/2 -translate-y-1/2 text-cream/25" />
            <input
              type="text"
              placeholder={t("faq.search")}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-13 pr-4 py-4 rounded-2xl bg-cream/[0.04] border border-cream/[0.08] text-cream placeholder:text-cream/25 text-sm focus:outline-none focus:border-gold/30 transition-all"
              style={{ paddingLeft: "3rem" }}
            />
          </div>
        </div>
      </section>

      <section className="pb-12 px-6">
        <div className="max-w-3xl mx-auto space-y-10">
          {filtered.map((cat, ci) => (
            <AnimatedSection key={cat.categoryKey} delay={ci * 0.05}>
              <h2 className="text-sm font-bold text-gold/70 uppercase tracking-widest mb-4">{t(cat.categoryKey)}</h2>
              <div className="space-y-2">
                {cat.questions.map((item) => {
                  const key = `${cat.categoryKey}-${item.qKey}`;
                  const isOpen = openItem === key;
                  return (
                    <div
                      key={key}
                      className={`rounded-xl border transition-all ${isOpen ? "border-gold/20 bg-gold/[0.03]" : "border-cream/[0.06] bg-cream/[0.01]"}`}
                    >
                      <button
                        onClick={() => setOpenItem(isOpen ? null : key)}
                        className="w-full flex items-center justify-between px-6 py-5 text-left"
                      >
                        <span className={`text-sm font-medium pr-4 transition-colors ${isOpen ? "text-gold" : "text-cream/70"}`}>{t(item.qKey)}</span>
                        <motion.div animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
                          <FaChevronDown className={`text-xs flex-shrink-0 ${isOpen ? "text-gold" : "text-cream/20"}`} />
                        </motion.div>
                      </button>
                      <AnimatePresence>
                        {isOpen && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="overflow-hidden"
                          >
                            <div className="px-6 pb-5 text-cream/40 text-sm leading-relaxed">{t(item.aKey)}</div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </div>
            </AnimatedSection>
          ))}

          {filtered.length === 0 && (
            <div className="text-center py-16">
              <p className="text-cream/30 mb-4">{t("faq.noresult")} &quot;{search}&quot;</p>
              <button onClick={() => setSearch("")} className="text-gold/60 hover:text-gold text-sm transition-colors">{t("faq.clear")}</button>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
