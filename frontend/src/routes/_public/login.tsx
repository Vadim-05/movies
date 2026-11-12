import { createFileRoute } from "@tanstack/react-router";

import { AuthLayout } from "../../features/auth/components/AuthLayout";
import { LoginForm } from "../../features/auth/components/LoginForm";

export const Route = createFileRoute("/_public/login")({
  component: LoginPage,
});

function LoginPage() {
  return (
    <AuthLayout
      titleId="login-title"
      badge="Welcome back"
      title="Sign in"
      description="Sign in to continue exploring your favorite movies."
      footer="Your next favorite movie is waiting."
    >
      <LoginForm />
    </AuthLayout>
  );
}