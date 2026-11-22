"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { toast } from "react-toastify";

import RoleSelect, { type AccountRole } from "@/components/auth/RoleSelect";
import Logo from "@/components/layout/Logo";
import { authClient } from "@/lib/auth-client";
import { getDashboardPath } from "@/lib/constants";

export default function AuthRedirectPage() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();

  const [role, setRole] = useState<AccountRole>("customer");
  const [saving, setSaving] = useState(false);

  const needsRole = session?.user.roleSelected === false;

  useEffect(() => {
    if (isPending) return;

    if (!session) {
      router.replace("/signin");
      return;
    }

    if (needsRole) return; // রোল বাছাইয়ের কার্ড দেখানো হবে

    router.replace(getDashboardPath(session.user.role));
  }, [session, isPending, needsRole, router]);

  const handleContinue = async () => {
    try {
      setSaving(true);

      const response = await fetch("/api/account/role", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role }),
      });

      const result = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(result?.message || "Could not save your role.");
      }

      toast.success("Welcome to PizzaHub!");

      // পুরো পেজ রিলোড, যাতে সার্ভার নতুন রোল সহ সেশন পড়ে
      window.location.href = getDashboardPath(result.role);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Could not save your role.",
      );
      setSaving(false);
    }
  };

  if (needsRole) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4 py-10">
        <div className="mb-8">
          <Logo light={false} />
        </div>

        <div className="w-full max-w-md rounded-3xl bg-card p-6 shadow-xl shadow-black/5 ring-1 ring-foreground/10 sm:p-8">
          <h1 className="font-heading text-3xl font-bold">
            One last step
            {session?.user.name ? `, ${session.user.name.split(" ")[0]}` : ""}
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Tell us how you want to use PizzaHub. You cannot change this later.
          </p>

          <div className="mt-6">
            <RoleSelect value={role} onChange={setRole} />
          </div>

          <button
            type="button"
            onClick={handleContinue}
            disabled={saving}
            className="mt-6 flex h-[54px] w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-brand font-semibold text-brand-foreground transition hover:bg-brand/90 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {saving && <Loader2 className="size-5 animate-spin" />}
            {saving ? "Saving..." : "Continue"}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="text-center">
        <div className="mx-auto size-10 animate-spin rounded-full border-4 border-border border-t-brand" />
        <p className="mt-4 text-sm text-muted-foreground">
          Preparing your PizzaHub account...
        </p>
      </div>
    </div>
  );
}
