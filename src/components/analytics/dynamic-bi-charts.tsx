"use client";

import dynamic from "next/dynamic";
import React from "react";

const StandardFallbackSkeleton = () => (
  <div className="h-[380px] w-full animate-pulse bg-white rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between p-5">
    <div className="h-6 w-48 bg-slate-100 rounded-md mb-4" />
    <div className="flex-1 bg-slate-50/80 rounded-xl my-2" />
    <div className="h-4 w-32 bg-slate-100 rounded-md mx-auto" />
  </div>
);

const ShortFallbackSkeleton = () => (
  <div className="h-[190px] w-full animate-pulse bg-white rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between p-4">
    <div className="h-5 w-48 bg-slate-100 rounded-md" />
    <div className="flex-1 bg-slate-50/80 rounded-xl my-2" />
  </div>
);

export const DynamicLocationLeaderboardChart = dynamic(
  () => import("@/components/analytics/location-leaderboard-chart").then((mod) => mod.LocationLeaderboardChart),
  { ssr: false, loading: StandardFallbackSkeleton }
);

export const DynamicOrganizationsDataTable = dynamic(
  () => import("@/components/analytics/organizations-data-table").then((mod) => mod.OrganizationsDataTable),
  { ssr: false, loading: StandardFallbackSkeleton }
);

export const DynamicPlatformDominanceChart = dynamic(
  () => import("@/components/analytics/platform-dominance-chart").then((mod) => mod.PlatformDominanceChart),
  { ssr: false, loading: StandardFallbackSkeleton }
);

export const DynamicBreedsLeaderboardChart = dynamic(
  () => import("@/components/analytics/dynamic-breeds-leaderboard").then((mod) => mod.DynamicBreedsLeaderboard),
  { ssr: false, loading: StandardFallbackSkeleton }
);

export const DynamicDayOfWeekHeatmap = dynamic(
  () => import("@/components/analytics/day-of-week-heatmap").then((mod) => mod.DayOfWeekHeatmap),
  { ssr: false, loading: ShortFallbackSkeleton }
);

export const DynamicAdoptionsOverTimeWithMovingAvg = dynamic(
  () => import("@/components/analytics/moving-average-time-series").then((mod) => mod.AdoptionsOverTimeWithMovingAvg),
  { ssr: false, loading: StandardFallbackSkeleton }
);
