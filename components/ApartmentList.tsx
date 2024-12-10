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
  
      let data;
      try {
        data = await response.json(); // Essaie de lire le JSON
      } catch (jsonError) {
        console.warn("Response is not JSON:", jsonError);
        data = null;
      }
  
      if (!response.ok) {
        if (data?.error) {
          toast.error(data.error); // Affiche le message d'erreur spécifique
        } else {
          toast.error("Impossible de supprimer le logement, vous devez d'abord supprimer les éléments de l'inventaire.");
        }
        return;
      }
  
      if (onApartmentDeleted) onApartmentDeleted();
      toast.success(data?.message || "Logement supprimé avec succès !");
    } catch (error) {
      console.error("Error deleting apartment:", error);
      toast.error("Une erreur inattendue s'est produite lors de la suppression.");
    }
  };

  return (
    <div className="space-y-6">
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
      <ul className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.isArray(apartments) && apartments.length > 0 ? (
          apartments.map((apartment: any) => (
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
          <li className="text-gray-500">Aucun logement disponible</li>
        )}
      </ul>
    </div>
  );
}
