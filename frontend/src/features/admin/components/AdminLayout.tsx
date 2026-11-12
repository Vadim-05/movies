import { Outlet } from "@tanstack/react-router";
import { AdminHeader } from "./AdminHeader";
import { AdminSidebar } from "./AdminSidebar";

export function AdminLayout() {
  return (
    <div className="min-h-screen bg-[#0b0f19] text-white">
      <div className="mx-auto flex min-h-screen max-w-[1440px] flex-col md:flex-row">
        <AdminSidebar />

        <div className="flex min-w-0 flex-1 flex-col">
          <AdminHeader />

          <main
            id="admin-main-content"
            className="flex-1 p-4 sm:p-6 lg:p-8"
          >
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}
