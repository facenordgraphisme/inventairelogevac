"use client";

import { useState } from "react";
import { toast } from "sonner";

export function ApartmentList({
  apartments,
  buildingSlug,
  onApartmentDeleted,
  onApartmentAdded,
}: any) {
  const [newApartmentName, setNewApartmentName] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOption, setSortOption] = useState("number"); // Par défaut : tri par numéro

  // Ajouter un appartement
  const addApartment = async () => {
    try {
      const response = await fetch(`/api/buildings/${buildingSlug}/apartments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newApartmentName }),
      });

      if (!response.ok) {
        throw new Error("Failed to create apartment");
      }

      setNewApartmentName("");
      if (onApartmentAdded) onApartmentAdded();
      toast.success("Logement ajouté avec succès !");
    } catch (error) {
      console.error("Error adding apartment:", error);
      toast.error("Une erreur inattendue s'est produite lors de l'ajout.");
    }
  };

  // Supprimer un appartement
  const deleteApartment = async (apartmentSlug: string) => {
    try {
      const response = await fetch(`/api/apartments/${apartmentSlug}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorData = await response.json();
        if (errorData.error) {
          toast.error(errorData.error);
        } else {
          toast.error("Impossible de supprimer le logement.");
        }
        return;
      }

      if (onApartmentDeleted) onApartmentDeleted();
      toast.success("Logement supprimé avec succès !");
    } catch (error) {
      console.error("Error deleting apartment:", error);
      toast.error("Une erreur inattendue s'est produite lors de la suppression.");
    }
  };

  // Trier les appartements
  const sortedApartments = [...apartments].sort((a: any, b: any) => {
    if (sortOption === "number") {
      // Compare les numéros en tant que nombres
      return parseInt(a.name, 10) - parseInt(b.name, 10);
    } else if (sortOption === "createdAt") {
      return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
    }
    return 0;
  });

  // Filtrer les appartements par recherche
  const filteredApartments = sortedApartments.filter((apartment: any) =>
    apartment.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Ajouter un appartement */}
      <div className="flex items-center gap-4">
        <input
          type="text"
          value={newApartmentName}
          onChange={(e) => setNewApartmentName(e.target.value)}
          placeholder="Nom du logement"
          className="border rounded px-4 py-2 flex-grow"
        />
        <button
          onClick={addApartment}
          className="bg-[#b39625] text-white px-4 py-2 rounded"
        >
          Ajouter
        </button>
      </div>

      {/* Barre de recherche et tri */}
      <div className="flex items-center justify-between gap-4">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Rechercher un logement"
          className="border rounded px-4 py-2 flex-grow"
        />
        <select
          value={sortOption}
          onChange={(e) => setSortOption(e.target.value)}
          className="border rounded px-4 py-2"
        >
          <option value="number">Trier par numéro</option>
          <option value="createdAt">Trier par date de création</option>
        </select>
      </div>

      {/* Liste des logements */}
      <ul className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredApartments.length > 0 ? (
          filteredApartments.map((apartment: any) => (
            <li
              key={apartment.id}
              className="bg-white p-4 rounded shadow flex flex-col justify-between items-center"
            >
              <span className="text-lg font-semibold">{apartment.name}</span>
              <div className="flex gap-2 mt-4">
                <a
                  href={`/inventory/${apartment.slug}`}
                  className="bg-[#b39625] text-white px-4 py-2 rounded"
                >
                  Voir l'inventaire
                </a>
                <button
                  onClick={() => deleteApartment(apartment.slug)}
                  className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                >
                  Supprimer
                </button>
              </div>
            </li>
          ))
        ) : (
          <li className="text-gray-500 text-center">Aucun logement trouvé</li>
        )}
      </ul>
    </div>
  );
}
