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

  const handleDownloadPDF = (cert: Certificate) => {
    const w = window.open("", "_blank");
    if (!w) return;
    const name = user ? `${user.firstName} ${user.lastName}` : "Apprenant";
    w.document.write(`<!DOCTYPE html><html><head><meta charset="utf-8"><title>Certificat ${cert.certificateId}</title>
<style>
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&family=Inter:wght@300;400;600&family=Dancing+Script:wght@700&display=swap');
*{margin:0;padding:0;box-sizing:border-box}
body{background:#0f0f1a;display:flex;align-items:center;justify-content:center;min-height:100vh;font-family:'Inter',sans-serif}
.cert{width:900px;background:linear-gradient(145deg,#0f0f1a,#1a1a2e);border-radius:20px;padding:60px;position:relative;overflow:hidden}
.cert::before{content:'';position:absolute;inset:20px;border:2px solid rgba(212,175,55,0.25);border-radius:14px;pointer-events:none}
.corner{position:absolute;width:50px;height:50px;border-color:rgba(212,175,55,0.5);border-style:solid;border-width:0}
.tl{top:20px;left:20px;border-top-width:3px;border-left-width:3px;border-top-left-radius:14px}
.tr{top:20px;right:20px;border-top-width:3px;border-right-width:3px;border-top-right-radius:14px}
.bl{bottom:20px;left:20px;border-bottom-width:3px;border-left-width:3px;border-bottom-left-radius:14px}
.br{bottom:20px;right:20px;border-bottom-width:3px;border-right-width:3px;border-bottom-right-radius:14px}
.logo-container{display:flex;align-items:center;justify-content:center;gap:12px;margin-bottom:16px}
.logo-icon{width:48px;height:48px;border-radius:50%;background:linear-gradient(135deg,#d4af37,#f5e6a3);display:flex;align-items:center;justify-content:center;font-family:'Playfair Display',serif;font-size:20px;font-weight:700;color:#0f0f1a}
.logo-text{color:rgba(212,175,55,0.9);font-size:11px;letter-spacing:6px;text-transform:uppercase;font-weight:600}
.logo-sub{color:rgba(212,175,55,0.5);font-size:9px;letter-spacing:4px;text-transform:uppercase;margin-top:2px}
h1{font-family:'Playfair Display',serif;color:#f5f5f5;font-size:36px;margin-bottom:4px}
.line{width:80px;height:2px;background:linear-gradient(90deg,transparent,#d4af37,transparent);margin:20px auto}
.sub{color:rgba(245,245,245,0.35);font-size:14px;margin-bottom:6px;font-weight:300}
.name{font-family:'Playfair Display',serif;color:#d4af37;font-size:28px;font-weight:700;margin:12px 0 20px}
.course{color:#f5f5f5;font-size:18px;font-weight:600;margin-bottom:20px}
.meta{display:flex;gap:30px;justify-content:center;color:rgba(245,245,245,0.3);font-size:12px;margin:20px 0 30px}
.footer{display:flex;justify-content:space-between;align-items:end;border-top:1px solid rgba(245,245,245,0.06);padding-top:20px;margin-top:30px}
.mono{font-family:monospace;color:rgba(245,245,245,0.15);font-size:9px}
.sig-container{text-align:right}
.sig-name{font-family:'Dancing Script',cursive;color:#d4af37;font-size:26px;margin-bottom:2px}
.sig-title{color:rgba(245,245,245,0.3);font-size:10px;font-style:normal}
.sig-org{color:rgba(245,245,245,0.2);font-size:9px;margin-top:1px}
.seal{width:70px;height:70px;border-radius:12px;background:rgba(212,175,55,0.08);display:flex;align-items:center;justify-content:center;border:1px solid rgba(212,175,55,0.15)}
.seal svg{width:36px;height:36px;fill:rgba(212,175,55,0.3)}
.grade{display:inline-block;padding:4px 14px;border-radius:20px;background:rgba(212,175,55,0.12);color:#d4af37;font-size:12px;font-weight:600;margin-bottom:16px}
@media print{body{background:#0f0f1a}@page{size:landscape;margin:0}}
</style></head><body>
<div class="cert">
<div class="corner tl"></div><div class="corner tr"></div><div class="corner bl"></div><div class="corner br"></div>
<div style="text-align:center">
<div class="logo-container">
<div class="logo-icon">LLA</div>
<div><div class="logo-text">Lord Lombo Academie</div><div class="logo-sub">Excellence & Formation</div></div>
</div>
<h1>Certificat de Reussite</h1>
<div class="line"></div>
<p class="sub">Ce certificat est decerne a</p>
<p class="name">${name}</p>
<p class="sub">Pour avoir complete avec succes la formation</p>
<p class="course">${cert.courseName}</p>
${cert.grade ? `<span class="grade">${cert.grade}</span>` : ""}
<div class="meta">
<span>Date : ${formatDate(cert.issuedAt)}</span>
<span>Duree : ${cert.hoursCompleted}h de formation</span>
<span>ID : ${cert.certificateId}</span>
</div>
</div>
<div class="footer">
<div><div class="mono">${cert.certificateId}</div><div class="mono" style="margin-top:3px">SHA256: ${cert.verificationHash.slice(0, 24)}...</div></div>
<div class="seal"><svg viewBox="0 0 24 24"><path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/></svg></div>
<div class="sig-container"><div class="sig-name">Lord Lombo</div><div class="sig-title">Fondateur & Visionnaire</div><div class="sig-org">Lord Lombo Ministries</div></div>
</div>
</div>
</body></html>`);
    w.document.close();
    setTimeout(() => { w.print(); }, 500);
  };

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
                  <button onClick={() => handleDownloadPDF(cert)} className="flex-1 py-2.5 rounded-xl bg-cream/[0.04] text-cream/50 text-xs font-semibold hover:bg-cream/[0.08] transition-all flex items-center justify-center gap-2">
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
                      <div className="flex items-center justify-center gap-3 mb-4">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-gold to-gold-light flex items-center justify-center text-navy font-bold text-lg">LLA</div>
                        <div>
                          <div className="text-gold text-xs tracking-[0.3em] uppercase font-semibold">Lord Lombo Academie</div>
                          <div className="text-gold/40 text-[9px] tracking-[0.2em] uppercase">Excellence & Formation</div>
                        </div>
                      </div>
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
                          <div className="text-gold text-2xl italic" style={{ fontFamily: "'Dancing Script', cursive" }}>Lord Lombo</div>
                          <div className="text-cream/30 text-[10px]">Fondateur & Visionnaire</div>
                          <div className="text-cream/20 text-[9px]">Lord Lombo Ministries</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="px-8 pb-8 flex gap-3">
                  <button onClick={() => handleDownloadPDF(viewCert)} className="flex-1 py-3 rounded-xl bg-gradient-to-r from-gold to-gold-light text-navy font-semibold text-sm flex items-center justify-center gap-2">
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
