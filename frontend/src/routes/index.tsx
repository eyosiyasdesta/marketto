import { createFileRoute } from "@tanstack/react-router";
import { Home } from "@/pages/Home";
export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Marketto — Good things for your everyday" },
      {
        name: "description",
        content:
          "Discover thoughtfully chosen electronics, clothing, home essentials, books, and accessories. Good finds. Better living.",
      },
      { property: "og:title", content: "Marketto — Good things for your everyday" },
      {
        property: "og:description",
        content:
          "Discover thoughtfully chosen electronics, clothing, home essentials, books, and accessories. Good finds. Better living.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Home,
});
