"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useI18n } from "@/context/i18n-context";
import {
  FaSave, FaSpinner, FaCheck, FaHome, FaInfoCircle, FaChartBar,
  FaQuoteLeft, FaImage, FaPlus, FaTrash, FaGlobe, FaUpload,
  FaChevronLeft, FaChevronRight
} from "react-icons/fa";
import api, { API_HOST } from "@/lib/api";

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

function ImageUpload({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const imgSrc = value
    ? value.startsWith("http") ? value : `${API_HOST}${value}`
    : "";

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) return;
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await api.upload<{ url: string }>("/upload", fd);
      onChange(res.url);
    } catch (err) {
      console.error(err);
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  return (
    <div>
      <label className="block text-white/40 text-[10px] font-medium uppercase tracking-wider mb-2">{label}</label>
      <div className="flex items-start gap-3">
        <div
          onClick={() => inputRef.current?.click()}
          className="w-28 h-28 rounded-xl bg-white/[0.04] border-2 border-dashed border-white/[0.1] hover:border-gold/30 flex items-center justify-center cursor-pointer overflow-hidden transition-all flex-shrink-0"
        >
          {uploading ? (
            <FaSpinner className="animate-spin text-gold" />
          ) : imgSrc ? (
            <img src={imgSrc} alt="" className="w-full h-full object-cover" />
          ) : (
            <div className="text-center">
              <FaUpload className="text-white/20 mx-auto mb-1" />
              <span className="text-white/20 text-[9px]">Charger</span>
            </div>
          )}
        </div>
        <div className="flex-1 space-y-2">
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="URL ou charger une image..."
            className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/[0.06] text-white text-sm focus:outline-none focus:border-gold/30 transition-all"
          />
          <button
            onClick={() => inputRef.current?.click()}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gold/10 text-gold text-[10px] font-bold hover:bg-gold/20 transition-all"
          >
            <FaUpload className="text-[8px]" /> {uploading ? "Chargement..." : "Charger une image"}
          </button>
        </div>
      </div>
      <input ref={inputRef} type="file" accept="image/*" onChange={handleUpload} className="hidden" />
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
      <FieldInput label="Titre principal" value={getValue("hero_title")} onChange={(v) => setValue("hero_title", v)} />
      <ImageUpload label="Image de fond" value={getValue("hero_image")} onChange={(v) => setValue("hero_image", v)} />
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
      <FieldInput label="Titre" value={getValue("about_title")} onChange={(v) => setValue("about_title", v)} />
      <ImageUpload label="Photo" value={getValue("about_image")} onChange={(v) => setValue("about_image", v)} />
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

const TESTIMONIALS_PER_PAGE = 5;

function TestimonialsSection({ getValue, setValue }: { getValue: (k: string) => string; setValue: (k: string, v: string) => void }) {
  const [page, setPage] = useState(1);
  const raw = getValue("testimonials");
  let testimonials: { name: string; role: string; text: string; avatar: string }[] = [];
  try { testimonials = JSON.parse(raw || "[]"); } catch { testimonials = []; }

  const totalPages = Math.max(1, Math.ceil(testimonials.length / TESTIMONIALS_PER_PAGE));
  const start = (page - 1) * TESTIMONIALS_PER_PAGE;
  const visible = testimonials.slice(start, start + TESTIMONIALS_PER_PAGE);

  const updateTestimonials = (updated: typeof testimonials) => {
    setValue("testimonials", JSON.stringify(updated));
  };

  const addTestimonial = () => {
    updateTestimonials([...testimonials, { name: "", role: "", text: "", avatar: "" }]);
    const newTotal = Math.ceil((testimonials.length + 1) / TESTIMONIALS_PER_PAGE);
    setPage(newTotal);
  };

  const removeTestimonial = (globalIdx: number) => {
    updateTestimonials(testimonials.filter((_, i) => i !== globalIdx));
    if (page > 1 && visible.length === 1) setPage(page - 1);
  };

  const updateField = (globalIdx: number, field: string, value: string) => {
    const updated = [...testimonials];
    (updated[globalIdx] as any)[field] = value;
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
            <h3 className="text-sm font-bold text-white">Temoignages ({testimonials.length})</h3>
            <p className="text-white/30 text-[10px]">Avis des etudiants affiches sur le site</p>
          </div>
        </div>
        <button onClick={addTestimonial} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gold/10 text-gold text-xs font-bold hover:bg-gold/20 transition-all">
          <FaPlus className="text-[10px]" /> Ajouter
        </button>
      </div>
      <div className="space-y-4">
        {visible.map((t, localIdx) => {
          const globalIdx = start + localIdx;
          return (
            <div key={globalIdx} className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.04] space-y-3 relative">
              <button onClick={() => removeTestimonial(globalIdx)} className="absolute top-3 right-3 text-red-400/50 hover:text-red-400 transition-all">
                <FaTrash className="text-xs" />
              </button>
              <div className="grid md:grid-cols-3 gap-3">
                <FieldInput label="Nom" value={t.name} onChange={(v) => updateField(globalIdx, "name", v)} />
                <FieldInput label="Role / Titre" value={t.role} onChange={(v) => updateField(globalIdx, "role", v)} />
                <ImageUpload label="Avatar" value={t.avatar} onChange={(v) => updateField(globalIdx, "avatar", v)} />
              </div>
              <FieldInput label="Temoignage" value={t.text} onChange={(v) => updateField(globalIdx, "text", v)} rows={2} />
            </div>
          );
        })}
        {testimonials.length === 0 && (
          <div className="text-center py-8 text-white/20 text-sm">Aucun temoignage. Cliquez sur "Ajouter" pour commencer.</div>
        )}
      </div>
      {totalPages > 1 && (
        <div className="flex items-center justify-between pt-4 border-t border-white/[0.04]">
          <span className="text-white/20 text-xs">{start + 1}-{Math.min(start + TESTIMONIALS_PER_PAGE, testimonials.length)} sur {testimonials.length}</span>
          <div className="flex items-center gap-1">
            <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-white/30 hover:text-gold hover:bg-gold/10 disabled:opacity-20 disabled:cursor-not-allowed transition-all">
              <FaChevronLeft className="text-[10px]" />
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
              <button key={p} onClick={() => setPage(p)}
                className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-medium transition-all ${
                  page === p ? "bg-gold/20 text-gold border border-gold/30" : "text-white/40 hover:text-gold hover:bg-gold/10"
                }`}>{p}</button>
            ))}
            <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-white/30 hover:text-gold hover:bg-gold/10 disabled:opacity-20 disabled:cursor-not-allowed transition-all">
              <FaChevronRight className="text-[10px]" />
            </button>
          </div>
        </div>
      )}
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
