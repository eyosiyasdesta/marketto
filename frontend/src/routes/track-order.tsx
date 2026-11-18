import { createFileRoute } from "@tanstack/react-router";
import { Info } from "@/pages/Info";
export const Route = createFileRoute("/track-order")({
  head: () => ({
    meta: [
      { title: "Track Order | Marketto" },
      {
        name: "description",
        content: "Marketto track order. A little help for your everyday shopping.",
      },
      { property: "og:title", content: "Track Order | Marketto" },
      {
        property: "og:description",
        content: "Marketto track order. A little help for your everyday shopping.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Page,
});
function Page() {
  return <Info slug="track-order" />;
}
