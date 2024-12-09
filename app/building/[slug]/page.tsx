"use client";

import { useEffect, useState } from "react";
import { ApartmentList } from "@/components/ApartmentList";
import { useRouter } from "next/navigation";

export default function BuildingPage({ params }: { params: Promise<{ slug: string }> }) {
  const router = useRouter();
  const [building, setBuilding] = useState<{ id: number; name: string } | null>(null);
  const [apartments, setApartments] = useState<any[]>([]);
  const [buildingSlug, setBuildingSlug] = useState<string | null>(null);

  // Récupérer `slug` depuis `params`
  useEffect(() => {
    const resolveParams = async () => {
      const resolvedParams = await params;
      setBuildingSlug(resolvedParams.slug.toLowerCase()); // Convertir en minuscule
    };
    resolveParams();
  }, [params]);

  // Charger les données du bâtiment et des logements associés
  useEffect(() => {
    if (buildingSlug) {
      fetchBuilding(buildingSlug);
    }
  }, [buildingSlug]);

  const fetchBuilding = async (slug: string) => {
    try {
      const response = await fetch(`/api/buildings/${slug}`);
      if (!response.ok) {
        console.error("Failed to fetch building:", response.statusText);
        setBuilding(null);
        return;
      }

      const data = await response.json();
      setBuilding(data);

      if (data.slug) {
        fetchApartments(data.slug); // Utiliser `slug` pour récupérer les appartements
      }
    } catch (error) {
      console.error("Error fetching building:", error);
      setBuilding(null);
    }
  };

  const fetchApartments = async (slug: string) => {
    try {
      const response = await fetch(`/api/buildings/${slug}/apartments`);
      if (!response.ok) {
        console.error("Failed to fetch apartments:", response.statusText);
        return;
      }
      const data = await response.json();
      setApartments(data);
    } catch (error) {
      console.error("Error fetching apartments:", error);
    }
  };

  const handleApartmentAdded = () => {
    if (buildingSlug) {
      fetchApartments(buildingSlug); // Utiliser `buildingSlug` pour rafraîchir
    }
  };

  const handleApartmentDeleted = () => {
    if (buildingSlug) {
      fetchApartments(buildingSlug); // Utiliser `buildingSlug` pour rafraîchir
    }
  };

  return (
    <main className="p-6 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-6 px-8">
        <button
          onClick={() => router.back()}
          className="bg-[#b39625] text-white px-4 py-2 rounded"
        >
          Retour
        </button>
        <h1 className="text-3xl font-bold text-center flex-grow">
          {building ? `Logements du bâtiment ${building.name}` : "Chargement..."}
        </h1>
        <img
          src="/assets/logo.png"
          alt="Logo"
          className="h-20 w-auto object-contain"
        />
      </div>
      {building && (
        <ApartmentList
          buildingSlug={buildingSlug} // Assurez-vous que cette valeur est correcte
          apartments={apartments}
          onApartmentAdded={handleApartmentAdded}
          onApartmentDeleted={handleApartmentDeleted}
        />
      )}
    </main>
  );
}
