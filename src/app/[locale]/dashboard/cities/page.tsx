import { getCityDirectoryData, getOrganizationDirectoryData } from "@/queries/dashboard";
import { getTranslations } from "next-intl/server";
import { Card } from "@/components/ui/card";
import { DownloadCsvButton } from "@/components/download-csv-button";
import { cookies } from "next/headers";
import { Link } from "@/i18n/routing";
import { DirectoryTable } from "@/components/directory-table";
import { MapPin, Building2, BookOpen, ExternalLink, Sparkles } from "lucide-react";

export const revalidate = 60;

export default async function RegionalDirectoryPage({ searchParams }: { searchParams: Promise<{ tab?: string }> }) {
  const resolvedParams = await searchParams;
  const activeTab = resolvedParams.tab === "organizations" ? "organizations" : "cities";

  const cityData = await getCityDirectoryData();
  const orgData = await getOrganizationDirectoryData();
  const t = await getTranslations("Dashboard.directory");
  const cookieStore = await cookies();
  const role = cookieStore.get("pet_loyalty_role")?.value || "staff";

  const translations = {
    city: t("columns.city"),
    state: t("columns.state"),
    country: t("columns.country"),
    totalAdoptions: t("columns.totalAdoptions"),
    latestAdoption: t("columns.latestAdoption"),
  };

  return (
    <div className="flex flex-col gap-6 p-6 md:p-8 max-w-[1600px] mx-auto w-full">
      {/* Header Area */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between border-b border-slate-200/80 pb-5 gap-4">
        <div className="flex flex-col space-y-1">
          <div className="flex items-center gap-2.5">
            <span className="inline-flex items-center justify-center p-2 rounded-xl bg-indigo-50 border border-indigo-100 text-indigo-700 shadow-2xs">
              <BookOpen className="w-6 h-6" />
            </span>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-slate-900">{t("title")}</h1>
          </div>
          <p className="text-sm text-slate-600 font-medium ml-1">
            {t("subtitle")} &mdash; Switch tabs below between municipal regions and verified partner rescue network organizations.
          </p>
        </div>
        
        {role === "admin" && (
          <div className="shrink-0">
            <DownloadCsvButton 
              data={activeTab === "cities" ? cityData : orgData} 
              label={t("downloadCsv")} 
            />
          </div>
        )}
      </div>

      {/* Modern Tab Pills Navigation */}
      <div className="flex items-center gap-2 bg-slate-200/60 p-1.5 rounded-2xl w-fit border border-slate-200/80 shadow-2xs">
        <Link 
          href="?tab=cities" 
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition-all duration-150 ${
            activeTab === "cities" 
              ? "bg-white text-indigo-700 shadow-sm border border-slate-200/80" 
              : "text-slate-600 hover:text-slate-900 hover:bg-white/50"
          }`}
        >
          <MapPin className="w-4 h-4 text-indigo-600 shrink-0" />
          <span>Municipalities & Cities</span>
          <span className={`px-2 py-0.5 rounded-md text-[11px] font-extrabold ${activeTab === "cities" ? "bg-indigo-50 text-indigo-800" : "bg-slate-300/60 text-slate-700"}`}>
            {cityData.length}
          </span>
        </Link>
        
        <Link 
          href="?tab=organizations" 
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition-all duration-150 ${
            activeTab === "organizations" 
              ? "bg-white text-indigo-700 shadow-sm border border-slate-200/80" 
              : "text-slate-600 hover:text-slate-900 hover:bg-white/50"
          }`}
        >
          <Building2 className="w-4 h-4 text-indigo-600 shrink-0" />
          <span>Partner Organizations & Shelters</span>
          <span className={`px-2 py-0.5 rounded-md text-[11px] font-extrabold ${activeTab === "organizations" ? "bg-indigo-50 text-indigo-800" : "bg-slate-300/60 text-slate-700"}`}>
            {orgData.length}
          </span>
        </Link>
      </div>

      <Card className="shadow-sm border border-slate-200/80 rounded-2xl overflow-hidden bg-white">
        <div className="bg-indigo-50/70 border-b border-indigo-100/80 px-6 py-3.5 flex items-center justify-between">
          <p className="text-xs sm:text-sm font-medium text-slate-700 flex items-center gap-2">
            <span className="p-1 rounded bg-indigo-600 text-white font-bold shrink-0">
              <Sparkles className="w-3.5 h-3.5" />
            </span>
            <span>
              <span className="font-extrabold text-indigo-900 mr-1">Interactive Telemetry:</span> 
              Click on any {activeTab === "cities" ? "city" : "organization"} name in the directory ledger below to open its dedicated hyper-local adoption analytics workspace.
            </span>
          </p>
        </div>
        
        <DirectoryTable 
          data={activeTab === "cities" ? cityData : orgData} 
          type={activeTab} 
          translations={translations} 
        />
      </Card>
    </div>
  );
}
