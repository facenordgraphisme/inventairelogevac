"use client";

import { useEffect, useState } from "react";
import { BuildingList } from "@/components/BuildingList";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [buildings, setBuildings] = useState([]);

  useEffect(() => {
    if (!session && status !== "loading") {
      router.push("/auth/signin");
    }
  }, [session, status, router]);

  const fetchBuildings = async () => {
    try {
      const response = await fetch("/api/buildings");
      if (!response.ok) {
        throw new Error("Failed to fetch buildings");
      }
      const data = await response.json();
      setBuildings(data);
    } catch (error) {
      console.error("Error fetching buildings:", error);
    }
  };

  useEffect(() => {
    if (session) {
      fetchBuildings();
    }
  }, [session]);

  if (status === "loading" || !session) {
    return <p>Chargement...</p>;
  }

  return (
    <main className="bg-gray-50 min-h-screen flex justify-center">
      <div className="max-w-7xl w-full p-6">
        <div className="flex items-center mb-6 px-8">
          <h1 className="text-xl md:text-3xl font-bold text-center flex-grow">
            Gestion des Bâtiments
          </h1>
        </div>
        <BuildingList
          buildings={buildings}
          onBuildingAdded={fetchBuildings}
          onBuildingDeleted={fetchBuildings}
        />
      </div>
    </main>
  );
}
