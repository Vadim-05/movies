
const DEFAULT_DATE_OPTIONS: Intl.DateTimeFormatOptions = {
  year: "numeric",
  month: "short",
  day: "numeric",
};

export function formatReleaseDate(
  value: string | null,
  options: Intl.DateTimeFormatOptions = DEFAULT_DATE_OPTIONS,
): string | null {
  if (!value) return null;

  const dateValue = value.slice(0, 10);

  if (!/^\d{4}-\d{2}-\d{2}$/.test(dateValue)) {
    return null;
  }

  const [year, month, day] = dateValue.split("-").map(Number);

  const date = new Date(Date.UTC(year, month - 1, day));

  if (
    date.getUTCFullYear() !== year ||
    date.getUTCMonth() !== month - 1 ||
    date.getUTCDate() !== day
  ) {
    return null;
  }

  return new Intl.DateTimeFormat("uk-UA", {
    ...options,
    timeZone: "UTC",
  }).format(date);
}
