import { useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import {
  Search,
  SlidersHorizontal,
  ArrowLeft,
  Heart,
  Minus,
  Plus,
  Truck,
  RotateCcw,
  Star,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProductCard, money } from "@/components/store/ProductCard";
import { categories, getProduct } from "@/api";
import { productQuery } from "./Home";
import { useStore } from "@/hooks/store";
export function Catalog({ search = {} }) {
  const { data: products = [], isPending, isError, refetch } = useQuery(productQuery);
  const [sort, setSort] = useState("featured"),
    [max, setMax] = useState(200),
    [category, setCategory] = useState(search.category || ""),
    [q, setQ] = useState(search.q || "");
  const rows = products
    .filter(
      (p) =>
        (!category || p.category === category) &&
        p.price <= max &&
        `${p.name} ${p.brand} ${p.category}`.toLowerCase().includes(q.toLowerCase()),
    )
    .sort((a, b) =>
      sort === "low"
        ? a.price - b.price
        : sort === "high"
          ? b.price - a.price
          : sort === "rating"
            ? b.rating - a.rating
            : 0,
    );
  return (
    <div className="container page">
      <div className="page-heading">
        <span className="eyebrow">THE MARKETTO COLLECTION</span>
        <h1>{category || "Good finds, all in one place."}</h1>
        <p>Thoughtfully chosen essentials. Find your next favorite.</p>
      </div>
      <div className="catalog-layout">
        <aside className="filters">
          <h3>
            <SlidersHorizontal size={17} /> Filter collection
          </h3>
          <label htmlFor="collection-search">Search</label>
          <div className="field-icon">
            <Search size={16} />
            <input
              id="collection-search"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Find something good"
            />
          </div>
          <label htmlFor="category">Category</label>
          <select id="category" value={category} onChange={(e) => setCategory(e.target.value)}>
            <option value="">All categories</option>
            {categories.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
          <label htmlFor="price">Maximum price: {money(max)}</label>
          <input
            id="price"
            type="range"
            min="0"
            max="200"
            step="5"
            value={max}
            onChange={(e) => setMax(Number(e.target.value))}
          />
          <Button
            variant="ghost"
            onClick={() => {
              setCategory("");
              setQ("");
              setMax(200);
            }}
          >
            Clear filters
          </Button>
        </aside>
        <section>
          <div className="results-bar">
            <span>{rows.length} thoughtfully chosen finds</span>
            <select
              aria-label="Sort products"
              value={sort}
              onChange={(e) => setSort(e.target.value)}
            >
              <option value="featured">Featured</option>
              <option value="low">Price: low to high</option>
              <option value="high">Price: high to low</option>
              <option value="rating">Highest rated</option>
            </select>
          </div>
          {isPending ? (
            <div className="catalog-products">
              {[1, 2, 3].map((i) => (
                <div key={i} className="product-skeleton" />
              ))}
            </div>
          ) : isError ? (
            <div className="empty">
              <h2>Unable to load products</h2>
              <Button onClick={() => refetch()}>Try again</Button>
            </div>
          ) : rows.length ? (
            <div className="catalog-products">
              {rows.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          ) : (
            <div className="empty">
              <Search />
              <h2>No finds this time.</h2>
              <p>Try a different search or broaden your filters.</p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
export function ProductDetail({ id }) {
  const {
    data: p,
    isPending,
    isError,
    refetch,
  } = useQuery({ queryKey: ["product", id], queryFn: () => getProduct(id) });
  const [variant, setVariant] = useState(""),
    [qty, setQty] = useState(1),
    [view, setView] = useState(0),
    [busy, setBusy] = useState(false);
  const { add, wishlist, toggleWish } = useStore();
  const navigate = useNavigate();
  if (isPending)
    return (
      <div className="container page">
        <div className="product-skeleton" />
      </div>
    );
  if (isError || !p)
    return (
      <div className="container page empty">
        <h1>We couldn’t find that product.</h1>
        <Button onClick={() => refetch()}>Try again</Button>
        <Button asChild variant="outline">
          <Link to="/products" search={{}}>
            Back to the collection
          </Link>
        </Button>
      </div>
    );
  const selected = variant || p.variants[0];
  const buy = async (now) => {
    setBusy(true);
    const ok = await add(p.id, qty, selected);
    setBusy(false);
    if (ok && now) navigate({ to: "/checkout" });
  };
  return (
    <div className="container page">
      <Link className="back-link" to="/products" search={{}}>
        <ArrowLeft size={16} />
        Back to the collection
      </Link>
      <div className="detail-grid">
        <div>
          <div className={`detail-image detail-view-${view}`}>
            <img src={p.image} alt={p.name} />
          </div>
          <div className="gallery-thumbs">
            {["Full product", "Detail view"].map((v, i) => (
              <Button
                key={v}
                variant="outline"
                aria-label={v}
                aria-pressed={view === i}
                className={view === i ? "selected" : ""}
                onClick={() => setView(i)}
              >
                <img src={p.image} alt="" />
              </Button>
            ))}
          </div>
        </div>
        <div className="detail-copy">
          <span className="eyebrow">{p.brand}</span>
          <h1>{p.name}</h1>
          <div className="rating">
            <Star size={15} />
            {p.rating} <span>({p.reviews} ratings)</span>
          </div>
          <div className="detail-price">
            <strong>{money(p.price)}</strong>
            {p.originalPrice && <del>{money(p.originalPrice)}</del>}
          </div>
          <p>{p.description}</p>
          <label>Option: {selected}</label>
          <div className="variant-row">
            {p.variants.map((v) => (
              <Button
                key={v}
                variant="outline"
                className={selected === v ? "selected" : ""}
                onClick={() => setVariant(v)}
              >
                {v}
              </Button>
            ))}
          </div>
          <label>Quantity</label>
          <div className="quantity">
            <Button
              variant="ghost"
              size="icon"
              aria-label="Decrease quantity"
              disabled={qty <= 1}
              onClick={() => setQty((q) => q - 1)}
            >
              <Minus />
            </Button>
            <span>{qty}</span>
            <Button
              variant="ghost"
              size="icon"
              aria-label="Increase quantity"
              disabled={qty >= p.stock}
              onClick={() => setQty((q) => q + 1)}
            >
              <Plus />
            </Button>
          </div>
          <span className="stock-label">
            {p.stock ? "In stock · Ready for your everyday" : "Currently sold out"}
          </span>
          <div className="detail-actions">
            <Button disabled={!p.stock || busy} onClick={() => buy(false)}>
              Add to bag <Plus />
            </Button>
            <Button
              variant="outline"
              size="icon"
              aria-label="Save to wishlist"
              aria-pressed={wishlist.includes(p.id)}
              onClick={() => toggleWish(p.id)}
            >
              <Heart className={wishlist.includes(p.id) ? "heart-saved" : ""} />
            </Button>
          </div>
          <Button
            variant="outline"
            className="wide"
            disabled={!p.stock || busy}
            onClick={() => buy(true)}
          >
            Buy now
          </Button>
          <div className="detail-promises">
            <span>
              <Truck size={17} />
              Free shipping over $75
            </span>
            <span>
              <RotateCcw size={17} />
              30-day easy returns
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
export function Wishlist() {
  const { wishlist } = useStore();
  const { data: products = [] } = useQuery(productQuery);
  return (
    <div className="container page">
      <div className="page-heading">
        <span className="eyebrow">THE THINGS YOU LOVE</span>
        <h1>Your wishlist.</h1>
        <p>A few good things, saved for later.</p>
      </div>
      {wishlist.length ? (
        <div className="product-grid">
          {products
            .filter((p) => wishlist.includes(p.id))
            .map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
        </div>
      ) : (
        <div className="empty">
          <Heart size={36} />
          <h2>A little room for your favorites.</h2>
          <p>Save the things that catch your eye.</p>
          <Button asChild>
            <Link to="/products" search={{}}>
              Explore the collection
            </Link>
          </Button>
        </div>
      )}
    </div>
  );
}
