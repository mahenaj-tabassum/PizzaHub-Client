"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { toast } from "react-toastify";

import { apiFetch } from "@/lib/api";
import { authClient } from "@/lib/auth-client";
import { profileSchema, type ProfileFormValues } from "@/lib/validations";
import { cn, formatShortDate } from "@/lib/utils";
import type { SubscriptionPlan, UserRole } from "@/types";

type Props = {
  user: {
    name: string;
    email: string;
    image: string | null;
    role: UserRole;
    businessName: string;
    subscriptionPlan: SubscriptionPlan;
    createdAt: string;
  };
};

const ROLE_LABEL: Record<UserRole, string> = {
  customer: "Customer",
  vendor: "Restaurant owner",
  admin: "Administrator",
};

const fieldClass =
  "h-13 w-full rounded-xl border border-input bg-card px-4 text-sm outline-none transition placeholder:text-muted-foreground focus:border-ring focus:ring-3 focus:ring-ring/20 aria-invalid:border-destructive";

export default function ProfileForm({ user }: Props) {
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [preview, setPreview] = useState("");
  const [removeImage, setRemoveImage] = useState(false);

  const isVendor = user.role === "vendor";

  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: { name: user.name, businessName: user.businessName },
  });

  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  const shownImage = preview || (removeImage ? null : user.image);

  const initials = user.name
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  const handleFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    if (!["image/png", "image/jpeg"].includes(file.type)) {
      toast.error("Please select a PNG or JPG image.");
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      toast.error("Image must be smaller than 2 MB.");
      return;
    }

    setImageFile(file);
    setRemoveImage(false);
    setPreview(URL.createObjectURL(file));
  };

  const handleRemove = () => {
    setImageFile(null);
    setPreview("");
    setRemoveImage(true);
  };

  const handleCancel = () => {
    reset({ name: user.name, businessName: user.businessName });
    setImageFile(null);
    setPreview("");
    setRemoveImage(false);
  };

  const onSubmit = async (values: ProfileFormValues) => {
    if (isVendor && !values.businessName?.trim()) {
      setError("businessName", { message: "Please enter your business name." });
      return;
    }

    try {
      let image: string | null | undefined;

      if (imageFile) {
        const formData = new FormData();
        formData.append("image", imageFile);

        const upload = await fetch("/api/upload/profile", {
          method: "POST",
          body: formData,
        });
        const uploadData = await upload.json();
        if (!upload.ok)
          throw new Error(uploadData.message || "Image upload failed.");

        image = uploadData.url;
      } else if (removeImage) {
        image = null;
      }

      await apiFetch("/api/users/me", {
        method: "PATCH",
        body: JSON.stringify({
          name: values.name.trim(),
          ...(isVendor && { businessName: values.businessName?.trim() }),
          ...(image !== undefined && { image }),
        }),
      });

      toast.success("Profile updated successfully.");

      setImageFile(null);
      setPreview("");
      setRemoveImage(false);

      // Navbar ও sidebar এর session নতুন করে লোড হবে
      authClient.$store.notify("$sessionSignal");
      router.refresh();
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Could not update your profile.",
      );
    }
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[380px_1fr] lg:items-start">
      <div className="space-y-6">
        {/* Avatar */}
        <section className="rounded-2xl bg-card p-6 text-center ring-1 ring-foreground/10">
          {shownImage ? (
            <img
              src={shownImage}
              alt={user.name}
              className="mx-auto size-40 rounded-full object-cover"
            />
          ) : (
            <span className="mx-auto flex size-40 items-center justify-center rounded-full bg-secondary font-heading text-5xl font-bold text-secondary-foreground">
              {initials}
            </span>
          )}

          <p className="mt-5 font-heading text-xl font-bold">{user.name}</p>
          <p className="text-sm text-muted-foreground">{user.email}</p>

          <div className="mt-5 flex justify-center gap-3">
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="h-10 cursor-pointer rounded-full border border-border px-5 text-sm font-medium transition-colors hover:bg-muted"
            >
              Change photo
            </button>
            <button
              type="button"
              onClick={handleRemove}
              disabled={!shownImage}
              className="h-10 cursor-pointer rounded-full border border-border px-5 text-sm font-medium transition-colors hover:bg-muted disabled:cursor-not-allowed disabled:opacity-40"
            >
              Remove
            </button>
          </div>
          <p className="mt-3 text-xs text-muted-foreground">
            JPG or PNG. Optional.
          </p>

          <input
            ref={fileRef}
            type="file"
            accept="image/png,image/jpeg"
            className="hidden"
            onChange={handleFile}
          />
        </section>

        {/* Account */}
        <section className="rounded-2xl bg-card p-6 ring-1 ring-foreground/10">
          <h2 className="font-heading text-xl font-bold">Account</h2>
          <dl className="mt-4">
            <div className="flex items-center justify-between border-b border-border py-4">
              <dt className="text-sm text-muted-foreground">Role</dt>
              <dd className="text-sm font-medium">{ROLE_LABEL[user.role]}</dd>
            </div>
            {isVendor && (
              <div className="flex items-center justify-between border-b border-border py-4">
                <dt className="text-sm text-muted-foreground">Plan</dt>
                <dd>
                  <span
                    className={cn(
                      "rounded-full px-3 py-1 text-xs font-medium capitalize",
                      user.subscriptionPlan === "premium"
                        ? "bg-secondary text-secondary-foreground"
                        : "bg-secondary/30",
                    )}
                  >
                    {user.subscriptionPlan}
                  </span>
                </dd>
              </div>
            )}
            <div className="flex items-center justify-between py-4">
              <dt className="text-sm text-muted-foreground">Member since</dt>
              <dd className="text-sm font-medium">
                {formatShortDate(user.createdAt)}
              </dd>
            </div>
          </dl>
        </section>
      </div>

      {/* Personal information */}
      <form
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        className="rounded-2xl bg-card p-6 ring-1 ring-foreground/10 sm:p-8"
      >
        <h2 className="font-heading text-2xl font-bold">
          Personal information
        </h2>

        <div className="mt-6">
          <label htmlFor="name" className="mb-2 block text-sm font-medium">
            Full name
          </label>
          <input
            id="name"
            aria-invalid={!!errors.name}
            className={fieldClass}
            {...register("name")}
          />
          {errors.name && (
            <p role="alert" className="mt-1.5 text-xs text-destructive">
              {errors.name.message}
            </p>
          )}
        </div>

        <div className="mt-5">
          <label htmlFor="email" className="mb-2 block text-sm font-medium">
            Email
          </label>
          <input
            id="email"
            value={user.email}
            readOnly
            disabled
            className={cn(
              fieldClass,
              "cursor-not-allowed bg-secondary/10 text-muted-foreground",
            )}
          />
          <p className="mt-1.5 text-xs text-muted-foreground">
            Your email can not be changed.
          </p>
        </div>

        {isVendor && (
          <div className="mt-5">
            <label
              htmlFor="businessName"
              className="mb-2 flex items-center gap-2 text-sm font-medium"
            >
              Business name
              <span className="rounded-full bg-secondary/30 px-2.5 py-0.5 text-xs font-normal">
                Restaurant owners only
              </span>
            </label>
            <input
              id="businessName"
              aria-invalid={!!errors.businessName}
              className={fieldClass}
              {...register("businessName")}
            />
            {errors.businessName && (
              <p role="alert" className="mt-1.5 text-xs text-destructive">
                {errors.businessName.message}
              </p>
            )}
          </div>
        )}

        <div className="mt-7 flex flex-wrap gap-3">
          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex h-12 cursor-pointer items-center justify-center gap-2 rounded-full bg-brand px-8 text-sm font-semibold text-brand-foreground transition hover:bg-brand/90 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting && <Loader2 className="size-4 animate-spin" />}
            {isSubmitting ? "Saving..." : "Save changes"}
          </button>
          <button
            type="button"
            onClick={handleCancel}
            disabled={isSubmitting}
            className="h-12 cursor-pointer rounded-full border border-border px-8 text-sm font-medium transition-colors hover:bg-muted disabled:opacity-50"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
