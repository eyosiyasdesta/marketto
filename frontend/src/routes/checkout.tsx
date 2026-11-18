import { createFileRoute } from "@tanstack/react-router";
import { Checkout } from "@/pages/Commerce";
export const Route = createFileRoute("/checkout")({
  head: () => ({
    meta: [
      { title: "Checkout | Marketto" },
      {
        name: "description",
        content:
          "Review your Marketto order and enter your shipping address. No payment is collected in this demo.",
      },
      { property: "og:title", content: "Checkout | Marketto" },
      {
        property: "og:description",
        content:
          "Review your Marketto order and enter your shipping address. No payment is collected in this demo.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Checkout,
});
