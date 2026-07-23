import { getCityDirectoryData, getOrganizationDirectoryData } from "@/queries/dashboard";
import { getTranslations } from "next-intl/server";
import { Card } from "@/components/ui/card";
import { DownloadCsvButton } from "@/components/download-csv-button";
import { cookies } from "next/headers";
import { Link } from "@/i18n/routing";
import { DirectoryTable } from "@/components/directory-table";

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
    <div className="flex flex-col gap-6 p-6 md:p-10 max-w-[1400px] mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex flex-col space-y-2">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">{t("title")}</h1>
          <p className="text-slate-500">
            {t("subtitle")}
          </p>
        </div>
        {role === "admin" && (
          <DownloadCsvButton 
            data={activeTab === "cities" ? cityData : orgData} 
            label={t("downloadCsv")} 
          />
        )}
      </div>

      <div className="flex gap-4 border-b border-slate-200 mb-2">
        <Link 
          href="?tab=cities" 
          className={`pb-3 px-1 font-medium text-sm transition-colors border-b-2 ${activeTab === "cities" ? "border-indigo-600 text-indigo-600" : "border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300"}`}
        >
          Cities
        </Link>
        <Link 
          href="?tab=organizations" 
          className={`pb-3 px-1 font-medium text-sm transition-colors border-b-2 ${activeTab === "organizations" ? "border-indigo-600 text-indigo-600" : "border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300"}`}
        >
          Organizations
        </Link>
      </div>

      <Card className="shadow-sm border-slate-200 overflow-hidden">
        <div className="bg-indigo-50/50 border-b border-slate-200 px-6 py-3">
          <p className="text-sm text-slate-600 flex items-center">
            <span className="font-semibold text-indigo-700 mr-1">Tip:</span> 
            Click on any {activeTab === "cities" ? "city" : "organization"} name in the table below to view its detailed, hyper-local adoption dashboard.
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
