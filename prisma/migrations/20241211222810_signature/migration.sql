-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Inventory" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "apartmentId" INTEGER NOT NULL,
    "lastModifiedById" INTEGER,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Inventory_apartmentId_fkey" FOREIGN KEY ("apartmentId") REFERENCES "Apartment" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Inventory_lastModifiedById_fkey" FOREIGN KEY ("lastModifiedById") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Inventory" ("apartmentId", "id", "lastModifiedById", "updatedAt") SELECT "apartmentId", "id", "lastModifiedById", "updatedAt" FROM "Inventory";
DROP TABLE "Inventory";
ALTER TABLE "new_Inventory" RENAME TO "Inventory";
CREATE UNIQUE INDEX "Inventory_apartmentId_key" ON "Inventory"("apartmentId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
