"use client";

import { useState } from "react";
import { toast } from "sonner";

export function AddItem({
  categoryId,
  onItemAdded,
}: {
  categoryId: number;
  onItemAdded: () => void;
}) {
  const [itemName, setItemName] = useState("");
  const [itemQuantity, setItemQuantity] = useState(1);

  const addItem = async () => {
    if (!itemName.trim()) {
      toast.error("Le nom de l'item ne peut pas être vide.");
      return;
    }

    if (itemQuantity < 1) {
      toast.error("La quantité doit être d'au moins 1.");
      return;
    }

    try {
      const response = await fetch(`/api/categories/${categoryId}/items`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: itemName, quantity: itemQuantity }),
      });

      if (!response.ok) {
        throw new Error("Échec de l'ajout de l'item.");
      }

      toast.success("Item ajouté avec succès !");
      setItemName("");
      setItemQuantity(1);
      onItemAdded(); // Rafraîchir les items
    } catch (error) {
      console.error("Error adding item:", error);
      toast.error("Une erreur inattendue s'est produite.");
    }
  };

  return (
    <div className="flex gap-4 mb-4 items-end">
      {/* Input pour le nom de l'item */}
      <input
        type="text"
        value={itemName}
        onChange={(e) => setItemName(e.target.value)}
        placeholder="Nom de l'item"
        className="border rounded px-2 py-1 flex-grow"
      />

      {/* Input pour la quantité avec un label */}
      <div className="flex flex-col items-start">
        <label htmlFor="itemQuantity" className="text-sm font-medium text-gray-700">
          Quantité
        </label>
        <input
          id="itemQuantity"
          type="number"
          value={itemQuantity}
          onChange={(e) => setItemQuantity(Number(e.target.value))}
          placeholder="Quantité"
          min="1"
          className="border rounded px-2 py-1 w-20"
        />
      </div>

      {/* Bouton Ajouter */}
      <button
        onClick={addItem}
        className="bg-[#b39625] text-white px-4 py-2 rounded"
      >
        Ajouter
      </button>
    </div>
  );
}
