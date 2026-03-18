-- Step 1: Add new columns as optional (nullable) first
ALTER TABLE "ItineraryImage" ADD COLUMN "image_url" VARCHAR(500);
ALTER TABLE "ItineraryImage" ADD COLUMN "public_id" VARCHAR(255);
ALTER TABLE "ItineraryImage" ADD COLUMN "order" INTEGER DEFAULT 0;
ALTER TABLE "ItineraryImage" ADD COLUMN "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP;

-- Step 2: Populate existing rows with data based on image_path
-- For existing rows, use image_path as image_url and generate a public_id
UPDATE "ItineraryImage" 
SET 
  "image_url" = "image_path",
  "public_id" = CONCAT('legacy_', "id"),
  "order" = 0,
  "created_at" = CURRENT_TIMESTAMP
WHERE "image_url" IS NULL;

-- Step 3: Make the columns required (NOT NULL)
ALTER TABLE "ItineraryImage" ALTER COLUMN "image_url" SET NOT NULL;
ALTER TABLE "ItineraryImage" ALTER COLUMN "public_id" SET NOT NULL;
ALTER TABLE "ItineraryImage" ALTER COLUMN "order" SET NOT NULL;
ALTER TABLE "ItineraryImage" ALTER COLUMN "created_at" SET NOT NULL;

-- Step 4: Update the foreign key constraint to CASCADE on delete
ALTER TABLE "ItineraryImage" DROP CONSTRAINT "ItineraryImage_itinerary_id_fkey";
ALTER TABLE "ItineraryImage" ADD CONSTRAINT "ItineraryImage_itinerary_id_fkey" 
  FOREIGN KEY ("itinerary_id") REFERENCES "Itinerary"("id") ON DELETE CASCADE ON UPDATE CASCADE;
