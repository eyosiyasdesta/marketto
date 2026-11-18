import { createFileRoute } from "@tanstack/react-router";
import { Account } from "@/pages/Account";
export const Route = createFileRoute("/account")({
  head: () => ({
    meta: [
      { title: "Your account | Marketto" },
      {
        name: "description",
        content: "Your account. Discover and manage your favorite everyday finds at Marketto.",
      },
      { property: "og:title", content: "Your account | Marketto" },
      {
        property: "og:description",
        content: "Your account. Discover and manage your favorite everyday finds at Marketto.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Account,
});
