// ===================================================================
// CATEGORY DEFINITIONS — every category gets equal product count & features
// ===================================================================
let PRODUCTS = [];

async function loadProducts() {
  const res = await fetch("/api/products");
  const raw = await res.json();

  PRODUCTS = raw.map((p) => ({
    id: p.id,
    name: p.name,
    brand: p.brand,
    category: p.category.name,
    subcategory: p.category.name, // your backend has no subcategory level yet
    price: p.price,
    discountPrice: p.discountPrice, // already null when no discount — matches your code
    discountPct: p.discountPrice
      ? Math.round(100 - (p.discountPrice / p.price) * 100)
      : 0,
    rating: p.rating,
    reviews: p.reviewCount,
    stock: p.stock,
    images: [p.imageUrl, p.imageUrl], // backend only gives one image right now
    desc: p.description,
    specs: {
      Brand: p.brand,
      Category: p.category.name,
      Availability: p.stock > 0 ? "In Stock" : "Out of Stock",
    },
    colors:
      p.variants && p.variants.length
        ? [...new Set(p.variants.map((v) => v.color))]
        : null,
    sizes:
      p.variants && p.variants.length
        ? [...new Set(p.variants.map((v) => v.size))]
        : null,
    variants: p.variants || [], // keep raw list too, for stock lookups
    featured: false,
    bestseller: p.reviewCount > 600,
  }));
}
let CATEGORIES = [];

function buildCategoriesFromProducts() {
  const map = new Map();
  PRODUCTS.forEach((p) => {
    if (!map.has(p.category)) {
      map.set(p.category, {
        name: p.category,
        icon: "🛍️",
        subs: [],
        brands: new Set(),
        items: [],
      });
    }
    const c = map.get(p.category);
    c.brands.add(p.brand);
    c.items.push(p);
  });
  CATEGORIES = [...map.values()].map((c) => ({ ...c, brands: [...c.brands] }));
}
// ===================================================================
// STATE (persisted)
// ===================================================================
let cart = []; // now holds real backend cart items: [{id, product, quantity}]
let wishlist = JSON.parse(localStorage.getItem("sw_wishlist") || "[]");
let user = JSON.parse(localStorage.getItem("sw_user") || "null");
// Registered accounts (mock — mirrors the real backend's users table).
// NOTE: storing plaintext passwords in localStorage is only acceptable
// because this is a disconnected frontend demo, never do this for real.

let view = { mode: "home" }; // home | products
let filters = {
  category: null,
  subcategory: null,
  brands: [],
  priceMin: 0,
  priceMax: 2000,
  minRating: 0,
  inStockOnly: false,
  query: "",
  sort: "featured",
};
let viewMode = "grid";
let currentPage = 1;
const PER_PAGE = 12;

function saveWishlist() {
  localStorage.setItem("sw_wishlist", JSON.stringify(wishlist));
}
function saveUser() {
  localStorage.setItem("sw_user", JSON.stringify(user));
}

