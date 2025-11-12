"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { checkoutAPI } from "../lib/api";

export default function OrderConfirmation() {
  const params = useSearchParams();
  const orderId = params.get("orderId");
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!orderId) return setLoading(false);
    checkoutAPI
      .getOrder(orderId)
      .then((r) => {
        const payload = r.data as any;
        const ord = payload?.data ?? payload;
        setOrder(ord);
      })
      .catch(() => setOrder(null))
      .finally(() => setLoading(false));
  }, [orderId]);

  if (loading) return <div>Loading confirmation…</div>;

  return (
    <section>
      <h1 className="text-2xl font-semibold mb-4">Order Confirmation</h1>
      {order ? (
        <div className="bg-white p-6 rounded shadow">
          <p>Order ID: <strong>{String(order.id)}</strong></p>
          <p>Status: <strong>{order.status ?? "simulated"}</strong></p>
          <pre className="mt-4 text-sm bg-slate-50 p-3 rounded">{JSON.stringify(order, null, 2)}</pre>
        </div>
      ) : (
        <div className="bg-white p-6 rounded shadow">No order information available.</div>
      )}
    </section>
  );
}
