import type { MovieFormValues } from "@/features/movie-form/model/movie.schema";

export function toMovieFormData(payload: MovieFormValues): FormData {
  const formData = new FormData();

  formData.append("name", payload.name);
  formData.append("rating", String(payload.rating));
  formData.append("description", payload.description);

  if (payload.imageFile) {
    formData.append("image", payload.imageFile);
  }

  return formData;
}