import { useEffect, useRef, useState } from "react";
import { useGenres } from "../hooks/useGenres";

interface GenrePickerModalProps {
  open: boolean;
  initialGenreIds: number[];
  required?: boolean;
  isSaving?: boolean;
  saveError?: string | null;
  onConfirm: (genreIds: number[]) => void;
  onSkip: () => void;
}

export function GenrePickerModal({
  open,
  initialGenreIds,
  required = false,
  isSaving = false,
  saveError,
  onConfirm,
  onSkip,
}: GenrePickerModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [selected, setSelected] = useState(initialGenreIds);

  const { data: genres, isPending, isError } = useGenres({
    enabled: open,
  });

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (open && !dialog.open) {
      setSelected(initialGenreIds);
      dialog.showModal();
    } else if (!open && dialog.open) {
      dialog.close();
    }
  }, [open, initialGenreIds]);

  function handleCancel(event: React.SyntheticEvent<HTMLDialogElement>) {
    if (required || isSaving) {
      event.preventDefault();
      return;
    }

    onSkip();
  }

  function toggleGenre(id: number) {
    setSelected((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id],
    );
  }

  return (
    <dialog
      ref={dialogRef}
      onCancel={handleCancel}
      onClick={(event) => {
        if (event.target === event.currentTarget && !required && !isSaving) {
          onSkip();
        }
      }}
      className="
        fixed inset-0 m-auto w-[calc(100%-2rem)] max-w-xl
        max-h-[calc(100vh-2rem)] supports-[height:100dvh]:max-h-[calc(100dvh-2rem)]
        overflow-y-auto overscroll-contain
        rounded-3xl border border-white/10 bg-[#111318] p-6 text-white
        shadow-2xl backdrop:bg-black/80 backdrop:backdrop-blur-md sm:p-8
    ">
      <span className="text-xs font-bold uppercase tracking-widest text-purple-300">
        Personalize your experience
      </span>

      <h2 className="mt-4 text-3xl font-bold">
        Let's find yours.{" "}
        <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
          Next Movie
        </span>
      </h2>

      <p className="mb-6 mt-3 text-sm text-gray-400">
        Choose your favorite genres to get personalized recommendations.
      </p>

      <div className="mb-3 flex justify-between text-xs text-gray-400">
        <span>Selected Genres</span>
        <span>{selected.length} Selected</span>
      </div>

      <div className="min-h-36 rounded-2xl border border-white/10 bg-white/[0.03] p-4">
        {isPending ? (
          <p className="py-10 text-center text-gray-400">
            Loading genres...
          </p>
        ) : isError ? (
          <p role="alert" className="py-10 text-center text-red-400">
            Failed to load genres.
          </p>
        ) : !genres?.length ? (
          <p className="py-10 text-center text-gray-400">
            No genres available yet.
          </p>
        ) : (
          <div className="flex max-h-64 flex-wrap gap-2 overflow-y-auto">
            {genres.map(({ id, name }) => {
              const active = selected.includes(id);

              return (
                <button
                  key={id}
                  type="button"
                  disabled={isSaving}
                  aria-pressed={active}
                  onClick={() => toggleGenre(id)}
                  className={`rounded-xl border px-4 py-3 text-sm transition disabled:opacity-50 ${
                    active
                      ? "border-purple-400/60 bg-purple-600/30 text-white"
                      : "border-white/10 bg-white/[0.03] text-gray-300 hover:border-purple-400/40"
                  }`}
                >
                  {active && "✓ "}
                  {name}
                </button>
              );
            })}
          </div>
        )}
      </div>

      <p className="mt-3 text-xs text-gray-500">
        {selected.length
          ? `Genres Selected: ${selected.length}.`
          : "Please select at least one genre."}
      </p>

      {saveError && (
        <p role="alert" className="mt-3 text-sm text-red-400">
          {saveError}
        </p>
      )}

      <div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
        {!required && (
          <button
            type="button"
            disabled={isSaving}
            onClick={onSkip}
            className="rounded-xl px-5 py-3 text-sm text-gray-400 hover:bg-white/5 disabled:opacity-50"
          >
            Skip
          </button>
        )}

        <button
          type="button"
          disabled={isPending || isError || !genres?.length || !selected.length || isSaving}
          onClick={() => onConfirm(selected)}
          className="rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 px-7 py-3 text-sm font-bold disabled:opacity-40"
        >
          {isSaving ? "Saving..." : "Find Movies"}
        </button>
      </div>
    </dialog>
  );
}
