import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { apartmentTemplates } from "@/lib/apartmentTemplates"; // Import des modèles

// Définition des types pour éviter les erreurs
interface ApartmentTemplate {
  name: string;
  items: string[];
}

export async function POST(request: Request, context: { params: { slug: string } }) {
  try {
    const { slug } = context.params; // ✅ Correction ici
    const { name, type } = await request.json(); // ✅ Vérifie que les données sont reçues

    if (!name || !type) {
      return NextResponse.json({ error: "Le nom et le type de logement sont obligatoires." }, { status: 400 });
    }

    const building = await prisma.building.findUnique({
      where: { slug },
    });

    if (!building) {
      return NextResponse.json({ error: "Building not found" }, { status: 404 });
    }

    // Création de l'appartement avec son type
    const apartment = await prisma.apartment.create({
      data: {
        name,
        type,
        slug: `${slug}-${name.replace(/\s+/g, "-").toLowerCase()}`,
        buildingId: building.id,
      },
    });

    // Vérifier si un modèle d'inventaire existe pour ce type de logement
    const template = apartmentTemplates[type as keyof typeof apartmentTemplates];

    if (template) {
      // Créer l'inventaire de l'appartement
      const inventory = await prisma.inventory.create({
        data: { apartmentId: apartment.id },
      });

      // Ajouter les catégories et les items
      for (const category of template) {
        const createdCategory = await prisma.category.create({
          data: {
            name: category.name,
            inventoryId: inventory.id,
          },
        });

        await prisma.item.createMany({
          data: category.items.map((item, index) => ({
            name: item,
            quantity: 1,
            order: index,
            categoryId: createdCategory.id,
          })),
        });
      }
    }

    return NextResponse.json(apartment);
  } catch (error) {
    console.error("Error creating apartment:", error);
    return NextResponse.json({ error: "Failed to create apartment" }, { status: 500 });
  }
}

export async function GET(request: Request, context: { params: { slug: string } }) {
  try {
    const { slug } = context.params;

    const building = await prisma.building.findUnique({
      where: { slug },
    });

    if (!building) {
      return NextResponse.json([], { status: 200 });
    }

    const apartments = await prisma.apartment.findMany({
      where: { buildingId: building.id },
    });

    return NextResponse.json(apartments);
  } catch (error) {
    console.error("Error fetching apartments:", error);
    return NextResponse.json({ error: "Failed to fetch apartments" }, { status: 500 });
  }
}
