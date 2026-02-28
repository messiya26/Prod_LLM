"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaAward, FaDownload, FaEye, FaShieldAlt, FaCalendarAlt, FaClock, FaCheckCircle, FaTimes, FaQrcode } from "react-icons/fa";
import { useAuth } from "@/context/auth-context";
import api from "@/lib/api";

interface Certificate {
  id: string;
  certificateId: string;
  courseName: string;
  instructorName: string | null;
  issuedAt: string;
  grade: string | null;
  hoursCompleted: number;
  verificationHash: string;
}

export default function CertificatsPage() {
  const { user } = useAuth();
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewCert, setViewCert] = useState<Certificate | null>(null);

  useEffect(() => {
    api.get<Certificate[]>("/certificates/my").then((data) => {
      setCertificates(data);
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const formatDate = (d: string) => new Date(d).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-cream">Mes Certificats</h1>
          <p className="text-cream/40 text-sm mt-1">Vos diplomes et attestations de formation</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-400/10 text-emerald-400 text-xs">
          <FaShieldAlt className="text-[10px]" />
          Securise & Verifiable
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="flex gap-1.5">
            {[0, 1, 2].map((i) => (
              <motion.div key={i} className="w-2.5 h-2.5 rounded-full bg-gold" animate={{ y: [0, -8, 0] }} transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }} />
            ))}
          </div>
        </div>
      ) : certificates.length === 0 ? (
        <div className="text-center py-16 rounded-2xl bg-cream/[0.02] border border-cream/[0.06]">
          <FaAward className="text-gold/20 text-5xl mx-auto mb-4" />
          <h3 className="text-cream font-semibold mb-2">Aucun certificat pour le moment</h3>
          <p className="text-cream/30 text-sm max-w-sm mx-auto">Completez vos formations pour obtenir vos certificats officiels Lord Lombo Academie</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-5">
          {certificates.map((cert, i) => (
            <motion.div key={cert.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="rounded-2xl bg-cream/[0.02] border border-cream/[0.06] overflow-hidden hover:border-gold/20 transition-all group">
              <div className="h-2 bg-gradient-to-r from-gold via-gold-light to-gold" />
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-cream font-bold text-sm">{cert.courseName}</h3>
                    {cert.instructorName && <p className="text-cream/30 text-xs mt-1">Formateur : {cert.instructorName}</p>}
                  </div>
                  <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-400/10 text-emerald-400 text-[10px]">
                    <FaCheckCircle className="text-[8px]" /> Verifie
                  </div>
                </div>
                <div className="flex items-center gap-4 text-cream/25 text-xs mb-4">
                  <span className="flex items-center gap-1"><FaCalendarAlt className="text-[9px]" />{formatDate(cert.issuedAt)}</span>
                  <span className="flex items-center gap-1"><FaClock className="text-[9px]" />{cert.hoursCompleted}h</span>
                  {cert.grade && <span className="text-gold font-semibold">{cert.grade}</span>}
                </div>
                <div className="text-cream/15 text-[10px] font-mono mb-4 truncate">ID: {cert.certificateId}</div>
                <div className="flex items-center gap-2">
                  <button onClick={() => setViewCert(cert)} className="flex-1 py-2.5 rounded-xl bg-gold/10 text-gold text-xs font-semibold hover:bg-gold/20 transition-all flex items-center justify-center gap-2">
                    <FaEye className="text-[10px]" /> Voir
                  </button>
                  <button className="flex-1 py-2.5 rounded-xl bg-cream/[0.04] text-cream/50 text-xs font-semibold hover:bg-cream/[0.08] transition-all flex items-center justify-center gap-2">
                    <FaDownload className="text-[10px]" /> PDF
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Certificate Preview Modal */}
      <AnimatePresence>
        {viewCert && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm" onClick={() => setViewCert(null)}>
            <motion.div initial={{ scale: 0.85, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.85, opacity: 0 }} transition={{ type: "spring", damping: 25 }} onClick={(e) => e.stopPropagation()} className="w-full max-w-2xl">
              <div className="relative rounded-2xl overflow-hidden" style={{ background: "linear-gradient(145deg, #0f0f1a, #1a1a2e)" }}>
                <button onClick={() => setViewCert(null)} className="absolute top-4 right-4 text-cream/30 hover:text-cream z-10 transition-colors"><FaTimes /></button>

                {/* Certificate Design */}
                <div className="p-8 md:p-12">
                  <div className="border-2 border-gold/20 rounded-xl p-8 relative">
                    {/* Corner decorations */}
                    <div className="absolute top-0 left-0 w-12 h-12 border-t-2 border-l-2 border-gold/40 rounded-tl-xl" />
                    <div className="absolute top-0 right-0 w-12 h-12 border-t-2 border-r-2 border-gold/40 rounded-tr-xl" />
                    <div className="absolute bottom-0 left-0 w-12 h-12 border-b-2 border-l-2 border-gold/40 rounded-bl-xl" />
                    <div className="absolute bottom-0 right-0 w-12 h-12 border-b-2 border-r-2 border-gold/40 rounded-br-xl" />

                    <div className="text-center">
                      <div className="text-gold text-xs tracking-[0.3em] uppercase mb-2">Lord Lombo Academie</div>
                      <h2 className="text-3xl font-bold text-cream mb-1">Certificat de Reussite</h2>
                      <div className="w-16 h-0.5 bg-gradient-to-r from-transparent via-gold to-transparent mx-auto my-4" />

                      <p className="text-cream/40 text-sm mb-2">Ce certificat est decerne a</p>
                      <p className="text-2xl font-bold text-gold mb-4">{user?.firstName} {user?.lastName}</p>

                      <p className="text-cream/40 text-sm mb-1">Pour avoir complete avec succes la formation</p>
                      <p className="text-lg font-semibold text-cream mb-4">{viewCert.courseName}</p>

                      <div className="flex items-center justify-center gap-6 text-cream/30 text-xs mb-6">
                        <span>Date : {formatDate(viewCert.issuedAt)}</span>
                        <span>Duree : {viewCert.hoursCompleted}h</span>
                        {viewCert.grade && <span>Mention : {viewCert.grade}</span>}
                      </div>

                      <div className="flex items-center justify-between mt-8 pt-6 border-t border-cream/[0.06]">
                        <div className="text-left">
                          <div className="text-cream/20 text-[9px] font-mono">{viewCert.certificateId}</div>
                          <div className="text-cream/15 text-[8px] mt-0.5">Hash: {viewCert.verificationHash.slice(0, 16)}...</div>
                        </div>
                        <div className="w-16 h-16 rounded-lg bg-cream/[0.04] flex items-center justify-center">
                          <FaQrcode className="text-cream/20 text-2xl" />
                        </div>
                        <div className="text-right">
                          {viewCert.instructorName && <div className="text-cream/40 text-xs italic">{viewCert.instructorName}</div>}
                          <div className="text-cream/20 text-[10px]">Formateur</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="px-8 pb-8 flex gap-3">
                  <button className="flex-1 py-3 rounded-xl bg-gradient-to-r from-gold to-gold-light text-navy font-semibold text-sm flex items-center justify-center gap-2">
                    <FaDownload className="text-xs" /> Telecharger PDF
                  </button>
                  <button onClick={() => setViewCert(null)} className="px-6 py-3 rounded-xl bg-cream/[0.04] text-cream/50 text-sm font-semibold hover:bg-cream/[0.08] transition-all">Fermer</button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
