import { createFileRoute } from "@tanstack/react-router";
import { Info } from "@/pages/Info";
export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact | Marketto" },
      {
        name: "description",
        content: "Marketto contact. A little help for your everyday shopping.",
      },
      { property: "og:title", content: "Contact | Marketto" },
      {
        property: "og:description",
        content: "Marketto contact. A little help for your everyday shopping.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Page,
});
function Page() {
  return <Info slug="contact" />;
}
