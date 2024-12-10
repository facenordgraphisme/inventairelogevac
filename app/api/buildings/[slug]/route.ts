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
    const { slug } = params;

    const building = await prisma.building.findUnique({
      where: { slug },
      include: { apartments: true }, // Inclure les appartements pour vérifier s'il y en a
    });

    if (!building) {
      return NextResponse.json({ error: "Building not found" }, { status: 404 });
    }

    if (building.apartments.length > 0) {
      // Retourner un message clair si des logements existent encore
      return NextResponse.json(
        { error: "Vous devez supprimer tous les logements avant de supprimer ce bâtiment." },
        { status: 400 }
      );
    }

    await prisma.building.delete({
      where: { slug },
    });

    return NextResponse.json({ message: "Building deleted successfully" });
  } catch (error) {
    console.error("Error deleting building:", error);
    return NextResponse.json(
      { error: "Une erreur inattendue s'est produite lors de la suppression du bâtiment." },
      { status: 500 }
    );
  }
}