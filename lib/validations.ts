import { z } from "zod";

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

export type OrderFormValues = z.infer<typeof orderSchema>;
