"use client";

import { useState } from "react";
import { toast } from "sonner";

export function BuildingList({ buildings = [], onBuildingAdded, onBuildingDeleted }: any) {
  const [newBuildingName, setNewBuildingName] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOption, setSortOption] = useState("name");

  const addBuilding = async () => {
    if (!newBuildingName.trim()) {
      toast.error("Le nom du bâtiment est requis.");
      return;
    }

    try {
      const response = await fetch("/api/buildings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newBuildingName }),
      });

      if (!response.ok) {
        throw new Error("Failed to create building");
      }

      setNewBuildingName("");
      onBuildingAdded();
      toast.success("Bâtiment ajouté avec succès !");
    } catch (error) {
      console.error("Error adding building:", error);
      toast.error("Une erreur inattendue s'est produite lors de l'ajout.");
    }
  };

  const deleteBuilding = async (buildingSlug: string) => {
    try {
      const response = await fetch(`/api/buildings/${buildingSlug}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorData = await response.json();
        if (errorData.error) {
          toast.error(errorData.error);
        } else {
          toast.error("Impossible de supprimer le bâtiment.");
        }
        return;
      }

      onBuildingDeleted();
      toast.success("Bâtiment supprimé avec succès !");
    } catch (error) {
      console.error("Error deleting building:", error);
      toast.error("Une erreur inattendue s'est produite lors de la suppression.");
    }
  };

  const sortedBuildings = Array.isArray(buildings)
    ? [...buildings].sort((a: any, b: any) => {
        if (sortOption === "name") {
          return a.name.localeCompare(b.name);
        } else if (sortOption === "createdAt") {
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        }
        return 0;
      })
    : [];

  const filteredBuildings = sortedBuildings.filter((building: any) =>
    building.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <p className="text-lg font-semibold">Rechercher un batiment</p>
      {/* Barre de recherche, tri et création */}
      <div className="flex items-center justify-between gap-4">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Rechercher un bâtiment"
          className="border rounded-xl px-4 py-2 flex-grow"
        />
        <select
          value={sortOption}
          onChange={(e) => setSortOption(e.target.value)}
          className="border rounded-xl px-4 py-2"
        >
          <option value="name">Trier par nom</option>
          <option value="createdAt">Trier par date de création</option>
        </select>
      </div>

      {/* Formulaire de création de bâtiment */}
      <p className="text-lg font-semibold">Créer un nouveau batiment</p>
      <div className="flex items-center gap-4">
        <input
          type="text"
          value={newBuildingName}
          onChange={(e) => setNewBuildingName(e.target.value)}
          placeholder="Nom du bâtiment"
          className="border rounded-xl px-4 py-2 flex-grow"
        />
        <button
          onClick={addBuilding}
          className="bg-[#b39625] text-white px-4 py-2 rounded-full hover:bg-[#a3851f] transition duration-300"
        >
          Ajouter un bâtiment
        </button>
      </div>

      {/* Liste des bâtiments */}
      {filteredBuildings.length > 0 ? (
        <ul className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBuildings.map((building: any) => (
            <li
              key={building.id}
              className="bg-white p-4 rounded shadow-xl flex flex-col justify-between items-center border border-gray-200"
            >
              <span className="text-lg font-semibold">
                {building.name}{" "}
                <span className="text-sm font-medium">({building._count.apartments} logements)</span>
              </span>
              <div className="flex gap-2 mt-4">
                <a
                  href={`/building/${building.slug}`}
                  className="bg-white border border-[#b39625] hover:bg-[#b39625] text-[#b39625] hover:text-white px-4 py-2 rounded-full transition duration-300 ease-in-out"
                >
                  Voir les logements
                </a>
                <button
                  onClick={() => deleteBuilding(building.slug)}
                  className="bg-white border border-red-600 text-red-600 px-4 py-2 rounded-full hover:bg-red-600 hover:text-white transition duration-300 ease-in-out"
                >
                  Supprimer
                </button>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-500 text-center">Aucun bâtiment trouvé.</p>
      )}
    </div>
  );
}
