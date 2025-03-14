import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const inventories = await prisma.inventory.findMany({
      include: {
        apartment: {
          include: {
            building: true, // Inclure les détails du bâtiment via l'appartement
          },
        },
      },
    });

    // Transformer les données pour inclure le slug
    const formattedInventories = inventories.map((inventory) => ({
      id: inventory.id,
      name: inventory.apartment.name, // Nom de l'appartement
      building: inventory.apartment.building, // Détails du bâtiment
      slug: inventory.apartment.slug, // Slug de l'appartement
    }));

    return NextResponse.json(formattedInventories);
  } catch (error) {
    console.error("Error fetching inventories:", error);
    return NextResponse.json(
      { error: "Failed to fetch inventories" },
      { status: 500 }
    );
  }
}
