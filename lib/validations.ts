import { z } from "zod";
import { CATEGORIES } from "@/lib/constants";

export const todayString = () => {
  const d = new Date();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${month}-${day}`;
};

export const orderSchema = z.object({
  deliveryDate: z
    .string()
    .min(1, "Please choose a delivery date.")
    .refine(
      (value) => value >= todayString(),
      "Delivery date cannot be in the past.",
    ),
  deliveryAddress: z
    .string()
    .trim()
    .min(10, "Please enter at least 10 characters so the rider can find you.")
    .max(300, "Address must be 300 characters or fewer."),
  message: z.string().max(500, "Message must be 500 characters or fewer."),
});

export const profileSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters.")
    .max(60, "Name must be 60 characters or fewer."),
  businessName: z
    .string()
    .trim()
    .max(80, "Business name must be 80 characters or fewer.")
    .optional(),
});

export type ProfileFormValues = z.infer<typeof profileSchema>;

export type OrderFormValues = z.infer<typeof orderSchema>;

export const itemSchema = z.object({
  itemName: z
    .string()
    .trim()
    .min(3, "Item name must be at least 3 characters.")
    .max(80, "Item name must be 80 characters or fewer."),
  category: z
    .string()
    .refine(
      (v) => CATEGORIES.some((c) => c.slug === v),
      "Please choose a category.",
    ),
  price: z
    .string()
    .trim()
    .refine(
      (v) => v !== "" && Number.isFinite(Number(v)) && Number(v) > 0,
      "Enter a price greater than 0.",
    )
    .refine((v) => Number(v) <= 10000, "Price is too high."),
  location: z
    .string()
    .trim()
    .min(2, "Please enter the area or city.")
    .max(120, "Location must be 120 characters or fewer."),
  description: z
    .string()
    .trim()
    .min(10, "Description must be at least 10 characters.")
    .max(1000, "Description must be 1000 characters or fewer."),
});

export type ItemFormValues = z.infer<typeof itemSchema>;
