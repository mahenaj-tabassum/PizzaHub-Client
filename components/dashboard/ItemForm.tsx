"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, TriangleAlert } from "lucide-react";
import { toast } from "react-toastify";

import ImageUpload, {
  newImageKey,
  type ImageEntry,
} from "@/components/shared/ImageUpload";
import { apiFetch } from "@/lib/api";
import { unwrapImageUrl } from "@/lib/api-utils";
import { CATEGORIES } from "@/lib/constants";
import { itemSchema, type ItemFormValues } from "@/lib/validations";
import { cn } from "@/lib/utils";
import type { MenuItem } from "@/types";

type Props = {
  mode: "create" | "edit";
  initial?: MenuItem;
  limitReached?: boolean;
};

const fieldClass =
  "h-13 w-full rounded-xl border border-input bg-card px-4 text-sm outline-none transition placeholder:text-muted-foreground focus:border-ring focus:ring-3 focus:ring-ring/20 aria-invalid:border-destructive";

function Field({
  label,
  htmlFor,
  error,
  className,
  children,
}: {
  label: string;
  htmlFor: string;
  error?: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={className}>
      <label htmlFor={htmlFor} className="mb-2 block text-sm font-medium">
        {label}
      </label>
      {children}
      {error && (
        <p role="alert" className="mt-1.5 text-xs text-destructive">
          {error}
        </p>
      )}
    </div>
  );
}

async function uploadImage(file: File) {
  const formData = new FormData();
  formData.append("image", file);

  const result = await apiFetch("/api/upload", {
    method: "POST",
    body: formData,
  });
  const url = unwrapImageUrl(result);

  if (!url) throw new Error("Image upload failed. Please try again.");
  return url;
}

// এডিটের পর কী হবে, তা আইটেমের বর্তমান স্ট্যাটাস অনুযায়ী
function getEditNotice(status?: MenuItem["status"]) {
  if (status === "approved") {
    return {
      warning:
        "This item is live. Saving your changes sends it back to Pending, so customers will not see it until an admin approves it again.",
      toast:
        "Item updated. It is now Pending and hidden from customers until an admin approves it again.",
    };
  }

  if (status === "rejected") {
    return {
      warning:
        "This item was rejected. Saving your changes resubmits it to the admin for review.",
      toast: "Item updated and sent to the admin for review again.",
    };
  }

  if (status === "inactive") {
    return {
      warning:
        "Saving your changes sends this item to the admin for review before it can go live.",
      toast: "Item updated and sent to the admin for review.",
    };
  }

  // pending: আগে থেকেই রিভিউয়ের অপেক্ষায়, নতুন করে কিছু বদলায় না
  return {
    warning: null,
    toast: "Menu item updated. It is still waiting for admin approval.",
  };
}

