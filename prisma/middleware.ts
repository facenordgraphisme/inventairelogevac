import { PrismaClient } from "@prisma/client";
import slugify from "slugify";

const prisma = new PrismaClient();

prisma.$use(async (params, next) => {
  if (params.model === "Apartment" && params.action === "create") {
    const { name, buildingId } = params.args.data;
    const building = await prisma.building.findUnique({ where: { id: buildingId } });
    if (building) {
      const slug = slugify(`${building.name}-${name}`, { lower: true });
      params.args.data.slug = slug;
    }
  }
  return next(params);
});

export { prisma };
