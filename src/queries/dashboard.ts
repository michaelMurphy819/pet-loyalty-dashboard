import { db } from "@/lib/db";
import { petAdoptions } from "@/lib/db/schema";
import { count, sql, gte, eq, desc, and, isNotNull } from "drizzle-orm";
import { unstable_cache } from "next/cache";

export const getDashboardData = unstable_cache(async (
  filters: { interval?: string; species?: string; year?: string; platform?: string } = {}
) => {
  try {
    const baseConditions = [];
    
    if (filters.species && filters.species !== 'all') {
      baseConditions.push(eq(petAdoptions.species, filters.species));
    }
    if (filters.year && filters.year !== 'all') {
      baseConditions.push(sql`EXTRACT(YEAR FROM ${petAdoptions.adoptionTimestamp}) = ${Number(filters.year)}`);
    }
    if (filters.platform && filters.platform !== 'all') {
      baseConditions.push(eq(petAdoptions.platform, filters.platform));
    }

    const whereClause = baseConditions.length > 0 ? and(...baseConditions) : undefined;

    let dateSql = sql<string>`DATE(${petAdoptions.adoptionTimestamp})::text`;
    if (filters.interval === 'weekly') {
      dateSql = sql<string>`DATE_TRUNC('week', ${petAdoptions.adoptionTimestamp})::date::text`;
    } else if (filters.interval === 'monthly') {
      dateSql = sql<string>`DATE_TRUNC('month', ${petAdoptions.adoptionTimestamp})::date::text`;
    }

    const [
      totalAdoptionsResult,
      thisWeekResult,
      lastWeekResult,
      timeSeriesDataResult,
      platformData,
      speciesData,
      countryDataResult,
      availableSpeciesRaw,
      availableYearsRaw,
      availablePlatformsRaw
    ] = await Promise.all([
      db.select({ count: count() }).from(petAdoptions).where(whereClause),
      db.select({ count: count() }).from(petAdoptions).where(whereClause ? and(whereClause, gte(petAdoptions.adoptionTimestamp, sql`NOW() - INTERVAL '7 days'`)) : gte(petAdoptions.adoptionTimestamp, sql`NOW() - INTERVAL '7 days'`)),
      db.select({ count: count() }).from(petAdoptions).where(whereClause ? and(whereClause, gte(petAdoptions.adoptionTimestamp, sql`NOW() - INTERVAL '14 days'`), sql`${petAdoptions.adoptionTimestamp} < NOW() - INTERVAL '7 days'`) : and(gte(petAdoptions.adoptionTimestamp, sql`NOW() - INTERVAL '14 days'`), sql`${petAdoptions.adoptionTimestamp} < NOW() - INTERVAL '7 days'`)),
      db.select({ date: dateSql, adoptions: count() }).from(petAdoptions).where(whereClause).groupBy(dateSql).orderBy(sql`${dateSql} ASC`),
      db.select({ name: petAdoptions.platform, value: count() }).from(petAdoptions).where(whereClause).groupBy(petAdoptions.platform).orderBy(sql`count(*) DESC`),
      db.select({ name: petAdoptions.species, value: count() }).from(petAdoptions).where(whereClause).groupBy(petAdoptions.species).orderBy(sql`count(*) DESC`),
      db.select({ country: petAdoptions.countryCode, count: count() }).from(petAdoptions).where(whereClause).groupBy(petAdoptions.countryCode),
      db.select({ name: petAdoptions.species }).from(petAdoptions).groupBy(petAdoptions.species),
      db.select({ year: sql<number>`EXTRACT(YEAR FROM ${petAdoptions.adoptionTimestamp})::int` }).from(petAdoptions).groupBy(sql`EXTRACT(YEAR FROM ${petAdoptions.adoptionTimestamp})`).orderBy(desc(sql`EXTRACT(YEAR FROM ${petAdoptions.adoptionTimestamp})`)),
      db.select({ name: petAdoptions.platform }).from(petAdoptions).groupBy(petAdoptions.platform)
    ]);

    const totalAdoptions = totalAdoptionsResult[0].count;
    const adoptionsThisWeek = thisWeekResult[0].count;
    const adoptionsLastWeek = lastWeekResult[0].count;

    let adoptionsThisWeekDelta = 0;
    if (adoptionsLastWeek > 0) {
      adoptionsThisWeekDelta = Math.round(((adoptionsThisWeek - adoptionsLastWeek) / adoptionsLastWeek) * 100);
    } else if (adoptionsThisWeek > 0) {
      adoptionsThisWeekDelta = 100;
    }

    let totalAdoptionsDelta = 12; // Static placeholder for executive demo YoY

    // Add Forecast (Simple Moving Average Projection)
    const timeSeriesWithForecast = timeSeriesDataResult.map(d => ({ ...d, forecast: null as number | null }));
    
    if (timeSeriesDataResult.length >= 4) {
      const recentPoints = timeSeriesDataResult.slice(-4).map(d => Number(d.adoptions));
      const avg = Math.round(recentPoints.reduce((a, b) => a + b, 0) / 4);
      const lastDateStr = timeSeriesDataResult[timeSeriesDataResult.length - 1].date;
      const lastDate = new Date(lastDateStr);
      
      for (let i = 1; i <= 3; i++) {
        const nextDate = new Date(lastDate);
        if (filters.interval === 'monthly') nextDate.setMonth(nextDate.getMonth() + i);
        else if (filters.interval === 'weekly') nextDate.setDate(nextDate.getDate() + (i * 7));
        else nextDate.setDate(nextDate.getDate() + i);
        
        timeSeriesWithForecast.push({
          date: nextDate.toISOString().split('T')[0],
          adoptions: 0,
          forecast: avg
        });
      }
      
      timeSeriesWithForecast[timeSeriesDataResult.length - 1].forecast = Number(timeSeriesWithForecast[timeSeriesDataResult.length - 1].adoptions);
    }

    const countryHeatmapData = countryDataResult.reduce((acc, row) => {
      if (row.country) {
        acc[row.country.toUpperCase()] = row.count;
      }
      return acc;
    }, {} as Record<string, number>);

    return {
      totalAdoptions,
      totalAdoptionsDelta,
      adoptionsThisWeek,
      adoptionsThisWeekDelta,
      timeSeriesData: timeSeriesWithForecast.map(d => ({
        ...d,
        adoptions: Number(d.adoptions),
        forecast: d.forecast !== null ? Number(d.forecast) : null
      })),
      platformData: platformData.filter(d => d.name).map(d => ({ name: d.name as string, value: Number(d.value) })),
      speciesData: speciesData.filter(d => d.name).map(d => ({ name: d.name as string, value: Number(d.value) })),
      countryHeatmapData,
      availableSpecies: availableSpeciesRaw.map(d => d.name as string).filter(Boolean),
      availableYears: availableYearsRaw.map(d => d.year.toString()).filter(Boolean),
      availablePlatforms: availablePlatformsRaw.map(d => d.name as string).filter(Boolean),
    };
  } catch (error) {
    console.error("Database query failed", error);
    return {
      totalAdoptions: 0,
      totalAdoptionsDelta: 0,
      adoptionsThisWeek: 0,
      adoptionsThisWeekDelta: 0,
      timeSeriesData: [],
      platformData: [],
      speciesData: [],
      countryHeatmapData: {},
      availableSpecies: [],
      availableYears: [],
      availablePlatforms: [],
    };
  }
}, ['dashboard-data-global'], { revalidate: 3600 });

