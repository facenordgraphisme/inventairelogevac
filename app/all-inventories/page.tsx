"use client";

import { useState, useEffect } from "react";

interface Inventory {
  id: number;
  name: string;
  slug: string; // Slug de l'appartement
  building: {
    name: string;
    createdAt: string; // Date de création du bâtiment
  };
}

export default function AllInventoriesPage() {
  const [inventories, setInventories] = useState<Inventory[]>([]);
  const [search, setSearch] = useState("");
  const [sortOption, setSortOption] = useState<"alphabetical" | "date">(
    "alphabetical"
  );

  useEffect(() => {
    const fetchInventories = async () => {
      const response = await fetch("/api/inventories");
      const data = await response.json();
      setInventories(data);
    };

    fetchInventories();
  }, []);

  const filteredInventories = inventories
    .filter((inventory) =>
      inventory.building.name.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => {
      if (sortOption === "alphabetical") {
        return a.building.name.localeCompare(b.building.name); // Tri alphabétique
      } else if (sortOption === "date") {
        return new Date(a.building.createdAt).getTime() -
               new Date(b.building.createdAt).getTime(); // Tri par date
      }
      return 0;
    });

  return (
    <main className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold mb-6">Tous les Inventaires</h1>

      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <input
          type="text"
          placeholder="Rechercher par bâtiment..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border rounded-xl px-4 py-2 flex-grow w-full"
        />

        <select
          value={sortOption}
          onChange={(e) => setSortOption(e.target.value as "alphabetical" | "date")}
          className="border rounded-xl px-4 py-2 w-full"
        >
          <option value="alphabetical">Trier par ordre alphabétique</option>
          <option value="date">Trier par date de création</option>
        </select>
      </div>

      <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredInventories.map((inventory) => (
          <li key={inventory.id} className="bg-white p-4 rounded shadow">
            <h2 className="text-lg font-semibold">{inventory.name}</h2>
            <p className="text-gray-600">{inventory.building.name}</p>
            <p className="text-sm text-gray-400">
              Créé le : {new Date(inventory.building.createdAt).toLocaleDateString()}
            </p>
            <a
              href={`/inventory/${inventory.slug}`}
              className="text-[#b39625] font-medium hover:underline mt-2 block"
            >
              Voir l'inventaire
            </a>
          </li>
        ))}
      </ul>
    </main>
  );
}
