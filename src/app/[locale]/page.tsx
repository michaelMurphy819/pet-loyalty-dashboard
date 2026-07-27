"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { ArrowRight, ShieldCheck, User, Sparkles, BarChart3, Globe, Database } from "lucide-react";
import { LanguageSwitcher } from "@/components/language-switcher";

export default function LandingPage() {
  const t = useTranslations("Dashboard.landing");
  const router = useRouter();

  const handleLogin = (role: "admin" | "staff") => {
    document.cookie = `pet_loyalty_role=${role}; path=/; max-age=86400; SameSite=Lax`;
    router.push("/dashboard");
  };

  return (
    <div className="min-h-screen bg-slate-50/80 text-slate-800 flex flex-col relative overflow-hidden selection:bg-indigo-100 selection:text-indigo-900">
      {/* Decorative Subtle Background Accents */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none z-0 overflow-hidden">
        <div className="absolute -top-32 -left-32 w-[500px] h-[500px] rounded-full bg-indigo-100/50 blur-3xl" />
        <div className="absolute top-1/2 -right-32 w-[450px] h-[450px] rounded-full bg-emerald-100/40 blur-3xl" />
        <div className="absolute -bottom-32 left-1/3 w-[500px] h-[500px] rounded-full bg-amber-100/30 blur-3xl" />
      </div>

      {/* Header */}
      <header className="w-full px-6 md:px-12 py-5 flex justify-between items-center z-10 relative max-w-[1500px] mx-auto">
        <div className="flex items-center gap-3">
          <div className="relative h-11 w-11 overflow-hidden rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center justify-center p-1.5">
            <Image 
              src="/logo.jpeg" 
              alt="Pet Loyalty Logo" 
              width={36}
              height={36}
              className="object-contain"
            />
          </div>
          <div>
            <span className="text-xl font-extrabold tracking-tight text-slate-900 block leading-none">Pet Loyalty</span>
            <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest">Enterprise Analytics</span>
          </div>
        </div>
        <LanguageSwitcher />
      </header>

      {/* Main Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 py-12 text-center z-10 relative max-w-[1100px] mx-auto w-full">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-bold shadow-2xs mb-6 animate-fade-in">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Next-Generation Adoption Intelligence & Network Telemetry</span>
        </div>

        <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight text-slate-900 leading-[1.1] max-w-4xl">
          {t("title")}
        </h1>
        <p className="text-base sm:text-lg md:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed mt-6 font-normal">
          {t("subtitle")} — Monitor adoption volume, real-time geographic distribution, and cross-channel velocities across 1.46M+ records.
        </p>

        {/* Action Gateways */}
        <div className="mt-10 flex flex-col sm:flex-row gap-5 justify-center items-center w-full max-w-xl">
          <button 
            onClick={() => handleLogin("staff")}
            className="group w-full flex items-center justify-between px-6 py-4 bg-white hover:bg-indigo-50/30 border border-slate-200/90 hover:border-indigo-200 rounded-2xl shadow-sm hover:shadow-md transition-all duration-200 text-left"
          >
            <div className="flex items-center gap-3.5">
              <div className="h-12 w-12 rounded-xl bg-slate-100 group-hover:bg-indigo-100 flex items-center justify-center transition-colors shadow-2xs">
                <User className="h-6 w-6 text-slate-700 group-hover:text-indigo-700 transition-colors" />
              </div>
              <div>
                <span className="font-extrabold text-slate-800 group-hover:text-indigo-900 block text-base leading-tight">{t("loginStaff")}</span>
                <span className="text-xs text-slate-500 font-medium">Standard viewing & regional directories</span>
              </div>
            </div>
            <ArrowRight className="h-5 w-5 text-slate-400 group-hover:text-indigo-600 group-hover:translate-x-1 transition-all shrink-0 ml-2" />
          </button>

          <button 
            onClick={() => handleLogin("admin")}
            className="group w-full flex items-center justify-between px-6 py-4 bg-slate-900 hover:bg-indigo-950 border border-transparent rounded-2xl shadow-md hover:shadow-xl transition-all duration-200 text-left"
          >
            <div className="flex items-center gap-3.5">
              <div className="h-12 w-12 rounded-xl bg-indigo-600 group-hover:bg-indigo-500 flex items-center justify-center transition-colors shadow-2xs">
                <ShieldCheck className="h-6 w-6 text-white" />
              </div>
              <div>
                <span className="font-extrabold text-white block text-base leading-tight">{t("loginAdmin")}</span>
                <span className="text-xs text-slate-400 font-medium">Executive analytics & raw CSV data export</span>
              </div>
            </div>
            <ArrowRight className="h-5 w-5 text-slate-400 group-hover:text-white group-hover:translate-x-1 transition-all shrink-0 ml-2" />
          </button>
        </div>

        {/* Feature Highlights Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full mt-16 pt-10 border-t border-slate-200/70 text-left">
          <div className="p-4 rounded-2xl bg-white/70 border border-slate-200/60 shadow-2xs flex items-center gap-3.5">
            <div className="p-2.5 rounded-xl bg-indigo-50 text-indigo-600 font-bold shrink-0">
              <BarChart3 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Dynamic Cross-Filtering</h3>
              <p className="text-xs text-slate-500">Interactive click-through slice & drilldown analytics.</p>
            </div>
          </div>
          <div className="p-4 rounded-2xl bg-white/70 border border-slate-200/60 shadow-2xs flex items-center gap-3.5">
            <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-600 font-bold shrink-0">
              <Globe className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Global Telemetry Map</h3>
              <p className="text-xs text-slate-500">Geographic tracking from national down to city levels.</p>
            </div>
          </div>
          <div className="p-4 rounded-2xl bg-white/70 border border-slate-200/60 shadow-2xs flex items-center gap-3.5">
            <div className="p-2.5 rounded-xl bg-purple-50 text-purple-600 font-bold shrink-0">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">1.46M+ Verified Records</h3>
              <p className="text-xs text-slate-500">High-performance PostgreSQL real-time aggregation.</p>
            </div>
          </div>
        </div>
      </main>

      <footer className="py-6 px-8 text-center text-xs font-semibold text-slate-400 border-t border-slate-200/60 bg-white/50">
        &copy; {new Date().getFullYear()} Pet Loyalty Solutions &bull; All Rights Reserved.
      </footer>
    </div>
  );
}
