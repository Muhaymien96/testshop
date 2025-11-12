"use client";

import { useEffect, useState } from "react";
import { adminAPI } from "../lib/api";

export default function AdminDashboard() {
  const [metrics, setMetrics] = useState<any>(null);
  const [docs, setDocs] = useState<any>(null);

  useEffect(() => {
    adminAPI.getMetrics().then((r) => setMetrics(r.data)).catch(() => setMetrics(null));
    adminAPI.getDocs().then((r) => setDocs(r.data)).catch(() => setDocs(null));
  }, []);

  return (
    <section>
      <h1 className="text-2xl font-semibold mb-4">Admin</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white p-4 rounded shadow">
          <h2 className="font-medium mb-2">Metrics</h2>
          <pre className="text-sm bg-slate-50 p-3 rounded">{JSON.stringify(metrics ?? { note: "no data" }, null, 2)}</pre>
        </div>

        <div className="bg-white p-4 rounded shadow">
          <h2 className="font-medium mb-2">Docs</h2>
          <pre className="text-sm bg-slate-50 p-3 rounded">{JSON.stringify(docs ?? { note: "no docs" }, null, 2)}</pre>
        </div>
      </div>
    </section>
  );
}
