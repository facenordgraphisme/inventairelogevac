import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(_request: Request, context: { params: { slug: string } }) {
  try {
    const { slug } = await context.params; // Attendez explicitement `params`

    const apartment = await prisma.apartment.findUnique({
      where: { slug },
    });

    if (!apartment) {
      return NextResponse.json({ error: "Apartment not found" }, { status: 404 });
    }

    const inventory = await prisma.inventory.findFirst({
      where: { apartmentId: apartment.id },
      include: {
        categories: {
          include: {
            items: true,
          },
        },
      },
    });

    if (!inventory) {
      const newInventory = await prisma.inventory.create({
        data: { apartmentId: apartment.id },
      });

      return NextResponse.json({
        id: newInventory.id,
        apartmentId: newInventory.apartmentId,
        categories: [],
      });
    }

    return NextResponse.json({
      id: inventory.id,
      apartmentId: inventory.apartmentId,
      categories: inventory.categories,
    });
  } catch (error) {
    console.error("Error fetching inventory:", error);
    return NextResponse.json({ error: "Failed to fetch inventory" }, { status: 500 });
  }
}


export async function POST(
  request: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const apartmentSlug = params.slug;
    const { name } = await request.json();

    if (!name) {
      return NextResponse.json(
        { error: "Category name is required" },
        { status: 400 }
      );
    }

    // Trouver l'appartement via son slug
    const apartment = await prisma.apartment.findUnique({
      where: { slug: apartmentSlug },
    });

    if (!apartment) {
      return NextResponse.json(
        { error: "Apartment not found" },
        { status: 404 }
      );
    }

    // Vérifier si un inventaire existe déjà pour cet appartement
    let inventory = await prisma.inventory.findFirst({
      where: { apartmentId: apartment.id },
    });

    // Si aucun inventaire n'existe, en créer un
    if (!inventory) {
      inventory = await prisma.inventory.create({
        data: { apartmentId: apartment.id },
      });
    }

    // Ajouter la catégorie dans l'inventaire
    const category = await prisma.category.create({
      data: {
        name,
        inventoryId: inventory.id,
      },
    });

    return NextResponse.json(category);
  } catch (error) {
    console.error("Error adding category:", error);
    return NextResponse.json(
      { error: "Failed to add category" },
      { status: 500 }
    );
  }
}