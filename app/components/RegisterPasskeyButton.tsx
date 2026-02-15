"use client";

import { useState } from "react";
import { startRegistration } from "@simplewebauthn/browser";

export default function RegisterPasskeyButton() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleRegister = async () => {
    setLoading(true);
    setError("");

    try {
      // 1️⃣ get options
      const res = await fetch("/api/webauthn/register-options", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });

      if (res.status === 401) {
        setError("Please login again");
        setLoading(false);
        return;
      }

      if (!res.ok) {
        setError("Failed to start registration");
        setLoading(false);
        return;
      }

      const options = await res.json();

      // 2️⃣ start WebAuthn
      const credential = await startRegistration(options);

      // 3️⃣ verify
      const verifyRes = await fetch("/api/webauthn/register-verify", {
        method: "POST",
        body: JSON.stringify({ credential }),
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });

      if (!verifyRes.ok) {
        setError("Registration failed");
        setLoading(false);
        return;
      }

      const result = await verifyRes.json();

      if (result.verified) {
        setSuccess(true);
      } else {
        setError("Registration failed");
      }
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    }

    setLoading(false);
  };

  return (
    <div className="flex flex-col gap-3">
      <button
        onClick={handleRegister}
        disabled={loading}
        className="px-5 py-2 rounded-xl bg-black text-white hover:opacity-80 transition disabled:opacity-50"
      >
        {loading ? "Registering..." : "Register Passkey"}
      </button>

      {success && (
        <p className="text-green-600 text-sm">
          ✅ Passkey added successfully
        </p>
      )}

      {error && (
        <p className="text-red-500 text-sm">
          ⚠ {error}
        </p>
      )}
    </div>
  );
}
