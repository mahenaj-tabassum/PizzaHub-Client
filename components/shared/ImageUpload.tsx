"use client";

import { useEffect, useRef } from "react";
import { ImagePlus } from "lucide-react";
import { toast } from "react-toastify";

export type ImageEntry = {
  key: string;
  url?: string; // আগে থেকে আপলোড করা (Edit এ)
  file?: File; // নতুন, এখনো আপলোড হয়নি
  preview: string;
};

const MAX_IMAGES = 4;
const MAX_SIZE = 4 * 1024 * 1024;

const rowClass =
  "flex items-center gap-4 rounded-2xl border border-dashed border-secondary bg-secondary/10 p-4";
const smallBtn =
  "h-10 shrink-0 cursor-pointer rounded-full border border-border bg-card px-5 text-sm font-medium transition-colors hover:bg-muted";

export const newImageKey = () =>
  `${Date.now()}-${Math.random().toString(36).slice(2)}`;

export default function ImageUpload({
  value,
  onChange,
  error,
}: {
  value: ImageEntry[];
  onChange: (next: ImageEntry[]) => void;
  error?: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const targetRef = useRef<number | null>(null);
  const latest = useRef(value);

  useEffect(() => {
    latest.current = value;
  }, [value]);

  // unmount এ preview URL মুক্ত করা
  useEffect(() => {
    return () => {
      latest.current.forEach((e) => e.file && URL.revokeObjectURL(e.preview));
    };
  }, []);

  const openPicker = (index: number | null) => {
    targetRef.current = index;
    inputRef.current?.click();
  };

  const handleFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    if (!["image/png", "image/jpeg"].includes(file.type)) {
      toast.error("Please select a JPG or PNG image.");
      return;
    }
    if (file.size > MAX_SIZE) {
      toast.error("Image must be 4 MB or smaller.");
      return;
    }

    const entry: ImageEntry = {
      key: newImageKey(),
      file,
      preview: URL.createObjectURL(file),
    };

    const target = targetRef.current;
    if (target !== null && value[target]) {
      if (value[target].file) URL.revokeObjectURL(value[target].preview);
      onChange(value.map((v, i) => (i === target ? entry : v)));
    } else {
      onChange([...value, entry]);
    }
  };

  const handleRemove = (index: number) => {
    const entry = value[index];
    if (entry.file) URL.revokeObjectURL(entry.preview);
    onChange(value.filter((_, i) => i !== index));
  };

  return (
    <div>
      <div className="space-y-3">
        {value.map((entry, i) => (
          <div key={entry.key} className={rowClass}>
            <img
              src={entry.preview}
              alt=""
              className="h-16 w-20 shrink-0 rounded-xl object-cover"
            />
            <div className="min-w-0 flex-1">
              <p className="truncate font-medium">
                {entry.file?.name ?? `Image ${i + 1}`}
              </p>
              <p className="text-xs text-muted-foreground">
                {i === 0 ? "Cover image · " : ""}JPG or PNG, up to 5 MB
              </p>
            </div>
            <div className="flex shrink-0 flex-wrap justify-end gap-2">
              <button
                type="button"
                onClick={() => openPicker(i)}
                className={smallBtn}
              >
                Replace
              </button>
              {value.length > 1 && (
                <button
                  type="button"
                  onClick={() => handleRemove(i)}
                  className={`${smallBtn} text-destructive`}
                >
                  Remove
                </button>
              )}
            </div>
          </div>
        ))}

        {value.length === 0 && (
          <button
            type="button"
            onClick={() => openPicker(null)}
            aria-invalid={!!error}
            className="flex w-full cursor-pointer flex-col items-center gap-2 rounded-2xl border border-dashed border-secondary bg-secondary/10 px-4 py-8 text-center transition-colors hover:bg-secondary/20 aria-invalid:border-destructive"
          >
            <ImagePlus className="size-7 text-brand" />
            <span className="text-sm font-medium">Upload item image</span>
            <span className="text-xs text-muted-foreground">
              JPG or PNG, up to 5 MB
            </span>
          </button>
        )}

        {value.length > 0 && value.length < MAX_IMAGES && (
          <button
            type="button"
            onClick={() => openPicker(null)}
            className="inline-flex h-10 cursor-pointer items-center gap-2 rounded-full border border-border px-5 text-sm font-medium transition-colors hover:bg-muted"
          >
            <ImagePlus className="size-4" />
            Add another image ({value.length}/{MAX_IMAGES})
          </button>
        )}
      </div>

      {error && (
        <p role="alert" className="mt-1.5 text-xs text-destructive">
          {error}
        </p>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/png,image/jpeg"
        className="hidden"
        onChange={handleFile}
      />
    </div>
  );
}
