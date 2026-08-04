"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { ArrowRight } from "lucide-react";
import { LanguageSwitcher } from "@/components/language-switcher";

export default function LandingPage() {
  const t = useTranslations("Dashboard.landing");
  const router = useRouter();

  const handleLogin = () => {
    document.cookie = "pet_loyalty_role=staff; path=/; max-age=86400; SameSite=Lax";
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
          <span className="text-2xl font-black tracking-tight text-slate-900 block leading-none">Pet Loyalty</span>
        </div>
        <LanguageSwitcher />
      </header>

      {/* Main Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 py-16 text-center z-10 relative max-w-4xl mx-auto w-full">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight text-slate-900 leading-[1.15]">
          {t("title")}
        </h1>
        <p className="text-base sm:text-lg md:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed mt-5 font-normal">
          {t("subtitle")}
        </p>

        {/* Clean, simple Login Button without bloat or admin feature */}
        <div className="mt-10 flex justify-center w-full">
          <button 
            onClick={handleLogin}
            className="group flex items-center justify-center gap-3 px-8 py-4 bg-slate-900 hover:bg-indigo-600 text-white font-extrabold rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200 text-lg active:scale-[0.99]"
          >
            <span>{t("login")}</span>
            <ArrowRight className="h-5 w-5 text-slate-400 group-hover:text-white group-hover:translate-x-1 transition-all" />
          </button>
        </div>
      </main>

      <footer className="py-6 px-8 text-center text-xs font-semibold text-slate-400 border-t border-slate-200/60 bg-white/50 z-10 relative">
        &copy; {new Date().getFullYear()} Pet Loyalty Solutions &bull; All Rights Reserved.
      </footer>
    </div>
  );
}
