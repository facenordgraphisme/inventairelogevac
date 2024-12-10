import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const buildings = await prisma.building.findMany({
      include: {
        _count: {
          select: { apartments: true }, // Inclure le nombre d'appartements
        },
      },
    });

    return NextResponse.json(buildings);
  } catch (error) {
    console.error("Error fetching buildings:", error);
    return NextResponse.json({ error: "Failed to fetch buildings" }, { status: 500 });
  }
}
// POST - Ajouter un nouveau bâtiment
export async function POST(request: Request) {
  try {
    const { name } = await request.json();

    if (!name) {
      return NextResponse.json({ error: "Building name is required" }, { status: 400 });
    }

    const slug = name.toLowerCase().replace(/\s+/g, "-"); // Convertir en minuscule

    const building = await prisma.building.create({
      data: { name, slug },
    });

    return NextResponse.json(building);
  } catch (error) {
    console.error("Error creating building:", error);
    return NextResponse.json({ error: "Failed to create building" }, { status: 500 });
  }
}
