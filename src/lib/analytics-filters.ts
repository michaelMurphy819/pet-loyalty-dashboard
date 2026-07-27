import { eq, and, sql, SQL } from "drizzle-orm";
import { petAdoptions, mvDashboardSummary } from "@/lib/db/schema";

/**
 * Generates SQL conditions for the raw pet_adoptions table.
 * Optimized to use indexed B-tree date range comparisons instead of slow unindexed EXTRACT() scans.
 */
export function getRawSqlWhere(searchParams: URLSearchParams): SQL {
  let condition = sql`1=1`;
  const species = searchParams.get("species");
  const platform = searchParams.get("platform");
  const year = searchParams.get("year");
  const city = searchParams.get("city");
  const shelter = searchParams.get("shelter") || searchParams.get("organization");
  const breed = searchParams.get("breed");

  if (species && species !== "all" && species !== "Other" && species !== "other") {
    condition = sql`${condition} AND species = ${species}`;
  }
  if (platform && platform !== "all" && platform !== "Other" && platform !== "other") {
    condition = sql`${condition} AND platform = ${platform}`;
  }
  if (year && year !== "all") {
    const startOfYear = `${year}-01-01 00:00:00`;
    const endOfYear = `${year}-12-31 23:59:59.999`;
    condition = sql`${condition} AND adoption_timestamp >= ${startOfYear}::timestamp AND adoption_timestamp <= ${endOfYear}::timestamp`;
  }
  if (city && city !== "all") {
    condition = sql`${condition} AND city = ${city}`;
  }
  if (shelter && shelter !== "all") {
    condition = sql`${condition} AND organization_name = ${shelter}`;
  }
  if (breed && breed !== "all") {
    condition = sql`${condition} AND primary_breed = ${breed}`;
  }

  return condition;
}

/**
 * Generates hyper-fast SQL conditions tailored for the pre-aggregated mv_dashboard_summary materialized view.
 */
export function getSummarySqlWhere(searchParams: URLSearchParams): SQL {
  let condition = sql`1=1`;
  const species = searchParams.get("species");
  const platform = searchParams.get("platform");
  const year = searchParams.get("year");
  const city = searchParams.get("city");
  const shelter = searchParams.get("shelter") || searchParams.get("organization");

  if (species && species !== "all" && species !== "Other" && species !== "other") {
    condition = sql`${condition} AND species = ${species}`;
  }
  if (platform && platform !== "all" && platform !== "Other" && platform !== "other") {
    condition = sql`${condition} AND platform = ${platform}`;
  }
  if (year && year !== "all") {
    condition = sql`${condition} AND adoption_year = ${Number(year)}`;
  }
  if (city && city !== "all") {
    condition = sql`${condition} AND city = ${city}`;
  }
  if (shelter && shelter !== "all") {
    condition = sql`${condition} AND organization_name = ${shelter}`;
  }

  return condition;
}
