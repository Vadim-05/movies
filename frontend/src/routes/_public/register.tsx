import { createFileRoute } from "@tanstack/react-router";
import { AuthLayout } from "../../features/auth/components/AuthLayout";
import { RegisterForm } from "../../features/auth/components/RegisterForm";

export const Route = createFileRoute("/_public/register")({
  component: RegisterPage,
});

function RegisterPage() {
  return (
    <AuthLayout
      titleId="register-title"
      badge="Start your journey"
      title="Create account"
      description="Join our community and discover movies worth watching."
      footer="Your next favorite movie is waiting."
    >
      <RegisterForm />
    </AuthLayout>
  );
}