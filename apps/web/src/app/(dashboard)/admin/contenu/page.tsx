"use client";

import { useState, useEffect, useCallback } from "react";
import { useI18n } from "@/context/i18n-context";
import {
  FaSave, FaSpinner, FaCheck, FaHome, FaInfoCircle, FaChartBar,
  FaQuoteLeft, FaFootballBall, FaImage, FaPlus, FaTrash, FaTimes,
  FaEdit, FaStar, FaGlobe
} from "react-icons/fa";
import api from "@/lib/api";

interface ContentItem {
  id: string;
  key: string;
  value: string;
  type: string;
}

const SECTIONS = [
  { id: "hero", icon: <FaHome />, label: "Hero / Accueil" },
  { id: "about", icon: <FaInfoCircle />, label: "A propos" },
  { id: "stats", icon: <FaChartBar />, label: "Statistiques" },
  { id: "testimonials", icon: <FaQuoteLeft />, label: "Temoignages" },
  { id: "footer", icon: <FaGlobe />, label: "Footer / Reseaux" },
];

export default function AdminContenu() {
  const { t } = useI18n();
  const [activeSection, setActiveSection] = useState("hero");
  const [contents, setContents] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [editedValues, setEditedValues] = useState<Record<string, string>>({});

  const fetchContents = useCallback(async () => {
    try {
      const data = await api.get<ContentItem[]>("/site-content");
      setContents(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchContents(); }, [fetchContents]);

  const getValue = (key: string) => {
    if (editedValues[key] !== undefined) return editedValues[key];
    const item = contents.find(c => c.key === key);
    return item?.value || "";
  };

  const setValue = (key: string, value: string) => {
    setEditedValues(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const updates = Object.entries(editedValues).map(([key, value]) => {
        const existing = contents.find(c => c.key === key);
        return { key, value, type: existing?.type || "text" };
      });
      for (const u of updates) {
        await api.put(`/site-content/${u.key}`, { value: u.value, type: u.type });
      }
      setSaved(true);
      setEditedValues({});
      await fetchContents();
      setTimeout(() => setSaved(false), 2000);
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  };

  const hasChanges = Object.keys(editedValues).length > 0;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <FaSpinner className="animate-spin text-gold text-2xl" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-white">Gestion du contenu</h1>
          <p className="text-white/30 text-sm">Modifiez les textes, images et donnees affichees sur le site</p>
        </div>
        <button
          onClick={handleSave}
          disabled={!hasChanges || saving}
          className={`flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-bold transition-all ${
            saved ? "bg-emerald-500 text-white" :
            hasChanges ? "bg-gold text-navy hover:bg-gold-light" :
            "bg-white/5 text-white/20 cursor-not-allowed"
          }`}
        >
          {saving ? <FaSpinner className="animate-spin text-xs" /> : saved ? <FaCheck className="text-xs" /> : <FaSave className="text-xs" />}
          {saving ? "Enregistrement..." : saved ? "Enregistre !" : "Enregistrer"}
        </button>
      </div>

      <div className="grid lg:grid-cols-5 gap-5">
        <div className="rounded-2xl bg-white/[0.02] border border-white/[0.06] p-3">
          <nav className="space-y-1">
            {SECTIONS.map((s) => (
              <button
                key={s.id}
                onClick={() => setActiveSection(s.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-medium transition-all ${
                  activeSection === s.id
                    ? "bg-gold/10 text-gold border border-gold/10"
                    : "text-white/40 hover:text-white/60 hover:bg-white/[0.03]"
                }`}
              >
                <span className="text-sm">{s.icon}</span>{s.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="lg:col-span-4 rounded-2xl bg-white/[0.02] border border-white/[0.06] p-6 space-y-6">
          {activeSection === "hero" && <HeroSection getValue={getValue} setValue={setValue} />}
          {activeSection === "about" && <AboutSection getValue={getValue} setValue={setValue} />}
          {activeSection === "stats" && <StatsSection getValue={getValue} setValue={setValue} />}
          {activeSection === "testimonials" && <TestimonialsSection getValue={getValue} setValue={setValue} />}
          {activeSection === "footer" && <FooterSection getValue={getValue} setValue={setValue} />}
        </div>
      </div>
    </div>
  );
}

function FieldInput({ label, value, onChange, type = "text", rows }: {
  label: string; value: string; onChange: (v: string) => void; type?: string; rows?: number;
}) {
  return (
    <div>
      <label className="block text-white/40 text-[10px] font-medium uppercase tracking-wider mb-2">{label}</label>
      {rows ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          rows={rows}
          className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/[0.06] text-white text-sm focus:outline-none focus:border-gold/30 transition-all resize-none"
        />
      ) : (
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/[0.06] text-white text-sm focus:outline-none focus:border-gold/30 transition-all"
        />
      )}
    </div>
  );
}

function HeroSection({ getValue, setValue }: { getValue: (k: string) => string; setValue: (k: string, v: string) => void }) {
  return (
    <>
      <div className="flex items-center gap-3 mb-4">
        <div className="w-8 h-8 rounded-lg bg-gold/10 flex items-center justify-center">
          <FaHome className="text-gold text-sm" />
        </div>
        <div>
          <h3 className="text-sm font-bold text-white">Section Hero</h3>
          <p className="text-white/30 text-[10px]">Banniere principale de la page d'accueil</p>
        </div>
      </div>
      <div className="grid md:grid-cols-2 gap-4">
        <FieldInput label="Titre principal" value={getValue("hero_title")} onChange={(v) => setValue("hero_title", v)} />
        <FieldInput label="URL image de fond" value={getValue("hero_image")} onChange={(v) => setValue("hero_image", v)} />
      </div>
      <FieldInput label="Sous-titre" value={getValue("hero_subtitle")} onChange={(v) => setValue("hero_subtitle", v)} rows={2} />
      <FieldInput label="Texte du bouton CTA" value={getValue("hero_cta")} onChange={(v) => setValue("hero_cta", v)} />
    </>
  );
}

function AboutSection({ getValue, setValue }: { getValue: (k: string) => string; setValue: (k: string, v: string) => void }) {
  return (
    <>
      <div className="flex items-center gap-3 mb-4">
        <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center">
          <FaInfoCircle className="text-blue-400 text-sm" />
        </div>
        <div>
          <h3 className="text-sm font-bold text-white">Page A propos</h3>
          <p className="text-white/30 text-[10px]">Informations sur le ministere et Lord Lombo</p>
        </div>
      </div>
      <div className="grid md:grid-cols-2 gap-4">
        <FieldInput label="Titre" value={getValue("about_title")} onChange={(v) => setValue("about_title", v)} />
        <FieldInput label="URL photo" value={getValue("about_image")} onChange={(v) => setValue("about_image", v)} />
      </div>
      <FieldInput label="Description" value={getValue("about_description")} onChange={(v) => setValue("about_description", v)} rows={4} />
      <FieldInput label="Mission" value={getValue("about_mission")} onChange={(v) => setValue("about_mission", v)} rows={3} />
      <FieldInput label="Vision" value={getValue("about_vision")} onChange={(v) => setValue("about_vision", v)} rows={3} />
    </>
  );
}

function StatsSection({ getValue, setValue }: { getValue: (k: string) => string; setValue: (k: string, v: string) => void }) {
  const stats = [
    { key: "stat_students", label: "Nombre d'etudiants", keyLabel: "stat_students_label", labelText: "Label etudiants" },
    { key: "stat_courses", label: "Nombre de cours", keyLabel: "stat_courses_label", labelText: "Label cours" },
    { key: "stat_countries", label: "Nombre de pays", keyLabel: "stat_countries_label", labelText: "Label pays" },
    { key: "stat_satisfaction", label: "Taux de satisfaction", keyLabel: "stat_satisfaction_label", labelText: "Label satisfaction" },
  ];
  return (
    <>
      <div className="flex items-center gap-3 mb-4">
        <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center">
          <FaChartBar className="text-emerald-400 text-sm" />
        </div>
        <div>
          <h3 className="text-sm font-bold text-white">Statistiques</h3>
          <p className="text-white/30 text-[10px]">Chiffres cles affiches sur le site</p>
        </div>
      </div>
      <div className="space-y-4">
        {stats.map((s) => (
          <div key={s.key} className="grid md:grid-cols-2 gap-4 p-4 rounded-xl bg-white/[0.02] border border-white/[0.04]">
            <FieldInput label={s.labelText} value={getValue(s.keyLabel)} onChange={(v) => setValue(s.keyLabel, v)} />
            <FieldInput label={s.label} value={getValue(s.key)} onChange={(v) => setValue(s.key, v)} />
          </div>
        ))}
      </div>
    </>
  );
}

function TestimonialsSection({ getValue, setValue }: { getValue: (k: string) => string; setValue: (k: string, v: string) => void }) {
  const raw = getValue("testimonials");
  let testimonials: { name: string; role: string; text: string; avatar: string }[] = [];
  try { testimonials = JSON.parse(raw || "[]"); } catch { testimonials = []; }

  const updateTestimonials = (updated: typeof testimonials) => {
    setValue("testimonials", JSON.stringify(updated));
  };

  const addTestimonial = () => {
    updateTestimonials([...testimonials, { name: "", role: "", text: "", avatar: "" }]);
  };

  const removeTestimonial = (idx: number) => {
    updateTestimonials(testimonials.filter((_, i) => i !== idx));
  };

  const updateField = (idx: number, field: string, value: string) => {
    const updated = [...testimonials];
    (updated[idx] as any)[field] = value;
    updateTestimonials(updated);
  };

  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center">
            <FaQuoteLeft className="text-purple-400 text-sm" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">Temoignages</h3>
            <p className="text-white/30 text-[10px]">Avis des etudiants affiches sur le site</p>
          </div>
        </div>
        <button onClick={addTestimonial} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gold/10 text-gold text-xs font-bold hover:bg-gold/20 transition-all">
          <FaPlus className="text-[10px]" /> Ajouter
        </button>
      </div>
      <div className="space-y-4">
        {testimonials.map((t, idx) => (
          <div key={idx} className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.04] space-y-3 relative">
            <button onClick={() => removeTestimonial(idx)} className="absolute top-3 right-3 text-red-400/50 hover:text-red-400 transition-all">
              <FaTrash className="text-xs" />
            </button>
            <div className="grid md:grid-cols-3 gap-3">
              <FieldInput label="Nom" value={t.name} onChange={(v) => updateField(idx, "name", v)} />
              <FieldInput label="Role / Titre" value={t.role} onChange={(v) => updateField(idx, "role", v)} />
              <FieldInput label="URL Avatar" value={t.avatar} onChange={(v) => updateField(idx, "avatar", v)} />
            </div>
            <FieldInput label="Temoignage" value={t.text} onChange={(v) => updateField(idx, "text", v)} rows={2} />
          </div>
        ))}
        {testimonials.length === 0 && (
          <div className="text-center py-8 text-white/20 text-sm">Aucun temoignage. Cliquez sur "Ajouter" pour commencer.</div>
        )}
      </div>
    </>
  );
}

function FooterSection({ getValue, setValue }: { getValue: (k: string) => string; setValue: (k: string, v: string) => void }) {
  return (
    <>
      <div className="flex items-center gap-3 mb-4">
        <div className="w-8 h-8 rounded-lg bg-cyan-500/10 flex items-center justify-center">
          <FaGlobe className="text-cyan-400 text-sm" />
        </div>
        <div>
          <h3 className="text-sm font-bold text-white">Footer & Reseaux sociaux</h3>
          <p className="text-white/30 text-[10px]">Liens et informations du pied de page</p>
        </div>
      </div>
      <FieldInput label="Texte du footer" value={getValue("footer_text")} onChange={(v) => setValue("footer_text", v)} rows={2} />
      <div className="grid md:grid-cols-2 gap-4">
        <FieldInput label="Facebook" value={getValue("footer_social_facebook")} onChange={(v) => setValue("footer_social_facebook", v)} />
        <FieldInput label="Instagram" value={getValue("footer_social_instagram")} onChange={(v) => setValue("footer_social_instagram", v)} />
        <FieldInput label="YouTube" value={getValue("footer_social_youtube")} onChange={(v) => setValue("footer_social_youtube", v)} />
        <FieldInput label="Twitter / X" value={getValue("footer_social_twitter")} onChange={(v) => setValue("footer_social_twitter", v)} />
      </div>
      <FieldInput label="Email de contact" value={getValue("footer_email")} onChange={(v) => setValue("footer_email", v)} />
      <FieldInput label="Telephone" value={getValue("footer_phone")} onChange={(v) => setValue("footer_phone", v)} />
      <FieldInput label="Adresse" value={getValue("footer_address")} onChange={(v) => setValue("footer_address", v)} />
    </>
  );
}
