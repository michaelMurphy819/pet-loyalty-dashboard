"use client";

import Image from "next/image";
import { Link, usePathname } from "@/i18n/routing";
import { LayoutDashboard, Globe2, MapPin, BarChart3, Menu, X } from "lucide-react";
import { LanguageSwitcher } from "@/components/language-switcher";
import { ExportButton } from "@/components/export-button";
import { useTranslations } from "next-intl";
import { UserMenu } from "@/components/user-menu";
import { useEffect, useState } from "react";
import { ActiveFiltersPopup } from "@/components/dashboard/active-filters-popup";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const t = useTranslations("Dashboard.nav");
  const [role, setRole] = useState("staff");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const match = document.cookie.match(new RegExp('(^| )pet_loyalty_role=([^;]+)'));
    if (match) setRole(match[2]);
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-slate-50/70 text-slate-800 selection:bg-indigo-100 selection:text-indigo-900">
      <header className="sticky top-0 z-50 w-full border-b border-slate-200/80 bg-white/95 backdrop-blur-md shadow-2xs">
        <div className="flex h-18 items-center justify-between px-4 sm:px-6 md:px-8 max-w-[1600px] mx-auto w-full">
          
          {/* Left: Brand Identity */}
          <div className="flex items-center gap-2.5 sm:gap-3.5">
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)} 
              className="md:hidden p-2 rounded-xl text-slate-700 hover:bg-slate-100 transition-colors border border-slate-200/80 shadow-2xs"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5 text-indigo-600" /> : <Menu className="w-5 h-5" />}
            </button>

            <Link href="/dashboard" className="flex items-center gap-2.5 sm:gap-3.5 group" onClick={() => setMobileMenuOpen(false)}>
              <div className="relative h-9 w-9 sm:h-10 sm:w-10 overflow-hidden rounded-xl bg-white border border-slate-200/80 shadow-2xs flex items-center justify-center p-1 group-hover:border-indigo-300 transition-colors shrink-0">
                <Image 
                  src="/logo.jpeg" 
                  alt="Pet Loyalty Logo" 
                  width={36}
                  height={36}
                  className="object-contain"
                />
              </div>
              <div className="flex flex-col">
                <h1 className="text-base sm:text-lg font-black tracking-tight text-slate-900 group-hover:text-indigo-600 transition-colors">
                  Pet Loyalty
                </h1>
                <span className="text-[9px] sm:text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">
                  BI Analytics
                </span>
              </div>
            </Link>
          </div>
          
          {/* Center: Main Navigation (Desktop) */}
          <nav className="hidden md:flex items-center gap-1 text-sm font-semibold h-full">
            <Link
              href="/dashboard"
              className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-150 ${
                pathname === "/dashboard" 
                  ? "text-indigo-700 bg-indigo-50/90 shadow-2xs font-bold" 
                  : "text-slate-600 hover:text-indigo-600 hover:bg-slate-50"
              }`}
            >
              <LayoutDashboard className="h-4 w-4 shrink-0 text-indigo-600" />
              <span>{t("overview")}</span>
            </Link>
            <Link
              href="/dashboard/map"
              className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-150 ${
                pathname === "/dashboard/map" 
                  ? "text-indigo-700 bg-indigo-50/90 shadow-2xs font-bold" 
                  : "text-slate-600 hover:text-indigo-600 hover:bg-slate-50"
              }`}
            >
              <Globe2 className="h-4 w-4 shrink-0 text-indigo-600" />
              <span>{t("globalMap")}</span>
            </Link>
            <Link
              href="/dashboard/cities"
              className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-150 ${
                pathname === "/dashboard/cities" || pathname.startsWith("/dashboard/cities/") || pathname.startsWith("/dashboard/organizations/")
                  ? "text-indigo-700 bg-indigo-50/90 shadow-2xs font-bold" 
                  : "text-slate-600 hover:text-indigo-600 hover:bg-slate-50"
              }`}
            >
              <MapPin className="h-4 w-4 shrink-0 text-indigo-600" />
              <span>{t("regionalDirectory")}</span>
            </Link>
            <Link
              href="/dashboard/analytics"
              className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-150 ${
                pathname === "/dashboard/analytics" 
                  ? "text-indigo-700 bg-indigo-50/90 shadow-2xs font-bold" 
                  : "text-slate-600 hover:text-indigo-600 hover:bg-slate-50"
              }`}
            >
              <BarChart3 className="h-4 w-4 shrink-0 text-indigo-600" />
              <span>{t("analytics")}</span>
            </Link>
          </nav>

          {/* Right: Controls & Utilities */}
          <div className="flex items-center gap-2 sm:gap-3.5">
            <div className="hidden sm:block">
              <ExportButton />
            </div>
            <LanguageSwitcher />
            
            <div className="h-6 w-px bg-slate-200 mx-0 sm:mx-0.5" />
            <UserMenu role={role} />
          </div>
        </div>

        {/* Mobile Slide-Down Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-slate-200/80 bg-white/98 backdrop-blur-lg px-4 py-4 space-y-2 shadow-lg animate-in slide-in-from-top duration-200">
            <nav className="flex flex-col gap-1.5 text-base font-bold">
              <Link
                href="/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                  pathname === "/dashboard" 
                    ? "text-indigo-700 bg-indigo-50/90 shadow-2xs font-black border border-indigo-100" 
                    : "text-slate-700 hover:text-indigo-600 hover:bg-slate-50"
                }`}
              >
                <LayoutDashboard className="h-5 w-5 shrink-0 text-indigo-600" />
                <span>{t("overview")}</span>
              </Link>
              <Link
                href="/dashboard/map"
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                  pathname === "/dashboard/map" 
                    ? "text-indigo-700 bg-indigo-50/90 shadow-2xs font-black border border-indigo-100" 
                    : "text-slate-700 hover:text-indigo-600 hover:bg-slate-50"
                }`}
              >
                <Globe2 className="h-5 w-5 shrink-0 text-indigo-600" />
                <span>{t("globalMap")}</span>
              </Link>
              <Link
                href="/dashboard/cities"
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                  pathname === "/dashboard/cities" || pathname.startsWith("/dashboard/cities/") || pathname.startsWith("/dashboard/organizations/")
                    ? "text-indigo-700 bg-indigo-50/90 shadow-2xs font-black border border-indigo-100" 
                    : "text-slate-700 hover:text-indigo-600 hover:bg-slate-50"
                }`}
              >
                <MapPin className="h-5 w-5 shrink-0 text-indigo-600" />
                <span>{t("regionalDirectory")}</span>
              </Link>
              <Link
                href="/dashboard/analytics"
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                  pathname === "/dashboard/analytics" 
                    ? "text-indigo-700 bg-indigo-50/90 shadow-2xs font-black border border-indigo-100" 
                    : "text-slate-700 hover:text-indigo-600 hover:bg-slate-50"
                }`}
              >
                <BarChart3 className="h-5 w-5 shrink-0 text-indigo-600" />
                <span>{t("analytics")}</span>
              </Link>
            </nav>

            <div className="pt-2 border-t border-slate-100 sm:hidden flex justify-center">
              <div className="w-full">
                <ExportButton />
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Main Content Area */}
      <main id="dashboard-export-area" className="flex-1 pb-12">
        {children}
      </main>
      <ActiveFiltersPopup />
    </div>
  );
}
