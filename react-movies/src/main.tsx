import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import "@/index.css";
import App from "@/app/App";
import { ModalProvider } from "@/shared/modal/ModalProvider";
import { ModalRenderer } from "@/shared/modal/ModalRenderer";

const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <ModalProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
        <ModalRenderer />
      </ModalProvider>
    </QueryClientProvider>
  </StrictMode>
);