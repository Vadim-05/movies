import type { FormEvent } from "react";
import type { ProfileFormValues } from "../profile.types";

interface ProfileFormProps {
  values: ProfileFormValues;
  error: string;
  isSaving: boolean;
  onChange: (field: keyof ProfileFormValues, value: string) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onCancel: () => void;
}

export function ProfileForm({
  values,
  error,
  isSaving,
  onChange,
  onSubmit,
  onCancel,
}: ProfileFormProps) {
  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <div className="space-y-2">
        <label
          htmlFor="username"
          className="block text-sm font-medium text-slate-300"
        >
          Username
        </label>

        <input
          id="username"
          name="username"
          type="text"
          value={values.username}
          onChange={(event) => onChange("username", event.target.value)}
          maxLength={30}
          autoComplete="username"
          disabled={isSaving}
          className="
            w-full rounded-lg border border-white/10 bg-[#0f172a] px-4 py-3 
            text-white outline-none transition placeholder:text-slate-500 
            focus:border-indigo-500 disabled:opacity-50
          "
          placeholder="Enter username"
        />
      </div>

      <div className="space-y-2">
        <label
          htmlFor="name"
          className="block text-sm font-medium text-slate-300"
        >
          Name
        </label>

        <input
          id="name"
          name="name"
          type="text"
          value={values.name}
          onChange={(event) => onChange("name", event.target.value)}
          maxLength={80}
          autoComplete="name"
          disabled={isSaving}
          className="
            w-full rounded-lg border border-white/10 bg-[#0f172a]
            px-4 py-3 text-white outline-none transition placeholder:text-slate-500 
            focus:border-indigo-500 disabled:opacity-50
          "
          placeholder="Enter name"
        />
      </div>

      <div className="space-y-2">
        <label
          htmlFor="email"
          className="block text-sm font-medium text-slate-300"
        >
          Email
        </label>

        <input
          id="email"
          name="email"
          type="email"
          value={values.email}
          onChange={(event) => onChange("email", event.target.value)}
          maxLength={254}
          autoComplete="email"
          disabled={isSaving}
          className="
            w-full rounded-lg border border-white/10 bg-[#0f172a] 
            px-4 py-3 text-white outline-none transition placeholder:text-slate-500 
            focus:border-indigo-500 disabled:opacity-50
          "
          placeholder="Enter email address"
        />
      </div>

      {error && (
        <p
          role="alert"
          className="rounded-lg border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-400"
        >
          {error}
        </p>
      )}

      <div className="flex flex-wrap gap-3 pt-2">
        <button
          type="submit"
          disabled={isSaving}
          className="
            rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white transition 
            hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-50
        ">
          {isSaving ? "Saving..." : "Save"}
        </button>

        <button
          type="button"
          onClick={onCancel}
          disabled={isSaving}
          className="
            rounded-lg border border-white/10 px-5 py-2.5 text-sm 
            font-medium text-slate-300 transition hover:bg-white/5 
            disabled:cursor-not-allowed disabled:opacity-50\
        ">
          Cancel
        </button>
      </div>
    </form>
  );
}