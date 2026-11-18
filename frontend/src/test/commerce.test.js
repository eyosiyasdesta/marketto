import { beforeEach, describe, expect, it } from "vitest";
import {
  shippingCost,
  restoreMockState,
  register,
  addToCart,
  checkout,
  getOrders,
  updateProfile,
  products,
} from "../api";

beforeEach(() => restoreMockState({ cart: [], orders: [], accounts: [], user: null }));
describe("Marketto commerce rules", () => {
  it("offers free shipping only over $75", () => {
    expect(shippingCost(75)).toBe(6.95);
    expect(shippingCost(75.01)).toBe(0);
  });
  it("checks out with a shipping address and no payment fields", async () => {
    await register({ name: "Test Shopper", email: "shopper@example.test" });
    await addToCart("2", 1, "M");
    const order = await checkout({
      name: "Test Shopper",
      email: "shopper@example.test",
      street: "10 Sample Street",
      city: "Test City",
      postal: "12345",
      country: "Test Country",
    });
    expect(order.total).toBe(38.95);
    expect(order.status).toBe("Processing");
    expect((await getOrders())[0].id).toBe(order.id);
  });
  it("retains extended profile display name and collection preference", async () => {
    await register({
      name: "Test Shopper",
      email: "profile@example.test",
      displayName: "Alex",
      preferences: "Books",
    });
    const profile = await updateProfile({ displayName: "Lex", preferences: "Home & Living" });
    expect(profile.displayName).toBe("Lex");
    expect(profile.preferences).toBe("Home & Living");
  });
  it("prevents adding sold-out products", async () => {
    const soldOut = products.find((p) => p.id === "6");
    expect(soldOut.stock).toBe(0);
    await expect(addToCart("6")).rejects.toThrow("Not enough stock");
  });
  it("rejects checkout without a complete shipping address", async () => {
    await register({ name: "Test", email: "test@example.test" });
    await addToCart("2", 1, "M");
    await expect(checkout({ name: "Test" })).rejects.toThrow("Complete your shipping address");
  });
});
