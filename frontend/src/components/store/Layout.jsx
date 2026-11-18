import { Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import {
  Zap,
  Search,
  UserRound,
  Heart,
  ShoppingBag,
  Menu,
  X,
  ArrowRight,
  Truck,
  RotateCcw,
  Headphones,
  ArrowUpRight,
  Instagram,
  Github,
  Linkedin,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useStore } from "@/hooks/store";
import { categories } from "@/api";

export const infoLinks = [
  ["Contact", "/contact"],
  ["Store locations", "/store-locations"],
  ["Careers", "/careers"],
  ["FAQs", "/faqs"],
  ["Returns policy", "/returns-policy"],
  ["Shipping info", "/shipping-info"],
  ["Track order", "/track-order"],
];

export function Logo() {
  return (
    <Link to="/" className="logo" aria-label="Marketto home">
      <Zap className="bolt" fill="currentColor" strokeWidth={1.8} />
      marketto<span className="logo-period"></span>
    </Link>
  );
}

export function Layout({ children }) {
  const { cart, wishlist, user } = useStore();
  const [open, setOpen] = useState(false),
    [search, setSearch] = useState("");
  const navigate = useNavigate();

  const openTargetPage = (path) => {
    const newTab = window.open(path, "_blank");
    if (newTab) newTab.opener = null;
    else window.location.assign(path);
  };

  return (
    <>
      <div className="announcement">
        <span>A little something for your everyday.</span>
        <span>
          <Truck size={13} /> Free shipping on orders of $75 or more{" "}
          <ArrowRight size={13} />
        </span>
        <Link to="/track-order">
          Track your order <ArrowUpRight size={12} />
        </Link>
      </div>
      <header className="header-wrap">
        <div className="header">
          <Button
            variant="ghost"
            size="icon"
            className="mobile-menu"
            aria-label="Open menu"
            onClick={() => setOpen(true)}
          >
            <Menu />
          </Button>
          <Logo />
          <form
            className="search"
            onSubmit={(e) => {
              e.preventDefault();
              navigate({
                to: "/products",
                search: { q: search, category: undefined },
              });
            }}
          >
            <Search size={18} />
            <input
              aria-label="Search products"
              placeholder="Search for something good..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </form>
          <div className="header-actions">
            <Button variant="ghost" asChild>
              <Link to="/account">
                <UserRound />
                <span className="account-label">
                  {user ? user.displayName : "Account"}
                </span>
              </Link>
            </Button>
            <Button variant="ghost" size="icon" asChild>
              <Link
                to="/wishlist"
                aria-label={`Wishlist, ${wishlist.length} items`}
              >
                <Heart />
                {wishlist.length > 0 && (
                  <span className="count">{wishlist.length}</span>
                )}
              </Link>
            </Button>
            <span className="header-divider" />
            {/* I want to add a track order button here */}
            <Button variant="ghost" asChild>
              <Link to="/track-order" aria-label="Track your order">
                <Truck />
                <span className="cart-label">Track</span>
              </Link>
            </Button>
            <Button variant="ghost" asChild>
              <Link to="/cart" aria-label="Shopping bag">
                <ShoppingBag />
                <span className="cart-label">Bag</span>
                <span className="bag-count">
                  {cart.reduce((s, i) => s + i.quantity, 0)}
                </span>
              </Link>
            </Button>
          </div>
        </div>
        <nav className="category-nav" aria-label="Main navigation">
          <Link to="/products" search={{ category: undefined, q: undefined }}>
            Shop all
          </Link>
          {categories.map((c) => (
            <Link key={c} to="/products" search={{ category: c, q: undefined }}>
              {c}
            </Link>
          ))}
          <Link
            to="/products"
            search={{ category: undefined, q: undefined }}
            className="new-nav"
          >
            New arrivals <span />
          </Link>
          <span className="nav-right">Good finds. Better living.</span>
        </nav>
      </header>
      {open && (
        <div className="drawer-backdrop" onClick={() => setOpen(false)}>
          <nav
            className="mobile-drawer"
            onClick={(e) => e.stopPropagation()}
            aria-label="Mobile navigation"
          >
            <div className="section-title">
              <Logo />
              <Button
                variant="ghost"
                size="icon"
                aria-label="Close menu"
                onClick={() => setOpen(false)}
              >
                <X />
              </Button>
            </div>
            {["Shop all", ...categories].map((c) => (
              <Link
                key={c}
                to="/products"
                search={{
                  category: c === "Shop all" ? undefined : c,
                  q: undefined,
                }}
                onClick={() => setOpen(false)}
              >
                {c}
                <ArrowRight size={18} />
              </Link>
            ))}
            <Link to="/account" onClick={() => setOpen(false)}>
              My account
            </Link>
            <Link to="/orders" onClick={() => setOpen(false)}>
              My orders
            </Link>
          </nav>
        </div>
      )}
      <main>{children}</main>
      <section className="trust-strip container">
        {[
          [
            Truck,
            "A little delivery, on us",
            "Free shipping on orders over $75",
          ],
          [
            RotateCcw,
            "Love it, or send it back",
            "Easy returns within 30 days",
          ],
          [
            Headphones,
            "Real people, ready to help",
            "Friendly support, every step",
          ],
        ].map(([Icon, title, desc]) => (
          <div key={title}>
            <Icon size={27} strokeWidth={1.4} />
            <div>
              <h3>{title}</h3>
              <p>{desc}</p>
            </div>
          </div>
        ))}
      </section>
      <footer>
        <div className="footer-grid container">
          <div className="footer-brand">
            <Logo />
            <p>
              Thoughtfully chosen. Fairly priced.
              <br />
              Good things for the way you live.
            </p>
            <div
              style={{
                display: "flex",
                gap: "14px",
                alignItems: "center",
                marginTop: "22px",
              }}
            >
              <a
                href="https://www.instagram.com/"
                aria-label="Instagram"
                target="_blank"
                rel="noopener noreferrer"
                style={{ opacity: 0.65 }}
              >
                <Instagram size={18} />
              </a>
              <a
                href="https://github.com/eyosiyasdesta"
                aria-label="GitHub"
                target="_blank"
                rel="noopener noreferrer"
                style={{ opacity: 0.65 }}
              >
                <Github size={18} />
              </a>
              <a
                href="https://www.linkedin.com/in/eyosiyas-desta-73b593383/"
                aria-label="LinkedIn"
                target="_blank"
                rel="noopener noreferrer"
                style={{ opacity: 0.65 }}
              >
                <Linkedin size={18} />
              </a>
            </div>
          </div>
          <div>
            <h3>Explore</h3>
            <Link to="/products" search={{}}>
              Shop all
            </Link>
            <Link to="/wishlist">Your wishlist</Link>
            <Link to="/orders">Your orders</Link>
            <Link to="/store-locations">Store locations</Link>
          </div>
          <div>
            <h3>Here to help</h3>
            {infoLinks
              .filter(([n]) =>
                ["Contact", "FAQs", "Returns policy", "Shipping info"].includes(
                  n,
                ),
              )
              .map(([n, p]) => (
                <a
                  key={p}
                  href={p}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(event) => {
                    event.preventDefault();
                    openTargetPage(p);
                  }}
                >
                  {n}
                </a>
              ))}
            <Link to="/track-order">Track order</Link>
          </div>
          <div>
            <h3>A little more Marketto</h3>
            <p>
              New finds, thoughtful collections.
              <br />
              Always worth a look.
            </p>
            <Link to="/products" search={{}} className="footer-explore">
              Explore the collection <ArrowRight size={16} />
            </Link>
            <a
              href="/careers"
              target="_blank"
              rel="noopener noreferrer"
              onClick={(event) => {
                event.preventDefault();
                openTargetPage("/careers");
              }}
            >
              Careers at Marketto
            </a>
          </div>
        </div>
        {/* I want to add about the creator */}
        <div className="footer-creator container">
          <p>
            Made by{" "}
            <a
              href="https://eyosiyasdesta.me"
              target="_blank"
              rel="noopener noreferrer"
            >
              Eyosiyas Desta
            </a>
          </p>
        </div>

        <div className="footer-bottom container">
          <span>
            © {new Date().getFullYear()} Marketto. All good things reserved.
          </span>
          <span>Made for your everyday.</span>
        </div>
      </footer>
    </>
  );
}
