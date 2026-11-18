import { createFileRoute } from "@tanstack/react-router";
import { Account } from "@/pages/Account";
export const Route = createFileRoute("/register")({
  head: () => ({
    meta: [
      { title: "Create your account | Marketto" },
      {
        name: "description",
        content:
          "Create your account. Discover and manage your favorite everyday finds at Marketto.",
      },
      { property: "og:title", content: "Create your account | Marketto" },
      {
        property: "og:description",
        content:
          "Create your account. Discover and manage your favorite everyday finds at Marketto.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Page,
});
function Page() {
  return <Account initialMode="register" />;
}