// ===================================================================
// HELPERS
// ===================================================================
function authHeader() {
  const token = localStorage.getItem("sw_token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}
function $(id) {
  return document.getElementById(id);
}
function show(id) {
  $(id).classList.remove("hidden");
}
function hide(id) {
  $(id).classList.add("hidden");
}
function money(n) {
  return "$" + Number(n).toFixed(2);
}
function findProduct(id) {
  return PRODUCTS.find((p) => p.id === Number(id));
}
function starRow(r) {
  return "⭐".repeat(Math.round(r));
}
function showToast(message, type = "success") {
  let container = document.getElementById("toastContainer");
  if (!container) {
    container = document.createElement("div");
    container.id = "toastContainer";
    document.body.appendChild(container);
  }
  const toast = document.createElement("div");
  toast.className = `toast toast-${type}`;
  toast.textContent = message;
  container.appendChild(toast);
  setTimeout(() => {
    toast.classList.add("toast-hide");
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

function showConfirm(message) {
  return new Promise((resolve) => {
    const overlay = document.createElement("div");
    overlay.className = "confirm-overlay";
    overlay.innerHTML = `
      <div class="confirm-box">
        <p>${message}</p>
        <div class="confirm-actions">
          <button class="btn-outline" id="confirmCancel">Cancel</button>
          <button class="btn-primary" id="confirmOk">OK</button>
        </div>
      </div>`;
    document.body.appendChild(overlay);
    overlay.querySelector("#confirmOk").addEventListener("click", () => {
      overlay.remove();
      resolve(true);
    });
    overlay.querySelector("#confirmCancel").addEventListener("click", () => {
      overlay.remove();
      resolve(false);
    });
  });
}

const TAG_ICON = `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.6 12.6 12 21.2a2 2 0 0 1-2.8 0l-7-7a2 2 0 0 1 0-2.8L11 2.8A2 2 0 0 1 12.4 2H19a2 2 0 0 1 2 2v6.6a2 2 0 0 1-.4 1.4z"/><circle cx="7.5" cy="7.5" r="1"/></svg>`;

// ===================================================================
// NAV: category dropdowns + mobile menu
// ===================================================================
function renderCategoryNav() {
  const nav = $("categoryNav");
  nav.innerHTML = "";

  const allBtn = document.createElement("button");
  allBtn.className = "cat-link active";
  allBtn.textContent = "All Products";
  allBtn.addEventListener("click", () => openProductsView({}));
  nav.appendChild(allBtn);

  CATEGORIES.forEach((cat) => {
    const wrap = document.createElement("div");
    wrap.className = "cat-item";
    const btn = document.createElement("button");
    btn.className = "cat-link";
    btn.textContent = cat.name;
    btn.addEventListener("click", () =>
      openProductsView({ category: cat.name }),
    );
    wrap.appendChild(btn);

    const dd = document.createElement("div");
    dd.className = "cat-dropdown";
    dd.innerHTML = cat.subs
      .map((s) => `<button data-sub="${s}">${TAG_ICON}${s}</button>`)
      .join("");
    dd.querySelectorAll("button").forEach((b) => {
      b.addEventListener("click", () =>
        openProductsView({ category: cat.name, subcategory: b.dataset.sub }),
      );
    });
    wrap.appendChild(dd);
    nav.appendChild(wrap);
  });

  const saleBtn = document.createElement("button");
  saleBtn.className = "cat-link sale";
  saleBtn.textContent = "⚡ Sale";
  saleBtn.addEventListener("click", () => openProductsView({ saleOnly: true }));
  nav.appendChild(saleBtn);
}

function renderMobileMenu() {
  const menu = $("mobileMenu");
  let html = `<button class="mobile-menu-close" id="mobileClose">✕</button>`;
  html += `<button class="cat-mobile-btn" data-cat="">All Products</button>`;
  CATEGORIES.forEach(
    (c) =>
      (html += `<button class="cat-mobile-btn" data-cat="${c.name}">${c.icon} ${c.name}</button>`),
  );
  html += `<button class="cat-mobile-btn" data-cat="__sale__">⚡ Sale</button>`;
  menu.innerHTML = html;
  $("mobileClose").addEventListener("click", () => hide("mobileMenu"));
  menu.querySelectorAll("[data-cat]").forEach((b) => {
    b.addEventListener("click", () => {
      const cat = b.dataset.cat;
      hide("mobileMenu");
      if (cat === "__sale__") openProductsView({ saleOnly: true });
      else if (cat) openProductsView({ category: cat });
      else openProductsView({});
    });
  });
}
function seeded(i) {
  const x = Math.sin(i * 999) * 10000;
  return x - Math.floor(x);
}
// ===================================================================
// HOME VIEW
// ===================================================================
function renderHome() {
  $("categoryCards").innerHTML = CATEGORIES.map(
    (c) => `
    <div class="category-card" data-cat="${c.name}">
      <div class="cc-icon">${c.icon}</div>
      <div class="cc-name">${c.name}</div>
      <div class="cc-count">${c.items.length} products</div>
    </div>`,
  ).join("");
  document
    .querySelectorAll(".category-card")
    .forEach((el) =>
      el.addEventListener("click", () =>
        openProductsView({ category: el.dataset.cat }),
      ),
    );

  const trending = shuffleBySeed(PRODUCTS, 1).slice(0, 8);
  const bestsellers = PRODUCTS.filter((p) => p.bestseller).slice(0, 8);
  renderCardGrid("trendingGrid", trending);
  renderCardGrid(
    "bestsellerGrid",
    bestsellers.length ? bestsellers : PRODUCTS.slice(0, 8),
  );

  const brands = [...new Set(CATEGORIES.flatMap((c) => c.brands))];
  $("brandStrip").innerHTML = brands
    .map((b) => `<button class="brand-chip" data-brand="${b}">${b}</button>`)
    .join("");
  $("brandStrip")
    .querySelectorAll("button")
    .forEach((b) =>
      b.addEventListener("click", () =>
        openProductsView({ brands: [b.dataset.brand] }),
      ),
    );

  document.querySelectorAll(".hero-slide .btn-primary").forEach((btn) => {
    btn.addEventListener("click", () =>
      openProductsView({ category: btn.dataset.cat }),
    );
  });
  document.querySelectorAll("[data-viewall]").forEach((a) =>
    a.addEventListener("click", (e) => {
      e.preventDefault();
      openProductsView({});
    }),
  );
}

function shuffleBySeed(arr, seedBase) {
  return [...arr].sort(
    (a, b) => seeded(a.id * seedBase) - seeded(b.id * seedBase),
  );
}

function renderCardGrid(containerId, products) {
  $(containerId).innerHTML = products.map((p) => productCardHTML(p)).join("");
  wireCardEvents($(containerId));
}

// ===================================================================
// PRODUCTS / LISTING VIEW
// ===================================================================
function openProductsView(opts) {
  view.mode = "products";
  filters = {
    category: opts.category || null,
    subcategory: opts.subcategory || null,
    brands: opts.brands || [],
    priceMin: 0,
    priceMax: 2000,
    minRating: 0,
    inStockOnly: false,
    query: "",
    saleOnly: !!opts.saleOnly,
    sort: "featured",
  };
  currentPage = 1;
  $("searchInput").value = "";
  hide("homeView");
  show("productsView");
  document
    .querySelectorAll(".cat-link")
    .forEach((b) => b.classList.remove("active"));
  window.scrollTo({ top: 0, behavior: "smooth" });
  renderFiltersSidebar();
  renderProductsView();
}

function goHome() {
  view.mode = "home";
  hide("productsView");
  show("homeView");
  document
    .querySelectorAll(".cat-link")
    .forEach((b) => b.classList.remove("active"));
  document.querySelector(".cat-link").classList.add("active");
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function renderFiltersSidebar() {
  const catDef = CATEGORIES.find((c) => c.name === filters.category);
  const pool = catDef
    ? PRODUCTS.filter((p) => p.category === filters.category)
    : PRODUCTS;
  const brandsAvailable = [...new Set(pool.map((p) => p.brand))].sort();
  const subsAvailable = catDef ? catDef.subs : [];

  // breadcrumb
  let crumb = `<a href="#" id="crumbHome">Home</a> / `;
  crumb += filters.category
    ? `<a href="#" id="crumbCat">${filters.category}</a>`
    : "All Products";
  if (filters.subcategory) crumb += ` / ${filters.subcategory}`;
  if (filters.saleOnly) crumb = `<a href="#" id="crumbHome">Home</a> / Sale`;
  $("breadcrumb").innerHTML = crumb;
  $("crumbHome").addEventListener("click", (e) => {
    e.preventDefault();
    goHome();
  });
  const crumbCat = document.getElementById("crumbCat");
  if (crumbCat)
    crumbCat.addEventListener("click", (e) => {
      e.preventDefault();
      openProductsView({ category: filters.category });
    });

  $("categoryIntro").innerHTML = catDef
    ? `<h1>${catDef.icon} ${filters.category}</h1><p>Shop the full ${filters.category.toLowerCase()} collection — ${pool.length} products across ${catDef.subs.length} subcategories.</p>`
    : filters.saleOnly
      ? `<h1>⚡ Sale</h1><p>Discounted picks across every category.</p>`
      : `<h1>All Products</h1><p>Browse our entire catalog across all categories.</p>`;

  // subcategory filter
  $("subcatGroup").style.display = subsAvailable.length ? "block" : "none";
  $("subcatList").innerHTML = subsAvailable
    .map(
      (s) => `
    <label class="checkbox-row"><input type="checkbox" value="${s}" class="subcat-check" ${filters.subcategory === s ? "checked" : ""}/> ${s}</label>`,
    )
    .join("");
  $("subcatList")
    .querySelectorAll(".subcat-check")
    .forEach((cb) => {
      cb.addEventListener("change", () => {
        filters.subcategory = cb.checked ? cb.value : null;
        $("subcatList")
          .querySelectorAll(".subcat-check")
          .forEach((o) => {
            if (o !== cb) o.checked = false;
          });
        currentPage = 1;
        renderProductsView();
      });
    });

  // brand filter
  $("brandList").innerHTML = brandsAvailable
    .map(
      (b) => `
    <label class="checkbox-row"><input type="checkbox" value="${b}" class="brand-check" ${filters.brands.includes(b) ? "checked" : ""}/> ${b}</label>`,
    )
    .join("");
  $("brandList")
    .querySelectorAll(".brand-check")
    .forEach((cb) => {
      cb.addEventListener("change", () => {
        if (cb.checked) filters.brands.push(cb.value);
        else filters.brands = filters.brands.filter((x) => x !== cb.value);
        currentPage = 1;
        renderProductsView();
      });
    });

  // price
  const prices = pool.map((p) => p.discountPrice ?? p.price);
  const maxPrice = Math.ceil(Math.max(...prices, 100));
  $("priceMin").value = filters.priceMin;
  $("priceMax").value = filters.priceMax === 2000 ? maxPrice : filters.priceMax;
  $("priceSlider").max = maxPrice;
  $("priceSlider").value =
    filters.priceMax === 2000 ? maxPrice : filters.priceMax;
  $("priceRangeLabel").textContent =
    `$${filters.priceMin} — $${filters.priceMax === 2000 ? maxPrice : filters.priceMax}`;

  $("priceMin").oninput = () => {
    filters.priceMin = Number($("priceMin").value) || 0;
    currentPage = 1;
    renderProductsView();
  };
  $("priceMax").oninput = () => {
    filters.priceMax = Number($("priceMax").value) || maxPrice;
    $("priceSlider").value = filters.priceMax;
    currentPage = 1;
    renderProductsView();
  };
  $("priceSlider").oninput = () => {
    filters.priceMax = Number($("priceSlider").value);
    $("priceMax").value = filters.priceMax;
    currentPage = 1;
    renderProductsView();
  };

  // rating
  const ratingOpts = [4, 3, 2, 0];
  $("ratingList").innerHTML = ratingOpts
    .map(
      (r) => `
    <label><input type="radio" name="ratingFilter" value="${r}" ${filters.minRating === r ? "checked" : ""}/> ${r > 0 ? "⭐".repeat(r) + " & above" : "All ratings"}</label>`,
    )
    .join("");
  $("ratingList")
    .querySelectorAll("input")
    .forEach((r) =>
      r.addEventListener("change", () => {
        filters.minRating = Number(r.value);
        currentPage = 1;
        renderProductsView();
      }),
    );

  $("inStockOnly").checked = filters.inStockOnly;
  $("inStockOnly").onchange = () => {
    filters.inStockOnly = $("inStockOnly").checked;
    currentPage = 1;
    renderProductsView();
  };

  $("clearAllFilters").onclick = () =>
    openProductsView({ category: filters.category });
}

function getFilteredSorted() {
  let list = [...PRODUCTS];
  if (filters.category)
    list = list.filter((p) => p.category === filters.category);
  if (filters.subcategory)
    list = list.filter((p) => p.subcategory === filters.subcategory);
  if (filters.brands.length)
    list = list.filter((p) => filters.brands.includes(p.brand));
  if (filters.saleOnly) list = list.filter((p) => p.discountPrice);
  if (filters.minRating)
    list = list.filter((p) => p.rating >= filters.minRating);
  if (filters.inStockOnly) list = list.filter((p) => p.stock > 0);
  if (filters.query) {
    const q = filters.query.toLowerCase();
    list = list.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.subcategory.toLowerCase().includes(q),
    );
  }
  list = list.filter((p) => {
    const price = p.discountPrice ?? p.price;
    return price >= filters.priceMin && price <= filters.priceMax;
  });

  switch (filters.sort) {
    case "price-asc":
      list.sort(
        (a, b) => (a.discountPrice ?? a.price) - (b.discountPrice ?? b.price),
      );
      break;
    case "price-desc":
      list.sort(
        (a, b) => (b.discountPrice ?? b.price) - (a.discountPrice ?? a.price),
      );
      break;
    case "rating":
      list.sort((a, b) => b.rating - a.rating);
      break;
    case "discount":
      list.sort((a, b) => b.discountPct - a.discountPct);
      break;
    default:
      list.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
  }
  return list;
}

function renderProductsView() {
  const all = getFilteredSorted();
  const totalPages = Math.max(1, Math.ceil(all.length / PER_PAGE));
  currentPage = Math.min(currentPage, totalPages);
  const pageItems = all.slice(
    (currentPage - 1) * PER_PAGE,
    currentPage * PER_PAGE,
  );

  $("resultsCount").textContent = all.length
    ? `Showing ${(currentPage - 1) * PER_PAGE + 1}–${Math.min(currentPage * PER_PAGE, all.length)} of ${all.length} results`
    : "Showing 0 results";

  const grid = $("productGrid");
  grid.className = "product-grid" + (viewMode === "list" ? " list-mode" : "");

  if (!pageItems.length) {
    grid.innerHTML = `<div class="empty-state">No products found.<br><button class="btn-primary" id="emptyClear">Clear Filters</button></div>`;
    document
      .getElementById("emptyClear")
      .addEventListener("click", () =>
        openProductsView({ category: filters.category }),
      );
  } else {
    grid.innerHTML = pageItems.map((p) => productCardHTML(p)).join("");
    wireCardEvents(grid);
  }

  renderPagination(totalPages);
}

function renderPagination(totalPages) {
  if (totalPages <= 1) {
    $("pagination").innerHTML = "";
    return;
  }
  let html = `<button ${currentPage === 1 ? "disabled" : ""} data-page="${currentPage - 1}">‹</button>`;
  for (let i = 1; i <= totalPages; i++) {
    html += `<button class="${i === currentPage ? "active" : ""}" data-page="${i}">${i}</button>`;
  }
  html += `<button ${currentPage === totalPages ? "disabled" : ""} data-page="${currentPage + 1}">›</button>`;
  $("pagination").innerHTML = html;
  $("pagination")
    .querySelectorAll("[data-page]")
    .forEach((b) =>
      b.addEventListener("click", () => {
        currentPage = Number(b.dataset.page);
        renderProductsView();
        document
          .querySelector(".products-main")
          .scrollIntoView({ behavior: "smooth" });
      }),
    );
}

// ===================================================================
// PRODUCT CARD
// ===================================================================
function productCardHTML(p) {
  const isWished = wishlist.some((id) => String(id) === String(p.id));
  const stockLabel =
    p.stock === 0
      ? `<span class="stock-note out">Out of stock</span>`
      : p.stock < 8
        ? `<span class="stock-note low">Only ${p.stock} left</span>`
        : `<span class="stock-note">In stock</span>`;
  return `
    <div class="product-card">
      <div class="product-image-wrap" data-view="${p.id}">
        ${p.discountPct ? `<span class="badge-tag">SAVE ${p.discountPct}%</span>` : p.stock === 0 ? `<span class="badge-tag out-of-stock">SOLD OUT</span>` : ""}
        <div class="card-icon-btns">
          <button class="icon-btn-round wishlist-toggle ${isWished ? "active" : ""}" data-id="${p.id}" aria-label="Toggle wishlist">♥</button>
          <button class="icon-btn-round quick-view-btn" data-id="${p.id}" aria-label="Quick view">👁</button>
        </div>
        <img class="product-image" src="${p.images[0]}" alt="${p.name}" loading="lazy" />
      </div>
      <div class="product-info">
        <div class="product-brand">${p.brand}</div>
        <div class="product-name" data-view="${p.id}">${p.name}</div>
        <div class="product-rating">${starRow(p.rating)} (${p.reviews})</div>
        <div class="product-price-row">
          <span class="price-current">${money(p.discountPrice ?? p.price)}</span>
          ${p.discountPrice ? `<span class="price-original">${money(p.price)}</span>` : ""}
        </div>
        ${stockLabel}
        <div class="card-btn-row">
          <button class="btn-primary add-cart-btn" data-add="${p.id}" ${p.stock === 0 ? "disabled" : ""}>Add to Cart</button>
          <button class="btn-outline buy-now-btn" data-buynow="${p.id}" ${p.stock === 0 ? "disabled" : ""}>Buy Now</button>
        </div>
      </div>
    </div>`;
}

function wireCardEvents(container) {
  container
    .querySelectorAll("[data-view]")
    .forEach((el) =>
      el.addEventListener("click", () => openDetail(el.dataset.view)),
    );
  container.querySelectorAll(".quick-view-btn").forEach((el) =>
    el.addEventListener("click", (e) => {
      e.stopPropagation();
      openDetail(el.dataset.id);
    }),
  );
  container.querySelectorAll(".wishlist-toggle").forEach((el) =>
    el.addEventListener("click", (e) => {
      e.stopPropagation();
      toggleWishlist(el.dataset.id);
    }),
  );
  container.querySelectorAll("[data-add]").forEach((el) =>
    el.addEventListener("click", (e) => {
      e.stopPropagation();
      addToCart(el.dataset.add, 1);
    }),
  );
  container.querySelectorAll("[data-buynow]").forEach((el) =>
    el.addEventListener("click", (e) => {
      e.stopPropagation();
      openCheckout(
        [{ product: findProduct(el.dataset.buynow), qty: 1 }],
        "buyNow",
      );
    }),
  );
}

// ===================================================================
// WISHLIST
// ===================================================================
function toggleWishlist(id) {
  if (!user) {
    renderLoginForm();
    show("authModal");
    return;
  }
  id = Number(id);
  wishlist = wishlist.includes(id)
    ? wishlist.filter((x) => x !== id)
    : [...wishlist, id];
  saveWishlist();
  refreshCurrentGrid();
  updateWishCount();
}

function updateWishCount() {
  const el = $("wishCount");
  el.textContent = wishlist.length;
  wishlist.length ? el.classList.remove("hidden") : el.classList.add("hidden");
}

function refreshCurrentGrid() {
  if (view.mode === "products") renderProductsView();
  else renderHome();
}

// ===================================================================
// PRODUCT DETAIL MODAL
// ===================================================================
let detailState = { color: null, size: null, qty: 1, imgIndex: 0 };

function openDetail(id) {
  const p = findProduct(id);
  if (!p) return;
  detailState = {
    color: p.colors ? p.colors[0] : null,
    size: p.sizes ? p.sizes[0] : null,
    qty: 1,
    imgIndex: 0,
  };
  renderDetail(p);
  show("detailModal");
}

const REVIEWER_NAMES = [
  "Sarah M.",
  "James K.",
  "Priya R.",
  "David L.",
  "Amara O.",
  "Tom H.",
  "Elena V.",
  "Chidi N.",
];
const REVIEW_TEXTS = [
  "Exactly as described and arrived fast. Really happy with this purchase.",
  "Good quality for the price. Would recommend to a friend.",
  "Works great, though the packaging could be better.",
  "Exceeded my expectations. Will definitely buy from this brand again.",
  "Solid product overall, does what it says.",
  "Great value — better than I expected for this price range.",
];

function generateReviews(p) {
  const count = 3;
  const reviews = [];
  for (let i = 0; i < count; i++) {
    const seed = p.id * 31 + i * 7;
    const name =
      REVIEWER_NAMES[Math.floor(seeded(seed) * REVIEWER_NAMES.length)];
    const text =
      REVIEW_TEXTS[Math.floor(seeded(seed + 3) * REVIEW_TEXTS.length)];
    const rating = Math.max(
      3,
      Math.min(5, Math.round(p.rating + (seeded(seed + 5) - 0.5) * 1.5)),
    );
    const daysAgo = Math.floor(seeded(seed + 9) * 90) + 1;
    const date = new Date(Date.now() - daysAgo * 86400000).toLocaleDateString(
      "en-US",
      { month: "short", day: "numeric", year: "numeric" },
    );
    reviews.push({ name, text, rating, date });
  }
  return reviews;
}

function renderRelatedCards(p) {
  const related = PRODUCTS.filter(
    (x) => x.category === p.category && x.id !== p.id,
  ).slice(0, 4);
  if (!related.length) return `<p class="empty-state">No related products.</p>`;
  return related
    .map(
      (r) => `
    <div class="product-card" data-related="${r.id}">
      <div class="product-image-wrap">
        ${r.discountPct ? `<span class="badge-tag">SAVE ${r.discountPct}%</span>` : ""}
        <img src="${r.images[0]}" alt="${r.name}" loading="lazy" onerror="this.src='https://loremflickr.com/500/500/product'" />
      </div>
      <div class="product-info">
        <div class="product-brand">${r.brand}</div>
        <div class="product-name">${r.name}</div>
        <div class="product-rating">${starRow(r.rating)} (${r.reviews})</div>
        <div class="product-price-row">
          <span class="price-current">${money(r.discountPrice ?? r.price)}</span>
          ${r.discountPrice ? `<span class="price-original">${money(r.price)}</span>` : ""}
        </div>
        <button class="btn-primary add-cart-btn" data-related-add="${r.id}">Add to Cart</button>
      </div>
    </div>`,
    )
    .join("");
}

function renderDetail(p) {
  $("detailBody").innerHTML = `
    <div class="detail-body">
      <div class="detail-gallery">
        <img class="detail-main-img" id="detailMainImg" src="${p.images[detailState.imgIndex]}" alt="${p.name}" />
        <div class="detail-thumbs">
          ${p.images.map((img, i) => `<img src="${img}" class="${i === detailState.imgIndex ? "selected" : ""}" data-i="${i}" alt="thumbnail ${i + 1}" />`).join("")}
        </div>
      </div>
      <div class="detail-info">
        <div class="product-brand">${p.brand}</div>
        <h2>${p.name}</h2>
        <div class="product-rating">${starRow(p.rating)} ${p.rating} (${p.reviews} reviews)</div>
        <div class="detail-price">
          <span class="price-current">${money(p.discountPrice ?? p.price)}</span>
          ${p.discountPrice ? `<span class="price-original">${money(p.price)}</span><span class="detail-discount">-${p.discountPct}%</span>` : ""}
        </div>
        ${p.colors ? `<div>Color</div><div class="qv-colors">${p.colors.map((c) => `<button class="swatch ${c === detailState.color ? "selected" : ""}" style="background:${c}" data-color="${c}"></button>`).join("")}</div>` : ""}
        ${p.sizes ? `<div>Size</div><div class="qv-sizes">${p.sizes.map((s) => `<button class="size-opt ${s === detailState.size ? "selected" : ""}" data-size="${s}">${s}</button>`).join("")}</div>` : ""}
        <div class="qty-row"><button id="dMinus">−</button><span id="dQtyLabel">${detailState.qty}</span><button id="dPlus">+</button></div>
        <div class="detail-actions">
          <button class="btn-primary" id="detailAddToCart" ${p.stock === 0 ? "disabled" : ""}>Add to Cart</button>
          <button class="btn-secondary" id="detailBuyNow" ${p.stock === 0 ? "disabled" : ""}>Buy Now</button>
        </div>
        <div class="share-row">
          <span>Share:</span>
          <button id="shareCopy" title="Copy link">🔗</button>
          <button id="shareFb" title="Share on Facebook">📘</button>
          <button id="shareTw" title="Share on Twitter">🐦</button>
        </div>
      </div>
    </div>

    <div class="detail-tabs">
      <div class="tab-nav">
        <button class="tab-btn active" data-tab="desc">Description</button>
        <button class="tab-btn" data-tab="specs">Additional Information</button>
        <button class="tab-btn" data-tab="reviews">Reviews (${p.reviews})</button>
      </div>
      <div class="tab-panel" data-panel="desc">
        <p>${p.desc}</p>
      </div>
      <div class="tab-panel hidden" data-panel="specs">
        <div class="spec-list">${Object.entries(p.specs)
          .map(([k, v]) => `<div><span>${k}</span><span>${v}</span></div>`)
          .join("")}</div>
      </div>
      <div class="tab-panel hidden" data-panel="reviews">
        <div class="reviews-summary">${starRow(p.rating)} <strong>${p.rating}</strong> out of 5 · ${p.reviews} reviews</div>
        <div class="reviews-list">${generateReviews(p)
          .map(
            (r) => `
          <div class="review-item">
            <div class="review-head"><strong>${r.name}</strong> ${starRow(r.rating)} <span class="review-date">${r.date}</span></div>
            <p>${r.text}</p>
          </div>`,
          )
          .join("")}</div>
      </div>
    </div>

    <div class="related-section">
      <h3>You May Also Like</h3>
      <div class="product-grid">${renderRelatedCards(p)}</div>
    </div>
  `;

  $("detailBody")
    .querySelectorAll("[data-i]")
    .forEach((t) =>
      t.addEventListener("click", () => {
        detailState.imgIndex = Number(t.dataset.i);
        renderDetail(p);
      }),
    );
  $("detailBody")
    .querySelectorAll("[data-color]")
    .forEach((b) =>
      b.addEventListener("click", () => {
        detailState.color = b.dataset.color;
        renderDetail(p);
      }),
    );
  $("detailBody")
    .querySelectorAll("[data-size]")
    .forEach((b) =>
      b.addEventListener("click", () => {
        detailState.size = b.dataset.size;
        renderDetail(p);
      }),
    );

  $("detailBody")
    .querySelectorAll(".tab-btn")
    .forEach((btn) => {
      btn.addEventListener("click", () => {
        $("detailBody")
          .querySelectorAll(".tab-btn")
          .forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");
        $("detailBody")
          .querySelectorAll(".tab-panel")
          .forEach((panel) => {
            panel.classList.toggle(
              "hidden",
              panel.dataset.panel !== btn.dataset.tab,
            );
          });
      });
    });

  $("detailBody")
    .querySelectorAll("[data-related]")
    .forEach((el) => {
      el.addEventListener("click", () => openDetail(el.dataset.related));
    });
  $("detailBody")
    .querySelectorAll("[data-related-add]")
    .forEach((el) => {
      el.addEventListener("click", (e) => {
        e.stopPropagation();
        addToCart(el.dataset.relatedAdd, 1);
      });
    });

  const shareUrl = `${location.origin}${location.pathname}#product-${p.id}`;
  const copyBtn = document.getElementById("shareCopy");
  if (copyBtn)
    copyBtn.addEventListener("click", () => {
      navigator.clipboard
        ?.writeText(shareUrl)
        .then(() => alert("Link copied to clipboard!"));
    });
  const fbBtn = document.getElementById("shareFb");
  if (fbBtn)
    fbBtn.addEventListener("click", () =>
      window.open(
        `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
        "_blank",
      ),
    );
  const twBtn = document.getElementById("shareTw");
  if (twBtn)
    twBtn.addEventListener("click", () =>
      window.open(
        `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(p.name)}`,
        "_blank",
      ),
    );

  const minus = document.getElementById("dMinus"),
    plus = document.getElementById("dPlus");
  if (minus)
    minus.addEventListener("click", () => {
      if (detailState.qty > 1) detailState.qty--;
      document.getElementById("dQtyLabel").textContent = detailState.qty;
    });
  if (plus)
    plus.addEventListener("click", () => {
      detailState.qty++;
      document.getElementById("dQtyLabel").textContent = detailState.qty;
    });
  document.getElementById("detailAddToCart").addEventListener("click", () => {
    addToCart(p.id, detailState.qty, detailState.color, detailState.size);
    hide("detailModal");
  });
  document.getElementById("detailBuyNow").addEventListener("click", () => {
    hide("detailModal");
    openCheckout(
      [
        {
          product: p,
          qty: detailState.qty,
          color: detailState.color,
          size: detailState.size,
        },
      ],
      "buyNow",
    );
  });
}

// ===================================================================
// CART
// ===================================================================
async function loadCart() {
  const token = localStorage.getItem("sw_token");
  if (!user || !token) {
    cart = [];
    renderCartBadge();
    return;
  }
  const res = await fetch("/api/cart", { headers: { ...authHeader() } });
  if (!res.ok) {
    cart = [];
    return;
  }
  const data = await res.json();
  cart = data.items || [];
  renderCartBadge();
}

async function addToCart(id, qty) {
  if (!user) {
    renderLoginForm();
    show("authModal");
    return;
  }
  const res = await fetch("/api/cart/add", {
    method: "POST",
    headers: { "Content-Type": "application/json", ...authHeader() },
    body: JSON.stringify({ productId: Number(id), quantity: qty }),
  });
  if (!res.ok) return showToast("Couldn't add to cart.", "error");
  cart = (await res.json()).items;
  renderCartBadge();
  showToast("Added to cart!");
}

async function updateCartQty(cartItemId, newQty) {
  if (newQty <= 0) return removeCartItem(cartItemId);
  const res = await fetch(`/api/cart/update/${cartItemId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json", ...authHeader() },
    body: JSON.stringify({ quantity: newQty }),
  });
  if (!res.ok) return showToast("Couldn't update quantity.", "error");
  cart = (await res.json()).items;
  renderCartDrawer();
}

async function removeCartItem(cartItemId) {
  const res = await fetch(`/api/cart/remove/${cartItemId}`, {
    method: "DELETE",
    headers: { ...authHeader() },
  });
  if (!res.ok) return alert("Couldn't remove item.");
  cart = (await res.json()).items;
  renderCartDrawer();
}

function renderCartBadge() {
  $("cartCount").textContent = cart.reduce((s, c) => s + c.quantity, 0);
}

function cartSubtotal() {
  return cart.reduce((sum, item) => {
    const p = item.product;
    return p ? sum + (p.discountPrice ?? p.price) * item.quantity : sum;
  }, 0);
}

function renderCartDrawer() {
  renderCartBadge();
  $("drawerCount").textContent = cart.length
    ? `(${cart.reduce((s, c) => s + c.quantity, 0)})`
    : "";
  const container = $("cartItems");
  if (!cart.length) {
    container.innerHTML = `<p class="empty-state">Your cart is empty.<br><button class="btn-primary" id="emptyCartShop">Continue Shopping</button></p>`;
    document.getElementById("emptyCartShop").addEventListener("click", () => {
      hide("cartDrawer");
      hide("drawerOverlay");
      goHome();
    });
  } else {
    container.innerHTML = cart
      .map((item) => {
        const p = item.product;
        return `
        <div class="cart-item">
          <img src="${p.imageUrl}" alt="${p.name}" />
          <div class="cart-item-info">
            <div class="cart-item-name">${p.name}</div>
            <div class="cart-item-price">${money(p.discountPrice ?? p.price)}</div>
            <div class="cart-qty"><button data-minus="${item.id}">−</button><span>${item.quantity}</span><button data-plus="${item.id}">+</button></div>
          </div>
          <button class="remove-item" data-remove="${item.id}">Remove</button>
        </div>`;
      })
      .join("");
    container.querySelectorAll("[data-minus]").forEach((b) =>
      b.addEventListener("click", () => {
        const item = cart.find((c) => c.id === Number(b.dataset.minus));
        updateCartQty(item.id, item.quantity - 1);
      }),
    );
    container.querySelectorAll("[data-plus]").forEach((b) =>
      b.addEventListener("click", () => {
        const item = cart.find((c) => c.id === Number(b.dataset.plus));
        updateCartQty(item.id, item.quantity + 1);
      }),
    );
    container
      .querySelectorAll("[data-remove]")
      .forEach((b) =>
        b.addEventListener("click", () =>
          removeCartItem(Number(b.dataset.remove)),
        ),
      );
  }
  $("cartSubtotal").textContent = money(cartSubtotal());
}

// ===================================================================
// WISHLIST DRAWER
// ===================================================================
async function renderDashboard() {
  const container = $("dashboardModalBody");
  container.innerHTML = `<h2>My Account</h2><p class="subtitle">Loading...</p>`;

  const res = await fetch("/api/orders", { headers: { ...authHeader() } });
  const orders = res.ok ? await res.json() : [];
  const totalSpent = orders.reduce((sum, o) => sum + o.totalAmount, 0);

  container.innerHTML = `
    <h2>My Account</h2>
    <p class="subtitle">Welcome back, ${user.name}</p>
    <div class="order-summary-box" style="margin-top:16px;">
      <div style="display:flex;justify-content:space-between;padding:6px 0;"><span>Name</span><span>${user.name}</span></div>
      <div style="display:flex;justify-content:space-between;padding:6px 0;"><span>Email</span><span>${user.email}</span></div>
      <div style="display:flex;justify-content:space-between;padding:6px 0;"><span>Total Orders</span><span>${orders.length}</span></div>
      <div style="display:flex;justify-content:space-between;padding:6px 0;font-weight:700;"><span>Total Spent</span><span>${money(totalSpent)}</span></div>
    </div>
    <button class="btn-primary full-width" id="dashToOrders" style="margin-top:16px;">View Order History</button>
    <button class="btn-outline full-width" id="dashToWishlist" style="margin-top:8px;">View Wishlist</button>`;

  $("dashToOrders").addEventListener("click", () => {
    hide("dashboardModal");
    renderOrderHistory();
    show("ordersModal");
  });
  $("dashToWishlist").addEventListener("click", () => {
    hide("dashboardModal");
    renderWishDrawer();
    show("wishDrawer");
    show("wishOverlay");
  });
}
async function renderOrderHistory() {
  const container = $("ordersModalBody");
  container.innerHTML = `<h2>Order History</h2><p class="subtitle">Loading your orders...</p>`;

  const res = await fetch("/api/orders", { headers: { ...authHeader() } });
  if (!res.ok) {
    container.innerHTML = `<h2>Order History</h2><p class="empty-state">Couldn't load orders.</p>`;
    return;
  }
  const orders = await res.json();

  if (!orders.length) {
    container.innerHTML = `<h2>Order History</h2><p class="empty-state">You haven't placed any orders yet.</p>`;
    return;
  }

  container.innerHTML = `
    <h2>Order History</h2>
    <div class="order-summary-box order-history-list">
      ${orders
        .map(
          (o) => `
        <div class="order-history-item" style="border-bottom:1px solid #eee;padding:12px 0;">
          <div style="display:flex;justify-content:space-between;font-weight:600;">
            <span>Order #${o.id}</span><span>${o.status}</span>
          </div>
          <div style="color:#888;font-size:13px;margin:4px 0;">${new Date(o.createdAt).toLocaleDateString()}</div>
          ${o.items.map((i) => `<div style="display:flex;justify-content:space-between;font-size:14px;"><span>${i.product.name} × ${i.quantity}</span><span>${money(i.priceAtPurchase * i.quantity)}</span></div>`).join("")}
          <div style="display:flex;justify-content:space-between;font-weight:700;margin-top:6px;">
            <span>Total</span><span>${money(o.totalAmount)}</span>
          </div>
        </div>`,
        )
        .join("")}
    </div>`;
}
function renderWishDrawer() {
  const container = $("wishItems");
  const items = PRODUCTS.filter((p) => wishlist.includes(p.id));
  if (!items.length) {
    container.innerHTML = `<p class="empty-state">Your wishlist is empty.</p>`;
  } else {
    container.innerHTML = items
      .map(
        (p) => `
      <div class="cart-item">
        <img src="${p.images[0]}" alt="${p.name}" />
        <div class="cart-item-info">
          <div class="cart-item-name">${p.name}</div>
          <div class="cart-item-price">${money(p.discountPrice ?? p.price)}</div>
          <button class="btn-primary" style="margin-top:6px;padding:6px 10px;font-size:12px;" data-wadd="${p.id}">Add to Cart</button>
        </div>
        <button class="remove-item" data-wremove="${p.id}">Remove</button>
      </div>`,
      )
      .join("");
    container
      .querySelectorAll("[data-wadd]")
      .forEach((b) =>
        b.addEventListener("click", () => addToCart(b.dataset.wadd, 1)),
      );
    container.querySelectorAll("[data-wremove]").forEach((b) =>
      b.addEventListener("click", () => {
        toggleWishlist(b.dataset.wremove);
        renderWishDrawer();
      }),
    );
  }
}

// ===================================================================
// AUTH (localStorage mock)
// ===================================================================
function updateAccountUI() {
  $("accountLabel").textContent = user ? user.name.split(" ")[0] : "Sign In";
  $("registerBtn").style.display = user ? "none" : "inline";
  $("accountDivider").style.display = user ? "none" : "inline";
}

function authError(msg) {
  const el = $("authErrorMsg");
  if (el) {
    el.textContent = msg;
    el.classList.remove("hidden");
  }
}

function authSuccess(msg) {
  const el = $("authSuccessMsg");
  if (el) {
    el.textContent = msg;
    el.classList.remove("hidden");
  }
}

// After a successful login, resume whatever the user was trying to do
// (Buy Now opens checkout directly; Add to Cart just needs the modal closed).
function onLoginSuccess() {
  hide("authModal");
  updateAccountUI();
  loadCart();
  if (pendingCheckoutItems) {
    const items = pendingCheckoutItems;
    const mode = pendingCheckoutMode;
    pendingCheckoutItems = null;
    openCheckout(items, mode);
  }
}

function renderLoginForm() {
  $("authModalBody").innerHTML = `
    <h2>Welcome Back</h2><p class="subtitle">Sign in to your Marketto account</p>
    <div id="authErrorMsg" class="form-error hidden"></div>
    <div id="authSuccessMsg" class="form-success hidden"></div>
    <label>Email</label><input type="email" id="loginEmail" placeholder="Eyosiyas@gmail.com" />
    <label>Password</label><input type="password" id="loginPassword" placeholder="••••••••" />
    <button class="btn-primary full-width" id="loginSubmit" style="margin-top:16px;">Sign In</button>
    <p class="switch-auth">Don't have an account? <a href="#" id="toRegister">Register</a></p>`;
  $("loginSubmit").addEventListener("click", async () => {
    const email = $("loginEmail").value.trim();
    const password = $("loginPassword").value;
    if (!email || !password)
      return authError("Please enter both email and password.");

    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    if (!res.ok) return authError("Invalid email or password.");

    const data = await res.json(); // { token, fullName, email, role }
    localStorage.setItem("sw_token", data.token);
    user = { name: data.fullName, email: data.email };
    saveUser();
    onLoginSuccess();
  });
  $("toRegister").addEventListener("click", (e) => {
    e.preventDefault();
    renderRegisterForm();
  });
}

function renderRegisterForm() {
  $("authModalBody").innerHTML = `
    <h2>Create Account</h2><p class="subtitle">Join Marketto and start shopping</p>
    <div id="authErrorMsg" class="form-error hidden"></div>
    <label>Full Name</label><input type="text" id="regName" placeholder="i.e Eyosiyas Desta" />
    <label>Email</label><input type="email" id="regEmail" placeholder="you@example.com" />
    <label>Password</label><input type="password" id="regPassword" placeholder="At least 6 characters" />
    <button class="btn-primary full-width" id="regSubmit" style="margin-top:16px;">Create Account</button>
    <p class="switch-auth">Already have an account? <a href="#" id="toLogin">Sign In</a></p>`;
  $("regSubmit").addEventListener("click", async () => {
    const name = $("regName").value.trim();
    const email = $("regEmail").value.trim();
    const password = $("regPassword").value;
    if (!name || !email)
      return authError("Please fill in your name and email.");
    if (password.length < 6)
      return authError("Password must be at least 6 characters.");

    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ fullName: name, email, password }), // note: fullName, not name
    });
    if (!res.ok) {
      const err = await res.text().catch(() => "");
      return authError(
        err || "Registration failed. Email may already be in use.",
      );
    }
    renderLoginForm();
    authSuccess("Account created! Please sign in.");
  });
  $("toLogin").addEventListener("click", (e) => {
    e.preventDefault();
    renderLoginForm();
  });
}

// ===================================================================
// CHECKOUT / BUY NOW FLOW
// ===================================================================
let checkoutItems = [];
let pendingCheckoutItems = null;
let checkoutMode = "cart"; // "cart" or "buyNow"
let pendingCheckoutMode = "cart";

function openCheckout(items, mode = "cart") {
  if (!user) {
    pendingCheckoutItems = items;
    pendingCheckoutMode = mode;
    renderLoginForm();
    show("authModal");
    return;
  }
  checkoutItems = items;
  checkoutMode = mode;
  renderCheckoutForm();
  show("checkoutModal");
}

function checkoutTotals() {
  const subtotal = checkoutItems.reduce(
    (s, i) => s + (i.product.discountPrice ?? i.product.price) * i.qty,
    0,
  );
  const delivery = subtotal > 75 ? 0 : 6.99;
  const discount = 0;
  return {
    subtotal,
    delivery,
    discount,
    total: subtotal + delivery - discount,
  };
}

function renderCheckoutForm() {
  const t = checkoutTotals();
  $("checkoutBody").innerHTML = `
    <div class="checkout-step-title">Checkout</div>
    <div class="order-summary-box">
      ${checkoutItems
        .map(
          (i) => `
        <div class="order-line">
          <img src="${i.product.images[0]}" alt="${i.product.name}" />
          <div class="order-line-info">${i.product.name} × ${i.qty}${i.size ? " · Size " + i.size : ""}</div>
          <div>${money((i.product.discountPrice ?? i.product.price) * i.qty)}</div>
        </div>`,
        )
        .join("")}
    </div>
    <label>Full Name</label><input type="text" id="ckName" placeholder="Eyosiyas Desta" /><div class="field-error" id="errName">Full name is required.</div>
    <label>Phone Number</label><input type="tel" id="ckPhone" placeholder="+251 900 000 000" /><div class="field-error" id="errPhone">A valid phone number is required.</div>
    <label>Email</label><input type="email" id="ckEmail" placeholder="you@example.com" /><div class="field-error" id="errEmail">A valid email is required.</div>
    <label>Delivery Address</label><input type="text" id="ckAddress" placeholder="Street address" /><div class="field-error" id="errAddress">Delivery address is required.</div>
    <label>City</label><input type="text" id="ckCity" placeholder="City" /><div class="field-error" id="errCity">City is required.</div>

    <div class="order-summary-box order-totals" style="margin-top:16px;">
      <div><span>Subtotal</span><span>${money(t.subtotal)}</span></div>
      <div><span>Delivery</span><span>${t.delivery === 0 ? "Free" : money(t.delivery)}</span></div>
      <div class="grand-total"><span>Total</span><span>${money(t.total)}</span></div>
    </div>
    <button class="btn-primary full-width" id="placeOrderBtn" style="margin-top:16px;">Place Order</button>`;

  $("placeOrderBtn").addEventListener("click", submitOrder);
}

async function submitOrder() {
  const fields = {
    ckName: { err: "errName", test: (v) => v.trim().length > 1 },
    ckPhone: {
      err: "errPhone",
      test: (v) => /^[+\d][\d\s-]{6,}$/.test(v.trim()),
    },
    ckEmail: { err: "errEmail", test: (v) => /^\S+@\S+\.\S+$/.test(v.trim()) },
    ckAddress: { err: "errAddress", test: (v) => v.trim().length > 3 },
    ckCity: { err: "errCity", test: (v) => v.trim().length > 1 },
  };
  let valid = true;
  const values = {};
  Object.entries(fields).forEach(([id, rule]) => {
    const el = $(id);
    const ok = rule.test(el.value);
    values[id] = el.value.trim();
    el.classList.toggle("invalid", !ok);
    $(rule.err).classList.toggle("show", !ok);
    if (!ok) valid = false;
  });
  if (!valid) return;

  const shippingAddress = `${values.ckAddress}, ${values.ckCity}`;
  const btn = $("placeOrderBtn");
  btn.disabled = true;
  btn.textContent = "Placing order...";

  try {
    let order;
    if (checkoutMode === "buyNow") {
      const item = checkoutItems[0];
      const res = await fetch("/api/orders/buy-now", {
        method: "POST",
        headers: { "Content-Type": "application/json", ...authHeader() },
        body: JSON.stringify({
          productId: item.product.id,
          quantity: item.qty,
          shippingAddress,
        }),
      });
      if (!res.ok) throw new Error(await res.text());
      order = await res.json();
    } else {
      const res = await fetch("/api/orders/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json", ...authHeader() },
        body: JSON.stringify({ shippingAddress }),
      });
      if (!res.ok) throw new Error(await res.text());
      order = await res.json();
      await loadCart(); // cart is now empty server-side
    }
    renderOrderConfirmation(order, values);
  } catch (err) {
    btn.disabled = false;
    btn.textContent = "Place Order";
    showToast("Order failed: " + (err.message || "please try again."), "error");
  }
}

