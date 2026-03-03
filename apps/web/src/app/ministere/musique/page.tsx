"use client";

import { useState } from "react";
import Image from "next/image";
import { FaPlay, FaPause, FaSpotify, FaYoutube, FaDownload, FaExternalLinkAlt } from "react-icons/fa";

const albums = [
  {
    title: "IMMANOUEL", year: "2017", type: "Album",
    image: "https://i.ytimg.com/vi/84Bq-Yw6UxU/hqdefault.jpg",
    spotifyUrl: "https://open.spotify.com/album/3HOkd1Z2CL8KYov3sr3YXr",
    tracks: [
      { title: "Emmanuel", feat: "ft. Sandra Mbuyi & Gamaliel Lombo", ytId: "84Bq-Yw6UxU", views: "23M" },
      { title: "Yahweh Loba", feat: "", ytId: "APYr7GotcMA", views: "7.8M" },
      { title: "Cha-Pop", feat: "", ytId: "gKeOVEyAprY", views: "4.4M" },
      { title: "Lo-Pop", feat: "ft. Kris Kay", ytId: "WU9VQbXSldw", views: "500K" },
      { title: "Elohim El Shaddai", feat: "ft. Sandra Mbuyi", ytId: "CoctcHNsLxM", views: "1.2M" },
      { title: "Melo-Pop", feat: "ft. Ruth Pala", ytId: "f1SCO90cV4g", views: "316K" },
      { title: "Liziba", feat: "", ytId: "", views: "" },
      { title: "Medley", feat: "", ytId: "", views: "" },
    ],
    desc: "L'album qui a propulse Lord Lombo sur la scene internationale. Le single 'Emmanuel' cumule plus de 23 millions de vues sur YouTube.",
  },
  {
    title: "Extr'aime", year: "2020", type: "Album",
    image: "https://i.ytimg.com/vi/g-gYGn1tqUk/hqdefault.jpg",
    spotifyUrl: "https://open.spotify.com/album/0CKfqBaUtxTV4Z8o2CVkrx",
    tracks: [
      { title: "Amoureux", feat: "", ytId: "g-gYGn1tqUk", views: "11M" },
      { title: "Saison", feat: "", ytId: "mpCLxlhgW-0", views: "8.9M" },
      { title: "Fidele", feat: "ft. Teddy Diso", ytId: "", views: "1.3M" },
      { title: "Ton nom", feat: "", ytId: "", views: "384K" },
      { title: "Oza moto te", feat: "ft. Gamaliel Lombo", ytId: "", views: "" },
      { title: "Bolamu", feat: "", ytId: "", views: "" },
      { title: "Mille Morts", feat: "", ytId: "", views: "" },
      { title: "Bilaka", feat: "", ytId: "", views: "" },
    ],
    desc: "Exploration profonde des dimensions de l'amour divin. 'Amoureux' et 'Saison' cumulent pres de 20 millions de vues.",
  },
  {
    title: "C.H.A", year: "2023", type: "Album",
    image: "https://i.ytimg.com/vi/Fb_iRuhfdJA/hqdefault.jpg",
    spotifyUrl: "",
    tracks: [
      { title: "Tant que tu donnes un chant", feat: "ft. Rachel Anyeme", ytId: "Fb_iRuhfdJA", views: "19M" },
      { title: "DETERMINE", feat: "ft. Gamaliel Lombo & Miche Akele", ytId: "", views: "373K" },
      { title: "Elohim El Shaddai (Maajabu)", feat: "", ytId: "PunVtU4x-8I", views: "" },
      { title: "Molongi", feat: "", ytId: "", views: "" },
      { title: "Celebrons", feat: "", ytId: "", views: "" },
      { title: "Hebron", feat: "", ytId: "", views: "" },
    ],
    desc: "'Celebrons Hebron Aujourd'hui' - 'Tant que tu donnes un chant' est devenu un hymne mondial avec 19 millions de vues.",
  },
];

