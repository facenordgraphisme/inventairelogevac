import { PrismaClient } from "@prisma/client";

const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: ["query"], // Vous pouvez supprimer cette ligne pour désactiver les logs des requêtes
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
