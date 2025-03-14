"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";

interface Building {
  id: number;
  name: string;
  slug: string;
  _count: {
    apartments: number; // ✅ Nombre d'appartements dans chaque bâtiment
  };
}

export function BuildingList() {
  const [buildings, setBuildings] = useState<Building[]>([]);
  const [newBuildingName, setNewBuildingName] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [editingBuilding, setEditingBuilding] = useState<Building | null>(null);
  const [editingBuildingName, setEditingBuildingName] = useState("");

  // Charger la liste des bâtiments
  const fetchBuildings = async () => {
    try {
      const response = await fetch("/api/buildings");
      const data = await response.json();
      setBuildings(data);
    } catch (error) {
      console.error("Erreur de chargement des bâtiments :", error);
    }
  };

  useEffect(() => {
    fetchBuildings();
  }, []);

  // Ajouter un bâtiment
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
        throw new Error("Échec de la création du bâtiment.");
      }

      const newBuilding = await response.json();
      setNewBuildingName("");
      setBuildings((prev) => [...prev, newBuilding]);
      toast.success("Bâtiment ajouté avec succès !");
    } catch (error) {
      console.error("Erreur lors de l'ajout du bâtiment :", error);
      toast.error("Une erreur est survenue.");
    }
  };

  // Modifier un bâtiment
  const updateBuilding = async (buildingSlug: string) => {
    if (!editingBuildingName.trim()) {
      toast.error("Le nom du bâtiment est requis.");
      return;
    }

    try {
      const response = await fetch(`/api/buildings/${buildingSlug}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: editingBuildingName }),
      });

      if (!response.ok) {
        throw new Error("Échec de la mise à jour.");
      }

      const updatedBuilding = await response.json();

      setBuildings((prev) =>
        prev.map((building) =>
          building.slug === buildingSlug ? { ...building, name: updatedBuilding.name } : building
        )
      );

      setEditingBuilding(null);
      toast.success("Bâtiment mis à jour !");
    } catch (error) {
      console.error("Erreur lors de la mise à jour :", error);
      toast.error("Impossible de mettre à jour.");
    }
  };

  // Supprimer un bâtiment
  const deleteBuilding = async (buildingSlug: string) => {
    try {
      const response = await fetch(`/api/buildings/${buildingSlug}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorData = await response.json();
        toast.error(errorData.error || "Impossible de supprimer.");
        return;
      }

      setBuildings((prev) => prev.filter((b) => b.slug !== buildingSlug));
      toast.success("Bâtiment supprimé !");
    } catch (error) {
      console.error("Erreur lors de la suppression :", error);
      toast.error("Une erreur est survenue.");
    }
  };

  // Filtrer les bâtiments
  const filteredBuildings = buildings.filter((building) =>
    building.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <p className="text-lg font-semibold">Rechercher un bâtiment</p>
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Rechercher un bâtiment"
        className="border rounded-xl px-4 py-2 w-full"
      />

      <p className="text-lg font-semibold">Créer un nouveau bâtiment</p>
      <div className="flex items-center gap-4">
        <input
          type="text"
          value={newBuildingName}
          onChange={(e) => setNewBuildingName(e.target.value)}
          placeholder="Nom du bâtiment"
          className="border rounded-xl px-4 py-2 flex-grow"
        />
        <button onClick={addBuilding} className="bg-[#b39625] text-white px-4 py-2 rounded-full">
          Créer
        </button>
      </div>

      {filteredBuildings.length > 0 ? (
        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBuildings.map((building) => (
            <li key={building.id} className="bg-white p-4 rounded shadow-xl flex flex-col border">
              {editingBuilding?.id === building.id ? (
                <div className="flex flex-col items-center">
                  <input
                    type="text"
                    value={editingBuildingName}
                    onChange={(e) => setEditingBuildingName(e.target.value)}
                    className="border px-2 py-1 rounded text-lg font-semibold w-full"
                    autoFocus
                  />
                  <div className="flex gap-2 mt-2">
                    <button onClick={() => updateBuilding(building.slug)} className="bg-green-500 text-white px-3 py-1 rounded">
                      Valider
                    </button>
                    <button onClick={() => setEditingBuilding(null)} className="bg-gray-400 text-white px-3 py-1 rounded">
                      Annuler
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold">
                    {building.name}{" "}
                    <span className="text-sm text-gray-500">
                      ({building._count.apartments} logements)
                    </span>
                  </span>
                  <button
                    onClick={() => {
                      setEditingBuilding(building);
                      setEditingBuildingName(building.name);
                    }}
                    className="bg-blue-500 text-white px-3 py-1 rounded-full"
                  >
                    Modifier
                  </button>
                </div>
              )}

              <div className="flex gap-2 mt-4">
                <a
                  href={`/building/${building.slug}`}
                  className="bg-white border border-[#b39625] hover:bg-[#b39625] text-[#b39625] hover:text-white px-4 py-2 rounded-full"
                >
                  Voir les logements
                </a>
                <button onClick={() => deleteBuilding(building.slug)} className="bg-red-600 text-white px-4 py-2 rounded-full">
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
