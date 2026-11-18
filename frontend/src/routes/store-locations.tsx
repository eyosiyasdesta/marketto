import { createFileRoute } from "@tanstack/react-router";
import { Info } from "@/pages/Info";
export const Route = createFileRoute("/store-locations")({
  head: () => ({
    meta: [
      { title: "Store Locations | Marketto" },
      {
        name: "description",
        content: "Marketto store locations. A little help for your everyday shopping.",
      },
      { property: "og:title", content: "Store Locations | Marketto" },
      {
        property: "og:description",
        content: "Marketto store locations. A little help for your everyday shopping.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Page,
});
function Page() {
  return <Info slug="store-locations" />;
}
