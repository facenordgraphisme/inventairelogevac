/*
  Warnings:

  - Made the column `slug` on table `Apartment` required. This step will fail if there are existing NULL values in that column.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Apartment" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "buildingId" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Apartment_buildingId_fkey" FOREIGN KEY ("buildingId") REFERENCES "Building" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Apartment" ("buildingId", "createdAt", "id", "name", "slug", "updatedAt") SELECT "buildingId", "createdAt", "id", "name", "slug", "updatedAt" FROM "Apartment";
DROP TABLE "Apartment";
ALTER TABLE "new_Apartment" RENAME TO "Apartment";
CREATE UNIQUE INDEX "Apartment_slug_key" ON "Apartment"("slug");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
