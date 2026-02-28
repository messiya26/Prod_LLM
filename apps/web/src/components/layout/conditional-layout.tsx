"use client";

import { usePathname } from "next/navigation";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";

const HIDE_LAYOUT_ROUTES = ["/dashboard", "/admin", "/connexion", "/inscription", "/verification-requise", "/verify"];

export function ConditionalLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const hideLayout = HIDE_LAYOUT_ROUTES.some((r) => pathname.startsWith(r));

  if (hideLayout) {
    return <>{children}</>;
  }

  return (
    <>
      <Header />
      <main className="flex-1 pt-16 md:pt-20">{children}</main>
      <Footer />
    </>
  );
}
