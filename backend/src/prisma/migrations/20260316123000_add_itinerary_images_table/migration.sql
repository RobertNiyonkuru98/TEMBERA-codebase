-- CreateTable
CREATE TABLE "ItineraryImage" (
    "id" UUID NOT NULL,
    "itinerary_id" UUID NOT NULL,
    "image_path" VARCHAR(255) NOT NULL,

    CONSTRAINT "ItineraryImage_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ItineraryImage" ADD CONSTRAINT "ItineraryImage_itinerary_id_fkey" FOREIGN KEY ("itinerary_id") REFERENCES "Itinerary"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
