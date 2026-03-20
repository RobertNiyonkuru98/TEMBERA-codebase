-- AlterTable
ALTER TABLE "Booking"
ADD COLUMN "itinerary_id" UUID,
ADD COLUMN "type" VARCHAR(20) NOT NULL DEFAULT 'personal';

-- CreateTable
CREATE TABLE "BookingMember" (
  "id" UUID NOT NULL,
  "booking_id" UUID NOT NULL,
  "name" VARCHAR(255) NOT NULL,
  "email" VARCHAR(255),
  "phone" VARCHAR(50),

  CONSTRAINT "BookingMember_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Booking"
ADD CONSTRAINT "Booking_itinerary_id_fkey"
FOREIGN KEY ("itinerary_id") REFERENCES "Itinerary"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BookingMember"
ADD CONSTRAINT "BookingMember_booking_id_fkey"
FOREIGN KEY ("booking_id") REFERENCES "Booking"("id") ON DELETE CASCADE ON UPDATE CASCADE;
