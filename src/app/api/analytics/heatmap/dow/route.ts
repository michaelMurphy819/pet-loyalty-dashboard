import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { sql } from "drizzle-orm";
import { getSummarySqlWhere } from "@/lib/analytics-filters";
import { getServerCache, setServerCache, getHttpCacheHeaders } from "@/lib/server-cache";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const cacheKey = `dow:${searchParams.toString()}`;
  
  const cachedPayload = getServerCache(cacheKey);
  if (cachedPayload) {
    return NextResponse.json(cachedPayload, { status: 200, headers: getHttpCacheHeaders(true) });
  }

  const filterSql = getSummarySqlWhere(searchParams);

  try {
    // High-speed aggregation via pre-indexed mv_dashboard_summary materialized view
    const result = await db.execute(sql`
      SELECT 
        EXTRACT(DOW FROM adoption_date)::int AS day_of_week,
        TRIM(TO_CHAR(adoption_date, 'Day')) AS day_name,
        COALESCE(SUM(adoption_count), 0)::int AS adoption_volume
      FROM analytics.mv_dashboard_summary
      WHERE adoption_date IS NOT NULL AND ${filterSql}
      GROUP BY EXTRACT(DOW FROM adoption_date), TO_CHAR(adoption_date, 'Day')
      ORDER BY EXTRACT(DOW FROM adoption_date) ASC;
    `);

    const rows = (result as any).rows ?? result;
    const dataArray = Array.isArray(rows) ? rows : [];
    const maxVolume = Math.max(...dataArray.map((r: any) => Number(r.adoption_volume) || 0), 1);
    
    const transformed = dataArray.map((row: any) => ({
      day_of_week: Number(row.day_of_week),
      day_name: row.day_name,
      volume: Number(row.adoption_volume || 0),
      intensity_ratio: parseFloat((Number(row.adoption_volume || 0) / maxVolume).toFixed(2))
    }));

    const responsePayload = { data: transformed, peak_volume: maxVolume };
    setServerCache(cacheKey, responsePayload, 300); // 5-minute server TTL

    return NextResponse.json(responsePayload, { status: 200, headers: getHttpCacheHeaders(false) });
  } catch (error) {
    console.error("Failed to aggregate day of week volume:", error);
    return NextResponse.json({ error: "Failed to aggregate day of week volume" }, { status: 500 });
  }
}
