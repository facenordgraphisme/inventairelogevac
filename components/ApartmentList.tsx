"use client";

import { useState } from "react";

export function ApartmentList({ apartments, buildingSlug, onApartmentDeleted, onApartmentAdded }: any) {
  const [newApartmentName, setNewApartmentName] = useState("");

  // Ajouter un appartement
  const addApartment = async () => {
    const response = await fetch(`/api/buildings/${buildingSlug}/apartments`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: newApartmentName }),
    });

    if (!response.ok) {
      console.error("Failed to create apartment:", response.statusText);
      return;
    }

    setNewApartmentName("");
    if (onApartmentAdded) onApartmentAdded(); // Appeler le callback après ajout
  };

  // Supprimer un appartement
  const deleteApartment = async (apartmentSlug: string) => {
    try {
      const response = await fetch(`/api/apartments/${apartmentSlug}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        console.error("Failed to delete apartment:", response.statusText);
        return;
      }

      if (onApartmentDeleted) onApartmentDeleted(); // Rafraîchir la liste après suppression
    } catch (error) {
      console.error("Error deleting apartment:", error);
    }
  };

  return (
    <div className="space-y-4">
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
      <ul className="space-y-2">
        {Array.isArray(apartments) && apartments.length > 0 ? (
          apartments.map((apartment: any) => (
            <li
              key={apartment.id}
              className="bg-white p-4 rounded shadow flex justify-between items-center"
            >
              <span className="text-lg font-semibold">{apartment.name}</span>
              <div className="flex gap-2">
                <a
                  href={`/inventory/${apartment.slug}`}
                  className="bg-[#b39625] text-white px-4 py-2 rounded"
                >
                  Voir l'inventaire
                </a>
                <button
                  onClick={() => deleteApartment(apartment.slug)} // Utilise `slug` pour la suppression
                  className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                >
                  Supprimer
                </button>
              </div>
            </li>
          ))
        ) : (
          <li className="text-gray-500">Aucun logement disponible</li>
        )}
      </ul>
    </div>
  );
}
