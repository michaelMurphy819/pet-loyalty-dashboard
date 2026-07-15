"use server";

import { db } from "@/lib/db";
import { petAdoptions } from "@/lib/db/schema";
import { count, desc, ilike, or } from "drizzle-orm";

export async function searchLocations(query: string) {
  if (!query || query.length < 2) return [];

  const searchPattern = `%${query}%`;

  try {
    const results = await db
      .select({
        city: petAdoptions.city,
        stateCode: petAdoptions.stateCode,
        countryCode: petAdoptions.countryCode,
        totalAdoptions: count().as("total_adoptions"),
      })
      .from(petAdoptions)
      .where(
        or(
          ilike(petAdoptions.city, searchPattern),
          ilike(petAdoptions.stateCode, searchPattern),
          ilike(petAdoptions.countryCode, searchPattern)
        )
      )
      .groupBy(petAdoptions.city, petAdoptions.stateCode, petAdoptions.countryCode)
      .orderBy(desc(count()))
      .limit(5);

    return results;
  } catch (error) {
    console.error("Search query failed", error);
    return [];
  }
}
