"use client";

import { signOut, useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import logo from "../public/assets/logo.png"

export default function Navbar() {
  const { data: session } = useSession();

  const handleSignOut = async () => {
    await signOut({ callbackUrl: "/auth/signin" });
  };

  return (
    <nav className="flex items-center justify-between mx-auto mt-4 px-6 py-3 border border-[#b39625] rounded-full w-[80%] bg-white shadow-xl">
      <div className="flex items-center gap-4">
        <Image
        src={logo}
        alt="logo"
        className="h-10 w-auto object-contain"
        />
        <Link href="/">
          <p className="text-lg font-bold text-[#b39625] cursor-pointer">
            Inventaire Logevac
          </p>
        </Link>
        
      </div>
      <div className="flex items-center gap-4">
        {session?.user?.name && (
          <p className="text-sm font-semibold text-[#b39625]">
            Bonjour, {session.user.name}
          </p>
        )}
        {session?.user?.role === "admin" && (
          <Link href="/users" className="text-sm text-[#b39625] hover:underline">
            Gestion des utilisateurs
          </Link>
        )}
        <button
          onClick={handleSignOut}
          className="text-sm text-[#b39625] border border-[#b39625] px-4 py-1 rounded-full hover:bg-[#b39625] hover:text-white transition"
        >
          Déconnexion
        </button>
      </div>
    </nav>
  );
}
