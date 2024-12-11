"use client";

import { useState } from "react";
import { toast } from "sonner";

export function AddCategory({
  apartmentSlug,
  onCategoryAdded,
}: {
  apartmentSlug: string | null;
  onCategoryAdded: () => void;
}) {
  const [categoryName, setCategoryName] = useState("");

  const addCategory = async () => {
    if (!apartmentSlug) {
      toast.error("Le slug de l'appartement est manquant.");
      return;
    }

    if (!categoryName.trim()) {
      toast.error("Le nom de la catégorie ne peut pas être vide.");
      return;
    }

    try {
      const response = await fetch(`/api/apartments/${apartmentSlug}/inventory`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: categoryName }),
      });

      if (!response.ok) {
        throw new Error("Échec de l'ajout de la catégorie.");
      }

      toast.success("Catégorie ajoutée avec succès !");
      setCategoryName(""); // Réinitialiser le champ
      onCategoryAdded(); // Rafraîchir les catégories
    } catch (error) {
      console.error("Error adding category:", error);
      toast.error("Une erreur inattendue s'est produite.");
    }
  };

  return (
    <div>
      <p className="text-lg font-semibold pb-6">Créer une catégorie</p>
      <div className="flex gap-4 mb-4">
        <input
          type="text"
          value={categoryName}
          onChange={(e) => setCategoryName(e.target.value)}
          placeholder="Nom de la catégorie"
          className="border rounded-xl px-2 py-1 flex-grow"
          />
        <button
          onClick={addCategory}
          className="bg-[#b39625] text-white px-4 py-2 rounded-full"
          >
          Créer
        </button>
      </div>
    </div>
  );
}
