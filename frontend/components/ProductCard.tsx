"use client";

import { Product } from "../types";
import { getSessionId } from "../lib/helpers";
import { saveCartToStorage, loadCartFromStorage } from "../lib/helpers";

export default function ProductCard({ product }: { product: Product }) {
  const price = Number(product.price ?? 0);

  function addToCart() {
    const sessionId = getSessionId();
    const raw = loadCartFromStorage();
    const found = raw.find((r) => String(r.id) === String(product.id));
    if (found) {
      found.qty += 1;
    } else {
      raw.push({ id: product.id, qty: 1, price, title: product.title } as any);
    }
    saveCartToStorage(raw);
    // small window-level event so tests can wait on it
    window.dispatchEvent(new CustomEvent("cart:updated", { detail: { sessionId } }));
  }

  return (
    <article className="group bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden border border-slate-100 hover:border-slate-200 test-data" data-product-id={product.id}>
      {/* Image Container */}
      <div className="relative h-48 bg-gradient-to-br from-slate-50 to-slate-100 overflow-hidden">
        <img 
          src={product.image ?? "/placeholder.png"} 
          alt={product.title} 
          className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>

      {/* Content */}
      <div className="p-5">
        <h3 className="text-lg font-semibold text-slate-900 line-clamp-2 mb-2 group-hover:text-blue-600 transition-colors">
          {product.title}
        </h3>
        <p className="text-sm text-slate-600 line-clamp-2 mb-4 leading-relaxed">
          {product.description}
        </p>

        {/* Footer */}
        <div className="flex items-center justify-between">
          <span className="text-xl font-bold text-blue-600">
            R{price.toFixed(2)}
          </span>
          <button 
            onClick={addToCart} 
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow-md hover:shadow-lg transition-all duration-200 active:scale-95"
            data-testid={`add-${product.id}`}
          >
            <span className="flex items-center gap-1">
              <span>+</span>
              <span className="hidden sm:inline">Add</span>
            </span>
          </button>
        </div>
      </div>
    </article>
  );
}
