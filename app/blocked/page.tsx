"use client";

import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";

export default function BlockedPage() {
  const handleSignOut = async () => {
    await authClient.signOut();
    window.location.href = "/";
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4 text-center">
      <h1 className="font-heading text-2xl font-bold">Account blocked</h1>
      <p className="mt-2 max-w-sm text-sm text-muted-foreground">
        Your account has been blocked by an administrator. Please contact
        support if you think this is a mistake.
      </p>
      <Button
        onClick={handleSignOut}
        className="mt-8 h-10 rounded-full px-6 font-semibold"
      >
        Sign out
      </Button>
    </div>
  );
}
