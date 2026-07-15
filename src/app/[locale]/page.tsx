"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { ArrowRight, ShieldCheck, User } from "lucide-react";
import { LanguageSwitcher } from "@/components/language-switcher";

export default function LandingPage() {
  const t = useTranslations("Dashboard.landing");
  const router = useRouter();

  const handleLogin = (role: "admin" | "staff") => {
    // Set a simulated secure cookie
    document.cookie = `pet_loyalty_role=${role}; path=/; max-age=86400; SameSite=Lax`;
    router.push("/dashboard");
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none z-0">
        <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-indigo-100/40 blur-3xl"></div>
        <div className="absolute top-[60%] -right-[10%] w-[40%] h-[60%] rounded-full bg-emerald-50/60 blur-3xl"></div>
      </div>

      {/* Header */}
      <header className="w-full p-6 flex justify-between items-center z-10 relative">
        <div className="flex items-center gap-3">
          <div className="relative h-10 w-10 overflow-hidden rounded-xl bg-white border border-slate-100 shadow-sm flex items-center justify-center p-1">
            <Image 
              src="/logo.jpeg" 
              alt="Pet Loyalty Logo" 
              width={32}
              height={32}
              className="object-contain"
            />
          </div>
          <span className="text-xl font-black tracking-tight text-slate-900">Pet Loyalty</span>
        </div>
        <LanguageSwitcher />
      </header>

      {/* Main Hero */}
      <main className="flex-1 flex flex-col items-center justify-center p-6 text-center z-10 relative mt-16">
        <div className="max-w-2xl space-y-8">
          <h1 className="text-5xl font-black tracking-tight text-slate-900 leading-tight">
            {t("title")}
          </h1>
          <p className="text-lg text-slate-600 max-w-xl mx-auto leading-relaxed">
            {t("subtitle")}
          </p>

          <div className="pt-8 flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button 
              onClick={() => handleLogin("staff")}
              className="group w-full sm:w-64 flex items-center justify-between px-6 py-4 bg-white border border-slate-200 hover:border-indigo-300 rounded-2xl shadow-sm hover:shadow-md transition-all duration-200"
            >
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center group-hover:bg-indigo-50 transition-colors">
                  <User className="h-5 w-5 text-slate-600 group-hover:text-indigo-600" />
                </div>
                <span className="font-semibold text-slate-700 group-hover:text-indigo-900">{t("loginStaff")}</span>
              </div>
              <ArrowRight className="h-4 w-4 text-slate-400 group-hover:text-indigo-600 group-hover:translate-x-1 transition-all" />
            </button>

            <button 
              onClick={() => handleLogin("admin")}
              className="group w-full sm:w-64 flex items-center justify-between px-6 py-4 bg-slate-900 hover:bg-indigo-950 border border-transparent rounded-2xl shadow-md hover:shadow-lg transition-all duration-200"
            >
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-slate-800 flex items-center justify-center group-hover:bg-indigo-900 transition-colors">
                  <ShieldCheck className="h-5 w-5 text-white" />
                </div>
                <span className="font-semibold text-white">{t("loginAdmin")}</span>
              </div>
              <ArrowRight className="h-4 w-4 text-slate-400 group-hover:text-white group-hover:translate-x-1 transition-all" />
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