const topVideos = [
  { title: "Emmanuel", feat: "ft. Sandra Mbuyi & Gamaliel Lombo", ytId: "84Bq-Yw6UxU", views: "23M", year: "2017" },
  { title: "Tant que tu donnes un chant", feat: "ft. Rachel Anyeme", ytId: "Fb_iRuhfdJA", views: "19M", year: "2018" },
  { title: "Amoureux", feat: "Clip Officiel", ytId: "g-gYGn1tqUk", views: "11M", year: "2019" },
  { title: "Saison", feat: "Images du mariage", ytId: "mpCLxlhgW-0", views: "8.9M", year: "2020" },
  { title: "Yahweh Loba", feat: "", ytId: "APYr7GotcMA", views: "7.8M", year: "2017" },
  { title: "Emmanuel (Concert Showbuzz)", feat: "Live", ytId: "y-Ecb9qGg94", views: "7.7M", year: "2018" },
  { title: "Medaille", feat: "Clip Officiel", ytId: "0GZjMRYZqe8", views: "3.8M", year: "2025" },
  { title: "Miel", feat: "Clip Officiel", ytId: "_r_oiiEns-A", views: "3M", year: "2024" },
];

export default function Musique() {
  const [playingVideo, setPlayingVideo] = useState<string | null>(null);

  return (
    <>
      <section className="relative pt-28 pb-16 overflow-hidden hero-gradient">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <span className="inline-block px-4 py-1.5 rounded-full bg-gold/10 border border-gold/20 text-gold text-xs font-medium tracking-wider uppercase mb-6">Discographie</span>
          <h1 className="text-4xl md:text-6xl font-serif font-bold text-cream mb-4">
            Musique & <span className="text-gradient-gold">Albums</span>
          </h1>
          <p className="text-cream/35 max-w-xl mx-auto text-sm mb-8">Des chants qui portent l&apos;onction, guerissent les coeurs et elevent les ames vers le Tres-Haut</p>
          <div className="flex items-center justify-center gap-4">
            <a href="https://open.spotify.com/artist/7LYWtUyWFb2GIE5sjigMvX" target="_blank" rel="noopener" className="flex items-center gap-2 px-6 py-3 rounded-full bg-[#1DB954]/10 border border-[#1DB954]/20 text-[#1DB954] text-sm hover:bg-[#1DB954]/20 transition-all">
              <FaSpotify /> Spotify
            </a>
            <a href="https://www.youtube.com/@LordLomboOfficial" target="_blank" rel="noopener" className="flex items-center gap-2 px-6 py-3 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-sm hover:bg-red-500/20 transition-all">
              <FaYoutube /> YouTube
            </a>
            <a href="https://music.apple.com/us/artist/lord-lombo/1273494570" target="_blank" rel="noopener" className="flex items-center gap-2 px-6 py-3 rounded-full bg-pink-500/10 border border-pink-500/20 text-pink-400 text-sm hover:bg-pink-500/20 transition-all">
              Apple Music
            </a>
          </div>
        </div>
      </section>

      {/* TOP VIDEOS - YouTube Embeds */}
      <section className="py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-serif font-bold text-cream mb-2">Videos <span className="text-gradient-gold">Populaires</span></h2>
          <p className="text-cream/25 text-sm mb-8">Plus de 80 millions de vues cumulees</p>

          <div className="grid md:grid-cols-2 gap-6 mb-6">
            {topVideos.slice(0, 2).map((v) => (
              <div key={v.ytId} className="rounded-2xl overflow-hidden glass-card hover:border-gold/20 transition-all">
                {playingVideo === v.ytId ? (
                  <div className="aspect-video">
                    <iframe
                      src={`https://www.youtube.com/embed/${v.ytId}?autoplay=1&rel=0`}
                      allow="autoplay; encrypted-media"
                      allowFullScreen
                      className="w-full h-full"
                    />
                  </div>
                ) : (
                  <div className="aspect-video relative cursor-pointer group" onClick={() => setPlayingVideo(v.ytId)}>
                    <Image src={`https://i.ytimg.com/vi/${v.ytId}/maxresdefault.jpg`} alt={v.title} fill className="object-cover" sizes="600px" />
                    <div className="absolute inset-0 bg-dark/40 group-hover:bg-dark/20 transition-all flex items-center justify-center">
                      <div className="w-16 h-16 rounded-full bg-gold/20 backdrop-blur-sm flex items-center justify-center border border-gold/30 group-hover:scale-110 transition-transform">
                        <FaPlay className="text-gold text-xl ml-1" />
                      </div>
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-dark to-transparent">
                      <div className="text-cream font-bold text-sm">{v.title}</div>
                      <div className="text-cream/40 text-xs">{v.feat} &bull; {v.views} vues</div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            {topVideos.slice(2).map((v) => (
              <div key={v.ytId} className="rounded-xl overflow-hidden glass-card hover:border-gold/15 transition-all">
                {playingVideo === v.ytId ? (
                  <div className="aspect-video">
                    <iframe
                      src={`https://www.youtube.com/embed/${v.ytId}?autoplay=1&rel=0`}
                      allow="autoplay; encrypted-media"
                      allowFullScreen
                      className="w-full h-full"
                    />
                  </div>
                ) : (
                  <div className="aspect-video relative cursor-pointer group" onClick={() => setPlayingVideo(v.ytId)}>
                    <Image src={`https://i.ytimg.com/vi/${v.ytId}/hqdefault.jpg`} alt={v.title} fill className="object-cover" sizes="400px" />
                    <div className="absolute inset-0 bg-dark/40 group-hover:bg-dark/20 transition-all flex items-center justify-center">
                      <div className="w-12 h-12 rounded-full bg-gold/20 backdrop-blur-sm flex items-center justify-center border border-gold/30 group-hover:scale-110 transition-transform">
                        <FaPlay className="text-gold ml-0.5" />
                      </div>
                    </div>
                    <div className="absolute top-3 right-3 px-2 py-0.5 rounded bg-dark/60 backdrop-blur-sm text-cream/60 text-[10px]">{v.views} vues</div>
                  </div>
                )}
                <div className="p-3">
                  <div className="text-cream text-xs font-medium">{v.title}</div>
                  <div className="text-cream/20 text-[10px]">{v.feat} &bull; {v.year}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ALBUMS COMPLETS */}
      <section className="py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-serif font-bold text-cream mb-8">Albums <span className="text-gradient-gold">Complets</span></h2>

          {albums.map((album, i) => (
            <div key={i} className="mb-10">
              <div className="grid lg:grid-cols-5 gap-8 items-start rounded-2xl glass-card p-8 hover:border-gold/15 transition-all">
                <div className="lg:col-span-2 h-64 rounded-xl relative overflow-hidden group cursor-pointer">
                  <Image src={album.image} alt={album.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" sizes="400px" />
                  <div className="absolute inset-0 bg-gradient-to-t from-dark/80 via-dark/20 to-transparent" />
                  <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-dark/60 backdrop-blur-sm text-cream text-[10px] font-bold">{album.year}</div>
                  <div className="absolute bottom-4 right-4 px-3 py-1 rounded-full bg-gold/20 text-gold text-[10px] font-bold">{album.type}</div>
                  <div className="absolute bottom-4 left-4">
                    <div className="text-cream font-serif font-bold text-lg">{album.title}</div>
                  </div>
                </div>
                <div className="lg:col-span-3">
                  <h2 className="text-2xl font-serif font-bold text-cream mb-2">{album.title}</h2>
                  <p className="text-cream/30 text-sm mb-5 leading-relaxed">{album.desc}</p>
                  <div className="grid grid-cols-2 gap-2 mb-5">
                    {album.tracks.map((t, j) => (
                      <a
                        key={j}
                        href={t.ytId ? `https://www.youtube.com/watch?v=${t.ytId}` : "#"}
                        target={t.ytId ? "_blank" : undefined}
                        rel="noopener"
                        className={`flex items-center gap-3 p-2.5 rounded-lg bg-cream/[0.02] hover:bg-cream/[0.05] transition-all group/track ${t.ytId ? "cursor-pointer" : "cursor-default"}`}
                      >
                        <span className="text-cream/15 text-xs w-5">{String(j + 1).padStart(2, "0")}</span>
                        <div className="flex-1 min-w-0">
                          <span className="text-cream/50 text-xs group-hover/track:text-gold transition-colors block truncate">{t.title}</span>
                          {t.feat && <span className="text-cream/15 text-[10px]">{t.feat}</span>}
                        </div>
                        {t.views && <span className="text-cream/15 text-[10px] flex-shrink-0">{t.views}</span>}
                        {t.ytId ? (
                          <FaPlay className="text-cream/10 text-[8px] group-hover/track:text-gold transition-colors flex-shrink-0" />
                        ) : (
                          <span className="w-2" />
                        )}
                      </a>
                    ))}
                  </div>
                  <div className="flex flex-wrap gap-3">
                    {album.spotifyUrl && (
                      <a href={album.spotifyUrl} target="_blank" rel="noopener" className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#1DB954]/10 text-[#1DB954] text-xs hover:bg-[#1DB954]/20 transition-all"><FaSpotify /> Spotify</a>
                    )}
                    <a href="https://www.youtube.com/@LordLomboOfficial" target="_blank" rel="noopener" className="flex items-center gap-2 px-4 py-2 rounded-full bg-red-500/10 text-red-400 text-xs hover:bg-red-500/20 transition-all"><FaYoutube /> YouTube</a>
                    <a href="https://music.apple.com/us/artist/lord-lombo/1273494570" target="_blank" rel="noopener" className="flex items-center gap-2 px-4 py-2 rounded-full bg-gold/10 text-gold text-xs hover:bg-gold/20 transition-all"><FaDownload /> Apple Music</a>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* LATEST RELEASES */}
      <section className="py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-serif font-bold text-cream mb-8">Sorties <span className="text-gradient-gold">Recentes</span></h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { title: "Medaille", type: "EP", year: "2025", ytId: "0GZjMRYZqe8", views: "3.8M" },
              { title: "Miel", type: "Single", year: "2024", ytId: "_r_oiiEns-A", views: "3M" },
              { title: "FIDELE (Remix)", type: "Single", year: "2025", ytId: "-NTZfSthwRE", views: "329K" },
            ].map((r, i) => (
              <a key={i} href={`https://www.youtube.com/watch?v=${r.ytId}`} target="_blank" rel="noopener" className="group rounded-2xl overflow-hidden glass-card hover:border-gold/20 transition-all">
                <div className="aspect-video relative overflow-hidden">
                  <Image src={`https://i.ytimg.com/vi/${r.ytId}/hqdefault.jpg`} alt={r.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" sizes="400px" />
                  <div className="absolute inset-0 bg-dark/30 group-hover:bg-dark/10 transition-all flex items-center justify-center">
                    <div className="w-14 h-14 rounded-full bg-gold/20 backdrop-blur-sm flex items-center justify-center border border-gold/30 group-hover:scale-110 transition-transform">
                      <FaPlay className="text-gold ml-0.5" />
                    </div>
                  </div>
                </div>
                <div className="p-5">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="px-2 py-0.5 rounded bg-gold/10 text-gold text-[10px] font-bold">{r.type}</span>
                    <span className="text-cream/20 text-[10px]">{r.year}</span>
                  </div>
                  <h3 className="text-cream font-bold text-base group-hover:text-gold transition-colors">{r.title}</h3>
                  <div className="text-cream/25 text-xs mt-1">{r.views} vues &bull; <FaExternalLinkAlt className="inline text-[8px]" /> Regarder</div>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
