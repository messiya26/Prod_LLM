"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaHome, FaBookOpen, FaCog, FaSignOutAlt, FaUsers,
  FaChartBar, FaBars, FaTimes, FaMoneyBillWave, FaComments,
  FaCalendarAlt, FaVideo, FaBell, FaSearch, FaChevronDown, FaAward, FaEdit, FaStar, FaUserTie, FaGem, FaFire,
  FaReceipt, FaShieldAlt, FaPaintBrush,
} from "react-icons/fa";
import { useAuth } from "@/context/auth-context";
import { FullPageLoader } from "@/components/ui/loader";
import { useI18n } from "@/context/i18n-context";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, loading, logout } = useAuth();
  const { t } = useI18n();
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const isAdminRoute = pathname.startsWith("/admin");

  const sidebarStudent = [
    { icon: <FaHome />, labelKey: "dash.board", href: "/dashboard" },
    { icon: <FaBookOpen />, labelKey: "dash.myFormations", href: "/dashboard/formations" },
    { icon: <FaVideo />, labelKey: "dash.live", href: "/dashboard/live" },
    { icon: <FaReceipt />, labelKey: "dash.myPayments", href: "/dashboard/paiements" },
    { icon: <FaAward />, labelKey: "dash.certificates", href: "/dashboard/certificats" },
    { icon: <FaCog />, labelKey: "dash.settings", href: "/dashboard/parametres" },
  ];

  const sidebarInstructor = [
    { icon: <FaHome />, labelKey: "dash.board", href: "/dashboard" },
    { icon: <FaBookOpen />, labelKey: "dash.myFormations", href: "/dashboard/formations" },
    { icon: <FaVideo />, labelKey: "dash.live", href: "/dashboard/live" },
    { icon: <FaReceipt />, labelKey: "dash.myPayments", href: "/dashboard/paiements" },
    { icon: <FaMoneyBillWave />, labelKey: "dash.myRevenue", href: "/dashboard/revenus" },
    { icon: <FaUsers />, labelKey: "dash.myStudents", href: "/dashboard/etudiants" },
    { icon: <FaAward />, labelKey: "dash.certificates", href: "/dashboard/certificats" },
    { icon: <FaCog />, labelKey: "dash.settings", href: "/dashboard/parametres" },
  ];

  const sidebarModerator = [
    { icon: <FaChartBar />, labelKey: "dash.admin", href: "/admin" },
    { icon: <FaBookOpen />, labelKey: "dash.formations", href: "/admin/formations" },
    { icon: <FaUsers />, labelKey: "dash.students", href: "/admin/utilisateurs" },
    { icon: <FaComments />, labelKey: "dash.messages", href: "/admin/messages" },
    { icon: <FaEdit />, labelKey: "dash.blog", href: "/admin/blog" },
    { icon: <FaStar />, labelKey: "dash.events", href: "/admin/evenements" },
    { icon: <FaCog />, labelKey: "dash.settings", href: "/admin/parametres" },
  ];

  const sidebarAdmin = [
    { icon: <FaChartBar />, labelKey: "dash.admin", href: "/admin" },
    { icon: <FaBookOpen />, labelKey: "dash.formations", href: "/admin/formations" },
    { icon: <FaUsers />, labelKey: "dash.students", href: "/admin/utilisateurs" },
    { icon: <FaUserTie />, labelKey: "dash.instructors", href: "/admin/formateurs" },
    { icon: <FaMoneyBillWave />, labelKey: "dash.transactions", href: "/admin/transactions" },
    { icon: <FaComments />, labelKey: "dash.messages", href: "/admin/messages" },
    { icon: <FaCalendarAlt />, labelKey: "dash.calendar", href: "/admin/calendrier" },
    { icon: <FaVideo />, labelKey: "dash.live", href: "/admin/live" },
    { icon: <FaEdit />, labelKey: "dash.blog", href: "/admin/blog" },
    { icon: <FaStar />, labelKey: "dash.events", href: "/admin/evenements" },
    { icon: <FaGem />, labelKey: "dash.subscriptions", href: "/admin/abonnements" },
    { icon: <FaFire />, labelKey: "dash.masterclasses", href: "/admin/masterclasses" },
    { icon: <FaPaintBrush />, labelKey: "dash.content", href: "/admin/contenu" },
    { icon: <FaCog />, labelKey: "dash.settings", href: "/admin/parametres" },
  ];

  const sidebarSuperAdmin = [
    ...sidebarAdmin,
    { icon: <FaGem />, labelKey: "dash.permissions", href: "/admin/permissions" },
    { icon: <FaShieldAlt />, labelKey: "dash.security", href: "/admin/securite" },
  ];

  const roleLabels: Record<string, string> = {
    STUDENT: "Apprenant",
    INSTRUCTOR: "Formateur",
    MODERATOR: "Moderateur",
    ADMIN: "Administrateur",
    SUPER_ADMIN: "Super Admin",
  };

  const canAccessAdmin = ["ADMIN", "SUPER_ADMIN", "MODERATOR"].includes(user?.role || "");
  const canAccessInstructor = user?.role === "INSTRUCTOR";

  const getItems = () => {
    if (isAdminRoute) {
      if (user?.role === "SUPER_ADMIN") return sidebarSuperAdmin;
      if (user?.role === "MODERATOR") return sidebarModerator;
      return sidebarAdmin;
    }
    if (canAccessInstructor) return sidebarInstructor;
    return sidebarStudent;
  };

  const items = getItems();

  useEffect(() => {
    if (!loading && !user) router.push("/connexion");
    if (!loading && user && !user.emailVerified) router.push("/verification-requise");
    if (!loading && user && pathname === "/dashboard" && ["ADMIN", "SUPER_ADMIN"].includes(user.role)) {
      router.replace("/admin");
    }
  }, [user, loading, router, pathname]);

  if (loading || !user || !user.emailVerified) return <FullPageLoader message={t("dash.loading")} />;

  const initials = `${(user.firstName || "U")[0]}${(user.lastName || "")[0] || ""}`.trim() || "U";

  return (
    <div className="min-h-screen flex bg-[#0a0e1a]">
      {mobileOpen && (
        <div className="fixed inset-0 z-40 bg-black/60 md:hidden" onClick={() => setMobileOpen(false)} />
      )}

      <aside className={`fixed md:static inset-y-0 left-0 z-50 w-[240px] flex flex-col bg-gradient-to-b from-[#0d1a2e] via-[#0a1525] to-[#06101d] transform transition-transform md:translate-x-0 ${mobileOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="p-5 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <Image src="/logo-icon.svg" alt="Logo" width={32} height={32} />
            <div>
              <span className="text-sm font-bold text-cream block leading-none">Lord Lombo</span>
              <span className="text-[10px] text-cream/40">Academie</span>
            </div>
          </Link>
          <button onClick={() => setMobileOpen(false)} className="md:hidden text-cream/40 hover:text-cream">
            <FaTimes />
          </button>
        </div>

        {canAccessAdmin && (
          <div className="px-4 mb-3">
            <Link
              href={isAdminRoute ? "/dashboard" : "/admin"}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                isAdminRoute
                  ? "text-emerald-400/80 bg-emerald-400/5 border border-emerald-400/10 hover:bg-emerald-400/10"
                  : "text-gold/80 bg-gold/5 border border-gold/10 hover:bg-gold/10"
              }`}
            >
              {isAdminRoute ? <><FaHome className="text-[10px]" /> {t("dash.studentView")}</> : <><FaChartBar className="text-[10px]" /> {t("dash.adminPanel")}</>}
            </Link>
          </div>
        )}

        {canAccessInstructor && !isAdminRoute && (
          <div className="px-4 mb-3">
            <div className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium text-blue-400/80 bg-blue-400/5 border border-blue-400/10">
              <FaUserTie className="text-[10px]" /> Espace Formateur
            </div>
          </div>
        )}

        <nav className="flex-1 px-3 space-y-0.5 overflow-y-auto">
          {items.map((item) => {
            const active = pathname === item.href || (item.href !== "/dashboard" && item.href !== "/admin" && pathname.startsWith(item.href));
            return (
              <Link
                key={item.labelKey + item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-[13px] transition-all ${
                  active
                    ? "bg-gold/10 text-gold font-semibold shadow-lg shadow-gold/5 border border-gold/10"
                    : "text-white/40 hover:text-white/70 hover:bg-white/[0.04]"
                }`}
              >
                <span className={`text-sm ${active ? "text-gold" : ""}`}>{item.icon}</span>
                {t(item.labelKey)}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-white/[0.06]">
          <button
            onClick={logout}
            className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-[13px] text-white/25 hover:text-red-400 hover:bg-red-400/5 transition-all w-full"
          >
            <FaSignOutAlt className="text-sm" />
            {t("dash.logout")}
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="flex items-center justify-between px-6 py-3 border-b border-white/[0.04] bg-[#0a0e1a]/80 backdrop-blur-xl">
          <div className="flex items-center gap-4">
            <button onClick={() => setMobileOpen(true)} className="md:hidden text-white/50 hover:text-white p-2">
              <FaBars />
            </button>
            <div className="hidden md:flex items-center gap-2 bg-white/[0.04] rounded-xl px-4 py-2.5 w-72 border border-white/[0.06]">
              <FaSearch className="text-white/20 text-sm" />
              <input type="text" placeholder={t("dash.search")} className="bg-transparent text-sm text-white placeholder:text-white/20 focus:outline-none w-full" />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button className="relative p-2 rounded-xl hover:bg-white/[0.04] transition-colors">
              <FaBell className="text-white/40 text-sm" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
            </button>

            <div className="relative">
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                className="flex items-center gap-3 pl-1 pr-3 py-1 rounded-xl hover:bg-white/[0.04] transition-colors"
              >
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-gold to-gold-light flex items-center justify-center text-navy font-bold text-xs shadow-lg shadow-gold/20">
                  {initials}
                </div>
                <div className="hidden md:block text-left">
                  <div className="text-xs font-semibold text-white">{user.firstName || ""} {user.lastName || ""}</div>
                  <div className="text-[10px] text-white/30">{roleLabels[user.role] || t("dash.learner")}</div>
                </div>
                <FaChevronDown className="text-white/20 text-[8px] hidden md:block" />
              </button>

              <AnimatePresence>
                {profileOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 5 }}
                    className="absolute right-0 top-12 w-48 bg-[#0d1a2e] border border-gold/10 rounded-xl shadow-2xl py-2 z-50"
                  >
                    <Link href={isAdminRoute ? "/admin/parametres" : "/dashboard/parametres"} onClick={() => setProfileOpen(false)} className="flex items-center gap-2 px-4 py-2.5 text-xs text-white/50 hover:text-white hover:bg-white/5 transition-all">
                      <FaCog className="text-[10px]" /> {t("dash.settings")}
                    </Link>
                    <button onClick={logout} className="flex items-center gap-2 px-4 py-2.5 text-xs text-red-400/60 hover:text-red-400 hover:bg-red-400/5 transition-all w-full">
                      <FaSignOutAlt className="text-[10px]" /> {t("dash.logout")}
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-5 md:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
