"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaPlus, FaEdit, FaTrash, FaCrown, FaCheck, FaTimes, FaSpinner, FaStar, FaArrowUp, FaArrowDown } from "react-icons/fa";
import api from "@/lib/api";
import { useI18n } from "@/context/i18n-context";

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
  active: boolean;
  ctaFr: string;
  ctaEn: string;
}

const emptyPlan: Omit<PricingPlan, "id"> = {
  slug: "", nameFr: "", nameEn: "", descFr: "", descEn: "",
  monthlyPrice: 0, annualPrice: 0, currency: "USD",
  featuresFr: "[]", featuresEn: "[]",
  popular: false, isFree: false, sortOrder: 0, active: true,
  ctaFr: "Choisir", ctaEn: "Choose",
};

export default function AdminAbonnements() {
  const { t, locale } = useI18n();
  const [plans, setPlans] = useState<PricingPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<PricingPlan | null>(null);
  const [form, setForm] = useState<any>({ ...emptyPlan });
  const [featureInput, setFeatureInput] = useState({ fr: "", en: "" });
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);

  const fetchPlans = () => {
    api.get<PricingPlan[]>("/pricing-plans/admin")
      .then(setPlans)
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchPlans(); }, []);

  const openCreate = () => {
    setEditing(null);
    setForm({ ...emptyPlan, sortOrder: plans.length });
    setFeatureInput({ fr: "", en: "" });
    setShowModal(true);
  };

  const openEdit = (plan: PricingPlan) => {
    setEditing(plan);
    setForm({ ...plan });
    setFeatureInput({ fr: "", en: "" });
    setShowModal(true);
  };

  const featuresFr = (): string[] => {
    try { return JSON.parse(form.featuresFr); } catch { return []; }
  };
  const featuresEn = (): string[] => {
    try { return JSON.parse(form.featuresEn); } catch { return []; }
  };

  const addFeature = (lang: "fr" | "en") => {
    const val = featureInput[lang].trim();
    if (!val) return;
    const key = lang === "fr" ? "featuresFr" : "featuresEn";
    const current = lang === "fr" ? featuresFr() : featuresEn();
    setForm({ ...form, [key]: JSON.stringify([...current, val]) });
    setFeatureInput({ ...featureInput, [lang]: "" });
  };

  const removeFeature = (lang: "fr" | "en", idx: number) => {
    const key = lang === "fr" ? "featuresFr" : "featuresEn";
    const current = lang === "fr" ? featuresFr() : featuresEn();
    current.splice(idx, 1);
    setForm({ ...form, [key]: JSON.stringify(current) });
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const payload = {
        ...form,
        monthlyPrice: parseFloat(form.monthlyPrice) || 0,
        annualPrice: parseFloat(form.annualPrice) || 0,
        sortOrder: parseInt(form.sortOrder) || 0,
        featuresFr: featuresFr(),
        featuresEn: featuresEn(),
      };
      if (editing) {
        await api.put(`/pricing-plans/${editing.id}`, payload);
      } else {
        await api.post("/pricing-plans", payload);
      }
      setShowModal(false);
      fetchPlans();
    } catch { alert("Erreur lors de la sauvegarde"); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id: string) => {
    setDeleting(id);
    try {
      await api.delete(`/pricing-plans/${id}`);
      setShowDeleteConfirm(null);
      fetchPlans();
    } catch { alert("Erreur lors de la suppression"); }
    finally { setDeleting(null); }
  };

  const toggleActive = async (plan: PricingPlan) => {
    await api.put(`/pricing-plans/${plan.id}`, { active: !plan.active });
    fetchPlans();
  };

  if (loading) return <div className="flex items-center justify-center h-64"><FaSpinner className="animate-spin text-gold text-3xl" /></div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-cream">Gestion des formules</h1>
          <p className="text-cream/40 text-sm mt-1">Gerez les tarifs et abonnements affiches sur le site</p>
        </div>
        <button onClick={openCreate} className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-gold to-gold-light text-navy font-bold text-sm hover:shadow-lg hover:shadow-gold/20 transition-all">
          <FaPlus /> Nouvelle formule
        </button>
      </div>

      <div className="grid gap-4">
        {plans.map((plan) => (
          <motion.div key={plan.id} layout initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            className={`rounded-2xl border ${plan.active ? "border-cream/[0.08]" : "border-red-500/20 opacity-60"} bg-white/[0.02] p-6`}>
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-lg font-bold text-cream">{locale === "fr" ? plan.nameFr : plan.nameEn}</h3>
                  {plan.popular && <span className="px-2 py-0.5 rounded-full bg-gold/20 text-gold text-[10px] font-bold flex items-center gap-1"><FaCrown className="text-[8px]" /> Populaire</span>}
                  {plan.isFree && <span className="px-2 py-0.5 rounded-full bg-emerald-400/20 text-emerald-400 text-[10px] font-bold">Gratuit</span>}
                  {!plan.active && <span className="px-2 py-0.5 rounded-full bg-red-400/20 text-red-400 text-[10px] font-bold">Inactif</span>}
                  <span className="text-cream/20 text-xs">#{plan.sortOrder}</span>
                </div>
                <p className="text-cream/40 text-sm mb-3">{locale === "fr" ? plan.descFr : plan.descEn}</p>
                <div className="flex items-baseline gap-2 mb-4">
                  <span className="text-2xl font-bold text-cream">{plan.isFree ? "Gratuit" : `$${plan.monthlyPrice}`}</span>
                  {!plan.isFree && <span className="text-cream/30 text-sm">/mois</span>}
                  {!plan.isFree && <span className="text-cream/20 text-sm ml-2">| ${plan.annualPrice}/mois (annuel)</span>}
                </div>
                <div className="flex flex-wrap gap-2">
                  {((): string[] => { try { return JSON.parse(plan.featuresFr); } catch { return []; } })().map((f, i) => (
                    <span key={i} className="px-2.5 py-1 rounded-lg bg-cream/[0.04] text-cream/50 text-xs flex items-center gap-1.5">
                      <FaCheck className="text-gold text-[8px]" /> {f}
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <button onClick={() => toggleActive(plan)} title={plan.active ? "Desactiver" : "Activer"}
                  className={`p-2 rounded-lg transition-all ${plan.active ? "bg-emerald-400/10 text-emerald-400 hover:bg-emerald-400/20" : "bg-red-400/10 text-red-400 hover:bg-red-400/20"}`}>
                  {plan.active ? <FaCheck className="text-sm" /> : <FaTimes className="text-sm" />}
                </button>
                <button onClick={() => openEdit(plan)} className="p-2 rounded-lg bg-cream/[0.04] text-cream/50 hover:bg-cream/10 hover:text-cream transition-all">
                  <FaEdit className="text-sm" />
                </button>
                <button onClick={() => setShowDeleteConfirm(plan.id)} className="p-2 rounded-lg bg-red-400/10 text-red-400/60 hover:bg-red-400/20 hover:text-red-400 transition-all">
                  <FaTrash className="text-sm" />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Delete confirmation */}
      <AnimatePresence>
        {showDeleteConfirm && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[99] flex items-center justify-center bg-black/70 backdrop-blur-sm" onClick={() => setShowDeleteConfirm(null)}>
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }} onClick={(e) => e.stopPropagation()}
              className="bg-[#0d1a2e] border border-cream/10 rounded-2xl p-8 max-w-sm w-full mx-4 text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-500/10 flex items-center justify-center">
                <FaTrash className="text-red-400 text-xl" />
              </div>
              <h3 className="text-cream text-lg font-bold mb-2">Supprimer cette formule ?</h3>
              <p className="text-cream/40 text-sm mb-6">Cette action est irreversible.</p>
              <div className="flex gap-3">
                <button onClick={() => setShowDeleteConfirm(null)} className="flex-1 py-2.5 rounded-xl bg-cream/[0.05] text-cream border border-cream/10 text-sm font-medium hover:bg-cream/10 transition-all">Annuler</button>
                <button onClick={() => handleDelete(showDeleteConfirm)} disabled={deleting === showDeleteConfirm}
                  className="flex-1 py-2.5 rounded-xl bg-red-500 text-white text-sm font-bold hover:bg-red-600 transition-all disabled:opacity-60">
                  {deleting === showDeleteConfirm ? <FaSpinner className="animate-spin mx-auto" /> : "Supprimer"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Create/Edit modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[99] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4" onClick={() => setShowModal(false)}>
            <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }} onClick={(e) => e.stopPropagation()}
              className="bg-[#0d1a2e] border border-cream/10 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-[#0d1a2e] border-b border-cream/10 px-6 py-4 flex items-center justify-between z-10">
                <h3 className="text-cream text-lg font-bold">{editing ? "Modifier la formule" : "Nouvelle formule"}</h3>
                <button onClick={() => setShowModal(false)} className="text-cream/40 hover:text-cream"><FaTimes /></button>
              </div>

              <div className="p-6 space-y-5">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-cream/50 text-xs font-medium mb-1.5 block">Identifiant (slug)</label>
                    <input value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value.toUpperCase() })}
                      className="w-full px-3 py-2.5 rounded-xl bg-cream/[0.04] border border-cream/10 text-cream text-sm focus:border-gold/40 outline-none" placeholder="ex: ESSENTIAL" />
                  </div>
                  <div>
                    <label className="text-cream/50 text-xs font-medium mb-1.5 block">Ordre d'affichage</label>
                    <input type="number" value={form.sortOrder} onChange={(e) => setForm({ ...form, sortOrder: e.target.value })}
                      className="w-full px-3 py-2.5 rounded-xl bg-cream/[0.04] border border-cream/10 text-cream text-sm focus:border-gold/40 outline-none" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-cream/50 text-xs font-medium mb-1.5 block">Nom (FR)</label>
                    <input value={form.nameFr} onChange={(e) => setForm({ ...form, nameFr: e.target.value })}
                      className="w-full px-3 py-2.5 rounded-xl bg-cream/[0.04] border border-cream/10 text-cream text-sm focus:border-gold/40 outline-none" placeholder="Essentiel" />
                  </div>
                  <div>
                    <label className="text-cream/50 text-xs font-medium mb-1.5 block">Nom (EN)</label>
                    <input value={form.nameEn} onChange={(e) => setForm({ ...form, nameEn: e.target.value })}
                      className="w-full px-3 py-2.5 rounded-xl bg-cream/[0.04] border border-cream/10 text-cream text-sm focus:border-gold/40 outline-none" placeholder="Essential" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-cream/50 text-xs font-medium mb-1.5 block">Description (FR)</label>
                    <input value={form.descFr} onChange={(e) => setForm({ ...form, descFr: e.target.value })}
                      className="w-full px-3 py-2.5 rounded-xl bg-cream/[0.04] border border-cream/10 text-cream text-sm focus:border-gold/40 outline-none" />
                  </div>
                  <div>
                    <label className="text-cream/50 text-xs font-medium mb-1.5 block">Description (EN)</label>
                    <input value={form.descEn} onChange={(e) => setForm({ ...form, descEn: e.target.value })}
                      className="w-full px-3 py-2.5 rounded-xl bg-cream/[0.04] border border-cream/10 text-cream text-sm focus:border-gold/40 outline-none" />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="text-cream/50 text-xs font-medium mb-1.5 block">Prix mensuel ($)</label>
                    <input type="number" step="0.01" value={form.monthlyPrice} onChange={(e) => setForm({ ...form, monthlyPrice: e.target.value })}
                      className="w-full px-3 py-2.5 rounded-xl bg-cream/[0.04] border border-cream/10 text-cream text-sm focus:border-gold/40 outline-none" />
                  </div>
                  <div>
                    <label className="text-cream/50 text-xs font-medium mb-1.5 block">Prix annuel ($/ mois)</label>
                    <input type="number" step="0.01" value={form.annualPrice} onChange={(e) => setForm({ ...form, annualPrice: e.target.value })}
                      className="w-full px-3 py-2.5 rounded-xl bg-cream/[0.04] border border-cream/10 text-cream text-sm focus:border-gold/40 outline-none" />
                  </div>
                  <div>
                    <label className="text-cream/50 text-xs font-medium mb-1.5 block">Devise</label>
                    <select value={form.currency} onChange={(e) => setForm({ ...form, currency: e.target.value })}
                      className="w-full px-3 py-2.5 rounded-xl bg-cream/[0.04] border border-cream/10 text-cream text-sm focus:border-gold/40 outline-none">
                      <option value="USD">USD ($)</option>
                      <option value="EUR">EUR (€)</option>
                      <option value="XAF">XAF (FCFA)</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-cream/50 text-xs font-medium mb-1.5 block">Bouton CTA (FR)</label>
                    <input value={form.ctaFr} onChange={(e) => setForm({ ...form, ctaFr: e.target.value })}
                      className="w-full px-3 py-2.5 rounded-xl bg-cream/[0.04] border border-cream/10 text-cream text-sm focus:border-gold/40 outline-none" />
                  </div>
                  <div>
                    <label className="text-cream/50 text-xs font-medium mb-1.5 block">Bouton CTA (EN)</label>
                    <input value={form.ctaEn} onChange={(e) => setForm({ ...form, ctaEn: e.target.value })}
                      className="w-full px-3 py-2.5 rounded-xl bg-cream/[0.04] border border-cream/10 text-cream text-sm focus:border-gold/40 outline-none" />
                  </div>
                </div>

                <div className="flex gap-6">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={form.popular} onChange={(e) => setForm({ ...form, popular: e.target.checked })}
                      className="w-4 h-4 rounded accent-gold" />
                    <span className="text-cream/60 text-sm flex items-center gap-1"><FaCrown className="text-gold text-xs" /> Populaire</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={form.isFree} onChange={(e) => setForm({ ...form, isFree: e.target.checked })}
                      className="w-4 h-4 rounded accent-emerald-400" />
                    <span className="text-cream/60 text-sm">Gratuit</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={form.active} onChange={(e) => setForm({ ...form, active: e.target.checked })}
                      className="w-4 h-4 rounded accent-gold" />
                    <span className="text-cream/60 text-sm">Actif</span>
                  </label>
                </div>

                {/* Features FR */}
                <div>
                  <label className="text-cream/50 text-xs font-medium mb-1.5 block">Fonctionnalites (FR)</label>
                  <div className="flex gap-2 mb-2">
                    <input value={featureInput.fr} onChange={(e) => setFeatureInput({ ...featureInput, fr: e.target.value })}
                      onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addFeature("fr"))}
                      className="flex-1 px-3 py-2 rounded-xl bg-cream/[0.04] border border-cream/10 text-cream text-sm focus:border-gold/40 outline-none" placeholder="Ajouter une fonctionnalite..." />
                    <button onClick={() => addFeature("fr")} className="px-3 py-2 rounded-xl bg-gold/20 text-gold text-sm hover:bg-gold/30 transition-all"><FaPlus /></button>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {featuresFr().map((f, i) => (
                      <span key={i} className="px-2.5 py-1 rounded-lg bg-cream/[0.04] text-cream/60 text-xs flex items-center gap-1.5">
                        <FaCheck className="text-gold text-[8px]" /> {f}
                        <button onClick={() => removeFeature("fr", i)} className="ml-1 text-red-400/60 hover:text-red-400"><FaTimes className="text-[8px]" /></button>
                      </span>
                    ))}
                  </div>
                </div>

                {/* Features EN */}
                <div>
                  <label className="text-cream/50 text-xs font-medium mb-1.5 block">Features (EN)</label>
                  <div className="flex gap-2 mb-2">
                    <input value={featureInput.en} onChange={(e) => setFeatureInput({ ...featureInput, en: e.target.value })}
                      onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addFeature("en"))}
                      className="flex-1 px-3 py-2 rounded-xl bg-cream/[0.04] border border-cream/10 text-cream text-sm focus:border-gold/40 outline-none" placeholder="Add a feature..." />
                    <button onClick={() => addFeature("en")} className="px-3 py-2 rounded-xl bg-gold/20 text-gold text-sm hover:bg-gold/30 transition-all"><FaPlus /></button>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {featuresEn().map((f, i) => (
                      <span key={i} className="px-2.5 py-1 rounded-lg bg-cream/[0.04] text-cream/60 text-xs flex items-center gap-1.5">
                        <FaCheck className="text-gold text-[8px]" /> {f}
                        <button onClick={() => removeFeature("en", i)} className="ml-1 text-red-400/60 hover:text-red-400"><FaTimes className="text-[8px]" /></button>
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="sticky bottom-0 bg-[#0d1a2e] border-t border-cream/10 px-6 py-4 flex justify-end gap-3">
                <button onClick={() => setShowModal(false)} className="px-5 py-2.5 rounded-xl bg-cream/[0.05] border border-cream/10 text-cream text-sm font-medium hover:bg-cream/10 transition-all">Annuler</button>
                <button onClick={handleSave} disabled={saving || !form.slug || !form.nameFr}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-gold to-gold-light text-navy font-bold text-sm hover:shadow-lg hover:shadow-gold/20 transition-all disabled:opacity-60">
                  {saving ? <FaSpinner className="animate-spin" /> : editing ? "Enregistrer" : "Creer"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
