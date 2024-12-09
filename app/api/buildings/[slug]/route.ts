import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";


export async function GET(request: Request, { params }: { params: { slug: string } }) {
  try {
    const { slug } = params;

    const building = await prisma.building.findUnique({
      where: { slug }, // Assurez-vous que "slug" est bien défini dans Prisma
    });

    if (!building) {
      return NextResponse.json({ error: "Building not found" }, { status: 404 });
    }

    return NextResponse.json(building);
  } catch (error) {
    console.error("Error fetching building:", error);
    return NextResponse.json({ error: "Failed to fetch building" }, { status: 500 });
  }
}


export async function DELETE(request: Request, { params }: { params: { slug: string } }) {
  try {
    const { slug } = params; // Extraction correcte du slug

    const building = await prisma.building.findUnique({
      where: { slug }, // Utilisation correcte du champ slug
    });

    if (!building) {
      return NextResponse.json({ error: "Building not found" }, { status: 404 });
    }

    // Supprime le bâtiment
    await prisma.building.delete({
      where: { slug },
    });

    return NextResponse.json({ message: "Building deleted successfully" });
  } catch (error) {
    console.error("Error deleting building:", error);
    return NextResponse.json({ error: "Failed to delete building" }, { status: 500 });
  }
}