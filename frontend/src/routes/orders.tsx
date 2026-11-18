import { createFileRoute } from "@tanstack/react-router";
import { Orders } from "@/pages/Commerce";
export const Route = createFileRoute("/orders")({
  head: () => ({
    meta: [
      { title: "Your orders | Marketto" },
      {
        name: "description",
        content: "Your orders. Discover and manage your favorite everyday finds at Marketto.",
      },
      { property: "og:title", content: "Your orders | Marketto" },
      {
        property: "og:description",
        content: "Your orders. Discover and manage your favorite everyday finds at Marketto.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Orders,
});
