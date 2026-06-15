import { z } from "zod";

export const movieFormSchema = (mode: "create" | "edit") =>
  z.object({
    name: z.string().min(1, "Name is required"),
    rating: z.number(),
    description: z.string().min(1, "Description is required"),
    imageFile: z.any().nullable(),
  }).superRefine((data, ctx) => {
    if (mode === "create" && !data.imageFile) {
      ctx.addIssue({
        code: "custom",
        path: ["imageFile"],
        message: "Image is required",
      });
    }
  });

export type MovieFormValues = {
  name: string;
  rating: number;
  description: string;
  imageFile: File | null;
};