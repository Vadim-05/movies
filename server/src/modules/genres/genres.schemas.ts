import { z } from "zod";

export const replaceSelectedGenresSchema = z.strictObject({
  genreIds: z
    .array(
      z
        .number()
        .int()
        .positive(),
    )
    .min(1, "Select at least one genre")
    .max(100, "Too many genres selected"),
});

export type ReplaceSelectedGenresInput = z.infer<
  typeof replaceSelectedGenresSchema
>;