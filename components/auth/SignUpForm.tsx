"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Eye, EyeOff, Upload, Loader2 } from "lucide-react";
import { toast } from "react-toastify";

import { authClient } from "@/lib/auth-client";
import AuthShell from "./AuthShell";
import GoogleButton from "./GoogleButton";
import RoleSelect, { type AccountRole } from "./RoleSelect";
import PasswordStrength, { isPasswordValid } from "./PasswordStrength";
import Image from "next/image";

export default function SignUpForm() {
  const [role, setRole] = useState<AccountRole>("customer");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState("");

  const passwordValid = isPasswordValid(password);

  // Vendor হলে "Restaurant name", নইলে "Full name"
  const isVendor = role === "vendor";
  const nameLabel = isVendor ? "Restaurant name" : "Full name";
  const namePlaceholder = isVendor ? "Your restaurant name" : "Your full name";

  // Free the preview object URL when it changes or the form unmounts
  useEffect(() => {
    return () => {
      if (imagePreview) URL.revokeObjectURL(imagePreview);
    };
  }, [imagePreview]);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

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
    setImagePreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!passwordValid) {
      toast.error(
        "Password must contain 6 characters, one uppercase and one lowercase letter.",
      );
      return;
    }

    try {
      setLoading(true);

      let image: string | undefined;

      if (imageFile) {
        const formData = new FormData();
        formData.append("image", imageFile);

        const uploadResponse = await fetch("/api/upload/profile", {
          method: "POST",
          body: formData,
        });

        const uploadData = await uploadResponse.json();

        if (!uploadResponse.ok) {
          throw new Error(uploadData.message || "Image upload failed.");
        }

        image = uploadData.url;
      }

      const { error } = await authClient.signUp.email({
        name: name.trim(),
        email,
        password,
        image,
        role,
        callbackURL: "/redirect",
      });

      if (error) {
        throw new Error(error.message);
      }

      toast.success("Account created successfully!");

      window.location.href =
        role === "vendor" ? "/dashboard/vendor" : "/dashboard/customer";
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Registration failed.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell
      mode="signup"
      title="Create your account"
      description="Order fresh pizza, or put your own menu in front of hungry customers."
    >
      <div className="space-y-5">
        <GoogleButton />

        <div className="flex items-center gap-3">
          <span className="h-px flex-1 bg-border" />
          <span className="text-sm text-muted-foreground">
            or continue with email
          </span>
          <span className="h-px flex-1 bg-border" />
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <RoleSelect value={role} onChange={setRole} />

          <div>
            <label
              htmlFor="name"
              className="mb-2 block text-sm font-medium text-foreground"
            >
              {nameLabel}
            </label>
            <input
              id="name"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={namePlaceholder}
              autoComplete={isVendor ? "organization" : "name"}
              className="auth-input"
            />
          </div>

          <div>
            <label
              htmlFor="email"
              className="mb-2 block text-sm font-medium text-foreground"
            >
              Email
            </label>
            <input
              id="email"
              required
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              autoComplete="email"
              className="auth-input"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="mb-2 block text-sm font-medium text-foreground"
            >
              Password
            </label>

            <div className="relative">
              <input
                id="password"
                required
                minLength={6}
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Create a password"
                className="auth-input pr-12"
                autoComplete="new-password"
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground"
                aria-label="Toggle password visibility"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            <PasswordStrength password={password} />
          </div>

          {/* Optional profile image */}
          <label className="flex cursor-pointer items-center gap-3 rounded-2xl border border-dashed border-border bg-muted p-4 transition hover:bg-card">
            {imagePreview ? (
              <Image
                src={imagePreview}
                width={48}
                height={48}
                alt="Profile preview"
                className="size-12 rounded-full object-cover"
              />
            ) : (
              <span className="flex size-12 items-center justify-center rounded-full bg-secondary/30 text-brand">
                <Upload size={21} />
              </span>
            )}

            <span className="min-w-0 flex-1">
              <span className="block text-sm font-medium text-foreground">
                {isVendor
                  ? "Restaurant logo (optional)"
                  : "Profile image (optional)"}
              </span>
              <span className="block text-xs text-muted-foreground">
                PNG or JPG. You can skip this.
              </span>
            </span>

            <span className="rounded-full border border-border bg-card px-4 py-2 text-sm text-foreground">
              Upload
            </span>

            <input
              type="file"
              accept="image/png,image/jpeg"
              className="hidden"
              onChange={handleImageChange}
            />
          </label>

          <button
            type="submit"
            disabled={loading || !passwordValid}
            className="flex h-[58px] w-full items-center justify-center gap-2 rounded-xl bg-brand font-semibold text-brand-foreground transition hover:bg-brand/90 disabled:opacity-60"
          >
            {loading && <Loader2 className="size-5 animate-spin" />}
            {loading ? "Creating account..." : "Create account"}
          </button>
        </form>

        <p className="text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link
            href="/signin"
            className="font-semibold text-brand hover:underline"
          >
            Sign in
          </Link>
        </p>
      </div>
    </AuthShell>
  );
}
