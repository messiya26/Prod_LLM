"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import Image from "next/image";
import { useI18n } from "@/context/i18n-context";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const testimonials = [
  {
    name: "Pasteur Jean-Marc Kisula",
    roleKey: "testimonial.role.pastor",
    textKey: "testimonial.t1",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face",
  },
  {
    name: "Grace Mwamba",
    roleKey: "testimonial.role.chantre",
    textKey: "testimonial.t2",
    image: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=200&h=200&fit=crop&crop=face",
  },
  {
    name: "David Lukusa",
    roleKey: "testimonial.role.entrepreneur",
    textKey: "testimonial.t3",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&crop=face",
  },
  {
    name: "Sarah Kabongo",
    roleKey: "testimonial.role.future.pastor",
    textKey: "testimonial.t4",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop&crop=face",
  },
  {
    name: "Patrick Mutombo",
    roleKey: "testimonial.role.youth",
    textKey: "testimonial.t5",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop&crop=face",
  },
];

export function TestimonialCarousel({ dynamicTestimonials }: { dynamicTestimonials?: { name: string; role: string; text: string; avatar: string }[] } = {}) {
  const { t } = useI18n();

  const items = dynamicTestimonials && dynamicTestimonials.length > 0
    ? dynamicTestimonials.map(dt => ({
        name: dt.name,
        role: dt.role,
        text: dt.text,
        image: dt.avatar || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face",
        isDynamic: true,
      }))
    : testimonials.map(item => ({
        name: item.name,
        role: t(item.roleKey),
        text: t(item.textKey),
        image: item.image,
        isDynamic: false,
      }));

  return (
    <Swiper
      modules={[Autoplay, Pagination, Navigation]}
      spaceBetween={30}
      slidesPerView={1}
      breakpoints={{
        768: { slidesPerView: 2 },
        1024: { slidesPerView: 3 },
      }}
      autoplay={{ delay: 4000, disableOnInteraction: false }}
      pagination={{ clickable: true }}
      navigation
      loop
      style={{ paddingBottom: "60px" }}
    >
      {items.map((item, idx) => (
        <SwiperSlide key={item.name + idx}>
          <div className="glass rounded-2xl p-8 card-hover-lift h-full">
            <div className="flex items-center gap-4 mb-6">
              <div className="relative w-14 h-14 rounded-full overflow-hidden ring-2 ring-gold/30 flex-shrink-0">
                <Image src={item.image} alt={item.name} fill className="object-cover" sizes="56px" />
              </div>
              <div>
                <div className="font-bold text-cream">{item.name}</div>
                <div className="text-gold/70 text-sm">{item.role}</div>
              </div>
            </div>
            <div className="relative mb-4">
              <span className="text-gold/15 text-7xl absolute -top-6 -left-2 font-heading leading-none">&ldquo;</span>
              <p className="text-cream/55 text-sm leading-relaxed pl-6 pt-2">{item.text}</p>
            </div>
            <div className="flex gap-1">
              {[...Array(5)].map((_, i) => (
                <span key={i} className="text-gold text-lg">&#9733;</span>
              ))}
            </div>
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  );
}
