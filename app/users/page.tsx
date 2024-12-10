"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [newUser, setNewUser] = useState({ name: "", email: "", password: "", role: "user" });
  const ADMIN_EMAIL = "admin@example.com"; // Remplacez par l'e-mail du compte admin principal

  const fetchUsers = async () => {
    try {
      const response = await fetch("/api/users");
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error("Error fetching users:", error);
      toast.error("Impossible de récupérer la liste des utilisateurs.");
    }
  };

  const addUser = async () => {
    try {
      const response = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newUser),
      });

      if (!response.ok) {
        throw new Error("Failed to add user");
      }

      setNewUser({ name: "", email: "", password: "", role: "user" });
      fetchUsers();
      toast.success("Utilisateur ajouté avec succès !");
    } catch (error) {
      console.error("Error adding user:", error);
      toast.error("Impossible d'ajouter l'utilisateur.");
    }
  };

  const deleteUser = async (userId: number, userEmail: string) => {
    if (userEmail === ADMIN_EMAIL) {
      toast.error("Impossible de supprimer le compte administrateur principal.");
      return;
    }

    const confirmed = confirm("Êtes-vous sûr de vouloir supprimer cet utilisateur ?");
    if (!confirmed) return;

    try {
      const response = await fetch(`/api/users/${userId}`, { method: "DELETE" });

      if (!response.ok) {
        throw new Error("Failed to delete user");
      }

      fetchUsers();
      toast.success("Utilisateur supprimé avec succès !");
    } catch (error) {
      console.error("Error deleting user:", error);
      toast.error("Impossible de supprimer l'utilisateur.");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <main className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto bg-white p-6 rounded shadow">
        <h1 className="text-2xl font-bold mb-4">Gestion des utilisateurs</h1>

        {/* Formulaire pour ajouter un utilisateur */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-2">Ajouter un utilisateur</h2>
          <div className="grid grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Nom"
              value={newUser.name}
              onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
              className="border rounded px-4 py-2"
            />
            <input
              type="email"
              placeholder="Email"
              value={newUser.email}
              onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
              className="border rounded px-4 py-2"
            />
            <input
              type="password"
              placeholder="Mot de passe"
              value={newUser.password}
              onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
              className="border rounded px-4 py-2"
            />
            <select
              value={newUser.role}
              onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
              className="border rounded px-4 py-2"
            >
              <option value="user">Utilisateur</option>
              <option value="admin">Administrateur</option>
            </select>
            <button
              onClick={addUser}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 col-span-2"
            >
              Ajouter
            </button>
          </div>
        </div>

        {/* Liste des utilisateurs */}
        <div>
          <h2 className="text-lg font-semibold mb-2">Liste des utilisateurs</h2>
          {users.length > 0 ? (
            <ul className="space-y-4">
              {users.map((user: any) => (
                <li key={user.id} className="bg-gray-100 p-4 rounded shadow flex justify-between items-center">
                  <div>
                    <p className="text-lg font-semibold">{user.name}</p>
                    <p className="text-sm text-gray-600">{user.email}</p>
                    <p className="text-sm text-gray-600">Rôle : {user.role}</p>
                  </div>
                  <button
                    onClick={() => deleteUser(user.id, user.email)}
                    className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                  >
                    Supprimer
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">Aucun utilisateur trouvé.</p>
          )}
        </div>
      </div>
    </main>
  );
}
