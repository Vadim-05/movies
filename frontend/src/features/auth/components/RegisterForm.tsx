import { Link } from "@tanstack/react-router";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { normalizeApiError } from "../../../lib/api-error";
import { registerSchema } from "../auth.schemas";
import type { RegisterInput, RegisterOutput } from "../auth.schemas";
import { useRegister } from "../hooks/useRegister";

const INPUT_CLASS_NAME = [
  "block w-full rounded-xl border border-white/10",
  "bg-[#111827]/80 px-4 py-3.5 text-sm text-white",
  "placeholder:text-slate-500 outline-none transition",
  "hover:border-white/20",
  "focus:border-violet-400/70 focus:ring-4 focus:ring-violet-500/10",
  "aria-[invalid=true]:border-red-400/70",
  "aria-[invalid=true]:focus:ring-red-500/10",
  "disabled:cursor-not-allowed disabled:opacity-50",
].join(" ");

const LABEL_CLASS_NAME = "mb-2 block text-sm font-medium text-slate-300";
const ERROR_CLASS_NAME = "mt-2 text-xs font-medium text-red-400";
const HINT_CLASS_NAME = "mt-2 text-xs text-slate-500";

const BUTTON_CLASS_NAME = [
  "mt-7 flex w-full items-center justify-center gap-2",
  "rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600",
  "px-5 py-3.5 text-sm font-semibold text-white",
  "shadow-lg shadow-violet-950/30 transition",
  "hover:-translate-y-0.5 hover:from-violet-500 hover:to-indigo-500",
  "hover:shadow-xl hover:shadow-violet-950/40",
  "focus-visible:outline-2 focus-visible:outline-offset-2",
  "focus-visible:outline-violet-400",
  "active:translate-y-0",
  "disabled:cursor-not-allowed disabled:opacity-60",
  "disabled:hover:translate-y-0",
].join(" ");

function getDescribedBy(
  errorId?: string,
  hintId?: string,
) {
  return [errorId, hintId].filter(Boolean).join(" ") || undefined;
}

