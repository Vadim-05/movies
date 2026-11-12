import type { AuthUser } from "../../auth/auth.types";

interface ProfileDetailsProps {
  user: AuthUser;
}

export function ProfileDetails({ user }: ProfileDetailsProps) {
  return (
    <div className="space-y-6">
      <ProfileField label="Username" value={user.username} />
      <ProfileField label="Name" value={user.name} />
      <ProfileField label="Email" value={user.email} />
    </div>
  );
}

interface ProfileFieldProps {
  label: string;
  value: string | null;
}

function ProfileField({ label, value }: ProfileFieldProps) {
  return (
    <div className="space-y-1">
      <p className="text-sm text-slate-400">{label}</p>

      <p className="break-all text-white">
        {value || "Not specified"}
      </p>
    </div>
  );
}