import { getCountryDashboardData } from "@/queries/dashboard";
import { CountryDataTable } from "@/components/country-data-table";
import { DashboardFilters } from "@/components/dashboard-filters";
import Link from "next/link";
import { ArrowLeft, MapPin } from "lucide-react";
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
  };

  const data = await getCountryDashboardData(code, filters);

  const regionNames = new Intl.DisplayNames(['en'], { type: 'region' });
  let countryName = code;
  try {
    countryName = regionNames.of(code) || code;
  } catch(e) {}

  return (
    <div className="flex flex-col gap-8 p-6 md:p-10 max-w-[1600px] mx-auto min-h-screen">
      
      {/* Header Area */}
      <div className="flex flex-col gap-4">
        <Link 
          href="/dashboard/map" 
          className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-indigo-600 transition-colors w-fit group"
        >
          <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
          Back to Global Map
        </Link>
        
        <div className="flex flex-col sm:flex-row sm:items-end justify-between border-b border-slate-200 pb-6 gap-6">
          <div className="flex flex-col space-y-1">
            <h1 className="text-4xl font-black tracking-tight text-slate-900 flex items-center gap-3">
              <MapPin className="h-8 w-8 text-indigo-600" />
              {countryName}
            </h1>
            <p className="text-slate-500 text-lg">
              Regional adoption analytics and raw data export.
            </p>
          </div>
          <div className="flex flex-col items-end text-right bg-indigo-50/50 p-4 rounded-xl border border-indigo-100 shadow-sm w-full sm:w-auto">
            <span className="text-sm font-bold text-indigo-600 uppercase tracking-widest">Total Adoptions</span>
            <span className="text-4xl font-black text-indigo-900">{data.totalAdoptions.toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-8 grid-cols-1">
        <DashboardFilters 
          availableSpecies={data.availableSpecies} 
          availableYears={data.availableYears} 
          availablePlatforms={data.availablePlatforms} 
        />
        <div className="col-span-full">
          <DynamicTimeSeriesAreaChart data={data.timeSeriesData} />
        </div>
        
        {/* Breakdown Charts */}
        <div className="grid gap-6 md:grid-cols-2">
          <DynamicCountryPieChart data={data.speciesData} title="Species Breakdown" />
          <DynamicCountryPieChart data={data.platformData} title="Platform Distribution" />
        </div>
        
        <div className="grid gap-6 md:grid-cols-2">
          <DynamicCountryLocationBarChart data={data.cityData} title="Top Cities" />
          <DynamicCountryLocationBarChart data={data.shelterData} title="Top Shelters" />
        </div>

        {/* Raw Data Table at the very bottom */}
        <div className="mt-8">
          <CountryDataTable data={data.recentAdoptions} />
        </div>
      </div>

    </div>
  );
}
