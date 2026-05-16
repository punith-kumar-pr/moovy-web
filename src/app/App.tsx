import { useEffect } from "react";
import { RouterProvider } from "react-router-dom";
import { Providers } from "./providers";
import { router } from "./router";
import { useAuthStore } from "@/features/auth/auth-store";
import { useThemeStore } from "@/hooks/use-theme-store";

export default function App() {
  const hydrateAuth = useAuthStore((s) => s.hydrate);
  const hydrateTheme = useThemeStore((s) => s.hydrate);

  useEffect(() => {
    hydrateAuth();
    hydrateTheme();
  }, [hydrateAuth, hydrateTheme]);

  return (
    <Providers>
      <RouterProvider router={router} />
    </Providers>
  );
}