export function RegisterForm() {
  const registerMutation = useRegister();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterInput, unknown, RegisterOutput>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: "",
      password: "",
      username: "",
      name: "",
    },
    mode: "onTouched",
  });

  const isPending = registerMutation.isPending;
  const isSuccess = registerMutation.isSuccess;

  function clearServerError() {
    if (registerMutation.isError) {
      registerMutation.reset();
    }
  }

  function onSubmit(values: RegisterOutput) {
    registerMutation.mutate(values);
  }

  const serverError = registerMutation.isError
    ? normalizeApiError(registerMutation.error).message
    : null;

  if (isSuccess) {
    return (
      <div className="py-4 text-center" role="status">
        <div className="
          mx-auto mb-5 flex size-16 items-center justify-center rounded-2xl 
          border border-emerald-400/20 bg-emerald-400/10 text-emerald-400
        ">
          <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            fill="none"
            className="size-8"
          >
            <path
              d="m5 12 4.5 4.5L19 7"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        <h2 className="text-2xl font-bold tracking-tight text-white">
          Account created!
        </h2>

        <p className="mt-3 text-sm leading-6 text-slate-400">
          Your account has been created successfully. You can now sign in
          and start exploring movies.
        </p>

        <Link
          to="/login"
          className="
            mt-7 flex w-full items-center justify-center gap-2 rounded-xl 
            bg-gradient-to-r from-violet-600 to-indigo-600 px-5 py-3.5 
            text-sm font-semibold text-white shadow-lg shadow-violet-950/30 
            transition hover:-translate-y-0.5 hover:from-violet-500 
            hover:to-indigo-500 focus-visible:outline-2 
            focus-visible:outline-offset-2 focus-visible:outline-violet-400
        ">
          Continue to sign in
          <span aria-hidden="true">→</span>
        </Link>
      </div>
    );
  }

  return (
    <form
      className="w-full"
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      aria-busy={isPending}
    >
      <div className="space-y-5">
        <div>
          <label htmlFor="register-email" className={LABEL_CLASS_NAME}>
            Email address
          </label>

          <input
            {...register("email", { onChange: clearServerError })}
            id="register-email"
            className={INPUT_CLASS_NAME}
            type="email"
            autoComplete="email"
            autoCapitalize="none"
            spellCheck={false}
            placeholder="you@example.com"
            disabled={isPending}
            aria-invalid={Boolean(errors.email)}
            aria-describedby={getDescribedBy(
              errors.email ? "register-email-error" : undefined,
            )}
          />

          {errors.email?.message && (
            <p id="register-email-error" className={ERROR_CLASS_NAME}>
              {errors.email.message}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="register-password" className={LABEL_CLASS_NAME}>
            Password
          </label>

          <input
            {...register("password", { onChange: clearServerError })}
            id="register-password"
            className={INPUT_CLASS_NAME}
            type="password"
            autoComplete="new-password"
            placeholder="At least 12 characters"
            disabled={isPending}
            required
            aria-invalid={Boolean(errors.password)}
            aria-describedby={getDescribedBy(
              errors.password ? "register-password-error" : undefined,
              "register-password-hint",
            )}
          />

          {errors.password?.message && (
            <p id="register-password-error" className={ERROR_CLASS_NAME}>
              {errors.password.message}
            </p>
          )}

          <p id="register-password-hint" className={HINT_CLASS_NAME}>
            Use at least 12 characters.
          </p>
        </div>

        <div>
          <label htmlFor="register-username" className={LABEL_CLASS_NAME}>
            Username
            <span className="ml-2 text-xs font-normal text-slate-500">
              Optional
            </span>
          </label>

          <input
            {...register("username", { onChange: clearServerError })}
            id="register-username"
            className={INPUT_CLASS_NAME}
            type="text"
            autoComplete="username"
            autoCapitalize="none"
            spellCheck={false}
            placeholder="your_username"
            disabled={isPending}
            aria-invalid={Boolean(errors.username)}
            aria-describedby={getDescribedBy(
              errors.username ? "register-username-error" : undefined,
              "register-username-hint",
            )}
          />

          {errors.username?.message && (
            <p id="register-username-error" className={ERROR_CLASS_NAME}>
              {errors.username.message}
            </p>
          )}

          <p id="register-username-hint" className={HINT_CLASS_NAME}>
            3–30 characters: lowercase letters, numbers and underscores.
          </p>
        </div>

        <div>
          <label htmlFor="register-name" className={LABEL_CLASS_NAME}>
            Your name
            <span className="ml-2 text-xs font-normal text-slate-500">
              Optional
            </span>
          </label>

          <input
            {...register("name", { onChange: clearServerError })}
            id="register-name"
            className={INPUT_CLASS_NAME}
            type="text"
            autoComplete="name"
            placeholder="John Doe"
            disabled={isPending}
            aria-invalid={Boolean(errors.name)}
            aria-describedby={getDescribedBy(
              errors.name ? "register-name-error" : undefined,
            )}
          />

          {errors.name?.message && (
            <p id="register-name-error" className={ERROR_CLASS_NAME}>
              {errors.name.message}
            </p>
          )}
        </div>
      </div>

      {serverError && (
        <p
          className="mt-5 rounded-xl border border-red-400/20 bg-red-400/[0.07] p-4 text-sm leading-6 text-red-300"
          role="alert"
        >
          {serverError}
        </p>
      )}

      <button
        type="submit"
        disabled={isPending}
        className={BUTTON_CLASS_NAME}
      >
        {isPending ? (
          <>
            <span
              aria-hidden="true"
              className="size-5 animate-spin rounded-full border-2 border-white/30 border-t-white"
            />
            Creating account...
          </>
        ) : (
          <>
            Create account
            <span aria-hidden="true">→</span>
          </>
        )}
      </button>

      <div className="my-6 flex items-center gap-4">
        <div className="h-px flex-1 bg-white/10" />
        <span className="text-xs text-slate-500">ALREADY A MEMBER?</span>
        <div className="h-px flex-1 bg-white/10" />
      </div>

      <p className="text-center text-sm text-slate-400">
        Already have an account?{" "}
        <Link
          to="/login"
          className="
            font-semibold text-violet-400 transition hover:text-violet-300 
            focus-visible:rounded-sm focus-visible:outline-2 
            focus-visible:outline-offset-2 focus-visible:outline-violet-400
        ">
          Sign in
        </Link>
      </p>
    </form>
  );
}
