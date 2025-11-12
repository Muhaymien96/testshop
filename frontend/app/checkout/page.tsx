"use client";

import { useState } from "react";
import { loadCartFromStorage, clearCartStorage, getSessionId } from "../../lib/helpers";
import { checkoutAPI } from "../../lib/api";
import { CartItem } from "../../types";
import { useRouter } from "next/navigation";

export default function CheckoutPage() {
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const cart = loadCartFromStorage();
  const total = cart.reduce((s, it) => s + it.qty * Number(it.price || 0), 0);

  async function handleCheckout(e: React.FormEvent) {
    e.preventDefault();
    setProcessing(true);
    setError(null);

    const payload = {
      sessionId: getSessionId(),
      items: cart,
      total,
      billing: {
        name: "Test User",
        email: "qa@example.com"
      },
      paymentMethod: "card_simulated"
    };

    try {
      const res = await checkoutAPI.process(payload);
      // backend returns { success, data }
      const payloadRes = res.data as any;
      const order = payloadRes?.data ?? payloadRes;
      // clear cart on success to simulate order completion
      clearCartStorage();
      // notify other windows/components that cart changed so header badge updates
      try {
        const sid = getSessionId();
        window.dispatchEvent(new CustomEvent("cart:updated", { detail: { sessionId: sid } }));
      } catch {
        // ignore in non-browser environments
      }
      // redirect to confirmation page with order id as query param
      router.push(`/order-confirmation?orderId=${order?.id ?? "simulated"}`);
    } catch (err: any) {
      console.error(err);
      setError(err?.response?.data?.message ?? "Checkout failed");
      setProcessing(false);
    }
  }

  return (
    <section>
      <h1 className="text-2xl font-semibold mb-4">Checkout</h1>

      <div className="bg-white p-6 rounded shadow">
        <p className="mb-4">Order total: <strong>R{total.toFixed(2)}</strong></p>

        {error && <div className="mb-4 text-red-700">{error}</div>}

        <form onSubmit={handleCheckout}>
          <div className="mb-4">
            <label className="block text-sm font-medium">Name</label>
            <input className="mt-1 w-full border rounded p-2" defaultValue="Test User" required />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium">Email</label>
            <input className="mt-1 w-full border rounded p-2" defaultValue="qa@example.com" type="email" required />
          </div>

          <div className="flex gap-2">
            <button
              type="submit"
              disabled={processing || cart.length === 0}
              className="px-4 py-2 bg-indigo-600 text-white rounded disabled:opacity-60"
            >
              {processing ? "Processing…" : "Simulate Payment & Place Order"}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
