-- PostgreSQL Materialized View Optimization for Pet Loyalty Analytics Dashboard
-- Designed for handling 1.46M+ adoption records with sub-10ms query execution times.

-- 1. Create the Materialized Summary View
CREATE MATERIALIZED VIEW IF NOT EXISTS analytics.mv_dashboard_summary AS
SELECT 
    DATE(adoption_timestamp) AS adoption_date,
    EXTRACT(YEAR FROM adoption_timestamp)::integer AS adoption_year,
    DATE_TRUNC('week', adoption_timestamp)::date AS adoption_week,
    DATE_TRUNC('month', adoption_timestamp)::date AS adoption_month,
    COALESCE(platform, 'Unknown') AS platform,
    COALESCE(species, 'Other') AS species,
    country_code,
    state_code,
    city,
    organization_name,
    COUNT(*)::integer AS adoption_count,
    MAX(adoption_timestamp) AS latest_adoption
FROM analytics.pet_adoptions
GROUP BY 
    DATE(adoption_timestamp),
    EXTRACT(YEAR FROM adoption_timestamp),
    DATE_TRUNC('week', adoption_timestamp),
    DATE_TRUNC('month', adoption_timestamp),
    platform,
    species,
    country_code,
    state_code,
    city,
    organization_name;

-- 2. Create high-performance B-Tree indexes directly on the Materialized View
CREATE INDEX IF NOT EXISTS idx_mv_date ON analytics.mv_dashboard_summary (adoption_date);
CREATE INDEX IF NOT EXISTS idx_mv_year ON analytics.mv_dashboard_summary (adoption_year);
CREATE INDEX IF NOT EXISTS idx_mv_platform ON analytics.mv_dashboard_summary (platform);
CREATE INDEX IF NOT EXISTS idx_mv_species ON analytics.mv_dashboard_summary (species);
CREATE INDEX IF NOT EXISTS idx_mv_country ON analytics.mv_dashboard_summary (country_code);
CREATE INDEX IF NOT EXISTS idx_mv_city ON analytics.mv_dashboard_summary (city);
CREATE INDEX IF NOT EXISTS idx_mv_org ON analytics.mv_dashboard_summary (organization_name);

-- 3. Create supplementary B-Tree indexes on the raw historical table for instant drill-downs (LIMIT 500 recent items)
CREATE INDEX IF NOT EXISTS idx_raw_timestamp ON analytics.pet_adoptions (adoption_timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_raw_country_time ON analytics.pet_adoptions (country_code, adoption_timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_raw_city_time ON analytics.pet_adoptions (city, adoption_timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_raw_org_time ON analytics.pet_adoptions (organization_name, adoption_timestamp DESC);
