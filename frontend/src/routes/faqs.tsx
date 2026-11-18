import { createFileRoute } from "@tanstack/react-router";
import { Info } from "@/pages/Info";
export const Route = createFileRoute("/faqs")({
  head: () => ({
    meta: [
      { title: "Faqs | Marketto" },
      { name: "description", content: "Marketto faqs. A little help for your everyday shopping." },
      { property: "og:title", content: "Faqs | Marketto" },
      {
        property: "og:description",
        content: "Marketto faqs. A little help for your everyday shopping.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Page,
});
function Page() {
  return <Info slug="faqs" />;
}
