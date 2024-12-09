"use client";

import { useState } from "react";

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
      console.error("Item name cannot be empty.");
      return;
    }

    if (itemQuantity < 1) {
      console.error("Quantity must be at least 1.");
      return;
    }

    try {
      const response = await fetch(`/api/categories/${categoryId}/items`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: itemName, quantity: itemQuantity }),
      });

      if (!response.ok) {
        throw new Error("Failed to add item");
      }

      setItemName("");
      setItemQuantity(1);
      onItemAdded(); // Rafraîchir les items
    } catch (error) {
      console.error("Error adding item:", error);
    }
  };

  return (
    <div className="flex gap-4 mb-4 pt-4">
      <input
        type="text"
        value={itemName}
        onChange={(e) => setItemName(e.target.value)}
        placeholder="Nom de l'item"
        className="border rounded px-2 py-1 flex-grow"
      />
      <input
        type="number"
        value={itemQuantity}
        onChange={(e) => setItemQuantity(Number(e.target.value))}
        placeholder="Quantité"
        min="1"
        className="border rounded px-2 py-1 w-20"
      />
      <button
        onClick={addItem}
        className="bg-[#b39625] text-white px-4 py-2 rounded"
      >
        Ajouter
      </button>
    </div>
  );
}
