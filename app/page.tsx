"use client";
import Link from "next/link";
import { useAuth } from "./contexts/AuthContext";

export default function Home() {
  const { user, loading } = useAuth();

  // loading state while checking auth
  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Loading...</p>
      </main>
    );
  }

  return (
    <main className="bg-gray-50 min-h-screen flex flex-col">
      {/* Hero Section */}
      <section className="flex-1 max-w-5xl mx-auto text-center px-6 py-28">
        <h2 className="text-5xl font-bold text-gray-900 tracking-tight mb-6">
          Generate GST Bills
          <span className="block text-blue-600">in Seconds</span>
        </h2>

        <p className="text-lg text-gray-700 max-w-2xl mx-auto mb-10">
          Create professional GST invoices instantly. Share with clients,
          download PDFs, and manage billing — all in one place.
        </p>

        {/* Logged In UI */}
        {user ? (
          <div className="space-y-4">
            <p className="text-gray-600">
              Welcome back, <strong>{user.email}</strong>
            </p>

            <div className="flex justify-center gap-4">
              <Link
                href="/dashboard"
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl shadow-md font-medium transition"
              >
                Go to Dashboard
              </Link>

              <Link
                href="/generate"
                className="border border-gray-900 text-gray-900 hover:bg-gray-900 hover:text-white px-8 py-3 rounded-xl font-medium transition"
              >
                Create Invoice
              </Link>
            </div>
          </div>
        ) : (
          /* Not Logged In UI */
          <div className="flex justify-center gap-4">
            <Link
              href="/signup"
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl shadow-md font-medium transition"
            >
              Start Free
            </Link>

            <Link
              href="/login"
              className="border border-gray-900 text-gray-900 hover:bg-gray-900 hover:text-white px-8 py-3 rounded-xl font-medium transition"
            >
              Login
            </Link>
          </div>
        )}
      </section>
    </main>
  );
}
