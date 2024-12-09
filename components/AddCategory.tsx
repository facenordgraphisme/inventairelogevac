"use client";

import { useState } from "react";

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
      console.error("Apartment slug is missing.");
      return;
    }

    if (!categoryName.trim()) {
      console.error("Category name cannot be empty.");
      return;
    }

    try {
      const response = await fetch(`/api/apartments/${apartmentSlug}/inventory`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: categoryName }),
      });

      if (!response.ok) {
        throw new Error("Failed to add category");
      }

      setCategoryName(""); // Réinitialiser le champ
      onCategoryAdded(); // Rafraîchir les catégories
    } catch (error) {
      console.error("Error adding category:", error);
    }
  };

  return (
    <div className="flex gap-4 mb-4">
      <input
        type="text"
        value={categoryName}
        onChange={(e) => setCategoryName(e.target.value)}
        placeholder="Nom de la catégorie"
        className="border rounded px-2 py-1 flex-grow"
      />
      <button
        onClick={addCategory}
        className="bg-[#b39625] text-white px-4 py-2 rounded"
      >
        Ajouter
      </button>
    </div>
  );
}
