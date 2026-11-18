import { createFileRoute } from "@tanstack/react-router";
import { Info } from "@/pages/Info";
export const Route = createFileRoute("/returns-policy")({
  head: () => ({
    meta: [
      { title: "Returns Policy | Marketto" },
      {
        name: "description",
        content: "Marketto returns policy. A little help for your everyday shopping.",
      },
      { property: "og:title", content: "Returns Policy | Marketto" },
      {
        property: "og:description",
        content: "Marketto returns policy. A little help for your everyday shopping.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Page,
});
function Page() {
  return <Info slug="returns-policy" />;
}
