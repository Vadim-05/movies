import { useReplaceUserGenres } from "../hooks/useReplaceUserGenres";
import { GenrePickerModal } from "./GenrePickerModal";

interface GenrePickerProps {
  userId: number;
  savedGenreIds: number[];
  isGenresConfigured: boolean;
  showGenrePicker: boolean;
  openGenrePicker: () => void;
  closeGenrePicker: () => void;
  updateSearch: (
    updates: { page?: number },
    replace?: boolean,
  ) => Promise<void>;
}

export function GenrePicker({
  userId,
  savedGenreIds,
  isGenresConfigured,
  showGenrePicker,
  openGenrePicker,
  closeGenrePicker,
  updateSearch,
}: GenrePickerProps) {
  const mutation = useReplaceUserGenres();
  const isRequired = !isGenresConfigured;

  function handleConfirm(genreIds: number[]) {
    if (!genreIds.length || mutation.isPending) return;

    mutation.mutate(
      { userId, genreIds },
      {
        onSuccess: () => {
          closeGenrePicker();
          void updateSearch({ page: 1 }, true);
        },
      },
    );
  }

  function handleClose() {
    if (isRequired || mutation.isPending) return;

    closeGenrePicker();
  }

  return (
    <>
      <button
        type="button"
        onClick={openGenrePicker}
        className="rounded-xl border border-white/10 px-4 py-2 text-sm font-semibold text-gray-200"
      >
        Select Genres
      </button>

      <GenrePickerModal
        open={isRequired || showGenrePicker}
        initialGenreIds={savedGenreIds}
        required={isRequired}
        isSaving={mutation.isPending}
        saveError={
          mutation.isError
            ? "Couldn't save genres. Please try again."
            : null
        }
        onConfirm={handleConfirm}
        onSkip={handleClose}
      />
    </>
  );
}