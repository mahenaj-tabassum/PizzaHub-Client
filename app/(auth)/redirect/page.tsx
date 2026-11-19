"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";

export default function AuthRedirectPage() {
  const router = useRouter();

  const { data: session, isPending } = authClient.useSession();

  useEffect(() => {
    if (isPending) return;

    if (!session) {
      router.replace("/signin");
      return;
    }

    const role = session.user.role;

    if (role === "vendor") {
      router.replace("/dashboard/vendor");
    } else if (role === "admin") {
      router.replace("/dashboard/admin");
    } else {
      router.replace("/dashboard/customer");
    }
  }, [session, isPending, router]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f8efe4]">
      <div className="text-center">
        <div className="mx-auto size-10 animate-spin rounded-full border-4 border-[#e6c9a7] border-t-[#981e24]" />

        <p className="mt-4 text-sm text-[#76584d]">
          Preparing your PizzaHub account...
        </p>
      </div>
    </div>
  );
}
