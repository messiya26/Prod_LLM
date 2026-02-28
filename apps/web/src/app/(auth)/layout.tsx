"use client";

import Image from "next/image";
import { useI18n } from "@/context/i18n-context";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  const { t } = useI18n();

  return (
    <div className="min-h-screen flex">
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1504052434569-70ad5836ab65?w=1200&h=1600&fit=crop"
          alt="Lord Lombo Academie"
          fill
          className="object-cover"
          priority
          sizes="50vw"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-navy/90 via-dark/80 to-navy/95" />
        <div className="absolute inset-0 flex flex-col items-center justify-center p-12 text-center">
          <div className="relative mb-8">
            <div className="absolute -inset-3 bg-gold/20 rounded-2xl blur-xl" />
            <Image src="/logo-icon.svg" alt="Logo" width={80} height={80} className="relative" />
          </div>
          <h2 className="text-3xl font-bold text-cream mb-4 font-heading">Lord Lombo Academie</h2>
          <p className="text-cream/50 text-sm max-w-sm leading-relaxed">
            {t("auth.layout.desc")}
          </p>
          <div className="mt-12 grid grid-cols-3 gap-6 text-center">
            <div>
              <div className="text-2xl font-bold text-gold">9+</div>
              <div className="text-cream/30 text-xs mt-1">{t("auth.layout.formations")}</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-gold">500+</div>
              <div className="text-cream/30 text-xs mt-1">{t("auth.layout.apprenants")}</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-gold">98%</div>
              <div className="text-cream/30 text-xs mt-1">{t("auth.layout.satisfaction")}</div>
            </div>
          </div>
        </div>
      </div>
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 md:p-12 bg-dark">
        {children}
      </div>
    </div>
  );
}
