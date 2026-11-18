import { createFileRoute } from "@tanstack/react-router";
import { Account } from "@/pages/Account";
export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Sign in | Marketto" },
      {
        name: "description",
        content: "Sign in. Discover and manage your favorite everyday finds at Marketto.",
      },
      { property: "og:title", content: "Sign in | Marketto" },
      {
        property: "og:description",
        content: "Sign in. Discover and manage your favorite everyday finds at Marketto.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Account,
});
