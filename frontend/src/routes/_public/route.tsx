import { createFileRoute, Outlet } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { Header } from "../../components/layout/Header";
import { Footer } from "../../components/layout/Footer";
import { useLogout } from "../../features/auth/hooks/useLogout";

export const Route = createFileRoute("/_public")({
  component: PublicLayout,
});

function PublicLayout() {
  const { mutate: logout } = useLogout();
  const logoutStarted = useRef(false);

  const [isReady, setIsReady] = useState(
    () => sessionStorage.getItem("lastSection") !== "admin",
  );

  useEffect(() => {
    if (isReady) {
      sessionStorage.setItem("lastSection", "public");
      return;
    }

    if (logoutStarted.current) return;
    logoutStarted.current = true;

    logout(undefined, {
      onSettled: () => {
        sessionStorage.setItem("lastSection", "public");
        setIsReady(true);
      },
    });
  }, [isReady, logout]);

  if (!isReady) return null;

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main id="main-content" className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
