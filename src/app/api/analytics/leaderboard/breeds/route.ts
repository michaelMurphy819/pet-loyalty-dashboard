import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { sql } from "drizzle-orm";
import { getRawSqlWhere } from "@/lib/analytics-filters";
import { getServerCache, setServerCache, getHttpCacheHeaders } from "@/lib/server-cache";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const cacheKey = `breeds-leaderboard:${searchParams.toString()}`;

  const cachedPayload = getServerCache(cacheKey);
  if (cachedPayload) {
    return NextResponse.json(cachedPayload, { status: 200, headers: getHttpCacheHeaders(true) });
  }

  const filterSql = getRawSqlWhere(searchParams);

  try {
    const query = sql`
      SELECT 
        COALESCE(primary_breed, 'Mixed / Domestic') AS primary_breed,
        COUNT(*)::int AS total_adoptions
      FROM analytics.pet_adoptions
      WHERE primary_breed IS NOT NULL AND ${filterSql}
      GROUP BY primary_breed
      ORDER BY total_adoptions DESC
      LIMIT 10;
    `;

    const result = await db.execute(query);
    const rows = (result as any).rows ?? result;
    
    const responsePayload = { data: rows };
    setServerCache(cacheKey, responsePayload, 300);

    return NextResponse.json(responsePayload, { status: 200, headers: getHttpCacheHeaders(false) });
  } catch (error) {
    console.error("Failed to query dynamic breeds leaderboard:", error);
    return NextResponse.json({ error: "Failed to query dynamic breeds leaderboard" }, { status: 500 });
  }
}
