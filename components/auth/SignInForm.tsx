"use client";

import { useState } from "react";
import Link from "next/link";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { toast } from "react-toastify";

import { authClient } from "@/lib/auth-client";
import AuthShell from "./AuthShell";
import GoogleButton from "./GoogleButton";

function getDashboard(role: string) {
  switch (role) {
    case "vendor":
      return "/dashboard/vendor";

    case "admin":
      return "/dashboard/admin";

    default:
      return "/dashboard/customer";
  }
}

export default function SignInForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      setLoading(true);

      const { data, error } = await authClient.signIn.email({
        email,
        password,
      });

      if (error) {
        throw new Error(error.message);
      }

      toast.success("Welcome back!");

      const role = data.user.role;

      window.location.href = getDashboard(role ?? "customer");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Unable to sign in.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell
      mode="signin"
      title="Welcome back"
      description="Sign in to track your orders or manage your restaurant."
    >
      <div className="space-y-6">
        <GoogleButton />

        <div className="flex items-center gap-3">
          <span className="h-px flex-1 bg-[#e3c9a9]" />
          <span className="text-sm text-[#795b50]">or continue with email</span>
          <span className="h-px flex-1 bg-[#e3c9a9]" />
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="mb-2 block text-sm font-medium text-[#38231d]">
              Email
            </label>

            <input
              required
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="auth-input"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-[#38231d]">
              Password
            </label>

            <div className="relative">
              <input
                required
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="auth-input pr-12"
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                aria-label="Toggle password visibility"
                className="absolute right-4 top-1/2 -translate-y-1/2 text-[#76584d]"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="flex h-[58px] w-full items-center justify-center gap-2 rounded-xl bg-[#981e24] font-semibold text-white transition hover:bg-[#7f171d] disabled:opacity-60"
          >
            {loading && <Loader2 className="size-5 animate-spin" />}

            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <p className="text-center text-sm text-[#795b50]">
          New to PizzaHub?{" "}
          <Link
            href="/signup"
            className="font-semibold text-[#981e24] hover:underline"
          >
            Create an account
          </Link>
        </p>
      </div>
    </AuthShell>
  );
}
