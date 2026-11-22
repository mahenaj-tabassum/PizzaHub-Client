"use client";

import { useState } from "react";
import { toast } from "react-toastify";
import { FcGoogle } from "react-icons/fc";
export default function GoogleButton() {
  const [loading, setLoading] = useState(false);

  const handleGoogleLogin = async () => {
    try {
      setLoading(true);

      const { authClient } = await import("@/lib/auth-client");

      await authClient.signIn.social({
        provider: "google",
        callbackURL: "/redirect",
      });
    } catch {
      toast.error("Google authentication failed.");
      setLoading(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleGoogleLogin}
      disabled={loading}
      className="flex h-[54px] w-full items-center justify-center gap-3 rounded-xl border border-input bg-card font-medium text-foreground transition hover:bg-muted disabled:opacity-60"
    >
      <FcGoogle className="text-2xl" />
      {loading ? "Connecting..." : "Continue with Google"}
    </button>
  );
}
