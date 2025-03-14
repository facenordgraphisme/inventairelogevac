import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request, context: { params: { slug: string } }) {
  const { slug } = context.params; // ✅ Correction ici

  if (!slug) {
    return NextResponse.json({ error: "Slug is required" }, { status: 400 });
  }

  try {
    const apartment = await prisma.apartment.findUnique({
      where: { slug },
      include: { building: true },
    });

    if (!apartment) {
      return NextResponse.json({ error: "Apartment not found" }, { status: 404 });
    }

    return NextResponse.json(apartment);
  } catch (error) {
    console.error("Error fetching apartment:", error);
    return NextResponse.json({ error: "Failed to fetch apartment" }, { status: 500 });
  }
}

export async function DELETE(request: Request, context: { params: { slug: string } }) {
  try {
    const { slug } = context.params; // ✅ Correction ici

    if (!slug) {
      return NextResponse.json({ error: "Invalid apartment slug" }, { status: 400 });
    }

    // Vérifier si l'appartement existe
    const apartment = await prisma.apartment.findUnique({
      where: { slug },
      include: {
        inventory: {
          include: {
            categories: {
              include: { items: true },
            },
          },
        },
      },
    });

    if (!apartment) {
      return NextResponse.json({ error: "Apartment not found" }, { status: 404 });
    }

    // Vérifie s'il y a des catégories ou des items associés
    if (apartment.inventory?.categories?.some((category) => category.items.length > 0)) {
      return NextResponse.json(
        { error: "Vous devez supprimer toutes les catégories et les items associés avant de supprimer ce logement." },
        { status: 400 }
      );
    }

    // Supprime l'inventaire lié à l'appartement
    if (apartment.inventory) {
      await prisma.inventory.delete({
        where: { id: apartment.inventory.id },
      });
    }

    // Supprime l'appartement
    await prisma.apartment.delete({
      where: { slug },
    });

    return NextResponse.json({ message: "Appartement supprimé avec succès." });
  } catch (error) {
    console.error("Error deleting apartment:", error);
    return NextResponse.json({ error: "Une erreur inattendue s'est produite lors de la suppression." }, { status: 500 });
  }
}
