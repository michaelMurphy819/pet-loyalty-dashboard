"use client";

import Image from "next/image";
import { Link, usePathname } from "@/i18n/routing";
import { LayoutDashboard, Globe2, User, Search, MapPin, BarChart3 } from "lucide-react";
import { LanguageSwitcher } from "@/components/language-switcher";
import { ExportButton } from "@/components/export-button";
import { useTranslations } from "next-intl";
import { UserMenu } from "@/components/user-menu";
import { GlobalSearch } from "@/components/global-search";
import { useEffect, useState } from "react";

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
    <div className="flex flex-col min-h-screen bg-slate-50/50">
      <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white shadow-sm">
        <div className="flex h-20 items-center justify-between px-8 max-w-[1600px] mx-auto w-full">
          
          {/* Left: Logo & Brand */}
          <div className="flex items-center gap-4">
            <div className="relative h-12 w-12 overflow-hidden rounded-xl bg-white border border-slate-100 shadow-sm flex items-center justify-center p-1">
              <Image 
                src="/logo.jpeg" 
                alt="Pet Loyalty Logo" 
                width={40}
                height={40}
                className="object-contain"
              />
            </div>
            <div className="flex flex-col">
              <h1 className="text-2xl font-black tracking-tight text-slate-900">
                Pet Loyalty
              </h1>
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-widest">
                Business Intelligence
              </span>
            </div>
          </div>
          
          {/* Center: Main Navigation */}
          <nav className="hidden md:flex items-center gap-2 text-base font-medium h-full">
            <Link
              href="/dashboard"
              className={`relative h-full flex items-center px-6 transition-all duration-200 hover:text-indigo-600 hover:bg-slate-50 ${
                pathname === "/dashboard" ? "text-indigo-700 bg-indigo-50/50" : "text-slate-600"
              }`}
            >
              <LayoutDashboard className="mr-2.5 h-5 w-5" />
              {t("overview")}
              {pathname === "/dashboard" && (
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-indigo-600 rounded-t-full shadow-sm" />
              )}
            </Link>
            <Link
              href="/dashboard/map"
              className={`relative h-full flex items-center px-6 transition-all duration-200 hover:text-indigo-600 hover:bg-slate-50 ${
                pathname === "/dashboard/map" ? "text-indigo-700 bg-indigo-50/50" : "text-slate-600"
              }`}
            >
              <Globe2 className="mr-2.5 h-5 w-5" />
              {t("globalMap")}
              {pathname === "/dashboard/map" && (
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-indigo-600 rounded-t-full shadow-sm" />
              )}
            </Link>
            <Link
              href="/dashboard/cities"
              className={`relative h-full flex items-center px-6 transition-all duration-200 hover:text-indigo-600 hover:bg-slate-50 ${
                pathname === "/dashboard/cities" ? "text-indigo-700 bg-indigo-50/50" : "text-slate-600"
              }`}
            >
              <MapPin className="mr-2.5 h-5 w-5" />
              {t("regionalDirectory")}
              {pathname === "/dashboard/cities" && (
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-indigo-600 rounded-t-full shadow-sm" />
              )}
            </Link>
            {role === "admin" && (
              <Link
                href="/dashboard/analytics"
                className={`relative h-full flex items-center px-6 transition-all duration-200 hover:text-indigo-600 hover:bg-slate-50 ${
                  pathname === "/dashboard/analytics" ? "text-indigo-700 bg-indigo-50/50" : "text-slate-600"
                }`}
              >
                <BarChart3 className="mr-2.5 h-5 w-5" />
                {t("analytics")}
                {pathname === "/dashboard/analytics" && (
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-indigo-600 rounded-t-full shadow-sm" />
                )}
              </Link>
            )}
          </nav>

          {/* Right: Actions */}
          <div className="flex items-center gap-5">
            <GlobalSearch />
            <ExportButton />
            <LanguageSwitcher />
            
            <div className="h-8 w-px bg-slate-200 mx-1"></div>
            <UserMenu role={role} />
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main id="dashboard-export-area" className="flex-1 pb-10">
        {children}
      </main>
    </div>
  );
}