function renderOrderConfirmation(order, values) {
  $("checkoutBody").innerHTML = `
    <div class="confirmation">
      <div class="check-icon">✓</div>
      <h2>Order Confirmed!</h2>
      <p class="subtitle">Thanks, ${values.ckName.split(" ")[0]} — your order is on its way.</p>
      <div class="confirmation-details">
        <div><span>Order Number</span><span class="order-number">#${order.id}</span></div>
        ${order.items.map((i) => `<div><span>${i.product.name} × ${i.quantity}</span><span>${money(i.priceAtPurchase * i.quantity)}</span></div>`).join("")}
        <div><span>Delivery to</span><span>${order.shippingAddress}</span></div>
        <div><span>Total Paid</span><span>${money(order.totalAmount)}</span></div>
        <div><span>Estimated Delivery</span><span>3–5 business days</span></div>
      </div>
      <button class="btn-primary full-width" id="continueShoppingBtn">Continue Shopping</button>
    </div>`;
  $("continueShoppingBtn").addEventListener("click", () => {
    hide("checkoutModal");
    goHome();
    refreshCurrentGrid();
  });
}

// ===================================================================
// HERO SLIDESHOW
// ===================================================================
let heroIndex = 0,
  heroTimer = null;

function renderHeroDots() {
  const slides = document.querySelectorAll(".hero-slide");
  $("heroDots").innerHTML = Array.from(slides)
    .map(
      (_, i) =>
        `<button class="hero-dot ${i === heroIndex ? "active" : ""}" data-i="${i}"></button>`,
    )
    .join("");
  $("heroDots")
    .querySelectorAll("button")
    .forEach((b) =>
      b.addEventListener("click", () => goToSlide(Number(b.dataset.i))),
    );
}
function goToSlide(i) {
  const slides = document.querySelectorAll(".hero-slide");
  slides[heroIndex].classList.remove("active");
  heroIndex = (i + slides.length) % slides.length;
  slides[heroIndex].classList.add("active");
  renderHeroDots();
  resetHeroTimer();
}
function resetHeroTimer() {
  clearInterval(heroTimer);
  heroTimer = setInterval(() => goToSlide(heroIndex + 1), 5000);
}
function renderAddresses() {
  const container = $("addressesList");
  if (!container) return;

  const address = user?.address || localStorage.getItem("sw_address") || "";

  container.innerHTML = `
    <form id="addressForm" style="display: flex; flex-direction: column; gap: 12px;">
      <label style="font-size: 13px; font-weight: 600; color: var(--muted);">Shipping Address</label>
      <textarea id="addressInput" rows="3" placeholder="Enter street, city, state, zip..." 
        style="width: 100%; padding: 10px; border: 1px solid var(--border); border-radius: 6px; font-family: inherit; resize: vertical;">${address}</textarea>
      <button type="submit" class="btn-primary" style="align-self: flex-end;">Save Address</button>
    </form>
  `;

  $("addressForm").addEventListener("submit", (e) => {
    e.preventDefault();
    const newAddress = $("addressInput").value.trim();

    // Save locally
    localStorage.setItem("sw_address", newAddress);

    // Sync to active user object if logged in
    if (user) {
      user.address = newAddress;
      saveUser();
    }

    showToast("Address saved successfully!");
  });
}

