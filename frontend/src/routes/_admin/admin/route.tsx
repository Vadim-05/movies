import { createFileRoute } from "@tanstack/react-router";

import { AdminLayout } from "../../../features/admin/components/AdminLayout";

export const Route = createFileRoute("/_admin/admin")({
  component: AdminLayout,
});