export default function ItemForm({ mode, initial, limitReached }: Props) {
  const router = useRouter();
  const isEdit = mode === "edit";

  const editNotice = isEdit ? getEditNotice(initial?.status) : null;

  const [images, setImages] = useState<ImageEntry[]>(
    () =>
      initial?.images?.map((url) => ({
        key: newImageKey(),
        url,
        preview: url,
      })) ?? [],
  );
  const [imageError, setImageError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ItemFormValues>({
    resolver: zodResolver(itemSchema),
    defaultValues: {
      itemName: initial?.itemName ?? "",
      category: initial?.category ?? CATEGORIES[0].slug,
      price: initial ? String(initial.price) : "",
      location: initial?.location ?? "",
      description: initial?.description ?? "",
    },
  });

  const onSubmit = async (values: ItemFormValues) => {
    if (images.length === 0) {
      setImageError("Please upload at least one image.");
      return;
    }
    setImageError("");

    try {
      // নতুন ফাইলগুলো ImgBB তে (সার্ভার হয়ে) আপলোড, পুরোনো URL গুলো রাখা
      const urls: string[] = [];
      for (const entry of images) {
        urls.push(entry.file ? await uploadImage(entry.file) : entry.url!);
      }

      const payload = {
        itemName: values.itemName.trim(),
        category: values.category,
        description: values.description.trim(),
        price: Number(values.price),
        location: values.location.trim(),
        images: urls,
      };

      if (isEdit && initial) {
        await apiFetch(`/api/vendor/items/${initial._id}`, {
          method: "PATCH",
          body: JSON.stringify(payload),
        });

        toast.info(editNotice?.toast ?? "Menu item updated.", {
          autoClose: 6000,
        });
      } else {
        await apiFetch("/api/vendor/items", {
          method: "POST",
          body: JSON.stringify(payload),
        });
        toast.success(
          "Menu item added. It is Pending until an admin approves it.",
        );
      }

      router.push("/dashboard/vendor/items");
      router.refresh();
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Could not save the menu item.",
      );
    }
  };

  const blocked = !isEdit && limitReached;

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      className="max-w-4xl rounded-3xl bg-card p-5 ring-1 ring-foreground/10 sm:p-8"
    >
      {editNotice?.warning && (
        <div
          role="status"
          className="mb-6 flex items-start gap-3 rounded-xl bg-secondary/25 px-4 py-3.5 text-sm"
        >
          <TriangleAlert className="mt-0.5 size-5 shrink-0 text-brand" />
          <p>{editNotice.warning}</p>
        </div>
      )}

      <div className="grid gap-5 sm:grid-cols-2">
        <Field
          label="Item name"
          htmlFor="itemName"
          error={errors.itemName?.message}
        >
          <input
            id="itemName"
            placeholder="e.g. Four Cheese Special"
            aria-invalid={!!errors.itemName}
            className={fieldClass}
            {...register("itemName")}
          />
        </Field>

        <Field
          label="Category"
          htmlFor="category"
          error={errors.category?.message}
        >
          <select
            id="category"
            aria-invalid={!!errors.category}
            className={cn(fieldClass, "cursor-pointer")}
            {...register("category")}
          >
            {CATEGORIES.map((c) => (
              <option key={c.slug} value={c.slug}>
                {c.label}
              </option>
            ))}
          </select>
        </Field>

        <Field
          label="Price (USD)"
          htmlFor="price"
          error={errors.price?.message}
        >
          <input
            id="price"
            type="number"
            step="0.01"
            min="0"
            inputMode="decimal"
            placeholder="16.00"
            aria-invalid={!!errors.price}
            className={fieldClass}
            {...register("price")}
          />
        </Field>

        <Field
          label="Location (area / city)"
          htmlFor="location"
          error={errors.location?.message}
        >
          <input
            id="location"
            placeholder="Agrabad, Chattogram"
            aria-invalid={!!errors.location}
            className={fieldClass}
            {...register("location")}
          />
        </Field>
      </div>

      <Field
        label="Description"
        htmlFor="description"
        error={errors.description?.message}
        className="mt-5"
      >
        <textarea
          id="description"
          rows={5}
          placeholder="Describe the toppings, size, and what makes it special"
          aria-invalid={!!errors.description}
          className={cn(fieldClass, "h-auto resize-none py-3")}
          {...register("description")}
        />
      </Field>

      <div className="mt-5">
        <p className="mb-2 text-sm font-medium">Item image (required)</p>
        <ImageUpload
          value={images}
          onChange={(next) => {
            setImages(next);
            if (next.length) setImageError("");
          }}
          error={imageError}
        />
      </div>

      {blocked && (
        <p
          role="alert"
          className="mt-5 rounded-xl bg-destructive/10 px-4 py-3 text-sm text-destructive"
        >
          You have reached the Free plan limit of active items. Upgrade to
          Premium, or hide an item, to add more.
        </p>
      )}

      <div className="mt-7 flex flex-wrap gap-3">
        <button
          type="submit"
          disabled={isSubmitting || blocked}
          className="inline-flex h-12 cursor-pointer items-center justify-center gap-2 rounded-full bg-brand px-8 text-sm font-semibold text-brand-foreground transition hover:bg-brand/90 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting && <Loader2 className="size-4 animate-spin" />}
          {isSubmitting
            ? isEdit
              ? "Saving..."
              : "Adding..."
            : isEdit
              ? "Save changes"
              : "Add Item"}
        </button>
        <button
          type="button"
          disabled={isSubmitting}
          onClick={() => router.push("/dashboard/vendor/items")}
          className="h-12 cursor-pointer rounded-full border border-border px-8 text-sm font-medium transition-colors hover:bg-muted disabled:opacity-50"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
