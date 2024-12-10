"use client";

import { useState } from "react";
import { toast } from "sonner";

export function BuildingList({ buildings, onBuildingAdded, onBuildingDeleted }: any) {
  const [newBuildingName, setNewBuildingName] = useState("");

  const addBuilding = async () => {
    await fetch("/api/buildings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: newBuildingName }),
    });
    setNewBuildingName("");
    onBuildingAdded();
    toast.success("Bâtiment ajouté avec succès !");
  };

  const deleteBuilding = async (buildingSlug: string) => {
    try {
      const response = await fetch(`/api/buildings/${buildingSlug}`, { method: "DELETE" });

      if (!response.ok) {
        const errorData = await response.json(); // Parse le JSON de l'erreur
        if (errorData.error) {
          toast.error(errorData.error); // Afficher le message d'erreur spécifique
        } else {
          toast.error("Impossible de supprimer le bâtiment.");
        }
        return;
      }

      onBuildingDeleted(); // Rafraîchit la liste après suppression
      toast.success("Bâtiment supprimé avec succès !");
    } catch (error) {
      console.error("Error deleting building:", error);
      toast.error("Une erreur inattendue s'est produite.");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <input
          type="text"
          value={newBuildingName}
          onChange={(e) => setNewBuildingName(e.target.value)}
          placeholder="Nom du bâtiment"
          className="border rounded px-4 py-2 flex-grow"
        />
        <button
          onClick={addBuilding}
          className="bg-[#b39625] text-white px-4 py-2 rounded"
        >
          Ajouter
        </button>
      </div>
      <ul className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {buildings.map((building: any) => (
          <li
            key={building.id}
            className="bg-white p-4 rounded shadow flex flex-col justify-between items-center"
          >
            <span className="text-lg font-semibold">{building.name}</span>
            <div className="flex gap-2 mt-4">
              <a
                href={`/building/${building.slug}`}
                className="bg-[#b39625] text-white px-4 py-2 rounded"
              >
                Voir les logements
              </a>
              <button
                onClick={() => deleteBuilding(building.slug)}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
              >
                Supprimer
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
