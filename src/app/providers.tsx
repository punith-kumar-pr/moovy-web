import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "sonner";
import { useThemeStore } from "@/hooks/use-theme-store";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

export function Providers({ children }: { children: React.ReactNode }) {
  const { theme } = useThemeStore();

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <Toaster
        theme={theme}
        position="bottom-right"
        toastOptions={{
          style: {
            background: "hsl(var(--card))",
            border: "1px solid hsl(var(--border))",
            color: "hsl(var(--foreground))",
          },
        }}
        richColors
        closeButton
      />
    </QueryClientProvider>
  );
}
