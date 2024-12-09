import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const name = searchParams.get("name"); // Extraire `name` depuis les paramètres

  if (name) {
    const building = await prisma.building.findUnique({
      where: { name },
    });

    if (!building) {
      return NextResponse.json({ error: "Building not found" }, { status: 404 });
    }

    return NextResponse.json(building);
  }

  // Si pas de `name`, retourner tous les bâtiments
  const buildings = await prisma.building.findMany();
  return NextResponse.json(buildings);
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
