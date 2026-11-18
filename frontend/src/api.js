const token = () =>
  typeof localStorage === "undefined" ? null : localStorage.getItem("sw_token");
let productCache = [];

async function request(path, options = {}) {
  const headers = {
    "Content-Type": "application/json",
    ...(token() ? { Authorization: `Bearer ${token()}` } : {}),
    ...options.headers,
  };
  const response = await fetch(path, { ...options, headers });
  const type = response.headers.get("content-type") || "";
  const data = type.includes("application/json")
    ? await response.json()
    : await response.text();
  if (!response.ok)
    throw new Error(
      typeof data === "string"
        ? data
        : data?.message || `Request failed (${response.status})`,
    );
  return data;
}

export const categories = [
  "Electronics",
  "Clothing",
  "Home & Living",
  "Books",
  "Accessories",
];

export const heroImages = ["/marketto-hero.png", "/marketto-electronics.png"];
const fallbackImages = {
  watch:
    "https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=800&auto=format&fit=crop&q=80",
  speaker:
    "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=800&auto=format&fit=crop&q=80",
  phone:
    "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&auto=format&fit=crop&q=80",
  headphone:
    "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80",
  tracker:
    "https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?w=800&auto=format&fit=crop&q=80",
  keyboard:
    "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800&auto=format&fit=crop&q=80",
  tee: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&auto=format&fit=crop&q=80",
  sneaker:
    "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=800&auto=format&fit=crop&q=80",
  coffee:
    "https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?w=800&auto=format&fit=crop&q=80",
  vase: "https://images.unsplash.com/photo-1581783342308-f792dbdd27c5?w=800&auto=format&fit=crop&q=80",
  book: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=800&auto=format&fit=crop&q=80",
  bag: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&auto=format&fit=crop&q=80",
};
const imageFor = (name, raw) => {
  if (raw && !/placeholder|loremflickr/i.test(raw)) return raw;
  const n = (name || "").toLowerCase();
  const match = Object.entries(fallbackImages).find(([key]) => n.includes(key));
  return (
    match?.[1] ||
    "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80"
  );
};
const variantName = (variant) =>
  [variant.size, variant.color].filter(Boolean).join(" · ") || "Standard";
function normalizeProduct(p) {
  const variants = (p.variants || []).map((v) => ({
    ...v,
    label: variantName(v),
  }));
  const salePrice = Number(p.discountPrice ?? p.price ?? 0);
  return {
    id: p.id,
    name: p.name,
    brand: p.brand || "Marketto",
    category:
      (p.category?.name || p.category || "General") === "Home"
        ? "Home & Living"
        : p.category?.name || p.category || "General",
    price: salePrice,
    originalPrice: p.discountPrice != null ? Number(p.price) : null,
    rating: Number(p.rating || 0),
    reviews: Number(p.reviewCount || 0),
    image: imageFor(p.name, p.imageUrl),
    stock: Number(p.stock || 0),
    tag:
      p.discountPrice != null
        ? "Good find"
        : Number(p.reviewCount || 0) > 300
          ? "Bestseller"
          : "Everyday essential",
    variants: variants.length ? variants.map((v) => v.label) : ["Standard"],
    variantRecords: variants,
    description: p.description || "Thoughtfully chosen for your everyday.",
  };
}
export async function getProducts() {
  const rows = await request("/api/products");
  productCache = Array.isArray(rows) ? rows.map(normalizeProduct) : [];
  return productCache;
}
export async function getProduct(id) {
  const row = await request(`/api/products/${id}`);
  const product = normalizeProduct(row);
  productCache = [...productCache.filter((p) => p.id !== product.id), product];
  return product;
}
export async function getCategories() {
  const rows = await request("/api/categories");
  return (Array.isArray(rows) ? rows : [])
    .filter((c) => !c.parent)
    .map((c) => (c.name === "Home" ? "Home & Living" : c.name));
}
export async function register({ name, fullName, email, password }) {
  await request("/api/auth/register", {
    method: "POST",
    body: JSON.stringify({ fullName: fullName || name, email, password }),
  });
  return login({ email, password });
}
export async function login({ email, password }) {
  const data = await request("/api/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
  localStorage.setItem("sw_token", data.token);
  return {
    token: data.token,
    name: data.fullName,
    displayName: data.fullName,
    email: data.email,
    role: data.role,
    preferences: "All collections",
  };
}
export async function updateProfile(profile) {
  // The current Spring API has no profile update endpoint; retain editable profile preferences locally.
  const saved = {
    ...JSON.parse(localStorage.getItem("marketto-profile") || "{}"),
    ...profile,
  };
  localStorage.setItem("marketto-profile", JSON.stringify(saved));
  return saved;
}
export function logout() {
  localStorage.removeItem("sw_token");
}
function normalizeCart(cart) {
  return (cart?.items || []).map((item) => {
    const product = normalizeProduct(item.product);
    const variant = item.variant ? variantName(item.variant) : "Standard";
    return {
      id: item.id,
      productId: product.id,
      product,
      quantity: item.quantity,
      variant,
    };
  });
}
export async function getCart() {
  return normalizeCart(await request("/api/cart"));
}
export async function addToCart(productId, quantity = 1, variant = "") {
  let product = productCache.find((p) => String(p.id) === String(productId));
  if (!product) product = await getProduct(productId);
  const selectedVariant = product.variantRecords?.find(
    (v) => v.label === variant,
  );
  const cart = await request("/api/cart/add", {
    method: "POST",
    body: JSON.stringify({
      productId: Number(productId),
      quantity,
      variantId: selectedVariant?.id ?? null,
    }),
  });
  return normalizeCart(cart);
}
export async function updateCart(id, quantity) {
  return normalizeCart(
    await request(`/api/cart/update/${id}`, {
      method: "PUT",
      body: JSON.stringify({ quantity }),
    }),
  );
}
export async function removeFromCart(id) {
  return normalizeCart(
    await request(`/api/cart/remove/${id}`, { method: "DELETE" }),
  );
}
export function shippingCost(subtotal) {
  return subtotal >= 75 ? 0 : 6.99;
}
const shippingText = (address) =>
  typeof address === "string" ? address : JSON.stringify(address);
export async function checkout(address) {
  return request("/api/orders/checkout", {
    method: "POST",
    body: JSON.stringify({ shippingAddress: shippingText(address) }),
  });
}
export async function getOrders() {
  const rows = await request("/api/orders");
  return (Array.isArray(rows) ? rows : []).map((order) => {
    const items = (order.items || []).map((item) => ({
      id: item.id,
      quantity: item.quantity,
      variant: item.variant ? variantName(item.variant) : "Standard",
      product: normalizeProduct(item.product),
    }));
    const total = Number(order.totalAmount || 0);
    const shipping = Number(order.shippingCost || 0);
    let address = {};
    try {
      address = JSON.parse(order.shippingAddress || "{}");
    } catch {
      const [street = "", city = "", country = ""] = String(
        order.shippingAddress || "",
      )
        .split(",")
        .map((s) => s.trim());
      address = { street, city, country };
    }
    return {
      id: `MKT-${String(order.id).padStart(8, "0")}`,
      date: order.createdAt,
      status: order.status,
      items,
      address,
      subtotal: total - shipping,
      shipping,
      total,
    };
  });
}
