"use client";

import { useState, useRef, useEffect } from "react";
import { User, LogOut, ChevronDown } from "lucide-react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";

export function UserMenu({ role }: { role: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const t = useTranslations("Dashboard.auth");
  const router = useRouter();
  const menuRef = useRef<HTMLDivElement>(null);

  const displayRole = role === "admin" ? t("roleAdmin") : t("roleStaff");

  const handleSignOut = () => {
    document.cookie = "pet_loyalty_role=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT";
    router.push("/");
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={menuRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 hover:bg-slate-50 p-1 pr-3 rounded-full transition-colors border border-transparent hover:border-slate-200"
      >
        <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-indigo-100 to-violet-100 border border-indigo-200 flex items-center justify-center shadow-sm">
          <User className="h-5 w-5 text-indigo-700" />
        </div>
        <div className="flex flex-col items-start hidden sm:flex">
          <span className="text-xs font-semibold text-slate-700">{displayRole}</span>
          <span className="text-[10px] text-slate-400 uppercase tracking-wider">{t("signedInAs")}</span>
        </div>
        <ChevronDown className={`h-4 w-4 text-slate-400 ml-1 transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-slate-100 py-2 z-50 animate-in fade-in slide-in-from-top-2">
          <div className="px-4 py-2 border-b border-slate-100 mb-1">
            <p className="text-sm font-medium text-slate-900">{displayRole}</p>
            <p className="text-xs text-slate-500">petloyalty.org</p>
          </div>
          <button 
            onClick={handleSignOut}
            className="w-full flex items-center gap-2 px-4 py-2 text-sm text-rose-600 hover:bg-rose-50 transition-colors text-left font-medium"
          >
            <LogOut className="h-4 w-4" />
            {t("signOut")}
          </button>
        </div>
      )}
    </div>
  );
}
