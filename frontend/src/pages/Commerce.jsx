import { useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import {
  ArrowRight,
  ShoppingBag,
  Minus,
  Plus,
  Trash2,
  Package,
  Check,
  ArrowLeft,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useStore } from "@/hooks/store";
import { shippingCost, getOrders } from "@/api";
import { money } from "@/components/store/ProductCard";
import { toast } from "sonner";
export function Summary({ cart, children }) {
  const subtotal = cart.reduce(
    (s, i) => s + (i.product?.price || 0) * i.quantity,
    0,
  );
  const shipping = shippingCost(subtotal);
  return (
    <aside className="order-summary">
      <h2>Order summary</h2>
      <div>
        <span>Subtotal</span>
        <span>{money(subtotal)}</span>
      </div>
      <div>
        <span>Shipping</span>
        <span>{shipping === 0 ? "On us" : money(shipping)}</span>
      </div>
      <p>
        {subtotal >= 75
          ? "Your order qualifies for free shipping."
          : `${money(Math.max(0, 75.01 - subtotal))} away from free shipping.`}
      </p>
      <div className="summary-total">
        <strong>Total</strong>
        <strong>{money(subtotal + shipping)}</strong>
      </div>
      {children}
    </aside>
  );
}
export function Cart() {
  const { cart, update, remove, ready } = useStore();
  const [busy, setBusy] = useState(false);
  const run = async (fn) => {
    setBusy(true);
    await fn();
    setBusy(false);
  };
  return (
    <div className="container page">
      <div className="page-heading">
        <span className="eyebrow">GOOD CHOICES, ALL TOGETHER</span>
        <h1>Your shopping bag.</h1>
        <p>
          {cart.reduce((s, i) => s + i.quantity, 0)} things to make your everyday a little better.
        </p>
      </div>
      {!ready ? <div className="product-skeleton" aria-label="Loading your bag" /> : null}
      {ready && !cart.length ? (
        <EmptyBag />
      ) : ready ? (
        <div className="commerce-grid">
          <div className="cart-list">
            {cart.map((i) => {
              const p = i.product;
              if (!p) return null;
              return (
                <article className="cart-item" key={i.id}>
                  <Link to="/products/$id" params={{ id: p.id }}>
                    <img src={p.image} alt={p.name} />
                  </Link>
                  <div>
                    <span className="eyebrow">{p.brand}</span>
                    <Link to="/products/$id" params={{ id: p.id }}>
                      <h3>{p.name}</h3>
                    </Link>
                    <p>{i.variant}</p>
                    <div className="quantity">
                      <Button
                        variant="ghost"
                        size="icon"
                        aria-label={`Decrease ${p.name} quantity`}
                        disabled={busy || i.quantity <= 1}
                        onClick={() => run(() => update(i.id, i.quantity - 1))}
                      >
                        <Minus />
                      </Button>
                      <span>{i.quantity}</span>
                      <Button
                        variant="ghost"
                        size="icon"
                        aria-label={`Increase ${p.name} quantity`}
                        disabled={busy}
                        onClick={() => run(() => update(i.id, i.quantity + 1))}
                      >
                        <Plus />
                      </Button>
                    </div>
                  </div>
                  <div className="cart-item-end">
                    <strong>{money(p.price * i.quantity)}</strong>
                    <Button
                      variant="ghost"
                      size="icon"
                      aria-label={`Remove ${p.name}`}
                      disabled={busy}
                      onClick={() => run(() => remove(i.id))}
                    >
                      <Trash2 />
                    </Button>
                  </div>
                </article>
              );
            })}
            <Link className="back-link" to="/products" search={{}}>
              <ArrowLeft size={16} />
              Keep discovering
            </Link>
          </div>
          <Summary cart={cart}>
            <Button asChild className="wide">
              <Link to="/checkout">
                Continue to checkout
                <ArrowRight />
              </Link>
            </Button>
            <span className="summary-note">A thoughtful purchase, from start to finish.</span>
          </Summary>
        </div>
      ) : null}
    </div>
  );
}
export function EmptyBag() {
  return (
    <div className="empty">
      <ShoppingBag size={40} />
      <h2>Your next good find is waiting.</h2>
      <p>Your bag is empty for now.</p>
      <Button asChild>
        <Link to="/products" search={{}}>
          Discover the collection
          <ArrowRight />
        </Link>
      </Button>
    </div>
  );
}
export function Checkout() {
  const { cart, user, placeOrder } = useStore();
  const navigate = useNavigate();
  const [busy, setBusy] = useState(false);
  if (!cart.length)
    return (
      <div className="container page">
        <EmptyBag />
      </div>
    );
  if (!user)
    return (
      <div className="container page empty">
        <h1>A quick hello before checkout.</h1>
        <p>Sign in or create a Marketto account to keep your orders together.</p>
        <Button asChild>
          <Link to="/account">
            Sign in to continue
            <ArrowRight />
          </Link>
        </Button>
      </div>
    );
  return (
    <div className="container page">
      <div className="page-heading">
        <span className="eyebrow">ONE LAST LITTLE STEP</span>
        <h1>Make it yours.</h1>
        <p>Shipping details and your order. Nothing extra.</p>
      </div>
      <div className="commerce-grid">
        <form
          className="address-form"
          onSubmit={async (e) => {
            e.preventDefault();
            setBusy(true);
            try {
              const address = Object.fromEntries(new FormData(e.currentTarget));
              await placeOrder(address);
              toast.success("Your order is in. Thank you!");
              navigate({ to: "/orders" });
            } catch (err) {
              toast.error(err.message);
            } finally {
              setBusy(false);
            }
          }}
        >
          <h2>Shipping address</h2>
          <div className="form-grid">
            {[
              ["name", "Full name", user.name],
              ["email", "Email address", user.email],
              ["street", "Street address", ""],
              ["apartment", "Apartment / suite (optional)", ""],
              ["city", "City", ""],
              ["postal", "Postal code", ""],
              ["country", "Country", ""],
              ["phone", "Phone (optional)", ""],
            ].map(([name, label, value]) => (
              <label key={name} className={name === "street" ? "form-full" : ""}>
                {label}
                <input
                  name={name}
                  type={name === "email" ? "email" : name === "phone" ? "tel" : "text"}
                  defaultValue={value}
                  required={!["phone", "apartment"].includes(name)}
                  autoComplete={
                    {
                      name: "name",
                      email: "email",
                      street: "street-address",
                      city: "address-level2",
                      postal: "postal-code",
                      country: "country-name",
                      phone: "tel",
                    }[name]
                  }
                />
              </label>
            ))}
          </div>
          <div className="checkout-notice">Your order is placed securely through Marketto. Payment is not collected online yet.</div>
          <Button type="submit" disabled={busy}>
            {busy ? "Placing your order…" : "Place order"}
            <ArrowRight />
          </Button>
        </form>
        <Summary cart={cart}>
          {cart.map((i) => {
            const p = i.product;
            return (
              p && (
                <div className="summary-product" key={i.id}>
                  <img src={p.image} alt={p.name} />
                  <span>
                    {p.name}
                    <small>
                      Quantity {i.quantity} · {i.variant}
                    </small>
                  </span>
                </div>
              )
            );
          })}
        </Summary>
      </div>
    </div>
  );
}
export function Orders() {
  const { user } = useStore();
  const {
    data: orders = [],
    isPending,
    isError,
    refetch,
  } = useQuery({ queryKey: ["orders", user?.email], queryFn: getOrders, enabled: !!user });
  return (
    <div className="container page">
      <div className="page-heading">
        <span className="eyebrow">ON THEIR WAY TO YOUR EVERYDAY</span>
        <h1>Your orders.</h1>
      </div>
      {!user ? (
        <div className="empty">
          <Package />
          <h2>Keep your good finds together.</h2>
          <Button asChild>
            <Link to="/account">Sign in to see orders</Link>
          </Button>
        </div>
      ) : isPending ? (
        <div className="product-skeleton" />
      ) : isError ? (
        <div className="empty">
          <h2>Orders couldn’t be loaded.</h2>
          <Button onClick={() => refetch()}>Try again</Button>
        </div>
      ) : !orders.length ? (
        <div className="empty">
          <Package size={36} />
          <h2>Your first good find awaits.</h2>
          <p>No orders yet.</p>
          <Button asChild>
            <Link to="/products" search={{}}>
              Shop the collection
            </Link>
          </Button>
        </div>
      ) : (
        <div className="orders-list">
          {orders.map((o) => (
            <article key={o.id} className="order">
              <div className="section-title">
                <div>
                  <h2>{o.id}</h2>
                  <p>{new Date(o.date).toLocaleDateString("en-US", { dateStyle: "long" })}</p>
                </div>
                <span className="status">
                  <Check size={14} />
                  {o.status}
                </span>
              </div>
              {o.items.map((i) => (
                <div className="order-product" key={i.id}>
                  <img src={i.product.image} alt={i.product.name} />
                  <div>
                    <h3>{i.product.name}</h3>
                    <p>
                      {i.variant} · Quantity {i.quantity}
                    </p>
                  </div>
                  <strong>{money(i.product.price * i.quantity)}</strong>
                </div>
              ))}
              <div className="order-bottom">
                <span>
                  Shipping to {o.address.city}, {o.address.country}
                </span>
                <strong>Total {money(o.total)}</strong>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
