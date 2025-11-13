import React, { Suspense } from "react";
import OrderConfirmation from "../../components/OrderConfirmation";

export const metadata = {
  title: "Order Confirmation — Test Shop",
  description: "Displays simulated order confirmation for QA testing.",
};

export default function OrderConfirmationPage() {
  return (
    <Suspense fallback={<div>Loading confirmation…</div>}>
      <OrderConfirmation />
    </Suspense>
  );
}
