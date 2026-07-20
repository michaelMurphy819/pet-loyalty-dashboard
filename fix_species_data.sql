-- Create the trigger function
CREATE OR REPLACE FUNCTION analytics.normalize_pet_adoption_data()
RETURNS TRIGGER AS $$
BEGIN
    -- Strip quotes and replace underscores with spaces, then properly case the species
    IF NEW.species IS NOT NULL THEN
        NEW.species := INITCAP(LOWER(REPLACE(REPLACE(NEW.species, '"', ''), '_', ' ')));
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Bind the trigger to the table
DROP TRIGGER IF EXISTS trg_normalize_pet_adoption_data ON analytics.pet_adoptions;
CREATE TRIGGER trg_normalize_pet_adoption_data
BEFORE INSERT OR UPDATE ON analytics.pet_adoptions
FOR EACH ROW
EXECUTE FUNCTION analytics.normalize_pet_adoption_data();

-- Update the existing corrupted data safely
-- Using an explicit WHERE clause prevents us from rewriting rows that are already clean, saving CPU/IO
UPDATE analytics.pet_adoptions
SET species = INITCAP(LOWER(REPLACE(REPLACE(species, '"', ''), '_', ' ')))
WHERE species LIKE '%"%' OR species != INITCAP(LOWER(REPLACE(REPLACE(species, '"', ''), '_', ' ')));
