import {createRootRoute,Outlet} from "@tanstack/react-router";
import { NotFoundPage } from "../components/ui/not-found/NotFoundPage";
function RootLayout() {
  return (
    <div
      id="top"
      className="min-h-screen bg-[#09090d] text-white"
    >
      <Outlet />
    </div>
  );
}

function RootNotFound() {
  const isAdmin = sessionStorage.getItem("lastSection") === "admin";
  return <NotFoundPage isAdmin={isAdmin} />;
}

export const Route = createRootRoute({
  component: RootLayout,
  notFoundComponent: RootNotFound,
});
