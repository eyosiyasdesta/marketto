import { createFileRoute } from "@tanstack/react-router";
import { Wishlist } from "@/pages/Catalog";
export const Route = createFileRoute("/wishlist")({
  head: () => ({
    meta: [
      { title: "Your wishlist | Marketto" },
      {
        name: "description",
        content: "Your wishlist. Discover and manage your favorite everyday finds at Marketto.",
      },
      { property: "og:title", content: "Your wishlist | Marketto" },
      {
        property: "og:description",
        content: "Your wishlist. Discover and manage your favorite everyday finds at Marketto.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Wishlist,
});