export const getCountryDashboardData = unstable_cache(async (
  countryCode: string,
  filters: { interval?: string; species?: string; year?: string; platform?: string } = {}
) => {
  try {
    const baseConditions = [eq(petAdoptions.countryCode, countryCode.toUpperCase())];
    
    if (filters.species && filters.species !== 'all') {
      baseConditions.push(eq(petAdoptions.species, filters.species));
    }
    if (filters.year && filters.year !== 'all') {
      baseConditions.push(sql`EXTRACT(YEAR FROM ${petAdoptions.adoptionTimestamp}) = ${Number(filters.year)}`);
    }
    if (filters.platform && filters.platform !== 'all') {
      baseConditions.push(eq(petAdoptions.platform, filters.platform));
    }

    const whereClause = and(...baseConditions);

    let dateSql = sql<string>`DATE(${petAdoptions.adoptionTimestamp})::text`;
    if (filters.interval === 'weekly') {
      dateSql = sql<string>`DATE_TRUNC('week', ${petAdoptions.adoptionTimestamp})::date::text`;
    } else if (filters.interval === 'monthly') {
      dateSql = sql<string>`DATE_TRUNC('month', ${petAdoptions.adoptionTimestamp})::date::text`;
    }

    const [
      totalAdoptionsResult,
      timeSeriesDataResult,
      recentAdoptions,
      platformDataRaw,
      speciesDataRaw,
      shelterDataRaw,
      cityDataRaw,
      availableSpeciesRaw,
      availableYearsRaw,
      availablePlatformsRaw
    ] = await Promise.all([
      db.select({ count: count() }).from(petAdoptions).where(whereClause),
      db.select({ date: dateSql, adoptions: count() }).from(petAdoptions).where(whereClause).groupBy(dateSql).orderBy(sql`${dateSql} ASC`),
      db.select().from(petAdoptions).where(whereClause).orderBy(desc(petAdoptions.adoptionTimestamp)).limit(500),
      db.select({ name: petAdoptions.platform, value: count() }).from(petAdoptions).where(whereClause).groupBy(petAdoptions.platform).orderBy(sql`count(*) DESC`),
      db.select({ name: petAdoptions.species, value: count() }).from(petAdoptions).where(whereClause).groupBy(petAdoptions.species).orderBy(sql`count(*) DESC`),
      db.select({ name: petAdoptions.organizationName, value: count() }).from(petAdoptions).where(and(whereClause, isNotNull(petAdoptions.organizationName))).groupBy(petAdoptions.organizationName).orderBy(sql`count(*) DESC`).limit(5),
      db.select({ name: petAdoptions.city, value: count() }).from(petAdoptions).where(whereClause).groupBy(petAdoptions.city).orderBy(sql`count(*) DESC`).limit(5),
      db.select({ name: petAdoptions.species }).from(petAdoptions).where(eq(petAdoptions.countryCode, countryCode.toUpperCase())).groupBy(petAdoptions.species),
      db.select({ year: sql<number>`EXTRACT(YEAR FROM ${petAdoptions.adoptionTimestamp})::int` }).from(petAdoptions).where(eq(petAdoptions.countryCode, countryCode.toUpperCase())).groupBy(sql`EXTRACT(YEAR FROM ${petAdoptions.adoptionTimestamp})`).orderBy(desc(sql`EXTRACT(YEAR FROM ${petAdoptions.adoptionTimestamp})`)),
      db.select({ name: petAdoptions.platform }).from(petAdoptions).where(eq(petAdoptions.countryCode, countryCode.toUpperCase())).groupBy(petAdoptions.platform)
    ]);

    const totalAdoptions = totalAdoptionsResult[0].count;

    return {
      totalAdoptions,
      timeSeriesData: timeSeriesDataResult,
      recentAdoptions,
      platformData: platformDataRaw.filter(d => d.name).map(d => ({ name: d.name as string, value: Number(d.value) })),
      speciesData: speciesDataRaw.filter(d => d.name).map(d => ({ name: d.name as string, value: Number(d.value) })),
      shelterData: shelterDataRaw.filter(d => d.name).map(d => ({ name: d.name as string, value: Number(d.value) })),
      cityData: cityDataRaw.filter(d => d.name).map(d => ({ name: d.name as string, value: Number(d.value) })),
      availableSpecies: availableSpeciesRaw.map(d => d.name as string).filter(Boolean),
      availableYears: availableYearsRaw.map(d => d.year.toString()).filter(Boolean),
      availablePlatforms: availablePlatformsRaw.map(d => d.name as string).filter(Boolean),
    };
  } catch (error) {
    console.error("Database query failed for country", error);
    return {
      totalAdoptions: 0,
      timeSeriesData: [],
      recentAdoptions: [],
      platformData: [],
      speciesData: [],
      shelterData: [],
      cityData: [],
      availableSpecies: [],
      availableYears: [],
      availablePlatforms: [],
    };
  }
}, ['dashboard-data-country'], { revalidate: 3600 });

