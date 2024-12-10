import NextAuth, { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";

export const authOptions: AuthOptions = {
  session: {
    strategy: "jwt",
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        if (!credentials?.email || !credentials.password) {
          throw new Error("Email et mot de passe requis");
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        if (!user) throw new Error("Utilisateur non trouvé");

        const isValidPassword = await bcrypt.compare(
          credentials.password,
          user.hashedPassword
        );

        if (!isValidPassword) throw new Error("Mot de passe incorrect");

        // Retourner un utilisateur compatible avec `next-auth`
        return {
          id: String(user.id),
          email: user.email ?? "",
          name: user.name ?? "",
          role: user.role ?? "user", // Fournir une valeur par défaut
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email ?? ""; // Assurez-vous que ce soit une chaîne
        token.role = user.role ?? "user"; // Fournir un rôle par défaut
        token.name = user.name ?? ""; // Fournir un nom par défaut
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user = {
          id: token.id as string,
          email: token.email as string,
          role: token.role as string,
          name: token.name as string,
        };
      }
      return session;
    },
  },
  pages: {
    signIn: "/auth/signin", // Page de connexion
    error: "/auth/signin", // Page d'erreur
    newUser: "/", // Redirige les nouveaux utilisateurs sur la page d'accueil
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
