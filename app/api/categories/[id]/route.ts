import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function DELETE(_request: Request, { params }: { params: { id: string } }) {
  try {
    const categoryId = parseInt(params.id);

    if (isNaN(categoryId)) {
      return NextResponse.json({ error: "Invalid category ID" }, { status: 400 });
    }

    // Vérifie si la catégorie contient des items
    const category = await prisma.category.findUnique({
      where: { id: categoryId },
      include: {
        items: true,
      },
    });

    if (!category) {
      return NextResponse.json({ error: "Category not found" }, { status: 404 });
    }

    if (category.items.length > 0) {
      return NextResponse.json(
        { error: "Vous devez supprimer tous les items associés avant de supprimer cette catégorie." },
        { status: 400 }
      );
    }

    // Supprime la catégorie
    await prisma.category.delete({
      where: { id: categoryId },
    });

    return NextResponse.json({ message: "Catégorie supprimée avec succès." });
  } catch (error) {
    console.error("Error deleting category:", error);
    return NextResponse.json(
      { error: "Une erreur inattendue s'est produite lors de la suppression." },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  try {
    const categoryId = parseInt(params.id);

    if (isNaN(categoryId)) {
      return NextResponse.json({ error: "Invalid category ID" }, { status: 400 });
    }

    const { name } = await request.json();

    if (!name || name.trim() === "") {
      return NextResponse.json({ error: "Category name is required" }, { status: 400 });
    }

    const updatedCategory = await prisma.category.update({
      where: { id: categoryId },
      data: { name },
    });

    return NextResponse.json(updatedCategory);
  } catch (error) {
    console.error("Error updating category name:", error);
    return NextResponse.json({ error: "Failed to update category name" }, { status: 500 });
  }
}