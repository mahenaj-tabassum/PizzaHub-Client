"use client";

import { useState } from "react";
import Image from "next/image";
import { Pizza } from "lucide-react";
import { getCategoryImage } from "@/lib/constants";

export default function CategoryImage({
  slug,
  alt,
}: {
  slug: string;
  alt: string;
}) {
  const [failed, setFailed] = useState(false);

  return (
    <span className="relative flex size-16 items-center justify-center overflow-hidden rounded-full bg-[#f3d9a0] transition-transform duration-300 group-hover:scale-105">
      {failed ? (
        <Pizza aria-hidden="true" className="size-7 text-primary/60" />
      ) : (
        <Image
          src={getCategoryImage(slug)}
          alt={alt}
          fill
          sizes="64px"
          className="object-cover"
          onError={() => setFailed(true)}
        />
      )}
    </span>
  );
}
