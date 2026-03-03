"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { FaCalendarAlt, FaClock, FaArrowRight, FaPlay, FaBookOpen, FaQuoteLeft, FaHeadphones, FaSearch, FaTags, FaYoutube, FaChevronRight } from "react-icons/fa";

const categories = ["Tous", "Predications", "Leadership", "Vie Chretienne", "Temoignages", "Musique"];

const articles = [
  {
    slug: "les-tenebres-de-dieu-comprendre-les-saisons-obscures",
    title: "Les Tenebres de Dieu : comprendre les saisons obscures de votre vie",
    excerpt: "Pourquoi Dieu permet-Il les epreuves ? Dans son ouvrage 'Les Tenebres de Dieu', Lord Lombo explore comment les moments les plus sombres sont souvent les tremplins vers la grandeur divine. Decouvrez les cles pour traverser vos propres tenebres.",
    category: "Vie Chretienne",
    date: "25 Fev 2026",
    readTime: "12 min",
    image: "https://images.unsplash.com/photo-1504052434569-70ad5836ab65?w=800&h=500&fit=crop",
    featured: true,
  },
  {
    slug: "7-piliers-leadership-pastoral-biblique",
    title: "Les 7 piliers du leadership pastoral selon la Bible",
    excerpt: "Le leadership pastoral ne s'improvise pas. Il repose sur des fondements bibliques solides que tout serviteur de Dieu doit maitriser pour conduire efficacement le troupeau.",
    category: "Leadership",
    date: "20 Fev 2026",
    readTime: "8 min",
    image: "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=800&h=500&fit=crop",
    featured: false,
  },
  {
    slug: "comment-emmanuel-a-change-ma-vie",
    title: "Comment le chant 'Emmanuel' a change des millions de vies",
    excerpt: "Retour sur l'histoire extraordinaire derriere le single qui cumule plus de 23 millions de vues. Des temoignages bouleversants de personnes touchees aux quatre coins du monde.",
    category: "Temoignages",
    date: "18 Fev 2026",
    readTime: "10 min",
    image: "https://i.ytimg.com/vi/84Bq-Yw6UxU/maxresdefault.jpg",
    featured: false,
  },
  {
    slug: "puissance-louange-combat-spirituel",
    title: "La puissance de la louange dans le combat spirituel",
    excerpt: "La louange n'est pas seulement un moment musical. C'est une arme puissante dans le combat spirituel. Decouvrez comment utiliser la louange pour renverser les forteresses.",
    category: "Predications",
    date: "15 Fev 2026",
    readTime: "9 min",
    image: "https://images.unsplash.com/photo-1415201364774-f6f0bb35f28f?w=800&h=500&fit=crop",
    featured: false,
  },
  {
    slug: "batir-equipe-ministerielle-efficace",
    title: "Batir une equipe ministerielle efficace : guide pratique",
    excerpt: "Une eglise forte repose sur une equipe soudee. Voici les principes bibliques et les strategies pratiques pour constituer et former une equipe ministerielle qui porte du fruit.",
    category: "Leadership",
    date: "10 Fev 2026",
    readTime: "7 min",
    image: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800&h=500&fit=crop",
    featured: false,
  },
  {
    slug: "de-kinshasa-au-monde-parcours-lord-lombo",
    title: "De Kinshasa au monde : le parcours inspire de Lord Lombo",
    excerpt: "Ne dans une famille chretienne a Kinshasa, Lord Lombo a parcouru un chemin extraordinaire. Retour sur les etapes cles qui ont forge l'homme, le pasteur et l'artiste.",
    category: "Temoignages",
    date: "5 Fev 2026",
    readTime: "15 min",
    image: "https://images.unsplash.com/photo-1489749798305-4fea3ae63d43?w=800&h=500&fit=crop",
    featured: false,
  },
  {
    slug: "ecrire-un-chant-qui-touche-les-coeurs",
    title: "Comment ecrire un chant qui touche les coeurs",
    excerpt: "Lord Lombo partage les secrets de son processus creatif. De l'inspiration divine a l'arrangement musical, decouvrez comment naissent les chants qui marquent les generations.",
    category: "Musique",
    date: "1 Fev 2026",
    readTime: "11 min",
    image: "https://images.unsplash.com/photo-1507838153414-b4b713384a76?w=800&h=500&fit=crop",
    featured: false,
  },
  {
    slug: "gerer-epreuves-avec-foi",
    title: "Gerer les epreuves avec foi : lecons du livre de Job",
    excerpt: "Job a tout perdu avant de tout retrouver au centuple. Son histoire nous enseigne des lecons profondes sur la fidelite de Dieu dans les moments les plus difficiles.",
    category: "Vie Chretienne",
    date: "28 Jan 2026",
    readTime: "8 min",
    image: "https://images.unsplash.com/photo-1504052434569-70ad5836ab65?w=600&h=400&fit=crop",
    featured: false,
  },
];

