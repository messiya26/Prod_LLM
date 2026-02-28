"use client";

import { motion } from "framer-motion";
import { AnimatedSection, Badge, Button } from "@/components/ui";
import { useI18n } from "@/context/i18n-context";
import { FaUsers, FaComments, FaHandshake, FaCalendarAlt, FaGlobe, FaStar, FaHeart, FaArrowRight, FaQuoteLeft, FaMapMarkerAlt } from "react-icons/fa";

const alumni = [
  { name: "Pasteur Moise K.", role: "Diplome Leadership Pastoral", location: "Kinshasa, RDC", promo: "2024", testimonial: "Cette formation a transforme ma vision du ministere. J'ai appris a diriger avec sagesse et compassion." },
  { name: "Ev. Grace Mbala", role: "Diplome Direction Chorale", location: "Brazzaville, Congo", promo: "2024", testimonial: "Les techniques apprises m'ont permis de structurer mon equipe de louange de maniere professionnelle." },
  { name: "Diacre Jean Tshimanga", role: "Diplome Gestion Ecclesiale", location: "Lubumbashi, RDC", promo: "2025", testimonial: "Une experience enrichissante qui m'a donne les outils pour gerer efficacement notre communaute." },
  { name: "Soeur Aline Ngoy", role: "Diplome Predication", location: "Mbuji-Mayi, RDC", promo: "2025", testimonial: "Le mentorat personnalise a fait toute la difference dans mon parcours ministeriel." },
];

const events = [
  { title: "Conference Annuelle des Leaders", date: "15 Mars 2026", location: "Kinshasa", type: "Presentiel", spots: 200 },
  { title: "Webinaire : Innovation Ministerielle", date: "22 Mars 2026", location: "En ligne", type: "En ligne", spots: 500 },
  { title: "Retraite Spirituelle des Diplomes", date: "5 Avril 2026", location: "Matadi", type: "Presentiel", spots: 50 },
  { title: "Forum Intercommunautaire", date: "20 Avril 2026", location: "Kinshasa", type: "Hybride", spots: 300 },
];

const stats = [
  { value: "2,500+", label: "Membres actifs", icon: <FaUsers /> },
  { value: "15", label: "Pays representes", icon: <FaGlobe /> },
  { value: "98%", label: "Taux de satisfaction", icon: <FaStar /> },
  { value: "500+", label: "Diplomes", icon: <FaHandshake /> },
];

const discussions = [
  { title: "Comment integrer la technologie dans le ministere ?", replies: 34, lastActivity: "Il y a 2h", category: "Innovation" },
  { title: "Partage d'experience : gerer une equipe multiculturelle", replies: 21, lastActivity: "Il y a 5h", category: "Leadership" },
  { title: "Ressources pour la formation des jeunes leaders", replies: 45, lastActivity: "Il y a 1j", category: "Formation" },
  { title: "Temoignages de transformation ministerielle", replies: 67, lastActivity: "Il y a 2j", category: "Temoignages" },
  { title: "Conseils pour la predication en contexte urbain", replies: 18, lastActivity: "Il y a 3j", category: "Predication" },
];

