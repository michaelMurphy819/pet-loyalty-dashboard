CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_country_code ON analytics.pet_adoptions (country_code);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_platform ON analytics.pet_adoptions (platform);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_species ON analytics.pet_adoptions (species);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_city ON analytics.pet_adoptions (city);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_organization_name ON analytics.pet_adoptions (organization_name);
