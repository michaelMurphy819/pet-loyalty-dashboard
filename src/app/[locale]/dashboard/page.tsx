import { getDashboardData } from "@/queries/dashboard";
import { KPICards } from "@/components/kpi-cards";
import { DashboardFilters } from "@/components/dashboard-filters";
import { getTranslations } from "next-intl/server";
import { DynamicPlatformPieChart, DynamicSpeciesBarChart } from "@/components/charts/dynamic-charts";
import {
  DynamicLocationLeaderboardChart,
  DynamicOrganizationsDataTable,
  DynamicPlatformDominanceChart,
  DynamicBreedsLeaderboardChart,
  DynamicDayOfWeekHeatmap,
  DynamicAdoptionsOverTimeWithMovingAvg,
} from "@/components/analytics/dynamic-bi-charts";

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
    <div className="flex flex-col gap-6 sm:gap-8 p-3 sm:p-5 md:p-8 max-w-[1600px] mx-auto min-w-0 w-full overflow-x-hidden bg-slate-50/70">
      {/* Page Header */}
      <div className="flex flex-col space-y-1 border-b border-slate-200/80 pb-3 sm:pb-4">
        <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold tracking-tight text-slate-900 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
          {t('title')}
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 font-medium">
          {t('subtitle')} &mdash; Click any slice, chart column, or tag to dynamically cross-filter all analytics.
        </p>
      </div>

      <div className="flex flex-col space-y-5 sm:space-y-7 w-full min-w-0">
        {/* Top Row: Executive KPIs & Interactive Filters */}
        <div className="flex flex-col gap-4">
          <KPICards 
            totalAdoptions={data.totalAdoptions} 
            adoptionsThisWeek={data.adoptionsThisWeek} 
            totalAdoptionsDelta={data.totalAdoptionsDelta}
            adoptionsThisWeekDelta={data.adoptionsThisWeekDelta}
          />
          <DashboardFilters 
            availableSpecies={data.availableSpecies} 
            availableYears={data.availableYears} 
            availablePlatforms={data.availablePlatforms} 
          />
        </div>

        {/* Row 1 (Full Width): Adoptions Over Time */}
        <div className="w-full min-w-0">
          <DynamicAdoptionsOverTimeWithMovingAvg />
        </div>

        {/* Row 2 (Full Width, Compact & Short): Day of Week Volume Heatmap */}
        <div className="w-full min-w-0">
          <DynamicDayOfWeekHeatmap />
        </div>

        {/* Row 3: Channel Market Share & Regional Dominance (1 Col on Mobile <640px, Strict 2 Cols on Tablet & Desktop >=640px) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 min-w-0 w-full items-stretch">
          <div className="min-w-0 w-full overflow-hidden">
            <DynamicPlatformPieChart data={data.platformData} />
          </div>
          <div className="min-w-0 w-full overflow-hidden">
            <DynamicPlatformDominanceChart />
          </div>
        </div>

        {/* Row 4: Species Distribution & Primary Breed Analytics (1 Col on Mobile <640px, Strict 2 Cols on Tablet & Desktop >=640px) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 min-w-0 w-full items-stretch">
          <div className="min-w-0 w-full overflow-hidden">
            <DynamicSpeciesBarChart data={data.speciesData} />
          </div>
          <div className="min-w-0 w-full overflow-hidden">
            <DynamicBreedsLeaderboardChart selectedSpecies={filters.species} />
          </div>
        </div>

        {/* Row 5: Geographic Municipalities & Rescue Partner Directory (1 Col on Mobile <640px, Strict 2 Cols on Tablet & Desktop >=640px) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 min-w-0 w-full items-stretch">
          <div className="min-w-0 w-full overflow-hidden">
            <DynamicLocationLeaderboardChart />
          </div>
          <div className="min-w-0 w-full overflow-hidden">
            <DynamicOrganizationsDataTable />
          </div>
        </div>
      </div>
    </div>
  );
}
