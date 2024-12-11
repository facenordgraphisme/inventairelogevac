"use client";

import { useEffect, useState } from "react";
import { AddCategory } from "@/components/AddCategory";
import { AddItem } from "@/components/AddItem";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

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
  const router = useRouter();
  

  // Résolvez `params.slug`
  useEffect(() => {
    const resolveParams = async () => {
      const resolvedParams = await params; // Assurez-vous d'attendre params
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
      data.categories.forEach((category: any) => fetchItems(category.id));
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
  
      let data;
      try {
        data = await response.json();
      } catch (jsonError) {
        console.warn("Response is not JSON:", jsonError);
        data = null;
      }
  
      if (!response.ok) {
        if (data?.error) {
          toast.error(data.error); // Affiche le message d'erreur spécifique
        } else {
          toast.error("Impossible de supprimer la catégorie.");
        }
        return;
      }
  
      if (apartmentSlug) {
        fetchCategories(apartmentSlug); // Rafraîchit les catégories après suppression
      }
      toast.success(data?.message || "Catégorie supprimée avec succès !");
    } catch (error) {
      console.error("Error deleting category:", error);
      toast.error("Une erreur inattendue s'est produite lors de la suppression.");
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

      toast.success("Item supprimé avec succès !");
      fetchItems(categoryId);
    } catch (error) {
      console.error("Error deleting item:", error);
      toast.error("Impossible de supprimer l'item.");
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

      toast.success("Item mis à jour avec succès !");
      fetchItems(categoryId);
    } catch (error) {
      console.error("Error updating item:", error);
      toast.error("Impossible de mettre à jour l'item.");
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
  
      // Met à jour le nom dans l'état local
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

      <div className="flex justify-between items-center mb-6 px-8">
        <button
          onClick={() => router.back()}
          className="bg-[#b39625] text-white px-4 py-2 rounded-full shadow-xl"
          >
          Retour
        </button>
        <h1 className="text-3xl font-bold text-center flex-grow mx-4">
          {apartment
            ? `Inventaire du logement ${apartment.name} du bâtiment ${apartment.building.name}`
            : "Chargement..."}
        </h1>
        <img src="/assets/logo.png" alt="Logo" className="h-20 w-auto object-contain" />
      </div>
      {apartmentSlug && (
  <AddCategory
    apartmentSlug={apartmentSlug}
    onCategoryAdded={() => fetchCategories(apartmentSlug)}
  />
)}

      <ul className="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-2 gap-6">
        {categories.map((category) => (
          <li key={category.id} className="bg-white p-4 rounded shadow">
            <div className="flex justify-between items-center pb-4">
              <h3 className="text-lg font-semibold">{category.name}</h3>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    const newName = prompt("Entrez le nouveau nom de la catégorie :", category.name);
                    if (newName && newName.trim() !== "") {
                      updateCategoryName(category.id, newName);
                    }
                  }}
                  className="bg-blue-500 text-white px-3 py-1 rounded-full hover:bg-blue-600 transition duration-300"
                >
                  Modifier
                </button>
                <button
                  onClick={() => deleteCategory(category.id)}
                  className={`bg-white border border-red-600 text-red-600 px-4 py-1 rounded-full hover:bg-red-600 hover:text-white transition duration-300 ease-in-out ${
                    deletingCategoryId === category.id ? "opacity-50 pointer-events-none" : ""
                  }`}
                >
                  {deletingCategoryId === category.id ? "Suppression..." : "Supprimer"}
                </button>
              </div>
            </div>
            <AddItem
  categoryId={category.id}
  items={items[category.id] || []}
  onItemAdded={() => fetchItems(category.id)}
  onItemsReordered={(updatedItems) => {
    setItems((prev) => ({
      ...prev,
      [category.id]: updatedItems,
    }));
  }}
/>

          </li>
        ))}
      </ul>
        </div>
    </main>
  );
}
