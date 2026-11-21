"use client";

import { useState } from "react";
import Image from "next/image";
import { Pizza } from "lucide-react";
import { cn } from "@/lib/utils";

export default function ImageGallery({
  images,
  alt,
}: {
  images: string[];
  alt: string;
}) {
  const [active, setActive] = useState(0);

  if (images.length === 0) {
    return (
      <div className="flex aspect-4/3 items-center justify-center rounded-2xl bg-muted">
        <Pizza className="size-16 text-primary/40" />
      </div>
    );
  }

  return (
    <div>
      <div className="relative aspect-4/3 overflow-hidden rounded-2xl bg-muted ring-1 ring-foreground/10">
        <Image
          src={images[active]}
          alt={alt}
          fill
          priority
          sizes="(min-width: 1024px) 50vw, 100vw"
          className="object-cover"
        />
      </div>

      {images.length > 1 && (
        <div className="mt-3 grid grid-cols-3 gap-3">
          {images.slice(0, 3).map((src, i) => (
            <button
              key={src}
              type="button"
              onClick={() => setActive(i)}
              aria-label={`Show image ${i + 1}`}
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
                sizes="(min-width: 1024px) 15vw, 30vw"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
