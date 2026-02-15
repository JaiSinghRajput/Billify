"use client";

import { startAuthentication } from "@simplewebauthn/browser";
import { useState } from "react";

export default function PasskeyLogin({ email }: { email:string }) {
  const [loading,setLoading] = useState(false);

  const login = async () => {
    setLoading(true);

    try {
      const res = await fetch("/api/webauthn/login-options",{
        method:"POST",
        body: JSON.stringify({ email }),
        headers:{ "Content-Type":"application/json" }
      });

      const options = await res.json();

      const credential = await startAuthentication(options);

      const verify = await fetch("/api/webauthn/login-verify",{
        method:"POST",
        body: JSON.stringify({ email, credential }),
        headers:{ "Content-Type":"application/json" }
      });

      const result = await verify.json();

      if(result.verified){
        window.location.href="/dashboard";
      } else {
        alert("Login failed");
      }

    } catch(err){
      alert("Passkey cancelled or failed");
    }

    setLoading(false);
  };

  return (
    <button
      onClick={login}
      disabled={loading}
      className="w-full py-3 rounded-xl bg-black text-white font-semibold"
    >
      {loading ? "Authenticating..." : "Login with Passkey"}
    </button>
  );
}
