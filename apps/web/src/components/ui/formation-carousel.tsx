"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "./badge";
import { useI18n } from "@/context/i18n-context";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const formations = [
  {
    titleKey: "formations.f1.title", descKey: "formations.f1.desc", levelKey: "formations.lvl.all",
    modules: 10, price: 149, href: "/formations/fondements-foi-leadership",
    image: "https://images.unsplash.com/photo-1504052434569-70ad5836ab65?w=600&h=400&fit=crop",
    gradient: "from-indigo-600/80 to-purple-900/90",
  },
  {
    titleKey: "formations.f2.title", descKey: "formations.f2.desc", levelKey: "formations.lvl.inter",
    modules: 12, price: 199, href: "/formations/leadership-vision-ministerielle",
    image: "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=600&h=400&fit=crop",
    gradient: "from-amber-600/80 to-orange-900/90",
  },
  {
    titleKey: "formations.f3.title", descKey: "formations.f3.desc", levelKey: "formations.lvl.all",
    modules: 8, price: 129, href: "/formations/communication-influence",
    image: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=600&h=400&fit=crop",
    gradient: "from-emerald-600/80 to-teal-900/90",
  },
  {
    titleKey: "formations.f4.title", descKey: "formations.f4.desc", levelKey: "formations.lvl.advanced",
    modules: 15, price: 249, href: "/formations/counseling-pastoral-avance",
    image: "https://images.unsplash.com/photo-1507925921958-8a62f3d1a50d?w=600&h=400&fit=crop",
    gradient: "from-blue-600/80 to-indigo-900/90",
  },
  {
    titleKey: "formations.f5.title", descKey: "formations.f5.desc", levelKey: "formations.lvl.all",
    modules: 8, price: 0, href: "/formations/louange-adoration",
    image: "https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=600&h=400&fit=crop",
    gradient: "from-rose-600/80 to-pink-900/90",
  },
  {
    titleKey: "formations.f6.title", descKey: "formations.f6.desc", levelKey: "formations.lvl.candidature",
    modules: 6, price: 399, href: "/formations/mentorat-ministeriel",
    image: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=600&h=400&fit=crop",
    gradient: "from-violet-600/80 to-indigo-900/90",
  },
];

export function FormationCarousel() {
  const { t } = useI18n();

  return (
    <Swiper
      modules={[Autoplay, Pagination, Navigation]}
      spaceBetween={24}
      slidesPerView={1}
      breakpoints={{
        640: { slidesPerView: 2 },
        1024: { slidesPerView: 3 },
      }}
      autoplay={{ delay: 3500, disableOnInteraction: false }}
      pagination={{ clickable: true }}
      navigation
      loop
      style={{ paddingBottom: "60px" }}
    >
      {formations.map((f) => (
        <SwiperSlide key={f.titleKey}>
          <Link href={f.href}>
            <div className="relative rounded-2xl overflow-hidden card-hover-lift group h-[420px] cursor-pointer">
              <Image src={f.image} alt={t(f.titleKey)} fill className="object-cover transition-transform duration-700 group-hover:scale-110" sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" />
              <div className={`absolute inset-0 bg-gradient-to-t ${f.gradient}`} />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              <div className="absolute top-4 right-4">
                <span className="px-3 py-1.5 rounded-full bg-gold/90 text-navy text-sm font-bold shadow-lg">
                  {f.price === 0 ? t("formations.free") : `$${f.price}`}
                </span>
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-7">
                <div className="flex items-center gap-2 mb-3">
                  <Badge>{t(f.levelKey)}</Badge>
                  <Badge variant="navy">{f.modules} {t("dash.modules")}</Badge>
                </div>
                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-gold transition-colors duration-300">{t(f.titleKey)}</h3>
                <p className="text-white/70 text-sm leading-relaxed mb-4">{t(f.descKey)}</p>
                <div className="flex items-center gap-2 text-gold font-medium text-sm opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-300">
                  <span>{t("formations.discoverProgram")}</span><span>&rarr;</span>
                </div>
              </div>
            </div>
          </Link>
        </SwiperSlide>
      ))}
    </Swiper>
  );
}
