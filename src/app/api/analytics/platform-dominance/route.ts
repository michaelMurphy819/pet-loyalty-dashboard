import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { sql } from "drizzle-orm";
import { getSummarySqlWhere, getRawSqlWhere } from "@/lib/analytics-filters";
import { getServerCache, setServerCache, getHttpCacheHeaders } from "@/lib/server-cache";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const cacheKey = `platform-dom:${searchParams.toString()}`;

  const cachedPayload = getServerCache(cacheKey);
  if (cachedPayload) {
    return NextResponse.json(cachedPayload, { status: 200, headers: getHttpCacheHeaders(true) });
  }

  const useRaw = searchParams.has("breed") && searchParams.get("breed") !== "all";
  const filterSql = useRaw ? getRawSqlWhere(searchParams) : getSummarySqlWhere(searchParams);

  try {
    const query = useRaw ? sql`
      SELECT 
        state_code,
        platform,
        COUNT(*)::int AS adoption_count
      FROM analytics.pet_adoptions
      WHERE state_code IS NOT NULL AND platform IS NOT NULL AND ${filterSql}
      GROUP BY state_code, platform
      ORDER BY state_code ASC, adoption_count DESC;
    ` : sql`
      SELECT 
        state_code,
        platform,
        COALESCE(SUM(adoption_count), 0)::int AS adoption_count
      FROM analytics.mv_dashboard_summary
      WHERE state_code IS NOT NULL AND platform IS NOT NULL AND ${filterSql}
      GROUP BY state_code, platform
      ORDER BY state_code ASC, adoption_count DESC;
    `;

    const result = await db.execute(query);

    const rows = (result as any).rows ?? result;
    const pivotMap: Record<string, any> = {};
    const platformsSet = new Set<string>();

    if (Array.isArray(rows)) {
      rows.forEach((row: any) => {
        const state = row.state_code;
        const plat = row.platform;
        const count = Number(row.adoption_count || 0);
        
        platformsSet.add(plat);
        if (!pivotMap[state]) pivotMap[state] = { state_code: state, total: 0 };
        pivotMap[state][plat] = count;
        pivotMap[state].total += count;
      });
    }

    const sortedData = Object.values(pivotMap)
      .sort((a, b) => b.total - a.total)
      .slice(0, 15);

    const responsePayload = { data: sortedData, platforms: Array.from(platformsSet) };
    setServerCache(cacheKey, responsePayload, 300);

    return NextResponse.json(responsePayload, { status: 200, headers: getHttpCacheHeaders(false) });
  } catch (error) {
    console.error("Failed to generate platform dominance payload:", error);
    return NextResponse.json({ error: "Failed to generate platform dominance payload" }, { status: 500 });
  }
}
