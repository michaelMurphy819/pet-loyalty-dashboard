"use client";

import Image from "next/image";
import { Link, usePathname } from "@/i18n/routing";
import { LayoutDashboard, Globe2, MapPin, BarChart3 } from "lucide-react";
import { LanguageSwitcher } from "@/components/language-switcher";
import { ExportButton } from "@/components/export-button";
import { useTranslations } from "next-intl";
import { UserMenu } from "@/components/user-menu";
import { GlobalSearch } from "@/components/global-search";
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

  useEffect(() => {
    const match = document.cookie.match(new RegExp('(^| )pet_loyalty_role=([^;]+)'));
    if (match) setRole(match[2]);
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-slate-50/70 text-slate-800 selection:bg-indigo-100 selection:text-indigo-900">
      <header className="sticky top-0 z-50 w-full border-b border-slate-200/80 bg-white/95 backdrop-blur-md shadow-2xs">
        <div className="flex h-18 items-center justify-between px-6 md:px-8 max-w-[1600px] mx-auto w-full">
          
          {/* Left: Brand Identity */}
          <div className="flex items-center gap-3.5">
            <Link href="/dashboard" className="flex items-center gap-3.5 group">
              <div className="relative h-10 w-10 overflow-hidden rounded-xl bg-white border border-slate-200/80 shadow-2xs flex items-center justify-center p-1 group-hover:border-indigo-300 transition-colors">
                <Image 
                  src="/logo.jpeg" 
                  alt="Pet Loyalty Logo" 
                  width={36}
                  height={36}
                  className="object-contain"
                />
              </div>
              <div className="flex flex-col">
                <h1 className="text-lg font-black tracking-tight text-slate-900 group-hover:text-indigo-600 transition-colors">
                  Pet Loyalty
                </h1>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">
                  BI Analytics
                </span>
              </div>
            </Link>
          </div>
          
          {/* Center: Main Navigation */}
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
            {role === "admin" && (
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
            )}
          </nav>

          {/* Right: Controls & Utilities */}
          <div className="flex items-center gap-3.5">
            <GlobalSearch />
            <ExportButton />
            <LanguageSwitcher />
            
            <div className="h-6 w-px bg-slate-200 mx-0.5" />
            <UserMenu role={role} />
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main id="dashboard-export-area" className="flex-1 pb-12">
        {children}
      </main>
      <ActiveFiltersPopup />
    </div>
  );
}
