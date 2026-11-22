"use client";

import { useEffect, useState } from "react";

import DashboardPageHeader from "@/components/dashboard/DashboardPageHeader";
import ItemForm from "@/components/dashboard/ItemForm";
import ErrorState from "@/components/shared/ErrorState";
import { apiFetch } from "@/lib/api";
import { unwrapData } from "@/lib/api-utils";
import type { MenuItem } from "@/types";

export default function EditItemContent({ itemId }: { itemId: string }) {
  const [item, setItem] = useState<MenuItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let active = true;

    apiFetch(`/api/vendor/items/${itemId}`)
      .then((result) => {
        if (!active) return;
        const data = unwrapData<MenuItem>(result);
        if (data) setItem(data);
        else setFailed(true);
      })
      .catch(() => active && setFailed(true))
      .finally(() => active && setLoading(false));

    return () => {
      active = false;
    };
  }, [itemId]);

  if (loading) {
    return (
      <div
        role="status"
        aria-label="Loading item"
        className="max-w-4xl space-y-4"
      >
        <div className="h-10 w-64 animate-pulse rounded bg-muted" />
        <div className="h-96 animate-pulse rounded-3xl bg-muted" />
      </div>
    );
  }

  if (failed || !item) {
    return (
      <ErrorState
        title="Item not found"
        description="This item does not exist, or it does not belong to your restaurant."
        retryHref="/dashboard/vendor/items"
        retryLabel="Back to My Menu Items"
      />
    );
  }

  return (
    <>
      <DashboardPageHeader
        title="Edit Menu Item"
        description="Update the details of this item."
      />
      <ItemForm mode="edit" initial={item} />
    </>
  );
}
