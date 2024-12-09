import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request, { params }: { params: { slug: string } }) {
  try {
    const slug = params.slug.toLowerCase(); // Normalisez le slug
    const { name } = await request.json();

    const building = await prisma.building.findUnique({
      where: { slug },
    });
    console.log("Building found:", building);

    if (!building) {
      return NextResponse.json({ error: "Building not found" }, { status: 404 });
    }

    const apartment = await prisma.apartment.create({
      data: {
        name,
        slug: `${slug}-${name.replace(/\s+/g, "-").toLowerCase()}`,
        buildingId: building.id,
      },
    });

    return NextResponse.json(apartment);
  } catch (error) {
    console.error("Error creating apartment:", error);
    return NextResponse.json({ error: "Failed to create apartment" }, { status: 500 });
  }
}


export async function GET(_request: Request, { params }: { params: { slug: string } }) {
  try {
    const { slug } = await params;

    const building = await prisma.building.findUnique({
      where: { slug },
    });

    if (!building) {
      return NextResponse.json([], { status: 200 }); // Retourner un tableau vide si aucun bâtiment n'est trouvé
    }

    const apartments = await prisma.apartment.findMany({
      where: { buildingId: building.id },
    });

    return NextResponse.json(apartments);
  } catch (error) {
    console.error("Error fetching apartments:", error);
    return NextResponse.json({ error: "Failed to fetch apartments" }, { status: 500 });
  }
}