// ===================================================================
// INIT
// ===================================================================
document.addEventListener("DOMContentLoaded", async () => {
  await loadProducts();
  buildCategoriesFromProducts();
  await loadCart();
  renderCategoryNav();
  renderMobileMenu();
  renderHome();
  renderCartBadge();
  updateWishCount();
  updateAccountUI();
  loadCart();
  renderHeroDots();
  resetHeroTimer();

  $("heroPrev").addEventListener("click", () => goToSlide(heroIndex - 1));
  $("heroNext").addEventListener("click", () => goToSlide(heroIndex + 1));
  $("logoHome").addEventListener("click", (e) => {
    e.preventDefault();
    goHome();
  });
  $("orderHistoryLink").addEventListener("click", (e) => {
    e.preventDefault();
    if (!user) {
      renderLoginForm();
      show("authModal");
      return;
    }
    renderOrderHistory();
    show("ordersModal");
  });
  $("dashboardLink").addEventListener("click", (e) => {
    e.preventDefault();
    if (!user) {
      renderLoginForm();
      show("authModal");
      return;
    }
    renderDashboard();
    show("dashboardModal");
  });
  $("wishlistLink").addEventListener("click", (e) => {
    e.preventDefault();
    if (!user) {
      renderLoginForm();
      show("authModal");
      return;
    }
    renderWishDrawer();
    show("wishDrawer");
    show("wishOverlay");
  });
  $("addressesLink").addEventListener("click", (e) => {
    e.preventDefault();
    if (!user) {
      renderLoginForm();
      show("authModal");
      return;
    }
    renderAddresses();
    show("addressesModal");
  });
  document.querySelectorAll("[data-close]").forEach((btn) =>
    btn.addEventListener("click", () => {
      hide(btn.dataset.close);
      hide("drawerOverlay"); // also close the backdrop
      hide("wishOverlay"); // and the wishlist one, same issue likely applies there
    }),
  );

  $("mobileMenuBtn").addEventListener("click", () => show("mobileMenu"));

  $("accountBtn").addEventListener("click", async () => {
    if (user) {
      const confirmed = await showConfirm(`Log out of ${user.email}?`);
      if (confirmed) {
        user = null;
        saveUser();
        updateAccountUI();
      }
    } else {
      renderLoginForm();
      show("authModal");
    }
  });
  $("registerBtn").addEventListener("click", () => {
    renderRegisterForm();
    show("authModal");
  });

  $("wishlistBtn").addEventListener("click", () => {
    if (!user) {
      renderLoginForm();
      show("authModal");
      return;
    }
    renderWishDrawer();
    show("wishDrawer");
    show("wishOverlay");
  });
  $("wishOverlay").addEventListener("click", () => {
    hide("wishDrawer");
    hide("wishOverlay");
  });

  $("cartBtn").addEventListener("click", () => {
    renderCartDrawer();
    show("cartDrawer");
    show("drawerOverlay");
  });
  $("drawerOverlay").addEventListener("click", () => {
    hide("cartDrawer");
    hide("drawerOverlay");
  });

  $("checkoutBtn").addEventListener("click", () => {
    if (!cart.length) return;
    const items = cart.map((c) => ({
      product: { ...c.product, images: [c.product.imageUrl] },
      qty: c.quantity,
    }));
    hide("cartDrawer");
    hide("drawerOverlay");
    openCheckout(items, "cart");
  });
  $("newsletterForm").addEventListener("submit", (e) => {
    e.preventDefault();
    const email = $("newsletterEmail").value.trim();
    if (!email) return;
    showToast("Thanks for subscribing!");
    $("newsletterEmail").value = "";
  });

  $("searchBtn").addEventListener("click", runSearch);
  $("searchInput").addEventListener("keydown", (e) => {
    if (e.key === "Enter") runSearch();
  });
  function runSearch() {
    const q = $("searchInput").value.trim();
    if (!q) return;
    openProductsView({});
    filters.query = q;
    currentPage = 1;
    renderProductsView();
  }

  $("sortSelect").addEventListener("change", () => {
    filters.sort = $("sortSelect").value;
    renderProductsView();
  });
  $("gridViewBtn").addEventListener("click", () => {
    viewMode = "grid";
    $("gridViewBtn").classList.add("active");
    $("listViewBtn").classList.remove("active");
    renderProductsView();
  });
  $("listViewBtn").addEventListener("click", () => {
    viewMode = "list";
    $("listViewBtn").classList.add("active");
    $("gridViewBtn").classList.remove("active");
    renderProductsView();
  });
});
