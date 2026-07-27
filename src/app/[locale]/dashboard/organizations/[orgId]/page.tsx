import { getOrganizationDashboardData } from "@/queries/dashboard";
import { CountryDataTable } from "@/components/country-data-table";
import { DashboardFilters } from "@/components/dashboard-filters";
import { Link } from "@/i18n/routing";
import { ArrowLeft, Building2, Sparkles } from "lucide-react";
import { DynamicTimeSeriesAreaChart, DynamicCountryPieChart, DynamicCountryLocationBarChart } from "@/components/charts/dynamic-charts";

export const revalidate = 60; // ISR cache

export default async function OrganizationDashboardPage({ 
  params,
  searchParams,
}: { 
  params: Promise<{ orgId: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;
  
  const orgName = decodeURIComponent(resolvedParams.orgId);
  
  const filters = {
    interval: typeof resolvedSearchParams.interval === 'string' ? resolvedSearchParams.interval : undefined,
    species: typeof resolvedSearchParams.species === 'string' ? resolvedSearchParams.species : undefined,
    year: typeof resolvedSearchParams.year === 'string' ? resolvedSearchParams.year : undefined,
    platform: typeof resolvedSearchParams.platform === 'string' ? resolvedSearchParams.platform : undefined,
    city: typeof resolvedSearchParams.city === 'string' ? resolvedSearchParams.city : undefined,
  };

  const data = await getOrganizationDashboardData(orgName, filters);

  return (
    <div className="flex flex-col gap-8 p-6 md:p-8 max-w-[1600px] mx-auto w-full min-h-screen">
      
      {/* Navigation and Header */}
      <div className="flex flex-col gap-5 border-b border-slate-200/80 pb-6">
        <Link 
          href="/dashboard/cities?tab=organizations" 
          className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500 hover:text-indigo-600 transition-colors w-fit bg-white px-3 py-1.5 rounded-lg border border-slate-200/80 shadow-2xs"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Back to Partner Directory</span>
        </Link>
        
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
          <div className="flex flex-col space-y-1.5">
            <div className="flex items-center gap-3">
              <span className="inline-flex items-center justify-center p-2.5 rounded-2xl bg-purple-50 border border-purple-100 text-purple-700 shadow-2xs">
                <Building2 className="h-7 w-7" />
              </span>
              <div>
                <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900 leading-tight">
                  {orgName}
                </h1>
                <span className="text-sm font-extrabold text-slate-500 block">Verified Partner Organization Telemetry</span>
              </div>
            </div>
            <p className="text-sm sm:text-base text-slate-600 font-medium pt-1">
              Organization-wide historical adoption trajectories, species ratios, and branch location activity.
            </p>
          </div>

          <div className="flex items-center gap-4 shrink-0">
            <div className="flex flex-col items-end bg-purple-700 text-white p-4 px-6 rounded-2xl shadow-sm border border-purple-800 min-w-[180px]">
              <span className="text-xs font-extrabold uppercase tracking-widest text-purple-200 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" />
                Partner Total
              </span>
              <span className="text-3xl sm:text-4xl font-black mt-1 tracking-tight">{data.totalAdoptions.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Analytical Content Grid */}
      <div className="flex flex-col gap-7 w-full">
        <DashboardFilters 
          availableSpecies={data.availableSpecies} 
          availableYears={data.availableYears} 
          availablePlatforms={data.availablePlatforms} 
        />
        
        {/* Full-Width Historical Curve */}
        <div className="w-full">
          <DynamicTimeSeriesAreaChart data={data.timeSeriesData} />
        </div>
        
        {/* 2-Column Analytics Row */}
        <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
          <DynamicCountryPieChart data={data.speciesData} title="Adoptions by Species" filterKey="species" />
          <DynamicCountryPieChart data={data.platformData} title="Origin Channel Distribution" filterKey="platform" />
        </div>
        
        {/* Branch Location Activity */}
        {data.cityData && data.cityData.length > 0 && (
          <div className="w-full">
            <DynamicCountryLocationBarChart data={data.cityData} title="Active Municipal Branches & Cities" filterKey="city" />
          </div>
        )}

        {/* Chronology Ledger */}
        <div className="w-full mt-2">
          <CountryDataTable data={data.recentAdoptions} />
        </div>
      </div>
    </div>
  );
}
