import { createFileRoute } from "@tanstack/react-router";
import { Info } from "@/pages/Info";
export const Route = createFileRoute("/shipping-info")({
  head: () => ({
    meta: [
      { title: "Shipping Info | Marketto" },
      {
        name: "description",
        content: "Marketto shipping info. A little help for your everyday shopping.",
      },
      { property: "og:title", content: "Shipping Info | Marketto" },
      {
        property: "og:description",
        content: "Marketto shipping info. A little help for your everyday shopping.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Page,
});
function Page() {
  return <Info slug="shipping-info" />;
}
