"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Application error:", error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4 text-center">
      <div className="w-full max-w-md">
        <div className="mb-6 text-6xl">🍕</div>
        <h1 className="font-heading text-2xl font-bold">
          Something went wrong
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          An unexpected error occurred. Please try again.
        </p>
        {error.digest && (
          <p className="mt-3 text-xs text-muted-foreground">
            Error ID: {error.digest}
          </p>
        )}
        <Button
          onClick={() => reset()}
          className="mt-8 h-10 rounded-full px-6 font-semibold"
        >
          Try again
        </Button>
      </div>
    </div>
  );
}
