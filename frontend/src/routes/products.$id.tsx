import { createFileRoute } from "@tanstack/react-router";
import { ProductDetail } from "@/pages/Catalog";
export const Route = createFileRoute("/products/$id")({
  head: () => ({
    meta: [
      { title: "Thoughtfully chosen essentials | Marketto" },
      {
        name: "description",
        content:
          "Explore product details, choose your favorite option, and add a considered essential to your Marketto bag.",
      },
      { property: "og:title", content: "Thoughtfully chosen essentials | Marketto" },
      {
        property: "og:description",
        content:
          "Explore product details, choose your favorite option, and add a considered essential to your Marketto bag.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Page,
});
function Page() {
  const { id } = Route.useParams();
  return <ProductDetail key={id} id={id} />;
}
