import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { sql } from "drizzle-orm";
import { getRawSqlWhere } from "@/lib/analytics-filters";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const filterSql = getRawSqlWhere(searchParams);

  try {
    const result = await db.execute(sql`
      SELECT 
        COUNT(*) FILTER (WHERE secondary_breed IS NULL OR secondary_breed = '')::int AS purebred_count,
        COUNT(*) FILTER (WHERE secondary_breed IS NOT NULL AND secondary_breed != '')::int AS mixed_count,
        COUNT(*)::int AS total_count
      FROM analytics.pet_adoptions
      WHERE ${filterSql};
    `);
    
    const rows = (result as any).rows ?? result;
    const row = (Array.isArray(rows) ? rows[0] : null) || { purebred_count: 0, mixed_count: 0, total_count: 0 };
    const purebred = Number(row.purebred_count || 0);
    const mixed = Number(row.mixed_count || 0);
    const total = Number(row.total_count) || (purebred + mixed) || 1;

    return NextResponse.json({
      purebred_count: purebred,
      mixed_count: mixed,
      total_count: total,
      purebred_pct: parseFloat(((purebred / total) * 100).toFixed(1)),
      mixed_pct: parseFloat(((mixed / total) * 100).toFixed(1))
    }, { status: 200 });
  } catch (error) {
    console.error("Failed to calculate crossbreed ratio:", error);
    return NextResponse.json({ error: "Failed to calculate crossbreed ratio" }, { status: 500 });
  }
}
