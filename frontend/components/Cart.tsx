
"use client";

import { CartItem, Product } from "../types";
import { saveCartToStorage } from "../lib/helpers";
import Link from "next/link";

export default function Cart({
  items,
  onCartChange,
  sessionId,
}: {
  items: (Product & { qty: number })[];
  onCartChange: (items: CartItem[]) => void;
  sessionId?: string;
}) {
  function changeQty(id: string | number, qty: number) {
    const current = items.map((it) => ({ id: it.id, qty: it.qty, price: it.price, title: it.title }));
    const idx = current.findIndex((c) => String(c.id) === String(id));
    if (idx >= 0) {
      current[idx].qty = qty;
      const filtered = current.filter((c) => c.qty > 0);
      saveCartToStorage(filtered);
      onCartChange(filtered);
      window.dispatchEvent(new CustomEvent("cart:updated", { detail: { sessionId } }));
    }
  }

  function removeItem(id: string | number) {
    changeQty(id, 0);
  }

  const total = items.reduce((s, it) => s + it.qty * Number(it.price || 0), 0);

  return (
    <div>
      <ul className="space-y-4">
        {items.map((it) => (
          <li key={String(it.id)} className="bg-white p-4 rounded shadow flex justify-between items-center">
            <div>
              <div className="font-semibold">{it.title}</div>
              <div className="text-sm text-slate-500">R{Number(it.price).toFixed(2)}</div>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="number"
                min={0}
                value={it.qty}
                onChange={(e) => changeQty(it.id, Math.max(0, Number(e.target.value)))}
                className="w-16 p-1 border rounded"
              />
              <button onClick={() => removeItem(it.id)} className="text-sm text-red-600">Remove</button>
            </div>
          </li>
        ))}
      </ul>

      <div className="mt-6 bg-white p-4 rounded shadow">
        <div className="flex justify-between items-center">
          <div className="text-lg font-semibold">Total</div>
          <div className="text-xl font-bold">R{total.toFixed(2)}</div>
        </div>

        <div className="mt-4 flex gap-2">
          <Link href="/checkout" className="px-4 py-2 bg-green-600 text-white rounded">Checkout</Link>
        </div>
      </div>
    </div>
  );
}
