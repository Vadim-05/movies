import { AsyncState } from "../../../components/ui/async-state/AsyncState";
import { FeedbackModal } from "../../../components/ui/feedback-modal/FeedbackModal";
import { useCurrentUser } from "../../auth/hooks/useCurrentUser";
import { useProfileForm } from "../hooks/useProfileForm";
import type { AuthUser } from "../../auth/auth.types";
import { getProfileUpdateError } from "../profile.utils";
import { ProfileDetails } from "./ProfileDetails";
import { ProfileForm } from "./ProfileForm";

interface ProfileContentProps {
  user: AuthUser;
}

const MAIN_CLASS =
  "mx-auto w-full max-w-3xl px-4 py-6 sm:px-6 sm:py-10";

export function ProfilePage() {
  const { data: user, isPending, isError, refetch } = useCurrentUser();

  if (isPending) {
    return (
      <main className={MAIN_CLASS}>
        <AsyncState
          type="loading"
          message="Loading profile..."
        />
      </main>
    );
  }

  if (isError || !user) {
    return (
      <main className={MAIN_CLASS}>
        <AsyncState
          type="error"
          message="Failed to load profile."
          action={{
            label: "Try Again",
            onClick: () => void refetch(),
          }}
        />
      </main>
    );
  }

  return <ProfileContent user={user} />;
}

function ProfileContent({ user }: ProfileContentProps) {
  const profile = useProfileForm({ user });

  return (
    <main className={`${MAIN_CLASS} space-y-6`}>
      <header className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-white">
          About Me
        </h1>

        {!profile.isEditing && (
          <button
            type="button"
            onClick={profile.handleEdit}
            className="
              rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white 
              transition hover:bg-indigo-500 focus-visible:outline-none focus-visible:ring-2 
              focus-visible:ring-indigo-400 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-950
          ">
            Edit
          </button>
        )}
      </header>

      <section
        aria-label="Profile Information"
        className="rounded-2xl border border-white/10 bg-[#111827]/80 p-6"
      >
        {profile.isEditing ? (
          <ProfileForm
            values={profile.form}
            error={profile.validationError}
            isSaving={profile.isSaving}
            onChange={profile.handleChange}
            onSubmit={profile.handleSubmit}
            onCancel={profile.handleCancel}
          />
        ) : (
          <ProfileDetails user={user} />
        )}
      </section>

      <FeedbackModal
        open={profile.isFeedbackOpen}
        status={profile.isUpdateError ? "error" : "success"}
        title={
          profile.isUpdateError
            ? "An error occurred."
            : "Profile updated successfully!"
        }
        message={
          profile.isUpdateError
            ? getProfileUpdateError(profile.updateError)
            : "Your personal information has been saved successfully."
        }
        onClose={profile.handleCloseFeedback}
        onRetry={profile.handleRetry}
      />
    </main>
  );
}
