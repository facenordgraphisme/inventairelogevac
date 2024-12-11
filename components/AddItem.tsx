import { useState } from "react";
import {
  DndContext,
  closestCenter,
  useSensor,
  useSensors,
  MouseSensor,
  KeyboardSensor,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";
import { SortableItem } from "./SortableItem";
import { toast } from "sonner";

export function AddItem({
  categoryId,
  items,
  onItemAdded,
  onItemsReordered,
}: {
  categoryId: number;
  items: any[];
  onItemAdded: () => void;
  onItemsReordered: (updatedItems: any[]) => void;
}) {
  const [itemName, setItemName] = useState("");
  const [itemQuantity, setItemQuantity] = useState(1);

  const sensors = useSensors(useSensor(MouseSensor), useSensor(KeyboardSensor));

  const addItem = async () => {
    if (!itemName.trim()) {
      toast.error("Le nom de l'item est requis.");
      return;
    }

    if (itemQuantity < 1) {
      toast.error("La quantité doit être au moins 1.");
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
      toast.success("Item ajouté avec succès !");
    } catch (error) {
      console.error("Error adding item:", error);
      toast.error("Une erreur inattendue s'est produite lors de l'ajout.");
    }
  };

  const handleDragEnd = async (event: any) => {
    const { active, over } = event;
  
    if (active.id !== over.id) {
      const oldIndex = items.findIndex((item) => item.id === active.id);
      const newIndex = items.findIndex((item) => item.id === over.id);
  
      const updatedItems = arrayMove(items, oldIndex, newIndex);
  
      try {
        const response = await fetch(`/api/categories/${categoryId}/items`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ reorderedItems: updatedItems }),
        });
  
        if (!response.ok) {
          throw new Error("Failed to update item order");
        }
  
        onItemsReordered(updatedItems); // Met à jour l'état local après succès
        toast.success("Ordre mis à jour !");
      } catch (error) {
        console.error("Error updating item order:", error);
        toast.error("Impossible de mettre à jour l'ordre.");
      }
    }
  };
  

  const updateItem = async (itemId: number, quantity: number) => {
    try {
      const response = await fetch(`/api/items/${itemId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ quantity }),
      });

      if (!response.ok) {
        throw new Error("Failed to update item");
      }

      onItemAdded(); // Rafraîchir les items après mise à jour
      toast.success("Quantité mise à jour !");
    } catch (error) {
      console.error("Error updating item:", error);
      toast.error("Impossible de mettre à jour l'item.");
    }
  };

  const deleteItem = async (itemId: number) => {
    try {
      const response = await fetch(`/api/items/${itemId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete item");
      }

      onItemAdded(); // Rafraîchir les items après suppression
      toast.success("Item supprimé avec succès !");
    } catch (error) {
      console.error("Error deleting item:", error);
      toast.error("Impossible de supprimer l'item.");
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-4">
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

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={items.map((item) => item.id)}
          strategy={verticalListSortingStrategy}
        >
          <ul className="space-y-2">
            {items.map((item) => (
              <SortableItem
                key={item.id}
                id={item.id}
                name={item.name}
                quantity={item.quantity}
              >
                <div className="flex gap-2">
                  <button
                    onClick={() => updateItem(item.id, item.quantity + 1)}
                    className="border border-green-500 text-black font-semibold px-3 py-1 rounded-full"
                  >
                    +1
                  </button>
                  <button
                    onClick={() =>
                      item.quantity > 1 && updateItem(item.id, item.quantity - 1)
                    }
                    className="border border-yellow-500 text-black font-semibold px-3 py-1 rounded-full"
                  >
                    -1
                  </button>
                  <button
                    onClick={() => deleteItem(item.id)}
                    className="bg-white border border-red-600 text-red-600 px-3 py-1 rounded-full hover:bg-red-600 hover:text-white transition duration-300 ease-in-out"
                  >
                    Supprimer
                  </button>
                </div>
              </SortableItem>
            ))}
          </ul>
        </SortableContext>
      </DndContext>
    </div>
  );
}
