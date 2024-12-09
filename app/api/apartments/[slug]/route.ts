import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request, { params }: { params: { slug: string } }) {
  try {
    const apartment = await prisma.apartment.findUnique({
      where: { slug: params.slug },
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

export async function DELETE(request: Request, { params }: { params: { slug: string } }) {
  try {
    const apartmentSlug = params.slug; // Utilise le slug comme clé

    if (!apartmentSlug) {
      return NextResponse.json({ error: "Invalid apartment slug" }, { status: 400 });
    }

    // Trouver l'appartement via le slug
    const apartment = await prisma.apartment.findUnique({
      where: { slug: apartmentSlug },
    });

    if (!apartment) {
      return NextResponse.json({ error: "Apartment not found" }, { status: 404 });
    }

    // Supprimer l'inventaire lié à l'appartement
    await prisma.inventory.deleteMany({
      where: { apartmentId: apartment.id },
    });

    // Supprimer l'appartement
    await prisma.apartment.delete({
      where: { slug: apartmentSlug },
    });

    return NextResponse.json({ message: "Appartement supprimé avec succès" });
  } catch (error) {
    console.error("Error deleting apartment:", error);
    return NextResponse.json({ error: "Failed to delete apartment" }, { status: 500 });
  }
}