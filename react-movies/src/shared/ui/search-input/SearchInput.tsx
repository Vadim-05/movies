type Props = {
  value: string;
  onChange: (value: string) => void;
};

export function SearchInput({ value, onChange }: Props) {
  return (
    <input
      type="search"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder="Search movies..."
      className="w-full max-w-md rounded border px-3 py-2"
    />
  );
}