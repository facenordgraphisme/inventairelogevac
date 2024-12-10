import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// PUT : Met à jour un item
export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const itemId = parseInt(params.id);

    if (isNaN(itemId)) {
      return NextResponse.json({ error: "Invalid item ID" }, { status: 400 });
    }

    const { name, quantity } = await request.json();

    if (!name && quantity === undefined) {
      return NextResponse.json({ error: "Name or quantity must be provided" }, { status: 400 });
    }

    const updatedItem = await prisma.item.update({
      where: { id: itemId },
      data: {
        ...(name && { name }),
        ...(quantity !== undefined && { quantity }),
      },
    });

    return NextResponse.json(updatedItem);
  } catch (error) {
    console.error("Error updating item:", error);
    return NextResponse.json({ error: "Failed to update item" }, { status: 500 });
  }
}

// DELETE : Supprime un item
export async function DELETE(_request: Request, { params }: { params: { id: string } }) {
  try {
    const itemId = parseInt(params.id);

    if (isNaN(itemId)) {
      return NextResponse.json({ error: "Invalid item ID" }, { status: 400 });
    }

    await prisma.item.delete({
      where: { id: itemId },
    });

    return NextResponse.json({ message: "Item deleted successfully" });
  } catch (error) {
    console.error("Error deleting item:", error);
    return NextResponse.json({ error: "Failed to delete item" }, { status: 500 });
  }
}

