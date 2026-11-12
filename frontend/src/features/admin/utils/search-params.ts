export const MAX_SEARCH_LENGTH = 100;

export interface AdminSearchParams {
  search?: string;
  page?: number;
  showGenrePicker?: boolean;
  genreIds?: number[];
}

export function validateAdminSearch(
  params: Record<string, unknown>,
): AdminSearchParams {
  const result: AdminSearchParams = {};

  if (typeof params.search === "string") {
    const search = params.search.trim().slice(0, MAX_SEARCH_LENGTH);

    if (search) result.search = search;
  }

  const page = Number(params.page);

  if (
    params.page !== undefined &&
    Number.isSafeInteger(page) &&
    page > 1
  ) {
    result.page = page;
  }

  if (params.showGenrePicker === true) {
    result.showGenrePicker = true;
  }

  if (Array.isArray(params.genreIds)) {
    const genreIds = [
      ...new Set(
        params.genreIds.filter(
          (id): id is number =>
            typeof id === "number" &&
            Number.isSafeInteger(id) &&
            id > 0,
        ),
      ),
    ].sort((a, b) => a - b);

    if (genreIds.length) result.genreIds = genreIds;
  }

  return result;
}
