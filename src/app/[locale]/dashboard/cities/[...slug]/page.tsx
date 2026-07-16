import { getCityDashboardData } from "@/queries/dashboard";
import { TimeSeriesAreaChart } from "@/components/charts/time-series-area-chart";
import { CountryDataTable } from "@/components/country-data-table";
import { CountryPieChart } from "@/components/charts/country-pie-chart";
import { DashboardFilters } from "@/components/dashboard-filters";
import { Link } from "@/i18n/routing";
import { ArrowLeft, MapPin } from "lucide-react";

export const revalidate = 60; // ISR cache

export default async function CityDashboardPage({ 
  params,
  searchParams,
}: { 
  params: Promise<{ slug: string[] }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;
  
  const slug = resolvedParams.slug;
  const countryCode = slug[0];
  const stateCode = slug.length === 3 ? decodeURIComponent(slug[1]) : "none";
  const city = slug.length === 3 ? decodeURIComponent(slug[2]) : decodeURIComponent(slug[1]);
  
  const filters = {
    interval: typeof resolvedSearchParams.interval === 'string' ? resolvedSearchParams.interval : undefined,
    species: typeof resolvedSearchParams.species === 'string' ? resolvedSearchParams.species : undefined,
    year: typeof resolvedSearchParams.year === 'string' ? resolvedSearchParams.year : undefined,
    platform: typeof resolvedSearchParams.platform === 'string' ? resolvedSearchParams.platform : undefined,
  };

  const data = await getCityDashboardData(countryCode, stateCode, city, filters);

  const regionNames = new Intl.DisplayNames(['en'], { type: 'region' });
  let countryName = countryCode;
  try {
    countryName = regionNames.of(countryCode) || countryCode;
  } catch(e) {}

  const locationTitle = stateCode !== "none" && stateCode !== "_" ? `${city}, ${stateCode}` : city;

  return (
    <div className="flex flex-col gap-8 p-6 md:p-10 max-w-[1600px] mx-auto min-h-screen">
      
      {/* Header Area */}
      <div className="flex flex-col gap-4">
        <Link 
          href="/dashboard/cities" 
          className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-indigo-600 transition-colors w-fit group"
        >
          <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
          Back to Regional Directory
        </Link>
        
        <div className="flex flex-col sm:flex-row sm:items-end justify-between border-b border-slate-200 pb-6 gap-6">
          <div className="flex flex-col space-y-1">
            <h1 className="text-4xl font-black tracking-tight text-slate-900 flex items-center gap-3">
              <MapPin className="h-8 w-8 text-indigo-600" />
              {locationTitle} <span className="text-2xl text-slate-400 font-normal">({countryName})</span>
            </h1>
            <p className="text-slate-500 text-lg">
              Hyper-local adoption analytics and raw data export.
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
        
        <TimeSeriesAreaChart data={data.timeSeriesData} />
        
        {/* Breakdowns Row 1: Pie Charts */}
        <div className="grid gap-8 md:grid-cols-2">
          <CountryPieChart data={data.speciesData} title="Adoptions by Species" filterKey="species" />
          <CountryPieChart data={data.platformData} title="Adoptions by Platform" filterKey="platform" />
        </div>

        {/* Raw Data Table at the very bottom */}
        <div className="mt-8">
          <CountryDataTable data={data.recentAdoptions} />
        </div>
      </div>

    </div>
  );
}
