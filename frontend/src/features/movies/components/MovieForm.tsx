import type { ReactNode } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createMovieSchema,
      type CreateMovieFormInput,
      type CreateMoviePayload } from "../movies.schema";
interface MovieFormProps {
  onSubmit: (payload: CreateMoviePayload) => void | Promise<void>;
  isPending?: boolean;
}

const defaultValues: CreateMovieFormInput = {
  title: "",
  description: "",
  releaseDate: "",
  runtimeMinutes: "",
  originalLanguage: "",
  rating: "",
  posterUrl: "",
  trailerUrl: "",
  genres: "",
  characters: [],
};

const inputClass = [
  "w-full rounded-xl border border-white/10",
  "bg-white/[0.04] px-4 py-3",
  "text-sm text-white placeholder:text-slate-500",
  "outline-none",
  "focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20",
  "disabled:opacity-50",
].join(" ");

const sectionClass =
  "space-y-5 rounded-2xl border border-white/[0.08] bg-slate-900/80 p-5 sm:p-7";

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: ReactNode;
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-slate-300">
        {label}
      </label>
      {children}
      {error && <p role="alert" className="mt-2 text-xs text-rose-400">{error}</p>}
    </div>
  );
}

export function MovieForm({ onSubmit, isPending = false }: MovieFormProps) {
  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm<CreateMovieFormInput, unknown, CreateMoviePayload>({
    resolver: zodResolver(createMovieSchema),
    defaultValues,
    mode: "onTouched",
    disabled: isPending,
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "characters",
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="mx-auto max-w-5xl space-y-7">
      <header>
        <p className="text-xs font-semibold uppercase tracking-widest text-violet-400">CineVault Admin</p>
        <h1 className="mt-2 text-3xl font-bold text-white">Add a Movie</h1>
        <p className="mt-2 text-sm text-slate-400">Fill in the movie details.</p>
      </header>

      <section className={sectionClass}>
        <h2 className="text-lg font-semibold text-white">Basic Information</h2>
        <Field label="Movie Title *" error={errors.title?.message}>
          <input {...register("title")} maxLength={255} placeholder="Interstellar" className={inputClass} />
        </Field>
        <Field label="Description *" error={errors.description?.message}>
          <textarea {...register("description")} maxLength={5000} rows={5} placeholder="Plot Summary..." className={inputClass} />
        </Field>
      </section>

      <section className={sectionClass}>
        <h2 className="text-lg font-semibold text-white">Movie Details</h2>
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Release Date" error={errors.releaseDate?.message}>
            <input type="date" {...register("releaseDate")} className={`${inputClass} [color-scheme:dark]`} />
          </Field>
          <Field label="Duration (minutes)" error={errors.runtimeMinutes?.message}>
            <input type="number" min={1} {...register("runtimeMinutes")} placeholder="169" className={inputClass} />
          </Field>
          <Field label="Original Language" error={errors.originalLanguage?.message}>
            <input {...register("originalLanguage")} maxLength={10} placeholder="en" className={inputClass} />
          </Field>
          <Field label="Rating (0–10)" error={errors.rating?.message}>
            <input type="number" min={0} max={10} step="0.1" {...register("rating")} placeholder="8.7" className={inputClass} />
          </Field>
        </div>
      </section>

      <section className={sectionClass}>
        <h2 className="text-lg font-semibold text-white">Media Content</h2>
        <Field label="Poster URL" error={errors.posterUrl?.message}>
          <input type="url" {...register("posterUrl")} placeholder="https://example.com/poster.jpg" className={inputClass} />
        </Field>
        <Field label="Trailer URL" error={errors.trailerUrl?.message}>
          <input type="url" {...register("trailerUrl")} placeholder="https://youtube.com/watch?v=..." className={inputClass} />
        </Field>
      </section>

      <section className={sectionClass}>
        <h2 className="text-lg font-semibold text-white">Genres</h2>
        <Field label="Genres (comma-separated)" error={errors.genres?.message}>
          <input {...register("genres")} placeholder="Action, Adventure, Sci-Fi" className={inputClass} />
        </Field>
      </section>

      <section className={sectionClass}>
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-white">Characters</h2>
          <span className="text-xs text-slate-400">{fields.length}/50</span>
        </div>

        {fields.map((field, index) => (
          <div key={field.id} className="space-y-4 rounded-xl border border-white/10 p-4">
            <div className="flex justify-between">
              <span className="text-sm text-white">Character #{index + 1}</span>
              <button type="button" onClick={() => remove(index)} className="text-xs text-rose-400" disabled={isPending}>
                Delete
              </button>
            </div>

            <Field label="Name" error={errors.characters?.[index]?.characterName?.message}>
              <input {...register(`characters.${index}.characterName`)} placeholder="Tony Stark" className={inputClass} />
            </Field>

            <Field label="Photo URL" error={errors.characters?.[index]?.characterPhotoUrl?.message}>
              <input type="url" {...register(`characters.${index}.characterPhotoUrl`)} placeholder="https://example.com/photo.jpg" className={inputClass} />
            </Field>
          </div>
        ))}

        {(errors.characters?.root?.message ?? errors.characters?.message) && (
          <p role="alert" className="text-xs text-rose-400">
            {errors.characters?.root?.message ?? errors.characters?.message}
          </p>
        )}

        <button
          type="button"
          onClick={() => append({ characterName: "", characterPhotoUrl: "" })}
          disabled={fields.length >= 50 || isPending}
          className="w-full rounded-xl border border-dashed border-violet-500/40 p-3 text-sm text-violet-300 disabled:opacity-40"
        >
          + Add Character
        </button>
      </section>

      <div className="flex flex-col-reverse justify-between gap-3 border-t border-white/10 pt-6 sm:flex-row">
        <p className="text-xs text-slate-500">* Required Fields</p>
        <button
          type="submit"
          disabled={isPending || !isDirty}
          className="rounded-xl bg-violet-600 px-8 py-3 text-sm font-semibold text-white hover:bg-violet-500 disabled:opacity-50"
        >
          {isPending ? "Saving..." : "Create Movie"}
        </button>
      </div>
    </form>
  );
}
