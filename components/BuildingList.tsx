"use client";

import { useState } from "react";

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
  };

  const deleteBuilding = async (buildingSlug: string) => {
    try {
      const response = await fetch(`/api/buildings/${buildingSlug}`, { method: "DELETE" });
  
      if (!response.ok) {
        console.error("Failed to delete building:", response.statusText);
        return;
      }
  
      onBuildingDeleted(); // Rafraîchit la liste après suppression
    } catch (error) {
      console.error("Error deleting building:", error);
    }
  };

  return (
    <div className="space-y-4">
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
      <ul className="space-y-2">
        {buildings.map((building: any) => (
          <li key={building.id} className="bg-white p-4 rounded shadow flex justify-between items-center">
            <span className="text-lg font-semibold">{building.name}</span>
            <div className="flex gap-2">
            <a
  href={`/building/${building.name}`} // Utiliser le `name` au lieu de `id`
  className="bg-[#b39625] text-white px-4 py-2 rounded"
>
  Voir les logements
</a>

<button
  onClick={() => deleteBuilding(building.slug)} // Utilisation correcte du slug
  className="border-2 border-red-500 text-black hover:text-white transition duration-300 font-medium px-4 py-2 rounded hover:bg-red-600"
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
