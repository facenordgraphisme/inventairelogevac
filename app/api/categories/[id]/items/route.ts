import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET : Récupère tous les items d'une catégorie
export async function GET(_request: Request, { params }: { params: { id: string } }) {
  try {
    const categoryId = parseInt(params.id);

    if (isNaN(categoryId)) {
      return NextResponse.json({ error: "Invalid category ID" }, { status: 400 });
    }

    const items = await prisma.item.findMany({
      where: { categoryId },
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

    const item = await prisma.item.create({
      data: {
        name,
        quantity,
        categoryId,
      },
    });

    return NextResponse.json(item);
  } catch (error) {
    console.error("Error creating item:", error);
    return NextResponse.json({ error: "Failed to create item" }, { status: 500 });
  }
}
