"use client";

import { ThemeProvider } from "next-themes";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "sonner";
import { useState, type ReactNode } from "react";

export function Providers({ children }: { children: ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000,
            refetchOnWindowFocus: false,
          },
        },
      }),
  );

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem={false}
      disableTransitionOnChange
    >
      <QueryClientProvider client={queryClient}>
        {children}
        <Toaster
          position="bottom-right"
          theme="dark"
          richColors
          closeButton
          toastOptions={{
            style: {
              background: "rgba(17, 17, 24, 0.9)",
              border: "1px solid rgba(255,255,255,0.08)",
              backdropFilter: "blur(16px)",
            },
          }}
        />
      </QueryClientProvider>
    </ThemeProvider>
  );
}
