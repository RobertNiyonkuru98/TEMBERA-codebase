/*
  Warnings:

  - The primary key for the `Booking` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `BookingItem` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Company` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Itinerary` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `User` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - Changed the type of `id` on the `Booking` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `user_id` on the `Booking` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `id` on the `BookingItem` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `itinerary_id` on the `BookingItem` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `booking_id` on the `BookingItem` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `id` on the `Company` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `owner_id` on the `Company` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `id` on the `Itinerary` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `company_id` on the `Itinerary` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `id` on the `User` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- DropForeignKey
ALTER TABLE "Booking" DROP CONSTRAINT "Booking_user_id_fkey";

-- DropForeignKey
ALTER TABLE "BookingItem" DROP CONSTRAINT "BookingItem_booking_id_fkey";

-- DropForeignKey
ALTER TABLE "BookingItem" DROP CONSTRAINT "BookingItem_itinerary_id_fkey";

-- DropForeignKey
ALTER TABLE "Company" DROP CONSTRAINT "Company_owner_id_fkey";

-- DropForeignKey
ALTER TABLE "Itinerary" DROP CONSTRAINT "Itinerary_company_id_fkey";

-- AlterTable
ALTER TABLE "Booking" DROP CONSTRAINT "Booking_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" UUID NOT NULL,
DROP COLUMN "user_id",
ADD COLUMN     "user_id" UUID NOT NULL,
ADD CONSTRAINT "Booking_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "BookingItem" DROP CONSTRAINT "BookingItem_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" UUID NOT NULL,
DROP COLUMN "itinerary_id",
ADD COLUMN     "itinerary_id" UUID NOT NULL,
DROP COLUMN "booking_id",
ADD COLUMN     "booking_id" UUID NOT NULL,
ADD CONSTRAINT "BookingItem_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "Company" DROP CONSTRAINT "Company_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" UUID NOT NULL,
DROP COLUMN "owner_id",
ADD COLUMN     "owner_id" UUID NOT NULL,
ADD CONSTRAINT "Company_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "Itinerary" DROP CONSTRAINT "Itinerary_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" UUID NOT NULL,
DROP COLUMN "company_id",
ADD COLUMN     "company_id" UUID NOT NULL,
ADD CONSTRAINT "Itinerary_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "User" DROP CONSTRAINT "User_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" UUID NOT NULL,
ADD CONSTRAINT "User_pkey" PRIMARY KEY ("id");

-- CreateIndex
CREATE UNIQUE INDEX "BookingItem_booking_id_itinerary_id_key" ON "BookingItem"("booking_id", "itinerary_id");

-- AddForeignKey
ALTER TABLE "Company" ADD CONSTRAINT "Company_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Itinerary" ADD CONSTRAINT "Itinerary_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Booking" ADD CONSTRAINT "Booking_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BookingItem" ADD CONSTRAINT "BookingItem_itinerary_id_fkey" FOREIGN KEY ("itinerary_id") REFERENCES "Itinerary"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BookingItem" ADD CONSTRAINT "BookingItem_booking_id_fkey" FOREIGN KEY ("booking_id") REFERENCES "Booking"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
