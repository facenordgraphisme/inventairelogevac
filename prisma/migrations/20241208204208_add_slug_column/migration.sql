/*
  Warnings:

  - A unique constraint covering the columns `[slug]` on the table `Apartment` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Apartment" ADD COLUMN "slug" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Apartment_slug_key" ON "Apartment"("slug");
