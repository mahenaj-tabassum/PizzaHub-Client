"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { toast } from "react-toastify";

import { apiFetch } from "@/lib/api";
import {
  orderSchema,
  todayString,
  type OrderFormValues,
} from "@/lib/validations";
import { cn } from "@/lib/utils";

type Props = {
  itemId: string;
  user: { name: string; email: string; image?: string | null };
};

const fieldClass =
  "w-full rounded-xl border border-input bg-card px-4 text-sm outline-none transition placeholder:text-muted-foreground focus:border-ring focus:ring-3 focus:ring-ring/20 aria-invalid:border-destructive";

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <p role="alert" className="mt-1.5 text-xs text-destructive">
      {message}
    </p>
  );
}

export default function OrderForm({ itemId, user }: Props) {
  const router = useRouter();
  const [today, setToday] = useState("");

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<OrderFormValues>({
    resolver: zodResolver(orderSchema),
    defaultValues: { deliveryDate: "", deliveryAddress: "", message: "" },
  });

  // তারিখ ক্লায়েন্টে সেট হয় (সার্ভার ও ব্রাউজারের টাইমজোন আলাদা হলে hydration mismatch এড়াতে)
  useEffect(() => {
    const value = todayString();
    setToday(value);
    setValue("deliveryDate", value);
  }, [setValue]);

  const messageLength = watch("message")?.length ?? 0;

  const initials = user.name
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  const onSubmit = async (values: OrderFormValues) => {
    try {
      const message = values.message.trim();

      const result = await apiFetch("/api/orders", {
        method: "POST",
        body: JSON.stringify({
          itemId,
          deliveryDate: values.deliveryDate,
          deliveryAddress: values.deliveryAddress.trim(),
          ...(message && { message }),
        }),
      });

      const orderId: string | undefined = result?.data?._id;

      toast.success("Order placed successfully!");

      router.push(
        orderId
          ? `/menu/${itemId}/order/sent?orderId=${orderId}`
          : "/dashboard/customer/orders",
      );
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Could not place your order.",
      );
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      className="rounded-3xl bg-card p-5 shadow-xl shadow-black/5 ring-1 ring-foreground/10 sm:p-8"
    >
      {/* Ordering as */}
      <div className="flex items-center gap-4 rounded-xl border border-border bg-secondary/10 p-4">
        {user.image ? (
          <img
            src={user.image}
            alt={user.name}
            className="size-12 rounded-full object-cover"
          />
        ) : (
          <span className="flex size-12 items-center justify-center rounded-full bg-brand text-sm font-semibold text-brand-foreground">
            {initials}
          </span>
        )}
        <div className="min-w-0">
          <p className="truncate font-medium">Ordering as {user.name}</p>
          <p className="truncate text-sm text-muted-foreground">{user.email}</p>
        </div>
      </div>

      {/* Delivery date */}
      <div className="mt-6">
        <label
          htmlFor="deliveryDate"
          className="mb-2 block text-sm font-medium"
        >
          Delivery date
        </label>
        <input
          id="deliveryDate"
          type="date"
          min={today || undefined}
          aria-invalid={!!errors.deliveryDate}
          className={cn(fieldClass, "h-13")}
          {...register("deliveryDate")}
        />
        {errors.deliveryDate ? (
          <FieldError message={errors.deliveryDate.message} />
        ) : (
          <p className="mt-1.5 text-xs text-muted-foreground">
            Choose today or a later date.
          </p>
        )}
      </div>

      {/* Address */}
      <div className="mt-5">
        <label
          htmlFor="deliveryAddress"
          className="mb-2 block text-sm font-medium"
        >
          Delivery address
        </label>
        <textarea
          id="deliveryAddress"
          rows={3}
          placeholder="House, road, area, city"
          aria-invalid={!!errors.deliveryAddress}
          className={cn(fieldClass, "resize-none py-3")}
          {...register("deliveryAddress")}
        />
        {errors.deliveryAddress ? (
          <FieldError message={errors.deliveryAddress.message} />
        ) : (
          <p className="mt-1.5 text-xs text-muted-foreground">
            At least 10 characters, so the rider can find you.
          </p>
        )}
      </div>

      {/* Message */}
      <div className="mt-5">
        <label htmlFor="message" className="mb-2 block text-sm font-medium">
          Additional message (optional)
        </label>
        <textarea
          id="message"
          rows={3}
          placeholder="Special instructions, allergies, or gate code"
          aria-invalid={!!errors.message}
          className={cn(fieldClass, "resize-none py-3")}
          {...register("message")}
        />
        <div className="mt-1.5 flex justify-between text-xs text-muted-foreground">
          {errors.message ? (
            <FieldError message={errors.message.message} />
          ) : (
            <span>Up to 500 characters</span>
          )}
          <span>{messageLength} / 500</span>
        </div>
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="mt-7 flex h-14 w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-brand text-base font-semibold text-brand-foreground transition hover:bg-brand/90 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isSubmitting && <Loader2 className="size-5 animate-spin" />}
        {isSubmitting ? "Placing order..." : "Place Order"}
      </button>

      <p className="mt-4 text-center text-sm text-muted-foreground">
        No online payment is needed. The restaurant will confirm your order.
      </p>
    </form>
  );
}
