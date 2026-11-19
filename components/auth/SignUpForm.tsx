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
        name,
        email,
        password,
        image,
        requestedRole: role,
        callbackURL: "/redirect", // fixed: (auth) is a route group, not a URL segment
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
          <span className="h-px flex-1 bg-[#e3c9a9]" />
          <span className="text-sm text-[#795b50]">or continue with email</span>
          <span className="h-px flex-1 bg-[#e3c9a9]" />
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <RoleSelect value={role} onChange={setRole} />

          <div>
            <label
              htmlFor="name"
              className="mb-2 block text-sm font-medium text-[#38231d]"
            >
              Full name
            </label>
            <input
              id="name"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your full name"
              className="auth-input"
            />
          </div>

          <div>
            <label
              htmlFor="email"
              className="mb-2 block text-sm font-medium text-[#38231d]"
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
              className="auth-input"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="mb-2 block text-sm font-medium text-[#38231d]"
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
                className="absolute right-4 top-1/2 -translate-y-1/2 text-[#76584d]"
                aria-label="Toggle password visibility"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            <PasswordStrength password={password} />
          </div>

          {/* Optional profile image */}
          <label className="flex cursor-pointer items-center gap-3 rounded-2xl border border-dashed border-[#dfc29e] bg-[#fbf5eb] p-4 transition hover:bg-white">
            {imagePreview ? (
              <img
                src={imagePreview}
                alt="Profile preview"
                className="size-12 rounded-full object-cover"
              />
            ) : (
              <span className="flex size-12 items-center justify-center rounded-full bg-[#f4e3c9] text-[#981e24]">
                <Upload size={21} />
              </span>
            )}

            <span className="min-w-0 flex-1">
              <span className="block text-sm font-medium text-[#301c17]">
                Profile image (optional)
              </span>
              <span className="block text-xs text-[#795b50]">
                PNG or JPG. You can skip this.
              </span>
            </span>

            <span className="rounded-full border border-[#dfc29e] bg-white px-4 py-2 text-sm">
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
            className="flex h-[54px] w-full items-center justify-center gap-2 rounded-xl bg-[#981e24] font-semibold text-white transition hover:bg-[#7f171d] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading && <Loader2 className="size-5 animate-spin" />}
            {loading ? "Creating account..." : "Create account"}
          </button>
        </form>

        <p className="text-center text-sm text-[#795b50]">
          Already have an account?{" "}
          <Link
            href="/signin"
            className="font-semibold text-[#981e24] hover:underline"
          >
            Sign in
          </Link>
        </p>
      </div>
    </AuthShell>
  );
}
