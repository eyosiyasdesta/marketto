import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  createRootRouteWithContext,
  useRouterState,
} from "@tanstack/react-router";
import { StoreProvider } from "@/hooks/store";
import { Layout } from "@/components/store/Layout";
import { Toaster } from "@/components/ui/sonner";

const STANDALONE_PATHS = [
  "/contact",
  "/careers",
  "/faqs",
  "/returns-policy",
  "/shipping-info",
];

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  const pathname = useRouterState({
    select: (state) => state.location.pathname,
  });

  const isStandalone = STANDALONE_PATHS.includes(pathname);

  return (
    <QueryClientProvider client={queryClient}>
      <StoreProvider>
        {isStandalone ? (
          <Outlet />
        ) : (
          <Layout>
            <Outlet />
          </Layout>
        )}
        <Toaster position="bottom-right" />
      </StoreProvider>
    </QueryClientProvider>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()(
  {
    component: RootComponent,
    notFoundComponent: () => (
      <div className="container page empty">
        <h1>Page not found</h1>
        <p>The page you’re looking for isn’t here.</p>
        <a className="button" href="/">
          Back to Marketto
        </a>
      </div>
    ),
  },
);
