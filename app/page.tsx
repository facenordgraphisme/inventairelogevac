"use client";

import { useEffect, useState } from "react";
import { BuildingList } from "@/components/BuildingList";

export default function HomePage() {
  const [buildings, setBuildings] = useState([]);

  const fetchBuildings = async () => {
    const response = await fetch("/api/buildings");
    const data = await response.json();
    setBuildings(data);
  };

  useEffect(() => {
    fetchBuildings();
  }, []);

  return (
    <main className="p-6 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-6 px-8">
        <p className="text-lg md:text-3xl font-bold">Inventaire Logevac</p>
        <h1 className="text-lg md:text-3xl font-bold text-center flex-grow">
          Gestion des Bâtiments
        </h1>
        <img
          src="/assets/logo.png"
          alt="Logo"
          className="h-20 w-auto object-contain"
        />
      </div>
      <BuildingList
        buildings={buildings}
        onBuildingAdded={fetchBuildings}
        onBuildingDeleted={fetchBuildings} // Met à jour la liste après suppression
      />
    </main>
  );
}
