"use client";

import { useState } from "react";
import { toast } from "sonner";

export function ApartmentList({
  apartments, buildingSlug, onApartmentDeleted, onApartmentAdded,
}: any) {
  const [newApartmentName, setNewApartmentName] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOption, setSortOption] = useState("number");
  const [apartmentType, setApartmentType] = useState("Studio");

  // Ajouter un appartement
  const addApartment = async () => {
    if (!newApartmentName || !apartmentType) {
      toast.error("Le nom et le type de logement sont obligatoires.");
      return;
    }
  
    console.log("Données envoyées :", { name: newApartmentName, type: apartmentType });

    const response = await fetch(`/api/buildings/${buildingSlug}/apartments`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: newApartmentName, type: apartmentType }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Erreur API :", errorData);
      toast.error(errorData.error || "Erreur inconnue");
      return;
    }

    toast.success("Logement ajouté avec succès !");
    onApartmentAdded();
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
      {/* Barre de recherche et tri */}
      <p className="text-lg font-semibold">Rechercher un logement</p>
      <div className="flex items-center justify-between gap-4 flex-col sm:flex-row">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Rechercher un logement"
          className="border rounded-xl px-4 py-2 flex-grow"
        />
        <select
          value={sortOption}
          onChange={(e) => setSortOption(e.target.value)}
          className="border rounded-xl px-4 py-2"
        >
          <option value="number">Trier par numéro</option>
          <option value="createdAt">Trier par date de création</option>
        </select>
      </div>

      {/* Ajouter un appartement */}
      <p className="text-lg font-semibold">Créer un nouveau logement</p>
      <div className="flex items-center gap-4">
        <input
          type="text"
          value={newApartmentName}
          onChange={(e) => setNewApartmentName(e.target.value)}
          placeholder="Nom du logement"
          className="border rounded-xl px-4 py-2 flex-grow"
        />
        <select
          value={apartmentType}
          onChange={(e) => setApartmentType(e.target.value)}
          className="border rounded-xl px-4 py-2"
        >
          <option value="Studio">Studio</option>
          <option value="T2">T2</option>
        </select>
        <button
          onClick={addApartment}
          className="bg-[#b39625] text-white px-4 py-2 rounded-full"
        >
          Créer
        </button>
      </div>

      {/* Liste des logements */}
      <ul className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredApartments.length > 0 ? (
          filteredApartments.map((apartment: any) => (
            <li
              key={apartment.id}
              className="bg-white p-4 rounded shadow-xl flex flex-col justify-between items-center border border-gray-200"
            >
              {/* Ajout du type de logement */}
              <span className="text-lg font-semibold">
                {apartment.name} <span className="text-gray-500 text-sm">({apartment.type})</span>
              </span>
              
              <div className="flex gap-2 mt-4">
                <a
                  href={`/inventory/${apartment.slug}`}
                  className="bg-white border border-[#b39625] hover:bg-[#b39625] text-[#b39625] hover:text-white px-4 py-2 rounded-full transition duration-300 ease-in-out"
                >
                  Voir l'inventaire
                </a>
                <button
                  onClick={() => deleteApartment(apartment.slug)}
                  className="bg-white border border-red-600 text-red-600 px-4 py-2 rounded-full hover:bg-red-600 hover:text-white transition duration-300 ease-in-out"
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
