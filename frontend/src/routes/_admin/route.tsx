import {
  createFileRoute,
  Outlet,
  redirect,
} from "@tanstack/react-router";
import { useEffect } from "react";
import axios from "axios";
import { queryClient } from "../../lib/query-client";
import { currentUserQueryOptions } from "../../features/auth/auth.queries";

function AdminLayout() {
  useEffect(() => {
    sessionStorage.setItem("lastSection", "admin");
  }, []);
  return <Outlet />;
}

export const Route = createFileRoute("/_admin")({
  beforeLoad: async () => {
    let user;

    try {
      user = await queryClient.ensureQueryData(
        currentUserQueryOptions(),
      );
    } catch (error: unknown) {
      if (
        !axios.isAxiosError(error) ||
        error.response?.status !== 401
      ) {
        throw error;
      }
    }

    if (!user) {
      throw redirect({
        to: "/login",
      });
    }
  },

  component: AdminLayout,
});
