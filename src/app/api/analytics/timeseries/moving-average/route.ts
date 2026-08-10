import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { sql } from "drizzle-orm";
import { getSummarySqlWhere, getRawSqlWhere } from "@/lib/analytics-filters";
import { getServerCache, setServerCache, getHttpCacheHeaders } from "@/lib/server-cache";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const cacheKey = `moving-avg:${searchParams.toString()}`;

  const cachedPayload = getServerCache(cacheKey);
  if (cachedPayload) {
    return NextResponse.json(cachedPayload, { status: 200, headers: getHttpCacheHeaders(true) });
  }

  const useRaw = searchParams.has("breed") && searchParams.get("breed") !== "all";
  const filterSql = useRaw ? getRawSqlWhere(searchParams) : getSummarySqlWhere(searchParams);

  try {
    const query = useRaw ? sql`
      WITH daily_counts AS (
        SELECT 
          DATE(adoption_timestamp) AS adoption_date,
          COUNT(*)::int AS daily_volume
        FROM analytics.pet_adoptions
        WHERE adoption_timestamp IS NOT NULL AND ${filterSql}
        GROUP BY DATE(adoption_timestamp)
      )
      SELECT 
        TO_CHAR(adoption_date, 'YYYY-MM-DD') AS date_str,
        daily_volume,
        ROUND(AVG(daily_volume) OVER (
          ORDER BY adoption_date 
          ROWS BETWEEN 29 PRECEDING AND CURRENT ROW
        ), 1)::float AS moving_avg_30d
      FROM daily_counts
      ORDER BY adoption_date ASC;
    ` : sql`
      WITH daily_counts AS (
        SELECT 
          adoption_date,
          COALESCE(SUM(adoption_count), 0)::int AS daily_volume
        FROM analytics.mv_dashboard_summary
        WHERE adoption_date IS NOT NULL AND ${filterSql}
        GROUP BY adoption_date
      )
      SELECT 
        TO_CHAR(adoption_date, 'YYYY-MM-DD') AS date_str,
        daily_volume,
        ROUND(AVG(daily_volume) OVER (
          ORDER BY adoption_date 
          ROWS BETWEEN 29 PRECEDING AND CURRENT ROW
        ), 1)::float AS moving_avg_30d
      FROM daily_counts
      ORDER BY adoption_date ASC;
    `;

    // High-performance window aggregation
    const result = await db.execute(query);
    
    const rows = (result as any).rows ?? result;
    const dataArray = Array.isArray(rows) ? rows : [];
    
    const formatted = dataArray.map((r: any) => ({
      date: r.date_str,
      adoptions: Number(r.daily_volume || 0),
      movingAvg: Number(r.moving_avg_30d || 0)
    }));

    const responsePayload = { data: formatted };
    setServerCache(cacheKey, responsePayload, 300);

    return NextResponse.json(responsePayload, { status: 200, headers: getHttpCacheHeaders(false) });
  } catch (error) {
    console.error("Failed to evaluate moving average window:", error);
    return NextResponse.json({ error: "Failed to evaluate moving average window" }, { status: 500 });
  }
}
