import { useEffect, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import {
  ArrowRight,
  ArrowLeft,
  Headphones,
  Shirt,
  Armchair,
  BookOpen,
  Watch,
  Sparkles,
  ShieldCheck,
  Leaf,
  Pause,
  Play,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/store/ProductCard";
import { heroImages, getProducts } from "@/api";
import { useQuery } from "@tanstack/react-query";

export const productQuery = { queryKey: ["products"], queryFn: getProducts };

const slides = [
  {
    eyebrow: "THE EVERYDAY, ELEVATED",
    title: (
      <>
        Good things.
        <br />
        For your everyday.
      </>
    ),
    copy: "Thoughtfully chosen essentials for your home, your style,\nand everything in between.",
    cta: "Discover the collection",
    category: undefined,
  },
  {
    eyebrow: "A QUIETER KIND OF LIVING",
    title: (
      <>
        Make room
        <br />
        for the little things.
      </>
    ),
    copy: "Beautifully considered objects. A home that feels like you.",
    cta: "Explore home & living",
    category: "Home & Living",
  },
  {
    eyebrow: "LESS NOISE. MORE YOU.",
    title: (
      <>
        Your everyday.
        <br />
        Better connected.
      </>
    ),
    copy: "Thoughtful technology that fits naturally into your day.",
    cta: "Discover electronics",
    category: "Electronics",
  },
];

export function Home() {
  const [slide, setSlide] = useState(0);
  const [paused, setPaused] = useState(false);
  const touch = useRef(0);

  const {
    data: products = [],
    isPending,
    isError,
    refetch,
  } = useQuery(productQuery);

  useEffect(() => {
    if (paused) return;
    const id = setInterval(() => {
      setSlide((s) => (s + 1) % slides.length);
    }, 4000);
    return () => clearInterval(id);
  }, [paused]);

  const s = slides[slide];

  return (
    <div className="container home">
      <section
        className="hero"
        onTouchStart={(e) => {
          touch.current = e.touches[0].clientX;
        }}
        onTouchEnd={(e) => {
          const dx = e.changedTouches[0].clientX - touch.current;
          if (Math.abs(dx) > 50)
            setSlide(
              (i) => (i + (dx < 0 ? 1 : slides.length - 1)) % slides.length,
            );
        }}
        aria-roledescription="carousel"
        aria-label="Featured collections"
      >
        <img
          className="hero-image"
          src={heroImages[slide % heroImages.length]}
          alt=" "
        />
        <div className="hero-copy" key={slide}>
          <span className="eyebrow">
            <span />
            {s.eyebrow}
          </span>
          <h1>{s.title}</h1>
          <p>{s.copy}</p>
          <Button size="lg" asChild>
            <Link
              to="/products"
              search={{ category: s.category, q: undefined }}
            >
              {s.cta}
              <ArrowRight />
            </Link>
          </Button>
          <div className="hero-note">
            <ShieldCheck size={14} /> Good quality. Great prices. No
            compromises.
          </div>
        </div>
        <div className="hero-pagination">
          <div className="hero-dots">
            {slides.map((_, i) => (
              <Button
                key={i}
                variant="ghost"
                size="icon"
                className={slide === i ? "dot active" : "dot"}
                aria-label={`Show collection ${i + 1}`}
                aria-pressed={slide === i}
                onClick={() => setSlide(i)}
              >
                <span />
              </Button>
            ))}
            <span>
              0{slide + 1} / 0{slides.length}
            </span>
          </div>
          <div className="hero-arrows">
            <Button
              variant="outline"
              size="icon"
              aria-label={paused ? "Play slideshow" : "Pause slideshow"}
              onClick={() => setPaused(!paused)}
            >
              {paused ? <Play /> : <Pause />}
            </Button>
            <Button
              variant="outline"
              size="icon"
              aria-label="Previous collection"
              onClick={() =>
                setSlide((i) => (i + slides.length - 1) % slides.length)
              }
            >
              <ArrowLeft />
            </Button>
            <Button
              variant="outline"
              size="icon"
              aria-label="Next collection"
              onClick={() => setSlide((i) => (i + 1) % slides.length)}
            >
              <ArrowRight />
            </Button>
          </div>
        </div>
      </section>

      <div className="small-promises">
        <span>
          <Leaf size={15} /> Thoughtfully selected
        </span>
        <span>
          <ShieldCheck size={15} /> Quality you can count on
        </span>
        <span>
          <Sparkles size={15} /> Everyday, a little better
        </span>
      </div>

      <section className="categories-section">
        <div className="section-title">
          <div>
            <span className="eyebrow">FIND YOUR EVERYDAY</span>
            <h2>Something for every part of life.</h2>
          </div>
          <Link to="/products" search={{}} className="text-link">
            Shop all categories <ArrowRight size={17} />
          </Link>
        </div>
        <div className="category-grid">
          {[
            [Headphones, "Electronics", "Sound. Connect. Unwind."],
            [Shirt, "Clothing", "Wear what feels like you."],
            [Armchair, "Home & Living", "Make yourself at home."],
            [BookOpen, "Books", "A little more inspiration."],
            [Watch, "Accessories", "The finishing touches."],
          ].map(([Icon, name, copy]) => (
            <Link
              to="/products"
              search={{ category: name, q: undefined }}
              key={name}
              className="category-tile"
            >
              <div className="category-icon">
                <Icon size={27} strokeWidth={1.35} />
              </div>
              <h3>{name}</h3>
              <p>{copy}</p>
              <ArrowRight className="category-arrow" size={17} />
            </Link>
          ))}
        </div>
      </section>

      <section className="favorites">
        <div className="section-title">
          <div>
            <span className="eyebrow">WELL LOVED, FOR A REASON</span>
            <h2>
              Customer favorites<span className="accent-period">.</span>
            </h2>
            <p>The good things everyone keeps coming back for.</p>
          </div>
          <Link className="text-link" to="/products" search={{}}>
            View all products <ArrowRight size={17} />
          </Link>
        </div>
        {isPending ? (
          <div className="product-grid">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="product-skeleton" />
            ))}
          </div>
        ) : isError ? (
          <div className="empty">
            <h3>We couldn’t load these finds.</h3>
            <Button onClick={() => refetch()}>Try again</Button>
          </div>
        ) : (
          <div className="product-grid">
            {products.slice(0, 4).map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </section>

      <section className="considered-strip">
        <div>
          <Leaf size={24} />
          <span>A more considered kind of shopping.</span>
        </div>
        <p>Less searching. More finding things you love.</p>
        <Link to="/products" search={{}}>
          <ArrowUpRightIcon />
        </Link>
      </section>
    </div>
  );
}

function ArrowUpRightIcon() {
  return <ArrowRight size={23} />;
}