const sermons = [
  { title: "La puissance de la priere perseverante", ytId: "APYr7GotcMA", duration: "45 min", date: "22 Fev 2026", views: "7.8M" },
  { title: "Emmanuel - Predication & Louange", ytId: "y-Ecb9qGg94", duration: "1h 12 min", date: "15 Fev 2026", views: "7.7M" },
  { title: "Tant que tu donnes un chant - Message", ytId: "Fb_iRuhfdJA", duration: "52 min", date: "8 Fev 2026", views: "19M" },
  { title: "Amoureux de Dieu - Ministere en profondeur", ytId: "g-gYGn1tqUk", duration: "38 min", date: "1 Fev 2026", views: "11M" },
  { title: "Saison - Comprendre les temps de Dieu", ytId: "mpCLxlhgW-0", duration: "41 min", date: "25 Jan 2026", views: "8.9M" },
];

export default function Blog() {
  const [activeCategory, setActiveCategory] = useState("Tous");
  const [searchQuery, setSearchQuery] = useState("");
  const [playingVideo, setPlayingVideo] = useState<string | null>(null);

  const filtered = articles.filter((a) => {
    const matchCat = activeCategory === "Tous" || a.category === activeCategory;
    const matchSearch = a.title.toLowerCase().includes(searchQuery.toLowerCase()) || a.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchSearch;
  });

  const featured = filtered.find((a) => a.featured) || filtered[0];
  const rest = filtered.filter((a) => a !== featured);

  return (
    <>
      {/* Hero */}
      <section className="relative pt-28 pb-16 overflow-hidden hero-gradient">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <span className="inline-block px-4 py-1.5 rounded-full bg-gold/10 border border-gold/20 text-gold text-xs font-medium tracking-wider uppercase mb-6">Blog & Predications</span>
          <h1 className="text-4xl md:text-6xl font-serif font-bold text-cream mb-4">
            Blog & <span className="text-gradient-gold">Predications</span>
          </h1>
          <p className="text-cream/35 max-w-xl mx-auto text-sm mb-8">Articles, sermons et reflexions pour nourrir votre foi et approfondir votre connaissance</p>

          {/* Search */}
          <div className="max-w-lg mx-auto relative">
            <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-cream/20 text-sm" />
            <input
              type="text"
              placeholder="Rechercher un article..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-5 py-3.5 rounded-full bg-cream/[0.04] border border-cream/[0.08] text-cream text-sm focus:border-gold/30 focus:outline-none transition-colors placeholder:text-cream/20"
            />
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-6 px-6 -mt-2">
        <div className="max-w-6xl mx-auto flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-5 py-2 rounded-full text-xs font-medium whitespace-nowrap transition-all ${activeCategory === cat ? "bg-gradient-to-r from-gold to-gold-light text-navy-deep" : "glass-card text-cream/40 hover:text-gold hover:border-gold/20"}`}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      {/* Featured Article */}
      {featured && (
        <section className="py-8 px-6">
          <div className="max-w-6xl mx-auto">
            <Link href={`/blog/${featured.slug}`} className="group grid lg:grid-cols-2 gap-0 rounded-2xl overflow-hidden glass-card hover:border-gold/20 transition-all">
              <div className="relative h-64 lg:h-auto overflow-hidden">
                <Image src={featured.image} alt={featured.title} fill className="object-cover group-hover:scale-105 transition-transform duration-700" sizes="600px" />
                <div className="absolute inset-0 bg-gradient-to-r from-transparent to-dark/60 hidden lg:block" />
                <div className="absolute inset-0 bg-gradient-to-t from-dark/60 to-transparent lg:hidden" />
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 rounded-full bg-gold/90 text-navy-deep text-[10px] font-bold uppercase">A la une</span>
                </div>
              </div>
              <div className="p-8 lg:p-10 flex flex-col justify-center">
                <div className="flex items-center gap-3 mb-4">
                  <span className="px-3 py-1 rounded-full bg-gold/10 text-gold text-[10px] font-medium">{featured.category}</span>
                  <span className="text-cream/20 text-[10px] flex items-center gap-1"><FaClock className="text-[8px]" /> {featured.readTime}</span>
                  <span className="text-cream/20 text-[10px] flex items-center gap-1"><FaCalendarAlt className="text-[8px]" /> {featured.date}</span>
                </div>
                <h2 className="text-2xl font-serif font-bold text-cream mb-3 group-hover:text-gold transition-colors leading-tight">{featured.title}</h2>
                <p className="text-cream/35 text-sm leading-relaxed mb-5">{featured.excerpt}</p>
                <span className="inline-flex items-center gap-2 text-gold text-sm font-medium group-hover:gap-3 transition-all">
                  Lire l&apos;article <FaArrowRight className="text-xs" />
                </span>
              </div>
            </Link>
          </div>
        </section>
      )}

      {/* Articles Grid */}
      <section className="py-10 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-xl font-serif font-bold text-cream mb-6">Articles <span className="text-gradient-gold">recents</span> <span className="text-cream/20 text-sm font-normal ml-2">({rest.length})</span></h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {rest.map((a) => (
              <Link key={a.slug} href={`/blog/${a.slug}`} className="group rounded-2xl overflow-hidden glass-card hover:border-gold/15 transition-all">
                <div className="h-44 relative overflow-hidden">
                  <Image src={a.image} alt={a.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" sizes="400px" />
                  <div className="absolute inset-0 bg-gradient-to-t from-dark/70 via-dark/20 to-transparent" />
                  <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-dark/60 backdrop-blur-sm text-cream/50 text-[10px] flex items-center gap-1">
                    <FaClock className="text-[7px]" /> {a.readTime}
                  </div>
                </div>
                <div className="p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="px-2.5 py-0.5 rounded-full bg-gold/10 text-gold text-[10px] font-medium">{a.category}</span>
                    <span className="text-cream/15 text-[10px]">{a.date}</span>
                  </div>
                  <h3 className="text-cream font-bold text-sm leading-snug group-hover:text-gold transition-colors mb-2">{a.title}</h3>
                  <p className="text-cream/25 text-xs leading-relaxed line-clamp-2">{a.excerpt}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Sermons / Predications Video */}
      <section className="py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl font-serif font-bold text-cream">Predications & <span className="text-gradient-gold">Sermons</span></h2>
            <a href="https://www.youtube.com/@LordLomboOfficial/playlists" target="_blank" rel="noopener" className="flex items-center gap-2 text-cream/30 text-xs hover:text-gold transition-all">
              Voir tout sur YouTube <FaYoutube />
            </a>
          </div>

          {/* Featured sermon */}
          <div className="mb-6 rounded-2xl overflow-hidden glass-card hover:border-gold/15 transition-all">
            {playingVideo === sermons[0].ytId ? (
              <div className="aspect-video">
                <iframe src={`https://www.youtube.com/embed/${sermons[0].ytId}?autoplay=1&rel=0`} allow="autoplay; encrypted-media" allowFullScreen className="w-full h-full" />
              </div>
            ) : (
              <div className="aspect-video relative cursor-pointer group" onClick={() => setPlayingVideo(sermons[0].ytId)}>
                <Image src={`https://i.ytimg.com/vi/${sermons[0].ytId}/maxresdefault.jpg`} alt={sermons[0].title} fill className="object-cover" sizes="1200px" />
                <div className="absolute inset-0 bg-dark/40 group-hover:bg-dark/20 transition-all flex items-center justify-center">
                  <div className="w-20 h-20 rounded-full bg-gold/20 backdrop-blur-sm flex items-center justify-center border border-gold/30 group-hover:scale-110 transition-transform">
                    <FaPlay className="text-gold text-2xl ml-1" />
                  </div>
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-dark to-transparent">
                  <div className="text-cream font-bold text-lg">{sermons[0].title}</div>
                  <div className="text-cream/40 text-xs">{sermons[0].duration} &bull; {sermons[0].views} vues</div>
                </div>
              </div>
            )}
          </div>

          {/* Other sermons list */}
          <div className="space-y-2">
            {sermons.slice(1).map((s) => (
              <div
                key={s.ytId}
                onClick={() => setPlayingVideo(playingVideo === s.ytId ? null : s.ytId)}
                className="flex items-center gap-4 p-4 rounded-xl glass-card hover:border-gold/15 transition-all cursor-pointer group"
              >
                <div className="w-24 h-16 rounded-lg relative overflow-hidden flex-shrink-0">
                  {playingVideo === s.ytId ? (
                    <iframe src={`https://www.youtube.com/embed/${s.ytId}?autoplay=1&rel=0`} allow="autoplay; encrypted-media" className="w-full h-full" />
                  ) : (
                    <>
                      <Image src={`https://i.ytimg.com/vi/${s.ytId}/hqdefault.jpg`} alt={s.title} fill className="object-cover" sizes="100px" />
                      <div className="absolute inset-0 bg-dark/30 flex items-center justify-center">
                        <FaPlay className="text-gold text-xs" />
                      </div>
                    </>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-cream font-semibold text-sm truncate group-hover:text-gold transition-colors">{s.title}</h3>
                  <div className="text-cream/20 text-xs mt-0.5">{s.date} &bull; {s.views} vues</div>
                </div>
                <span className="text-cream/15 text-xs flex-shrink-0 hidden sm:block">{s.duration}</span>
                <FaChevronRight className="text-cream/10 text-xs flex-shrink-0 group-hover:text-gold transition-colors" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Quote Banner */}
      <section className="py-16 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="glass-card rounded-2xl p-10 md:p-14 relative">
            <FaQuoteLeft className="text-gold/10 text-5xl mb-6 mx-auto" />
            <blockquote className="text-cream/60 text-lg md:text-xl font-serif italic leading-relaxed mb-6">
              &ldquo;Les tenebres ne sont pas l&apos;absence de Dieu, mais le lieu secret ou Il forge les grands leaders. C&apos;est dans l&apos;obscurite que Dieu prepare la lumiere qui eclairera les nations.&rdquo;
            </blockquote>
            <div className="text-gold font-bold text-sm">Lord Lombo</div>
            <div className="text-cream/20 text-xs">Les Tenebres de Dieu, Chapitre 1</div>
          </div>
        </div>
      </section>
    </>
  );
}
