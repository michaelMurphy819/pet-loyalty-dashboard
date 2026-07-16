import { getDashboardData } from "@/queries/dashboard";
import { KPICards } from "@/components/kpi-cards";
import { PlatformPieChart } from "@/components/charts/platform-pie-chart";
import { SpeciesBarChart } from "@/components/charts/species-bar-chart";
import { DashboardFilters } from "@/components/dashboard-filters";
import { TimeSeriesAreaChart } from "@/components/charts/time-series-area-chart";
import { getTranslations } from "next-intl/server";

export const revalidate = 60; // ISR cache revalidation every 60 seconds

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const resolvedSearchParams = await searchParams;
  
  const filters = {
    interval: typeof resolvedSearchParams.interval === 'string' ? resolvedSearchParams.interval : undefined,
    species: typeof resolvedSearchParams.species === 'string' ? resolvedSearchParams.species : undefined,
    year: typeof resolvedSearchParams.year === 'string' ? resolvedSearchParams.year : undefined,
    platform: typeof resolvedSearchParams.platform === 'string' ? resolvedSearchParams.platform : undefined,
  };

  const data = await getDashboardData(filters);
  const t = await getTranslations("Dashboard");

  return (
    <div className="flex flex-col gap-6 p-6 md:p-10 max-w-[1400px] mx-auto">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">{t('title')}</h1>
        <p className="text-slate-500">
          {t('subtitle')}
        </p>
      </div>

      <div className="flex flex-col space-y-6">
        {/* Top Row: KPIs */}
        <KPICards 
          totalAdoptions={data.totalAdoptions} 
          adoptionsThisWeek={data.adoptionsThisWeek} 
          totalAdoptionsDelta={data.totalAdoptionsDelta}
          adoptionsThisWeekDelta={data.adoptionsThisWeekDelta}
        />
        
        {/* Filter Bar */}
        <DashboardFilters 
          availableSpecies={data.availableSpecies} 
          availableYears={data.availableYears} 
          availablePlatforms={data.availablePlatforms} 
        />

        {/* Time Series Area Chart */}
        <TimeSeriesAreaChart data={data.timeSeriesData} />

        {/* Bottom Row: Breakdown Charts */}
        <div className="grid gap-6 md:grid-cols-2">
          <PlatformPieChart data={data.platformData} />
          <SpeciesBarChart data={data.speciesData} />
        </div>
      </div>
    </div>
  );
}
