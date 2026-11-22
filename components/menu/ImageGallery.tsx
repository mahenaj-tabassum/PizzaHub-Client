"use client";

import { useState } from "react";
import Image from "next/image";
import { Pizza } from "lucide-react";
import { cn } from "@/lib/utils";

// সার্ভার সর্বোচ্চ ৫টি ছবি গ্রহণ করে
const MAX_VISIBLE = 5;

export default function ImageGallery({
  images,
  alt,
}: {
  images: string[];
  alt: string;
}) {
  const [active, setActive] = useState(0);

  const visible = images.slice(0, MAX_VISIBLE);

  if (visible.length === 0) {
    return (
      <div className="flex aspect-4/3 items-center justify-center rounded-2xl bg-muted">
        <Pizza className="size-16 text-primary/40" />
      </div>
    );
  }

  // active কখনো সীমার বাইরে গেলে প্রথম ছবিতে ফিরে যাবে
  const current = visible[active] ?? visible[0];

  // Tailwind কোড স্ক্যান করে ক্লাস নেয়, তাই পুরো ক্লাস নামগুলো এখানে স্পষ্ট লেখা
  const thumbColumns =
    visible.length === 2
      ? "grid-cols-2"
      : visible.length === 3
        ? "grid-cols-3"
        : visible.length === 4
          ? "grid-cols-4"
          : "grid-cols-5";

  return (
    <div>
      <div className="relative aspect-4/3 overflow-hidden rounded-2xl bg-muted ring-1 ring-foreground/10">
        <Image
          src={current}
          alt={alt}
          fill
          priority
          sizes="(min-width: 1024px) 50vw, 100vw"
          className="object-cover"
        />
      </div>

      {visible.length > 1 && (
        <div className={cn("mt-3 grid gap-3", thumbColumns)}>
          {visible.map((src, i) => (
            <button
              key={`${src}-${i}`}
              type="button"
              onClick={() => setActive(i)}
              aria-label={`Show image ${i + 1} of ${visible.length}`}
              aria-pressed={i === active}
              className={cn(
                "relative aspect-4/3 cursor-pointer overflow-hidden rounded-xl bg-muted ring-2 transition",
                i === active
                  ? "ring-brand"
                  : "ring-transparent hover:ring-brand/40",
              )}
            >
              <Image
                src={src}
                alt=""
                fill
                sizes="(min-width: 1024px) 10vw, 20vw"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
