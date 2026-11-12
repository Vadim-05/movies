import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "@tanstack/react-router";
import { normalizeApiError } from "../../../lib/api-error";
import { loginSchema } from "../auth.schemas";
import type { LoginInput, LoginOutput } from "../auth.schemas";
import { useLogin } from "../hooks/useLogin";

const INPUT_CLASS_NAME = `
  block w-full rounded-xl border border-white/10
  bg-[#111827]/80 px-4 py-3.5 text-sm text-white
  placeholder:text-slate-500 outline-none transition
  hover:border-white/20
  focus:border-violet-400/70 focus:ring-4 focus:ring-violet-500/10
  aria-[invalid=true]:border-red-400/70
  disabled:cursor-not-allowed disabled:opacity-50
`;
const LABEL_CLASS_NAME = "mb-2 block text-sm font-medium text-slate-300";
const ERROR_CLASS_NAME = "mt-2 text-xs font-medium text-red-400";

export function LoginForm() {
  const navigate = useNavigate();
  const loginMutation = useLogin();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput, unknown, LoginOutput>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
    mode: "onTouched",
  });

  const isPending = loginMutation.isPending;

  function clearServerError() {
    if (loginMutation.isError) {
      loginMutation.reset();
    }
  }

  function onSubmit(values: LoginOutput) {
    loginMutation.mutate(values, {
      onSuccess: () => {
        void navigate({
          to: "/admin",
          search: {
            search: "",
            page: 1,
            genreIds: [],
          },
        });
      },
    });
  }

  const serverError = loginMutation.isError
    ? normalizeApiError(loginMutation.error).message
    : null;

  return (
    <form
      className="w-full"
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      aria-busy={isPending}
    >
      <div className="space-y-5">
        <div>
          <label htmlFor="login-email" className={LABEL_CLASS_NAME}>
            Email address
          </label>

          <input
            {...register("email", { onChange: clearServerError })}
            id="login-email"
            className={INPUT_CLASS_NAME}
            type="email"
            autoComplete="email"
            autoCapitalize="none"
            spellCheck={false}
            placeholder="you@example.com"
            disabled={isPending}
            aria-invalid={Boolean(errors.email)}
            aria-describedby={
              errors.email ? "login-email-error" : undefined
            }
          />

          {errors.email?.message && (
            <p id="login-email-error" className={ERROR_CLASS_NAME}>
              {errors.email.message}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="login-password" className={LABEL_CLASS_NAME}>
            Password
          </label>

          <input
            {...register("password", { onChange: clearServerError })}
            id="login-password"
            className={INPUT_CLASS_NAME}
            type="password"
            autoComplete="current-password"
            placeholder="Enter your password"
            disabled={isPending}
            aria-invalid={Boolean(errors.password)}
            aria-describedby={
              errors.password ? "login-password-error" : undefined
            }
          />

          {errors.password?.message && (
            <p id="login-password-error" className={ERROR_CLASS_NAME}>
              {errors.password.message}
            </p>
          )}
        </div>
      </div>

      {serverError && (
        <p
          className="mt-5 rounded-xl border border-red-400/20 bg-red-400/[0.07] p-4 text-sm text-red-300"
          role="alert"
        >
          {serverError}
        </p>
      )}

      <button
        type="submit"
        disabled={isPending}
        className="
          mt-7 flex w-full items-center justify-center gap-2 rounded-xl 
          bg-gradient-to-r from-violet-600 to-indigo-600 px-5 py-3.5 
          text-sm font-semibold text-white shadow-lg shadow-violet-950/30
          transition hover:-translate-y-0.5 hover:from-violet-500 
          hover:to-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 
          focus-visible:outline-violet-400 active:translate-y-0 
          disabled:cursor-not-allowed disabled:opacity-60
      ">
        {isPending ? (
          <>
            <span className="size-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
            Signing in...
          </>
        ) : (
          <>
            Sign in
            <span aria-hidden="true">→</span>
          </>
        )}
      </button>

      <div className="my-6 flex items-center gap-4">
        <div className="h-px flex-1 bg-white/10" />
        <span className="text-xs text-slate-500">NEW HERE?</span>
        <div className="h-px flex-1 bg-white/10" />
      </div>

      <p className="text-center text-sm text-slate-400">
        Don't have an account?{" "}
        <Link
          to="/register"
          className="
            font-semibold text-violet-400 transition hover:text-violet-300 
            focus-visible:outline-2 focus-visible:outline-offset-2 
            focus-visible:outline-violet-400
        ">
          Create account
        </Link>
      </p>
    </form>
  );
}
