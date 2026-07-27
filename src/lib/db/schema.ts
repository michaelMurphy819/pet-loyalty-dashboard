import { pgSchema, serial, varchar, timestamp, jsonb, index, date, integer } from "drizzle-orm/pg-core";

export const analyticsSchema = pgSchema("analytics");

export const petAdoptions = analyticsSchema.table("pet_adoptions", {
  id: serial("id").primaryKey(),
  inquiryId: varchar("inquiry_id", { length: 255 }),
  animalId: varchar("animal_id", { length: 255 }),
  adoptionTimestamp: timestamp("adoption_timestamp"),
  species: varchar("species", { length: 100 }),
  platform: varchar("platform", { length: 255 }),
  countryCode: varchar("country_code", { length: 2 }),
  stateCode: varchar("state_code", { length: 50 }),
  city: varchar("city", { length: 255 }),
  primaryBreed: varchar("primary_breed", { length: 100 }),
  secondaryBreed: varchar("secondary_breed", { length: 100 }),
  organizationName: varchar("organization_name", { length: 255 }),
  externalMetadata: jsonb("external_metadata"),
  createdAt: timestamp("created_at"),
}, (table) => ({
  countryIdx: index("idx_country_code").on(table.countryCode),
  platformIdx: index("idx_platform").on(table.platform),
  speciesIdx: index("idx_species").on(table.species),
  cityIdx: index("idx_city").on(table.city),
  orgIdx: index("idx_organization_name").on(table.organizationName),
}));

export const mvDashboardSummary = analyticsSchema.table("mv_dashboard_summary", {
  adoptionDate: date("adoption_date").notNull(),
  adoptionYear: integer("adoption_year").notNull(),
  adoptionWeek: date("adoption_week").notNull(),
  adoptionMonth: date("adoption_month").notNull(),
  platform: varchar("platform", { length: 255 }),
  species: varchar("species", { length: 100 }),
  countryCode: varchar("country_code", { length: 2 }),
  stateCode: varchar("state_code", { length: 50 }),
  city: varchar("city", { length: 255 }),
  organizationName: varchar("organization_name", { length: 255 }),
  adoptionCount: integer("adoption_count").notNull(),
  latestAdoption: timestamp("latest_adoption"),
});
