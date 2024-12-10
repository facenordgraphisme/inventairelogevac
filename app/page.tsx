"use client";

import { useEffect, useState } from "react";
import { BuildingList } from "@/components/BuildingList";
// import { Toaster } from 'sonner';

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
    <main className="bg-gray-50 min-h-screen flex justify-center">
      <div className="max-w-7xl w-full p-6">
        <div className="flex justify-between items-center mb-6 px-8">
          <p className="text-md md:text-xl font-bold">Inventaire Logevac</p>
          <h1 className="text-xl md:text-3xl font-bold text-center flex-grow">
            Gestion des Bâtiments
          </h1>
          <img
            src="/assets/logo.png"
            alt="Logo"
            className="h-12 md:h-20 w-auto object-contain"
          />
        </div>
        <BuildingList
          buildings={buildings}
          onBuildingAdded={fetchBuildings}
          onBuildingDeleted={fetchBuildings} // Met à jour la liste après suppression
        />
      </div>
    </main>
  );
}
