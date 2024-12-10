import NextAuth from "next-auth";

declare module "next-auth" {
  interface User {
    id: string;
    email: string;
    name: string;
    role: string; // Ajout du rôle
  }

  interface Session {
    user?: User; // Le type de l'utilisateur dans la session
  }

  interface JWT {
    id: string;
    email: string;
    role: string;
  }
}
