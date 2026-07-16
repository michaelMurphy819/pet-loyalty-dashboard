import { pgSchema, serial, varchar, timestamp } from "drizzle-orm/pg-core";

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
  createdAt: timestamp("created_at"),
});
