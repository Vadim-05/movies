import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { movieFormSchema, MovieFormValues } from "./movie.schema";

const defaultValues: MovieFormValues = {
  name: "",
  rating: 0,
  description: "",
  imageFile: null,
};

export function useMovieForm(
  mode: "create" | "edit",
  initialData?: Partial<MovieFormValues>
) {
  const form = useForm<MovieFormValues>({
    resolver: zodResolver(movieFormSchema(mode)),
    defaultValues,
  });

  useEffect(() => {
    if (!initialData) return;

    form.reset({
      ...defaultValues,
      ...initialData,
      imageFile: null,
    });
  }, [initialData]);

  return form;
}