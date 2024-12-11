import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET : Récupère tous les items d'une catégorie
export async function GET(request: Request, context: { params: { id: string } }) {
  const { id } = await context.params;

  const categoryId = parseInt(id);
  if (isNaN(categoryId)) {
    return NextResponse.json({ error: "Invalid category ID" }, { status: 400 });
  }

  try {
    const items = await prisma.item.findMany({
      where: { categoryId },
      orderBy: { order: "asc" },
    });

    return NextResponse.json(items);
  } catch (error) {
    console.error("Error fetching items:", error);
    return NextResponse.json({ error: "Failed to fetch items" }, { status: 500 });
  }
}

// POST : Ajoute un nouvel item à une catégorie
export async function POST(request: Request, { params }: { params: { id: string } }) {
  try {
    const categoryId = parseInt(params.id);

    if (isNaN(categoryId)) {
      return NextResponse.json({ error: "Invalid category ID" }, { status: 400 });
    }

    const { name, quantity } = await request.json();

    if (!name || quantity === undefined) {
      return NextResponse.json({ error: "Name and quantity are required" }, { status: 400 });
    }

    // Récupérez le nombre actuel d'items dans la catégorie pour définir l'ordre
    const currentItemsCount = await prisma.item.count({
      where: { categoryId },
    });

    const item = await prisma.item.create({
      data: {
        name,
        quantity,
        order: currentItemsCount, // Place l'item à la fin
        categoryId,
      },
    });

    return NextResponse.json(item);
  } catch (error) {
    console.error("Error creating item:", error);
    return NextResponse.json({ error: "Failed to create item" }, { status: 500 });
  }
}

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  try {
    const categoryId = parseInt(params.id);
    const { reorderedItems } = await request.json();

    if (isNaN(categoryId) || !Array.isArray(reorderedItems)) {
      return NextResponse.json({ error: "Invalid data" }, { status: 400 });
    }

    // Mettre à jour l'ordre des items
    for (let i = 0; i < reorderedItems.length; i++) {
      await prisma.item.update({
        where: { id: reorderedItems[i].id },
        data: { order: i }, // Supposez que la colonne `order` existe
      });
    }

    return NextResponse.json({ message: "Ordre mis à jour avec succès" });
  } catch (error) {
    console.error("Error updating item order:", error);
    return NextResponse.json({ error: "Failed to update item order" }, { status: 500 });
  }
}


export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const itemId = parseInt(params.id);

    if (isNaN(itemId)) {
      return NextResponse.json({ error: "Invalid item ID" }, { status: 400 });
    }

    await prisma.item.delete({
      where: { id: itemId },
    });

    return NextResponse.json({ message: "Item supprimé avec succès !" });
  } catch (error) {
    console.error("Error deleting item:", error);
    return NextResponse.json({ error: "Failed to delete item" }, { status: 500 });
  }
}