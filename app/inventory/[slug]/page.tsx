"use client";

import { useEffect, useState } from "react";
import { AddCategory } from "@/components/AddCategory";
import { AddItem } from "@/components/AddItem";
import { InventoryPrintView } from "@/components/InventoryPrintView";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface Apartment {
  id: number;
  name: string;
  type: string; // Ajout du type de logement
  building: {
    name: string;
  };
}

export default function InventoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const [apartment, setApartment] = useState<Apartment | null>(null);
  const [categories, setCategories] = useState<any[]>([]);
  const [inventory, setInventory] = useState<any | null>(null);
  const [apartmentSlug, setApartmentSlug] = useState<string | null>(null);
  const [deletingCategoryId, setDeletingCategoryId] = useState<number | null>(null);
  const [items, setItems] = useState<{ [key: number]: any[] }>({});
  const [showPrintPreview, setShowPrintPreview] = useState(false);
  const [loadingPrint, setLoadingPrint] = useState(false); // Ajout d'un état pour gérer le chargement de l'impression
  const router = useRouter();

  // Résolution du paramètre slug
  useEffect(() => {
    const resolveParams = async () => {
      const resolvedParams = await params;
      setApartmentSlug(resolvedParams.slug);
    };
    resolveParams();
  }, [params]);

  // Chargement de l'appartement et de l'inventaire
  useEffect(() => {
    if (apartmentSlug) {
      fetchApartment(apartmentSlug);
      fetchInventory(apartmentSlug);
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

  const fetchInventory = async (slug: string) => {
    try {
      const response = await fetch(`/api/apartments/${slug}/inventory`);
      const data = await response.json();
      setInventory(data);
      setCategories(data.categories || []);
      data.categories.forEach((category: any) => fetchItems(category.id));
    } catch (error) {
      console.error("Error fetching inventory:", error);
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

  const refreshInventoryBeforePrint = async () => {
    if (!apartmentSlug) return;

    setLoadingPrint(true);
    try {
      await fetchInventory(apartmentSlug); // Rafraîchir les données
      setTimeout(() => {
        setShowPrintPreview(true);
        setLoadingPrint(false);
      }, 500); // Petit délai pour assurer la mise à jour avant affichage
    } catch (error) {
      console.error("Erreur lors du rafraîchissement de l'inventaire :", error);
      toast.error("Erreur lors du rafraîchissement de l'inventaire.");
      setLoadingPrint(false);
    }
  };

  const deleteCategory = async (categoryId: number) => {
    setDeletingCategoryId(categoryId);
    try {
      const response = await fetch(`/api/categories/${categoryId}`, {
        method: "DELETE",
      });

      let data;
      try {
        data = await response.json();
      } catch (jsonError) {
        console.warn("Response is not JSON:", jsonError);
        data = null;
      }

      if (!response.ok) {
        if (data?.error) {
          toast.error(data.error);
        } else {
          toast.error("Impossible de supprimer la catégorie.");
        }
        return;
      }

      if (apartmentSlug) {
        fetchInventory(apartmentSlug);
      }
      toast.success(data?.message || "Catégorie supprimée avec succès !");
    } catch (error) {
      console.error("Error deleting category:", error);
      toast.error("Une erreur inattendue s'est produite lors de la suppression.");
    } finally {
      setDeletingCategoryId(null);
    }
  };

  const updateCategoryName = async (categoryId: number, newName: string) => {
    try {
      const response = await fetch(`/api/categories/${categoryId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newName }),
      });

      if (!response.ok) {
        throw new Error("Failed to update category name");
      }

      const updatedCategory = await response.json();

      setCategories((prev) =>
        prev.map((category) =>
          category.id === updatedCategory.id
            ? { ...category, name: updatedCategory.name }
            : category
        )
      );

      toast.success("Nom de la catégorie mis à jour !");
    } catch (error) {
      console.error("Error updating category name:", error);
      toast.error("Impossible de mettre à jour le nom de la catégorie.");
    }
  };

  return (
    <main className="p-6 bg-gray-50 min-h-screen flex gap-6 justify-center">
      <div className="max-w-7xl w-full p-6">
        {showPrintPreview ? (
          <div>
            <button
              onClick={() => setShowPrintPreview(false)}
              className="bg-red-500 text-white px-4 py-2 rounded mb-4"
            >
              Retour
            </button>
            {inventory && apartment && (
              <InventoryPrintView
                inventory={inventory}
                apartment={apartment}
                building={apartment.building}
              />
            )}
            <button
              onClick={() => window.print()}
              className="bg-green-500 text-white px-4 py-2 rounded mt-4"
            >
              Imprimer
            </button>
          </div>
        ) : (
          <div>
            <div className="flex justify-between items-center mb-6 px-8">
              <button
                onClick={() => router.back()}
                className="bg-[#b39625] text-white px-4 py-2 rounded-full shadow-xl"
              >
                Retour
              </button>
              <h1 className="text-3xl font-bold text-center flex-grow mx-4">
                {apartment
                  ? `Inventaire du logement ${apartment.name} (${apartment.type}) du bâtiment ${apartment.building.name}`
                  : "Chargement..."}
              </h1>
              <img src="/assets/logo.png" alt="Logo" className="h-20 w-auto object-contain" />
            </div>
            {apartmentSlug && (
              <AddCategory
                apartmentSlug={apartmentSlug}
                onCategoryAdded={() => fetchInventory(apartmentSlug)}
              />
            )}
            <ul className="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-2 gap-6">
              {categories.map((category) => (
                <li key={category.id} className="bg-white p-4 rounded shadow">
                  <div className="flex justify-between items-center pb-4">
                    <h3 className="text-lg font-semibold">{category.name}</h3>
                    <button
                      onClick={() => deleteCategory(category.id)}
                      disabled={deletingCategoryId === category.id}
                      className={`bg-red-500 text-white px-3 py-1 rounded ${
                        deletingCategoryId === category.id
                          ? "opacity-50 cursor-not-allowed"
                          : "hover:bg-red-600"
                      }`}
                    >
                      {deletingCategoryId === category.id ? "Suppression..." : "Supprimer"}
                    </button>
                  </div>
                  <AddItem
                    categoryId={category.id}
                    items={items[category.id] || []}
                    onItemAdded={() => fetchItems(category.id)}
                    onItemsReordered={(updatedItems) => {
                      setItems((prev) => ({
                        ...prev,
                        [category.id]: updatedItems, // Met à jour les items réordonnés dans l'état
                      }));
                    }}
                  />
                </li>
              ))}
            </ul>
            <button
              onClick={refreshInventoryBeforePrint}
              className="bg-blue-500 text-white px-4 py-2 rounded mt-6"
              disabled={loadingPrint}
            >
              {loadingPrint ? "Chargement..." : "Aperçu avant impression"}
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
