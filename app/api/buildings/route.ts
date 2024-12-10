import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Tous les utilisateurs authentifiés peuvent voir les bâtiments
  try {
    const buildings = await prisma.building.findMany({
      include: {
        _count: {
          select: { apartments: true },
        },
      },
    });

    return NextResponse.json(buildings);
  } catch (error) {
    console.error("Error fetching buildings:", error);
    return NextResponse.json({ error: "Failed to fetch buildings" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Permet à tous les utilisateurs authentifiés de créer des bâtiments
  try {
    const { name } = await request.json();

    if (!name) {
      return NextResponse.json({ error: "Building name is required" }, { status: 400 });
    }

    const slug = name.toLowerCase().replace(/\s+/g, "-");

    const building = await prisma.building.create({
      data: { name, slug },
    });

    return NextResponse.json(building);
  } catch (error) {
    console.error("Error creating building:", error);
    return NextResponse.json({ error: "Failed to create building" }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: { slug: string } }) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Tous les utilisateurs authentifiés peuvent supprimer des bâtiments
  try {
    const buildingSlug = params.slug;

    if (!buildingSlug) {
      return NextResponse.json({ error: "Invalid building slug" }, { status: 400 });
    }

    const building = await prisma.building.findUnique({
      where: { slug: buildingSlug },
    });

    if (!building) {
      return NextResponse.json({ error: "Building not found" }, { status: 404 });
    }

    await prisma.building.delete({
      where: { slug: buildingSlug },
    });

    return NextResponse.json({ message: "Bâtiment supprimé avec succès" });
  } catch (error) {
    console.error("Error deleting building:", error);
    return NextResponse.json({ error: "Failed to delete building" }, { status: 500 });
  }
}
