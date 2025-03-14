import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// 🚀 Mise à jour du nom du bâtiment (PATCH)
export async function PATCH(request: Request, context: { params: { slug?: string } }) {
  try {
    const { slug } = await context.params; // ✅ Attendre params

    if (!slug) {
      return NextResponse.json({ error: "Slug du bâtiment requis" }, { status: 400 });
    }

    const { name } = await request.json();

    if (!name) {
      return NextResponse.json({ error: "Le nom est requis" }, { status: 400 });
    }

    const updatedBuilding = await prisma.building.update({
      where: { slug },
      data: { name },
    });

    return NextResponse.json(updatedBuilding);
  } catch (error) {
    console.error("Erreur de mise à jour du bâtiment :", error);
    return NextResponse.json({ error: "Erreur lors de la mise à jour" }, { status: 500 });
  }
}

// 🚀 Récupération d'un bâtiment (GET)
export async function GET(request: Request, context: { params: { slug?: string } }) {
  try {
    const slug = context.params?.slug; // ✅ Attendre params.slug correctement

    if (!slug) {
      return NextResponse.json({ error: "Slug du bâtiment non fourni." }, { status: 400 });
    }

    const building = await prisma.building.findUnique({
      where: { slug },
      include: {
        _count: { select: { apartments: true } }, // Compter les logements
      },
    });

    if (!building) {
      return NextResponse.json({ error: "Bâtiment introuvable." }, { status: 404 });
    }

    return NextResponse.json(building);
  } catch (error) {
    console.error("Erreur lors de la récupération du bâtiment :", error);
    return NextResponse.json({ error: "Impossible de récupérer le bâtiment." }, { status: 500 });
  }
}

// 🚀 Suppression d'un bâtiment (DELETE)
export async function DELETE(request: Request, context: { params: { slug?: string } }) {
  try {
    const slug = context.params?.slug; // ✅ Attendre params.slug correctement

    if (!slug) {
      return NextResponse.json({ error: "Slug du bâtiment non fourni." }, { status: 400 });
    }

    // Vérifier si le bâtiment existe
    const building = await prisma.building.findUnique({
      where: { slug },
      include: { apartments: true },
    });

    if (!building) {
      return NextResponse.json({ error: "Bâtiment introuvable." }, { status: 404 });
    }

    // Vérifier s'il y a des logements associés
    if (building.apartments.length > 0) {
      return NextResponse.json(
        { error: "Vous devez d'abord supprimer tous les logements associés." },
        { status: 400 }
      );
    }

    // Supprimer le bâtiment
    await prisma.building.delete({ where: { slug } });

    return NextResponse.json({ message: "Bâtiment supprimé avec succès." });
  } catch (error) {
    console.error("Erreur lors de la suppression du bâtiment :", error);
    return NextResponse.json({ error: "Impossible de supprimer le bâtiment." }, { status: 500 });
  }
}
