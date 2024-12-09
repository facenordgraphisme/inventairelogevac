"use client";

import { useEffect, useState } from "react";
import { AddCategory } from "@/components/AddCategory";
import { AddItem } from "@/components/AddItem";
import { useRouter } from "next/navigation";

interface Apartment {
  id: number;
  name: string;
  building: {
    name: string;
  };
}

export default function InventoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const [apartment, setApartment] = useState<Apartment | null>(null);
  const [categories, setCategories] = useState<any[]>([]);
  const [apartmentSlug, setApartmentSlug] = useState<string | null>(null);
  const [deletingCategoryId, setDeletingCategoryId] = useState<number | null>(null);
  const [items, setItems] = useState<{ [key: number]: any[] }>({});
  const router = useRouter(); // Pour la navigation

  // Résolvez `params.slug`
  useEffect(() => {
    const resolveParams = async () => {
      const resolvedParams = await params;
      setApartmentSlug(resolvedParams.slug);
    };
    resolveParams();
  }, [params]);

  // Chargez les données de l'appartement
  useEffect(() => {
    if (apartmentSlug) {
      fetchApartment(apartmentSlug);
      fetchCategories(apartmentSlug);
    }
  }, [apartmentSlug]);

  const fetchApartment = async (slug: string) => {
    try {
      const response = await fetch(`/api/apartments/${slug}`);
      const data = await response.json();
      setApartment(data);
    } catch (error) {
      console.error("Error fetching apartment:", error);
    }
  };

  const fetchCategories = async (slug: string) => {
    try {
      const response = await fetch(`/api/apartments/${slug}/inventory`);
      const data = await response.json();
      setCategories(data.categories || []);
      data.categories.forEach((category: any) => fetchItems(category.id)); // Charger les items pour chaque catégorie
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const deleteCategory = async (categoryId: number) => {
    setDeletingCategoryId(categoryId);
    try {
      const response = await fetch(`/api/categories/${categoryId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete category");
      }

      if (apartmentSlug) {
        fetchCategories(apartmentSlug);
      }
    } catch (error) {
      console.error("Error deleting category:", error);
    } finally {
      setDeletingCategoryId(null);
    }
  };

  const fetchItems = async (categoryId: number) => {
    try {
      const response = await fetch(`/api/categories/${categoryId}/items`);
      const data = await response.json();
      setItems((prev) => ({ ...prev, [categoryId]: data || [] }));
    } catch (error) {
      console.error("Error fetching items:", error);
    }
  };

  const deleteItem = async (itemId: number, categoryId: number) => {
    try {
      const response = await fetch(`/api/items/${itemId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete item");
      }

      fetchItems(categoryId); // Rafraîchir les items après suppression
    } catch (error) {
      console.error("Error deleting item:", error);
    }
  };

  const updateItem = async (itemId: number, categoryId: number, name: string, quantity: number) => {
    try {
      const response = await fetch(`/api/items/${itemId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, quantity }),
      });

      if (!response.ok) {
        throw new Error("Failed to update item");
      }

      fetchItems(categoryId); // Rafraîchir les items après modification
    } catch (error) {
      console.error("Error updating item:", error);
    }
  };

  return (
    <main className="p-6 bg-gray-50 min-h-screen flex flex-col gap-6">
      <div className="flex justify-between items-center mb-6 px-8">
  {/* Bouton de retour à gauche */}
  <button
    onClick={() => router.back()}
    className="bg-[#b39625] text-white px-4 py-2 rounded"
  >
    Retour
  </button>

  {/* Texte centré */}
  <h1 className="text-3xl font-bold text-center flex-grow mx-4">
    {apartment
      ? `Inventaire du logement ${apartment.name} du bâtiment ${apartment.building.name}`
      : "Chargement..."}
  </h1>

  {/* Logo à droite */}
  <img
    src="/assets/logo.png"
    alt="Logo"
    className="h-20 w-auto object-contain"
  />
</div>
      {apartmentSlug && (
        <AddCategory
          apartmentSlug={apartmentSlug}
          onCategoryAdded={() => fetchCategories(apartmentSlug)}
        />
      )}
      <ul className="space-y-4">
        {categories.map((category) => (
          <li key={category.id} className="bg-white p-4 rounded shadow">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">{category.name}</h3>
              <button
                onClick={() => deleteCategory(category.id)}
                className={`bg-red-500 text-white px-2 py-1 rounded ${
                  deletingCategoryId === category.id ? "opacity-50 pointer-events-none" : ""
                }`}
              >
                {deletingCategoryId === category.id ? "Suppression..." : "Supprimer"}
              </button>
            </div>
            <AddItem
              categoryId={category.id}
              onItemAdded={() => fetchItems(category.id)}
            />
            <ul className="mt-2 space-y-2">
              {items[category.id]?.length > 0 ? (
                items[category.id].map((item: any) => (
                  <li key={item.id} className="flex justify-between items-center p-2 bg-gray-100 rounded">
                    <span>
                      {item.name} - {item.quantity}
                    </span>
                    <div className="flex gap-2">
                      <button
                        onClick={() =>
                          updateItem(item.id, category.id, item.name, item.quantity + 1)
                        }
                        className="bg-green-500 text-white px-2 py-1 rounded"
                      >
                        +1
                      </button>
                      <button
                        onClick={() =>
                          updateItem(item.id, category.id, item.name, item.quantity - 1)
                        }
                        className="bg-yellow-500 text-white px-2 py-1 rounded"
                      >
                        -1
                      </button>
                      <button
                        onClick={() => deleteItem(item.id, category.id)}
                        className="bg-red-500 text-white px-2 py-1 rounded"
                      >
                        Supprimer
                      </button>
                    </div>
                  </li>
                ))
              ) : (
                <li className="text-gray-500">Aucun item</li>
              )}
            </ul>
          </li>
        ))}
      </ul>
    </main>
  );
}
