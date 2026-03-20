/*
  Warnings:

  - A unique constraint covering the columns `[user_id,access_level]` on the table `Role` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Role_user_id_key";

-- CreateIndex
CREATE UNIQUE INDEX "Role_user_id_access_level_key" ON "Role"("user_id", "access_level");
