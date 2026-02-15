"use client";

import { useEffect, useState } from "react";
import { startAuthentication } from "@simplewebauthn/browser";

export default function LoginPage() {
  const [step, setStep] = useState<"email" | "auth">("email");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [options, setOptions] = useState<any>(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  /* ---------------- AUTO SESSION CHECK ---------------- */

  useEffect(() => {
    fetch("/api/auth/me").then(res=>{
      if(res.ok) window.location.href="/dashboard";
    });
  }, []);

  /* ---------------- CHECK USER ---------------- */

  const checkUser = async () => {
    setLoading(true);
    setError("");

    try {
      const normalized = email.toLowerCase().trim();

      const res = await fetch("/api/webauthn/login-options", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: normalized }),
      });

      if (res.status === 404) {
        setError("Account not found");
        setLoading(false);
        return;
      }

      if (!res.ok) {
        setError("Unable to continue");
        setLoading(false);
        return;
      }

      const opts = await res.json();
      const hasPasskeys = Boolean(opts?.hasPasskeys);
      setOptions(opts);
      setStep("auth");

      /* AUTO TRIGGER PASSKEY */
      if (hasPasskeys && opts.allowCredentials?.length) {
        await handlePasskeyLogin(opts, normalized);
      }

    } catch {
      setError("Something went wrong");
    }

    setLoading(false);
  };

  /* ---------------- PASSKEY LOGIN ---------------- */

  const handlePasskeyLogin = async (opts:any, emailValue:string) => {
    try {
      setLoading(true);

      const credential = await startAuthentication(opts);

      const verify = await fetch("/api/webauthn/login-verify", {
        method: "POST",
        headers:{ "Content-Type":"application/json" },
        body: JSON.stringify({
          email: emailValue,
          credential
        }),
      });

      const result = await verify.json();

      if (result.verified) {
        window.location.href="/dashboard";
        return;
      }

      setError("Passkey login failed");

    } catch {
      setError("Passkey cancelled");
    }

    setLoading(false);
  };

  /* ---------------- PASSWORD LOGIN ---------------- */

  const loginPassword = async () => {
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers:{ "Content-Type":"application/json" },
        credentials: "include",
        body: JSON.stringify({
          email: email.toLowerCase().trim(),
          password
        }),
      });

      if (res.ok) {
        window.location.href="/dashboard";
        return;
      }

      setError("Invalid email or password");

    } catch {
      setError("Login failed");
    }

    setLoading(false);
  };

  /* ---------------- UI ---------------- */

  return (
    <div className="h-screen flex items-center justify-center bg-gray-50">

      <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-md space-y-6">

        <h1 className="text-2xl font-bold text-center">Sign in</h1>

        {/* EMAIL STEP */}
        {step === "email" && (
          <>
            <input
              placeholder="Email address"
              value={email}
              onChange={(e)=>setEmail(e.target.value)}
              className="w-full border rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none"
            />

            <button
              onClick={checkUser}
              disabled={!email || loading}
              className="w-full py-3 rounded-xl bg-blue-600 text-white font-semibold disabled:opacity-50"
            >
              {loading ? "Checking..." : "Continue"}
            </button>
          </>
        )}

        {/* AUTH STEP */}
        {step === "auth" && (
          <>
            {/* PASSKEY BUTTON */}
            {options?.hasPasskeys && options?.allowCredentials?.length > 0 && (
              <button
                onClick={()=>handlePasskeyLogin(options,email)}
                disabled={loading}
                className="w-full py-3 rounded-xl bg-black text-white font-semibold"
              >
                {loading ? "Authenticating..." : "Login with Passkey"}
              </button>
            )}

            {/* divider */}
            {options?.hasPasskeys && options?.allowCredentials?.length > 0 && (
              <div className="text-center text-sm text-gray-400">or</div>
            )}

            {/* PASSWORD */}
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e)=>setPassword(e.target.value)}
              className="w-full border rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none"
            />

            <button
              onClick={loginPassword}
              disabled={!password || loading}
              className="w-full py-3 rounded-xl bg-blue-600 text-white font-semibold disabled:opacity-50"
            >
              {loading ? "Signing in..." : "Login with Password"}
            </button>

            <button
              onClick={()=>setStep("email")}
              className="text-sm text-gray-400 hover:text-gray-600 w-full"
            >
              ← change email
            </button>
          </>
        )}

        {error && (
          <p className="text-red-500 text-sm text-center">{error}</p>
        )}

      </div>
    </div>
  );
}