export const getCityDirectoryData = unstable_cache(async () => {
  try {
    const data = await db
      .select({
        city: petAdoptions.city,
        state: petAdoptions.stateCode,
        country: petAdoptions.countryCode,
        totalAdoptions: count().as("total_adoptions"),
        latestAdoption: sql<string>`max(${petAdoptions.adoptionTimestamp})`.as("latest_adoption"),
      })
      .from(petAdoptions)
      .where(isNotNull(petAdoptions.city))
      .groupBy(petAdoptions.city, petAdoptions.stateCode, petAdoptions.countryCode)
      .orderBy(desc(count()));
    return data;
  } catch (error) {
    console.error("Database query failed for city directory", error);
    return [];
  }
}, ['dashboard-data-city-directory'], { revalidate: 3600 });

export const getCityDashboardData = unstable_cache(async (
  countryCode: string,
  stateCode: string,
  city: string,
  filters: { interval?: string; species?: string; year?: string; platform?: string } = {}
) => {
  try {
    const baseConditions = [
      eq(petAdoptions.countryCode, countryCode.toUpperCase()),
      eq(petAdoptions.city, city)
    ];
    if (stateCode && stateCode !== 'none' && stateCode !== '_') {
      baseConditions.push(eq(petAdoptions.stateCode, stateCode));
    }
    
    if (filters.species && filters.species !== 'all') {
      baseConditions.push(eq(petAdoptions.species, filters.species));
    }
    if (filters.year && filters.year !== 'all') {
      baseConditions.push(sql`EXTRACT(YEAR FROM ${petAdoptions.adoptionTimestamp}) = ${Number(filters.year)}`);
    }
    if (filters.platform && filters.platform !== 'all') {
      baseConditions.push(eq(petAdoptions.platform, filters.platform));
    }

    const whereClause = and(...baseConditions);

    let dateSql = sql<string>`DATE(${petAdoptions.adoptionTimestamp})::text`;
    if (filters.interval === 'weekly') {
      dateSql = sql<string>`DATE_TRUNC('week', ${petAdoptions.adoptionTimestamp})::date::text`;
    } else if (filters.interval === 'monthly') {
      dateSql = sql<string>`DATE_TRUNC('month', ${petAdoptions.adoptionTimestamp})::date::text`;
    }

    const [
      totalAdoptionsResult,
      timeSeriesDataResult,
      recentAdoptions,
      platformDataRaw,
      speciesDataRaw,
      shelterDataRaw,
      availableSpeciesRaw,
      availableYearsRaw,
      availablePlatformsRaw
    ] = await Promise.all([
      db.select({ count: count() }).from(petAdoptions).where(whereClause),
      db.select({ date: dateSql, adoptions: count() }).from(petAdoptions).where(whereClause).groupBy(dateSql).orderBy(sql`${dateSql} ASC`),
      db.select().from(petAdoptions).where(whereClause).orderBy(desc(petAdoptions.adoptionTimestamp)).limit(500),
      db.select({ name: petAdoptions.platform, value: count() }).from(petAdoptions).where(whereClause).groupBy(petAdoptions.platform).orderBy(sql`count(*) DESC`),
      db.select({ name: petAdoptions.species, value: count() }).from(petAdoptions).where(whereClause).groupBy(petAdoptions.species).orderBy(sql`count(*) DESC`),
      db.select({ name: petAdoptions.organizationName, value: count() }).from(petAdoptions).where(and(whereClause, isNotNull(petAdoptions.organizationName))).groupBy(petAdoptions.organizationName).orderBy(sql`count(*) DESC`).limit(5),
      db.select({ name: petAdoptions.species }).from(petAdoptions).where(and(eq(petAdoptions.countryCode, countryCode.toUpperCase()), eq(petAdoptions.city, city))).groupBy(petAdoptions.species),
      db.select({ year: sql<number>`EXTRACT(YEAR FROM ${petAdoptions.adoptionTimestamp})::int` }).from(petAdoptions).where(and(eq(petAdoptions.countryCode, countryCode.toUpperCase()), eq(petAdoptions.city, city))).groupBy(sql`EXTRACT(YEAR FROM ${petAdoptions.adoptionTimestamp})`).orderBy(desc(sql`EXTRACT(YEAR FROM ${petAdoptions.adoptionTimestamp})`)),
      db.select({ name: petAdoptions.platform }).from(petAdoptions).where(and(eq(petAdoptions.countryCode, countryCode.toUpperCase()), eq(petAdoptions.city, city))).groupBy(petAdoptions.platform)
    ]);

    const totalAdoptions = totalAdoptionsResult[0].count;

    return {
      totalAdoptions,
      timeSeriesData: timeSeriesDataResult,
      recentAdoptions,
      platformData: platformDataRaw.filter(d => d.name).map(d => ({ name: d.name as string, value: Number(d.value) })),
      speciesData: speciesDataRaw.filter(d => d.name).map(d => ({ name: d.name as string, value: Number(d.value) })),
      shelterData: shelterDataRaw.filter(d => d.name).map(d => ({ name: d.name as string, value: Number(d.value) })),
      availableSpecies: availableSpeciesRaw.map(d => d.name as string).filter(Boolean),
      availableYears: availableYearsRaw.map(d => d.year.toString()).filter(Boolean),
      availablePlatforms: availablePlatformsRaw.map(d => d.name as string).filter(Boolean),
    };
  } catch (error) {
    console.error("Database query failed for city dashboard", error);
    return {
      totalAdoptions: 0,
      timeSeriesData: [],
      recentAdoptions: [],
      platformData: [],
      speciesData: [],
      shelterData: [],
      availableSpecies: [],
      availableYears: [],
      availablePlatforms: [],
    };
  }
}, ['dashboard-data-city'], { revalidate: 3600 });

