import { CartItem } from "../types";

const CART_KEY = "testshop_cart_v1";
const SESSION_KEY = "testshop_session_v1";

export function loadCartFromStorage(): CartItem[] {
  try {
    const raw = localStorage.getItem(CART_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as CartItem[];
  } catch {
    return [];
  }
}

export function saveCartToStorage(items: CartItem[]) {
  localStorage.setItem(CART_KEY, JSON.stringify(items));
}

export function clearCartStorage() {
  localStorage.removeItem(CART_KEY);
}

export function getSessionId(): string {
  let s = localStorage.getItem(SESSION_KEY);
  if (!s) {
    s = `sess_${Math.random().toString(36).slice(2, 10)}`;
    localStorage.setItem(SESSION_KEY, s);
  }
  return s;
}
