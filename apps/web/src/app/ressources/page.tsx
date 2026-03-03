"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import Link from "next/link";
import { AnimatedSection, Badge, Button } from "@/components/ui";
import { useI18n } from "@/context/i18n-context";
import { FaNewspaper, FaPodcast, FaVideo, FaDownload, FaPlay, FaClock, FaCalendarAlt, FaArrowRight, FaHeadphones, FaBookOpen } from "react-icons/fa";

const blogPosts = [
  { title: "Les 7 piliers du leadership pastoral selon la Bible", titleEn: "7 Pillars of Pastoral Leadership", category: "Leadership", date: "25 Fev 2026", readTime: "8 min", image: "https://images.unsplash.com/photo-1504052434569-70ad5836ab65?w=600&h=300&fit=crop" },
  { title: "Comment structurer une equipe ministerielle efficace", titleEn: "How to Build an Effective Ministry Team", category: "Gestion", date: "20 Fev 2026", readTime: "6 min", image: "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=600&h=300&fit=crop" },
  { title: "L'art de la predication : captiver votre auditoire", titleEn: "The Art of Preaching", category: "Predication", date: "15 Fev 2026", readTime: "10 min", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=300&fit=crop" },
  { title: "Gerer les conflits dans l'eglise avec sagesse", titleEn: "Managing Church Conflicts with Wisdom", category: "Relations", date: "10 Fev 2026", readTime: "7 min", image: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=600&h=300&fit=crop" },
  { title: "Developper une vision claire pour votre ministere", titleEn: "Developing a Clear Ministry Vision", category: "Vision", date: "5 Fev 2026", readTime: "5 min", image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=600&h=300&fit=crop" },
  { title: "Le mentorat spirituel : guide pratique", titleEn: "Spiritual Mentorship: A Practical Guide", category: "Formation", date: "1 Fev 2026", readTime: "12 min", image: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=600&h=300&fit=crop" },
];

const podcasts = [
  { title: "Episode 12 - La puissance de l'adoration", guest: "Pasteur Moise", duration: "45 min", date: "22 Fev 2026" },
  { title: "Episode 11 - Batir une communaute de foi", guest: "Ev. Sarah Ngoy", duration: "38 min", date: "15 Fev 2026" },
  { title: "Episode 10 - Le leadership serviteur", guest: "Dr. Patrick M.", duration: "52 min", date: "8 Fev 2026" },
  { title: "Episode 9 - La priere comme fondement", guest: "Past. Grace K.", duration: "41 min", date: "1 Fev 2026" },
];

const videos = [
  { title: "Masterclass : Introduction au leadership pastoral", views: "2.4k", duration: "1h30" },
  { title: "Webinaire : La gestion financiere de l'eglise", views: "1.8k", duration: "55 min" },
  { title: "Conference : L'impact social de l'eglise", views: "3.1k", duration: "2h" },
];

const guides = [
  { title: "Guide complet du leadership pastoral", pages: 45, format: "PDF" },
  { title: "Manuel de formation pour chantres", pages: 32, format: "PDF" },
  { title: "Kit de demarrage ministeriel", pages: 28, format: "PDF" },
  { title: "Calendrier liturgique 2026", pages: 12, format: "PDF" },
];

export default function Ressources() {
  const { locale } = useI18n();

  return (
    <>
      <section className="relative py-16 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-gold/[0.03] to-transparent" />
        <div className="max-w-4xl mx-auto px-6 relative text-center">
          <Badge variant="gold" className="mb-6">{locale === "fr" ? "Ressources" : "Resources"}</Badge>
          <h1 className="text-4xl md:text-5xl font-bold text-cream mb-4">
            {locale === "fr" ? "Centre de " : "Resource "}
            <span className="text-gradient-gold">{locale === "fr" ? "ressources" : "Center"}</span>
          </h1>
          <p className="text-cream/45 max-w-xl mx-auto">{locale === "fr" ? "Articles, podcasts, videos et guides pour approfondir votre formation" : "Articles, podcasts, videos and guides to deepen your training"}</p>
        </div>
      </section>

      {/* Blog */}
      <section className="pb-16 px-6">
        <div className="max-w-6xl mx-auto">
          <AnimatedSection>
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 rounded-xl bg-blue-400/10 flex items-center justify-center"><FaNewspaper className="text-blue-400" /></div>
              <h2 className="text-2xl font-bold text-cream">{locale === "fr" ? "Articles & Blog" : "Articles & Blog"}</h2>
            </div>
          </AnimatedSection>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {blogPosts.map((post, i) => (
              <AnimatedSection key={i} delay={i * 0.05}>
                <div className="group rounded-2xl bg-cream/[0.02] border border-cream/[0.06] overflow-hidden hover:border-gold/20 transition-all">
                  <div className="h-44 relative overflow-hidden">
                    <Image src={post.image} alt={post.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" sizes="400px" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0b1829] via-transparent to-transparent" />
                    <span className="absolute top-3 left-3 text-[10px] font-bold px-2.5 py-1 rounded-full bg-gold text-navy">{post.category}</span>
                  </div>
                  <div className="p-5">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-cream/25 text-[10px] flex items-center gap-1"><FaClock className="text-[8px]" />{post.readTime}</span>
                    </div>
                    <h3 className="text-cream font-semibold text-sm leading-snug group-hover:text-gold transition-colors mb-2">{post.title}</h3>
                    <div className="text-cream/25 text-xs flex items-center gap-1"><FaCalendarAlt className="text-[8px]" />{post.date}</div>
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Podcasts */}
      <section className="pb-16 px-6">
        <div className="max-w-6xl mx-auto">
          <AnimatedSection>
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 rounded-xl bg-purple-400/10 flex items-center justify-center"><FaPodcast className="text-purple-400" /></div>
              <div>
                <h2 className="text-2xl font-bold text-cream">Podcasts</h2>
                <span className="text-gold text-[10px] font-medium px-2 py-0.5 rounded-full bg-gold/10 ml-2">{locale === "fr" ? "Nouveau" : "New"}</span>
              </div>
            </div>
          </AnimatedSection>
          <div className="space-y-3">
            {podcasts.map((ep, i) => (
              <AnimatedSection key={i} delay={i * 0.05}>
                <div className="flex items-center gap-5 p-5 rounded-2xl bg-cream/[0.02] border border-cream/[0.06] hover:border-purple-400/20 transition-all group cursor-pointer">
                  <div className="w-12 h-12 rounded-xl bg-purple-400/10 flex items-center justify-center flex-shrink-0 group-hover:bg-purple-400/20 transition-all">
                    <FaHeadphones className="text-purple-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-cream font-semibold text-sm truncate group-hover:text-purple-300 transition-colors">{ep.title}</h3>
                    <p className="text-cream/30 text-xs mt-0.5">{ep.guest} &bull; {ep.date}</p>
                  </div>
                  <div className="flex items-center gap-3 flex-shrink-0">
                    <span className="text-cream/20 text-xs">{ep.duration}</span>
                    <div className="w-8 h-8 rounded-full bg-purple-400/10 flex items-center justify-center">
                      <FaPlay className="text-purple-400 text-[10px] ml-0.5" />
                    </div>
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Videos */}
      <section className="pb-16 px-6">
        <div className="max-w-6xl mx-auto">
          <AnimatedSection>
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 rounded-xl bg-red-400/10 flex items-center justify-center"><FaVideo className="text-red-400" /></div>
              <h2 className="text-2xl font-bold text-cream">{locale === "fr" ? "Videos & Masterclass" : "Videos & Masterclass"}</h2>
            </div>
          </AnimatedSection>
          <div className="grid md:grid-cols-3 gap-6">
            {videos.map((v, i) => (
              <AnimatedSection key={i} delay={i * 0.05}>
                <div className="group rounded-2xl bg-cream/[0.02] border border-cream/[0.06] overflow-hidden hover:border-red-400/20 transition-all cursor-pointer">
                  <div className="h-44 bg-gradient-to-br from-red-500/10 to-cream/5 flex items-center justify-center relative">
                    <div className="w-14 h-14 rounded-full bg-red-400/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <FaPlay className="text-red-400 text-lg ml-1" />
                    </div>
                    <span className="absolute bottom-3 right-3 text-white/60 text-[10px] bg-black/40 px-2 py-0.5 rounded">{v.duration}</span>
                  </div>
                  <div className="p-5">
                    <h3 className="text-cream font-semibold text-sm group-hover:text-red-300 transition-colors">{v.title}</h3>
                    <p className="text-cream/25 text-xs mt-2">{v.views} {locale === "fr" ? "vues" : "views"}</p>
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Guides */}
      <section className="pb-20 px-6">
        <div className="max-w-6xl mx-auto">
          <AnimatedSection>
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 rounded-xl bg-emerald-400/10 flex items-center justify-center"><FaDownload className="text-emerald-400" /></div>
              <h2 className="text-2xl font-bold text-cream">{locale === "fr" ? "Guides & Documents" : "Guides & Documents"}</h2>
            </div>
          </AnimatedSection>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {guides.map((g, i) => (
              <AnimatedSection key={i} delay={i * 0.05}>
                <div className="p-5 rounded-2xl bg-cream/[0.02] border border-cream/[0.06] hover:border-emerald-400/20 transition-all group cursor-pointer">
                  <div className="w-10 h-10 rounded-xl bg-emerald-400/10 flex items-center justify-center mb-4 group-hover:bg-emerald-400/20 transition-all">
                    <FaDownload className="text-emerald-400 text-sm" />
                  </div>
                  <h3 className="text-cream font-semibold text-sm mb-2 group-hover:text-emerald-300 transition-colors">{g.title}</h3>
                  <p className="text-cream/25 text-xs">{g.pages} pages &bull; {g.format}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