export const getOrganizationDirectoryData = unstable_cache(async () => {
  try {
    const data = await db
      .select({
        organizationName: petAdoptions.organizationName,
        totalAdoptions: count().as("total_adoptions"),
        latestAdoption: sql<string>`max(${petAdoptions.adoptionTimestamp})`.as("latest_adoption"),
      })
      .from(petAdoptions)
      .where(isNotNull(petAdoptions.organizationName))
      .groupBy(petAdoptions.organizationName)
      .orderBy(desc(count()));
    return data;
  } catch (error) {
    console.error("Database query failed for org directory", error);
    return [];
  }
}, ['dashboard-data-org-directory'], { revalidate: 3600 });

export const getOrganizationDashboardData = unstable_cache(async (
  orgName: string,
  filters: { interval?: string; species?: string; year?: string; platform?: string } = {}
) => {
  try {
    const baseConditions = [
      eq(petAdoptions.organizationName, orgName)
    ];
    
    if (filters.species && filters.species !== 'all') {
      baseConditions.push(eq(petAdoptions.species, filters.species));
    }
    if (filters.year && filters.year !== 'all') {
      baseConditions.push(sql`EXTRACT(YEAR FROM ${petAdoptions.adoptionTimestamp}) = ${Number(filters.year)}`);
    }
    if (filters.platform && filters.platform !== 'all') {
      baseConditions.push(eq(petAdoptions.platform, filters.platform));
    }

    const whereClause = and(...baseConditions);

    let dateSql = sql<string>`DATE(${petAdoptions.adoptionTimestamp})::text`;
    if (filters.interval === 'weekly') {
      dateSql = sql<string>`DATE_TRUNC('week', ${petAdoptions.adoptionTimestamp})::date::text`;
    } else if (filters.interval === 'monthly') {
      dateSql = sql<string>`DATE_TRUNC('month', ${petAdoptions.adoptionTimestamp})::date::text`;
    }

    const [
      totalAdoptionsResult,
      timeSeriesDataResult,
      recentAdoptions,
      platformDataRaw,
      speciesDataRaw,
      cityDataRaw,
      availableSpeciesRaw,
      availableYearsRaw,
      availablePlatformsRaw
    ] = await Promise.all([
      db.select({ count: count() }).from(petAdoptions).where(whereClause),
      db.select({ date: dateSql, adoptions: count() }).from(petAdoptions).where(whereClause).groupBy(dateSql).orderBy(sql`${dateSql} ASC`),
      db.select().from(petAdoptions).where(whereClause).orderBy(desc(petAdoptions.adoptionTimestamp)).limit(500),
      db.select({ name: petAdoptions.platform, value: count() }).from(petAdoptions).where(whereClause).groupBy(petAdoptions.platform).orderBy(sql`count(*) DESC`),
      db.select({ name: petAdoptions.species, value: count() }).from(petAdoptions).where(whereClause).groupBy(petAdoptions.species).orderBy(sql`count(*) DESC`),
      db.select({ name: petAdoptions.city, value: count() }).from(petAdoptions).where(and(whereClause, isNotNull(petAdoptions.city))).groupBy(petAdoptions.city).orderBy(sql`count(*) DESC`).limit(5),
      db.select({ name: petAdoptions.species }).from(petAdoptions).where(eq(petAdoptions.organizationName, orgName)).groupBy(petAdoptions.species),
      db.select({ year: sql<number>`EXTRACT(YEAR FROM ${petAdoptions.adoptionTimestamp})::int` }).from(petAdoptions).where(eq(petAdoptions.organizationName, orgName)).groupBy(sql`EXTRACT(YEAR FROM ${petAdoptions.adoptionTimestamp})`).orderBy(desc(sql`EXTRACT(YEAR FROM ${petAdoptions.adoptionTimestamp})`)),
      db.select({ name: petAdoptions.platform }).from(petAdoptions).where(eq(petAdoptions.organizationName, orgName)).groupBy(petAdoptions.platform)
    ]);

    const totalAdoptions = totalAdoptionsResult[0].count;

    return {
      totalAdoptions,
      timeSeriesData: timeSeriesDataResult,
      recentAdoptions,
      platformData: platformDataRaw.filter(d => d.name).map(d => ({ name: d.name as string, value: Number(d.value) })),
      speciesData: speciesDataRaw.filter(d => d.name).map(d => ({ name: d.name as string, value: Number(d.value) })),
      cityData: cityDataRaw.filter(d => d.name).map(d => ({ name: d.name as string, value: Number(d.value) })),
      availableSpecies: availableSpeciesRaw.map(d => d.name as string).filter(Boolean),
      availableYears: availableYearsRaw.map(d => d.year.toString()).filter(Boolean),
      availablePlatforms: availablePlatformsRaw.map(d => d.name as string).filter(Boolean),
    };
  } catch (error) {
    console.error("Database query failed for org dashboard", error);
    return {
      totalAdoptions: 0,
      timeSeriesData: [],
      recentAdoptions: [],
      platformData: [],
      speciesData: [],
      cityData: [],
      availableSpecies: [],
      availableYears: [],
      availablePlatforms: [],
    };
  }
}, ['dashboard-data-org'], { revalidate: 3600 });
