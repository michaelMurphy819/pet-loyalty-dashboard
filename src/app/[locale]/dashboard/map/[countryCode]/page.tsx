import { getCountryDashboardData } from "@/queries/dashboard";
import { CountryDataTable } from "@/components/country-data-table";
import { DashboardFilters } from "@/components/dashboard-filters";
import Link from "next/link";
import { ArrowLeft, Globe, Sparkles } from "lucide-react";
import { DynamicTimeSeriesAreaChart, DynamicCountryPieChart, DynamicCountryLocationBarChart } from "@/components/charts/dynamic-charts";

export const revalidate = 60; // ISR cache

export default async function CountryDashboardPage({ 
  params,
  searchParams,
}: { 
  params: Promise<{ countryCode: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;
  
  const code = resolvedParams.countryCode.toUpperCase();
  
  const filters = {
    interval: typeof resolvedSearchParams.interval === 'string' ? resolvedSearchParams.interval : undefined,
    species: typeof resolvedSearchParams.species === 'string' ? resolvedSearchParams.species : undefined,
    year: typeof resolvedSearchParams.year === 'string' ? resolvedSearchParams.year : undefined,
    platform: typeof resolvedSearchParams.platform === 'string' ? resolvedSearchParams.platform : undefined,
    city: typeof resolvedSearchParams.city === 'string' ? resolvedSearchParams.city : undefined,
    shelter: typeof resolvedSearchParams.shelter === 'string' ? resolvedSearchParams.shelter : undefined,
  };

  const data = await getCountryDashboardData(code, filters);

  const regionNames = new Intl.DisplayNames(['en'], { type: 'region' });
  let countryName = code;
  try {
    countryName = regionNames.of(code) || code;
  } catch(e) {}

  return (
    <div className="flex flex-col gap-8 p-6 md:p-8 max-w-[1600px] mx-auto w-full min-h-screen">
      
      {/* Navigation and Header */}
      <div className="flex flex-col gap-5 border-b border-slate-200/80 pb-6">
        <Link 
          href="/dashboard/map" 
          className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500 hover:text-indigo-600 transition-colors w-fit bg-white px-3 py-1.5 rounded-lg border border-slate-200/80 shadow-2xs"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Back to Global Map</span>
        </Link>
        
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
          <div className="flex flex-col space-y-1.5">
            <div className="flex items-center gap-3">
              <span className="inline-flex items-center justify-center p-2.5 rounded-2xl bg-emerald-50 border border-emerald-100 text-emerald-700 shadow-2xs">
                <Globe className="h-7 w-7" />
              </span>
              <div>
                <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900 leading-tight">
                  {countryName}
                </h1>
                <span className="text-sm font-extrabold text-slate-500 block">National Telemetry & Territory Aggregation</span>
              </div>
            </div>
            <p className="text-sm sm:text-base text-slate-600 font-medium pt-1">
              National adoption velocity curves, municipal rankings, and verified cross-channel distribution.
            </p>
          </div>

          <div className="flex items-center gap-4 shrink-0">
            <div className="flex flex-col items-end bg-emerald-700 text-white p-4 px-6 rounded-2xl shadow-sm border border-emerald-800 min-w-[180px]">
              <span className="text-xs font-extrabold uppercase tracking-widest text-emerald-100 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" />
                Total Adoptions
              </span>
              <span className="text-3xl sm:text-4xl font-black mt-1 tracking-tight">{data.totalAdoptions.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Analytical Grid */}
      <div className="flex flex-col gap-7 w-full">
        <DashboardFilters 
          availableSpecies={data.availableSpecies} 
          availableYears={data.availableYears} 
          availablePlatforms={data.availablePlatforms} 
        />
        
        {/* Full-width Time Series */}
        <div className="w-full">
          <DynamicTimeSeriesAreaChart data={data.timeSeriesData} />
        </div>
        
        {/* 2-Column Pie Breakdowns */}
        <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
          <DynamicCountryPieChart data={data.speciesData} title="Species Breakdown" filterKey="species" />
          <DynamicCountryPieChart data={data.platformData} title="Channel & Platform Distribution" filterKey="platform" />
        </div>
        
        {/* 2-Column Rankings Breakdowns */}
        <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
          <DynamicCountryLocationBarChart data={data.cityData} title="Top Municipal Areas" filterKey="city" />
          <DynamicCountryLocationBarChart data={data.shelterData} title="Top Partner Shelters" filterKey="shelter" />
        </div>

        {/* Raw Ledger Table */}
        <div className="w-full mt-2">
          <CountryDataTable data={data.recentAdoptions} />
        </div>
      </div>
    </div>
  );
}
