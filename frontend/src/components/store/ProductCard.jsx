import { Link } from "@tanstack/react-router";
import { Heart, Plus, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useStore } from "@/hooks/store";
export const money = (n) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  }).format(n);
export function ProductCard({ product: p }) {
  const { add, wishlist, toggleWish } = useStore();
  return (
    <article className="product-card">
      <div className="product-picture">
        <Link to="/products/$id" params={{ id: p.id }}>
          <img src={p.image} alt={p.name} loading="lazy" />
        </Link>
        <span className="product-tag">{p.tag}</span>
        <Button
          variant="secondary"
          size="icon"
          className="wish-button"
          aria-label={`Save ${p.name}`}
          aria-pressed={wishlist.includes(p.id)}
          onClick={() => toggleWish(p.id)}
        >
          <Heart className={wishlist.includes(p.id) ? "heart-saved" : ""} />
        </Button>
      </div>
      <div className="product-meta">
        <span>{p.brand}</span>
        <span className="rating">
          <Star size={12} />
          {p.rating} <small>({p.reviews})</small>
        </span>
      </div>
      <Link to="/products/$id" params={{ id: p.id }} className="product-name">
        {p.name}
      </Link>
      <div className="product-bottom">
        <div>
          <strong>{money(p.price)}</strong>
          {p.originalPrice && <del>{money(p.originalPrice)}</del>}
        </div>
        <Button
          variant="outline"
          size="sm"
          disabled={!p.stock}
          onClick={() => add(p.id, 1, p.variants[0])}
        >
          <Plus />
          {p.stock ? "Add to cart" : "Sold out"}
        </Button>
      </div>
    </article>
  );
}
