PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;

-- Créer une nouvelle table avec la colonne updatedAt et une valeur par défaut
CREATE TABLE "new_Inventory" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "apartmentId" INTEGER NOT NULL,
    "lastModifiedById" INTEGER,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Inventory_apartmentId_fkey" FOREIGN KEY ("apartmentId") REFERENCES "Apartment" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Inventory_lastModifiedById_fkey" FOREIGN KEY ("lastModifiedById") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- Copier les données existantes dans la nouvelle table
INSERT INTO "new_Inventory" ("id", "apartmentId", "updatedAt")
SELECT "id", "apartmentId", CURRENT_TIMESTAMP FROM "Inventory";

-- Supprimer l'ancienne table
DROP TABLE "Inventory";

-- Renommer la nouvelle table pour qu'elle remplace l'ancienne
ALTER TABLE "new_Inventory" RENAME TO "Inventory";

-- Recréer les index uniques
CREATE UNIQUE INDEX "Inventory_apartmentId_key" ON "Inventory"("apartmentId");

PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
