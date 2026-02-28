"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui";
import { FaTimes, FaCalendarAlt, FaClock, FaArrowRight, FaCheck, FaSpinner, FaUser, FaEnvelope, FaPhone } from "react-icons/fa";
import { useI18n } from "@/context/i18n-context";
import api from "@/lib/api";

function getDaysInMonth(year: number, month: number) { return new Date(year, month + 1, 0).getDate(); }
function getFirstDayOfMonth(year: number, month: number) { return new Date(year, month, 1).getDay(); }

const dayNameKeys = [
  { fr: "Dim", en: "Sun" }, { fr: "Lun", en: "Mon" }, { fr: "Mar", en: "Tue" },
  { fr: "Mer", en: "Wed" }, { fr: "Jeu", en: "Thu" }, { fr: "Ven", en: "Fri" }, { fr: "Sam", en: "Sat" },
];

const monthKeys = ["booking.month.jan","booking.month.feb","booking.month.mar","booking.month.apr","booking.month.may","booking.month.jun","booking.month.jul","booking.month.aug","booking.month.sep","booking.month.oct","booking.month.nov","booking.month.dec"];

export function BookingModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const { t, locale } = useI18n();
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [selectedDate, setSelectedDate] = useState<number | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [step, setStep] = useState<"date" | "time" | "info" | "confirm" | "success">("date");
  const [availableSlots, setAvailableSlots] = useState<string[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [subject, setSubject] = useState("");

  const daysInMonth = getDaysInMonth(currentYear, currentMonth);
  const firstDay = getFirstDayOfMonth(currentYear, currentMonth);

  const dateStr = selectedDate ? `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}-${String(selectedDate).padStart(2, "0")}` : "";

  useEffect(() => {
    if (!selectedDate) return;
    setLoadingSlots(true);
    api.get<string[]>(`/bookings/available-slots?date=${dateStr}`)
      .then(setAvailableSlots)
      .catch(() => setAvailableSlots(["09:00","09:30","10:00","10:30","11:00","11:30","14:00","14:30","15:00","15:30","16:00","16:30"]))
      .finally(() => setLoadingSlots(false));
  }, [selectedDate, dateStr]);

  const handleDateSelect = (day: number) => { setSelectedDate(day); setStep("time"); };
  const handleTimeSelect = (time: string) => { setSelectedTime(time); setStep("info"); };
  const handlePrevMonth = () => { if (currentMonth === 0) { setCurrentMonth(11); setCurrentYear(currentYear - 1); } else setCurrentMonth(currentMonth - 1); };
  const handleNextMonth = () => { if (currentMonth === 11) { setCurrentMonth(0); setCurrentYear(currentYear + 1); } else setCurrentMonth(currentMonth + 1); };
  const isDatePast = (day: number) => new Date(currentYear, currentMonth, day) < new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const isWeekend = (day: number) => new Date(currentYear, currentMonth, day).getDay() === 0;
  const reset = () => { setSelectedDate(null); setSelectedTime(null); setStep("date"); setName(""); setEmail(""); setPhone(""); setSubject(""); };

  const handleSubmit = async () => {
    if (!name || !email || !selectedDate || !selectedTime) return;
    setSubmitting(true);
    try {
      await api.post("/bookings", { name, email, phone: phone || undefined, date: dateStr, slot: selectedTime, subject: subject || "Rendez-vous LL Academie" });
      setStep("success");
    } catch {} finally { setSubmitting(false); }
  };

  const stepLabel = step === "date" ? t("booking.step1") : step === "time" ? `${selectedDate} ${t(monthKeys[currentMonth])} — ${t("booking.step2")}` : step === "info" ? (locale === "en" ? "Your information" : "Vos informations") : step === "confirm" ? t("booking.step3") : "";

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] flex items-center justify-center p-4" onClick={onClose}>
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
          <motion.div initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 20 }} transition={{ type: "spring", damping: 25, stiffness: 300 }} onClick={(e) => e.stopPropagation()} className="relative glass-strong rounded-3xl p-8 max-w-md w-full gold-border-glow max-h-[90vh] overflow-y-auto">
            <button onClick={onClose} className="absolute top-4 right-4 text-cream/40 hover:text-cream transition-colors p-2"><FaTimes /></button>

            <div className="text-center mb-6">
              <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-gold/15 flex items-center justify-center"><FaCalendarAlt className="text-gold text-xl" /></div>
              <h2 className="text-xl font-bold text-cream">{t("booking.title")}</h2>
              <p className="text-cream/45 text-sm mt-1">{stepLabel}</p>
            </div>

            {step !== "success" && (
              <div className="flex items-center gap-2 mb-6">
                {["date", "time", "info", "confirm"].map((s, i) => {
                  const steps = ["date", "time", "info", "confirm"];
                  const currentIdx = steps.indexOf(step);
                  return (
                    <div key={s} className="flex-1 flex items-center gap-2">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${step === s ? "bg-gold text-navy" : i < currentIdx ? "bg-gold/30 text-gold" : "bg-cream/5 text-cream/30"}`}>
                        {i < currentIdx ? <FaCheck className="text-xs" /> : i + 1}
                      </div>
                      {i < 3 && <div className={`flex-1 h-px ${i < currentIdx ? "bg-gold/40" : "bg-cream/10"}`} />}
                    </div>
                  );
                })}
              </div>
            )}

            {step === "date" && (
              <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                <div className="flex items-center justify-between mb-4">
                  <button onClick={handlePrevMonth} className="text-cream/50 hover:text-gold transition-colors p-2 rounded-lg hover:bg-cream/5">&larr;</button>
                  <span className="font-bold text-cream">{t(monthKeys[currentMonth])} {currentYear}</span>
                  <button onClick={handleNextMonth} className="text-cream/50 hover:text-gold transition-colors p-2 rounded-lg hover:bg-cream/5">&rarr;</button>
                </div>
                <div className="grid grid-cols-7 gap-1 mb-2">
                  {dayNameKeys.map((d) => (<div key={d.fr} className="text-center text-cream/30 text-xs font-medium py-1">{locale === "en" ? d.en : d.fr}</div>))}
                </div>
                <div className="grid grid-cols-7 gap-1">
                  {Array.from({ length: firstDay }, (_, i) => (<div key={`empty-${i}`} />))}
                  {Array.from({ length: daysInMonth }, (_, i) => {
                    const day = i + 1; const disabled = isDatePast(day) || isWeekend(day);
                    const isToday = day === today.getDate() && currentMonth === today.getMonth() && currentYear === today.getFullYear();
                    return (
                      <button key={day} disabled={disabled} onClick={() => handleDateSelect(day)} className={`aspect-square rounded-lg text-sm font-medium transition-all ${disabled ? "text-cream/15 cursor-not-allowed" : "text-cream hover:bg-gold/20 hover:text-gold cursor-pointer active:scale-95"} ${isToday ? "ring-1 ring-gold/40" : ""}`}>{day}</button>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {step === "time" && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                {loadingSlots ? (
                  <div className="flex justify-center py-8"><FaSpinner className="text-gold text-xl animate-spin" /></div>
                ) : (
                  <div className="grid grid-cols-3 gap-2">
                    {availableSlots.map((time) => (
                      <button key={time} onClick={() => handleTimeSelect(time)} className="py-3 rounded-xl glass text-cream/70 hover:text-gold hover:border-gold/30 transition-all text-sm font-medium flex items-center justify-center gap-2 active:scale-95">
                        <FaClock className="text-xs" />{time}
                      </button>
                    ))}
                    {availableSlots.length === 0 && <p className="col-span-3 text-center text-cream/30 text-sm py-6">{locale === "en" ? "No slot available" : "Aucun creneau disponible"}</p>}
                  </div>
                )}
                <button onClick={() => { setStep("date"); setSelectedDate(null); }} className="mt-4 text-cream/40 hover:text-cream text-sm transition-colors">&larr; {locale === "en" ? "Change date" : "Changer la date"}</button>
              </motion.div>
            )}

            {step === "info" && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
                <div className="relative">
                  <FaUser className="absolute left-4 top-1/2 -translate-y-1/2 text-cream/20 text-sm" />
                  <input type="text" required placeholder={locale === "en" ? "Full name *" : "Nom complet *"} value={name} onChange={(e) => setName(e.target.value)} className="w-full pl-11 pr-4 py-3 rounded-xl bg-cream/5 border border-cream/10 text-cream placeholder:text-cream/30 text-sm focus:outline-none focus:border-gold/40 transition-all" />
                </div>
                <div className="relative">
                  <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-cream/20 text-sm" />
                  <input type="email" required placeholder="Email *" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full pl-11 pr-4 py-3 rounded-xl bg-cream/5 border border-cream/10 text-cream placeholder:text-cream/30 text-sm focus:outline-none focus:border-gold/40 transition-all" />
                </div>
                <div className="relative">
                  <FaPhone className="absolute left-4 top-1/2 -translate-y-1/2 text-cream/20 text-sm" />
                  <input type="tel" placeholder={locale === "en" ? "Phone (optional)" : "Telephone (optionnel)"} value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full pl-11 pr-4 py-3 rounded-xl bg-cream/5 border border-cream/10 text-cream placeholder:text-cream/30 text-sm focus:outline-none focus:border-gold/40 transition-all" />
                </div>
                <input type="text" placeholder={locale === "en" ? "Subject of the appointment" : "Sujet du rendez-vous"} value={subject} onChange={(e) => setSubject(e.target.value)} className="w-full px-4 py-3 rounded-xl bg-cream/5 border border-cream/10 text-cream placeholder:text-cream/30 text-sm focus:outline-none focus:border-gold/40 transition-all" />
                <div className="flex gap-3 pt-2">
                  <button onClick={() => setStep("time")} className="flex-1 py-3 rounded-xl glass text-cream/50 text-sm hover:text-cream transition-all">&larr; {locale === "en" ? "Back" : "Retour"}</button>
                  <Button className="flex-1" disabled={!name || !email} onClick={() => setStep("confirm")}>{locale === "en" ? "Continue" : "Continuer"} <FaArrowRight className="ml-2 text-xs" /></Button>
                </div>
              </motion.div>
            )}

            {step === "confirm" && (
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center">
                <div className="glass rounded-2xl p-6 mb-6 text-left space-y-3">
                  <div className="flex items-center gap-3"><FaCalendarAlt className="text-gold" /><span className="text-cream font-medium">{selectedDate} {t(monthKeys[currentMonth])} {currentYear}</span></div>
                  <div className="flex items-center gap-3"><FaClock className="text-gold" /><span className="text-cream font-medium">{selectedTime} — 30 min</span></div>
                  <div className="flex items-center gap-3"><FaUser className="text-gold" /><span className="text-cream/70 text-sm">{name}</span></div>
                  <div className="flex items-center gap-3"><FaEnvelope className="text-gold" /><span className="text-cream/70 text-sm">{email}</span></div>
                  {subject && <div className="text-cream/40 text-xs pt-1 border-t border-cream/5">{subject}</div>}
                </div>
                <Button className="w-full py-4 mb-3" disabled={submitting} onClick={handleSubmit}>
                  {submitting ? <><FaSpinner className="animate-spin mr-2" />{locale === "en" ? "Booking..." : "Reservation..."}</> : <>{locale === "en" ? "Confirm appointment" : "Confirmer le rendez-vous"}<FaArrowRight className="ml-2" /></>}
                </Button>
                <button onClick={() => setStep("info")} className="text-cream/40 hover:text-cream text-sm transition-colors">{locale === "en" ? "Edit" : "Modifier"}</button>
              </motion.div>
            )}

            {step === "success" && (
              <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-4">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: [0, 1.3, 1] }}
                  transition={{ duration: 0.6, times: [0, 0.6, 1], type: "spring" }}
                  className="w-20 h-20 mx-auto mb-4 rounded-full bg-emerald-400/15 flex items-center justify-center relative"
                >
                  <FaCheck className="text-emerald-400 text-3xl" />
                  {[...Array(8)].map((_, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 1, scale: 0 }}
                      animate={{ opacity: 0, scale: 1, x: Math.cos(i * 45 * Math.PI / 180) * 40, y: Math.sin(i * 45 * Math.PI / 180) * 40 }}
                      transition={{ duration: 0.8, delay: 0.3 }}
                      className="absolute w-2 h-2 rounded-full bg-gold"
                    />
                  ))}
                </motion.div>
                <h3 className="text-xl font-bold text-cream mb-2">{locale === "en" ? "Appointment confirmed!" : "Rendez-vous confirme !"}</h3>
                <p className="text-cream/50 text-sm mb-1">{selectedDate} {t(monthKeys[currentMonth])} {currentYear} {locale === "en" ? "at" : "a"} {selectedTime}</p>
                <p className="text-cream/30 text-xs mb-6">{locale === "en" ? "A confirmation email has been sent." : "Un email de confirmation vous a ete envoye."}</p>
                <Button variant="outline" onClick={() => { reset(); onClose(); }}>{locale === "en" ? "Close" : "Fermer"}</Button>
              </motion.div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
