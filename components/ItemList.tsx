"use client";

import { useState } from "react";

export function ItemList({
  items,
  onItemUpdated,
  onItemDeleted,
}: {
  items: any[];
  onItemUpdated: () => void;
  onItemDeleted: () => void;
}) {
  const [editingItemId, setEditingItemId] = useState<number | null>(null);
  const [updatedName, setUpdatedName] = useState("");
  const [updatedQuantity, setUpdatedQuantity] = useState<number | null>(null);

  const updateItem = async (itemId: number) => {
    try {
      const response = await fetch(`/api/items/${itemId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...(updatedName && { name: updatedName }),
          ...(updatedQuantity !== null && { quantity: updatedQuantity }),
        }),
      });

      if (!response.ok) {
        console.error("Failed to update item:", response.statusText);
        return;
      }

      setEditingItemId(null);
      setUpdatedName("");
      setUpdatedQuantity(null);
      onItemUpdated(); // Rafraîchir la liste des items
    } catch (error) {
      console.error("Error updating item:", error);
    }
  };

  const deleteItem = async (itemId: number) => {
    try {
      const response = await fetch(`/api/items/${itemId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        console.error("Failed to delete item:", response.statusText);
        return;
      }

      onItemDeleted(); // Rafraîchir la liste des items
    } catch (error) {
      console.error("Error deleting item:", error);
    }
  };

  return (
    <ul className="space-y-2">
      {items.map((item) => (
        <li
          key={item.id}
          className="bg-white p-4 rounded shadow flex justify-between items-center"
        >
          {editingItemId === item.id ? (
            <div className="flex items-center gap-4">
              <input
                type="text"
                value={updatedName || item.name}
                onChange={(e) => setUpdatedName(e.target.value)}
                placeholder="Nom"
                className="border rounded px-2 py-1"
              />
              <input
                type="number"
                value={updatedQuantity !== null ? updatedQuantity : item.quantity}
                onChange={(e) => setUpdatedQuantity(parseInt(e.target.value, 10))}
                placeholder="Quantité"
                className="border rounded px-2 py-1"
              />
              <button
                onClick={() => updateItem(item.id)}
                className="bg-green-500 text-white px-4 py-2 rounded"
              >
                Enregistrer
              </button>
              <button
                onClick={() => setEditingItemId(null)}
                className="bg-gray-500 text-white px-4 py-2 rounded"
              >
                Annuler
              </button>
            </div>
          ) : (
            <>
              <span>{`${item.name} - ${item.quantity}`}</span>
              <div className="flex gap-2">
                <button
                  onClick={() => setEditingItemId(item.id)}
                  className="bg-blue-500 text-white px-4 py-2 rounded"
                >
                  Modifier
                </button>
                <button
                  onClick={() => deleteItem(item.id)}
                  className="bg-red-500 text-white px-4 py-2 rounded"
                >
                  Supprimer
                </button>
              </div>
            </>
          )}
        </li>
      ))}
    </ul>
  );
}
