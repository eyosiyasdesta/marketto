import { createFileRoute } from "@tanstack/react-router";
import { Catalog } from "@/pages/Catalog";
export const Route = createFileRoute("/products/")({
  validateSearch: (search: Record<string, unknown>): { category?: string; q?: string } => ({
    ...(typeof search["category"] === "string" ? { category: search["category"] } : {}),
    ...(typeof search["q"] === "string" ? { q: search["q"] } : {}),
  }),
  head: () => ({
    meta: [
      { title: "The collection | Marketto" },
      {
        name: "description",
        content: "The collection. Discover and manage your favorite everyday finds at Marketto.",
      },
      { property: "og:title", content: "The collection | Marketto" },
      {
        property: "og:description",
        content: "The collection. Discover and manage your favorite everyday finds at Marketto.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Page,
});
function Page() {
  const search = Route.useSearch();
  return <Catalog key={`${search.category}-${search.q}`} search={search} />;
}
