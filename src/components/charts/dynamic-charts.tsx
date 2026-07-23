"use client";

import dynamic from "next/dynamic";

export const DynamicTimeSeriesAreaChart = dynamic(
  () => import("@/components/charts/time-series-area-chart").then(mod => mod.TimeSeriesAreaChart), 
  { ssr: false, loading: () => <div className="h-[400px] w-full animate-pulse bg-slate-100 rounded-xl" /> }
);

export const DynamicPlatformPieChart = dynamic(
  () => import("@/components/charts/platform-pie-chart").then(mod => mod.PlatformPieChart), 
  { ssr: false, loading: () => <div className="h-[300px] w-full animate-pulse bg-slate-100 rounded-xl" /> }
);

export const DynamicSpeciesBarChart = dynamic(
  () => import("@/components/charts/species-bar-chart").then(mod => mod.SpeciesBarChart), 
  { ssr: false, loading: () => <div className="h-[300px] w-full animate-pulse bg-slate-100 rounded-xl" /> }
);

export const DynamicCountryPieChart = dynamic(
  () => import("@/components/charts/country-pie-chart").then(mod => mod.CountryPieChart), 
  { ssr: false, loading: () => <div className="h-[300px] w-full animate-pulse bg-slate-100 rounded-xl" /> }
);

export const DynamicCountryLocationBarChart = dynamic(
  () => import("@/components/charts/country-location-bar-chart").then(mod => mod.CountryLocationBarChart), 
  { ssr: false, loading: () => <div className="h-[300px] w-full animate-pulse bg-slate-100 rounded-xl" /> }
);
