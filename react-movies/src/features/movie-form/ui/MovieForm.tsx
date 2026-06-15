import { useState } from "react";
import { MovieFormValues } from "@/features/movie-form/model/movie.schema";
import { useMovieForm } from "@/features/movie-form/model/useMovieForm";

type Props = {
  initialValues?: Partial<MovieFormValues>;
  onSubmit: (data: MovieFormValues) => void;
  isLoading?: boolean;
  mode: "create" | "edit";
};

export function MovieForm({ initialValues, onSubmit, isLoading, mode}: Props) {
  const form = useMovieForm(mode, initialValues);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = form;

  const [imageError, setImageError] = useState("");

  const submitHandler = handleSubmit((data) => {
    if (mode === "create" && !data.imageFile) {
      setImageError("Image is required");
      return;
    }

    setImageError("");
    onSubmit(data);
  });

  return (
    <div className="mx-auto mt-10 max-w-2xl rounded-3xl border border-neutral-800 bg-neutral-950 p-8 shadow-2xl">
      <h1 className="mb-8 text-center text-3xl font-bold text-white">
        {mode === "create" ? "🎬 Create Movie" : "✏️ Edit Movie"}
      </h1>

      <form onSubmit={submitHandler} className="space-y-6">

        <div>
          <label className="mb-2 block text-sm text-neutral-400">
            Movie name
          </label>

          <input
            {...register("name")}
            placeholder="Interstellar"
            className="w-full rounded-xl border border-neutral-800 bg-neutral-900 px-4 py-3 text-white outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
          />

          {errors.name && (
            <p className="mt-1 text-sm text-red-400">
              {errors.name.message}
            </p>
          )}
        </div>

        <div>
          <label className="mb-2 block text-sm text-neutral-400">
            Rating (0 - 10)
          </label>

          <input
            type="number"
            step="0.1"
            min="0"
            max="10"
            {...register("rating", { valueAsNumber: true })}
            className="w-full rounded-xl border border-neutral-800 bg-neutral-900 px-4 py-3 text-white outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
          />

          {errors.rating && (
            <p className="mt-1 text-sm text-red-400">
              {errors.rating.message}
            </p>
          )}
        </div>

        <div>
          <label className="mb-2 block text-sm text-neutral-400">
            Description
          </label>

          <textarea
            rows={5}
            {...register("description")}
            placeholder="Write something about the movie..."
            className="w-full resize-none rounded-xl border border-neutral-800 bg-neutral-900 px-4 py-3 text-white outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
          />

          {errors.description && (
            <p className="mt-1 text-sm text-red-400">
              {errors.description.message}
            </p>
          )}
        </div>

        <div>
          <label className="mb-2 block text-sm text-neutral-400">
            Poster image
          </label>

          <div className="flex items-center justify-center rounded-xl border border-dashed border-neutral-700 bg-neutral-900 px-4 py-6 text-center">
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                setValue("imageFile", e.target.files?.[0] ?? null, {
                  shouldValidate: true,
                });

                if (e.target.files?.[0]) {
                  setImageError("");
                }
              }}
              className="text-sm text-neutral-400 file:mr-4 file:rounded-lg file:border-0 file:bg-red-600 file:px-4 file:py-2 file:text-white hover:file:bg-red-500"
            />
          </div>

          {imageError && (
            <p className="mt-1 text-sm text-red-400">
              {imageError}
            </p>
          )}

          {errors.imageFile && (
            <p className="mt-1 text-sm text-red-400">
              {String(errors.imageFile.message)}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="rounded-lg bg-red-600 px-4 py-2 text-sm text-white hover:bg-red-500 disabled:opacity-50"
        >
          {isLoading
            ? mode === "create"
              ? "Creating..."
              : "Saving..."
            : mode === "create"
            ? "Create Movie"
            : "Save Changes"}
        </button>
      </form>
    </div>
  );
}