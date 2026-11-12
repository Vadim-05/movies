import { useNavigate, useLocation } from "@tanstack/react-router";
import { useLogout } from "../../auth/hooks/useLogout";

const PAGE_TITLES: Record<string, string> = {
  "/admin": "Recommended",
  "/admin/add-movie": "Add Movie",
  "/admin/favorites": "Favorite Movies",
  "/admin/all-movies": "All Movies",
  "/admin/profil": "Profile",
};

export function AdminHeader() {
  const navigate = useNavigate();

  const pathname = useLocation({
    select: (location) => location.pathname,
  });

  const logoutMutation = useLogout();

  const title =
    PAGE_TITLES[pathname] ??
    (pathname.startsWith("/admin/movies/")
      ? "Movie Information"
      : "Admin Panel");

  function handleLogout(): void {
    logoutMutation.mutate(undefined, {
      onSuccess: () => {
        sessionStorage.setItem("lastSection", "public");
        void navigate({
          to: "/",
          search: {
            search: "",
            page: 1,
          },
        });
      },
    });
  }

  return (
    <header
      className="
        sticky top-0 z-20 flex min-h-16 items-center justify-between
        gap-3 border-b border-white/10 bg-[#0b0f19]/95 px-4 py-3
        backdrop-blur sm:min-h-20 sm:px-6 lg:px-8
      "
    >
      <div className="min-w-0">
        <h1 className="truncate text-lg font-semibold text-white sm:text-xl">
          {title}
        </h1>

        <p className="mt-1 hidden text-xs text-gray-500 sm:block">
          Manage MovieApp
        </p>
      </div>

      <button
        type="button"
        onClick={handleLogout}
        disabled={logoutMutation.isPending}
        className="
          shrink-0 rounded-lg border border-white/10 px-3 py-2
          text-sm font-medium text-gray-300 transition
          hover:border-red-500/30 hover:bg-red-500/10
          hover:text-red-400 focus-visible:outline-none
          focus-visible:ring-2 focus-visible:ring-red-500
          disabled:cursor-not-allowed disabled:opacity-50 sm:px-4 sm:py-2.5
        "
      >
        {logoutMutation.isPending ? "Sign Out..." : "Log Out"}
      </button>
    </header>
  );
}