import { Link } from "@tanstack/react-router";
import { useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Mail,
  MapPin,
  Clock,
  Package,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { getOrders } from "@/api";
import { useStore } from "@/hooks/store";
import { toast } from "sonner";
export const infoContent = {
  contact: {
    title: "A real person. A little help.",
    eyebrow: "CONTACT MARKETTO",
    description:
      "Questions about your order or a good find? We’re here for you.",
  },
  "store-locations": {
    title: "A little closer to you.",
    eyebrow: "STORE LOCATIONS",
    description: "Thoughtful finds are currently available exclusively online.",
  },
  careers: {
    title: "Good things start with good people.",
    eyebrow: "CAREERS AT MARKETTO",
    description: "Help us make the everyday a little better.",
  },
  faqs: {
    title: "A few good answers.",
    eyebrow: "FREQUENTLY ASKED QUESTIONS",
    description: "The little things you might be wondering.",
  },
  "returns-policy": {
    title: "Love it. Or send it back.",
    eyebrow: "RETURNS POLICY",
    description: "A little peace of mind with every purchase.",
  },
  "shipping-info": {
    title: "Good things, on their way.",
    eyebrow: "SHIPPING INFORMATION",
    description: "From our collection to your doorstep.",
  },
  "track-order": {
    title: "Where’s your good find?",
    eyebrow: "TRACK YOUR ORDER",
    description: "Keep up with your latest Marketto order.",
  },
};
const faqs = [
  [
    "How much is shipping?",
    "Standard shipping is $6.99. Shipping is free on orders of $75 or more.",
  ],
  [
    "How long does delivery take?",
    "Delivery timing depends on the item and destination. Check the order status in Your orders for the latest update.",
  ],
  [
    "Can I return an item?",
    "Our sample policy accepts unused items in their original packaging within 30 days of delivery. Contact us before returning an item.",
  ],
  [
    "How do I place an order?",
    "Add your favorites to your bag, create a Marketto account, and enter your shipping address at checkout. Online payment is not available yet.",
  ],
  [
    "How can I find my order?",
    "Sign in to the account you used at checkout and visit Your orders or Track order.",
  ],
];
export function Info({ slug }) {
  const content = infoContent[slug];
  const { user } = useStore();
  const [result, setResult] = useState(null),
    [error, setError] = useState(""),
    [busy, setBusy] = useState(false);
  return (
    <div className="container page info-page">
      <Button
        variant="outline"
        type="button"
        onClick={() => {
          window.close();
          window.location.replace("/");
        }}
      >
        <ArrowLeft />
        Back to Marketto
      </Button>
      <div className="page-heading">
        <span className="eyebrow">{content.eyebrow}</span>
        <h1>{content.title}</h1>
        <p>{content.description}</p>
      </div>
      <div className="info-body">
        {slug === "contact" && (
          <div className="contact-grid">
            <section>
              <Mail size={28} />
              <h2>Let’s talk.</h2>
              <p>Send us a note and our team will be happy to help.</p>
              <p className="demo-notice">
                This is a sample contact form; no message is sent.
              </p>
              <div className="contact-fact">
                <Clock size={18} />
                Monday–Friday, 9am–5pm (sample hours)
              </div>
            </section>
            <form
              className="address-form"
              onSubmit={(e) => {
                e.preventDefault();
                toast.success("Demo message received. No email was sent.");
                e.currentTarget.reset();
              }}
            >
              <label>
                Your name
                <input name="name" required />
              </label>
              <label>
                Email address
                <input type="email" name="email" required />
              </label>
              <label>
                Your message
                <textarea name="message" rows="5" required />
              </label>
              <Button type="submit">
                Send message
                <ArrowRight />
              </Button>
            </form>
          </div>
        )}
        {slug === "store-locations" && (
          <section className="info-prose">
            <MapPin size={35} />
            <h2>Find us online, wherever you are.</h2>
            <p>
              There are no physical locations listed at this time. Discover all
              five collections right here at Marketto.
            </p>
            <Button asChild>
              <Link to="/products" search={{}}>
                Explore the collection
                <ArrowRight />
              </Link>
            </Button>
          </section>
        )}
        {slug === "careers" && (
          <section className="info-prose">
            <h2>Thoughtful work. Everyday impact.</h2>
            <p>
              We believe good shopping starts with a team that cares—about
              quality, our customers, and the small details.
            </p>
            <h3>Open positions</h3>
            <p>
              No open positions are currently listed. Please check back for
              future opportunities.
            </p>
            <Button asChild variant="outline">
              <Link to="/contact">
                Get in touch
                <ArrowRight />
              </Link>
            </Button>
          </section>
        )}
        {slug === "faqs" && (
          <div className="faq-list">
            {faqs.map(([q, a]) => (
              <details key={q}>
                <summary>
                  {q}
                  <PlusMark />
                </summary>
                <p>{a}</p>
              </details>
            ))}
          </div>
        )}
        {slug === "returns-policy" && (
          <section className="info-prose">
            <span className="sample-policy">Sample storefront policy</span>
            <h2>30 days to make up your mind.</h2>
            <p>
              Request a return within 30 days of delivery. Items should be
              unused and in their original packaging, with tags attached where
              applicable.
            </p>
            <h3>Start a return</h3>
            <p>
              Contact our team with your order number and the item you’d like to
              return. Please wait for return instructions before sending
              anything back.
            </p>
            <h3>A little clarity</h3>
            <p>
              Return shipping costs and refund timing will be confirmed by the
              team. This storefront is a demonstration; no purchases or refunds
              are processed.
            </p>
            <Button asChild>
              <Link to="/contact">
                Contact us about a return
                <ArrowRight />
              </Link>
            </Button>
          </section>
        )}
        {slug === "shipping-info" && (
          <section className="info-prose">
            <span className="sample-policy">Sample storefront policy</span>
            <h2>A little delivery, on us.</h2>
            <div className="shipping-table">
              <div>
                <span>Orders over $75</span>
                <strong>Free standard shipping</strong>
              </div>
              <div>
                <span>Orders $75 and under</span>
                <strong>$6.95 standard shipping</strong>
              </div>
              <div>
                <span>Estimated delivery</span>
                <strong>3–5 business days after dispatch</strong>
              </div>
            </div>
            <h3>Where we deliver</h3>
            <p>
              Enter your shipping address at checkout. Actual delivery regions
              and delivery windows will be confirmed when this store opens for
              real orders.
            </p>
            <p>This is a demo store; no items are physically dispatched.</p>
          </section>
        )}
        {slug === "track-order" && (
          <section className="info-prose">
            <Package size={32} />
            {!user ? (
              <>
                <h2>Your order is a sign-in away.</h2>
                <p>Sign in with the account you used to place your order.</p>
                <Button asChild>
                  <Link to="/account">
                    Sign in
                    <ArrowRight />
                  </Link>
                </Button>
              </>
            ) : (
              <>
                <form
                  onSubmit={async (e) => {
                    e.preventDefault();
                    setBusy(true);
                    setError("");
                    setResult(null);
                    try {
                      const id = new FormData(e.currentTarget).get("order");
                      const orders = await getOrders();
                      const order = orders.find(
                        (o) =>
                          o.id.toLowerCase() ===
                          String(id).trim().toLowerCase(),
                      );
                      if (order) setResult(order);
                      else
                        setError(
                          "We couldn’t find that order in your account. Check the number in Your orders.",
                        );
                    } catch {
                      setError(
                        "We couldn’t check your order. Please try again.",
                      );
                    } finally {
                      setBusy(false);
                    }
                  }}
                >
                  <label>
                    Order number
                    <input name="order" placeholder="MKT-12345678" required />
                  </label>
                  <Button type="submit" disabled={busy}>
                    {busy ? "Checking…" : "Track order"}
                    <ArrowRight />
                  </Button>
                </form>
                {error && (
                  <p role="alert" className="form-error">
                    {error}
                  </p>
                )}
                {result && (
                  <div className="tracking-result">
                    <h2>{result.id}</h2>
                    <span className="status">{result.status}</span>
                    <p>
                      Shipping to {result.address.city},{" "}
                      {result.address.country}.
                    </p>
                    <p>
                      This order is recorded in your Marketto account. Check
                      back for status updates.
                    </p>
                  </div>
                )}
                <Link className="text-link" to="/orders">
                  View all your orders
                  <ArrowRight size={16} />
                </Link>
              </>
            )}
          </section>
        )}
      </div>
    </div>
  );
}
function PlusMark() {
  return <span aria-hidden="true">+</span>;
}