export default function Communaute() {
  const { locale } = useI18n();
  const fr = locale === "fr";

  return (
    <>
      <section className="relative py-16 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-gold/[0.03] to-transparent" />
        <div className="max-w-4xl mx-auto px-6 relative text-center">
          <Badge variant="gold" className="mb-6">{fr ? "Communaute" : "Community"}</Badge>
          <h1 className="text-4xl md:text-5xl font-bold text-cream mb-4">
            {fr ? "Rejoignez notre " : "Join our "}
            <span className="text-gradient-gold">{fr ? "communaute" : "community"}</span>
          </h1>
          <p className="text-cream/45 max-w-xl mx-auto">{fr ? "Un reseau de leaders, pasteurs et serviteurs de Dieu unis dans la formation et l'excellence" : "A network of leaders, pastors and servants of God united in training and excellence"}</p>
        </div>
      </section>

      {/* Stats */}
      <section className="pb-14 px-6">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((s, i) => (
            <AnimatedSection key={i} delay={i * 0.05}>
              <div className="text-center p-6 rounded-2xl bg-cream/[0.02] border border-cream/[0.06]">
                <div className="w-10 h-10 rounded-xl bg-gold/10 flex items-center justify-center mx-auto mb-3 text-gold">{s.icon}</div>
                <div className="text-2xl font-bold text-gold mb-1">{s.value}</div>
                <div className="text-cream/35 text-xs">{s.label}</div>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </section>

      {/* Forum Discussions */}
      <section className="pb-14 px-6">
        <div className="max-w-6xl mx-auto">
          <AnimatedSection>
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-400/10 flex items-center justify-center"><FaComments className="text-blue-400" /></div>
                <h2 className="text-2xl font-bold text-cream">{fr ? "Discussions populaires" : "Popular Discussions"}</h2>
              </div>
              <Button variant="outline" size="sm">{fr ? "Voir tout" : "See all"} <FaArrowRight className="ml-2 text-[10px]" /></Button>
            </div>
          </AnimatedSection>
          <div className="space-y-3">
            {discussions.map((d, i) => (
              <AnimatedSection key={i} delay={i * 0.04}>
                <div className="flex items-center gap-5 p-5 rounded-2xl bg-cream/[0.02] border border-cream/[0.06] hover:border-blue-400/20 transition-all cursor-pointer group">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-cream font-semibold text-sm truncate group-hover:text-blue-300 transition-colors">{d.title}</h3>
                    <div className="flex items-center gap-3 mt-1.5">
                      <span className="text-gold text-[10px] font-medium px-2 py-0.5 rounded-full bg-gold/10">{d.category}</span>
                      <span className="text-cream/25 text-[10px]">{d.replies} {fr ? "reponses" : "replies"}</span>
                      <span className="text-cream/20 text-[10px]">{d.lastActivity}</span>
                    </div>
                  </div>
                  <FaArrowRight className="text-cream/10 group-hover:text-blue-400 transition-colors text-xs" />
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Alumni */}
      <section className="pb-14 px-6">
        <div className="max-w-6xl mx-auto">
          <AnimatedSection>
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 rounded-xl bg-emerald-400/10 flex items-center justify-center"><FaHandshake className="text-emerald-400" /></div>
              <h2 className="text-2xl font-bold text-cream">{fr ? "Reseau des diplomes" : "Alumni Network"}</h2>
            </div>
          </AnimatedSection>
          <div className="grid md:grid-cols-2 gap-5">
            {alumni.map((a, i) => (
              <AnimatedSection key={i} delay={i * 0.05}>
                <div className="p-6 rounded-2xl bg-cream/[0.02] border border-cream/[0.06] hover:border-emerald-400/15 transition-all">
                  <FaQuoteLeft className="text-gold/15 text-xl mb-3" />
                  <p className="text-cream/50 text-sm italic leading-relaxed mb-4">&ldquo;{a.testimonial}&rdquo;</p>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-cream font-semibold text-sm">{a.name}</div>
                      <div className="text-gold text-xs">{a.role}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-cream/25 text-[10px] flex items-center gap-1 justify-end"><FaMapMarkerAlt className="text-[8px]" />{a.location}</div>
                      <div className="text-cream/15 text-[10px]">Promo {a.promo}</div>
                    </div>
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Events */}
      <section className="pb-14 px-6">
        <div className="max-w-6xl mx-auto">
          <AnimatedSection>
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 rounded-xl bg-purple-400/10 flex items-center justify-center"><FaCalendarAlt className="text-purple-400" /></div>
              <h2 className="text-2xl font-bold text-cream">{fr ? "Evenements a venir" : "Upcoming Events"}</h2>
            </div>
          </AnimatedSection>
          <div className="grid md:grid-cols-2 gap-5">
            {events.map((ev, i) => (
              <AnimatedSection key={i} delay={i * 0.05}>
                <div className="p-6 rounded-2xl bg-cream/[0.02] border border-cream/[0.06] hover:border-purple-400/15 transition-all group">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-cream font-semibold text-sm group-hover:text-purple-300 transition-colors">{ev.title}</h3>
                      <div className="flex items-center gap-3 mt-2">
                        <span className="text-cream/30 text-xs flex items-center gap-1"><FaCalendarAlt className="text-[9px]" />{ev.date}</span>
                        <span className="text-cream/30 text-xs flex items-center gap-1"><FaMapMarkerAlt className="text-[9px]" />{ev.location}</span>
                      </div>
                    </div>
                    <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${ev.type === "En ligne" ? "bg-blue-400/10 text-blue-400" : ev.type === "Hybride" ? "bg-purple-400/10 text-purple-400" : "bg-emerald-400/10 text-emerald-400"}`}>{ev.type}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-cream/20 text-xs">{ev.spots} {fr ? "places" : "spots"}</span>
                    <Button variant="outline" size="sm">{fr ? "S'inscrire" : "Register"}</Button>
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="pb-20 px-6">
        <div className="max-w-3xl mx-auto">
          <AnimatedSection>
            <div className="text-center p-10 rounded-2xl bg-gradient-to-br from-gold/10 to-gold/5 border border-gold/10">
              <FaHeart className="text-gold text-3xl mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-cream mb-3">{fr ? "Faites partie de l'aventure" : "Be Part of the Journey"}</h2>
              <p className="text-cream/40 text-sm mb-6 max-w-md mx-auto">{fr ? "Rejoignez une communaute de leaders passionnes qui transforment le monde a travers le ministere" : "Join a community of passionate leaders transforming the world through ministry"}</p>
              <Button variant="primary">{fr ? "Rejoindre la communaute" : "Join the Community"} <FaArrowRight className="ml-2 text-xs" /></Button>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </>
  );
}
