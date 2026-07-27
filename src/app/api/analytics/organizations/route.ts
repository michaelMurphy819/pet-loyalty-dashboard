import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { sql } from "drizzle-orm";
import { getSummarySqlWhere } from "@/lib/analytics-filters";
import { getServerCache, setServerCache, getHttpCacheHeaders } from "@/lib/server-cache";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const cacheKey = `organizations:${searchParams.toString()}`;

  const cachedPayload = getServerCache(cacheKey);
  if (cachedPayload) {
    return NextResponse.json(cachedPayload, { status: 200, headers: getHttpCacheHeaders(true) });
  }

  const filterSql = getSummarySqlWhere(searchParams);

  try {
    const result = await db.execute(sql`
      SELECT 
        COALESCE(organization_name, 'Independent Partner') AS organization_name,
        COALESCE(SUM(adoption_count), 0)::int AS total_adoptions
      FROM analytics.mv_dashboard_summary
      WHERE organization_name IS NOT NULL AND organization_name != '' AND ${filterSql}
      GROUP BY organization_name
      ORDER BY total_adoptions DESC
      LIMIT 500;
    `);
    const rows = (result as any).rows ?? result;
    const responsePayload = { data: rows };
    
    setServerCache(cacheKey, responsePayload, 300);

    return NextResponse.json(responsePayload, { status: 200, headers: getHttpCacheHeaders(false) });
  } catch (error) {
    console.error("Failed to fetch organizations:", error);
    return NextResponse.json({ error: "Failed to fetch organizations" }, { status: 500 });
  }
}
