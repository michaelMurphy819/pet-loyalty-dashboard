import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { sql } from "drizzle-orm";
import { getSummarySqlWhere } from "@/lib/analytics-filters";
import { getServerCache, setServerCache, getHttpCacheHeaders } from "@/lib/server-cache";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const cacheKey = `loc-leaderboard:${searchParams.toString()}`;

  const cachedPayload = getServerCache(cacheKey);
  if (cachedPayload) {
    return NextResponse.json(cachedPayload, { status: 200, headers: getHttpCacheHeaders(true) });
  }

  const filterSql = getSummarySqlWhere(searchParams);

  try {
    const result = await db.execute(sql`
      SELECT 
        COALESCE(state_code, 'Unknown') AS state_code,
        COALESCE(city, 'Unspecified') AS city,
        COALESCE(SUM(adoption_count), 0)::int AS total_adoptions
      FROM analytics.mv_dashboard_summary
      WHERE state_code IS NOT NULL AND city IS NOT NULL AND ${filterSql}
      GROUP BY state_code, city
      ORDER BY total_adoptions DESC
      LIMIT 10;
    `);
    const rows = (result as any).rows ?? result;
    
    const responsePayload = { data: rows };
    setServerCache(cacheKey, responsePayload, 300);

    return NextResponse.json(responsePayload, { status: 200, headers: getHttpCacheHeaders(false) });
  } catch (error) {
    console.error("Failed to query locations leaderboard:", error);
    return NextResponse.json({ error: "Failed to query locations leaderboard" }, { status: 500 });
  }
}
