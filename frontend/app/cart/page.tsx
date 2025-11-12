"use client";

import { useEffect, useState } from "react";
import Cart from "../../components/Cart";
import { loadCartFromStorage, saveCartToStorage, getSessionId } from "../../lib/helpers";
import Link from "next/link";
import { Product, CartItem } from "../../types";
import { productsAPI } from "../../lib/api";

export default function CartPage() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [detailedItems, setDetailedItems] = useState<(Product & { qty: number })[]>([]);

  useEffect(() => {
    setCart(loadCartFromStorage());
  }, []);

  useEffect(() => {
    async function fetchDetails() {
      const items: (Product & { qty: number })[] = [];
      for (const item of cart) {
        try {
          const res = await productsAPI.getById(item.id);
          // backend returns { success, data } so unwrap safely
          const payload = res.data as any;
          const prod: Product = Array.isArray(payload)
            ? payload[0]
            : payload?.data
            ? payload.data
            : payload;
          items.push({ ...prod, qty: item.qty });
        } catch (e) {
          // resilient for test scenarios where product might 404
          items.push({ id: item.id, title: "Unknown product", price: item.price ?? 0, qty: item.qty } as any);
        }
      }
      setDetailedItems(items);
    }
    if (cart.length) fetchDetails();
    else setDetailedItems([]);
  }, [cart]);

  function handleChange(newCart: CartItem[]) {
    setCart(newCart);
    saveCartToStorage(newCart);
  }

  return (
    <section>
      <h1 className="text-2xl font-semibold mb-4">Your Cart</h1>
      {detailedItems.length ? (
        <Cart items={detailedItems} onCartChange={handleChange} sessionId={getSessionId()} />
      ) : (
        <div className="bg-white p-6 rounded shadow">
          <p className="mb-4">Your cart is empty.</p>
          <Link href="/" className="text-blue-600 underline">Back to products</Link>
        </div>
      )}

      <div className="mt-6">
        <Link href="/checkout" className="inline-block px-4 py-2 bg-green-600 text-white rounded">
          Proceed to Checkout
        </Link>
      </div>
    </section>
  );
}
