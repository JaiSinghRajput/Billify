"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/contexts/AuthContext";

export default function Navbar() {
  const { user, loading, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.push("/");
  };

  return (
    <nav className="border-b bg-white sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex justify-between items-center px-6 py-4">
        {/* Logo */}
        <Link
          href="/"
          className="text-2xl font-bold text-blue-600"
        >
          Billify
        </Link>

        {/* Right Side */}
        <div className="flex items-center gap-6">
          {loading ? null : !user ? (
            /* Not logged in */
            <>
              <Link
                href="/login"
                className="text-gray-700 hover:text-gray-900 font-medium"
              >
                Login
              </Link>

              <Link
                href="/signup"
                className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg font-medium"
              >
                Get Started
              </Link>
            </>
          ) : (
            /* Logged in → Profile dropdown */
            <div className="relative">
              <button
                onClick={() => setOpen(!open)}
                className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-semibold"
              >
                {user.email?.[0]?.toUpperCase()}
              </button>

              {open && (
                <div className="absolute right-0 mt-3 w-56 bg-white border rounded-lg shadow-md py-2">
                  <p className="px-4 py-2 text-sm text-gray-500 border-b">
                    {user.email}
                  </p>

                  <Link
                    href="/dashboard"
                    className="block px-4 py-2 hover:bg-gray-50"
                    onClick={() => setOpen(false)}
                  >
                    Dashboard
                  </Link>

                  <Link
                    href="/profile"
                    className="block px-4 py-2 hover:bg-gray-50"
                    onClick={() => setOpen(false)}
                  >
                    Profile
                  </Link>

                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 hover:bg-gray-50 text-red-600"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
