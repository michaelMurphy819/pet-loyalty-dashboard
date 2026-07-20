import { getCityDirectoryData, getOrganizationDirectoryData } from "@/queries/dashboard";
import { getTranslations } from "next-intl/server";
import { Card } from "@/components/ui/card";
import { DownloadCsvButton } from "@/components/download-csv-button";
import { cookies } from "next/headers";
import { Link } from "@/i18n/routing";

export const revalidate = 60;

export default async function RegionalDirectoryPage({ searchParams }: { searchParams: Promise<{ tab?: string }> }) {
  const resolvedParams = await searchParams;
  const activeTab = resolvedParams.tab === "organizations" ? "organizations" : "cities";

  const cityData = await getCityDirectoryData();
  const orgData = await getOrganizationDirectoryData();
  const t = await getTranslations("Dashboard.directory");
  const cookieStore = await cookies();
  const role = cookieStore.get("pet_loyalty_role")?.value || "staff";

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
        <div className="overflow-x-auto">
          {activeTab === "cities" ? (
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-slate-500 uppercase bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-4 font-bold">{t("columns.city")}</th>
                  <th className="px-6 py-4 font-bold">{t("columns.state")}</th>
                  <th className="px-6 py-4 font-bold">{t("columns.country")}</th>
                  <th className="px-6 py-4 font-bold">{t("columns.totalAdoptions")}</th>
                  <th className="px-6 py-4 font-bold">{t("columns.latestAdoption")}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {cityData.map((row, i) => (
                  <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 font-medium text-slate-900">
                      <Link href={`/dashboard/cities/${row.country}/${encodeURIComponent(row.state || '_')}/${encodeURIComponent(row.city || '')}`} className="text-indigo-600 hover:underline">
                        {row.city}
                      </Link>
                    </td>
                    <td className="px-6 py-4 text-slate-600">{row.state || "-"}</td>
                    <td className="px-6 py-4 text-slate-600 font-medium">{row.country}</td>
                    <td className="px-6 py-4 text-indigo-600 font-semibold">{row.totalAdoptions}</td>
                    <td className="px-6 py-4 text-slate-500">
                      {row.latestAdoption ? new Date(row.latestAdoption).toLocaleDateString() : "-"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-slate-500 uppercase bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-4 font-bold">Organization Name</th>
                  <th className="px-6 py-4 font-bold">{t("columns.totalAdoptions")}</th>
                  <th className="px-6 py-4 font-bold">{t("columns.latestAdoption")}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {orgData.map((row, i) => (
                  <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 font-medium text-slate-900">
                      <Link href={`/dashboard/organizations/${encodeURIComponent(row.organizationName || '')}`} className="text-indigo-600 hover:underline">
                        {row.organizationName}
                      </Link>
                    </td>
                    <td className="px-6 py-4 text-indigo-600 font-semibold">{row.totalAdoptions}</td>
                    <td className="px-6 py-4 text-slate-500">
                      {row.latestAdoption ? new Date(row.latestAdoption).toLocaleDateString() : "-"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          {((activeTab === "cities" && cityData.length === 0) || (activeTab === "organizations" && orgData.length === 0)) && (
            <div className="p-8 text-center text-slate-500">
              No data available
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
