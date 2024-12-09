/*
  Warnings:

  - Added the required column `slug` to the `Building` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;

CREATE TABLE "new_Building" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL, -- Slug reste obligatoire
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- Lors de l'insertion, générez les slugs pour les lignes existantes
INSERT INTO "new_Building" ("createdAt", "id", "name", "updatedAt", "slug")
SELECT 
    "createdAt", 
    "id", 
    "name", 
    "updatedAt", 
    LOWER(REPLACE("name", ' ', '-')) AS "slug" -- Génère le slug à partir du nom
FROM "Building";

DROP TABLE "Building";
ALTER TABLE "new_Building" RENAME TO "Building";
CREATE UNIQUE INDEX "Building_name_key" ON "Building"("name");
CREATE UNIQUE INDEX "Building_slug_key" ON "Building"("slug");

PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
