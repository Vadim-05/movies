import { Link } from "@tanstack/react-router";

const navigation = [
  { label: "Recommended", to: "/admin" },
  { label: "Add Movie", to: "/admin/add-movie" },
  { label: "Favorite Movies", to: "/admin/favorites" },
  { label: "All Movies", to: "/admin/all-movies" },
  { label: "Profile", to: "/admin/profile" },
] as const;

const linkClassName =
  "flex shrink-0 items-center rounded-lg px-4 py-3 text-sm font-medium transition-colors";

const activeProps = {
  className: `${linkClassName} bg-white/10 text-white`,
};

const inactiveProps = {
  className: `${linkClassName} text-gray-400 hover:bg-white/5 hover:text-white`,
};

export function AdminSidebar() {
  return (
    <aside className="
      w-full shrink-0 border-b border-white/10 bg-[#0b0f19] p-3 sm:p-4 md:sticky
      md:top-0 md:h-screen md:w-64 md:border-b-0 md:border-r md:p-5
    ">
      <Link
        to="/admin"
        activeOptions={{ exact: true }}
        className="mb-4 hidden text-xl font-bold md:mb-10 md:block"
      >
        MovieApp <span className="text-red-500">Admin</span>
      </Link>

      <nav
        aria-label="Навігація адміністратора"
        className="flex gap-2 overflow-x-auto pb-1 md:flex-col md:overflow-visible md:pb-0"
      >
        {navigation.map((item) => (
          <Link
            key={item.to}
            to={item.to}
            activeOptions={
              item.to === "/admin" ? { exact: true } : undefined
            }
            activeProps={activeProps}
            inactiveProps={inactiveProps}
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
