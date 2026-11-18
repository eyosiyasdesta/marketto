import { createFileRoute } from "@tanstack/react-router";
import { Cart } from "@/pages/Commerce";
export const Route = createFileRoute("/cart")({
  head: () => ({
    meta: [
      { title: "Your shopping bag | Marketto" },
      {
        name: "description",
        content: "Your shopping bag. Discover and manage your favorite everyday finds at Marketto.",
      },
      { property: "og:title", content: "Your shopping bag | Marketto" },
      {
        property: "og:description",
        content: "Your shopping bag. Discover and manage your favorite everyday finds at Marketto.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Cart,
});
