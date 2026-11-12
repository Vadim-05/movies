
import { useEffect, useState } from "react";
import type { FormEvent } from "react";

import { useUpdateProfile } from "../../auth/hooks/useUpdateProfile";

import {
  createProfileUpdatePayload,
  getInitialProfileForm,
  validateProfileForm,
} from "../profile.utils";

import type { AuthUser } from "../../auth/auth.types";
import type { ProfileFormValues } from "../profile.types";

interface UseProfileFormOptions {
  user: AuthUser;
}

export function useProfileForm({ user }: UseProfileFormOptions) {
  const mutation = useUpdateProfile();

  const [isEditing, setIsEditing] = useState(false);

  const [form, setForm] = useState<ProfileFormValues>(() =>
    getInitialProfileForm(user),
  );

  const [validationError, setValidationError] = useState("");

  useEffect(() => {
    if (!isEditing) {
      setForm(getInitialProfileForm(user));
    }
  }, [user, isEditing]);

  function resetForm() {
    setForm(getInitialProfileForm(user));
    setValidationError("");
    mutation.reset();
  }

  function handleEdit() {
    resetForm();
    setIsEditing(true);
  }

  function handleCancel() {
    resetForm();
    setIsEditing(false);
  }

  function handleChange(field: keyof ProfileFormValues, value: string) {
    setForm((previous) => ({
      ...previous,
      [field]: value,
    }));

    setValidationError("");

    if (mutation.isError) {
      mutation.reset();
    }
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (mutation.isPending) return;

    const error = validateProfileForm(form, user);

    if (error) {
      setValidationError(error);
      return;
    }

    const payload = createProfileUpdatePayload(form, user);

    if (!payload) {
      setIsEditing(false);
      return;
    }

    setValidationError("");
    mutation.mutate(payload);
  }

  function handleRetry() {
    const payload = mutation.variables;

    if (!payload || mutation.isPending) return;

    mutation.mutate(payload);
  }

  function handleCloseFeedback() {
    mutation.reset();
    setValidationError("");
  }

  return {
    form,
    isEditing,
    isSaving: mutation.isPending,
    validationError,

    isFeedbackOpen: mutation.isSuccess || mutation.isError,
    isUpdateError: mutation.isError,
    updateError: mutation.error,

    handleEdit,
    handleCancel,
    handleChange,
    handleSubmit,
    handleRetry,
    handleCloseFeedback,
  };
}
