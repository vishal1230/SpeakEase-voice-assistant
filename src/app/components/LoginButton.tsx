'use client';

import { useSession, signIn, signOut } from "next-auth/react";
import Image from "next/image";

export default function LoginButton() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <div className="w-24 h-9 bg-gray-200 rounded-full animate-pulse"></div>;
  }

  if (session) {
    return (
      <div className="flex items-center gap-4">
        {session.user?.image && (
          <Image
            src={session.user.image}
            alt={session.user.name || "User Avatar"}
            width={36}
            height={36}
            className="rounded-full"
          />
        )}
        <button 
          onClick={() => signOut()}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white/60 rounded-full shadow-sm hover:bg-gray-200 transition-colors"
        >
          Sign Out
        </button>
      </div>
    );
  }
  
  return (
    <button 
      onClick={() => signIn("google")}
      className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-blue-500 to-purple-600 rounded-full shadow-sm hover:opacity-90 transition-opacity"
    >
      Sign In with Google
    </button>
  );
}